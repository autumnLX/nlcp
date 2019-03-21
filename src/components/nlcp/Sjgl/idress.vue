<template lang="pug">
  kmSelect(v-model="area[currentPro.id]" direction="row" multiple=true :queryText="queryText" :showBorder="false" @change="change")
    div.idress
      ul.pro
        li
          span(@click.self="closeCity") 全部
          i.iconfont &#xe638;
        li(v-if="currentPro.name")
          span {{currentPro.name}}
          i.iconfont &#xe638;
      div.options
        div(v-show="!currentPro.name")
          span.span_pro(v-for="(item, index) in pro" @click="showCity(item)" :key="index" :class="{active:has(item)}") {{item.name}}
            i.num {{area[item.id] ? (area[item.id].length || '') : ''}}
        div.citys(v-show="currentPro.name")
          select-all-button(:value="currentPro" v-model="all[currentPro.id]" :label="currentPro.name" @change="handleChange")
          select-option(v-for="(item, index) in city" :value="item" :label="item.name" :key="index" :disabled="!!all[currentPro.id]")
</template>

<script>
import $ from '@/utility/dollar.js'
import kmSelect from './select'
import selectOption from './select-option'
import selectAllButton from './select-all-button'
export default {
  components: { kmSelect, selectOption, selectAllButton },
  data () {
    return {
      area: {},
      pro: [],
      city: [],
      currentPro: {},
      all: {}
    }
  },
  model: {
    prop: 'Area',
    event: 'input'
  },
  props: {
    Area: {
      default () {
        return {}
      }
    },
    lastArea: ''
  },
  methods: {
    showCity (item) {
      this.currentPro = item
      this.city = item.city
    },
    has (item) {
      return this.area[item.id] && this.area[item.id][0] && this.area[item.id][0].id === item.id
    },
    change () {
      delete this.area[undefined]
      this.$emit('input', this.area)
    },
    handleChange (v) {
      this.area[this.currentPro.id] = v ? [this.currentPro] : []
      this.change()
    },
    closeCity () {
      this.currentPro = {}
      this.city = []
    }
  },
  computed: {
    queryText () {
      const y = []
      for (let i in this.area) {
        if (i) {
          this.area[i].forEach(element => {
            y.push(element.name)
          });
        }
      }
      return y.join('、')
    }
  },
  mounted () {
    $.get('/WebCompetition/getRegion', { province_id: 'all' }, (res) => {
      const _arr = JSON.parse(this.lastArea || '[]')
      console.log(_arr)
      this.pro = res.data
      let y = {}
      let provinceData = {} // 省数据
      let all = {}
      _arr.forEach(item => {
        provinceData = this.pro.filter(province => province.id == item.province)[0]
        if (!+item.city) {
          y[item.province] = [provinceData]
          all[item.province] = [provinceData]
        } else {
          y[item.province] = (y[item.province] || []).concat(provinceData.city.filter(ele => item.city === ele.id))
        }
      })
      this.all = all
      this.area = y
      this.$emit('input', this.area)
    })
  },
}
</script>

<style lang="less" scoped>
.pro {
  display: flex;
  position: relative;
  z-index: 50;
  background: white;
  li {
    position: relative;
    line-height: 30px;
    top: 1px;
    cursor: pointer;
    border: 1px solid #d9d9d9;
    span {
      display: inline-block;
      padding-left: 10px;
    }
    .iconfont {
      margin: 0 10px;
    }
  }
}
.span_pro {
  display: inline-block;
  padding: 0 10px;
  line-height: 20px;
  color: #21bd73;
  cursor: pointer;
  margin-bottom: 4px;
}
.span_pro:hover {
  background: #f2f9f6;
}
.span_pro.active {
  background: #24cc7c;
  color: white;
}
.num {
  background: #24cc7c;
  color: white;
  text-align: center;
  font-style: normal;
  margin-left: 4px;
  padding: 0 4px;
}
.num:empty {
  margin-left: 0;
  padding: 0;
}
.idress {
  background: #fcfcfc;
}
.options {
  border: 1px solid #d9d9d9;
  position: relative;
  z-index: 30;
  min-height: 160px;
  padding: 10px 0;
}
li:last-child {
  background: #fcfcfc;
  border-bottom-color: white !important;
}
.active .num {
  display: none
}
</style>

