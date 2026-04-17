<template>
  <div class="mt-[55px] flex flex-col items-center">
    <div class="text-[56px] relative" :class="animate && 'title-animation'">
      {{ title }}
    </div>
    <div class="text-grey-56 mt-1 whitespace-pre">
      {{ subtitle }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  animate: { type: Boolean, default: false, required: false },
})

</script>

<style scoped>
  @keyframes search-animation {
    0% {
      content: '';
    }

    33% {
      content: '.';
    }

    66% {
      content: '..';
    }

    100% {
      content: '...';
    }
  }

  .title-animation::after {
    content: '';
    position: absolute;
    animation: search-animation linear 2s infinite;
  }
</style>
