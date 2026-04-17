<template>
  <div class="circle" :class="{ small }">
    <div class="flex flex-col items-center" :class="{ small }">
      <div class="level">{{ level }}</div>
      <div class="title">{{ title }}</div>
    </div>
    <div :class="{ small }">
      <img src="/assets/progress/progress.svg" class="progress" />
      <img :src="progress" class="progress" />
    </div>
  </div>
</template>

<script>
import Progress1 from '/assets/progress/Progress-1.svg'
import Progress2 from '/assets/progress/Progress-2.svg'
import Progress3 from '/assets/progress/Progress-3.svg'
import Progress4 from '/assets/progress/Progress-4.svg'
import Progress5 from '/assets/progress/Progress-5.svg'
import Progress6 from '/assets/progress/Progress-6.svg'
import Progress7 from '/assets/progress/Progress-7.svg'
import Progress8 from '/assets/progress/Progress-8.svg'
import Progress9 from '/assets/progress/Progress-9.svg'
import Progress10 from '/assets/progress/Progress-10.svg'

export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    level: {
      type: Number,
      required: true,
    },
    small: {
      type: Boolean,
      default: false,
    },
    needsScaling: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    progressBars: [Progress1, Progress2, Progress3, Progress4,
      Progress5, Progress6, Progress7, Progress8, Progress9, Progress10]
  }),

  methods: {
    scaleLevel() {
      return this.needsScaling ? Math.round(this.level * 2) : this.level
    }
  },

  computed: {
    progress() {
      const scaledLevel = this.scaleLevel()
      if (scaledLevel > 0 && scaledLevel < 11) {
        // TODO: maybe make do with dynamic imports or just move svgs to public...
        return this.progressBars[scaledLevel - 1]
      }

      return ''
    },
  },
}
</script>

<style>
.circle {
  width: 164px;
  height: 164px;
  display: flex;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  position: relative;
  padding-top: 41px;
  padding-bottom: 29px;
}

.circle.small {
  width: 29px;
  height: 29px;
  padding: 7.5px;
}

.level {
  @apply text-[56px] leading-[76px];
}

.small > .level {
  @apply text-[12px]  leading-3;
}

.title {
  @apply text-[14px] opacity-50 leading-[17px];
}

.progress {
  position: absolute;
  top: 4px;
  left: 4px;
}
.small > .progress {
  position: absolute;
  top: 1.5px;
  left: 1.5px;
  width: 26px;
}
</style>
