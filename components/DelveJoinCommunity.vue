<script setup>

const emits = defineEmits(['join']);

const invite_link = ref('');

async function attempt_invite () {
    const {statusCode, comm} = await $fetch(
        "/api/communities/join",
        {
            method: "POST",
            body: {
                "invite_link" : toValue(invite_link)
            }
        }
    );

    
    if(statusCode == 200)
    {
        // emit on_join to outer components
        emits("join", comm);
    }
}

</script>

<template>
    <UCard class="text-center">
        <!-- Header decor div-->
        <div class="bg-gray-800 rounded-lg py-3">
            <h1 class="text-xl font-semibold">Join a Delve Community</h1>
            <h2 class="font-thin">Everyone's waiting to meet you!</h2>
        </div>

        <UDivider class="py-3"/>

        <p class="mb-1">Have an invite link? Use it here!</p>
        <div class="flex gap-2">
            <UInput class="flex-grow" placeholder="https://delve.lognes.lol/xCgHzN" v-model="invite_link"/>
            <UButton class="px-5" @click="attempt_invite">Join</UButton>
        </div>
    </UCard>
</template>