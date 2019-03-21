<template>
  <div class="c-cp-b-morebox">
    <div class="c-cp-b-showmore">
      <p></p>
      <label @click='onShowMore' :class='{upArrow: showMore}'>更多信息<i></i></label>
    </div>
    <div class="c-cp-b-moreinfo" :class='{hide: !showMore}'>
      <span class="c-cp-b-cnt-left">测评信息：</span>
      <div class="c-cp-b-cnt-right">
        <div>
          <img id="bannerImg" :src='bannerImg'/>
          <input type="file" name="uploadBI" id="uploadBI">
          <button id="deleteBI" @click='onDeleteBannerImg'>删除</button>
        </div>
        <div>
          <div id="introduce"><span></span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/config/config.js'
const imgUrl = '../../css/images/default_img1.png'

export default {
  name: 'moreinfo',
  props: ['competitionName', 'imgUrl', 'thumbImgUrl', 'introduce', 'imgStatus', 'onChangeBase64', 'onCreateUeditor', 'onChangeImg', 'onImgStatusChange'],
  data () {
    return {
      showMore: false,
      imgCreateFlag: true,
      bannerImg: this.thumbImgUrl ? this.resUrl(this.thumbImgUrl) : imgUrl,
      ueditor: '',
      imgbase64: '',
      _imgUrl: this.imgUrl,
      _thumbImgUrl: this.thumbImgUrl,
      _imgStatus: this.imgStatus,
    }
  },
  methods: {
    resUrl (url) {
      return url ? (window.Config ? window.Config.resUrl : config.resUrl) + url : ''
    },
    onShowMore () {
      this.showMore = !this.showMore
      this.ueditor.show()
    },
    onDeleteBannerImg () {
      let that = this
      window.tipDialog({
        type: 'warn',
        subtitle: '确认删除海报？',
        cancelBtn: '取消',
        warnBtn: '删除',
        isClose: true,
        warnCallback: (closeDialog) => {
          that.imgCreateFlag = true

          if (that.competitionName) {
            window.mergeImage({
              value: that.competitionName,
              imgsrc: imgUrl,
            }, (url) => {
              that.bannerImg = url
            })
          } else {
            that.bannerImg = imgUrl
            that._imgUrl = ''
            that._thumbImgUrl = ''
          }

          that.onChangeImg(that._imgUrl, that._thumbImgUrl, that.imgCreateFlag)

          closeDialog()
        }
      })
    },
    imgStatusChange (type) {
      this._imgStatus = type
      this.onImgStatusChange(this._imgStatus)
    },
    CreatePosterByName() {
      if (this.imgCreateFlag) {
        let that = this
        this.imgStatusChange('creating')
        window.mergeImage({
          value: that.competitionName,
          imgsrc: imgUrl,
        }, (url) => {
          that.imgbase64 = url
          that.bannerImg = url
          that.onChangeBase64(url)
          that.onChangeImg('', '', that.imgCreateFlag)
          that.imgStatusChange('complete')
        })
      }
    }
  },
  watch: {
    competitionName () {
      this.CreatePosterByName()
    },
  },
  mounted () {
    let that = this
    this.ueditor = window.solution.ui.create('ueditor', {
      target: window.$('#introduce > span')
    });
    this.onCreateUeditor(this.ueditor)
    this.ueditor.setValue(this.introduce)
    this.ueditor.show()

    window.uploadBanner('#uploadBI', (data) => { // callback
      that.bannerImg = that.resUrl(data.image_small_url)
      that._imgUrl = data.url
      that._thumbImgUrl = data.image_small_url
      that.onChangeImg(that._imgUrl, that._thumbImgUrl, that.imgCreateFlag)
      that.imgStatusChange('complete')
    }, (data) => { // errorCcallback
      that.imgStatusChange('complete')
      that.imgCreateFlag = true
      that.onChangeImg('', '', that.imgCreateFlag)
    }, {
      onUploadStart: function () {
        that.imgStatusChange('uploading')
        that.imgCreateFlag = false
        that.onChangeImg('', '', that.imgCreateFlag)
      },
      onUploadError: function () {
        that.imgStatusChange('complete')
      }
    })

    if (this.competitionName) this.CreatePosterByName()
  }
}
</script>