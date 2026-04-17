<template>
  <div>
    <div class="h-[76px] fixed w-screen bg-dark flex justify-center items-center">
      <Logo/>
    </div>
    <slot />
  </div>
</template>

<script setup>
import Logo from "../components/logo";
</script>

<style>
.auth-layout {
  @apply bg-deep-dark h-screen px-36 flex justify-center items-center;
}
</style>
