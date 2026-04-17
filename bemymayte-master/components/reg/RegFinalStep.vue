<template>
  <Container
      class="w-[459px] flex flex-col justify-center items-center p-8"
  >
    <Logo class="text-center text-[34px]"/>
    <div class="relative w-[120px] flex items-center my-4">
      <div
          class="purple-smoke-xl h-8 w-8 rounded-full absolute rounded-full right-1/2 left-[35%]"
      />
      <img src="/fire.png" class="w-[120px] h-[120px] rounded-full z-10"/>
    </div>
    <div class="font-semibold text-3xl mb-1.5">Спасибо за регистрацию!</div>
    <div class="text-center leading-6" v-html="totalMatchesHint"/>
    <RegUserCard :city="city" :gender="gender"/>
    <ButtonPrimary arrow class="w-full mt-8" @click="finish">
      {{ totalMatchesButtonText }}
    </ButtonPrimary>
  </Container>
</template>

<script>
import {LS_KEYS, MATCH_REG_LIMIT} from '~/consts'
import Container from "../container";
import ButtonPrimary from '../buttons/primary'
import RegUserCard from '../reg/RegUserCard'
import {useUserStore, useRegDataStore} from "~/store/user";
import Logo from '../logo'

export default {
  name: "RegFinalStep",
  components: {Container, ButtonPrimary, RegUserCard, Logo},
  props: {
    city: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      totalMatches: null
    }
  },
  async setup() {
    const userStore = useUserStore()
    const regDataStore = useRegDataStore()

    return {userStore, regDataStore}
  },
  async mounted() {
    const {data: matchData, error: matchError} = await useFetch(`/api/users/${this.userStore.$state.guid}/data/total_matches`, {
      retry: false,
    })

    // может произойти, если у игрока мало / нет матчей на фейсите
    if (matchError.value !== null) {
      console.log("Failed to fetch player's matches count")
    }

    this.totalMatches = matchData.value

    const { jwt, ...patchData } = this.regDataStore.$state

    const {data: patchResp, error: patchError} = await useFetch(`/api/users/complete_reg`, {
      method: 'PATCH',
      server: false,
      body: patchData,
    })

    if (!patchResp.value.acknowledged || patchError.value !== null) {
      console.warn('Failed to register new user:', patchError.value)
    } else {
      localStorage.setItem(LS_KEYS.jwt, jwt)
      this.userStore.$state.registered = true
    }
  },
  computed: {
    totalMatchesHint() {
      return this.totalMatches >= MATCH_REG_LIMIT
          ? `У тебя больше ${MATCH_REG_LIMIT} матчей на faceit, <br /> поэтому ты нам подходишь`
          : `Чтобы воспользоваться сайтом, <br /> тебе нужно набрать ${MATCH_REG_LIMIT} матчей на FACEIT`
    },
    totalMatchesButtonText() {
      return this.totalMatches >= MATCH_REG_LIMIT ? 'ИСКАТЬ КОМАНДУ' : 'ПЕРЕЙТИ В ПРОФИЛЬ'
    }
  },
  methods: {
    finish() {
      this.$router.push('/profile')
    }
  }
}
</script>

<style scoped>

</style>
