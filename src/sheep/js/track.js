/**
 * Created by xuanjinliang on 2018/12/13.
 */

import _ from 'lodash';
import {Container, Sprite, loader, Graphics, tweenManager, tween} from "pixi.js";
import Tips from './tips';
import EachTrack from './eachTrack';
import {angleToRadians} from 'common';
import random from 'random';
import config from './config';

class Track{
  constructor() {
    this.container = new Container();
    this.fingerCon = null;
    this.containerW = 293;
    this.containerH = 455;
    this.cutWidth = 323;
    this.recordTrackName = '';
    this.runTrack_first = new EachTrack('first');
    this.runTrack_second = new EachTrack('second');
    this.runTrack_third = new EachTrack('third');
    this.runTrack_fourth = new EachTrack('fourth');
    this.runTrack_fifth = new EachTrack('fifth');
    this.trackArray = ['first', 'second', 'third', 'fourth', 'fifth'];
    //this.trackArray = ['first'];
    this.gameStart = false;
    this.addBsheepTimeout = null;
    this.tips = new Tips();
  }

  addBSheepToTrack(bSheep) {
    let trackNum = random.round(0, this.trackArray.length - 1),
      name = `runTrack_${this.trackArray[trackNum]}`;

    let lastBSheep = null,
      firstWSheep = null,
      array = [],
      maxSheepSpace = this[name].getSheepBounds(bSheep.name, bSheep.energy);

    if(Array.isArray(this[name].trackBArray) && this[name].trackBArray.length > 0){
      lastBSheep = this[name].trackBArray[this[name].trackBArray.length - 1];
      array.push(lastBSheep);
    }

    if(Array.isArray(this[name].trackWArray) && this[name].trackWArray.length > 0){
      firstWSheep = this[name].trackWArray[0];
      array.push(firstWSheep);
    }

    for (let i = 0, l = array.length; i < l; i++){
      let sheep = array[i],
        y = sheep.sheepContainer.y,
        limitY = maxSheepSpace.height + sheep.sheepContainer.height / 2;

      if(y < limitY){
        return false;
      }
    }

    return name;
  }

  addBsheep(num) {
    let that = this;
    that.addBsheepTimeout = setTimeout(function(){
      num = _.isNumber(num) ? num : random.round(0, 2);

      if(!config.content.bSheepButton){
        return;
      }

      config.content.bSheepButton.addSheep(num);

      let bSheep = config.content.bSheepButton.bSheepArray[num];

      let trackName = that.addBSheepToTrack(bSheep);

      if(trackName != false){
        that[trackName].addSheep(bSheep.name, bSheep.energy);
        that.addBsheep();
      }else{
        that.addBsheep(num);
      }

    }, config.buttonLoadTime * 2);
  }

  limitAddWSheep(runTrack, bool) {
    let firstBSheep = null,
      lastWSheep = null,
      array = [],
      sheep = null,
      recordCilck = config.content.scrollButton.recordCilck,
      maxSheepSpace = runTrack.getSheepBounds(recordCilck.name, recordCilck.energy);

    if(Array.isArray(runTrack.trackBArray) && runTrack.trackBArray.length > 0){
      firstBSheep = runTrack.trackBArray[0];
      array.push(firstBSheep);
    }

    if(Array.isArray(runTrack.trackWArray)){
      if(bool && runTrack.trackWArray.length > 0){
        lastWSheep = runTrack.trackWArray[runTrack.trackWArray.length - 1];
        array.push(lastWSheep);
      }else if(!bool && runTrack.trackWArray.length > 1){
        lastWSheep = runTrack.trackWArray[runTrack.trackWArray.length - 2];
        array.push(lastWSheep);
      }
    }

    for (let i = 0, l = array.length; i < l; i++){
      sheep = array[i];
      let y = sheep.sheepContainer.y,
        limitY = this.containerH - (maxSheepSpace.height + sheep.sheepContainer.height / 2);

      if(y > limitY){
        if(bool){
          runTrack.addNoSpace();
        }
        return true;
      }
    }

    return false;
  }

  event() {
    this.container.interactive = true;
    this.container.on('tap', (event) => {
      event.stopPropagation();

      if(this.fingerCon && this.fingerCon.alpha == 0){
        return;
      }

      if(this.fingerCon){
        this.container.removeChild(this.fingerCon);
        this.fingerCon = null;
      }

      let target = event.target;

      if(!(target && target.name)){
        return;
      }

      if(!this.gameStart){
        this.gameStart = true;
        this.addBsheep();
      }

      let track = this[`runTrack_${target.name}`];

      if(track.trackWArray.length > 0 && this.limitAddWSheep(track, 1)){
        return;
      }

      track.trackFlash();

      let recordCilck = config.content.scrollButton.recordCilck;
      track.addSheep(recordCilck.name, recordCilck.energy);

      let sheep = track.trackWArray[track.trackWArray.length - 1];
      sheep.addBool = recordCilck.addBool;

      if(!recordCilck.addBool){
        if(this.recordTrackName == ''){
          this.recordTrackName = track.name;
        }else if(this.recordTrackName != track.name){
          this[`runTrack_${this.recordTrackName}`].removeSheep();
          this.recordTrackName = track.name;
        }

        sheep.sleepCon.visible = true;
        let that = this;

        recordCilck.complateFun = () => {
          //上一个羊还在加载中，跳转到其它道，之前的羊不执行转动下一只羊
          if(track.trackWArray.indexOf(sheep) == -1){
            return;
          }

          if(that.limitAddWSheep(track)){
            that[`runTrack_${that.recordTrackName}`].removeSheep();
          }else{
            sheep.sleepCon.visible = false;
            sheep.addBool = recordCilck.addBool;
            config.content.scrollButton.scrollAnim();
          }
        };
        return;
      }
      config.content.scrollButton.scrollAnim();
    });
  }

  finger() {
    let container = new Container(),
      fingerCon = new Container();

    let tips = this.tips.init(1);

    let touch = new Sprite(loader.resources['touch'].texture);

    touch.alpha = 0;

    let finger = new Sprite(loader.resources['finger'].texture);
    finger.x = touch.width * 1.5;
    finger.y = touch.height * 1.5;
    finger.pivot.x = finger.width / 2;
    finger.pivot.y = finger.height / 2;
    finger.rotation = angleToRadians(50);

    fingerCon.addChild(touch, finger);

    let runTime = 600;
    const fingerTween = tweenManager.createTween(finger);
    fingerTween.loop = true;
    fingerTween.pingPong = true;
    fingerTween.time = runTime;
    fingerTween.easing = tween.Easing.inOutCubic();
    fingerTween.to({
      rotation: 0
    }).start();

    const touchTween = tweenManager.createTween(touch);
    touchTween.loop = true;
    touchTween.pingPong = true;
    touchTween.time = runTime;
    touchTween.easing = tween.Easing.inOutCubic();
    touchTween.to({
      alpha: 1
    }).start();

    fingerCon.scale.set(0.5, 0.5);

    fingerCon.x = tips.width - 70;
    fingerCon.y = tips.height - 15;

    container.addChild(tips, fingerCon);

    return container;
  }

  runEachTrack() {
    let that = this;
    that.trackArray.forEach((name) => {
      that[`runTrack_${name}`].runEle();
    });
  }

  init() {
    let that = this;

    let trackBg = new Sprite(loader.resources['trackBg'].texture);

    trackBg.width = this.containerW;
    trackBg.height = this.containerH;

    let mask = new Graphics();
    mask.beginFill('0x000000').drawRect(-15, 0, this.cutWidth, this.containerH).closePath();

    let tips = new Tips().init();
    tips.x = -4;
    tips.y = this.containerH / 2 + 40;

    that.fingerCon = this.finger();

    that.fingerCon.x = 0;
    that.fingerCon.y = that.containerW / 2;
    that.fingerCon.alpha = 0;

    that.container.addChild(mask, trackBg, tips, that.fingerCon);
    that.container.mask = mask;


    setTimeout(() => {
      that.container.removeChild(tips);
      that.fingerCon.alpha = 1;
    }, 2000);

    that.trackArray.forEach((name, index) => {
      let runTrackCon = that[`runTrack_${name}`].init();
      runTrackCon.x = 8 * (index + 1) + that[`runTrack_${name}`].containerW * index;
      if(index <= 1){
        runTrackCon.x += 4;
      }

      that.container.addChild(runTrackCon);
    });

    that.event();

    return that.container;

  }
}

export default Track;
