<template>
  <div class="auth-layout">
    <div class="max-w-[1440px] flex justify-center items-center">
      <div class="w-[672px] mr-[24px]">
        <h1 class="text-[56px] leading-[76px] font-bold mr-[78px] mb-[24px]">
          Здесь находят тиммейтов
        </h1>
        <div class="font-normal">
          Авторизуйся на платформе через FACEIT, поднимай свой уровень<br />
          и найди команду профессиональных игроков
        </div>
      </div>
      <Container class="pt-12 px-11 pb-14 w-[448px]" smoke>
        <h2 class="pb-8 font-semibold text-3xl text-center">Авторизация</h2>
        <a :href="`${loginState.hasCache ? '#' : loginLink}`">
          <ButtonPrimary arrow class="w-[360px]" @click="checkToken">
            {{ loginState.buttonText }}
          </ButtonPrimary>
        </a>

        <div v-if="loginState.hasCache" class="Separator">
          <span class="font-normal">или</span>
        </div>

        <a v-if="loginState.hasCache" :href="loginLink">
          <ButtonSecondary class="w-[360px]">
            Войти с другой учетной записью
          </ButtonSecondary>
        </a>
      </Container>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IUser } from '~/types/user'
import { LS_KEYS } from '~/consts'
import Container from '../components/container.vue'
import ButtonPrimary from '../components/buttons/primary.vue'
import ButtonSecondary from '../components/buttons/secondary.vue'
import { useRegDataStore, useUserStore } from '~/store/user'
import jwtDecode from 'jwt-decode'
import { onMounted, reactive, computed } from 'vue'
import { $fetch } from 'ohmyfetch'

definePageMeta({
  layout: 'auth',
})

type ILoginUserState = Pick<IUser, 'nickname' | 'email'>
const code = useRoute().query.code
const { clientId } = useRuntimeConfig().public
const userStore = useUserStore()
const regDataStore = useRegDataStore()
const router = useRouter()
const loginState = reactive({
  user: null as ILoginUserState,
  hasCache: computed(() => loginState.user !== null),
  buttonText: computed(() =>
    !loginState.hasCache
      ? 'Войти через FACEIT'
      : `Продолжить как ${loginState.user.nickname}`
  ),
})

const loginLink =
  'https://accounts.faceit.com/?' +
  `client_id=${clientId}` +
  '&response_type=code' +
  '&redirect_popup=true'

const checkToken = async () => {
  if (loginState.hasCache) {
    const { acknowledged } = await $fetch<{ acknowledged }>(
      '/api/tokens/check',
      {
        params: {
          email: loginState.user.email,
        },
      }
    )

    if (!acknowledged) {
      alert(`Пользователь ${loginState.user.nickname} не найден, попробуйте войти в другую учетную запись`)
    } else {
      await router.push('/')
    }
  }
}

const requestToken = async () => {
  // запрашиваем авторизацию через faceit для новых пользователей
  const { id_token, reg_completed } = await $fetch<{ id_token; reg_completed }>(
    '/api/tokens/issue',
    {
      params: {
        code,
      },
    }
  )

  userStore.$state.authenticated = true

  // юзер зареган => jwt в localStorage,
  // иначе => в стейт регистрационных данных
  if (!reg_completed) {
    regDataStore.$state.jwt = id_token
    // подчищаем старого пользователя, если он был
    userStore.removeStoredUser()
    userStore.$patch(jwtDecode(id_token) as IUser)
    await router.push('/reg')
  } else {
    localStorage.setItem(LS_KEYS.jwt, id_token)
    await router.push('/')
  }
}

onMounted(async () => {
  if (code) {
    await requestToken()
  } else {
    loginState.user = userStore.getStoredUser()
  }
})
</script>

<style scoped>
.Separator {
  margin: 26px 0;
  position: relative;
  display: flex;
  align-items: center;
  text-align: center;
}
.Separator::before {
  content: '';
  width: 100%;
  border-bottom: 1px solid #4d4d4d;
}

.Separator > span {
  width: 48px;
  height: 22px;

  position: absolute;
  left: calc(50% - 24px);

  background: #212224;

  font-size: 16px;
  line-height: 20px;
}
</style>
