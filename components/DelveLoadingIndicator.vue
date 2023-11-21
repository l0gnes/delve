<script setup>

const props = defineProps(
    {
        show_tips : {
            type: Boolean,
            default: false
        }
    }
);

// This is just a funny thing I thought I'd do
const phrases = [
    "Hambruger?",
    "Try not to explode today.",
    "You're a Wizard Larry!",
    "Rock and Stone!",
    "Your Mother",
    "Just kidding... It's not!",
    "Calibrating the Mainframe...",
    "Baking a tungsten pie...",
    "Bet you can't find the monkey in this one",
    "The server is powered by a lemon and two electrodes",
    "I love the spinny thingy",
    "This is like watching paint dry",
    "You are number 2843684714 in the queue",
    "It's your fault we're loading slow",
    "TODO: Insert elevator music",
    "Updating Updater...",
    "Downloading Downloader...",
    "Debugging Debugger...",
    "Downloading more RAM..",
    "Updating to Windows Vista...",
    "Deleting System32 folder",
    "Distracted by cat gifs",
    "The fog is coming...",
    "(Insert quarter)",
    "Why don't you order a sandwich?",
]

</script>

<template>
    <div class="w-full text-center flex-col justify-center my-2">
        <UIcon name="i-mingcute-loading-fill" class="text-primary animate-spin"/>
        <span class="font-bold text-primary flex w-full justify-center mt-2">Loading...</span>
        <span v-if="show_tips" class="font-semibold my-1 text-gray-500 mx-3 text-sm">
            {{ phrases[Math.floor( Math.random() * (phrases.length) )] }}
        </span>
    </div>
</template>