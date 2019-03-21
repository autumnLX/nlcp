<template lang="pug">
  div.select_warp(v-clickoutside="close")
    div.input_warp(v-if="showInput")
      div
        km-input(
          disabled=true
          @click.native="handleClick"
          :value="inputText"
          :showBorder="false"
          )
      i.iconfont(:class="{roate:show, roateup:show === false}") &#xe638;
    div.options_warp(v-show="show||!showInput" :class="{showBorder:showBorder}")
      slot
</template>

<script>
import clickoutside from './clickoutside.js'
import kmInput from './km-input'
export default {
  name: 'kmSelect',
  props: {
    value: {
      required: true
    },
    multiple: {
      default: false
    },
    showCheckBox: {
      default: false
    },
    separator: {
      type: String,
      default: ','
    },
    direction: {
      default: 'column'
    },
    showInput: {
      default: true
    },
    queryText: {
      type: String
    },
    showBorder: {
      default: true
    }
  },
  data () {
    return {
      show: 0,
      query: '',
      queryAll: '',
      queryList: [],
      flag: Symbol('label')
    }
  },
  computed: {
    inputText () {
      return this.queryText || this.queryAll || this.query
    }
  },
  provide () {
    return {
      'select': this
    }
  },
  directives: { clickoutside },
  components: { kmInput },
  methods: {
    handleClick () {
      this.show = !this.show
    },
    close () {
      if (this.show) {
        this.show = false
      }
    },
    getOptionIndex (arr = [], value) {
      return arr.indexOf(value)
    },
    handleSelect (options, ispush) {
      let value
      options.value[this.flag] = options.label || options.value
      if (this.multiple) {
        value = (this.value || []).slice()
        const optionIndex = this.getOptionIndex(this.value, options.value)
        if (optionIndex > -1 && !ispush) {
          value.splice(optionIndex, 1)
        }
        if (optionIndex === -1 && ispush) {
          value.push(options.value)
        }
        this.$emit('input', value)
        this.$emit('change', value)
        this.query = value.map(item => item[this.flag]).join(this.separator)
      } else {
        if (ispush) {
          value = options.value
          this.query = value[this.flag]
          this.$emit('input', value)
          this.$emit('change', value)
          // 防止第一次非手动点击
        }
        this.close()
      }
    }
  },
  created () {
    this.$on('select', this.handleSelect)
    this.$on('selectAll', (a) => {
      this.queryAll = a
    })
  }
}
</script>

<style lang="less" scoped>
.select_warp {
  height: 100%;
  width: 100%;
  position: relative;
}
.options_warp {
  position: absolute;
  background: white;
  width: 100%;
  min-height: 150px;
  max-height: 250px;
  overflow: auto;
  box-sizing: border-box;
  z-index: 200;
}
.showBorder {
  border: 1px solid #d3d3d3;
}
.input_warp {
  display: flex;
  align-items: center;
  height: 100%;
  border: 1px solid #d3d3d3;
  box-sizing: border-box;
  > div {
    flex: 1;
    height: 100%;
  }
}
.row {
  display: flex;
}
input {
  background: white;
}
i {
  font-size: 12px;
  margin-right: 6px;
  color: #d3d3d3;
}
.roate {
  color: #24cc7c;
  animation: roate 0.5s forwards;
}
@keyframes roate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(180deg);
  }
}
.roateup {
  color: #d3d3d3;
  animation: roateup 0.5s forwards;
}
@keyframes roateup {
  from {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(0deg);
  }
}
</style>
