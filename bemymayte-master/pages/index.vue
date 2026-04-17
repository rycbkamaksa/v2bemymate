<template>
  <div class="flex flex-col items-center">
    <b-title
      title="Поиск матча"
      :subtitle="subtitle"
      :animate="inSearch"
    />
    <div class="flex mt-20 gap-[13px]">
      <PlayerCard
        v-for="player in room.$state.players"
        :key="player.nickname"
        :player="player"
      />
      <FreeSlot v-for="slot in freeSlots" :key="slot" />
    </div>

    <pre>
      {{ players }}
    </pre>

    <div class="w-[493px] mt-[66px]">
      <ButtonPrimary
        v-if="!inSearch"
        id="start-search"
        class="w-full"
        :disabled='banTime > 0 || banTime === -1'
        arrow
        @click="initSearch"
      >
        {{ searchButtonText }}
      </ButtonPrimary>
      <ButtonSecondary
        v-else
        id="start-search"
        class="w-full"
        :disabled='banTime > 0 || banTime === -1'
        @click="cancelSearch"
      >
        ОТМЕНА
      </ButtonSecondary>
      <!--   Расскоментить, когда будет премиум  -->
      <!--      <div class="flex items-center justify-around mt-4">-->
      <!--        <hr class="w-full">-->
      <!--        <span class="mx-[27px]">-->
      <!--          или-->
      <!--        </span>-->
      <!--        <hr class="w-full">-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script setup lang="ts">
import ButtonPrimary from '../components/buttons/primary.vue'
import ButtonSecondary from '../components/buttons/secondary.vue'

import { Player } from '~/models'

import { computed, onMounted, ref } from 'vue'
import { SocketRequests } from '~~/types/sockets'
import { useTeamSlots } from '~/composables/useTeamSlots'
import { wrapError } from '~/utils'

const { room, user, freeSlots } = useTeamSlots()
const gamesToGrade = ref(undefined)
const inSearch = ref(false)
const banTime = ref(0)
const playersInSearch = ref(-1)
let faceitLevel = 0
let legalRedirect = false

const searchButtonText = computed(() => {
  if (banTime.value > 0) {
    return `Вы получили бан на ${banTime.value} минут`
  } else if (banTime.value === -1) {
    return `Вы получили постоянный бан за токсичность`
  }

  return 'Начать поиск'
})

const subtitle = computed(() => {
  const calibration = inSearch.value && gamesToGrade.value > 0 ?
    `Для калибровки осталось ${gamesToGrade.value} игр` :
    ''

  // оставляем пробел, чтобы не происходило схлопывания
  const applicants = inSearch.value && playersInSearch.value > 0 ?
    `Пользователей при подборе: ${playersInSearch.value}` :
    ' '

  return calibration + '\n' + applicants
})

const { $socket } = useNuxtApp()

onMounted(async () => {
  faceitLevel = await wrapError(getSelfLevel(), () => 0)

  $socket.on(SocketRequests.ROOM_STATE_CHANGE, updateRoomPlayers)

  $socket.on(SocketRequests.ROOM_INIT, ({ players, gamesToQualify, applicants }) => {
    gamesToGrade.value = gamesToQualify
    playersInSearch.value = applicants
    updateRoomPlayers(players)
  })

  $socket.on(SocketRequests.ROOM_FILLED, ({ players, roomId }) => {
    room.$patch({
      roomId,
      players,
    })

    legalRedirect = true
    useRouter().push(`/match/${roomId}`)
  })

  $socket.on(SocketRequests.BANNED, (minutes) => {
    banTime.value = minutes
    inSearch.value = false
  })

  prepareRoom()
})

onBeforeUnmount(() => {
  if (inSearch.value && !legalRedirect) {
    alert('Покидая страницу поиска, вы прекращаете процесс подбора.')
  }

  if (!legalRedirect) {
    $socket.emit(SocketRequests.SEARCH_CANCEL, {
      guid: user.$state.guid,
    })
  }
})

async function getSelfLevel(): Promise<number> {
  const { data } = await useFetch(
    `/api/users/${user.$state.guid}/data/search_props`,
    {
      pick: ['faceitLevel'],
    }
  )

  return data.value.faceitLevel
}

function prepareRoom() {
  room.clearPlayers()
  room.addPlayer(new Player(user.getPlayer()))
  room.$state.players[0].level = faceitLevel
}

function updateRoomPlayers(players: Omit<Player, 'profile'>[]) {
  room.clearPlayers()
  players.forEach((playerData, index) => {
    // защита от перестановок игрока внутри комнаты
    if (playerData.guid === user.$state.guid && index !== 0) {
      const movedPlayer = room.$state.players[0].clone()
      room.$state.players[0] = (new Player(playerData))
      room.addPlayer(movedPlayer)
      return
    }

    room.addPlayer(new Player(playerData))
  })
}

function initSearch() {
  inSearch.value = true
  $socket.emit(SocketRequests.SEARCH_INIT, {
    guid: user.$state.guid,
  })
}

function cancelSearch() {
  inSearch.value = false
  $socket.emit(SocketRequests.SEARCH_CANCEL, {
    guid: user.$state.guid,
  })

  prepareRoom()
}
</script>
