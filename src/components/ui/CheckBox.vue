<template>
  <div class="checkbox" :class="{ active: value }" @click="$emit('update')">
    <div class="checkbox-indicator"></div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
    },
  },
};
</script>

<style lang="scss" scoped>
.checkbox {
  position: relative;
  width: 36px;
  height: 20px;
  background: #2a2835;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 18px;
  transition: all 0.3s ease;
  cursor: pointer;

  &.active {
    background: linear-gradient(90deg, #9df4ff 0%, #7981ff 100%);
    border: transparent;

    .checkbox-indicator {
      left: calc(100% - 3px);
      transform: translateY(-50%) translateX(-100%);
    }
  }
}

.checkbox-indicator {
  width: 14px;
  height: 14px;
  box-shadow: 0px 4px 5px -1px rgba(0, 0, 0, 0.08);
  border-radius: 18px;
  background: #fff;
  position: absolute;
  top: calc(50%);
  left: 3px;
  transform: translateY(-50%);
  transition: all 0.3s ease;
}
</style>
