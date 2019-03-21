<template lang="pug">
  div.pagination(v-if='showPagination')
      ul
        li(v-for='page in pageList' :class='page.cls' @click='onPageClick(page.idx, page.cls)') {{page.idx}}
</template>

<script>
export default {
  name: 'pagination',
  props: ['currentPage', 'maxNumPage', 'getSkipPage'],
  data() {
    return {
      showPagination: true,
      pageList: []
    }
  },
  methods: {
    verification() {
      if (isNaN(this.currentPage) || isNaN(this.maxNumPage)) {
        this.showPagination = false
        return alert('页码必须是数字')
      } else {
        this.showPagination = true
      }

      if (this.currentPage < 1 || this.maxNumPage < 1) {
        this.showPagination = false
        return alert('页码不能为0或负值')
      } else {
        this.showPagination = true
      }

      if (this.currentPage > this.maxNumPage) {
        this.showPagination = false
        return alert('当前页码不能大于总页码')
      } else {
        this.showPagination = true
      }
    },
    addPage(page, cls) {
      this.pageList.push({
        idx: page,
        cls: cls
      })
    },
    pagination() {
      this.verification()
      if (this.showPagination) {
        let cur = this.currentPage || 1
        let max = this.maxNumPage || 1

        this.pageList = []

        this.addPage('', 'prev' + (cur === 1 ? ' disabled' : ''))

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

        this.addPage('', 'next' + (cur === max ? ' disabled' : ''))
      }
    },
    onPageClick(idx, cls) {
      if (cls) {
        let _cls = cls.split(' ')

        if (_cls.indexOf('disabled') >= 0 || _cls.indexOf('other') >= 0 || _cls.indexOf('currentPage') >= 0) {
        } else {
          if (_cls.indexOf('prev') >= 0) {
            this.getSkipPage(this.currentPage - 1)
          } else if (_cls.indexOf('next') >= 0) {
            this.getSkipPage(this.currentPage + 1)
          }
        }
      } else {
        this.getSkipPage(idx)
      }
    }
  },
  watch: {
    currentPage: function () {
      this.pagination()
    },
    maxNumPage: function () {
      this.pagination()
    }
  },
  mounted() {
    this.pagination()
  }
}
</script>

<style lang="less" scoped>
.pagination {
  width: 100%;
  height: 30px;
  margin: 20px auto 0px;
  text-align: left;
  display: block;
  ul {
    padding: 0;
    margin: 0;
    display: inline-block;
    margin: 0 auto;

    li {
      width: 25px;
      height: 25px;
      line-height: 25px;
      border: #ddd 1px solid;
      border-radius: 2px;
      font-size: 14px;
      text-align: center;
      color: #999;
      background-color: #fff;
      margin-right: 10px;
      // display: inline-block;
      float: left;
      cursor: pointer;

      &:hover {
        background: #fff;
        border: #24cc74 1px solid;
        color: #21bd73;
      }

      &.disabled {
        color: #ccc;
        border-color: #ccc;
        background: #fff;
        cursor: default;
      }

      &.currentPage {
        background: #24cc74;
        color: #fff;
        border-color: #24cc74;
      }

      &.other {
        border: 0;
        background: transparent;

        &:hover {
          background: transparent;
        }
      }

      &.prev {
        background: url('../assets/nlcp/pagination_arrow.png') no-repeat;
        background-position: 4px 4px;

        &:hover {
          background-position: -16px 4px;
        }

        &.disabled.prev:hover {
          background-position: 4px 4px;
        }
      }
      
      &.next {
        background: url('../assets/nlcp/pagination_arrow.png') no-repeat;
        background-position: -36px 4px;

        &:hover {
          background-position: -56px 4px;
        }
        
        &.disabled.next:hover {
          background-position: -36px 4px;
        }
      }
    }
  }
}
</style>