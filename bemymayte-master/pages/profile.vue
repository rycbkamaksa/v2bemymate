<template>
  <div class="max-w-[1104px] mx-auto pt-8">
    <div class="profile-box p-6 flex items-center relative" v-if="userStore.$state">
      <img :src="userStore.$state.picture" alt="Avatar" class="w-[151px] h-[151px] rounded-full">
      <div class="text-[28px] ml-10">{{ userStore.$state.nickname }}</div>

      <button id="logout" class="absolute top-9 right-9 bg-grey-20 p-3 rounded-xl" @click="userStore.logout">
        <img src="/assets/icons/Logout.svg" alt="Logout">
      </button>
    </div>
    <div class="grid h-10 mt-4 grid-cols-2 gap-4" v-if="!pending">
      <div class="profile-box grid grid-cols-3 p-6 gap-y-8">
        <div v-for="s in profile.stat" :key="s.title">
          <div class="pb-2 opacity-70">{{ s.title }}</div>
          <div class="text-3xl">
            {{ s.value }}
          </div>
        </div>
      </div>
      <div class="profile-box flex py-[31px] px-[68px] justify-between">
        <Level title="Faceit" :level="profile.faceitLevel" />
        <Level title="Bemymate" :level="profile.bemymateLevel" needs-scaling />
      </div>
      <div class="profile-box">
        <div class="flex p-5 items-center">
          <div class="text-xl">
            Последние игры
          </div>
          <!--   Это не входит в MVP       -->
          <!--<div>Показать все <img class="inline" src="/assets/icons/RightArrow.svg"></div>-->
        </div>
        <table class="w-full">
          <colgroup>
            <col class="w-[120px]">
            <col class="w-[120px]">
            <col class="w-[120px]">
            <col class="w-[65px]">
            <col class="w-[100px]">
          </colgroup>
          <tbody>
          <tr>
            <td class="pl-[18px]">Map</td>
            <td>Role</td>
            <td>Result</td>
            <td>Kills</td>
            <td>Role rate</td>
          </tr>
          <tr v-for="(game, index) in profile.lastGames" :key="index" class="h-[57px] border-t border-[#4D4D4D]">
            <td class="pl-[18px]">{{ game.map }}</td>
            <td>
              <span class="w-[51px] py-[4px] px-[8px] rounded-[6px]" :class="game.role">{{ game.role }}</span>
            </td>
            <td>
                <span :class="`${game.result}-text`">
                {{ game.result }}
                </span>
            </td>
            <td>{{ game.kills }}</td>
            <td class="pl-5">
                <span class="rounded-[16px] py-1 px-2 text-[14px]" :class="`${game.roleRate >= 3 ? 'Win' : 'Lose'}-rate`">
                  {{ game.roleRate }}
                </span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="profile-box py-5 px-6">
        <div class="text-[22px] mb-5">Роли</div>
        <div v-for="role in profile.roleStat" :key="role.title" class="h-[60px] flex justify-between items-center mt-4">
          <div>{{ role.title }}</div>
          <div class="flex">
            <div class="role-card bg-toxic">
              <div class="role-card-title">Wins</div>
              <div class="text-on-toxic">{{ role.wins }}</div>
            </div>
            <div class="role-card bg-fail">
              <div class="role-card-title">Loses</div>
              <div class="text-on-fail">{{ role.loses }}</div>
            </div>
            <div class="role-card bg-[#303047]">
              <div class="role-card-title">K/D</div>
              <div>{{ role.kda }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="grid h-10 mt-4 grid-cols-2 gap-4">
      <div v-for="n in 4" :key="n" class="preloader-container">
        <Loader class="preloader"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Level from "~/components/level.vue";
import Loader from "~/components/loader.vue"

export default {
  name: "profile",
  components: {Level, Loader},
  setup() {
    const {userStore, profile, pending} = useProfile()
    return {userStore, profile, pending}
  },
}
</script>

<style scoped>
.profile-box {
  @apply bg-dark rounded-xl
}

.role-card {
  @apply rounded-lg w-[92px] flex items-center flex-col ml-2
}

.role-card-title {
  @apply mt-2 mb-1 text-[14px]
}

tr:nth-child(2n) {
  background: #252728;
}

.preloader-container {
  @apply profile-box h-[230px] flex items-center justify-center
}

.preloader {
  @apply w-[30%] h-[30%]
}

.Win-text {
  @apply text-on-toxic
}

.Win-rate {
  @apply bg-toxic text-on-toxic
}

.Lose-text {
  @apply text-on-fail
}

.Lose-rate {
  @apply text-on-fail bg-fail
}

.Entry {
  background: #1BB4FA;
}

.Support {
  background: #9557FF;
}

.Lurker {
  background: #FA627D;
}

.Anchor {
  background: #5772FF;
}

.IGL {
  background: #FFC800;
  color: #0E0F11;
}

</style>
