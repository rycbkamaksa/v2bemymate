<template>
  <input :value="modelValue" @input="e => $emit('update:modelValue', e.target.value)" type="text" class="text-input">
</template>

<script>
export default {
  name: "text-input",
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
}
</script>

<style scoped>
.text-input {
  @apply text-light-grey border-2 border-dirty-grey bg-dark rounded-xl p-4;
}
</style>
