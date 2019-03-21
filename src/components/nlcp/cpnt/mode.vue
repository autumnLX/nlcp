<template>
  <div class="c-cp-b-mode  c-cp-b-radiobox">
    <span class="c-cp-b-cnt-left">测评模式：</span>
    <div class="c-cp-b-cnt-right">
      <li :class='{active: ap == 1}' @click='selectMode(1)'>
        <label></label>
        <span>模考模式</span>
        <i title="模考模式下，完全模拟正式听说考试流程，系统自动播放题目音频，自动开始答题，学生无需任何操作，实际答题时长和试卷相关。"></i>
      </li>
      <li :class='{active: ap == 2}' @click='selectMode(2)'>
        <label></label>
        <span>练习模式</span>
        <i title="练习模式下，学生可以左右切换题目，进行自由答题，没有答题时长限制。"></i>
      </li>
      <li :class='{active: ap == 3}' @click='selectMode(3)'>
        <label></label>
        <span>学生自选模式</span>
        <i title="学生自选模式，学生自己选择通过模考模式还是练习模式完成答题。"></i>
      </li>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mode',
  props: ['answerProcess', 'onSelectMode'],
  data () {
    return {
      ap: this.answerProcess ? this.answerProcess : 1,
    }
  },
  methods: {
    selectMode (mode) {
      this.ap = mode
      this.onSelectMode(mode)
    },
  },
  mounted () {
    this.onSelectMode(this.ap)
  }
}
</script>