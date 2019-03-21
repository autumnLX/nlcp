<template>
  <div class="c-cp-b-name c-cp-b-inputbox">
    <span class="c-cp-b-cnt-left">测评名称：</span>
    <div class="c-cp-b-cnt-right">
      <input
        type="text"
        v-model='cname'
        :class='{isError: isError}'
        placeholder="请输入测评名称，限50个字符。"
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'name',
  props: ['isError', 'competitionName', 'onChangeName'],
  data () {
    return {
      cname: ''
    }
  },
  methods: {
    getLength (string) {
      let lgt = 0
      let idx = 0
      for (let i = 0; i < string.length; i++) {
        if (string[i].match(/[\u0391-\uFFE5]/gi)) {
          lgt += 2
        } else {
          lgt++
        }

        if (lgt > 50) {
          idx = i
          break
        }
      }

      return {
        length: lgt,
        index: idx
      }
    }
  },
  mounted () {
    this.cname = this.competitionName
  },
  watch: {
    competitionName (newVal) {
      this.cname = newVal
    },
    cname (newVal) {
      let getL = this.getLength(newVal)
      if (getL.length > 50) {
        this.cname = newVal.substring(0, getL.index)
        this.onChangeName(newVal.substring(0, getL.index))
        console.info(newVal.substring(0, getL.index))
      } else {
        this.onChangeName(newVal)
      }
    }
  },
}
</script>