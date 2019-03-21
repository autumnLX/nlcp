<template>
  <div class="c-cp-b-timeBox">
    <div class="c-cp-b-start">
      <span class="c-cp-b-cnt-left">开始时间：</span>
      <div class="c-cp-b-cnt-right">
        <input
          type="text"
          id="startDate"
          class="wdate"
          placeholder="请设置开始时间"
          @click='onSelectStarttime'
          :value='sd'
          :class='{isError: isSError}'
          :disabled='sdisabled'
          readonly
        >
      </div>
    </div>
    <div class="c-cp-b-end">
      <span class="c-cp-b-cnt-left">结束时间：</span>
      <div class="c-cp-b-cnt-right">
        <input
          type="text"
          id="endDate"
          class="wdate"
          placeholder="请设置结束时间"
          @click='onSelectEndtime'
          :value='ed'
          :class='{isError: isEError}'
          :disabled='edisabled'
          readonly
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'showtime',
  props: ['competitionId', 'isSError', 'isEError', 'showTimeFlag', 'showTime', 'startDate', 'endDate', 'onSelectTime'],
  data () {
    return {
      sd: '',
      ed: '',
      sdisabled: false,
      edisabled: false
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
        startDate: param.sd,
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
    onSelectStarttime () {
      let that = this
      let maxDate = this.ed ? this.handleTime(this.ed, -10 * 60 * 1000) : (this.showTimeFlag == 1 && this.showTime ? this.handleTime(this.showTime, -60 * 1000) : '{%y+1}-%M-%d %H:%m')

      this.wdate({
        el: 'startDate',
        startDate: this.sd,
        minDate: '%y-%M-%d %H:%m',
        maxDate: maxDate,
        callback: (val) => {
          that.sd = val
          that.onSelectTime('startDate', val)
        }
      })
    },
    onSelectEndtime () {
      let that = this
      let minDate = this.sd ? this.handleTime(this.sd, 10 * 60 * 1000) : '%y-%M-%d %H:%m'
      let maxDate = this.showTimeFlag == 1 && this.showTime ? this.handleTime(this.showTime, -60 * 1000) : '{%y+1}-%M-%d %H:%m'

      this.wdate({
        el: 'endDate',
        startDate: this.ed,
        minDate: minDate,
        maxDate: maxDate,
        callback: (val) => {
          that.ed = val
          that.onSelectTime('endDate', val)
        }
      })
    },
  },
  mounted () {
    this.sd = this.startDate ? this.startDate : this.handleTime(this.transToTamp(new Date()), 0)
    this.ed = this.endDate ? this.endDate : this.handleTime(this.transToTamp(this.sd), 7 * 24 * 60 * 60 * 1000).split(' ')[0] + ' 23:59'
    this.onSelectTime('startDate', this.sd)
    this.onSelectTime('endDate', this.ed)

    if (this.competitionId) {
      if (new Date() >= new Date(this.sd.replace(/-/g, '/'))) this.sdisabled = true
      if (new Date() >= new Date(this.ed.replace(/-/g, '/'))) this.edisabled = true
    }
  }
}
</script>