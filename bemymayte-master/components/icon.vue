<template>
  <img :src="img" :alt="img" class="w-6 h-6 inline">
</template>

<script setup>
defineProps({
  img: {
    type: String,
    required: true
  },
})
</script>
