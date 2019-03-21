<template>
  <div
    :id="paperBuildWay?'EditPaper':'right-container'"
    :class='rcClass'
  >
    <component
      :is='currentView'
      :onChangeView='changeView'
      :onSelectPaper='selectPaper'
      :onGoToPaper='goToPaper'
      :onGoToCpxx='goToCpxx'
      :role='myRole'
      :competitionType='competitionType'
      :competitionId='competitionId'
      :competitionInfo='competitionInfo'
      :paperBuildWay="paperBuildWay"
      :paperData="editPaperData"
      :randerPaper="randerPaper"
      :params="param.params"
    ></component>
  </div>
</template>

<script>
import $ from '@/utility/dollar.js'
import Cpnts from './index'
import config from '@/config/config.js'

const views = window.Config ? window.Config.nlcpViews : config.nlcpViews

export default {
  name: 'nlcp',
  props: ['param', 'paperBuildWay', 'editPaperData', 'randerPaper'],
  components: Object.assign({}, { ...Cpnts }),
  data () {
    return {
      rcClass: {
        'nlcp-container': true
      },
      currentView: '',
      myRole: '',
      competitionType: '',
      competitionId: '',
      competitionInfo: '',
      settings: {}, // 试卷筛选配置
    }
  },
  methods: {
    changeView (targetView) {
      this.competitionType = ''
      this.competitionId = ''
      this.competitionInfo = ''
      this.currentView = targetView

      window.$('#bjds').hide()
      this.rcClass['nlcp-container'] = true
    },
    selectPaper (competitionType, competitionId, cinfo) {
      this.competitionType = competitionType
      this.competitionId = competitionId
      this.competitionInfo = Object.assign({}, cinfo)

      window.$('#bjds').hide()
      window.$('#zxzj').hide()
      this.rcClass['nlcp-container'] = true

      for (var i = 0; i < views.length; i++) {
        if (this.competitionType == views[i].id) {
          this.currentView = views[i].abbr
          break
        }
      }
    },
    goToPaper (competitionType, competitionId, cinfo) {
      this.competitionType = competitionType
      this.competitionId = competitionId
      this.competitionInfo = Object.assign({}, cinfo)
      this.currentView = 'Sjgl'
    },
    goToCpxx (competitionType, competitionId) {
      this.competitionType = competitionType
      this.competitionId = competitionId
      this.competitionInfo = ''
      window.showDSBJ(competitionId, false, false, competitionType, true)
    }
  },
  provide() { // 用户在成功创建测评后保存试卷筛选配置
    return {
      setSetting: (settings) => {
        this.settings = settings
      }, // sjgl/filter 存储
      getSetting: () => {
        return this.settings
      },
      saveFilterSetting: (settings, cb) => { // 记录筛选配置
        if (Object.keys(settings).length > 0) {
          $.post('/paperConfigure/savePaperFavoriteSetting', typeof settings === 'object' ? settings : {}, (res) => {
            if (res.status === 1) {
              typeof cb === 'function' && cb()
            } else {
              alert(res.info)
            }
          })
        }
        this.settings = {}
      },
    };
  },
  mounted () {
    const mtype = window.$('#userName').data('ManageType')
    const rtype = window.$('#userName').data('RoleType')

    if (rtype == 'teacher') {
      this.myRole = 'ls'
    } else if (parseInt(mtype) == 0) {
      this.myRole = 'gl'
    } else {
      this.myRole = 'dl'
    }
    if (!(this.param instanceof Array)) {
      this.currentView = 'EditPaper'
      return
    }

    let param = this.param instanceof Array ? this.param.concat([]) : []
    if (param[0] === 'showCpzy') {
      param.shift()
      console.log(param)
      this.selectPaper.apply(this, param)
      return
    }
    if (!param || param.length == 0) {
      this.currentView = 'Nlcp'
    } else {
      this.currentView = param.shift()
      if (this.currentView == 'Sjgl') {
        this.competitionType = param.shift()

        if (!this.competitionType) {
          this.rcClass['nlcp-container'] = false
        }
      } else if (this.currentView == 'Cpxx') {
        this.competitionId = param.shift()
        this.rcClass['nlcp-container'] = false
      }
    }
  }
}
</script>

<style>
#right-container.nlcp-container {
  padding: 0;
  padding-bottom: 15px;
}
</style>