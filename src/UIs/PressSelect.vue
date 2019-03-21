<template>
  <div class="press-select" @click.stop=''>
    <div class="press-select-presss">
      <div class="press-select-press-container">
        <div class="press-select-press" :class="{active: activeId2 === -1}" @click.stop='handleSelectPress("全部", -1)'>全部</div>
        <div
          class="press-select-press" 
          :class="{active: press.id === activeId2}"  
          v-for="(press, idx) in list" 
          :key="'press_' + idx"
          @click.stop='handleSelectPress(press.textbookName, press.id, idx)'>{{ press.textbookName }}</div>
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
      activeId2: -1,
    }
  },
  methods: {
    handleSelectPress(val, id) {
      this.activeId2 = id
      typeof this.onSelect === 'function' && this.onSelect(id === -1 ? '' : (val || ''), id === -1 ? '' : (id || ''), '', 'press')
    },
    init() {
      if (this.record) {
        this.handleSelectPress((this.record.text && this.record.id !== '-1') ? this.record.text : '', (this.record.id && this.record.id !== '-1') ? this.record.id : '')
      } else {
        let id = this.list[0] ? this.list[0].id : ''
        let text = this.list[0] ? this.list[0].volumeName : ''
        this.activeId2 = -1
        this.handleSelectPress(text, id)
      }
    },
  },
  mounted() {
  }
}
</script>

<style>
.press-select {
  width: 390px;
  border: 1px solid #21bd73;
  background-color: #fff;
}
.press-select-presss {
  padding: 20px 20px 10px;
  background-color: #f2fbf7;
}
.press-select-press-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.press-select-press {
  width: 46%;
  height: 26px;
  margin-bottom: 10px;
  color: #666;
  text-align: left;
  line-height: 26px;
  padding: 0 10px;
  box-sizing: border-box;
  cursor: pointer;
}
.press-select-press.active {
  color: #fff;
  background-color: #21bd73;
}
</style>

