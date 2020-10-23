import _ from 'loadsh'

const toStrFun = function(obj, tab = '') {
  let start = '{'
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (_.isNumber(obj[key]) || _.isBoolean(obj[key])) {
        start += '\r\n\t' + tab + key + ': ' + obj[key] + ','
      } else if (_.isString(obj[key])) {
        start += '\r\n\t' + tab + key + ': \'' + obj[key] + '\','
      } else if (_.isArray(obj[key])) {
        start += '\r\n\t' + tab + key + ': ['
        obj[key].forEach((v, i) => {
          if (_.isString(v)) {
            start += '\'' + v + '\''
          } else if (_.isNumber(v)) {
            start += v
          }
          if (i !== obj[key].length - 1) {
            start += ', '
          }
        })
        start += ']'
      } else if (_.isFunction(obj[key])) {
        start += '\r\n\t' + tab + key + ': ' + obj[key] + ','
      } else if (_.isObject(obj[key])) {
        start += '\r\n\t' + tab + key + ': ' + toStrFun(obj[key], tab + '\t')
      }
    }
  }
  start += '\r\n' + tab + '}'
  return start
}

export { toStrFun }
