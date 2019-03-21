// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

/* eslint-disable no-new */
if (!window.solution) window.solution = {}
if (!window.solution.js) window.solution.js = {}
window.solution.js.nlcp = function (param) {
  new Vue({
    el: param.paperBuildWay ? '#EditPaper' : '#right-container',
    router,
    data: {
      param: param
    },
    template: '<App :param="param" :paperBuildWay="param.paperBuildWay" :editPaperData="param.editPaperData" :randerPaper="param.randerPaper"/>',
    components: {
      App
    }
  })
}
