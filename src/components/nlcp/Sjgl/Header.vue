<template lang='pug'>
  div.sjgl-head
    div.sjgl-crumb(v-if="competitionType")
      span
        a(
          class="active"
          href="#"
          data-chivox-event="click:menuClick&nlcp"
          data-chivox-group="menu"
        ) 创建测评
      span >
      span 选择试卷
    ul.sjgl-tab(v-else)
      li(
        v-for='(view, index) in category'
        :key='view.id'
        :class="{active:activeTab === view.paperCatgId}"
        @click="handleSwitchTab(view.paperCatgId)"
      ) {{view.paperCatgName}}
</template>

<script>
export default {
  name: 'sjgl-head',
  props: ['competitionType', 'competitionInfo', 'category'],
  data() {
    return {
      activeTab: '',
    }
  },
  methods: {
    handleSwitchTab(id) {
      if (this.activeTab !== id) {
        this.activeTab = id
        typeof this.$listeners['on-tab'] === 'function' && this.$listeners['on-tab'](id)
      }
    },
  },
  watch: {
    category: function (val) {
      if ((this.competitionType && parseInt(this.competitionType) === 4) || parseInt(this.competitionInfo.paperCatgId) === 2) {
        this.handleSwitchTab(val[1].paperCatgId)
      } else {
        this.handleSwitchTab(val[0].paperCatgId)
      }
    }
  },
  mounted () {
  }
}
</script>

<style lang="less">
.sjgl-head {
  background: #fff;

  .sjgl-crumb {
    display: flex;
    align-items: center;
    width: 100%;
    height: 60px;
    border-bottom: 1px solid #ededed;
    padding-left: 30px;
    box-sizing: border-box;

    span {
      margin-right: 8px;
      font-size: 18px;
      color: #666;

      a {
        color: #21bd73;
      }
    }
  }

  .sjgl-tab {
    display: flex;
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #ededed;
    box-sizing: border-box;

    li {
      width: 180px;
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      color: #999;
      text-align: center;
      box-sizing: border-box;
      cursor: pointer;

      &.active {
        color: #21bd73;
        border-bottom: 2px solid #21bd73;
      }
    }
  }
}
</style>