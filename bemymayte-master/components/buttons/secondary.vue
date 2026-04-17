<template>
  <ButtonBase class="button-secondary" :class="{ arrow }">
    <slot />
  </ButtonBase>
</template>

<script>
import ButtonBase from './base.vue'

export default {
  components: { ButtonBase },
  name: 'button-secondary',
  props: {
    arrow: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped>
.button-secondary {
  @apply bg-dark border-[2px] border-dirty-grey border-solid;
}
.button-secondary:disabled {
  @apply border-soft-grey;
}

.arrow {
  background: url(./arrow.svg) center right no-repeat, #212224;
}
</style>
