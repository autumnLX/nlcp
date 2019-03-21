<template>
  <div id="tsks" class="create-cp">
    <div class="c-cp-header">设置测评信息</div>
    <div class="c-cp-body">
      <Type :competitionType='competitionType'></Type>
      <PaperList
        :isError='errors.indexOf("paperList") >= 0'
        :competitionType='competitionType'
        :competitionId='competitionId'
        :competitionInfo='cinfo'
        :onGoToPaper='onGoToPaper'
        :onChangeCompetitonName='onChangeCompetitonName'
        :onPaperListChange='onPaperListChange'
        :onChangeData='onChangeData'
      ></PaperList>
      <Name
        :isError='errors.indexOf("name") >= 0'
        :competitionName='cinfo.competitionName'
        :onChangeName='onChangeCompetitonName'
      ></Name>
      <Moreinfo
        :competitionName='cinfo.competitionName'
        :imgUrl='cinfo.imgUrl'
        :thumbImgUrl='cinfo.thumbImgUrl'
        :introduce='cinfo.introduce'
        :imgStatus='imgStatus'
        :onChangeBase64='onChangeBase64'
        :onCreateUeditor='onCreateUeditor'
        :onChangeImg='onChangeImg'
        :onImgStatusChange='onImgStatusChange'
      ></Moreinfo>
      <Mode
        :answerProcess='cinfo.answerProcess'
        :onSelectMode='onSelectMode'
      ></Mode>
      <Showtime
        :competitionId='competitionId'
        :isError='errors.indexOf("showTime") >= 0'
        :showTimeFlag='cinfo.showTimeFlag'
        :showTime='cinfo.showTime'
        :answerProcess='cinfo.answerProcess'
        :endDate='cinfo.endDate'
        :onSelectShowtimeType='onSelectShowtimeType'
        :onSelectShowtime='onSelectShowtime'
      ></Showtime>
      <Students
        :isError='errors.indexOf("releaseScope") >= 0'
        :role='role'
        :releaseScope='cinfo.releaseScope'
        :classLayer='classLayer'
        :studentListType='studentListType'
        :onSelectClassLayer='onSelectClassLayer'
      ></Students>
      <SETime
        :competitionId='competitionId'
        :isSError='errors.indexOf("startDate") >= 0'
        :isEError='errors.indexOf("endDate") >= 0'
        :showTimeFlag='cinfo.showTimeFlag'
        :showTime='cinfo.showTime'
        :startDate='cinfo.startDate'
        :endDate='cinfo.endDate'
        :onSelectTime='onSelectTime'
      ></SETime>
      <Btnbox
        :competitionType='competitionType'
        :competitionId='competitionId'
        :competitionInfo='cinfo'
        :paperList='paperList'
        :imgStatus='imgStatus'
        :onChangeView='onChangeView'
        :onGoToPaper='onGoToPaper'
        :beforeSubmit='beforeSubmit'
        :onCheckSubmit='onCheckSubmit'
        :onImgStatusChange='onImgStatusChange'
      ></Btnbox>
    </div>
  </div>
</template>

<script>
import CreateCpnts from '../cpnt/index'

export default {
  name: 'tsks',
  props: ['onChangeView', 'onGoToPaper', 'role', 'competitionType', 'competitionId', 'competitionInfo'],
  components: Object.assign({}, { ...CreateCpnts }),
  data () {
    return {
      classLayer: {},
      studentListType: '',
      paperList: '',
      cinfo: {
        competitionType: this.competitionType,
        competitionId: this.competitionId,
        competitionName: '',
        imgUrl: '',
        thumbImgUrl: '',
        introduce: '',
        answerProcess: '', // 1:模考模式 2:练习模式 3:学生自选模式
        showTimeFlag: '',
        showTime: '',
        releaseScope: {
          type: '', // class layer grade
          ids: []
        },
        startDate: '',
        endDate: ''
      },
      errors: [],
      imgCreateFlag: '',
      imgbase64: '',
      ueditor: '',
      imgStatus: 'complete'
    }
  },
  methods: {
    onPaperListChange (paperList) {
      this.paperList = paperList.concat([])
    },
    onChangeCompetitonName (cname) {
      this.$set(this.cinfo, 'competitionName', cname)
    },
    onSelectMode (mode) {
      this.$set(this.cinfo, 'answerProcess', mode)
    },
    onChangeBase64 (base64) {
      this.imgbase64 = base64
    },
    onCreateUeditor (ueditor) {
      this.ueditor = ueditor
    },
    onChangeImg (imgUrl, thumbImgUrl, imgCreateFlag) {
      this.imgCreateFlag = imgCreateFlag
      this.$set(this.cinfo, 'imgUrl', imgUrl)
      this.$set(this.cinfo, 'thumbImgUrl', thumbImgUrl)
    },
    onImgStatusChange (imgStatus) {
      this.imgStatus = imgStatus
    },
    onSelectShowtimeType (type) {
      this.$set(this.cinfo, 'showTimeFlag', type)
    },
    onSelectShowtime (val) {
      this.$set(this.cinfo, 'showTime', val)
    },
    onSelectClassLayer (rscope) {
      this.$set(this.cinfo, 'releaseScope', rscope)
    },
    onSelectTime (type, time) {
      this.$set(this.cinfo, type, time)
    },
    onChangeData (key, value) {
      this.$set(this.cinfo, key, value)
    },
    beforeSubmit (callback) {
      this.$set(this.cinfo, 'introduce', this.ueditor.getValue().replace(/<label[^>]*>(.*?)<\/label>/, ''))

      if (this.imgCreateFlag) {
        let that = this
        this.imgStatus = 'uploading'
        window.solution.server.post('/englishCompetition/upload?action=upload', {
          defult_base64: this.imgbase64
        }, (res) => {
          that.imgStatus = 'complete'
          if (res.errorCode == 1) {
            that.$set(that.cinfo, 'imgUrl', res.url)
            that.$set(that.cinfo, 'thumbImgUrl', res.image_small_url)

            if (typeof callback == 'function') that.$nextTick(callback)
          } else if (res.errorCode == -1) {
            alert(res.state);
          }
        });
      } else {
        if (typeof callback == 'function') callback();
      }
    },
    onCheckSubmit (errors) {
      this.errors = errors.concat([])
    }
  },
  beforeMount () {
    let that = this
    if (this.role == 'ls') {
      this.cinfo.releaseScope.type = 'class'
      this.studentListType = 'class'
      window.solution.server.get('/competitionConfigure/selectClassLayer', {}, (res) => {
        if (res.status == 1) {
          that.classLayer = res.data
        } else {
          alert(res.info)
        }
      })
    } else if (this.role == 'gl') {
      this.cinfo.releaseScope.type = 'grade'
      window.solution.server.get('/topics/getDefaultCategory', {}, (res) => {
        if (res.result == 1) {
          that.classLayer = res.info
          that.studentListType = res.info.category[0]
        } else {
          alert(res.message)
        }
      })
    }

    if (this.competitionInfo.competitionId != undefined) {
      this.cinfo = Object.assign({}, this.cinfo, this.competitionInfo)

      if (this.role == 'ls') {
        this.studentListType = this.cinfo.releaseScope.type
      }
    } else {
      this.competitionInfo.paperCatgId && (this.cinfo.paperCatgId = this.competitionInfo.paperCatgId)
    }
  }
}
</script>

<style lang='less' src='../createCp.less'></style>
<style lang="less" scoped>

</style>
