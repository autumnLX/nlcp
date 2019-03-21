<template>
  <div id="cpzy" class="create-cp">
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
        :onChangeView='onChangeView'
        :onGoToPaper='onGoToPaper'
        :onCheckSubmit='onCheckSubmit'
      ></Btnbox>
    </div>
  </div>
</template>

<script>
import CreateCpnts from '../cpnt/index'

export default {
  name: 'cpzy',
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
        // answerProcess: '', // 1:模考模式 2:练习模式 3:学生自选模式
        showTimeFlag: '',
        showTime: '',
        releaseScope: {
          type: '', // class layer grade
          ids: []
        },
        startDate: '',
        endDate: ''
      },
      errors: []
    }
  },
  methods: {
    onPaperListChange (paperList) {
      this.paperList = paperList.concat([])
    },
    onChangeCompetitonName (cname) {
      this.$set(this.cinfo, 'competitionName', cname)
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
    onCheckSubmit (errors) {
      this.errors = errors.concat([])
    }
  },
  beforeMount () {
    let that = this
    if (this.role == 'ls') {
      this.studentListType = 'class'
      window.solution.server.get('/competitionConfigure/selectClassLayer', {}, (res) => {
        if (res.status == 1) {
          that.classLayer = res.data
        } else {
          alert(res.info)
        }
      })
    } else if (this.role == 'gl') {
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
<style lang='less' scoped>
</style>

