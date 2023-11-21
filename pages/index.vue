<script setup>

const head = useHead({
    meta: [
        {hid: 'description', name: 'description', content: "ummm uhhhh ummmm"},
        { hid: 'og:title', property: 'og:title', content: "Delve" },
        { hid: 'og:url', property: 'og:url', content: "delve.lognes.lol" },
        { hid: 'og:description', property: 'og:description', content: "ummm uhhhh ummmm" },
        { hid: 'og:image', property: 'og:image', content: "https://arhzbeuokzwekraduqga.supabase.co/storage/v1/object/public/server_resources/meta_img.png" },
    ]
})

const user = useSupabaseUser();
const profile = ref(null);

const suggested_guilds = [
    {
        "name" : "Alex Server",
        "comm_icon" : "https://i.pinimg.com/736x/b8/2f/91/b82f9111e7fdf65bc07d042471d64f68.jpg",
        "members" : 6,
        "is_verified" : true
    },
    {
        "name" : "Anti-Glyphid Squad",
        "comm_icon" : "https://cdn2.steamgriddb.com/file/sgdb-cdn/icon/87ec54ef27e93908a8397eb3a6bbb45b/32/256x256.png",
        "members" : 243,
        "is_verified" : false
    },
    {
        "name" : "Millie Server :p",
        "comm_icon" : "https://i.imgflip.com/77uo3z.jpg?a471960",
        "members" : 58,
        "is_verified" : false
    }
]

onMounted(async () => {
    if (user) {
        await $fetch("/api/me").then(
            (resp) => profile.value = resp
        )
    }
});

</script>

<template>
    <div class="w-full text-center py-32 bg-gray-900">
        <div class="my-4 text-center w-full px-6">
            <h1 
                class="punchline text-4xl mb-2"
            >
                <span class="text-primary hover:bg-purple-500 hover:text-white hover:px-4 ease-linear duration-300 transition-all hover:after:content-['.lognes.lol'] hover:cursor-pointer">Delve</span> into a world of new communities
            </h1>
    
            <p>
                <span class="text-primary">Delve</span> is a platform built for communicating. I don't know what else to put here, but I wanted this to look cool.
            </p>
        </div>
    
        <div v-if="user == null">
            <UButton variant="outline" class="mr-4 px-4" @click="navigateTo('/portal/login')">Login</UButton>
            <UButton class="px-4" @click="navigateTo('/portal/register')">Register</UButton>
        </div>
        <div v-else>
            <div v-if="profile" class="mt-4">
                <UAvatar :alt="profile.username" size="lg"/>
                <div v-if="profile.badges" class="mt-3">
                    <DelveBadge class="mx-1" v-bind:key="b.ref_id" v-for="b in profile.badges" :name="b.meta.name" :icon="b.meta.icon" :colour="b.meta.colour"/>
                </div>
                <h2 class="text-lg">Welcome Back {{ profile.username }}!</h2>
            </div>
            <UButton @click="navigateTo('/app')" class="mt-4">Open the App</UButton>
        </div>
    </div>

    <div class="w-full text-center py-12 bg-gray-1000">
        <h2 class="punchline text-2xl">
            Check out some of our awesome communities!
        </h2>
        <p>Some of these communities are kinda awesome dude, <span class="text-primary">more awesomer than a baconator</span></p>
    
        <div class="mt-6 px-4 columns-md">
            <UCard class="mx-2 mb-6 text-center" v-bind:key="c.name" v-for="c in suggested_guilds">
                <UAvatar :src="c.comm_icon" size="3xl"/>
                <h3 class="text-2xl font-bold">{{ c.name }} <UIcon class="align-middle" name="i-heroicons-check-badge-solid" v-if="c.is_verified"/></h3>
                <p class="text-gray-600">{{ c.members }} Members &#8226 Public Server</p>
                <UButton class="my-2">Join Community</UButton>
            </UCard>
        </div>
    </div>

</template>

<style scoped>

.punchline {
    font-family: 'Rowdies', sans-serif;
    font-weight: 500;
}
</style>