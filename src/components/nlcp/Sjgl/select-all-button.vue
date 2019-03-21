<template lang="pug">
div
  div.select_options(:class="{disabled:disabled,checked:checkAll,noCheckBox:!select.showCheckBox,d_row: select.direction !== 'column'}" @click="clickHandle")
    slot
      div
        span(v-if="select.showCheckBox")
          i.iconfont(v-show="!checkAll") &#xe71c;
          i.iconfont.checked(v-show="checkAll") &#xe75d;
        span {{label || value}}
</template>

<script>
import emitter from './emitter.js'
export default {
  inject: ['select'],
  mixins: [emitter],
  model: {
    prop: 'checkAll',
    event: 'change'
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      required: true
    },
    checkAll: {
      type: Boolean,
      required: true,
      default: false
    },
    label: ''
  },
  methods: {
    clickHandle () {
      this.$emit('change', !this.checkAll)
    },
    setLabel (v) {
      if (v) {
        this.dispatch('kmSelect', 'selectAll', this.label || this.value)
      } else {
        this.dispatch('kmSelect', 'selectAll', '')
      }
    }
  },
  watch: {
    checkAll (v) {
      this.setLabel(v)
    }
  },
  mounted () {
    this.setLabel(this.checkAll)
  }
}
</script>

<style lang="less" scoped>
.select_options {
  cursor: pointer;
  margin-left: 10px;
  display: inline-block;
}
i.iconfont {
  font-size: 20px;
  color: #24cc7c;
  background: white;
}
i.checked {
}
.d_row {
  padding: 0 6px;
  color: #21bd73;
  margin-left:4px;
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
