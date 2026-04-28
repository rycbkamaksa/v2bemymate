<template>
  <div class="flex gap-x-4">
    <label class="label" v-for="opt in options" :key="opt.value">
      <input
        type="radio"
        :value="opt.value"
        :checked="modelValue === opt.value"
        @change="$emit('update:modelValue', opt.value)"
      >
      <span>
        <img :src="opt.icon" :alt="opt.value">
      </span>
    </label>
  </div>
</template>

<script>
export default {
  name: "RegGender",
  props: ['modelValue'],
  emits: ['update:modelValue'],
  data() {
    return {
      options: [
        { value: 'male', icon: 'assets/genders/male.svg' },
        { value: 'female', icon: 'assets/genders/female.svg' },
        { value: 'unknown', icon: 'assets/genders/unknown.svg' }
      ]
    }
  }
}
</script>

<style scoped>
.label {
  @apply w-12 h-12
}

.label > span {
  @apply w-full cursor-pointer h-full block flex items-center justify-center
}

.label > input:checked + span {
  @apply bg-grey-20 rounded-lg border-2 border-purple
}

input {
  display: none;
}
</style>
