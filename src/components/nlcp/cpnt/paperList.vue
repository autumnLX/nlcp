<template>
  <div class="c-cp-b-paperList">
    <span class="c-cp-b-cnt-left">已选试卷：</span>
    <ul class="c-cp-b-cnt-right">
      <li
        v-for='(paper, i) in paperList'
        :key='paper.paperId'
      >
        <span @click='viewPaper(paper.paperId)'>{{paper.paperName}}</span>
        <label @click='deletePaper(paper.paperId, paper.cmpCatgId, paper.paperCatgId)'></label>
      </li>
      <li class="addPaper" @click='goToPaper'>
        <label></label>
        <span>添加试卷</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'paperList',
  props: ['competitionType', 'competitionId', 'competitionInfo', 'onGoToPaper', 'onChangeCompetitonName', 'onPaperListChange', 'onChangeData'],
  inject: {
    getSetting: { default: () => {} },
  },
  data () {
    return {
      paperList: []
    }
  },
  methods: {
    getPaperList (para) {
      let that = this
      window.solution.server.get('/competitionConfigureV2/paperListInfo', {
        competitionId: that.competitionId,
        paperCatgId: that.competitionInfo.paperCatgId || that.getSetting().paperCatgId
        // that.competitionInfo 编辑  that.getSetting() 筛选
      }, (res) => {
        if (res.status == 1) {
          that.paperList = res.data.concat([])
          that.onPaperListChange(that.paperList)

          if (res.data.length > 0 && that.competitionInfo.competitionName == '' && para) {
            that.onChangeCompetitonName(res.data[0].paperName)
            that.onChangeData('paperCatgId', res.data[0].paperCatgId)
            that.onChangeData('competitionType', res.data[0].cmpCatgId)
          }
        } else {
          alert(res.info)
        }
      })
    },
    deletePaper (pid, cmpCatgId, paperCatgId) {
      let that = this
      window.solution.server.post('/competitionConfigureV2/paperRemove', {
        competitionId: that.competitionId,
        cmpCatgId: cmpCatgId,
        paperId: pid,
        paperCatgId: paperCatgId
      }, (res) => {
        if (res.status == 1) {
          that.getPaperList()
        } else {
          alert(res.info)
        }
      })
    },
    viewPaper (pid) {
      window.open('/view/viewPaper.html?paperId=' + pid)
    },
    goToPaper () {
      this.onGoToPaper(this.competitionType, this.competitionId, this.competitionInfo)
    },
  },
  mounted () {
    this.getPaperList(true)
  }
}
</script>