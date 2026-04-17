<template>
  <div class="flex mt-12 w-full bg-grey-20 py-4 px-6 rounded-lg">
    <UserAvatar :img="user.$state.picture" />
    <div class="ml-5">
      <div class="flex items-center">
        <img class="w-8 h-8 p-1.5" :src="genderImage" :alt="gender">
        <div v-html="flag" class="user-card-flag"/>
        <b>{{ user.$state.nickname }}</b>
      </div>
      <div>{{ age }} года &nbsp; |&nbsp; г. {{ city }}</div>
    </div>
  </div>
</template>

<script setup>
import UserAvatar from "../user-avatar";
import {useUserStore} from "~/store/user";
import * as Flag from 'country-flag-icons/string/3x2'

import Male from '../../assets/genders/male.svg'
import Female from '../../assets/genders/female.svg'
import Unknown from '../../assets/genders/unknown.svg'

const props = defineProps({
  gender: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
})

const user = useUserStore()

const birthYear = user.$state.birthdate.split('/')[2]
const year = (new Date()).getFullYear()

const age = year - birthYear

const flag = Flag[user.$state.locale.toUpperCase()]

let genderImage
switch (props.gender) {
  case 'male':
    genderImage = Male
    break
  case 'female':
    genderImage = Female
    break
  case 'unknown':
    genderImage = Unknown
    break
}
</script>

<style>
.user-card-flag {
  @apply w-6 h-6 flex items-center rounded ml-2 mr-3
}

.user-card-flag > svg {
  @apply rounded
}
</style>
