<template>
  <div>
    AT+
    <el-select :value="mqttCmdType" @change="onCmdTypeChange">
      <el-option label="QRY" value="QRY" />
      <el-option label="CMD" value="CMD" />
      <el-option label="CFG" value="CFG" />
    </el-select>
    =PASSWORD,$SENDTIME,$SERIAL,
    <el-input :value="mqttCmdValue" style="width: 50%;" @input="onCmdValueChange" />
    $
  </div>
</template>

<script>
export default {
  model: {
    event: 'change',
    prop: 'value'
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {
    mqttCmdType: {
      get() {
        const newVal = this.value
        if (newVal) {
          return newVal.substring(newVal.indexOf('AT+') + 3, newVal.indexOf('=PASSWORD'))
        }
        return ''
      },
      set(newVal) {
        const value = `AT+${newVal}=PASSWORD,$SENDTIME,$SERIAL,${this.mqttCmdValue}$`
        this.$emit('change', value)
      }
    },
    mqttCmdValue: {
      get() {
        const newVal = this.value
        if (newVal) {
          return newVal.substring(newVal.indexOf('$SERIAL,') + 8, newVal.lastIndexOf('$'))
        }
        return ''
      },
      set(newVal) {
        const value = `AT+${this.mqttCmdType}=PASSWORD,$SENDTIME,$SERIAL,${newVal}$`
        this.$emit('change', value)
      }
    }
  },
  methods: {
    onCmdTypeChange(v) {
      this.mqttCmdType = v
    },
    onCmdValueChange(v) {
      this.mqttCmdValue = v
    }
  }
}
</script>
