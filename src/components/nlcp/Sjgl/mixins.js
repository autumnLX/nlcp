import $ from '@/utility/dollar.js'
export default {
  data() {
    return {
      area: {}
    }
  },
  methods: {
    getType() {
      $.get('/api/paperConfigure/getCreatePaperType', {
        paperBuildWay: this.paperBuildWay
      }, (res) => {
        let index = 0;
        this.paperTypeList = res.data
        if (this.paperData.paperTypeId) {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].paperTypeId === this.paperData.paperTypeId) {
              index = i;
              break;
            }
          }
        }

        this.checkedPaper = res.data[index]
      })
    },
    getAreaParams() {
      let params = []
      for (let i in this.area) {
        if (this.area[i][0]) {
          // 如果第一个是省
          if (this.area[i][0].id == i) {
            params.push({
              province: i
            })
          } else {
            // 如果是市
            params = params.concat(this.area[i].map(item => {
              return {
                province: i,
                city: item.id
              }
            }))
          }
        }
      }
      return params
    },
    savePaperApply() {
      this.savePaper((paperId, saveParams) => {
        setTimeout(() => {
          this.clear(saveParams).then(() => {
            this.choosePaper(paperId, saveParams.paperCatgId)
          })
        }, 100)
      })
    },
    rememberSearchCond(params) {
      $.post('/Papers/rememberSearchCond', {
        flag: this.paperBuildWay === 'common' ? 1 : 2,
        volumeId: params.volumeId,
        textbookId: params.textbookId,
        type: this.oldVolumeType,
        regionData: params.area,
        paperCatgId: params.paperCatgId,
        paperTypeId: params.paperTypeId,
        paperSourceId: params.sourceId,
      }, function (res) {
        if (res.status === 1) {
          console.info('保存成功');
        }
      })
    },
    getByteLen(val = '') {
      var len = 0;
      for (var i = 0; i < val.length; i++) {
        var length = val.charCodeAt(i);
        if (length >= 0 && length <= 128) {
          len += 1;
        } else {
          len += 2;
        }
      }
      return len;
    },
    clear(params) {
      return new Promise((resolve, reject) => {
        $.post('/api/competitionConfigureV2/paperClear', {
          paperCatgId: params.paperCatgId,
          _t: +new Date()
        }, (res) => {
          if (res.status == 1) {
            resolve(1)
          } else {
            alert(res.info)
          }
        })
      })
    },
    createCP(paperCatgId) {
      window.solution.js.nlcp(['showCpzy', this.paperBuildWay === 'common' ? 3 : 4, '', {
        paperCatgId: paperCatgId
      }])
      window.$('#sdzj-info').hide()
      // this.onSelectPaper(this.paperBuildWay === 'common' ? 3 : 4, '', {});
    },
    choosePaper(paperId, paperCatgId) {
      window.solution.server.post('/competitionConfigureV2/paperWrite', {
        cmpCatgId: this.paperBuildWay === 'common' ? 3 : 4,
        paperCatgId: paperCatgId,
        paperId: paperId,
        _t: +new Date()
      }, (res) => {
        if (res.status == 1) {
          this.createCP(paperCatgId)
        } else {
          alert(res.info)
        }
      });
    },
  },
  mounted() {
    console.log(this.params)
    // this.getPaperFavoriteSetting()
  }
}
