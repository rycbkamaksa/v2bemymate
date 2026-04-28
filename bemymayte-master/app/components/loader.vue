<template>
  <div ref="loader"></div>
</template>

<script>
import animationData from '/assets/json/loader.json'

export default {
  data: () => ({
    loaded: false,
  }),

  mounted() {
    this.tryLoadLottie()
    // FIXME: sometimes lottie fails to load on time
    setTimeout(this.tryLoadLottie, 100)
  },

  methods: {
    tryLoadLottie() {
      if (!this.loaded && window.lottie) {
        window.lottie?.loadAnimation({
          container: this.$refs.loader,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: animationData,
        })

        this.loaded = true
      }
    }
  },
}
</script>
