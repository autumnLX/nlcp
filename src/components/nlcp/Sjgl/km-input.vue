<template lang="pug">
    div.form-input(:class="{errorColor: ErrorColorFlag, showBorder:showBorder}")
        div(v-if="$slots.icon")
         slot(name="icon")
        input(
        :placeholder="placeholder",
        :value="currentValue"
        ref="input"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        :autofocus="autofocus"
        :type="type"
        :disabled="disabled"
        :maxlength="maxlength"
        @keyup.enter="$emit('enter',$event)")
        i.icon.icon_delete(v-if="showClear" @click="clear")
</template>
<script>
export default {
  name: 'KmInput',
  data () {
    return {
      ErrorColorFlag: false,
      currentValue:
        this.value === undefined || this.value === null ? '' : this.value
    }
  },
  props: {
    value: [String, Number],
    showClearIcon: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: String,
    autofocus: Boolean,
    rule: Array,
    type: String,
    showBorder: {
      type: Boolean,
      default: true
    },
    maxlength: {
      type: Number
    }
  },
  watch: {
    value (val, oldValue) {
      this.setCurrentValue(val)
    }
  },
  computed: {
    showClear () {
      return (
        this.showClearIcon && (this.currentValue || this.currentValue === 0)
      )
    }
  },
  methods: {
    check () {
      this.ErrorColorFlag =
        this.currentValue === undefined ||
        this.currentValue === null ||
        this.currentValue === ''
      return !this.ErrorColorFlag
    },
    setCurrentValue (value) {
      this.ErrorColorFlag = false
      this.currentValue = value
    },
    focus () {
      this.$refs.input.focus()
    },
    blur () {
      this.$refs.input.blur()
    },
    clear () {
      this.setCurrentValue('')
      this.$emit('input', '')
      this.$emit('change', '')
      this.$emit('clear')
      this.focus()
    },
    handleFocus () {
      this.$emit('focus', event)
    },
    handleInput () {
      let value = event.target.value
      if (this.maxLengthBytes) {
        value = this.getByteLenStr(value, this.maxLengthBytes)
      }
      this.setCurrentValue(value)
      this.$emit('input', value)
    },
    getByteLenStr (val = '', max) {
      let len = 0;
      let str = ''
      for (var i = 0; i < val.length; i++) {
        var length = val.charCodeAt(i);
        if (length >= 0 && length <= 128) {
          len += 1;
        } else {
          len += 2;
        }
        str += len <= max ? val[i] : ''
      }
      return str;
    },
    handleBlur () {
      this.$emit('blur', event)
    },
    handleChange () {
      this.$emit('change', event.target.value)
    }
  }
}
</script>
<style lang="less" scoped>
.showBorder {
  border: 1px solid #d3d3d3;
}
.form-input {
  position: relative;
  display: flex;
  align-items: center;
  height: 40px;
  border-radius: 2px;
  line-height: 40px;
  background: #fff;
  box-sizing: border-box;
  height: 100%;
  input {
    background: white;
  }
  .icon {
    width: 20px;
    height: 20px;
    background: url("/static/images/login/icon_login.png");
  }
  .icon_delete {
    display: block;
    position: absolute;
    top: 50%;
    right: 10px;
    margin-top: -10px;
    background-position: -42px -1px;
    cursor: pointer;
  }

  &.password {
    margin-top: 20px;
  }

  & > div {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f8f8f8;

    .icon_username {
      background-position: 0 -1px;
    }

    .icon_password {
      background-position: -20px -1px;
    }
  }

  & > input {
    height: 100%;
    flex: 1;
    padding: 0;
    padding-left: 10px;
    padding-right: 10px;
    border: none;
    color: #666;
    font-size: 14px;
    line-height: 40px;
    outline: none;

    &:-webkit-autofill {
      box-shadow: 0 0 0px 1000px white inset !important;
    }
  }
}
</style>
