<template lang='pug'>
  div.sjgl-area(@click.stop='')
    div.sjgl-area-tabs
      div(
        v-for="(lv, idx) in level" 
        :class="{active: activeLv === idx}" 
        :key="idx" 
        @click.stop='handleSelectLevel(idx)'
      ) {{ lv.text }}
    div.sjgl-area-box
      div.sjgl-area-list
        div.sjgl-area-item(
          v-for="(area, idx) in currentList" 
          :key="area.id"
          :class="{active: [level[0].id, level[1].id].indexOf(area.id) > -1}"  
          :title='area.name'
          @click.stop='handleSelectArea(area.id, area.name)'
        ) {{ area.name }}
</template>

<script>
export default {
  name: 'GradeSelect',
  props: ['token', 'record', 'isShow', 'list'],
  data() {
    return {
      level: [{ // 省
        text: '',
        id: '',
      }, { // 市
        text: '',
        id: '',
      }],
      activeLv: 0,
      currentList: [],
    }
  },
  methods: {
    handleCurrentList(list) {
      this.currentList.splice(0, this.currentList.length)
      list.forEach(el => {
        this.currentList.push({
          name: el.name,
          id: el.id
        })
      });
    },
    handleSelectLevel(idx) {
      this.activeLv = idx
      if (idx === 0) {
        this.handleCurrentList(this.list)
      } else if (idx === 1) {
        let clist
        for (let i = 0; i < this.list.length; i++) {
          if (this.level[0].id === this.list[i].id) {
            clist = (this.list[i].city.length > 1 ? [{
              name: '全省',
              id: -1
            }] : []).concat(this.list[i].city)
            this.handleCurrentList(clist)
            break
          }
        }
        let firstCity = clist[0]
        idx === 1 && this.handleSelectArea(firstCity.id, firstCity.name, true)
      }
    },
    handleSelectArea(id, name, keepSelect) {
      this.$set(this.level, this.activeLv, {
        text: name,
        id: id,
      })

      if (this.activeLv === 0) {
        this.handleSelectLevel(1, true)
      } else if (this.activeLv === 1) {
        let _id = parseInt(this.level[1].id) === -1 ? this.level[0].id : this.level[1].id
        let _txt = parseInt(this.level[1].id) === -1 ? this.level[0].text : (this.level[0].text + ' ' + this.level[1].text)

        typeof this.$listeners['on-select'] === 'function' && this.$listeners['on-select'](_txt, _id, this.level, 'area', keepSelect)
      }
    },
    init() {
      if (this.record && this.record.length > 0) {
        let that = this
        let _id = parseInt(this.record[1].id) === -1 ? this.record[0].id : this.record[1].id
        let _txt = parseInt(this.record[1].id) === -1 ? this.record[0].text : (this.record[0].text + ' ' + this.record[1].text)

        this.level.forEach((item, idx) => {
          that.$set(that.level, idx, Object.assign({}, that.record[idx]))
        })
        typeof this.$listeners['on-select'] === 'function' && this.$listeners['on-select'](_txt, _id, this.record, 'area')
      } else {
        this.activeLv = 0
        this.handleSelectArea(this.list[0] ? this.list[0].id : '', this.list[0] ? this.list[0].name : '')
      }
    }
  },
  watch: {
    isShow: function (val) {
      if (val) {
        this.handleSelectLevel(0)
      }
    },
  },
  mounted() {
  }
}
</script>

<style>
.sjgl-area {
  width: 650px;
  border: 1px solid #21bd73;
  background-color: #fff;
}
.sjgl-area-tabs {
  display: flex;
  height: 36px;
  border-bottom: 1px solid #ccf0df;
}
.sjgl-area-tabs > div {
  flex: 1;
  border-right: 1px solid #fff;
  border-left: 1px solid #fff;
  color: #666;
  text-align: center;
  line-height: 36px;
  cursor: pointer;
}
.sjgl-area-tabs > div.active {
  border-right-color: #ccf0df;
  border-left-color: #ccf0df;
  background-color: #f2fbf7;
}
.sjgl-area-box {
  padding: 20px 20px 10px;
  background-color: #f2fbf7;
}
.sjgl-area-list {
  display: flex;
  flex-wrap: wrap;
}
.sjgl-area-item {
  width: 25%;
  height: 26px;
  line-height: 26px;
  margin-bottom: 10px;
  padding: 0 10px;
  color: #666;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: left;
  box-sizing: border-box;
  cursor: pointer;
}
.sjgl-area-item.active {
  color: #fff;
  background-color: #21bd73;
}
</style>