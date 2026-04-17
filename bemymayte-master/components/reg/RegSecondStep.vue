<template>
  <!-- eslint-disable-next-line vue/no-mutating-props  -->
  <CardField v-model="modelValue"
             :checkbox="this.mainRole !== 'AWP'"
             :cards="cards"
             class="grid-cols-3 gap-4 mb-10"
             :class="this.mainRole === 'AWP' ? 'flex' : 'grid'"/>
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
  data() {
    const awp = this.mainRole === 'AWP'

    return {
      cards: awp
          ? ['IGL', 'Entry']
          : ['IGL', 'Entry', 'Support', 'Anchor', 'Lurker']
    }
  },
  watch: {
    modelValue(roles) {
      this.$emit('update:modelValue', roles)
    }
  }
}
</script>

