<template>
  <div id="nlcp">
    <ul id="nlcp-nav" :class='navClass' v-if='role != "dl"'>
      <li v-for='(view, i) in views' :key='view.abbr' v-if='Number(view.id) !== 2'>
        <div class="nlcp-nav-item" @click='onSelectModule($event, i, view.abbr, view.id)' :class='view.abbr.toLowerCase()'>
          <dl>
            <dt></dt>
            <dd>
              <p>{{ view.name }}</p>
              <label>{{ view.intro }}</label>
              <span>立即创建</span>
            </dd>
          </dl>
        </div>
      </li>
    </ul>
    <ul id="nlcp-cl-nav">
      <li :class='{active: currentList == "underway"}' @click='onChangeList("underway")'>正在进行</li>
      <li :class='{active: currentList == "filed"}' @click='onChangeList("filed")'>已经归档</li>
    </ul>
    <div id="nlcp-competitionList" v-if='listStatus != "loading"' :class='{"nlcp-competitionList-empty": listStatus == "empty"}'>
      <ul>
        <li
          v-for='(competition, i) in competitionList'
          :key='competition.id'
        >
          <div class="nlcp-cl-header">
            <p :class='{greyFont: competition.status == 2 || competition.status == 3}'><i></i>{{competition.startTime.split(' ')[0]}}{{competition.competitionType == 2 ? '' : ' ~ ' + competition.end_date.split(' ')[0]}}</p>
            <span :class='{underway: competition.status == 1}'>{{statusText(competition.status)}}</span>
          </div>
          <div class="nlcp-cl-info">
            <img class="nlcp-cl-img" :src='imgList[i]' >
            <p class="nlcp-cl-name" :title='competition.competitionName'>{{competition.competitionName}}</p>
            <p class="nlcp-cl-group" :style='{visibility: competition.gradeClass.length > 0 ? "visible" : "hidden"}' :title='competition.gradeClass.join(" / ")'><i></i>{{competition.gradeClass.join(' / ')}}</p>
            <p class="nlcp-cl-submitInfo" v-if='competition.competitionType != 2'>
              <i></i>
              提交情况：{{submitInfoText(competition.submitNum, competition.totalNum)}}
              <b v-if='competition.stageCount > 1' title="此为第一个阶段的统计数据"></b>
            </p>
          </div>
          <div id="nlcp-cl-btnbox">
            <i class="file" v-if='currentList == "underway" && competition.isMine' @click='fileCompetition(competition)' title="归档"></i>
            <i class="delete" v-if='competition.isMine' @click='deleteCompetition(competition)' title="删除"></i>
            <span class="check" @click='checkCompetition(competition)'>查看</span>
          </div>
        </li>
      </ul>
    </div>
    <div id="nlcp-pagination" v-if='listStatus == "filled"'>
      <ul>
        <li v-for='page in pageList' :key='page.idx' :class='page.cls' @click='onPageClick(page.idx, page.cls)'>{{page.idx}}</li>
      </ul>
      <div class="skip">
        <input type="text" v-model.number='tgtPage'> 页 <button @click='onSkipPage'>转到</button>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/config/config.js'

const views = window.Config ? window.Config.nlcpViews : config.nlcpViews

export default {
  name: 'nlcp',
  props: ['onGoToPaper', 'onGoToCpxx', 'role'],
  data() {
    return {
      views: [],
      navClass: '',
      currentList: 'underway',
      listStatus: '',
      pageList: [],
      competitionList: [],
      imgList: [],
      tgtPage: '',
      curPage: 1,
      maxPage: ''
    }
  },
  methods: {
    resUrl(url) {
      return url ? (window.Config ? window.Config.resUrl : config.resUrl) + url : ''
    },
    addPage(page, cls) {
      this.pageList.push({
        idx: page,
        cls: cls
      })
    },
    pagination(currentP, maxP) {
      this.curPage = currentP
      this.maxPage = maxP

      window.$('.nav-list > li[data-for=nlcp]').data('curPage', currentP)

      const defaultCfg = {
        currentPage: 1,
        maxPage: 1
      }

      let _cfg = Object.assign({}, defaultCfg, { currentPage: currentP, maxPage: maxP })
      let cur = _cfg.currentPage
      let max = _cfg.maxPage

      this.pageList = []

      this.addPage('<', 'prev' + (cur == 1 ? ' disabled' : ''))

      if (cur <= 4) {
        for (let i = 1; i < cur; i++) {
          this.addPage(i)
        }
      } else {
        this.addPage(1)
        this.addPage('...', 'other')

        for (let i = cur - 2; i < cur; i++) {
          this.addPage(i)
        }
      }

      this.addPage(cur, 'currentPage')

      if (max - cur > 3) {
        for (let i = cur + 1; i <= cur + 2; i++) {
          this.addPage(i)
        }
        this.addPage('...', 'other')
        this.addPage(max)
      } else {
        for (let i = cur + 1; i <= max; i++) {
          this.addPage(i)
        }
      }

      this.addPage('>', 'next' + (cur == max ? ' disabled' : ''))
    },
    onListChange(page) {
      let that = this
      this.listStatus = 'loading'

      window.solution.server.get('/englishCompetition/get_listnew', {
        type: this.currentList,
        currentPage: page
      }, (res) => {
        if (res.result == 1) {
          that.listStatus = 'filled'
          that.imgList = []
          that.competitionList = res.info.list.concat([])
          that.pagination(res.info.page.currentPage, res.info.page.pageTotal)
          if (that.competitionList.length == 0) {
            that.listStatus = 'empty'
          } else {
            for (var i = 0; i < that.competitionList.length; i++) {
              let comp = that.competitionList[i]
              that.imageLoad(comp.imgUrl, comp.competitionType, i)
            }
          }
        } else {
          alert(res.message)
        }
      })
    },
    imageLoad(url, ctype, i) {
      let _url = url ? this.resUrl(url) : '/static/nlcp/pic_testbg-0' + ctype + '.png'
      let errPic = '/static/nlcp/pic_occupy.png'
      let img = new Image()

      this.imgList[i] = errPic
      this.imgList = this.imgList.concat([])

      img.src = _url
      img.onerror = () => { img.src = errPic }
      img.onload = () => {
        if (img.complete) {
          this.imgList[i] = _url
          this.imgList = this.imgList.concat([])
        }
      }
    },
    statusText(status) {
      if (status == 0) return '未开始'
      else if (status == 1) return '进行中'
      else if (status == 2) return '已结束'
      else if (status == 3) return '已归档'
    },
    submitInfoText(snum, tnum) {
      let text
      if (snum && snum > 0) text = snum + ' / ' + tnum
      else text = '暂无学生参加测评'
      return text
    },
    onSelectModule(event, i, abbr, ctype) {
      if (abbr == 'Dzcp') {
        window.showDSBJ('', false, false, ctype)
      } else {
        this.onGoToPaper(ctype, '')
      }
    },
    onChangeList(target) {
      this.currentList = target
      window.$('.nav-list > li[data-for=nlcp]').data('currentList', target)
    },
    fileCompetition(competition) {
      let that = this
      window.tipDialog({
        type: 'title',
        title: '归档确认',
        content: '归档后，学生端不再显示该测评。',
        subcontent: '注意：此操作不可恢复，请谨慎操作！',
        cancelBtn: '取消',
        confirmBtn: '确认',
        isClose: true,
        confirmCallback: (closeDialog) => {
          console.info('file')
          window.solution.server.post('/englishCompetition/filing', {
            competitionId: competition.id
          }, (res) => {
            if (res.result == 1) {
              closeDialog()
              if (that.competitionList.length == 1) {
                that.onListChange(that.curPage > 1 ? that.curPage - 1 : 1)
              } else {
                that.onListChange(that.curPage)
              }
            } else {
              alert(res.message)
            }
          })
        }
      })
    },
    deleteCompetition(competition) {
      let that = this
      window.tipDialog({
        type: 'warn',
        // title: '归档确认',
        content: '确认删除该口语测评？',
        warnBtn: '删除',
        cancelBtn: '取消',
        isClose: true,
        warnCallback: (closeDialog) => {
          console.info('delete')
          window.solution.server.post('/englishCompetition/competition_del', {
            competitionId: competition.id
          }, (res) => {
            if (res.result == 1) {
              closeDialog()
              if (that.competitionList.length == 1) {
                that.onListChange(that.curPage > 1 ? that.curPage - 1 : 1)
              } else {
                that.onListChange(that.curPage)
              }
            } else {
              alert(res.message)
            }
          })
        }
      })
    },
    checkCompetition(competition) {
      let ctype = competition.competitionType
      let cid = competition.id

      document.cookie = 'isMine=' + competition.isMine

      if (ctype == 1) {
        window.showDSBJ(cid, false, this.currentList != 'underway', ctype)
      } else {
        this.onGoToCpxx(ctype, cid)
      }
    },
    onPageClick(idx, cls) {
      if (cls) {
        let _cls = cls.split(' ')

        if (_cls.indexOf('disabled') >= 0 || _cls.indexOf('other') >= 0 || _cls.indexOf('currentPage') >= 0) {
        } else {
          if (_cls.indexOf('prev') >= 0) this.onListChange(this.curPage - 1)
          else if (_cls.indexOf('next') >= 0) this.onListChange(this.curPage + 1)
        }
      } else {
        this.onListChange(idx)
      }
    },
    onSkipPage() {
      // this.onPageClick()
      if (/^[0-9]+$/.test(this.tgtPage)) {
        if (this.tgtPage != this.curPage) {
          if (this.tgtPage <= 0) alert('输入的页码格式不正确')
          else if (this.tgtPage > this.maxPage) alert('输入的页码超过最大页数')
          else this.onListChange(this.tgtPage)
        }
      } else if (this.tgtPage) {
        alert('输入的页码格式不正确')
      } else {
        alert('请输入要跳转的页码数')
      }
    }
  },
  watch: {
    currentList() {
      if (!window.$('.nav-list > li[data-for=nlcp]').data('isFromCpxx')) {
        this.onListChange(1)
      }
    }
  },
  mounted() {
    this.navClass = 'nav' + views.length
    this.views = views

    let pageInfo = window.$('.nav-list > li[data-for=nlcp]')

    if (pageInfo.data('isFromCpxx')) {
      this.curPage = pageInfo.data('curPage')
      this.currentList = pageInfo.data('currentList') ? pageInfo.data('currentList') : 'underway'
    }

    pageInfo.data('isFromCpxx', false)

    this.onListChange(this.curPage)
  }
}
</script>

<style lang="less" scoped>
@image-base-url: "../../../assets/nlcp";

.greyFont {
  color: #ccc !important;
}

#nlcp-nav {
  width: 1020px;
  height: 200px;
  padding: 0;
  margin: 0 0 30px -10px;

  &.nav3 > li {
    width: 340px;

    div.nlcp-nav-item {
      width: 320px;

      &:hover {
        width: 340px;
      }
    }
  }

  &.nav4 > li {
    width: 340px;

    div.nlcp-nav-item {
      width: 320px;

      &:hover {
        width: 340px;
      }
    }
  }

  li {
    display: block;
    float: left;
    list-style-type: none;
    height: 200px;

    div.nlcp-nav-item {
      height: 180px;
      background: #fff;
      margin: 10px;
      border-radius: 10px;
      box-shadow: #ededed 0 0 5px;
      transition: all 0.3s ease-in;
      overflow: hidden;
      cursor: pointer;

      dl {
        margin-top: 40px;
        transition: all 0.3s ease-in;

        dt {
          width: 50px;
          height: 50px;
          margin: 0 auto;
          background-repeat: no-repeat;
          background-image: url("@{image-base-url}/icon_cp50x50.png");
        }

        dd {
          margin: 0;

          p {
            font-size: 18px;
            line-height: 30px;
            padding: 0;
            margin: 0;
            text-align: center;
          }

          label {
            display: block;
            font-size: 14px;
            line-height: 18px;
            color: #ccc;
            text-align: center;
          }

          span {
            width: 120px;
            height: 40px;
            line-height: 40px;
            font-size: 16px;
            text-align: center;
            border: #fff 1px solid;
            border-radius: 20px;
            margin: 20px auto 0;
            display: block;
            opacity: 0;
            // transition: all 0.1s ease-in;
            transition-delay: 0.3s;
          }
        }
      }

      &:hover {
        height: 200px;
        margin: 0;

        dl {
          margin-top: 20px;

          dd {
            p {
              color: #fff;
              text-align: center;
            }

            label {
              color: #fff;
            }

            span {
              color: #fff;
              opacity: 1;
            }
          }
        }
      }

      &.cpzy {
        color: #21bd73;

        dt {
          background-position: 0 0;
        }

        &:hover {
          background-color: #21bd73;

          dt {
            background-position: 0 -50px;
          }
        }
      }

      &.tsks {
        color: #ff6464;

        dt {
          background-position: -50px 0;
        }

        &:hover {
          background-color: #ff6464;

          dt {
            background-position: -50px -50px;
          }
        }
      }

      &.dzcp {
        color: #fba439;

        dt {
          background-position: -100px 0;
        }

        &:hover {
          background-color: #fba439;

          dt {
            background-position: -100px -50px;
          }
        }
      }

      &.zxsj {
        color: #20a9e5;

        dt {
          background-position: -150px 0;
        }

        &:hover {
          background-color: #20a9e5;

          dt {
            background-position: -150px -50px;
          }
        }
      }
    }
  }
}

#nlcp-cl-nav {
  width: 100%;
  height: 50px;
  margin: 0 auto 10px;
  background-color: #fff;
  border-bottom: #ededed 1px solid;
  box-sizing: border-box;
  padding: 0;

  li {
    width: 180px;
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    color: #999;
    text-align: center;
    box-sizing: border-box;
    z-index: 1;
    display: block;
    float: left;
    cursor: pointer;

    &.active {
      color: #21bd73;
      border-bottom: #21bd73 2px solid;
    }
  }
}

#nlcp-competitionList {
  width: 100%;

  &.nlcp-competitionList-empty {
    height: 240px;
    background: #fff url("@{image-base-url}/pic_nodetails.png") no-repeat center
      40px;

    & > * {
      display: none;
    }
  }

  ul {
    padding: 0;
    margin: 0;

    li {
      width: 100%;
      // height: 209px;
      box-sizing: border-box;
      background-color: #fff;
      list-style: none;
      margin-bottom: 10px;
      position: relative;

      p {
        margin: 0;
      }

      .nlcp-cl-header {
        height: 45px;
        line-height: 45px;
        padding: 0 45px 0 20px;
        border-bottom: #ededed 1px solid;

        p {
          width: auto;
          display: inline-block;
          font-size: 14px;
          color: #666;

          i {
            width: 30px;
            height: 30px;
            display: inline-block;
            vertical-align: middle;
            margin-right: 15px;
            background: url("@{image-base-url}/icon_cp30x30.png") no-repeat 0px
              0;
          }
        }

        span {
          font-size: 14px;
          color: #ccc;
          display: block;
          float: right;

          &.underway {
            color: #ff9900;
          }
        }
      }

      .nlcp-cl-info {
        height: 130px;
        padding: 17px 45px 17px 20px;

        .nlcp-cl-img {
          width: 260px;
          height: 130px;
          display: block;
          float: left;
          border-radius: 5px;
          margin-right: 35px;
        }

        .nlcp-cl-name {
          font-size: 16px;
          color: #333;
          height: 40px;
          line-height: 40px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .nlcp-cl-group {
          font-size: 14px;
          color: #999;
          height: 30px;
          line-height: 30px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;

          i {
            width: 30px;
            height: 30px;
            display: block;
            float: left;
            margin-right: 5px;
            background: url("@{image-base-url}/icon_cp30x30.png") no-repeat -30px
              0;
          }
        }

        .nlcp-cl-submitInfo {
          font-size: 14px;
          color: #999;
          height: 30px;
          line-height: 30px;
          margin-top: 30px;

          i {
            width: 30px;
            height: 30px;
            display: block;
            float: left;
            margin-right: 5px;
            background: url("@{image-base-url}/icon_cp30x30.png") no-repeat -240px
              0;
          }

          b {
            width: 20px;
            height: 20px;
            display: inline-block;
            vertical-align: sub;
            margin-left: 5px;
            background: url("@{image-base-url}/icon_cp20x20.png") no-repeat -140px
              0;
          }
        }
      }
    }
  }
}

#nlcp-cl-btnbox {
  position: absolute;
  right: 45px;
  bottom: 17px;
  text-align: right;

  * {
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    cursor: pointer;
  }

  i {
    width: 34px;
    height: 34px;
    background-image: url("@{image-base-url}/icon_cp34x34.png");
    background-repeat: no-repeat;

    &.file {
      background-position: 0 0;
      margin-right: 4px;

      &:hover {
        background-position: -34px 0;
      }
    }

    &.delete {
      background-position: 0 -34px;

      &:hover {
        background-position: -34px -34px;
      }
    }
  }

  span {
    width: 80px;
    height: 34px;
    line-height: 34px;
    font-size: 16px;
    border-radius: 4px;
    color: #fff;
    margin-left: 30px;
    background-color: #21bd73;

    &:hover {
      background-color: #44cf8d;
    }
  }
}

#nlcp-pagination {
  width: 100%;
  height: 25px;
  padding: 0 20px;
  box-sizing: border-box;

  ul {
    padding: 0;
    margin: 0;

    li {
      width: 25px;
      height: 25px;
      line-height: 23px;
      border: #ccf0df 1px solid;
      border-radius: 3px;
      font-size: 14px;
      text-align: center;
      color: #999;
      box-sizing: border-box;
      background-color: #fff;
      margin-right: 5px;
      display: block;
      float: left;
      cursor: pointer;

      &:hover {
        background: #f2fbf7;
      }

      &.disabled {
        color: #ccc;
        border-color: #ccc;
        background: #fff;
        cursor: default;

        &:hover {
          background: #fff;
        }
      }

      &.currentPage {
        background: #21bd73;
        color: #fff;
        border-color: #21bd73;
      }

      &.other {
        border: 0;
        background: transparent;

        &:hover {
          background: transparent;
        }
      }
    }
  }

  .skip {
    height: 25px;
    line-height: 25px;
    color: #999;
    font-size: 14px;
    float: right;

    * {
      box-sizing: border-box;
    }

    input {
      width: 50px;
      height: 25px;
      line-height: 23px;
      text-align: center;
      font-size: 14px;
      color: #333;
      border: #ccf0df 1px solid;
      margin-right: 5px;
    }

    button {
      width: 60px;
      height: 25px;
      line-height: 25px;
      color: #fff;
      background: #21bd73;
      border: none;
      border-radius: 3px;
      margin-left: 5px;
    }
  }
}
</style>