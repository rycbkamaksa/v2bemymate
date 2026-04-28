<template>
  <ul>
    <li v-for="card in cards" :key="card" class="card">
      <label>
        <input
          :type="checkbox ? 'checkbox' : 'radio'"
          :value="card"
          :checked="isChecked(card)"
          @change="onChange(card, $event)"
        >
        <div class="wrapper">
          <img src="../assets/Checkmark.svg" alt="checkmark" class="hidden mr-2">
          <span>
            {{ card }}
          </span>
        </div>
      </label>
    </li>
  </ul>
</template>

<script lang="ts">
import {PropType} from 'vue';

export default {
  props: {
    cards: {
      type: Array as PropType<String[]>,
      required: true
    },
    checkbox: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: [Array, String, null],
      required: true
    }
  },
  emits: ['update:modelValue'],
  methods: {
    isChecked(card: string): boolean {
      if (this.checkbox && Array.isArray(this.modelValue)) {
        return this.modelValue.includes(card)
      }
      return this.modelValue === card
    },
    onChange(card: string, event: Event) {
      const target = event.target as HTMLInputElement
      if (this.checkbox) {
        const arr = Array.isArray(this.modelValue) ? [...this.modelValue] : []
        if (target.checked) {
          if (!arr.includes(card)) arr.push(card)
        } else {
          const idx = arr.indexOf(card)
          if (idx >= 0) arr.splice(idx, 1)
        }
        this.$emit('update:modelValue', arr)
      } else {
        this.$emit('update:modelValue', card)
      }
    }
  }
}
</script>

<style scoped>
.card {
  list-style: none;
  display: inline;
}

label input {
  display: none;
}

.wrapper {
  @apply w-[271.33px] h-[152px] rounded-md flex justify-center bg-grey-20 items-center text-[20px] font-normal cursor-pointer;
}

input:checked + div {
  background: linear-gradient(90deg, #9557FF 20.93%, #5772FF 100%);
  font-weight: 600;
}

input:checked + div > img {
  display: inline;
}
</style>
