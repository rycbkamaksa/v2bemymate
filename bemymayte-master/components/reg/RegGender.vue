<template>
  <div class="flex gap-x-4">
    <label class="label">
      <!--   eslint-disable-next-line vue/no-mutating-props   -->
      <input type="radio" value="male" v-model="modelValue">
      <span>
        <img src="assets/genders/male.svg" alt="male">
      </span>
    </label>
    <label class="label">
      <!--   eslint-disable-next-line vue/no-mutating-props   -->
      <input type="radio" value="female" v-model="modelValue">
      <span>
        <img src="assets/genders/female.svg" alt="female">
      </span>
    </label>
    <label class="label">
      <!--   eslint-disable-next-line vue/no-mutating-props   -->
      <input type="radio" value="unknown" v-model="modelValue">
      <span>
        <img src="assets/genders/unknown.svg" alt="unknown">
      </span>
    </label>
  </div>
</template>

<script>
export default {
  name: "RegGender",
  props: ['modelValue'],
  watch: {
    modelValue(gender) {
      this.$emit('update:modelValue', gender)
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
