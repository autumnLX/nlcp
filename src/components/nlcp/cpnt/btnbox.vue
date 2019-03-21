<template>
  <div class="c-cp-b-btnbox">
    <p
      class="c-cp-b-btn-errTip"
      v-if='(!noError)'
    >
      <i></i>
      {{errText.join('、').replace(/、{1,}/g, '、').replace(/(^、|、$)/g, '')}}
    </p>
    <p
      class="c-cp-b-btn-errTip"
      v-if='(noError && imgErrorTime > 0)'
    >
      <i></i>
      {{'信息上传中，请稍后...'}}
    </p>
    <button class="c-cp-b-btn-back" @click='onGoToPaper(competitionType, competitionId, competitionInfo)'>上一步</button>
    <button class="c-cp-b-btn-cancel" @click='onChangeView("Nlcp")'>取消</button>
    <button class="c-cp-b-btn-submit" @click='onSubmit'>完成</button>
  </div>
</template>

<script>
export default {
  name: 'btnbox',
  props: ['competitionType', 'competitionId', 'competitionInfo', 'paperList', 'imgStatus', 'onGoToPaper', 'onChangeView', 'beforeSubmit', 'onCheckSubmit'],
  inject: {
    getSetting: { default: () => {} },
    saveFilterSetting: { default: () => {} },
  },
  data () {
    return {
      submitEnable: true,
      noError: true,
      errPosition: [],
      errText: [],
      imgErrorTime: 0,
      imgErrorTimeout: '',
    }
  },
  methods: {
    onSubmit () {
      if (this.submitEnable) {
        if (typeof this.beforeSubmit == 'function') {
          this.$nextTick(() => { this.beforeSubmit(this.checkSubmit) })
        } else {
          this.$nextTick(this.checkSubmit)
        }
      }
    },
    checkSubmit () {
      let paperListIndex = this.errPosition.indexOf('paperList')
      if (this.paperList.length <= 0) {
        this.noError = false
        if (paperListIndex < 0) this.errPosition.push('paperList')
        if (paperListIndex < 0) this.$set(this.errText, 0, '请设置试卷')
      } else {
        if (paperListIndex >= 0) this.errPosition.splice(paperListIndex, 1)
        if (paperListIndex >= 0) this.$set(this.errText, 0, '')
      }

      let nameIndex = this.errPosition.indexOf('name')
      if (this.competitionInfo.competitionName
      .length == 0) {
        this.noError = false
        if (nameIndex < 0) this.errPosition.push('name')
        if (nameIndex < 0) this.$set(this.errText, 1, '填写测评名称')
      } else {
        if (nameIndex >= 0) this.errPosition.splice(nameIndex, 1)
        if (nameIndex >= 0) this.$set(this.errText, 1, '')
      }

      let showTimeIndex = this.errPosition.indexOf('showTime')
      if (this.competitionInfo.showTimeFlag == 1 && !this.competitionInfo.showTime) {
        this.noError = false
        if (showTimeIndex < 0) this.errPosition.push('showTime')
        if (showTimeIndex < 0) this.$set(this.errText, 2, '设置成绩公布时间')
      } else {
        if (showTimeIndex >= 0) this.errPosition.splice(showTimeIndex, 1)
        if (showTimeIndex >= 0) this.$set(this.errText, 2, '')
      }

      let releaseScopeIndex = this.errPosition.indexOf('releaseScope')
      if (this.competitionInfo.releaseScope.ids.length <= 0) {
        this.noError = false
        if (releaseScopeIndex < 0) this.errPosition.push('releaseScope')
        if (releaseScopeIndex < 0) this.$set(this.errText, 3, '设置测评对象')
      } else {
        if (releaseScopeIndex >= 0) this.errPosition.splice(releaseScopeIndex, 1)
        if (releaseScopeIndex >= 0) this.$set(this.errText, 3, '')
      }

      if (this.competitionType != 2) {
        let startDateIndex = this.errPosition.indexOf('startDate')
        if (!this.competitionInfo.startDate) {
          this.noError = false
          if (startDateIndex < 0) this.errPosition.push('startDate')
          if (startDateIndex < 0) this.$set(this.errText, 4, '设置开始时间')
        } else {
          if (startDateIndex >= 0) this.errPosition.splice(startDateIndex, 1)
          if (startDateIndex >= 0) this.$set(this.errText, 4, '')
        }

        let endDateIndex = this.errPosition.indexOf('endDate')
        if (!this.competitionInfo.endDate) {
          this.noError = false
          if (endDateIndex < 0) this.errPosition.push('endDate')
          if (endDateIndex < 0) this.$set(this.errText, 5, '设置结束时间')
        } else {
          if (endDateIndex >= 0) this.errPosition.splice(endDateIndex, 1)
          if (endDateIndex >= 0) this.$set(this.errText, 5, '')
        }
      }

      if (this.errPosition.length == 0) this.noError = true

      this.onCheckSubmit(this.errPosition)

      clearInterval(this.imgErrorTimeout)

      if (this.imgStatus && this.imgStatus != 'complete') {
        var that = this
        this.imgErrorTime = 3
        this.imgErrorTimeout = setInterval(function () {
          if (that.imgErrorTime > 0) {
            that.imgErrorTime--
          } else {
            clearInterval(that.imgErrorTimeout)
          }
        }, 1000)
      }

      if (this.noError && (this.imgStatus == 'complete' || !this.imgStatus)) {
        this.doSubmit()
      }
    },
    doSubmit () {
      let timeCount = 3

      console.info(JSON.parse(JSON.stringify(this.competitionInfo)))

      this.submitEnable = false

      let that = this
      window.solution.server.post('/englishCompetition/update', this.competitionInfo, (res) => {
        if (res.result == 1) {
          that.saveFilterSetting(that.getSetting()) // 保存试卷筛选配置

          window.tipDialog({
            type: 'success',
            subtitle: '保存成功',
            content: timeCount + '秒后自动跳转',
            isClose: false,
            timeout: true,
            timeoutConfig: {
              time: timeCount,
              text: '{{time}}秒后自动跳转',
              textPosiiton: 'content',
              timeoutCallback: function(closeDialog) {
                closeDialog()
                window.$('.nav-list li a').eq(0).click()
              }
            },
            cancelCallback: function(closeDialog) {
              closeDialog()
              // that.onChangeView('Nlcp')
              window.$('.nav-list li a').eq(0).click()
            }
          })
        } else {
          that.submitEnable = true
          alert(res.message)
        }
      })
    }
  }
}
</script>