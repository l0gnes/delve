<script setup>

import moment from 'moment';

const props = defineProps(
    {
        message : Object,
        profile: Object 
    }
);

const message = props.message;
const member =  props.profile;

</script>

<template>
    <UCard>
        <div class="flex flex-row">
            <div class="flex-shrink">
                <UAvatar size="md" :alt="member.profile.username" :src="member.profile.profile_path"/>
            </div>
            <div class="flex-grow px-2.5">
                <div class="flex items-center">
                    <UPopover>
                        <h2 class="text-lg font-semibold hover:underline mb-1">
                            {{ member.profile.username }}
                        </h2>
    
                        <template #panel>
                            <MiniProfileCard :profile="member.profile"/>
                        </template>
                    </UPopover>
                    <h3 class="text-gray-500 text-sm align-sub px-2">
                        {{ moment(message.sent_at).fromNow() }}
                    </h3>
                </div>

                <div>
                    {{ message.content.content }}
                </div>
            </div>
        </div>
    </UCard>
</template>