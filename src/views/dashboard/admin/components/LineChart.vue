<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import { formatDate } from 'element-ui/lib/utils/date-util'

require('echarts/theme/macarons') // echarts theme

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  computed: {
    days() {
      const days = []
      for (let i = 6; i >= 0; i--) {
        days.push(formatDate(new Date(new Date().getTime() - i * 1000 * 60 * 60 * 24), 'MM-dd'))
      }
      return days
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({ cmdRunCounts, caseCounts, instanceExecCounts } = {}) {
      const self = this
      this.chart.setOption({
        xAxis: {
          data: this.days,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: [self.$t('dashboard.cmdRunPerCount'), self.$t('dashboard.instanceExecPerCount')]
        },
        series: [
          {
            name: self.$t('dashboard.cmdRunPerCount'), itemStyle: {
              normal: {
                color: '#FF005A',
                lineStyle: {
                  color: '#FF005A',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            data: cmdRunCounts,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
          // {
          //   name: self.$t('dashboard.casePerCount'), itemStyle: {
          //     normal: {
          //       color: '#3888fa',
          //       lineStyle: {
          //         color: '#3888fa',
          //         width: 2
          //       }
          //     }
          //   },
          //   smooth: true,
          //   type: 'line',
          //   data: caseCounts,
          //   animationDuration: 2800,
          //   animationEasing: 'cubicInOut'
          // },
          {
            name: self.$t('dashboard.instanceExecPerCount'),
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#34bfa3',
                lineStyle: {
                  color: '#34bfa3',
                  width: 2
                },
                areaStyle: {
                  color: '#f3f8ff'
                }
              }
            },
            data: instanceExecCounts,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }
        ]
      })
    }
  }
}
</script>
