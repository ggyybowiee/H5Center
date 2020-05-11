export default {
  // 获取url地址参数
  getUrlParams: function (url) {
    var params = {}
    var arr = url.split('?')

    if (arr.length <= 1) {
      return params
    }

    arr = arr[1].split('&')

    for (var i = 0; i < arr.length; i++) {
      var a = arr[i].split('=')
      params[a[0]] = a[1]
    }

    return params
  },

  // 字符串时间转换成时间戳,并计算距离当前的时间（天数）
  changeTimeStr: function (timeStr) {
    timeStr = timeStr.substring(0, 19)
    let date = timeStr.replace(/-/g, '/')
    let endTime = new Date(date).getTime()
    let beginTime = new Date().getTime()
    let timeDiff = endTime - beginTime
    let dayDiff = Math.floor(timeDiff / (24 * 3600 * 1000))

    return dayDiff
  },

  // YYYY-MM-DD转化成英文显示
  changeTimeToEn: function (timeStr) {
    let date = new Date(timeStr.replace(/-/g, '/'));
    let dateString = date.toDateString();
    let dateArray = dateString.split(' ');
    return `${dateArray[1]} ${dateArray[2]}, ${dateArray[3]}`;
  },

  // 强制保留2位小数，如：2，会在2后面补上00.即2.00
  toDecimal2: function (x) {
    let floatNum = parseFloat(x);
    if (isNaN(floatNum)) {
      return false;
    }
    let f = Math.round(x * 100) / 100;
    let s = f.toString();
    let rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + 2) {
      s += '0';
    }
    return s;
  },
  NumberCheck(num) {
    let str = num.toString();
    str = str.replace(/[\u4E00-\u9FA5]/g, ''); // 去除中文
    str = str.replace(/[a-zA-Z]/g, ''); // 去除字母
    let reg = /^[1-9]\d{0,7}(\.\d{0,2})?$|^0(\.\d{0,2})?$/;

    if (!reg.test(str)) {
      str = str.substring(0, str.length - 1);
    }

    if (str.indexOf(".") < 0 && str != "") { // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 

      str = parseFloat(str);

    }
    return str;
  }
}
