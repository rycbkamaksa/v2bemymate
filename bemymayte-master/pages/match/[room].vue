<template>
  <div>
    <div class="flex flex-col items-center">
      <b-title
        class="mt-6"
        title="Команда найдена"
        :subtitle="matchStatus ? undefined : 'Общайтесь с игроками в чате'"
      />
      <div class="mt-16 flex" :class="{ 'mt-10': matchStatus }">
        <div>
          <div class="grid grid-cols-2 gap-3 mr-8">
            <PlayerCard
              v-for="player in room.$state.players"
              :key="player.nickname"
              :player="player"
            />
            <FreeSlot v-for="slot in freeSlots" :key="slot" />
          </div>
        </div>

        <chat-room />
      </div>
      <team-view
        @rate-finished="leaveLobby"
        v-if="matchStatus === MatchStatus.Finished"
        class="mt-5"
        :users="room.filterPlayer(user.$state.guid)"
        :matchId="room.matchId"
      />
    </div>
  </div>
</template>

<script setup lang='ts'>
import TeamView from '~~/components/teamview/TeamView.vue'
import { useTeamSlots } from '~/composables/useTeamSlots'
import { SocketRequests } from '~/types/sockets'
import { MatchStatus } from '~/types/faceitAPI/data/match'
import { onMounted, onBeforeUnmount, ref } from 'vue'

const { $socket } = useNuxtApp()
const { user, room, freeSlots } = useTeamSlots()
const matchStatus = ref<MatchStatus>(MatchStatus.Configuring)
let forcedLeave = true

onMounted(() => {
  $socket.on(SocketRequests.MATCH_STARTED, () => {
    matchStatus.value = MatchStatus.Ready
  })

  $socket.on(SocketRequests.MATCH_ENDED, (matchId) => {
    room.$state.matchId = matchId
    matchStatus.value = MatchStatus.Finished
  })

  $socket.on(SocketRequests.ROOM_CLOSED, () => {
    leaveLobby()
  })
})

onBeforeUnmount(() => {
  if (forcedLeave) {
    alert('Покидая страницу, вы выходите из лобби.')
  }

  $socket.emit(SocketRequests.SEARCH_CANCEL, {
    guid: user.$state.guid,
  })
})

function leaveLobby() {
  forcedLeave = false
  useRouter().push('/profile')
}
</script>

<style></style>
