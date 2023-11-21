<script setup>

const supa = useSupabaseClient();
const user = useSupabaseUser();

definePageMeta({
    layout: "app-layout"
})

const route = useRoute();

const selected_tab_id = ref(0);
const present_messages = ref([]);
const messageContainer = ref(null);

const community_data = computed(() => {
    
    if(!data)
    {
        return null;
    }

    return toValue(data);

})

function buildChannelTabs() {
    if(!toValue(community_data))
    {
        return [];
    }
    
    // this is confusing
    return toValue(community_data).community_channels.map(
        (c) => {return {label: c.name, id: c.channel_id}}
        );
    }
    
const selected_tab_data = computed(
    () => {
        if(!toValue(community_data))
        {
            return null;
        }
        
        return toValue(community_data).community_channels[toValue(selected_tab_id)];
    }
)

const { data, pending, error, refresh } = await useLazyAsyncData(
    "comm-data", async () => await $fetch(`/api/communities/${route.params.id}`),
    { lazy: true, server: false }
);

const { data: messageData, pending: messagePending, refresh : messageRefresh } = await useLazyAsyncData(
    "message-data", async () => {
        const comm_id = route.params.id
        const channel_id = toValue(selected_tab_data).channel_id;
        const r = await $fetch(`/api/communities/${comm_id}/channels/${channel_id}/messages`);
        present_messages.value = []; // reset present messages

        return r;
    },
    {
        lazy: true, server: false,
        watch: [selected_tab_id]
    },
);

const all_messages = computed(() => toValue(messageData) ? toValue(messageData).concat(toValue(present_messages)) : toValue(present_messages));

const { data: profileData, pending : profilesPending, refresh : profileRefresh } = await useLazyAsyncData(
    "profile-data", async () => {

        const r = await $fetch(`/api/communities/${route.params.id}`);

        const cmembers = r.community_members;
        let ret_val = {}
        
        cmembers.forEach(
            (cm) => {
                ret_val[cm.user_id] = cm;
            }
        )

        return ret_val;
    },
    {
        lazy: true, server: false, immediate: true
    }
)

// this is a hacky solution
onMounted(
    async () => {
        if(!toValue(community_data))
        {
            await profileRefresh();
            console.log(toValue(profileData));
            await refresh().then(async () => await messageRefresh());
        }
    }
)

watch(selected_tab_data, async (n, o) => {
    if(o) // if we are moving from some other channel
    {
        console.log(`Unsubbing from channel: ${o.name}`);
        await supa.removeChannel(
            supa.channel(`channel:${o.channel_id}`)
        );
    }

    if(n) // if we have gone to some other channel
    {
        supa.channel(`channel:${n.channel_id}`)
            .on(
                "postgres_changes",
                {
                    event : "INSERT",
                    schema : "public",
                    tables : "community_messages",
                    filter : `channel_id=eq.${n.channel_id}`
                },
                (payload) => {
                    // console.log(payload);
                    present_messages.value.push(payload.new);
                    // print(toValue(present_messages))
                }
            )
            .subscribe(
                (status) => {
                    console.log(`Subbed to channel: ${n.name} // STATUS=${status}`)
                }
            )
    }
})



const message_field_content = ref('');
const message_field_focused = ref(false);

const send_message = async () => {

    const {error} = await supa.from('community_messages')
        .insert({
            author : toValue(user).id,
            channel_id : toValue(selected_tab_data).channel_id,
            content : {
                "content" : toValue(message_field_content)
            }
        });

    if(!error)
    {
        message_field_content.value = '';
    }
    else
    {
        console.log(error);
    }
}

defineShortcuts({
    enter: {
        usingInput: true,
        whenever: [message_field_focused],
        handler: () => send_message()
    }
})

const me = await $fetch("/api/me");

// default dropdown options
const community_settings_dropdown_options = [
    [{
        label: "Invite People",
        icon: "i-mingcute-user-add-2-fill"
    }]
]

// administrative dropdown options
const community_admin_dropdown = [
    [{
        label: "Create a Channel",
        icon: "i-mingcute-add-fill"
    },
    {
        label: "Server Settings",
        icon: "i-mingcute-settings-3-fill"
    }]
]

const ctx_dropdown_options = computed(
    () => {
        if(toValue(community_data).owner_id == me.id)
        {
            return community_admin_dropdown.concat(community_settings_dropdown_options);
        }

        return community_settings_dropdown_options;
    }
)

</script>

<template>
    <div class="flex w-full">
        <!-- Channel Sidebar -->
        <div class="bg-gray-800 w-60 flex flex-col h-full">

            <a v-if="pending"><DelveLoadingIndicator show_tips /></a>
            <div v-else class="h-full overflow-y-scroll">

                <div class="rounded-md bg-gray-900 p-3 m-2 flex items-center">
                    <h1 class="flex-grow truncate">{{ data ? data.name : 'Huh' }}</h1>
                    <UDropdown :items="ctx_dropdown_options">
                        <UTooltip text="Community Settings">
                            <UButton variant="ghost" icon="i-mingcute-menu-fill"/>
                        </UTooltip>
                    </UDropdown>
                </div>
                
                <div class="w-full">
                    <UDivider label="CHANNELS" :ui="{ label: 'text-primary text-xs', border: {base : 'border-primary dark:border-primary'}, wrapper: { base: 'w-11/12 mx-auto' } }"/>
                </div>

                <div>
                    <UTabs :items="buildChannelTabs()" v-model="selected_tab_id" orientation="vertical" :ui="{ container: 'hidden' }">
                    
                        <template #default="{item}">
                            <div class="flex items-center gap-2 relative w-full truncate px-2">
                                <div class="flex items-center gap-2 relative truncate">
                                    <UIcon name="i-mingcute-hashtag-fill"/>
                                    <p>{{ item.label }}</p>
                                </div>
                            </div>
                        </template>
                    </UTabs>
                </div>

            </div>

            <!-- TODO: This needs to actually show the user's data wtf -->
            <div class="bg-gray-700 z-50 flex flex-row p-2 border-t-2 border-t-gray-600 mt-auto">
                <div>
                    <UAvatar size="md" :src="me.profile_path" :alt="me.username" chip-color="green" chip-position="bottom-right"/>
                </div>
                <div class="mx-2 flex-grow">
                    <p>{{ me.username }}</p>
                    <p class="text-xs text-gray-400">Online</p>
                </div>
                <UTooltip text="Profile Settings">
                    <UButton icon="i-mingcute-settings-3-fill" variant="ghost" color="gray"/>                        
                </UTooltip>
            </div>

        </div>

        <!-- Actual Messages thingamabob-->
        <div class="flex flex-col flex-grow overflow-y-scroll overflow-x-auto">

            <div class="flex flex-grow my-auto"></div>
            
            <div class="w-full flex-shrink p-3">
                <div v-if="messagePending || profilesPending">
                    <DelveLoadingIndicator show_tips/>
                </div>
                <div v-else>
                    <div v-if="all_messages.length > 0" ref="messageContainer" class="flex-col-reverse" style="overflow-anchor: auto;">
                        <DelveMessage 
                            class="flex mt-2"
                            v-for="m in all_messages"
                            v-bind:key="m.message_id"
                            :message="m"
                            :profile="toValue(profileData)[m.author]"
                        />
                    </div>
                    <div class="w-full text-center pb-36" v-else>
                        <Icon name="mingcute:sad-fill" size="2.5rem" class="text-primary"/>
                        <h1 class="text-lg font-semibold">There's nothing here!</h1>
                        <p class="text-md">Send something here in <span class="text-primary">#{{ toValue(selected_tab_data) ? toValue(selected_tab_data).name : 'what' }}</span> and make some friends!</p>
                    </div>
                </div>
            </div>

            <div class="inline-flex gap-3 p-3 bg-gray-800 sticky bottom-0">
                <UInput class="flex-grow" 
                    @blur="message_field_focused = false"
                    @focus="message_field_focused = true"
                    placeholder="Say something funny" 
                    v-model="message_field_content"/>
                <UButton icon="i-mingcute-send-fill" @click="send_message">Send</UButton>
            </div>
        </div>
    </div>
</template>