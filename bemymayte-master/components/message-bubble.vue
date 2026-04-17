<template>
  <div class="message-content">
    <UserAvatar v-show="!isYourMessage && !system" class="user-avatar" :img="player.img"/>
    <div
      class="message-container"
      :class="{
      'message-container-own': isYourMessage,
      'message-container-others': !isYourMessage,
      'system-message': system,
    }"
    >
      <div class="flex justify-between mb-1">
        <p class="nickname "
        :class="player.role">
          {{player.nickname}}
        </p>
        <p class="time">{{time}}</p>
      </div>
      <p v-if="system" class="text-message" v-html="message"></p>
      <p v-else class="text-message">{{message}}</p>
    </div>
  </div>
</template>

<script >
import {Player} from "~/models";
import UserAvatar from "~/components/user-avatar";
import { useUserStore } from '~/store/user'

export default {
  name: "message-bubble",
  components: {UserAvatar},
  setup() {
    return {
      user: useUserStore(),
    }
  },
  props: {
    system: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    player: {
      type: Player,
      required: true,
    }
  },
  data() {
    return {
      isYourMessage: this.user.$state.nickname === this.player.nickname,
    }
  },
}
</script>

<style scoped>

* {
  font-style: normal;
}

.message-content {
  display: flex;
  width: 638px;
  padding-left: 24px;
  padding-right: 24px;
  justify-content: flex-end;
}

.message-container {
  padding: 8px 12px 12px 12px;
  background: #323232;
  border-radius: 8px;
}

.message-container-own {
  min-width: 60%;
  max-width: 100%;
}

.message-container-others {
  width: 100%;
}

.nickname {
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
}

.Entry {
  color: #1BB4FA;
}

.Support {
  color: #9557FF;
}

.Lurker {
  color: #FA627D;
}

.Anchor {
  color: #5772FF;
}

.IGL {
  color: #FFC800;
}

.user-avatar {
  width: 44px;
  height: 44px;
  border: none;
  margin-right: 8px;
}

.time {
  font-weight: 500;
  font-size: 14px;
  line-height: 19px;
  opacity: 50%;
}

.system-message {
  border: 1px dashed #BFBFBF;
  white-space: break-spaces;
}

.text-message {
  word-wrap: break-word;
}

</style>
