<template>
  <div class="free-slot">
    <Icon :img="Profile" class="player-icon" />
  </div>
</template>

<script setup>
import Icon from './icon'
import Profile from '/assets/icons/Profile.svg'
</script>

<style scoped>
.free-slot {
  @apply w-[210px] h-[168px] bg-background flex items-center justify-center rounded-lg;
}

.player-icon {
  @apply w-8 h-8;
}
</style>
