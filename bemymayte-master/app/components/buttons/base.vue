<template>
  <button class="button-base">
    <slot />
  </button>
</template>

<style>
.button-base {
  border-radius: 8px;
  padding-top: 32px;
  padding-bottom: 32px;
  font-weight: 500;
  font-size: 18px;
  text-align: center;
  transition: 200ms;
}
.button-base:hover {
  box-shadow: 0 4px 14px rgba(151, 71, 255, 0.5);
}
.button-base:disabled {
  @apply text-grey-56 hover:shadow-none;
}
</style>
