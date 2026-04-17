<template>
  <div class="auth-layout">
    <Container class="purple-smoke p-8" v-if="currentStep < 4">

      <RegHeader :step="currentStep" :hint="currentHint"/>

      <CardField v-if="currentStep === 1" v-model="form.main_role" :cards="['Rifler', 'AWP']" class="flex gap-4 mb-10"/>
      <RegSecondStep v-if="currentStep === 2" :main-role="form.main_role" v-model="form.secondary_roles"/>

      <div v-if="currentStep === 3" class="w-[443px] items-center grid grid-cols-2 gap-y-6 mb-10">
        <div>Пол</div>
        <RegGender v-model="form.gender"/>

        <div>Город</div>
        <TextInput placeholder="Название" v-model="form.city"/>
      </div>

      <RegFooter @back="back" @next="next" :is-next-disabled="isNextDisabled" :button-primary="isLastStep"/>
    </Container>

    <RegFinalStep v-else :city="form.city" :gender="form.gender" />
  </div>
</template>

<script lang="ts">
import {definePageMeta} from '#imports'
import type {IUserRegData} from '~/types/user'
import {useRegDataStore, useUserStore} from '~/store/user'
import Container from '../components/container.vue'
import TextInput from '../components/text-input.vue'
import RegFooter from "../components/reg/RegFooter.vue";
import RegHeader from "../components/reg/RegHeader.vue";
import RegSecondStep from "../components/reg/RegSecondStep.vue";
import CardField from "~/components/card-field.vue";
import RegGender from "~/components/reg/RegGender.vue";
import RegFinalStep from "~/components/reg/RegFinalStep.vue";

const HINTS = [
  'Выбери основную роль',
  {
    AWP: 'Выбери одну тактическую роль',
    Rifler: 'Выбери две тактические роли',
  },
  'Заполни данные о себе',
]

export default {
  components: {
    RegFinalStep,
    RegGender,
    CardField,
    RegSecondStep,
    RegHeader,
    RegFooter,
    Container,
    TextInput,
  },
  setup() {
    definePageMeta({
      layout: 'auth',
    })

    const userStore = useUserStore()
    const regDataStore = useRegDataStore()

    return {userStore, regDataStore}
  },
  mounted() {
    if (!this.userStore.$state.authenticated) useRouter().push('/login')
  },
  data() {
    return {
      currentStep: 1,
      form: {
        main_role: null,
        secondary_roles: [],
        gender: null,
        city: null,
      } as IUserRegData,
    }
  },
  computed: {
    currentHint() {
      const hint = HINTS[this.currentStep - 1]
      return this.currentStep === 2 ? hint[this.form.main_role] : hint
    },
    isNextDisabled() {
      return (this.currentStep === 1 && !this.form.main_role) ||
          (this.currentStep === 2 && (
              (this.isAwp && !this.form.secondary_roles) ||
              (this.isRifler && this.form.secondary_roles.length !== 2)
          )) ||
          (this.currentStep === 3 && (
              !this.form.gender || !this.form.city
          ))
    },
    isLastStep() {
      return this.currentStep === 3
    },
    isAwp() {
      return this.form.main_role === 'AWP'
    },
    isRifler() {
      return this.form.main_role === 'Rifler'
    }
  },
  methods: {
    back() {
      if (this.currentStep === 1) {
        this.$router.back()
      } else {
        this.currentStep--
      }
    },
    next() {
      this.currentStep += 1

      if (this.currentStep === 2) {
        if (this.isRifler) {
          this.form.secondary_roles = []
        }
        if (this.isAwp) {
          this.form.secondary_roles = null
        }
      } else if (this.currentStep === 4) {
        this.regDataStore.$patch(this.form)
      }
    },
  },
}
</script>
