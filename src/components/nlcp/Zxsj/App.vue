<template>
  <div id="zxsj" class="create-cp">
    <div class="c-cp-header">设置测评信息</div>
    <div class="c-cp-body">
      <Type
        :competitionType='competitionType'
      ></Type>
      <PaperList
        :isError='errors.indexOf("paperList") >= 0'
        :competitionType='competitionType'
        :competitionId='competitionId'
        :competitionInfo='cinfo'
        :onGoToPaper='onGoToPaper'
        :onChangeCompetitonName='onChangeCompetitonName'
        :onPaperListChange='onPaperListChange'
      ></PaperList>
      <Name
        :isError='errors.indexOf("name") >= 0'
        :competitionName='cinfo.competitionName'
        :onChangeName='onChangeCompetitonName'
      ></Name>
      <Students
        :isError='errors.indexOf("releaseScope") >= 0'
        :role='role'
        :releaseScope='cinfo.releaseScope'
        :classLayer='classLayer'
        :studentListType='studentListType'
        :onSelectClassLayer='onSelectClassLayer'
      ></Students>
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
  name: 'zxsj',
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
        releaseScope: {
          type: '', // class layer grade
          ids: []
        },
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
    onSelectClassLayer (rscope) {
      this.$set(this.cinfo, 'releaseScope', rscope)
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
    }
  }
}
</script>

<style lang='less' src='../createCp.less'></style>
<style lang='less' scoped>

</style>

