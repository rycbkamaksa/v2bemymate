<template>
  <img :src="img" class="w-16 h-16 rounded-full border-2 border-grey-56"  alt="Avatar"/>
</template>

<script>
export default {
  props: {
    img: {
      type: String,
      required: true,
    },
  },
}
</script>
