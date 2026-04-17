<template>
  <div class="flex justify-between items-center">
        <span>
          <img class="inline mb-1 mr-2" src="/left-arrow.svg"/>
          <ButtonText @click="back">Назад</ButtonText>
        </span>

    <ButtonPrimary v-if="buttonPrimary" :disabled="isNextDisabled" @click="next" class="button-paddings">
      Продолжить
    </ButtonPrimary>
    <ButtonSecondary v-else @click="next" :disabled="isNextDisabled" class="button-paddings">
      Продолжить
    </ButtonSecondary>
  </div>
</template>

<script>
import ButtonSecondary from "../buttons/secondary";
import ButtonPrimary from "../buttons/primary";
import ButtonText from "../buttons/text";

export default {
  name: "RegFooter",
  components: {ButtonText, ButtonPrimary, ButtonSecondary},
  props: {
    isNextDisabled: {
      type: Boolean,
      default: false,
    },
    buttonPrimary: {
      type: Boolean,
      default: false,
    }
  },
  emits: ['next', 'back'],
  methods: {
    next() {
      this.$emit('next')
    },
    back() {
      this.$emit('back')
    }
  }
}
</script>

<style scoped>
.button-paddings {
  padding: 18px 36px;
}
</style>
