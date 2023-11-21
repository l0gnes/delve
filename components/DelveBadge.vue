<script setup>

const props = defineProps({
    icon: String,
    name: String,
    colour: String
})

const name = props.name;
const colour = props.colour;
const icon = props.icon;

</script>

<template>

    <UTooltip :text="name" :popper="{ placement: 'top' }">
        <Icon :name="icon" :class="colour"/>
    </UTooltip>

</template>