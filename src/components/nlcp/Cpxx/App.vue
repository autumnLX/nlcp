<template>
  <div id="cpxx">
    <div class="cpxx-header">
      <span v-if='!isEditName' :title='cinfo.competitionName'>{{cinfo.competitionName}}</span>
      <i v-if='!isEditName && cinfo.isMine && !cinfo.isEnd && !cinfo.isFiled' @click='onEditCname'></i>
      <input type="text" id='editCname' v-if='isEditName' v-model='cname' @blur='editCompetitionName'>
    </div>
    <div class="cpxx-competitionInfo">
      <dl>
        <dt>测评形式：</dt>
        <dd>
          <p>{{cinfo.competitionTypeName}}</p>
          <i v-if='cinfo.isMine && !cinfo.isEnd && !cinfo.isFiled' @click='onGoToEdit'>编辑</i>
        </dd>
      </dl>
      <dl>
        <dt>测评试卷：</dt>
        <dd>
          <ul>
            <li
              v-for='paper in cinfo.competitionPapers'
              :key='paper.id'
            >
              {{paper.name}}
            </li>
          </ul>
        </dd>
      </dl>
      <dl v-if='cinfo.competitionType == 4' class="information">
        <dt>测评信息：</dt>
        <dd>
          <img :src="ImgUrl" alt="" v-if="showFlag">
          <p class="mes"><span>[</span><a href="#" @mouseenter="enter" @mouseleave="leave">预览海报</a><span>]</span></p>
          <p :title="msg" class="intro">{{introduce.length > 40 ? introduce.substring(0, 40) + "..." : introduce}}</p>
        </dd>
      </dl>
      <dl>
        <dt>参与学生：</dt>
        <dd>
          <ul>
            <li
              v-for='group in cinfo.groupRange'
              :key='setStudentGroupName(group)'
            >
              {{setStudentGroupName(group)}}
            </li>
          </ul>
        </dd>
      </dl>
      <dl v-if='cinfo.competitionType == 4'>
        <dt>测评模式：</dt>
        <dd>
          <p>{{modeName}}</p>
        </dd>
      </dl>
      <dl v-if='cinfo.competitionType != 2'>
        <dt>成绩显示时间：</dt>
        <dd>
          <p>{{scoreShowtime}}</p>
        </dd>
      </dl>
      <dl v-if='cinfo.competitionType != 2'>
        <dt>测评时间：</dt>
        <dd>
          <p>{{cpTime}}</p>
        </dd>
      </dl>
    </div>

    <div class="unsupport" v-if='cinfo.competitionType == 2'></div>
    <div class="noSubmit" v-else-if='ginfo.submitNum <= 0'><label @click='backToList'>返回列表</label></div>
    <div class="cpxx-otherInfo" v-else-if='ginfo.submitNum > 0'>
      <div class="cpxx-otherInfo-header">
        整体情况
      </div>

      <div class="generalInfo">
        <div class="gi-info">
          <dl>
            <dt>{{ginfo.paperFullScore}}</dt>
            <dd>试卷满分</dd>
          </dl>
          <dl>
            <dt class="greenFont">{{ginfo.avgScore}}</dt>
            <dd>平均分数</dd>
          </dl>
          <dl>
            <dt>{{ginfo.submitNum}}<span>/{{ginfo.studentsNum}}</span></dt>
            <dd>测评人数/总人数</dd>
          </dl>
          <dl>
            <dt>{{Math.round(ginfo.submitRate * 100 * 100) / 100}}<span>%</span></dt>
            <dd>提交率</dd>
          </dl>
        </div>
        <div class="gi-report">
          <div class="oi-header"><p>成绩分布情况</p><span>（按百分比显示）</span></div>
          <div class="oi-content" id="oi-report" style="width: 100%;height: 200px;"></div>
        </div>
        <div class="gi-undoList" v-if='ginfo.undoStudents.length > 0'>
          <div class="oi-header">
            <p>未提交学生名单<span>（{{ginfo.undoStudents.length}}人）</span></p>
            <label @click='onShowMore' :class='{upArrow: showMore}'>{{showMore ? '收起' : "展开"}}<i></i></label>
          </div>
          <div class="oi-content" :style='{height: showMore ? "auto" : "30px"}'>
            <ul>
              <li
                v-for='(student, i) in ginfo.undoStudents'
                :key='student + i'
              >{{student}}</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="studentsDest" v-if='cinfo.groupType != "grade" && dGet'>
        <div class="oi-header"><p>学生成绩情况</p></div>
        <div class="oi-content">
          <div>
            <p :class='{active: destType == 0}' @click='onSelectDestType(0)'>前10%</p>
            <p :class='{active: destType == 1}' @click='onSelectDestType(1)'>前11-50%</p>
            <p :class='{active: destType == 2}' @click='onSelectDestType(2)'>前51-90%</p>
            <p :class='{active: destType == 3}' @click='onSelectDestType(3)'>后10%</p>
          </div>
          <ul>
            <li
              v-for='student in dinfo[destType]'
              :key='student.studentId'
            >{{student.studentName}}</li>
          </ul>
        </div>
      </div>

      <div class="studentWave" v-if='cinfo.groupType != "grade" && wGet'>
        <div class="oi-header"><p>成绩波动较大的学生</p><span>距离上次测评，班级/分组排名波动在10%及以上的学生</span></div>
        <div class="oi-content not-end" v-if='!cinfo.isEnd'></div>
        <div class="oi-content no-data" v-else-if='winfo.list.length <= 0'></div>
        <div class="oi-content" v-else>
          <table>
            <thead>
              <tr>
                <td>姓名</td>
                <td>班级/分组</td>
                <td>本次成绩</td>
                <td>本次排名</td>
                <td>上次成绩</td>
                <td>上次排名</td>
                <td>波动</td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for='(student, i) in winfo.list'
                :key='student.studentId'
                :class='{odd: i % 2 == 1}'
              >
                <td>{{student.studentName}}</td>
                <td>{{student.ClassOrLayer}}</td>
                <td>{{student.currentScore}}</td>
                <td>{{student.currentRank}}</td>
                <td>{{student.prevScore}}</td>
                <td>{{student.prevRank}}</td>
                <td :class='student.rankWave >= 0 ? "greenFont" : "redFont"'>{{Math.round(student.rankWave * 100 * 100) / 100}}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="submitInfo" v-if='cinfo.groupType == "grade" && sGet'>
        <div class="oi-header"><p>提交情况</p></div>
        <div class="oi-content">
          <table>
            <thead>
              <tr>
                <td>学生</td>
                <td>测评总人数</td>
                <td>已测评人数</td>
                <td>测评完成率</td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for='(group, i) in sinfo'
                :key='group.groupName'
                :class='{odd: i % 2 == 1}'
              >
                <td>{{group.groupName}}</td>
                <td>{{group.totalNum}}</td>
                <td>{{group.submitNum}}</td>
                <td>{{Math.round(group.submitRate * 100 * 100) / 100}}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/config/config.js'
const resUrl = window.Config ? window.Config.resUrl : config.resUrl

export default {
  name: 'cpxx',
  props: ['role', 'onChangeView', 'onSelectPaper', 'competitionId'],
  data () {
    return {
      mgs: '',
      ImgUrl: '',
      showFlag: false,
      isEditName: false,
      cname: '',
      showMore: false,
      destType: 0,
      cinfo: {
        competitionPapers: [],
        groupRange: [],
        showResultDate: '',
        startTime: '',
        endTime: ''
      },
      ginfo: {
        undoStudents: [],
      },
      dinfo: [[], [], [], []],
      winfo: {
        list: []
      },
      sinfo: [],
      dGet: false,
      wGet: false,
      sGet: false,
      competitionInfo: {
        competitionType: '',
        competitionId: this.competitionId,
        competitionName: '',
        imgUrl: '',
        thumbImgUrl: '',
        introduce: '',
        answerProcess: '',
        showTimeFlag: '',
        showTime: '',
        releaseScope: {
          type: '',
          ids: []
        },
        startDate: '',
        endDate: ''
      },
    }
  },
  methods: {
    getCompetitionInfo () {
      let that = this
      window.solution.server.get('/CompetitionsRanges/getCompetitionInfo', {
        competitionId: this.competitionId
      }, (res) => {
        if (res.status == 1) {
          that.cinfo = Object.assign({}, res.data)
          that.cname = that.cinfo.competitionName
          that.msg = that.cinfo.introduce.replace(/<[^>]*>|<\/[^>]*>/g, '').replace(/\s+/g, '').replace(/&nbsp;/g, '')
          that.ImgUrl = that.cinfo.imgUrl ? resUrl + that.cinfo.imgUrl : '/static/nlcp/pic_testbg-0' + that.cinfo.competitionType + '.png'
          let ids = []

          if (that.role == 'ls') {
            for (let i = 0; i < that.cinfo.groupRange.length; i++) {
              ids.push(that.cinfo.groupRange[i].id)
            }
          } else if (that.role == 'gl') {
            for (let i = 0; i < that.cinfo.groupRange.length; i++) {
              ids.push(that.cinfo.groupRange[i].categoryName)
            }
          }

          if (that.cinfo.competitionType == 2) {
            window.$('#dsjd').parent().hide()
            window.$('#xqfx').parent().hide()
          } else {
            window.$('#dsjd').parent().show()
            if (that.cinfo.isMine && that.role == 'ls') {
              window.$('#xqfx').parent().show()
            } else {
              window.$('#xqfx').parent().hide()
            }
          }

          that.competitionInfo = {
            competitionType: that.cinfo.competitionType,
            competitionId: that.competitionId,
            competitionName: that.cinfo.competitionName,
            imgUrl: that.cinfo.imgUrl,
            thumbImgUrl: that.cinfo.thumbImgUrl,
            introduce: that.cinfo.introduce,
            answerProcess: that.cinfo.answerProcess,
            showTimeFlag: that.cinfo.showResultType,
            showTime: that.cinfo.showResultDate ? that.cinfo.showResultDate.substring(0, 16) : '',
            releaseScope: {
              type: that.cinfo.groupType,
              ids: ids
            },
            startDate: that.cinfo.startTime ? that.cinfo.startTime.substring(0, 16) : '',
            endDate: that.cinfo.endTime ? that.cinfo.endTime.substring(0, 16) : '',
            paperCatgId: that.cinfo.paperCatgId,
          }

          if (res.data.competitionPapers.length <= 0) {
            alert('缺少测评试卷。')
          }

          if (that.cinfo.competitionType != 2 && res.data.competitionPapers.length > 0) {
            that.getGeneralInfo()
          }
        } else {
          alert(res.info)
        }
      })
    },
    getGeneralInfo () {
      let that = this
      window.solution.server.get('/CompetitionsRanges/getGeneralInfo', {
        competitionId: this.competitionId
      }, (res) => {
        if (res.status == 1) {
          that.ginfo = Object.assign({}, res.data)

          if (that.cinfo.groupType != 'grade' && that.ginfo.submitNum > 0) {
            that.getStudentsDest()

            if (that.cinfo.isEnd) {
              that.getStudentWave()
            }
          } else {
            that.getSubmitInfo()
          }
        } else {
          alert(res.info)
        }
      })
    },
    getStudentsDest () {
      let that = this
      window.solution.server.get('/CompetitionsRanges/getStudentsDest', {
        competitionId: this.competitionId
      }, (res) => {
        that.dGet = true
        if (res.status == 1) {
          that.dinfo = Object.assign({}, res.data)
        } else {
          alert(res.info)
        }
      })
    },
    getStudentWave () {
      let that = this
      window.solution.server.get('/CompetitionsRanges/studentWave', {
        competitionId: this.competitionId
      }, (res) => {
        that.wGet = true
        if (res.status == 1) {
          that.winfo = Object.assign({}, res.data)
        } else {
          alert(res.info)
        }
      })
    },
    getSubmitInfo () {
      let that = this
      window.solution.server.get('/CompetitionsRanges/getSubmitInfo', {
        competitionId: this.competitionId
      }, (res) => {
        that.sGet = true
        if (res.status == 1) {
          that.sinfo = Object.assign({}, res.data)
        } else {
          alert(res.info)
        }
      })
    },
    setStudentGroupName (group) {
      return group.categoryName + group.className + group.layerName
    },
    onEditCname () {
      this.isEditName = 'doEdit'
    },
    editCompetitionName () {
      let that = this
      this.isEditName = false
      window.solution.server.get('/CompetitionsRanges/updateCompetitionName', {
        competitionId: this.competitionId,
        competitionName: this.cname
      }, (res) => {
        if (res.status == 1) {
          that.$set(that.cinfo, 'competitionName', that.cname)
          that.$set(that.competitionInfo, 'competitionName', that.cname)
        } else {
          alert(res.info)
        }
      })
    },
    onGoToEdit () {
      this.onSelectPaper(this.cinfo.competitionType, this.competitionId, this.competitionInfo)
    },
    onShowMore () {
      this.showMore = !this.showMore
    },
    onSelectDestType (type) {
      this.destType = type
    },
    onCreateReport () {
      let reportData = []
      for (let i = 0; i < this.ginfo.studentDistribution.length; i++) {
        reportData.push(this.ginfo.studentDistribution[i].num)
      }

      let option = {
        tooltip: {
          formatter: '{c}人'
        },
        grid: {
          top: 0,
          bottom: 0,
          left: -25,
          right: 0,
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['0~10', '10~20', '20~30', '30~40', '40~50', '50~60', '60~70', '70~80', '80~90', '90~100'],
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: '#90deb9'
              }
            },
            axisLabel: {
              color: '#666'
            }
          }
        ],
        yAxis: [
          {
            show: false
          }
        ],
        series: [
          {
            name: '人数',
            type: 'bar',
            barWidth: '60%',
            itemStyle: {
              normal: {
                color: '#90deb9'
              },
              emphasis: {
                color: '#21bd73'
              }
            },
            data: reportData
          }
        ]
      }

      window.echarts.init(document.getElementById('oi-report')).setOption(option)
    },
    backToList () {
      window.$('.nav-list > li[data-for=nlcp]').data('isFromCpxx', true)
      this.onChangeView('Nlcp')
    },
    enter() {
      this.showFlag = true
    },
    leave() {
      this.showFlag = false
    },
  },
  computed: {
    modeName () {
      if (this.cinfo.answerProcess == 1) return '模考模式'
      else if (this.cinfo.answerProcess == 2) return '练习模式'
      else if (this.cinfo.answerProcess == 3) return '学生自选模式'
    },
    scoreShowtime () {
      let showType = this.cinfo.showResultType

      if (showType == 1) return this.cinfo.showResultDate.substring(0, this.cinfo.showResultDate.lastIndexOf(':')) + ' 公布成绩'
      else if (showType == 2) return '完成小题后显示'
      else if (showType == 3) return '完成整卷后显示'
      else if (showType == 0) return '实时显示'
    },
    cpTime () {
      return this.cinfo.startTime.substring(0, this.cinfo.startTime.lastIndexOf(':')) + ' 至 ' + this.cinfo.endTime.substring(0, this.cinfo.endTime.lastIndexOf(':'))
    },
    introduce() {
      if (this.cinfo.introduce) {
        return this.cinfo.introduce.replace(/<[^>]*>|<\/[^>]*>/g, '').replace(/\s+/g, '').replace(/&nbsp;/g, '')
      } else {
        return this.cinfo.introduce;
      }
    }
  },
  watch: {
    isEditName (newVal) {
      if (newVal) window.$('#editCname').focus()
    }
  },
  updated () {
    if (this.isEditName == 'doEdit') {
      window.$('#editCname').focus()
      this.isEditName = 'editing'
    }
    if (this.ginfo.submitNum > 0) this.onCreateReport()
  },
  mounted () {
    window.$('#left-container, #nlcp').show()
    this.getCompetitionInfo()
  }
}
</script>

<style lang="less" scoped>
@image-base-url: "../../../assets/nlcp";

#cpxx {
  .greenFont {
    color: #21bd73 !important;
  }

  .redFont {
    color: #ff6666 !important;
  }

  & > div {
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    margin-bottom: 10px;
  }

  .cpxx-header {
    height: 50px;
    text-align: center;

    span {
      max-width: 700px;
      height: 50px;
      line-height: 50px;
      display: inline-block;
      font-size: 18px;
      font-weight: bold;
      color: #666;
      position: relative;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    i {
      width: 20px;
      height: 20px;
      display: inline-block;
      vertical-align: top;
      margin-top: 15px;
      background: url("@{image-base-url}/icon_cp20x20.png") no-repeat -160px 0;
      cursor: pointer;
    }

    input {
      width: 100%;
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      color: #666;
      font-weight: bold;
      border: none;
      background: transparent;
      text-align: center;
    }
  }

  .cpxx-competitionInfo {
    padding: 25px 30px 15px;
    font-size: 14px;
    color: #666;

    * {
      padding: 0;
      margin: 0;
    }

    dl {
      width: 100%;
      min-height: 30px;
      line-height: 30px;
      margin-bottom: 5px;
      position: relative;

      dt {
        display: inline-block;
        float: left;
        margin-right: 10px;
      }

      dd {
        display: inline-block;
        max-width: 630px;
        .mes {
          color: #666;
          display: inline-block;
          overflow: hidden;
          &:hover {
            color: #21bd73;
          }
        }
        .intro {
          color: #666;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 560px;
        }

        img {
          width: 700px;
          height: 350px;
          position: absolute;
          top: 30px;
          left: 0;
          z-index: 999;
        }
        a {
          color: #666;
          &:hover {
            color: #21bd73;
            text-decoration: underline;
          }
        }
        
        i {
          display: inline-block;
          position: absolute;
          top: 0;
          right: 0;
          font-size: 14px;
          color: #21bd73;
          font-style: normal;
          cursor: pointer;
        }

        ul {
          width: 614px;

          li {
            display: inline-block;
            margin-right: 20px;
          }
        }
      }
    }
    dl.information {
      height: 30px;
    }
  }

  .cpxx-otherInfo {
    padding: 1px 0 30px;

    & > div {
      padding: 0 30px;
      margin-bottom: 20px;
    }

    .oi-header {
      width: 100%;
      height: 30px;
      margin-bottom: 10px;

      & > p {
        display: inline-block;
        line-height: 30px;
        font-size: 16px;
        color: #666;
        font-weight: bold;
        padding: 0;
        margin: 0;
      }

      & > span {
        font-size: 12px;
        display: inline-block;
        vertical-align: text-bottom;
        color: #ccc;
      }

      & > label {
        font-size: 14px;
        line-height: 20px;
        display: inline-block;
        float: right;
        color: #21bd73;
        padding: 5px 0;
        cursor: pointer;

        i {
          width: 20px;
          height: 20px;
          display: block;
          float: right;
          background: url("@{image-base-url}/icon_cp20x20.png") no-repeat -80px 0;
        }

        &.upArrow i {
          background-position: -100px 0;
        }
      }
    }

    .oi-content {
      width: 100%;

      table {
        width: 100%;
        border-collapse: collapse;
        border: none;

        thead {
          td {
            height: 30px;
            line-height: 30px;
            background-color: #21bd73;
            color: #fff;
            font-size: 14px;
            text-align: center;
          }
        }

        tbody {
          tr {
            td {
              height: 40px;
              line-height: 40px;
              background: #fff;
              font-size: 14px;
              color: #666;
              text-align: center;
            }

            &.odd {
              td {
                background: #f2f9f6;
              }
            }
          }
        }
      }
    }

    .cpxx-otherInfo-header {
      width: 100%;
      height: 30px;
      line-height: 30px;
      font-size: 18px;
      color: #333;
      box-sizing: border-box;
      border-left: 4px solid #21bd73;
      padding: 0;
      padding-left: 18px;
      text-align: left;
      margin: 20px auto;
    }

    .generalInfo {
      .oi-header {
        span {
          color: #ccc;
        }
      }

      .gi-info {
        width: 100%;
        height: 100px;
        box-sizing: border-box;
        padding: 33px 0;
        margin-bottom: 20px;

        dl {
          width: 25%;
          height: 34px;
          box-sizing: border-box;
          overflow: visible;
          border-left: 1px solid #ddd;
          padding: 0 10px 10px;
          float: left;

          &:first-child {
            border-left: 0
          }

          dt {
            width: 100%;
            height: 60px;
            line-height: 60px;
            font-size: 32px;
            color: #666;
            text-align: center;
            padding: 0;
            margin: 0;
            margin-top: -33px;

            span {
              line-height: 28px;
              font-size: 18px;
              color: #999;
              display: inline-block;
              vertical-align: middle;
              margin-left: 5px;
            }
          }

          dd {
            width: 100%;
            height: 30px;
            line-height: 30px;
            text-align: center;
            font-size: 12px;
            color: #999;
            padding: 0;
            margin: 0;
          }
        }
      }

      .gi-report {
        margin-bottom: 20px;

        .oi-content#oi-report {
          width: 100%;
          height: 200px;
          padding: 0;
        }
      }

      .gi-undoList {
        padding-bottom: 10px;

        .oi-header {
          p {
            span {
              color: #999;
              font-weight: normal;
            }
          }
        }

        .oi-content {
          width: 100%;
          background: #f2f9f6;
          overflow: hidden;

          ul {
            width: 735px;
            box-sizing: border-box;
            padding: 0 20px;

            li {
              height: 30px;
              line-height: 30px;
              display: inline-block;
              font-size: 14px;
              color: #666;
              margin-right: 25px;
            }
          }
        }
      }
    }

    .studentsDest {
      .oi-content {
        width: 100%;
        height: 162px;
        border: #ccf0df 1px solid;
        box-sizing: border-box;
        display: inline-block;

        div {
          width: 120px;
          display: block;
          float: left;

          p {
            line-height: 40px;
            background-color: #f2f9f6;
            padding: 0;
            margin: 0;
            padding-left: 20px;
            color: #666;
            cursor: pointer;

            &.active {
              background-color: #21bd73;
              color: #fff;
            }
          }
        }

        ul {
          width: 588px;
          height: 160px;
          box-sizing: border-box;
          float: left;
          padding: 10px 10px 10px 0;
          overflow-y: auto;

          li {
            width: auto;
            height: 30px;
            line-height: 30px;
            display: inline-block;
            float: left;
            color: #666;
            margin-left: 20px;
          }
        }
      }
    }

    .studentWave {
      .oi-header {
        span {
          float: right;
          color: #999;
        }
      }

      .oi-content {
        &.not-end {
          width: 100%;
          height: 240px;
          background: url("@{image-base-url}/pic_noending.png") no-repeat center center;
        }

        &.no-data {
          width: 100%;
          height: 240px;
          background: url("@{image-base-url}/pic_nofloat.png") no-repeat center center;
        }
      }
    }
  }

  .noSubmit, .unsupport {
    width: 100%;
    height: 240px;
    background-color: #fff;
    background-repeat: no-repeat;
    position: relative;
  }

  .noSubmit {
    background-image: url("@{image-base-url}/pic_nomessage.png");
    background-position: center 22px;
    text-align: center;

    label {
      line-height: 20px;
      display: inline-block;
      font-size: 14px;
      color: #21bd73;
      margin: 188px auto 0;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .unsupport {
    background-image: url("@{image-base-url}/pic_noanalyze.png");
    background-position: center center;
  }
}
</style>
