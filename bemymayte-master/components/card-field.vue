<template>
  <ul>
    <li v-for="card in cards" :key="card" class="card">
      <label>
        <!--   eslint-disable-next-line vue/no-mutating-props     -->
        <input :type="checkbox ? 'checkbox' : 'radio'" :value="card" v-model="modelValue">
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
  watch: {
    modelValue(newValue) {
      this.$emit('update:modelValue', newValue)
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
