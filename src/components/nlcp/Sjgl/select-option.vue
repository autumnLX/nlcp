<template lang="pug">
  div.select_options(:class="{disabled: disabled, noCheckBox:!select.showCheckBox, checked: checked, d_row: select.direction !== 'column'}" @click="handleClick")
    slot
      div
        span(v-if="select.showCheckBox")
          i.iconfont(v-show="!checked") &#xe71c;
          i.iconfont.checked(v-show="checked") &#xe75d;
        span.content {{label || value}}
</template>

<script>
import emitter from './emitter.js'
export default {
  inject: ['select'],
  mixins: [emitter],
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      required: true
    },
    label: ''
  },
  data () {
    return {
      isByClick: false
    }
  },
  methods: {
    handleClick () {
      if (!this.disabled) {
        this.isByClick = true
        this.dispatch('kmSelect', 'select', [this, !this.checked])
      }
    },
    contains (arr = [], value) {
      if (this.select.multiple) {
        return arr.includes(value)
      }
      return this.select.value === this.value
    }
  },
  computed: {
    checked () {
      return !this.disabled && this.contains(this.select.value, this.value)
    }
  },
  watch: {
    checked: {
      immediate: true,
      handler () {
        if (this.isByClick) {
          this.isByClick = false
        } else {
          this.dispatch('kmSelect', 'select', [this, this.checked])
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.select_options {
  cursor: pointer;
  margin-top: 4px;
  padding-left: 10px;
  line-height: 20px;
}
i.iconfont {
  font-size: 20px;
  color: #24cc7c;
  background: white;
}
.d_row {
  display: inline-block;
  padding: 0 6px;
  color: #21bd73;
  margin-left: 4px;
  margin-right: 4px;
}
.disabled {
  cursor: not-allowed;
  color: #aaa;
}
.noCheckBox:hover {
  background: #f2f9f6;
}
.noCheckBox.checked {
  background: #24cc7c;
  color: white;
}
</style>
