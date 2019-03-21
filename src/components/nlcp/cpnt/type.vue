<template>
  <div class="c-cp-b-type">
    <span class="c-cp-b-cnt-left">测评类型：</span>
    <div class="c-cp-b-cnt-right">{{typeName}}</div>
  </div>
</template>

<script>
import config from '@/config/config.js'

const views = window.Config ? window.Config.nlcpViews : config.nlcpViews

export default {
  name: 'type',
  props: ['competitionType'],
  data () {
    return {
      typeName: ''
    }
  },
  mounted () {
    for (var i = 0; i < views.length; i++) {
      if (this.competitionType == views[i].id) {
        this.typeName = views[i].name
        break
      }
    }
  }
}
</script>