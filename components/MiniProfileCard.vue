<script setup>

const props = defineProps(
    {
        profile : Object
    }
);

const profile = props.profile;

</script>

<template>
    <UCard class="text-center">
        <div>
            <UAvatar size="2xl" :alt="profile.username" :src="profile.profile_path" />
        </div>
        <UDivider class="my-2"/>
        <h1 class="font-semibold text-lg">{{ profile.username }}</h1>
        <pre class="text-xs text-gray-600">{{ profile.id }}</pre>
        <div class="flex py-2 justify-center gap-2">
            <DelveBadge 
                v-for="b in profile.badges"
                v-bind:key="b.ref_id"
                :icon="b.meta.icon"
                :name="b.meta.name"
                :colour="b.meta.colour"
            />
        </div>
        <!--
            <div class="my-1">
                <UProgress :value="profile.experience" :max="500"/>
                <UBadge class="mt-1">Level 1</UBadge>
            </div>
            <UDivider class="my-2"/>
            <UButton icon="i-mingcute-profile-fill" class="mr-2">View Page</UButton>
        -->
    </UCard>
</template>