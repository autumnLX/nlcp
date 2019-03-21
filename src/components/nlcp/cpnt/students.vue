<template>
  <div class="c-cp-b-students">
    <span class="c-cp-b-cnt-left">选择学生：</span>
    <div class="c-cp-b-cnt-right" :class='[{isError: isError}, "c-cp-b-stype-" + role]'>
      <div v-if='role == "ls"'>
        <div>
          <p :class='{active: slType == "class"}' @click='onSelectCLType("class")'>
            <label></label>
            <span>常规班级</span>
          </p>
          <p :class='{active: slType == "layer"}' @click='onSelectCLType("layer")'>
            <label></label>
            <span>分层教学</span>
          </p>
        </div>
        <ul v-if='clList[slType] && clList[slType].length > 0'>
          <li
            @click='onSelectCLAll'
            :class='{active: rscope.ids.length == clList[slType].length}'
          >
            <label></label>
            <span>全选</span>
          </li>
          <li
            v-for='(cl, i) in clList[slType]'
            :key='slType + cl.id'
            @click='onSelectCL(cl.id)'
            :class='{active: rscope.ids.indexOf(cl.id) >= 0}'
          >
            <label></label>
            <span>{{cl.gradeName + ' ' + cl.name}}</span>
          </li>
        </ul>
        <ul class="listEmpty" v-else>
          <li v-if='slType == "class"'>暂无班级，请联系管理员绑定班级</li>
          <li v-else>暂无分组，请到【学生管理】中设置分组</li>
        </ul>
      </div>
      <div v-else-if='role == "gl"'>
        <div>
          <p
            v-for='(cg, i) in clList.category'
            :key='cg'
            :class='{active: slType == cg, oneCategary: clList.category.length == 1}'
            @click='onSelectCLType(cg)'
          >{{cg}}</p>
        </div>
        <ul>
          <li
            @click='onSelectCLAll'
            :class='{active: glIsAll}'
          >
            <label></label>
            <span>全选</span>
          </li>
          <li
            v-for='(cl, i) in clList.list[slType]'
            :key='slType + i'
            @click='onSelectCL(cl)'
            :class='{active: rscope.ids.indexOf(cl) >= 0}'
          >
            <label></label>
            <span>{{cl}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'students',
  props: ['isError', 'role', 'classLayer', 'studentListType', 'releaseScope', 'onSelectClassLayer'],
  data () {
    return {
      clList: {},
      slType: this.studentListType,
      rscope: {},
      glIsAll: false
    }
  },
  methods: {
    onSelectCLType (type) {
      if (this.role == 'ls') {
        this.rscope.type = type
        this.rscope.ids.splice(0, this.rscope.ids.length)
        for (let i = 0; i < this.clList[type].length; i++) {
          this.rscope.ids.push(this.clList[type][i].id)
        }
      }
      this.slType = type
      this.onSelectClassLayer(this.rscope)
      this.glIsSelectAll()
    },
    onSelectCL (item) {
      if (this.rscope.ids.indexOf(item) >= 0) {
        this.rscope.ids.splice(this.rscope.ids.indexOf(item), 1)
      } else {
        this.rscope.ids.push(item)
      }
      this.onSelectClassLayer(this.rscope)
      this.glIsSelectAll()
    },
    onSelectCLAll () {
      let ids = this.rscope.ids

      if (this.role == 'ls') {
        let cllist = this.clList[this.slType]

        if (ids.length == cllist.length) {
          for (let i = 0; i < cllist.length; i++) {
            if (ids.indexOf(cllist[i].id) >= 0) {
              ids.splice(ids.indexOf(cllist[i].id), 1)
            }
          }
        } else {
          for (let i = 0; i < cllist.length; i++) {
            if (ids.indexOf(cllist[i].id) < 0) {
              ids.push(cllist[i].id)
            }
          }
        }
      } else if (this.role == 'gl') {
        let cllist = this.clList.list[this.slType]

        if (this.glIsAll) {
          for (let i = 0; i < cllist.length; i++) {
            ids.splice(ids.indexOf(cllist[i]), 1)
          }
          this.glIsAll = false
        } else {
          for (let i = 0; i < cllist.length; i++) {
            if (ids.indexOf(cllist[i]) < 0) {
              ids.push(cllist[i])
            }
          }
          this.glIsAll = true
        }
      }
    },
    glIsSelectAll () {
      if (this.role == 'gl') {
        let cllist = this.clList.list[this.slType]
        this.glIsAll = true

        for (let i = 0; i < cllist.length; i++) {
          if (this.rscope.ids.indexOf(cllist[i]) < 0) {
            this.glIsAll = false
          }
        }
      }
    }
  },
  watch: {
    studentListType (newVal) {
      this.slType = newVal
      if (this.role == 'ls') {
        this.rscope.type = newVal
      } else {
        this.rscope.type = 'grade'
      }
    },
    classLayer (newVal) {
      this.clList = newVal

      if (this.role == 'ls') {
        if (this.rscope.ids.length == 0) {
          for (let i = 0; i < this.clList[this.rscope.type].length; i++) {
            this.rscope.ids.push(this.clList[this.rscope.type][i].id)
          }
        }
      } else if (this.role == 'gl') {
        this.glIsSelectAll()
      }
    }
  },
  mounted () {
    this.rscope = this.releaseScope.type ? this.releaseScope : {
      type: this.role == 'ls' ? 'class' : 'grade',
      ids: []
    }
    this.onSelectClassLayer(this.rscope)
  }
}
</script>
