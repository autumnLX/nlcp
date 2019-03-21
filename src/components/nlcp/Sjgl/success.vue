<template lang="pug">
  div.success
    i.iconfont &#xe644;
    p.tip 保存成功!
    p.name 试卷名称：{{name}}
    button.btn(@click="$emit('next')") 继续组卷
</template>

<script>
export default {
  props: ['name'],
  mounted () {
    window.$('#right-container').addClass('hide')
  },
  destroyed () {
    window.$('#right-container').removeClass('hide')
  }
}
</script>

<style scoped>
.success {
  z-index: 100;
  position: absolute;
  top: 11px;
  left: 215px;
  width: 770px;
  background: white;
  height: 566px;
  text-align: center;
}
i {
  margin-top: 145px;
  display: block;
  font-size: 42px;
  color: #21bd73;
}
.tip {
  font-size: 18px;
  color: #333;
  margin-top: 20px;
}
.name {
  margin-top: 25px;
  font-size: 14px;
  color: #666;
}
.btn {
  margin-top: 45px;
  width: 110px;
  height: 35px;
  border: 1px solid #21bd73;
  border-radius: 3px;
  background-color: #21bd73;
  color: #fff;
  padding: 5px 10px;
  font-family: "Microsoft Yahei";
}
</style>
