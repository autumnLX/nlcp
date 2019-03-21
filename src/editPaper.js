// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import EditPaper from './components/nlcp/Sjgl/EditPaper.vue'
import router from './router'

Vue.config.productionTip = false

/* eslint-disable no-new */
if (!window.solution) window.solution = {}
if (!window.solution.js) window.solution.js = {}
window.solution.js.editPaper = function (params) {
  console.log(params)
  new Vue({
    el: '#EditPaper',
    router,
    data: params,
    template: '<EditPaper :params="params" :paperBuildWay="paperBuildWay" :paperData="editPaperData" :randerPaper="randerPaper"></EditPaper>',
    components: {
      EditPaper
    }
  })
}
