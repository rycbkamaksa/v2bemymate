<template>
  <div
    class="bg-dark rounded-2xl border-2 border-stone-600"
    :class="{ 'purple-smoke': smoke }"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    smoke: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
