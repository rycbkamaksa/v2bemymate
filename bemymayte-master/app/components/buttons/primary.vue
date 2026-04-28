<template>
  <ButtonBase class="button-primary" :class="{ arrow }">
    <slot />
  </ButtonBase>
</template>

<script>
import ButtonBase from "./base.vue";

export default {
  components: {ButtonBase},
  name: "button-primary",
  props: {
    arrow: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.button-primary {
  background: linear-gradient(90deg, #9557FF 20.93%, #5772FF 100%);
}

.button-primary:disabled {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
  linear-gradient(90deg, #9557FF 56.21%, #5772FF 100%);
}

.arrow {
  background: url(./arrow.svg) center right no-repeat,
  linear-gradient(90deg, #9557FF 20.93%, #5772FF 100%);
}

.arrow:disabled {
  background: url(./arrow.svg) center right no-repeat,
  linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
  linear-gradient(90deg, #9557FF 56.21%, #5772FF 100%);
}
</style>
