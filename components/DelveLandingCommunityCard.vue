<script setup>

const props = defineProps(
    {
        community : Object
    }
)

const id = props.community.id;
const name = props.community.name;
const icon = props.community.icon;

</script>

<template>
    <div class="rounded-md bg-gray-700 p-2 flex items-center px-4">
        <UAvatar size="lg" :alt="name" :src="icon"/>
        
        <div class="mx-2 flex-grow">
            <h1 class="text-lg">{{ name }}</h1>
        </div>

        <UButton class="px-5" icon="i-mingcute-enter-door-fill" @click="navigateTo(`/app/community/${id}`)">View</UButton>
    </div>
</template>