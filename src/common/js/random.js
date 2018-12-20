/**
 * Created by xuanjinliang on 2018/12/18.
 */

import _ from 'lodash';

let randomNumber = {
  dutyRatioSize: function (size) {
    if(!size || !_.isNumber(size) || size <= 1){
      return size;
    }

    let array = [];
    for(let i = 0; i < size; i++){
      array.push(i);
    }

    let newArray = _.shuffle(array.concat([])),
      rNum = this.round(0, size - 1); //获取随机数

    //console.log(newArray, rNum);
    return newArray[rNum];

  },
  //设置每个数字的占比[20,30,50] 第一个占比例为20%,返回索引
  dutyRatioArrayNum: function (array) {

    //判断是否为数组
    if (!_.isArray(array)) {
      console.error('Parameter is not array');
      return array;
    }

    //判断数组中是否存在不是数字的
    let filtered = array.filter(function (value) {
      return _.isNumber(value);
    });

    if (!filtered || filtered.length <= 0) {
      console.error('Array does not contain Numbers');
      return array;
    }

    //最大值
    let limitMax = array.reduce(function (sum, value) {
      return sum + value;
    }, 0);

    if (limitMax <= 0) {
      console.error('The maximum less than 0');
      return array;
    }

    let newArray = _.shuffle(array.concat([])), //随机打乱数组范围
      rNum = this.init(0, limitMax); //获取随机数

    //console.log(newArray);
    //计算随机数所在范围
    let firstNum = 0,
      index = -1;
    //console.log('newArray-->', newArray, rNum);
    for (let i = 0, len = newArray.length; i < len; i++) {
      let endNum = firstNum + newArray[i];
      //console.log(firstNum, rNum, endNum);
      if (firstNum <= rNum && rNum < endNum) {
        index = i;
        break;
      } else {
        firstNum = endNum;
      }
    }

    let resultNum = newArray[index];

    //console.log(array, resultNum);
    return array.findIndex(function (value) {    //随机数在哪个范围
      return value === resultNum;
    });
  },
  //设置每个数字的占比[{id:1,dutyRatio: 20},{id:2,dutyRatio: 30},{id:3,dutyRatio: 50}], 第一个占比例为20%，返回id
  dutyRatioArrayObj: function (array) {
    //判断是否为数组
    if (!_.isArray(array)) {
      console.error('Parameter is not array');
      return array;
    }
    //判断数组中是否存在不是数字的
    let filtered = array.filter(function (value) {
      return _.isPlainObject(value);
    });

    if (!filtered || filtered.length <= 0) {
      console.error('Array does not contain Object');
      return array;
    }

    //最大值
    let limitMax = array.reduce(function (sum, value) {
      return sum + value.dutyRatio;
    }, 0);

    if (limitMax <= 0) {
      console.error('The maximum less than 0');
      return array;
    }

    let newArray = _.shuffle(array.concat([])), //随机打乱数组范围
      rNum = this.init(0, limitMax); //获取随机数

    let firstNum = 0,
      index = -1;

    //console.log('newArray-->', newArray, rNum);
    for (let i = 0, len = newArray.length; i < len; i++) {
      let dutyRatio = newArray[i].dutyRatio,
        endNum = firstNum + dutyRatio;
      //console.log(firstNum, rNum, endNum);
      if (firstNum <= rNum && rNum < endNum) {
        //console.log(newArray[i]);
        index = newArray[i].id;
        break;
      } else {
        firstNum = endNum;
      }
    }

    //console.log(index);
    return index;
  },
  num: Math.random(),
  init: function (startNum, endNum) {
    let num = this.num;
    if (_.isNumber(startNum) && _.isNumber(endNum)) {
      num = (Math.random() * (endNum - startNum)) + startNum;
    }
    return num;
  },
  //四舍五入
  round: function (startNum, endNum) {
    return Math.round(this.init(startNum, endNum));
  },
  //上舍入
  ceil: function (startNum, endNum) {
    return Math.ceil(this.init(startNum, endNum));
  },
  //下舍入
  floor: function (startNum, endNum) {
    return Math.floor(this.init(startNum, endNum));
  }
};

export default randomNumber;
