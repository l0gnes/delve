<script setup>
import { navigateTo } from 'nuxt/app';

const supa = useSupabaseClient();

const reactive_comms = ref([]);

const {data : communities, pending, error, refresh} = await useAsyncData("communities", () => {
    $fetch("/api/me/communities").then((r) => {reactive_comms.value = r})
})

const isJoinCommModalOpen = ref(false);

const joinedCommCb = (cb) => {
    isJoinCommModalOpen.value = false;
    
    navigateTo(`/app/community/${cb}`);
}

</script>

<template>
    <div class="w-full h-full absolute flex">
        <div class="w-20 h-full bg-gray-900 text-center">
            <UTooltip text="Home" :popper="{ placement: 'right' }">
                <UButton variant="ghost" @click="navigateTo('/app')">
                    <UAvatar size="xl" class="my-2" icon="i-heroicons-home-solid" />
                </UButton>
            </UTooltip>
            
            <UDivider />
            
            <div v-if="pending">
                <DelveLoadingIndicator />
            </div>
            <div v-else>
                <div v-for="c in reactive_comms" v-bind:key="c.id">
                    <UTooltip :text="c.name" :popper="{ placement: 'right' }">
                        <UButton class="rounded" variant="ghost" @click="navigateTo('/app/community/' + c.id)">
                            <UAvatar 
                                :alt="c.name" 
                                size="xl"
                                class="my-2 focus-visible:outline-0 focus-visible:ring-2 dark:focus-visible:ring-primary-400 focus:outline-none ring-1 ring-primary-600 hover:ring-2 hover:cursor-pointer"
                            />
                        </UButton>
                    </UTooltip>
                </div>
            </div>
            
            <UDivider />

            <div class="my-2">
                <UTooltip text="Create a New Community" :popper="{ placement: 'right' }" >
                    <UButton variant="ghost">
                        <UAvatar size="xl" icon="i-mingcute-add-line"/>                    
                    </UButton>
                </UTooltip>

                <UTooltip text="Join a Community" :popper="{ placement: 'right' }" >
                    <UButton variant="ghost" @click="isJoinCommModalOpen = true">
                        <UAvatar size="xl" icon="i-mingcute-compass-line"/>                    
                    </UButton>
                </UTooltip>
            </div>

        </div>

        <div class="h-full flex w-full">
            <slot></slot>
        </div>
    </div>

    <UModal v-model="isJoinCommModalOpen" >
        <DelveJoinCommunity @join="joinedCommCb"/>
    </UModal>

</template>