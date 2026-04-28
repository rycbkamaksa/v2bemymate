<template>
  <CardField
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    :checkbox="mainRole !== 'AWP'"
    :cards="cards"
    class="grid-cols-3 gap-4 mb-10"
    :class="mainRole === 'AWP' ? 'flex' : 'grid'"
  />
</template>

<script lang="ts">
import CardField from "~/components/card-field.vue";

export default {
  components: {
    CardField
  },
  props: {
    mainRole: {
      type: String,
      required: true
    },
    modelValue: {
      type: [String, Array, null],
      required: true
    }
  },
  emits: ['update:modelValue'],
  data() {
    const awp = this.mainRole === 'AWP'

    return {
      cards: awp
          ? ['IGL', 'Entry']
          : ['IGL', 'Entry', 'Support', 'Anchor', 'Lurker']
    }
  }
}
</script>
