<template>
  <div class="grade-select" @click.stop=''>
    <div class="grade-select-tabs">
      <div 
        v-for="(stage, idx) in list1" 
        :class="{active: idx === activeIdx1}" 
        :key="'stage_' + idx" 
        @click.stop='handleSelectStage(idx)'>{{ stage }}</div>
    </div>
    <div class="grade-select-grades">
      <div class="grade-select-grade-container">
        <div class="grade-select-grade" :class="{active: activeId2 === -1}" @click='handleSelectGrade("全部", -1)'>全部</div>
        <div
          class="grade-select-grade" 
          :class="{active: grade.id === activeId2}"  
          v-for="(grade, idx) in list2tmp" 
          :key="'grade_' + idx"
          @click.stop='handleSelectGrade(grade.volumeName, grade.id)'>{{ grade.volumeName }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GradeSelect',
  props: ['token', 'record', 'onSelect', 'list'],
  data() {
    return {
      list1: ['小学', '初中', '高中'], // 对应type为 1 2 3
      activeIdx1: 0,
      activeId2: -1,
      gradeType: '1',
      gradeList: [],
    }
  },
  computed: {
    list2tmp: function () {
      return this.gradeList ? (this.gradeList[this.gradeType] || []) : []
    },
  },
  methods: {
    handleSelectStage(idx) {
      this.activeIdx1 = idx
      this.gradeType = idx + 1 + ''
    },
    handleSelectGrade(val, id) {
      this.activeId2 = id
      typeof this.onSelect === 'function' && this.onSelect(id === -1 ? '' : (val || ''), id === -1 ? '' : (id || ''), '', 'grade')
    },
    init() {
      this.gradeList = []
      this.list.forEach((el) => {
        if (!this.gradeList[el.type]) this.$set(this.gradeList, el.type, [])
        this.gradeList[el.type].push(el)
      })

      if (this.record) {
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].id === this.record.id) this.handleSelectStage(parseInt(this.list[i].type) - 1)
        }

        this.handleSelectGrade((this.record.text && this.record.id !== '-1') ? this.record.text : '', (this.record.id && this.record.id !== '-1') ? this.record.id : '')
      } else {
        let id = this.gradeList[this.gradeType][0] ? this.gradeList[this.gradeType][0].id : ''
        let text = this.gradeList[this.gradeType][0] ? this.gradeList[this.gradeType][0].volumeName : ''
        this.handleSelectStage(0)
        this.handleSelectGrade(text, id)
      }
    }
  },
  mounted() {
  }
}
</script>

<style>
.grade-select {
  width: 390px;
  border: 1px solid #21bd73;
  background-color: #fff;
}
.grade-select-tabs {
  display: flex;
  height: 36px;
  border-bottom: 1px solid #ccf0df;
}
.grade-select-tabs > div {
  flex: 1;
  border-right: 1px solid #fff;
  border-left: 1px solid #fff;
  color: #666;
  text-align: center;
  line-height: 36px;
  cursor: pointer;
}
.grade-select-tabs > div.active {
  border-right-color: #ccf0df;
  border-left-color: #ccf0df;
  background-color: #f2fbf7;
}
.grade-select-grades {
  padding: 20px 20px 10px;
  background-color: #f2fbf7;
}
.grade-select-grade-container {
  display: flex;
  flex-wrap: wrap;
}
.grade-select-grade {
  width: 25%;
  height: 26px;
  margin-bottom: 10px;
  color: #666;
  text-align: left;
  line-height: 26px;
  padding: 0 10px;
  box-sizing: border-box;
  cursor: pointer;
}
.grade-select-grade.active {
  color: #fff;
  background-color: #21bd73;
}
</style>