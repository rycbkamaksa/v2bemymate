<template>
  <div class="flex gap-x-[4px]">
    <label
      class="radio-control"
      :name="name"
      v-for="(option, index) in options"
      :key="option"
    >
      <input :checked="modelValue === index + 1" type="radio" :value="modelValue" @input="$emit('update:modelValue', index + 1)" />
      <div class="radio-input">
        <span class="fill h-[14px] w-[14px] rounded-full"></span>
      </div>
      <span class="font-extralight text-[12px] leading-[12px] pt-[4px]">
        {{ option }}
      </span>
    </label>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import { RoleRates } from '~/types/bemymateAPI/matches'

export default {
  name: 'RadioGroup',
  props: {
    options: Array as PropType<String[]>,
    modelValue: Number,
    name: String,
  },
}
</script>

<style scoped>
.radio-control {
  @apply w-[48px] h-[40px] flex flex-col items-center;
}

.radio-input {
  @apply w-[22px] h-[22px] cursor-pointer flex items-center justify-center border-2 rounded-full border-white;
}

.radio-control > input:checked + .radio-input .fill {
  @apply bg-gradient-to-r from-[#9557FF] to-[#5772FF] bg-origin-padding;
}

input {
  display: none;
}
</style>
