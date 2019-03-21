<template>
  <div id="EditPaper">
    <div
      id="Cover"
      v-if="showEditPaper"
    >
      <div id="DialogBox">
        <div class="header">{{title}}<span
            class="close iconfont"
            @click="canclePaper"
          >&#xe621;</span></div>
        <div class="book">
          <label
            class="caption"
            for="paperName"
          >试卷名称：</label>
          <div class="book_container">
            <km-input
              :maxlength="32"
              v-model="editPaperParam.paperName"
            ></km-input>
          </div>
          <span
            v-show="paperNameTip"
            class="editPaperErrTip"
          >请设置试卷名称</span>
        </div>
        <div class="book">
          <label
            class="caption"
            for="paperName"
          >试卷类型：</label>
          <div class="book_container">
            <km-select
              v-model="checkedPaper"
              separator="、"
            >
              <select-option
                v-for="(item,index) in paperTypeList"
                :key="index"
                :label="item.paperTypeName"
                :value="item"
              ></select-option>
            </km-select>
          </div>
          <span
            v-if="checkedPaperTip"
            class="editPaperErrTip"
          >请设置试卷类型</span>
        </div>
        <div class="school">
          <label
            class="caption"
            for="paperName"
          >适用年级：</label>
          <div class="grade">
            <ul class="item">
              <li
                :class="{active: gradeActive === 1}"
                @click="switchGrade(1)"
              >小学</li>
              <li
                :class="{active: gradeActive === 2}"
                @click="switchGrade(2)"
              >初中</li>
              <li
                :class="{active: gradeActive === 3}"
                @click="switchGrade(3)"
              >高中</li>
            </ul>
            <ul class="grade_detail">
              <li class="all">
                <i
                  :class="{active: seceteVolumeAll}"
                  @click="getGrade('all')"
                ></i>
                <span>全部</span>
              </li>
              <li
                v-for="(val, idx) in paperVolumeList"
                :key="idx"
              >
                <i
                  :class="{active: val.flag }"
                  @click="getGrade(val, idx)"
                ></i>
                <span>{{val.volumeName}}</span>
              </li>
            </ul>
          </div>
          <span
            v-if="paperGradeTip"
            class="editPaperErrTip"
          >请设置适用年级</span>
        </div>
        <div
          class="book"
          v-if="showidress"
        >
          <label
            class="caption"
            for="paperName"
          >适用地区：</label>
          <div class="book_container">
            <idress
              v-model="area"
              :lastArea="paperData.regionData"
            ></idress>
          </div>
          <span
            v-if="idressTip"
            class="editPaperErrTip"
          >请设置适用地区</span>
        </div>
        <div
          class="book"
          v-show="!showidress"
        >
          <label
            class="caption"
            for="paperName"
          >适用教材：</label>
          <div class="book_container">
            <km-select
              showCheckBox=true
              v-model="textbookList"
              multiple=true
              @change="rr"
              separator="、"
            >
              <select-all-button
                v-model="checkAll"
                value="全部"
                @change="tr"
              ></select-all-button>
              <select-option
                v-for="(item,index) in paperBookList"
                :key="index"
                :label="item.textbookName"
                :value="item"
              ></select-option>
            </km-select>
          </div>
          <span
            v-if="paperBookTip"
            class="editPaperErrTip"
          >请设置适用教材</span>
        </div>
        <div class="paperPermission">
          <label
            class="caption"
            for="paperName"
          >试卷权限：</label>
          <div
            class="ui-radio"
            id="permission"
          >
            <label
              for="permission_1"
              @click="getPermission(1)"
            >
              <span
                class="radio-icon"
                :class="{checked: Number(editPaperParam.permissionId) === 1}"
                data-value="1"
              ></span>所有人可见
            </label>
            <label
              for="permission_2"
              @click="getPermission(2)"
            >
              <span
                class="radio-icon"
                :class="{checked: Number(editPaperParam.permissionId) === 2}"
              ></span>仅自己可见
            </label>
          </div>
        </div>
        <div class="btnBox">
          <button
            class="btn"
            @click="canclePaper()"
          >取消</button>
          <button
            class="btn btn-primary"
            @click="savePaper()"
          >保存</button>
          <button
            v-if="isSave"
            class="btn btn-primary"
            @click="savePaperApply()"
          >创建测评</button>
        </div>
      </div>
    </div>
    <success
      v-if="showSuccess"
      :name="editPaperParam.paperName"
      @next="next"
    ></success>
  </div>
</template>


<script>
import $ from '@/utility/dollar.js'
import kmSelect from './select'
import selectOption from './select-option'
import selectAllButton from './select-all-button'
import KmInput from './km-input'
import idress from './idress'
import mixins from './mixins.js'
import success from './success'
export default {
  name: 'EditPaper',
  components: { kmSelect, selectOption, selectAllButton, idress, success, KmInput },
  props: {
    onSelectPaper: {
      type: Function
    },
    paperData: {},
    randerPaper: {},
    params: {
      default () {
        return {}
      }
    },
    paperBuildWay: {
      // temp： 听说 common： 普通
      default: 'common'
    },
    // 用于区分 保存 和 编辑
    isSave: {
      default: true
    },
    sourceId: {
      // 1 kaimi 2校本
      default: window.$.cookie('rt') === 'manager' ? 1 : 2
    },
  },
  mixins: [mixins],
  data () {
    return {
      cansave: true,
      paperBookList: [],
      gradeActive: 1,
      showBookFlag: false,
      seceteVolumeAll: false,
      seceteBookAll: false,
      paperNameTip: false,
      paperGradeTip: false,
      paperBookTip: false,
      checkedPaperTip: false,
      idressTip: false,
      paperBookName: '',
      editPaperParam: {
        paperName: '',
        paperId: '',
        permissionId: '',
        volumeId: '',
        textbookId: ''
      },
      textbookList: '',
      checkAll: false,
      paperTypeList: [],
      checkedPaper: {},
      showSuccess: false,
      // 用于记住上一次的选择
      oldPaperVolumeList: [],
      oldVolumeType: -1,
      currentVolumeType: -2,
      volumeTypes: {
        1: {
          list: []
        },
        2: {
          list: []
        },
        3: {
          list: []
        }
      }
    }
  },
  computed: {
    paperVolumeList () {
      console.log()
      return (this.volumeTypes[this.currentVolumeType] || { list: [] }).list
    },
    showidress () {
      // 专项训练 或者 听说考试 时出现
      return (this.checkedPaper && this.checkedPaper.paperCatgId === '2') || this.paperBuildWay === 'temp'
    },
    title () {
      return this.isSave ? '保存试卷' : '编辑试卷'
    },
    showEditPaper () {
      return this.params.showEditPaper || !this.isSave
    }
  },
  watch: {
    paperData: function (val) {
      this.initData()
    },
    textbookList () {
      this.checkAll = this.paperBookList.length === this.textbookList.length
    },
    showEditPaper (v) {
      v ? window.$('body').addClass('overflow_hidden') : window.$('body').removeClass('overflow_hidden')
    }
  },
  methods: {
    next () {
      window.$('#zxzj .active a').click()
      this.showSuccess = false
    },
    tr (a) {
      this.textbookList = a ? this.paperBookList : []
    },
    rr (v) {
      // this.checkAll = this.paperBookList.length === v.length
    },
    switchGrade (num) {
      this.seceteVolumeAll = false;
      this.seceteBookAll = false;
      this.gradeActive = num;
      this.getPaperVolume(num, false);
      this.getPaperTextbook(num, false);
    },
    showBook () {
      this.showBookFlag = !this.showBookFlag;
    },
    getPermission (num) {
      this.$set(this.editPaperParam, 'permissionId', num);
    },
    getPaperVolume (type, flag) {
      this.currentVolumeType = type
      // 此方法预留于切换tab时记住选择

      this.clearvolume(0)
      if (this.volumeTypes[type].list.length > 0) {
        return
      }
      const paperVolumeList = []
      let volumList = this.editPaperParam.volumeId;
      $.get('/Papers/getPaperVolume', {
        type: type,
        flag: 1
      }, (res) => {
        if (res.status === 1) {
          if (flag) {
            res.data.forEach((val, index) => {
              let value = val;
              value.flag = false;
              if (volumList.length) {
                for (let i = 0; i < volumList.length; i++) {
                  if (Number(volumList[i]) === Number(val.id)) {
                    value.flag = true;
                    break;
                  }
                }
              }
              paperVolumeList.push(value);
            });
            this.seceteVolumeAll = true;
            for (let k = 0; k < paperVolumeList.length; k++) {
              if (!paperVolumeList[k].flag) {
                this.seceteVolumeAll = false;
                break;
              }
            }
          } else {
            this.seceteVolumeAll = false;
            // this.editPaperParam.volumeId = '';
            res.data.forEach((val, index) => {
              let value = val;
              value.flag = false;
              paperVolumeList.push(value);
            });
          }
          this.volumeTypes[type].list = paperVolumeList
        } else {
          alert(res.info)
        }
      });
    },
    getPaperTextbook (type, flag) {
      console.log(type)
      this.paperBookList = [];
      let textbookIdList = this.editPaperParam.textbookId;
      let textBookIdArr = [];
      $.get('/Papers/getPaperTextbook', {
        type: type,
        flag: 1
      }, (res) => {
        if (res.status === 1) {
          if (flag) {
            res.data.forEach((val, index) => {
              let value = val;
              value.flag = false;
              if (textbookIdList.length) {
                for (let i = 0; i < textbookIdList.length; i++) {
                  if (Number(textbookIdList[i]) === Number(val.id)) {
                    value.flag = true;
                    break;
                  }
                }
              } else {
                this.paperBookName = ''
              }
              this.paperBookList.push(value);
            });
            this.seceteBookAll = true;
            this.paperBookName = '全部';
            for (let k = 0; k < this.paperBookList.length; k++) {
              if (!this.paperBookList[k].flag) {
                this.seceteBookAll = false;
                break;
              }
            }
            if (!this.seceteBookAll) {
              let randerNameArr = [];
              for (let m = 0; m < this.paperBookList.length; m++) {
                if (this.paperBookList[m].flag) {
                  randerNameArr.push(this.paperBookList[m].textbookName);
                }
              }
              if (randerNameArr.length) {
                this.paperBookName = randerNameArr.join('、');
              }
            }
          } else {
            this.seceteBookAll = true;
            this.paperBookName = '全部';
            res.data.forEach((val, index) => {
              let value = val;
              value.flag = true;
              this.paperBookList.push(value);
              textBookIdArr.push(value.id);
            });
            this.editPaperParam.textbookId = textBookIdArr;
          }
          this.textbookList = this.paperBookList.filter(i => i.flag)
        } else {
          alert(res.info)
        }
      });
    },
    getGrade (val, idx) {
      let volumeIdArr = [];
      if (val === 'all') {
        if (this.seceteVolumeAll) {
          this.seceteVolumeAll = false;
          this.editPaperParam.volumeId = '';
          for (let i = 0; i < this.paperVolumeList.length; i++) {
            this.$set(this.paperVolumeList[i], 'flag', false);
          }
        } else {
          this.seceteVolumeAll = true;
          for (let i = 0; i < this.paperVolumeList.length; i++) {
            volumeIdArr.push(this.paperVolumeList[i].id);
            this.$set(this.paperVolumeList[i], 'flag', true);
          }
        }
      } else {
        if (val.flag) {
          this.seceteVolumeAll = false;
          this.$set(this.paperVolumeList[idx], 'flag', false);
          for (let i = 0; i < this.paperVolumeList.length; i++) {
            if (this.paperVolumeList[i].flag) {
              volumeIdArr.push(this.paperVolumeList[i].id);
            }
          }
        } else {
          this.seceteVolumeAll = true;
          this.$set(this.paperVolumeList[idx], 'flag', true);
          for (let i = 0; i < this.paperVolumeList.length; i++) {
            if (!this.paperVolumeList[i].flag) {
              this.seceteVolumeAll = false;
              break;
            }
          }
          for (let j = 0; j < this.paperVolumeList.length; j++) {
            if (this.paperVolumeList[j].flag) {
              volumeIdArr.push(this.paperVolumeList[j].id);
            }
          }
        }
      }
      this.editPaperParam.volumeId = volumeIdArr
    },
    clearvolume (type) {
      if (this.paperVolumeList.some(i => i.flag)) {
        const clearList = [1, 2, 3].filter(v => v !== type)
        clearList.forEach(index => {
          this.volumeTypes[index].list.forEach(i => {
            i.flag = false
          })
        })
      }
    },
    getTextBook (val, idx) {
      let randerNameArr = [];
      let textBookIdArr = [];
      this.paperBookName = '';
      if (val === 'all') {
        if (this.seceteBookAll) {
          this.seceteBookAll = false;
          this.paperBookName = '';
          this.editPaperParam.textbookId = '';
          for (let i = 0; i < this.paperBookList.length; i++) {
            this.$set(this.paperBookList[i], 'flag', false);
          }
        } else {
          this.seceteBookAll = true;
          this.paperBookName = '全部';
          for (let i = 0; i < this.paperBookList.length; i++) {
            textBookIdArr.push(this.paperBookList[i].id);
            this.$set(this.paperBookList[i], 'flag', true);
          }
        }
      } else {
        if (val.flag) {
          this.seceteBookAll = false;
          this.$set(this.paperBookList[idx], 'flag', false);
          for (let i = 0; i < this.paperBookList.length; i++) {
            if (this.paperBookList[i].flag) {
              textBookIdArr.push(this.paperBookList[i].id);
              randerNameArr.push(this.paperBookList[i].textbookName);
            }
          }
        } else {
          this.seceteBookAll = true;
          this.$set(this.paperBookList[idx], 'flag', true);
          for (let i = 0; i < this.paperBookList.length; i++) {
            if (!this.paperBookList[i].flag) {
              textBookIdArr.push(this.paperBookList[i].id);
              this.seceteBookAll = false;
              break;
            }
          }
          if (this.seceteBookAll) {
            this.paperBookName = '全部';
          } else {
            textBookIdArr = []
            for (let j = 0; j < this.paperBookList.length; j++) {
              if (this.paperBookList[j].flag) {
                textBookIdArr.push(this.paperBookList[j].id);
                randerNameArr.push(this.paperBookList[j].textbookName);
              }
            }
          }
        }
      }
      if (randerNameArr.length) {
        this.paperBookName = randerNameArr.join('、');
      }
      if (textBookIdArr.length) {
        this.editPaperParam.textbookId = textBookIdArr;
      }
    },
    canclePaper () {
      this.params.showEditPaper = false
      window.$('body').removeClass('overflow_hidden')
      // this.showEditPaper = false;
      this.$emit('cancel')
    },
    getvolumeId (type) {
      // let i = 1;
      let volumeIdArr = []
      // for (; i < 4; i++) {
      //   if (volumeIdArr.length > 0) break;
      //   this.oldVolumeType = i
      //   this.volumeTypes[i].list.forEach(i => {
      //     if (i.flag) {
      //       volumeIdArr.push(i.id)
      //     }
      //   })
      // }
      this.oldVolumeType = type
      this.volumeTypes[type].list.forEach(i => {
        if (i.flag) {
          volumeIdArr.push(i.id)
        }
      })
      return volumeIdArr
    },
    savePaper (fn) {
      this.clearvolume(this.currentVolumeType)
      this.cansave = false
      let basicVerify = 1;
      const list = this.getvolumeId(this.currentVolumeType)
      if (Object.prototype.toString.call(list) === '[object Array]') {
        this.editPaperParam.volumeId = list.join(',');
      }
      if (Object.prototype.toString.call(this.editPaperParam.textbookId) === '[object Array]') {
        this.editPaperParam.textbookId = this.textbookList.map(item => item.id).join(',')
      }
      if (this.editPaperParam.paperName) {
        this.paperNameTip = false;
      } else {
        this.paperNameTip = true;
      }
      if (this.editPaperParam.volumeId) {
        this.paperGradeTip = false;
      } else {
        this.paperGradeTip = true;
      }
      if (this.showidress || this.textbookList.length > 0) {
        this.paperBookTip = false;
      } else {
        this.paperBookTip = true;
      }
      const area = this.getAreaParams()
      if (!this.showidress || area.length > 0) {
        this.idressTip = false;
      } else {
        this.idressTip = true;
      }
      if (this.paperNameTip || this.paperGradeTip || this.paperBookTip || this.idressTip) {
        return
      }

      if (!basicVerify) return;
      if (this.isSave) {
        const saveParams = {
          paperCatgId: this.checkedPaper.paperCatgId,
          paperTypeId: this.checkedPaper.paperTypeId,
          paperSourceId: this.sourceId,
          paperName: this.editPaperParam.paperName,
          volumeId: this.editPaperParam.volumeId,
          permissionID: this.editPaperParam.permissionId,
          templeteRule: this.params.templeteRule,
          topics: this.params.topics,
          usageID: 3,
          textbookId: this.editPaperParam.textbookId,
          paperModelId: this.params.paperModelId,
          area: JSON.stringify(area)
        }
        $.post('/api/Papers/save', saveParams, (res) => {
          this.cansave = true
          if (res.result === 1) {
            this.params.showEditPaper = false;
            if (fn) {
              console.log(res)
              fn(res.info.paperID, saveParams)
            } else {
              this.showSuccess = true
            }
            window.clearui()
            this.rememberSearchCond(saveParams)
          } else {
            alert(res.info)
          }
        });
      } else {
        $.post('/Papers/editPaper', {
          ...this.editPaperParam,
          paperCatgId: this.checkedPaper.paperCatgId,
          paperTypeId: this.checkedPaper.paperTypeId,
          paperSourceId: this.sourceId,
          area: JSON.stringify(area)
        }, (res) => {
          if (res.status === 1) {
            if (fn) {
              fn(this.editPaperParam.paperId)
            } else {
              this.$emit('cancel')
              this.randerPaper(1);
            }
          } else {
            alert(res.info)
          }
        });
      }
    },
    initData () {
      this.paperNameTip = false;
      this.paperGradeTip = false;
      this.paperBookTip = false;
      this.editPaperParam.paperId = this.paperData.paperID;
      this.editPaperParam.paperName = this.paperData.paperName;
      this.editPaperParam.permissionId = Number(this.paperData.permissionID);
      if (Object.prototype.toString.call(this.paperData.volumeIds) === '[object Object]') {
        this.editPaperParam.volumeId = this.paperData.volumeIds.ids;
        this.editPaperParam.textbookId = this.paperData.textbookIds.ids;
        this.gradeActive = Number(this.paperData.volumeIds.type);
        this.getPaperVolume(Number(this.paperData.volumeIds.type), true);
        this.getPaperTextbook(Number(this.paperData.textbookIds.type), true);
      } else {
        this.editPaperParam.volumeId = [];
        this.editPaperParam.textbookId = [];
        this.gradeActive = 1;
        this.getPaperVolume(1, true);
        this.getPaperTextbook(1, true);
      }
      this.getType()
    },
    // showDialog (type) {
    //   // this.initData()
    //   this.showEditPaper = type;
    // }
  },
  mounted () {
    this.initData()
    window.$('body').addClass('overflow_hidden')
  },
  destroyed () {
    window.$('body').removeClass('overflow_hidden')
  }
}
</script>

<style lang="less" scoped>
@image-base-url: "../../../assets/nlcp";
.close {
  position: absolute;
  top: 12px;
  right: 10px;
  width: 20px;
  text-align: center;
  cursor: pointer;
}
#Cover {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(1, 9, 30, 0.3);
  overflow: auto;
  z-index: 1;
}
#DialogBox {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 566px;
  background-color: #fff;
  border-radius: 3px;
  z-index: 9;

  & > .header {
    position: relative;
    padding: 8px 0;
    font-size: 18px;
    color: #fff;
    background-color: #21bd73;
    letter-spacing: 3px;
    text-align: center;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }

  & > .cont {
    padding: 30px 30px 0 30px;
    position: relative;

    & > label {
      font-family: "Microsoft YaHei";
      color: #666;
      font-size: 14px;
    }

    & > input {
      width: 420px;
      padding: 8px;
      text-align: center;
      margin: 0;
      border: 1px solid #d3d3d3;
      border-radius: 2px;
      box-sizing: border-box;
      font-family: "Microsoft YaHei";
    }
  }

  & > .school {
    position: relative;
    padding: 20px 30px 0;

    & > label {
      font-family: "Microsoft YaHei";
      color: #666;
      font-size: 14px;
    }

    & > .grade {
      display: inline-block;
      width: 420px;
      height: auto;
      border: 1px solid #ccf0df;
      background: #f2fbf7;
      box-sizing: border-box;

      & > .item {
        display: -webkit-flex;
        display: flex;

        & > li {
          float: left;
          flex: 1;
          height: 36px;
          line-height: 36px;
          text-align: center;
          border-bottom: 1px solid #ccf0df;
          background: #fff;
          cursor: pointer;

          &.active {
            border-bottom: none;
            background: #f2fbf7;
          }
          &:nth-child(1).active {
            border-right: 1px solid #ccf0df;
          }
          &:nth-child(2).active {
            border-left: 1px solid #ccf0df;
            border-right: 1px solid #ccf0df;
          }
          &:nth-child(3).active {
            border-left: 1px solid #ccf0df;
          }
        }
      }

      & > .grade_detail {
        height: auto;

        & > li {
          float: left;
          width: 105px;
          height: 36px;
          line-height: 36px;
          text-align: center;
          position: relative;

          & > i {
            position: absolute;
            left: 7px;
            top: 7px;
            width: 20px;
            height: 20px;
            background: url("@{image-base-url}/checkbox.png") no-repeat center;
            cursor: pointer;

            &.active {
              background: url("@{image-base-url}/checkedbox.png") no-repeat
                center;
            }
          }

          & > span {
            position: absolute;
            top: 0px;
            left: 35px;
          }

          &.all {
            display: block;
            float: none;
          }
        }
      }
    }
  }

  & > .book {
    position: relative;
    padding: 20px 30px;
    padding-bottom: 0;

    & > .book_container {
      width: 420px;
      height: 38px;
      position: relative;
      display: inline-block;

      & > input {
        display: block;
        width: 100%;
        height: 22px;
        border: 1px solid #dbdcde;
        padding: 1px 3px;
        padding-right: 20px;
        line-height: 20px;
        background-image: url("@{image-base-url}/select_normal.png");
        background-repeat: no-repeat;
        background-position: 99% 7px;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &.active {
          background-image: url("@{image-base-url}/select_active.png");
        }
      }

      & > ul {
        position: absolute;
        top: 22px;
        left: 0;
        z-index: 10;
        width: 100%;
        max-height: 122px;
        box-sizing: border-box;
        box-shadow: 5px 5px 5px #888888;
        border: 1px solid #dbdcde;
        border-top: 0;
        background-color: #fff;
        overflow: auto;

        & > li {
          width: 100%;
          padding: 0px 3px 0 40px;
          height: 20px;
          line-height: 20px;
          box-sizing: border-box;
          text-align: left;
          cursor: pointer;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          position: relative;

          & > i {
            position: absolute;
            top: 0;
            left: 10px;
            width: 20px;
            height: 20px;
            background: url("@{image-base-url}/checkbox.png") no-repeat center;
            cursor: pointer;

            &.active {
              background: url("@{image-base-url}/checkedbox.png") no-repeat
                center;
            }
          }
        }
      }
    }
  }

  .editPaperErrTip {
    position: absolute;
    bottom: -18px;
    right: 45px;
    font-size: 14px;
    color: #ff6666;
  }

  .book .editPaperErrTip {
    bottom: -20px;
  }

  & > .paperPermission {
    padding: 30px;
    margin-top: -10px;

    & > label {
      font-family: "Microsoft YaHei";
      color: #666;
      font-size: 14px;
    }

    & > #permission {
      display: inline;
      width: 100%;

      & > label {
        display: inline-block;
        height: 20px;
        margin-right: 16px;
        line-height: 20px;
        cursor: pointer;

        & > span {
          display: inline-block;
          width: 16px;
          height: 20px;
          background-image: url("@{image-base-url}/icon_radio.png");
          background-position: 0 3px;
          background-repeat: no-repeat;
          vertical-align: middle;
          margin-top: -6px;
          margin-right: 3px;

          &.checked {
            background-position: -16px 3px;
          }
        }
      }
    }
  }

  & > .btnBox {
    padding-bottom: 30px;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    text-align: center;

    & > .btn {
      width: 110px;
      height: 35px;
      border: 1px solid #21bd73;
      border-radius: 3px;
      background-color: #fff;
      padding: 5px 10px;
      margin: 0 10px;
      font-family: "Microsoft Yahei";

      &:hover {
        color: #fff;
        border-color: #44cf8d;
        background-color: #44cf8d;
      }

      &.btn-primary {
        background-color: #21bd73;
        color: #fff;
      }
    }
  }
}
</style>
<style>
.overflow_hidden {
  overflow: hidden !important;
}
</style>
