<template lang="pug">
  div#Sjgl
    //- 头部筛选
    Header(
      class="sjgl-block"
      :competitionType='competitionType'
      :competitionInfo='competitionInfo'
      :category='paperCategory'
      @on-tab='switchTab'
    )
    Filt(
      class="sjgl-block"
      :category='paperCate'
      :types='paperType'
      @doFilter='handleFilter'
    )
    //- 列表
    div.sjgl-list.sjgl-block
      ul.renderLoading(v-if="loadingFlag")
        li
          i.loading
          span 正在加载..
      ul.renderNormal(v-else-if="papersList.length")
        li(v-for="(paper, index) in papersList" :key="paper.paperID")
          span(:class="{cpzy: paperCate === '1', tsks: paperCate === '2'}")
          div.renderLeft
            p
              span(v-bind:title="paper.paperName") {{paper.paperName.length > 14 ? paper.paperName.substring(0,14) + '...' : paper.paperName}}
              i.lock(v-if="paper.permissionID === '2'" title="仅自己可见")
              em(v-if="filterData.paperSourceId === '1'") 精编
            p
              span 类型：
              span {{paper.paperType.text}}
              span 满分：
              span {{paper.totalScore}}分
              span 组卷人：
              span {{paper.createUser}}
          div.rendeRight
            dl
              i.arrow(v-if="paper.role === 'manager'&& filterData.paperSourceId == 1" :class="{disabled: index === 0 && currentPage === 1}" @click="sortUp(index)")
              i.arrow(v-if="paper.role === 'manager'&& filterData.paperSourceId == 1" :class="{disabled: index === papersList.length - 1 && currentPage === maxNumPage}" @click="sortDown(index)")
              i.sjgl-cover(v-if="paper.role === 'manager' || (paper.role === 'teacher' && paper.isSelf)" :class="{active: currentPaperId === paper.paperID}" @mouseover="showPaperOption(paper.paperID)" @mouseout="hidePaperOption(paper.paperID)")
            dl
              button(@click="previewPaper(paper.paperID)") 预览
              button.cancelSelect(v-if="paper.isChooesed" @click="removePaper(paper.paperID, paper.cmpCatgId, paper.paperCatgId)") 取消
              button.confirmSelect(v-else @click="choosePaper(paper.paperID, index, paper.cmpCatgId, paper.paperCatgId)") 选择
            div(v-if="currentPaperId === paper.paperID" @mouseover="showPaperOption(paper.paperID)" @mouseout="hidePaperOption(paper.paperID)")
              div.triangle
                span
              span(@click="editPaper(paper)") 编辑
              span(@click="deletePaper(paper.paperID, paper.cmpCatgId, paper.paperCatgId)") 删除
              //- span(v-if="paper.role === 'manager' && filterData.paperSourceId == 1" @click="releasePaper(paper.paperID)") 发布
      ul.renderEmpty(v-else)
        li
          i.emptyPaper
          span(@click="goGroupPaper()") 去组卷
    //- 分页
    Pagination(
        v-if="(!loadingFlag && papersList.length > 0)"
        :currentPage='currentPage'
        :maxNumPage='maxNumPage'
        :getSkipPage='getSkipPage'
      )
    
    //- 右侧购物车
    div#sjgl-create(:class="{active: choosePaperList.length}")
      div(class="total")
        |已选择
        em &nbsp;{{choosePaperList.length}}&nbsp;
        |份试卷
      ul.selectPaperList.smart-scroll(v-if="choosePaperList.length")
        li(v-for="paper in choosePaperList" :key="paper.paperId")
          span(v-bind:title="paper.paperName") {{paper.paperName.length > 8 ? paper.paperName.substring(0,8) + '...' : paper.paperName}}
          button(@click="removePaper(paper.paperId, paper.cmpCatgId, paper.paperCatgId)") 移除
      div.empty(v-else) 点击“选择”添加试卷
      button.createCP(v-if="choosePaperList.length" @click="createCP()") {{competitionId ? "编辑测评" : "创建测评"}}
      //- 小球动画
      div.ball-container
        transition(v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter" name="drop" v-for="(litterBall, indexBall) in balls" :key="indexBall")
          div.ball(v-show="litterBall.show")
            div.inner.inner-hook(:class="indexBall")
    div#toast(v-if="showToast")
      p {{toastText}}
    //- 编辑试卷
    EditPaper(
        v-if="showEditPaper"
        :paperData="editPaperData"
        :paperBuildWay="paperBuildWay"
        :isSave="false"
        :randerPaper="randerPaper"
        :sourceId="sourceId"
        ref="dialog"
        @cancel="close"
      )
</template>

<script>
import $ from '@/utility/dollar.js'
import Pagination from '@/UIs/Pagination'
import EditPaper from '@/components/nlcp/Sjgl/EditPaper'
import Header from '@/components/nlcp/Sjgl/Header'
import Filt from '@/components/nlcp/Sjgl/Filter'

export default {
  name: 'sjgl',
  inheritAttrs: false,
  components: { EditPaper, Pagination, Header, Filt },
  props: ['onSelectPaper', 'role', 'competitionType', 'competitionId', 'competitionInfo'],
  data () {
    return {
      loadingFlag: false,
      papersList: [],
      choosePaperList: [],
      editPaperData: '',
      currentPaperId: '',
      clearTimeOut: '',
      // toast
      showToast: false,
      toastText: '',
      clearToastTimeout: '',
      // 分页
      currentPage: 1,
      maxNumPage: 1,
      // 筛选
      filterData: {},
      paperCategory: [],
      paperCate: '1', // 选中的tab
      paperType: [],
      // 动效
      balls: [
        { show: false, el: '' },
        { show: false, el: '' },
        { show: false, el: '' },
        { show: false, el: '' },
        { show: false, el: '' }
      ],
      currentStatus: 0, // 0可点击|1不可点击
      dropIndex: -1,
      dropBall: [],
      paperBuildWay: '',
      showEditPaper: false,
      sourceId: ''
    }
  },
  methods: {
    showToastFn (text) {
      this.showToast = true
      this.toastText = text
      window.clearTimeout(this.clearToastTimeout)
      this.clearToastTimeout = window.setTimeout(() => {
        this.showToast = false
      }, 1000)
    },
    getSkipPage (page) {
      this.currentPage = page
    },
    goGroupPaper () {
      window.$(`.nav-list li:eq(1) a`).click()
      window.$(`#zxzj li:eq(${this.filterData.paperCatgId - 1}) a`).click() // 3题型组卷 | 4模板组卷
    },
    showPaperOption (paperId) {
      window.clearTimeout(this.clearTimeOut)
      this.currentPaperId = paperId
    },
    hidePaperOption () {
      this.clearTimeOut = window.setTimeout(() => {
        this.currentPaperId = ''
      }, 1000)
    },
    sortUp (index) {
      if (index === 0) {
        if (this.currentPage > 1) { // 跨页排序
          this.getSortData('sortup', (data) => {
            $.post('/paperConfigure/sortUp', {
              paperId: this.papersList[index].paperID,
              upPaperId: data[data.length - 1].paperID
            }, (res) => {
              if (res.status === 1) {
                this.currentPage = this.currentPage - 1
                this.randerPaper()
              }
            })
          })
        }
      } else {
        $.post('/paperConfigure/sortUp', {
          paperId: this.papersList[index].paperID,
          upPaperId: this.papersList[index - 1].paperID
        }, (res) => {
          if (res.status === 1) {
            this.randerPaper()
          }
        })
      }
    },
    sortDown (index) {
      if (index === this.papersList.length - 1) {
        if (this.currentPage < this.maxNumPage) { // 跨页排序
          this.getSortData('sortdown', (data) => {
            $.post('/paperConfigure/sortUp', {
              paperId: this.papersList[index].paperID,
              upPaperId: data[0].paperID
            }, (res) => {
              if (res.status === 1) {
                this.currentPage = this.currentPage + 1
                this.randerPaper()
              }
            })
          })
        }
      } else {
        $.post('/paperConfigure/sortDown', {
          paperId: this.papersList[index].paperID,
          downPaperId: this.papersList[index + 1].paperID
        }, (res) => {
          if (res.status === 1) {
            this.randerPaper()
          }
        })
      }
    },
    getSortData (type, callback = function () {}) {
      let page = 0
      if (type === 'sortup') {
        page = this.currentPage - 1
      } else if (type === 'sortdown') {
        page = this.currentPage + 1
      }
      $.get('/papers/get_list', {
        page: page,
        rows: 10,
        volumeId: this.filterData.volumeId,
        textbookId: this.filterData.textbookId,
        paperCatgId: this.filterData.paperCatgId,
        paperSourceId: this.filterData.paperSourceId,
        paperTypeId: this.filterData.paperTypeId,
        paperAreaList: this.filterData.areaId
      }, (res) => {
        if (res.result == 1) {
          callback(res.info.list)
        }
      })
    },
    close () {
      this.showEditPaper = false
    },
    cancelDrop () {
      for (let i = 0; i < this.balls.length; i++) {
        this.balls[i] = {
          show: false,
          el: ''
        }
      }
    },
    drop (index) {
      let el = document.getElementsByClassName('rendeRight')[index].getElementsByTagName('dl')[1].getElementsByTagName('button')[1]
      if (this.dropIndex !== index) {
        this.dropIndex = index
        this.cancelDrop()
      }
      for (let i = 0; i < this.balls.length; i++) {
        if (!this.balls[i].show) {
          let ball = this.balls[i]
          ball.show = true
          ball.el = el
          this.dropBall.push(ball)
          return false
        }
      }
    },
    beforeEnter (el) {
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect()
          let rectEl = document.getElementById('sjgl-create').getBoundingClientRect()
          let x = -(window.innerWidth - rect.left - 140) // 计算X轴偏移
          let y = rect.top - rectEl.top // 计算Y轴偏移
          // 处理外层动画
          el.style.display = ''
          el.style.webkitTransform = `translate3d(0, ${y}px, 0)`
          el.style.transform = `translate3d(0, ${y}px, 0)`
          // 处理内层动画
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`
          inner.style.transform = `translate3d(${x}px, 0, 0)`
        }
      }
    },
    enter (el, done) {
      setTimeout(() => {
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0, 0, 0)'
          el.style.transform = 'translate3d(0, 0, 0)'
          // 处理内层动画
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = 'translate3d(0, 0, 0)'
          inner.style.transform = 'translate3d(0, 0, 0)'
          el.addEventListener('transitionend', done)
        })
      }, 0)
    },
    afterEnter (el) {
      let ball = this.dropBall.shift()
      if (ball) {
        ball.show = false
        ball.el = ''
        el.style.display = 'none'
      }
    },
    randerPaper () {
      this.loadingFlag = true
      this.papersList = []
      $.get('/papers/get_list', {
        page: this.currentPage,
        rows: 10,
        volumeId: this.filterData.volumeId,
        textbookId: this.filterData.textbookId,
        paperCatgId: this.filterData.paperCatgId,
        paperSourceId: this.filterData.paperSourceId,
        paperTypeId: this.filterData.paperTypeId,
        paperAreaList: this.filterData.areaId
      }, (res) => {
        if (res.result == 1) {
          this.loadingFlag = false
          this.paperListInfo()
          if (res.info.list.length) {
            this.papersList = [].concat(res.info.list)
            this.currentPage = res.info.page.page
            this.maxNumPage = Math.ceil(res.info.page.total / res.info.page.rows)
          }
        }
      })
    },
    previewPaper (paperId) {
      window.open('/view/viewPaper.html?paperId=' + paperId)
    },
    editPaper (res) {
      res.paperTypeId = res.paperType.id
      this.paperBuildWay = res.paperCatgId === '1' || res.paperTypeId === '7' ? 'common' : 'temp'
      this.sourceId = res.paperSource.id
      res.regionData = JSON.stringify(res.paperAreaList).replace(/Id/g, '')
      this.editPaperData = window.$.extend(true, {}, res)
      // this.$refs.dialog.showDialog(true)
      this.showEditPaper = true
    },
    deletePaper (paperId, cmpCatgId, paperCatgId) {
      window.tipDialog({
        type: 'warn',
        content: '试卷删除后将不能用于发布新的测评，确定删除？',
        warnBtn: '确认',
        cancelBtn: '取消',
        isClose: true,
        warnCallback: (closeDialog) => {
          $.post('/papers/delete', { paperID: paperId }, (res) => {
            if (res.result == 1) {
              closeDialog()
              if (this.papersList.length === 1 && this.currentPage > 1) {
                this.currentPage = this.currentPage - 1
              }
              this.randerPaper()
              this.removePaper(paperId, cmpCatgId, paperCatgId)
            } else {
              this.showToastFn(res.info.message)
            }
          })
        }
      })
    },
    releasePaper (paperId) {
      $.post('/api/lst/append', {
        type: 'tsks',
        paperIds: paperId,
      }, (res) => {
        this.showToastFn(res.info)
      })
    },
    paperListInfo () {
      $.get('/competitionConfigureV2/paperListInfo', {
        competitionId: this.competitionId,
        paperCatgId: this.competitionId ? this.competitionInfo.paperCatgId : this.filterData.paperCatgId
      }, (res) => {
        if (res.status === 1) {
          this.choosePaperList = [].concat(res.data)
          for (let i = 0; i < this.papersList.length; i++) {
            this.$set(this.papersList[i], 'isChooesed', false)
            for (let k = 0; k < this.choosePaperList.length; k++) {
              if (String(this.choosePaperList[k].paperId) === String(this.papersList[i].paperID)) {
                this.$set(this.papersList[i], 'isChooesed', true)
              }
            }
          }
        } else {
          this.showToastFn(res.info)
        }
      })
    },
    choosePaper (paperId, index, cmpCatgId, paperCatgId) {
      if (this.currentStatus === 1) {
        return false
      }
      this.currentStatus = 1
      window.$.ajax({
        url: '/competitionConfigureV2/paperWrite',
        type: 'post',
        dataType: 'json',
        data: {
          competitionId: this.competitionId,
          cmpCatgId: cmpCatgId,
          paperId: paperId,
          paperCatgId: paperCatgId
        },
        success: (res) => {
          if (res.status == 1) {
            this.drop(index)
            this.paperListInfo()
          } else {
            this.showToastFn(res.info)
          }
        },
        complete: (xhr) => {
          this.currentStatus = 0
        }
      })
    },
    removePaper (paperId, cmpCatgId, paperCatgId) {
      if (this.currentStatus === 1) {
        return false
      }
      this.currentStatus = 1
      window.$.ajax({
        url: '/competitionConfigureV2/paperRemove',
        type: 'post',
        dataType: 'json',
        data: {
          competitionId: this.competitionId,
          cmpCatgId: cmpCatgId,
          paperId: paperId,
          paperCatgId: paperCatgId
        },
        success: (res) => {
          if (res.status == 1) {
            this.paperListInfo()
          } else {
            this.showToastFn(res.info)
          }
        },
        complete: (xhr) => {
          this.currentStatus = 0
        }
      })
    },
    createCP () {
      this.onSelectPaper(this.choosePaperList[0].cmpCatgId, this.competitionId, this.competitionInfo)
    },
    // 筛选用
    handleGetCategory () {
      $.get('/paperConfigure/getPaperCategory', {}, (res) => {
        if (res.status === 1) {
          this.paperCategory = [].concat(res.data)
          this.paperCate = res.data[0].paperCatgId
        } else {
          this.showToastFn(res.info)
        }
      })
    },
    switchTab (id) {
      for (let i = 0; i < this.paperCategory.length; i++) {
        if (id === this.paperCategory[i].paperCatgId) {
          this.paperType = [{
            paperTypeId: '-1',
            paperTypeName: '全部',
            cmpCatgId: '',
          }].concat(this.paperCategory[i].paperTypeList)
          break
        }
      }
      this.paperCate = id
    },
    handleFilter (val) {
      this.currentPage = 1
      this.filterData = Object.assign({}, val)
      this.randerPaper()
    },
  },
  watch: {
    currentPage: function (val) {
      this.randerPaper()
    }
  },
  created () {
    this.handleGetCategory()
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
@image-base-url: "../../../assets/nlcp";
button {
  font-family: "Microsoft YaHei";
}
::-ms-clear,
::-ms-reveal {
  display: none;
}
#Sjgl {
  width: 100%;
  margin: 0 auto;
  padding: 0 0 30px;
  position: relative;

  .sjgl-list {
    & > ul {
      margin-top: 10px;
      &.renderLoading {
        & > li {
          background: #fff;
          height: 220px;
          padding-top: 80px;
          & > i.loading {
            display: block;
            width: 60px;
            height: 60px;
            margin: 0 auto;
            background-image: url("@{image-base-url}/icon_loading.gif");
          }
          & > span {
            display: block;
            margin: 10px auto 0;
            font-size: 14px;
            color: #999;
            text-align: center;
          }
        }
      }
      &.renderNormal {
        & > li {
          position: relative;
          margin-top: 10px;
          padding: 0 20px;
          background: #fff;

          &:first-child {
            margin: 0;
          }

          & > span {
            float: left;
            width: 60px;
            height: 80px;
            margin-top: 20px;
            border-radius: 5px;
            &.cpzy {
              background-image: url("@{image-base-url}/icon_back1.png");
            }
            &.tsks {
              background-image: url("@{image-base-url}/icon_back2.png");
            }
          }

          & > div.renderLeft {
            max-width: 480px;
            padding: 25px 0 20px 80px;

            & > p {
              height: 30px;
              line-height: 30px;
              margin: 0;
              padding: 0;

              &:first-child {
                & > span {
                  font-size: 16px;
                  color: #666;
                }
                & > i.lock {
                  display: inline-block;
                  position: relative;
                  top: 1px;
                  width: 14px;
                  height: 16px;
                  margin-left: 5px;
                  background-image: url("@{image-base-url}/ic_see.png");
                }
                & > em {
                  display: inline-block;
                  position: relative;
                  top: -1px;
                  width: 34px;
                  height: 18px;
                  line-height: 18px;
                  margin-left: 5px;
                  font-style: normal;
                  text-align: center;
                  font-size: 12px;
                  color: #fff;
                  background: #ff9900;
                }
              }

              &:last-child {
                margin-top: 15px;
                & > span {
                  position: relative;
                  font-size: 12px;
                  color: #999;
                  line-height: 30px;

                  &:nth-child(2),
                  &:nth-child(4) {
                    padding-right: 10px;
                  }

                  &:nth-child(2)::after,
                  &:nth-child(4)::after {
                    content: "";
                    position: absolute;
                    top: 2px;
                    right: 0;
                    width: 1px;
                    height: 12px;
                    background: #ededed;
                  }

                  &:nth-child(3),
                  &:nth-child(5) {
                    padding-left: 10px;
                  }
                }
              }
            }
          }

          & > div.rendeRight {
            width: 220px;
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;

            & > dl {
              margin: 0;
              padding: 0;
              &:nth-child(1) {
                position: absolute;
                top: 15px;
                right: 15px;

                & > i {
                  position: absolute;
                  top: 0;
                  display: block;
                  height: 16px;
                  cursor: pointer;

                  &.arrow {
                    width: 16px;
                    background-image: url("@{image-base-url}/icon_menu2.png");
                    background-repeat: no-repeat;
                  }

                  &:nth-child(1) {
                    right: 50px;
                    background-position: 0 -32px;

                    &:hover {
                      background-position: 0 0;
                    }
                    &.disabled {
                      background-position: 0 -32px;
                      cursor: default;
                      &:hover {
                        background-position: 0 -32px;
                      }
                    }
                  }

                  &:nth-child(2) {
                    right: 35px;
                    background-position: 0 -48px;

                    &:hover {
                      background-position: 0 -16px;
                    }

                    &.disabled {
                      background-position: 0 -48px;
                      cursor: default;
                      &:hover {
                        background-position: 0 -48px;
                      }
                    }
                  }

                  &.sjgl-cover {
                    width: 30px;
                    right: 0;
                    background-image: url("@{image-base-url}/icon_menu1.png");
                    background-repeat: no-repeat;
                    background-position: 0 0;

                    &.active {
                      background-position: 0 -15px;
                    }
                  }
                }
              }

              &:nth-child(2) {
                position: absolute;
                right: 20px;
                bottom: 20px;

                & > button {
                  width: 80px;
                  height: 30px;
                  line-height: 30px;
                  box-sizing: border-box;
                  border-radius: 3px;
                  font-size: 14px;
                  border: none;
                  text-align: center;

                  &:first-child {
                    background: #fff;
                    color: #999;
                    border: 1px solid #ccc;
                  }

                  &:last-child {
                    position: relative;
                    left: 20px;
                    margin-right: 20px;
                    border: 1px solid #21bd73;
                  }

                  &.confirmSelect {
                    color: #fff;
                    background: #21bd73;
                    &:hover {
                      background: #24cc7c;
                    }
                  }

                  &.cancelSelect {
                    color: #21bd73;
                    background: #fff;
                  }
                }
              }
            }

            & > div {
              position: absolute;
              right: -75px;
              top: -1px;
              width: 60px;
              background: #fff;
              border: 1px solid #ededed;
              text-align: center;
              padding: 10px 0;
              box-sizing: border-box;

              & > div.triangle {
                position: absolute;
                top: 9px;
                left: -12px;
                width: 0;
                height: 0;
                border-bottom: 10px solid transparent;
                border-right: 10px solid #ededed;
                border-top: 10px solid transparent;
                & > span {
                  display: block;
                  position: absolute;
                  left: 2px;
                  top: -10px;
                  width: 0;
                  height: 0;
                  border-bottom: 10px solid transparent;
                  border-right: 10px solid #fff;
                  border-top: 10px solid transparent;
                }
              }

              & > span {
                display: block;
                height: 40px;
                line-height: 40px;
                position: relative;
                cursor: pointer;

                &:hover {
                  color: #21bd73;
                }

                &::after {
                  content: "";
                  position: absolute;
                  left: 50%;
                  right: 0;
                  bottom: 0;
                  width: 30px;
                  height: 1px;
                  margin-left: -15px;
                  background: #ededed;
                }

                &:last-child::after {
                  width: 0;
                  height: 0;
                }
              }
            }
          }
        }
      }
      &.renderEmpty {
        & > li {
          background: #fff;
          height: 280px;
          padding-top: 20px;
          & > i.emptyPaper {
            display: block;
            width: 160px;
            height: 160px;
            margin: 0 auto;
            background-image: url("@{image-base-url}/pic_nopaper.png");
          }
          & > span {
            display: block;
            margin: 10px auto 0;
            font-size: 16px;
            color: #21bd73;
            text-decoration: underline;
            text-align: center;
            cursor: pointer;
          }
        }
      }
    }
  }
}
#sjgl-create {
  position: fixed;
  right: 0;
  width: 200px;
  background: #fff;
  text-align: center;
  &.active {
    border: 1px solid #84d8ae;
  }

  & > .total {
    line-height: 40px;
    font-size: 14px;
    color: #fff;
    background: #21bd73;
    & > em {
      font-size: 16px;
      font-style: normal;
      font-weight: bold;
    }
  }
  & > .selectPaperList {
    padding: 20px 15px 30px;
    max-height: 400px;
    overflow-y: scroll;

    & > li {
      font-size: 14px;
      color: #666;
      line-height: 40px;
      text-align: left;
      & > span {
        text-align: left;
      }
      & > button {
        margin-top: 8px;
        float: right;
        color: #21bd73;
        background: #fff;
        text-align: right;
        border: none;
        cursor: pointer;
      }
    }
  }
  & > .createCP {
    width: 110px;
    line-height: 34px;
    margin-bottom: 20px;
    font-size: 16px;
    color: #fff;
    background: #21bd73;
    border: none;
    border-radius: 4px;
  }
  & > .empty {
    font-size: 14px;
    color: #ccc;
    line-height: 160px;
    border: 1px solid #ddd;
  }
}

#toast {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 40px;
  line-height: 40px;
  margin: -20px 0 -100px 0;

  & > p {
    text-align: center;
    font-size: 16px;
    color: #fff;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 20px;
  }
}

.ball-container {
  & > .ball {
    position: absolute;
    top: 25px;
    right: 92px;
    z-index: 99;
    transform: translate3d(0, 0, 0);
    transition: all 0.6s cubic-bezier(0, 0, 0.58, 1);

    & > .inner {
      width: 16px;
      height: 16px;
      border-radius: 100%;
      background: #21bd73;
      transform: translate3d(0, 0, 0);
      transition: all 0.6s linear;
    }
  }
}

.dialog.layerDialog .smart-scroll::-webkit-scrollbar {
  width: 6px;
  height: 12px;
}
.dialog.layerDialog .smart-scroll::-webkit-scrollbar-button:vertical {
  display: none;
}
.dialog.layerDialog .smart-scroll::-webkit-scrollbar-track:vertical {
  background-color: transparent;
}
.dialog.layerDialog .smart-scroll::-webkit-scrollbar-track-piece {
  background: transparent;
}
.dialog.layerDialog .smart-scroll::-webkit-scrollbar-thumb:vertical {
  background-color: #21bd73;
  border-radius: 3px;
}
.dialog.layerDialog .smart-scroll::-webkit-scrollbar-thumb:vertical:hover {
  background-color: #21bd73;
}

@media screen and (min-height: 768px) {
  #sjgl-create {
    top: 25%;
  }
}

@media screen and (max-height: 767px) {
  #sjgl-create {
    bottom: 0;
    width: 160px;
  }
}

.smart-scroll {
  scrollbar-base-color: #fff;
  scrollbar-darkshadow-color: #fff;
  scrollbar-shadow-color: #21bd73;
  scrollbar-arrow-color: #21bd73;
  scrollbar-track-color: #21bd73;
}
</style>