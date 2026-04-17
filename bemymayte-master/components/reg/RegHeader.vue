<template>
  <div class="flex justify-between items-center mb-6">
    <h2 class="inline font-semibold text-[32px] leading-[44px]">
      Регистрация
    </h2>

    <span class="text-grey-56 mt-0.5"> {{ step }}/{{ maxSteps }} </span>
  </div>
  <div class="text-lg mb-6">
    {{ hint }}
  </div>
</template>

<script setup>
defineProps({
  hint: {
    type: String,
    required: true
  },
  step: {
    type: Number,
    required: true
  },
  maxSteps: {
    type: Number,
    default: 3
  },
})
</script>
