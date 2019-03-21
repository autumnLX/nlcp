<template lang='pug'>
  div.sjgl-filter.sjgl-block
    div.sjgl-filter-content
      div.sjgl-filter-row
        div.sjgl-filter-row-selectBox(v-if='category === "2"')
          span.sjgl-filter-row-left 适用地区：
          div.sjgl-filter-row-select
            span(
              :title='selected.area'
              @click.stop='handleShowSelect("area")'
            ) {{ selected.area }}
            AreaSelect(
              ref='selectA'
              v-show='selectType === "area"'
              token='area'
              :record='regionD'
              :isShow='selectType === "area"'
              :list='regionList'
              @on-select='handleSelect'
            )
        div.sjgl-filter-row-selectBox(v-if='category === "1"')
          span.sjgl-filter-row-left 适用教材：
          div.sjgl-filter-row-select
            span(
              @click.stop='handleShowSelect("press")'
            ) {{ selected.press || '全部' }}
            PressSelect(
              ref='selectP'
              v-show='selectType === "press"'
              token='press'
              :record='peperSetting[category] ? peperSetting[category].textbook : {}'
              :onSelect='handleSelect'
              :list='textbookList'
            )
        div.sjgl-filter-row-selectBox
          span.sjgl-filter-row-left 适用年级：
          div.sjgl-filter-row-select
            span(
              @click.stop='handleShowSelect("grade")'
            ) {{ selected.grade || '全部' }}
            GradeSelect(
              ref='selectG'
              v-show='selectType === "grade"'
              token='grade'
              :record='peperSetting[category] ? peperSetting[category].volume : {}'
              :onSelect='handleSelect'
              :list='gradeList'
            )
      div.sjgl-filter-row
        span.sjgl-filter-row-left 试卷类型：
        div.sjgl-filter-row-radioBox
          span(
            v-for='type in types'
            :key='type.paperTypeId'
            :class='{active: returnData.paperTypeId === (type.paperTypeId === "-1" ? "" : type.paperTypeId) }'
            @click='handleSelectType(type.paperTypeId, type.cmpCatgId)'
          ) {{ type.paperTypeName }}
      div.sjgl-filter-row
        span.sjgl-filter-row-left 试卷来源：
        div.sjgl-filter-row-radioBox
          span(
            v-for='source in paperSource'
            :key='source.paperSourceId'
            :class='{active: returnData.paperSourceId === source.paperSourceId }'
            @click='handleSelectSource(source.paperSourceId)'
          ) {{ source.paperSourceName }}
</template>

<script>
import $ from '@/utility/dollar.js'
import GradeSelect from '@/UIs/GradeSelect'
import PressSelect from '@/UIs/PressSelect'
import AreaSelect from '@/UIs/AreaSelect'

export default {
  name: 'sjgl-filter',
  components: { GradeSelect, PressSelect, AreaSelect },
  props: ['category', 'types'],
  inject: {
    setSetting: { default: () => {} }
  },
  data() {
    return {
      selectType: '',
      selected: {
        area: '',
        press: '',
        grade: '',
      },
      returnData: {
        volumeId: '', // 年级
        textbookId: '', // 教材
        areaId: '', // 地区
        paperCatgId: '', // 筛选类型 同步教材、听说考试
        paperSourceId: '', // 试卷来源
        paperTypeId: '', // 试卷类型
        cmpCatgId: '', // 大赛类型  测评作业、听说考试、自学试卷、定制测评
      },
      areaRecord: '', // 地区的记录json
      paperSource: [], // 来源
      peperSetting: {}, // 储存的筛选条件
      regionD: [], // 地区的记录
      regionList: [],
      textbookList: [],
      gradeList: [],
      preventSelect: false,
      isInit: false, // 是否初始化好
    }
  },
  methods: {
    initData (cat) {
      this.preventSelect = true
      this.returnData = Object.assign({}, {
        volumeId: '',
        textbookId: '',
        areaId: '',
        paperCatgId: cat,
        paperSourceId: '',
        paperTypeId: '',
        cmpCatgId: '',
      })
      this.$refs.selectA && this.$refs.selectA.init()
      this.$refs.selectP && this.$refs.selectP.init()
      this.$refs.selectG.init()

      let record = this.peperSetting[this.category]
      if (record) {
        this.types.length && this.handleSelectType(record.paperType.id, record.cmpCatgId)
        this.paperSource.length && this.handleSelectSource(record.paperSource.id)
      } else {
        this.types.length && this.handleSelectType(this.types[0].paperTypeId, this.types[0].cmpCatgId)
        this.paperSource.length && this.handleSelectSource(this.paperSource[0].paperSourceId)
      }

      this.preventSelect = false
      this.isInit = true
      this.$emit('doFilter', this.returnData)
    },
    handleFilter (obj) {
      let arr = Object.prototype.toString.call(obj) === '[object Array]' ? obj : []
      arr.forEach(el => {
        this.$set(this.returnData, el.key, el.val)
      });

      this.setSetting({
        paperCatgId: this.returnData.paperCatgId,
        volumeId: this.returnData.volumeId,
        textbookId: this.returnData.textbookId,
        paperSourceId: this.returnData.paperSourceId,
        paperTypeId: this.returnData.paperTypeId,
        regionData: this.areaRecord
      })

      !this.preventSelect && this.$emit('doFilter', this.returnData)
    },
    handleSelect (val, id, record, type, keepSelect) {
      this.$set(this.selected, this.selectType, val)

      if (type === 'area') {
        this.areaRecord = JSON.stringify(record)
        this.$set(this.selected, 'area', val)
        this.handleFilter([{val: id, key: 'areaId'}])
      } else if (type === 'press') {
        this.$set(this.selected, 'press', val)
        this.handleFilter([{val: id, key: 'textbookId'}])
      } else if (type === 'grade') {
        this.$set(this.selected, 'grade', val)
        this.handleFilter([{val: id, key: 'volumeId'}])
      }

      if (!keepSelect) this.selectType = ''
    },
    handleShowSelect (key, evt) {
      this.selectType = key
    },
    getPaperSource () { // 获取试卷来源
      return new Promise((resolve) => {
        $.get('/paperConfigure/getPaperSource', {}, (res) => {
          if (res.status === 1) {
            resolve(res.data)
          } else {
            alert(res.info)
          }
        })
      })
    },
    getRegion () {
      return new Promise((resolve) => {
        $.get('/webCompetition/getRegion', {
          province_id: 'all'
        }, (res) => {
          if (res.status === 1) {
            resolve(res.data)
          } else {
            alert(res.info)
          }
        })
      })
    },
    getTextbook () {
      return new Promise((resolve) => {
        $.get('/Papers/getPaperTextbook', {
          type: 0,
          flag: 0
        }, (res) => {
          if (res.status === 1) {
            resolve(res.data)
          }
        })
      })
    },
    getGrade () {
      return new Promise((resolve) => {
        $.get('/Papers/getPaperVolume', {
          type: 0,
          flag: 0,
          doubleGrade: 1,
        }, (res) => {
          if (res.status === 1) {
            resolve(res.data)
          }
        })
      })
    },
    readPaperSetting () { // 读取筛选条件
      return new Promise((resolve) => {
        $.get('/paperConfigure/readPaperFavoriteSetting', {
        }, (res) => {
          if (res.status === 1) {
            resolve(res.data)
          } else {
            alert(res.info)
          }
        })
      })
    },
    handleSelectType (id, cmpCatgId) {
      this.handleFilter([{val: id === '-1' ? '' : id, key: 'paperTypeId'}, {val: cmpCatgId, key: 'cmpCatgId'}])
    },
    handleSelectSource (id) {
      this.handleFilter([{val: id, key: 'paperSourceId'}])
    },
    handleAllOption(ps) {
      let psTmp = Object.assign({}, ps)

      for (let k in psTmp) {
        let item = psTmp[k]
        if (item) {
          for (let key in item) {
            if (['paperType', 'textbook', 'volume'].indexOf(key) > -1 && parseInt(item[key].id) === 0) {
              item[key] = {
                id: '-1',
                text: '全部'
              }
            }
          }
        }
      }

      Object.assign(this.peperSetting, psTmp)
      if (this.peperSetting[2]) this.regionD = [].concat(this.peperSetting[2].regionData)
    },
  },
  watch: {
    category: function (val, oVal) {
      if (this.isInit) {
        this.$nextTick(() => {
          this.initData(val)
        })
      }
    },
  },
  created() {
    (async () => {
      let psTmp = await this.readPaperSetting()
      this.handleAllOption(psTmp)
      this.regionList = await this.getRegion()
      this.textbookList = await this.getTextbook()
      this.gradeList = await this.getGrade()
      this.paperSource = await this.getPaperSource()
      this.initData(this.category)
    })()
  },
  mounted() {
    window.addEventListener('click', () => {
      this.selectType = ''
    })
  }
}
</script>

<style lang="less">
@image-base-url: "../../../assets/nlcp";
.sjgl-filter {
  background: #fff;
  margin-bottom: 10px;

  .sjgl-filter-content {
    display: flex;
    flex-direction: column;
    padding: 30px 30px 10px;

    .sjgl-filter-row {
      height: 24px;
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .sjgl-filter-row-left {
        width: 70px;
        color: #999;
      }

      .sjgl-filter-row-selectBox {
        display: flex;

        .sjgl-filter-row-select {
          min-width: 170px;
          display: flex;
          position: relative;
          margin-right: 10px;

          & > span {
            display: inline-block;
            padding: 0 12px 0 5px;
            color: #21bd73;
            background: url("/css/images/list_arrowgreen.png") no-repeat right center;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            cursor: pointer;
          }

          & > div {
            position: absolute;
            top: 24px;
            left: 0;
            z-index: 10;
          }
        }
      }

      .sjgl-filter-row-radioBox {
        span {
          padding: 0 10px;
          margin-right: 10px;
          color: #666;
          cursor: pointer;
        }

        span.active {
          background: #21bd73;
          color: #fff;
          border-radius: 2px;
        }
      }
    }
  }
}
</style>