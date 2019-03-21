<template>
  <router-view
    :param='param'
    :paperBuildWay="paperBuildWay"
    :editPaperData="editPaperData"
    :randerPaper="randerPaper"
  ></router-view>
</template>

<script>
export default {
  name: 'app',
  props: ['param', 'paperBuildWay', 'editPaperData', 'randerPaper']
}
</script>