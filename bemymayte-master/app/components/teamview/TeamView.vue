<template>
  <div id="team-review" class="bg-[#212224] rounded-[8px] flex flex-col items-center w-[1112px]">
    <table class="w-full h-full">
      <caption
        class="py-[34px] pl-[36px] font-semibold leading-[30px] text-[22px] text-left"
      >
        Поставь оценку своим тиммейтам
      </caption>
      <tbody align="left">
        <tr>
          <th class="pl-[24px] pb-[16px] text-head">Ник</th>
          <th class="pb-[16px] text-head">Игра на роли</th>
          <th class="pr-[24px] pb-[16px] text-head">Коммуникация</th>
        </tr>
        <tr
          class="border-collapse border border-gray-600 border-x-0 border-t-[1px] border-b-0"
          v-for="user in userRates"
          :key="user"
        >
          <td class="pl-[24px] w-[272px] py-[12px]">
            <p class="pb-[4px] font-normal leading-[24px] text-[14px]">
              {{ user.user.nickname }}
            </p>
            <TagRole :role="user.user.mainRole" />
            <TagRole :role="user.user.role" />
          </td>
          <td class="w-[460px] py-[12px]">
            <RadioGroup
              v-model:modelValue="user.roleRating"
              :name="`roleRating${user.user.nickname}`"
              :options="['Ужасно', 'Плохо', 'Средне', 'Хорошо', 'Отлично']"
            />
          </td>
          <td class="pr-[24px] py-[12px]">
            <RadioGroup
              v-model="user.toxicRating"
              :name="`toxicRating${user.user.nickname}`"
              :options="['Ужасно', 'Плохо', 'Средне', 'Хорошо', 'Отлично']"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pt-[20px] pb-[32px]">
      <ButtonSecondary
        id="rates-submit"
        @click="finish"
        class="px-[36px] !py-[18px] font-semibold leading-[24px] text-[16px]"
      >
        Подтвердить
      </ButtonSecondary>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue'
import TagRole from '../TagRole.vue'
import RadioGroup from './RadioGroup.vue'
import ButtonSecondary from '../buttons/secondary.vue'
import type { IRateMatchPayload } from '~/types/bemymateAPI/matches'
import { Player } from '~/models'
import { RoleRates } from '~/types/bemymateAPI/matches'
import { useUserStore } from '~/store/user'
import { wrapError } from '~/utils'

export default {
  name: 'TeamView',
  components: {
    RadioGroup,
    TagRole,
    ButtonSecondary,
  },
  setup() {
    const userStore = useUserStore()
    return { userStore }
  },
  props: {
    users: Array as PropType<Player[]>,
    matchId: String,
  },
  data() {
    return {
      userRates: this.users.map((user) => {
        return {
          user,
          roleRating: RoleRates.Ok,
          toxicRating: RoleRates.Ok,
        }
      }),
    }
  },
  emits: ['rate-finished'],
  methods: {
    async finish() {
      const matchRatePayload = {} as IRateMatchPayload
      this.userRates.forEach((userRate) => {
        matchRatePayload[userRate.user.guid] = {
          toxicRate: userRate.toxicRating,
          roleRate: userRate.roleRating,
        }
      })

      await wrapError($fetch(`/api/matches/${this.matchId}/rate`, {
        method: 'POST',
        params: {
          guid: this.userStore.$state.guid,
        },
        body: matchRatePayload,
      }), (err) => {
        console.error('Failed to send rates', err)
      })
      this.$emit('rate-finished')
    },
  },
}
</script>

<style scoped>
tbody tr:nth-child(even) {
  @apply bg-[#252728];
}
.text-head {
  @apply leading-[26px] text-[18px];
}
</style>
