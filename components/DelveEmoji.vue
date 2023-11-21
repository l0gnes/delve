<script setup>

const props = defineProps(
    {
        name : String
    }
)

const emoji_name = props.name;

</script>

<template>

<UTooltip :text="':' + emoji_name + ':'" :popper="{ placement: 'top' }">
    <img class='h-5 bg-contain inline' :src="'/emojis/' + emoji_name + '.gif'"/>
</UTooltip>

</template>