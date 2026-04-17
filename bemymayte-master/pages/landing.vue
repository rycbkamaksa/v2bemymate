<template>
  <div class="auth-layout">
    <div class="max-w-[1440px] flex flex-col vtablet:flex-row justify-center items-center">
      <div class="w-[343px] flex flex-col items-center vtablet:items-start mobile:w-[375px] vtablet:w-[450px] tablet:w-[672px] mb-[40px] vtablet:mb-0 vtablet:mr-[24px] text-center vtablet:text-left">
        <h1 class="max-w-[552px] text-[28px] mobile:text-[35px] vtablet:text-[42px] tablet:text-[56px] leading-[38px] vtablet:leading-[76px] font-bold mb-[16px]">
          BEMYMATE - это новый способ найти себе стак
        </h1>
        <div class="max-w-[203px] mobile:max-w-[395px] vtablet:max-w-[552px] font-normal text-[18px] mobile:text-[22px]">
          <span class='hidden vtablet:block'>Ты сможешь регулярно играть и повышать уровень на своей игровой роли в CS:GO.</span>
          Присоединяйся <br class='block vtablet:hidden'/> к альфа-тестированию.
        </div>
      </div>
      <Container class="pt-[24px] mobile:pt-12 px-[24px] mobile:px-11 pb-8 mobile:pb-12 w-[343px] mobile:w-[375px] tablet:w-[448px]" smoke>
        <div v-if="!emailSent">
          <h2 class="pb-8 font-semibold leading-[24px] mobile:leading-[27px] text-[16px] mobile:text-xl text-center">
            Оставьте свои данные, чтобы участвовать в альфа-тестировании
          </h2>

          <form name='emailForm' @submit.prevent='sendEmail'>
            <text-input required type='email' placeholder="E-mail" v-model="email" class="w-full" />

            <ButtonPrimary arrow :disabled='isDisabled' class="h-[78px] w-full flex items-center justify-center mt-8">
              Оставить заявку
            </ButtonPrimary>
          </form>
        </div>

        <div v-else class="flex flex-col items-center">
          <Logo class="text-center text-[34px]" />
          <div class="relative w-[96px] mobile:w-[120px] flex items-center my-4 text-center">
            <div
              class="purple-smoke-xl h-8 w-8 rounded-full absolute rounded-full right-1/2 left-[35%]"
            />
            <img
              src="/fire.png"
              class="w-[96px] h-[96px] mobile:w-[120px] mobile:h-[120px] rounded-full z-10"
            />
          </div>
          <div class="font-semibold text-[20px] mobile:text-3xl text-center">
            Заявка принята!
          </div>

          <div class="bg-grey-20 p-3 mobile:py-4 mobile:px-5 rounded-lg mt-5 text-center">
            Вы получите письмо на почту сразу, как только сервис будет доступен
            для тестирования.
          </div>
        </div>

        <p class='text-center relative top-[20px]'>
          Продолжая, вы соглашаетесь <br /> с
          <a rel='noopener' target='_blank' href='/Политика_в_отношении_обработки_персональных_данных.pdf' class='text-purple'>политикой конфиденциальности</a>
        </p>
      </Container>
    </div>
  </div>
</template>

<script setup lang='ts'>
import ButtonPrimary from '../components/buttons/primary.vue'
import { computed } from 'vue'

const email = ref('')
const emailSent = ref(false)
const isDisabled = computed(() => email.value === '')

async function sendEmail() {
  const { success } = await $fetch<{ success: boolean }>('/api/send_email', {
    params: {
      email: email.value,
    },
  })

  // TODO: привязаться к success
  emailSent.value = true
}

definePageMeta({
  layout: 'auth',
})
</script>
