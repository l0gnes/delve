<script setup>
definePageMeta({
    layout: "app-layout"
})

const user = await $fetch("/api/me");
const communities = await $fetch("/api/me/communities");

</script>

<template>
    <div class="w-full p-4">
        
        <div class="bg-gray-900 p-4 rounded-md flex gap-4">
            <UAvatar size="3xl" :alt="user.username" :src="user.profile_path"/>

            <div class="py-2">
                <h1 class="text-xl font-semibold pb-2">Welcome back, {{ user.username }}!</h1>
                <h2 class="font-thin text-gray-400">Let's get delving, shall we?</h2>
            </div>
        </div>

        <div class="flex columns-2 mt-2 gap-4">

            <div class="bg-gray-800 flex-grow p-3.5 rounded-md">
                <h2 class="font-semibold text-lg">My Communities</h2>

                <div v-if="communities.length > 0">
                    <DelveLandingCommunityCard v-for="c in communities" v-bind:key="c.id" :community="c" class="my-2"/>
                </div>
                <div v-else class="text-center py-5">
                    <UIcon class="text-primary text-3xl" name="i-mingcute-puzzled-fill"/>
                    <h1 class="font-semibold">You're not part of any communities yet!</h1>
                </div>

            </div>

            <div class="flex flex-col gap-3 flex-grow">
                <div class="bg-gray-800 flex-grow p-3.5 rounded-md">
                    <h2 class="font-semibold text-lg">You are currently <span class="text-primary">Level 1</span></h2>
                    <UDivider class="my-2"/>
                    <UProgress :value="user.experience" :max="500"/>
                    <div class="flex pt-1">
                        <div class="flex-grow"></div>
                        <p class="text-sm text-gray-500">{{ user.experience }} / 500</p>
                    </div>
                </div>


                <div class="bg-gray-800 flex-grow p-3.5 rounded-md">
                    <h2 class="font-semibold text-lg">Quests</h2>

                    <UAlert
                        class="my-2"
                        icon="i-mingcute-tower-crane-line"
                        title="This feature is still in construction"
                    />
                </div>
            </div>

        </div>

    </div>
</template>