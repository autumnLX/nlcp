<template>
  <div class="c-cp-b-showtime  c-cp-b-radiobox">
    <span class="c-cp-b-cnt-left">成绩显示时间：</span>
    <ul class="c-cp-b-cnt-right">
      <li :class='{active: stFlag == 2, disabled: answerProcess == 1}' @click='onSelectType(2)'>
        <label></label>
        <span>完成小题</span>
        <i v-if='answerProcess == 3' title="仅对【练习模式】有效"></i>
      </li>
      <li :class='{active: stFlag == 3}' @click='onSelectType(3)'>
        <label></label>
        <span>完成整卷</span>
      </li>
      <li :class='{active: stFlag == 1}' @click='onSelectType(1)'>
        <label></label>
        <span>定时公布</span>
      </li>
      <input
        type="text"
        id="showtime"
        class="wdate"
        placeholder="请设置成绩公布日期"
        :disabled='stFlag != 1 || sdisabled'
        @click='onSelect'
        :value='st'
        :class='{isError: isError}'
        readonly
      >
    </ul>
  </div>
</template>

<script>
export default {
  name: 'showtime',
  props: ['competitionId', 'isError', 'showTimeFlag', 'showTime', 'answerProcess', 'endDate', 'onSelectShowtimeType', 'onSelectShowtime'],
  data () {
    return {
      stFlag: this.showTimeFlag ? this.showTimeFlag : 2, // 2:完成小题 3:完成整卷 1:定时公布
      st: this.showTime,
      sdisabled: false,
      first: true,
    }
  },
  methods: {
    add0 (n) {
      return n < 10 ? '0' + n : n
    },
    transToTamp (date) {
      return Date.parse(new Date(typeof date === 'string' ? date.replace(/-/g, '/') : date))
    },
    formatTamp (tamp) {
      var time = new Date(tamp)
      var y = time.getFullYear()
      var m = time.getMonth() + 1
      var d = time.getDate()
      var h = time.getHours()
      var mm = time.getMinutes()
      return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm)
    },
    handleTime(date, time) {
      return this.formatTamp(this.transToTamp(date) + time)
    },
    wdate (param) {
      window.WdatePicker({
        el: param.el,
        readOnly: true,
        startDate: param.startDate,
        minDate: param.minDate,
        maxDate: param.maxDate,
        dateFmt: 'yyyy-MM-dd HH:mm',
        // alwaysUseStartDate: true,
        autoPickDate: true,
        isShowClear: false,
        onpicked: function() {
          param.callback(this.value)
        }
      })
    },
    onSelectType (type) {
      if (this.answerProcess == 1 && type == 2) return false
      this.stFlag = type
      this.onSelectShowtimeType(type)

      if (type == 1) {
        if (!this.st) this.st = this.handleTime(this.endDate, 24 * 60 * 60 * 1000).split(' ')[0] + ' 00:00'
      } else {
        this.st = ''
      }
      this.onSelectShowtime(this.st)
    },
    onSelect () {
      let that = this
      let startDate = this.st ? this.st : this.handleTime(this.endDate, 24 * 60 * 60 * 1000).split(' ')[0] + ' 00:00'
      let minDate = this.endDate ? this.handleTime(this.endDate, 60 * 1000) : '%y-%M-%d %H:%m'

      this.wdate({
        el: 'showtime',
        startDate: startDate,
        minDate: minDate,
        maxDate: '{%y+1}-%M-%d %H:%m',
        callback: (val) => {
          that.st = val
          that.onSelectShowtime(val)
        }
      })
    }
  },
  watch: {
    answerProcess (newVal) {
      if (this.first) {
        if (this.answerProcess == 1) {
          this.stFlag = this.showTimeFlag != 2 ? this.showTimeFlag : 3
        } else {
          this.stFlag = this.showTimeFlag != '' ? this.showTimeFlag : 2
        }
        this.first = false
      } else {
        if (this.answerProcess == 1) {
          this.stFlag = 3
        } else {
          this.stFlag = 2
        }
      }
      this.onSelectShowtimeType(this.stFlag)
    }
  },
  mounted () {
    if (this.answerProcess == 1) {
      this.stFlag = this.showTimeFlag != 2 ? this.showTimeFlag : 3
    } else {
      this.stFlag = this.showTimeFlag != '' ? this.showTimeFlag : 2
    }

    this.onSelectShowtimeType(this.stFlag)

    if (this.competitionId) {
      if (new Date() >= new Date(this.st.replace(/-/g, '/'))) this.sdisabled = true
    }
  }
}
</script>