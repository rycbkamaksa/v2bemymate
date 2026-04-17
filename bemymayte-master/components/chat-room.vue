<template>
  <div class="chat">
    <div class="chat-title">Чат с командой</div>
    <div class="message-container">
      <div class="scrollbar">
        <MessageBubble
          v-for="(message, index) in messages"
          :key="index"
          :message="message.message"
          :player="message.player"
          :time="message.time"
          :system="message.system"
          class="mb-4 last-of-type:mb-0"
        />
      </div>
    </div>

    <hr />

    <div class="input-field">
      <input
        id="text-field"
        type="text"
        v-model="message"
        class="text-field"
        placeholder="Текст сообщения"
        @keypress.enter="submitMessage"
      />
      <button type="submit" @click="submitMessage">
        <img src="/assets/icons/message-icon.svg" alt="Отправить сообщение" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import MessageBubble from './message-bubble.vue'
import { Player } from '~/models'
import { useUserStore } from '~/store/user'
import { SocketRequests } from '~~/types/sockets'
import { useRoomStore } from '~/store/room'
import { onMounted } from 'vue'

const user = useUserStore()
const { $socket } = useNuxtApp()
const player = ref(user.getPlayer())
const roomStore = useRoomStore()
const messages = ref([])
const message = ref('')

onMounted(() => {
  $socket.on(SocketRequests.CHAT_IN, ({ initiator, content }) => {
    // FIXME: a hack for testing
    //initiator = roomStore.$state.players[Math.floor(Math.random() * 5)].nickname
    pushMessage(content, roomStore.getPlayer(initiator))
  })

  pushMessage(`Твое лобби сформировано. Для начала игры необходимо:\n
1. Всем скинуть ссылки на свой профиль faceit\n
2. IGL добавляет всех в друзья и формирует лобби\n
3. После матча вам необходимо проставить рейтинг всем игрокам\n
Сервис только запущен, поэтому могут встречаться баги.
Свой фидбэк и идеи по площадке можете оставлять в нашем Discord-канале - <a href="https://discord.gg/Jbatd8BNxs" target="_blank" rel="noreferrer" style="color: #9557FF">https://discord.gg/Jbatd8BNxs</a>`, new Player({
    nickname: 'Команда создана',
    img: '',
    guid: '',
  }), true)
})

function submitMessage() {
  if (message.value) {
    $socket.emit(SocketRequests.CHAT_OUT, {
      initiator: player.value,
      content: message.value,
    })
    // @ts-ignore
    pushMessage(message.value, player.value)
    message.value = ''
  }
}

function pushMessage(message: string, player: Player, systemMsg: boolean = false) {
  messages.value.push({
    message,
    player,
    time: new Date().toLocaleTimeString('ru-RU', {
      hour12: false,
      hour: 'numeric',
      minute: 'numeric',
    }),
    system: systemMsg,
  })
}
</script>

<style scoped>
.chat {
  width: 638px;
  height: 556px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
}

.message-container {
  @apply h-[439px] py-6 flex flex-col justify-end;
}

.scrollbar {
  @apply overflow-y-scroll overflow-x-hidden;
  overscroll-behavior-y: contain;
  scroll-snap-type: y proximity;
}

.scrollbar > div:last-child {
  scroll-snap-align: end;
}

::-webkit-scrollbar {
  width: 4px;
  background-color: #212224;
  margin-right: auto;
}
::-webkit-scrollbar-thumb {
  background-color: #4d4d4d;
  border-radius: 8px;
}

.chat-title {
  font-weight: 600;
  font-size: 22px;
  line-height: 30px;
  margin-top: 24px;
  margin-left: 24px;
}

.input-field {
  display: flex;
  justify-content: space-between;
  padding-left: 24px;
  padding-right: 24px;
}

.text-field {
  background: #212224;
  width: 100%;
  color: #ffffff;
}

.text-field::placeholder {
  font-weight: 500;
  font-size: 16px;
  font-style: normal;
  line-height: 22px;
  color: #ffffff;
  opacity: 0.5;
}

.text-field:focus {
  outline: none;
  color: #ffffff;
}

.input-field {
}

hr {
  background: #323232;
  opacity: 0.2;
  border-radius: 8px;
  height: 1px;
  margin-bottom: 20px;
}
</style>
