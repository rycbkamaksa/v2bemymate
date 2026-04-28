<template>
  <div class="player-card" :class="player.role">
    <div class="flex mb-[18px]">
      <user-avatar :img="player.img" class="avatar" />
      <div>
        <div class="mb-0.5 font-normal overflow-hidden whitespace-nowrap text-ellipsis w-[146px]">{{ player.nickname }}</div>
        <TagRole :role="player.mainRole" />
        <TagRole :role="player.role" />
      </div>
    </div>
    <div class="flex" v-if="player.level">
      <Level :level="player.level" small class="mr-2.5" />
      Уровень Faceit
    </div>
    <a target="_blank" :href="player.profile">
      <div class="flex mt-[18px] bg-background p-1 rounded justify-between">
        <div class="flex">
          <img src="/assets/icons/Faceit.svg" class="mr-2" />
          Профиль
        </div>
        <img src="/assets/icons/RightArrow.svg" />
      </div>
    </a>
  </div>
</template>

<script lang="ts" setup>
import { Player } from '~/models'
import UserAvatar from '~/components/user-avatar.vue'
import Level from '~/components/level.vue'
import { PropType } from 'vue'

defineProps({
  player: {
    type: Player as PropType<Player>,
    required: true,
  },
})
</script>

<style scoped>
.player-card {
  @apply flex flex-col justify-between bg-background w-[210px] h-[168px] rounded-lg p-3;
}

.avatar {
  @apply w-11 h-11 mr-2 border-none;
}

.Entry {
  background: linear-gradient(
      180deg,
      rgba(27, 180, 250, 0) 0%,
      rgba(27, 180, 250, 0.5) 118.75%
    ),
    rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 16px rgba(27, 180, 250, 0.1),
    inset 0 0 20px rgba(14, 15, 17, 0.5);
}

.Support {
  background: linear-gradient(
      180deg,
      rgba(149, 87, 255, 0) 0%,
      rgba(149, 87, 255, 0.5) 118.75%
    ),
    rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 16px rgba(149, 87, 255, 0.1),
    inset 0 0 20px rgba(14, 15, 17, 0.5);
}

.Lurker {
  background: linear-gradient(
      180deg,
      rgba(250, 98, 125, 0) 0%,
      rgba(250, 98, 125, 0.5) 118.75%
    ),
    rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 16px rgba(250, 98, 125, 0.1),
    inset 0 0 20px rgba(14, 15, 17, 0.5);
}

.Anchor {
  background: linear-gradient(
      180deg,
      rgba(87, 114, 255, 0) 0%,
      rgba(87, 114, 255, 0.5) 118.75%
    ),
    rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 16px rgba(87, 114, 255, 0.1),
    inset 0 0 20px rgba(14, 15, 17, 0.5);
}

.IGL {
  background: linear-gradient(
      180deg,
      rgba(255, 200, 0, 0) 0%,
      rgba(255, 200, 0, 0.5) 118.75%
    ),
    rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 16px rgba(255, 200, 0, 0.1),
    inset 0 0 20px rgba(14, 15, 17, 0.5);
}
</style>
