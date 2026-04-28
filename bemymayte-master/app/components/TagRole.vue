<template>
  <span :class="roleClass">
    {{ tagText }}
  </span>
</template>

<script>
export default {
  name: 'TagRole',
  props: {
    role: String,
  },
  computed: {
    roleClass() {
      switch (this.role) {
        case 'AWP': {
          return ['tag', 'black']
        }
        case 'Rifler': {
          return ['tag', 'black']
        }
        case 'Entry': {
          return ['tag', 'blue']
        }
        case 'Support': {
          return ['tag', 'purple']
        }
        case 'Lurker': {
          return ['tag', 'red']
        }
        case 'Anchor': {
          return ['tag', 'dark-blue']
        }
        case 'IGL': {
          return ['tag', 'yellow']
        }
      }
      return 'tag'
    },
    tagText() {
      if (this.role === 'AWP') return 'A'
      if (this.role === 'Rifler') return 'R'
      return this.role
    },
  },
}
</script>

<style scoped>
.tag {
  min-width: 25px;
  min-height: 20px;
  text-align: center;
  border-radius: 6px;
  padding: 0px 8px;
  margin-right: 4px;
}
.black {
  background-color: #212224;
}
.blue {
  background-color: #1bb4fa;
}
.purple {
  background-color: #9557ff;
}
.red {
  background-color: #fa627d;
}
.dark-blue {
  background-color: #5772ff;
}
.yellow {
  background-color: #ffc800;
  color: #0e0f11;
}
</style>
