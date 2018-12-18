/**
 * Created by xuanjinliang on 2018/12/13.
 */

import _ from 'lodash';
import {Container, Sprite, loader, Graphics, tweenManager, tween} from "pixi.js";
import Tips from './tips';
import EachTrack from './eachTrack';
import {angleToRadians} from 'common';
/*import config from 'config';*/

class Track{
  constructor() {
    this.container = new Container();
    this.fingerCon = null;
    this.containerW = 293;
    this.containerH = 455;
    this.cutWidth = 323;
    this.cutX = -(this.cutWidth - this.containerW) / 2;
    this.recordTrackName = '';
    this.runTrack_first = new EachTrack('first');
    //this.trackArray = ['first', 'second', 'third', 'fourth', 'fifth'];
    this.trackArray = ['first'];
    this.gameStart = false;
    this.addBsheepTimeout = null;
    this.tips = new Tips();
  }

  event() {
    //let that = this;
    this.container.interactive = true;
    this.container.on('tap', (event) => {
      event.stopPropagation();

      /*if(this.fingerCon && this.fingerCon.alpha == 0){
        return;
      }

      if(this.fingerCon){
        this.container.removeChild(this.fingerCon);
        this.fingerCon = null;
      }*/

      let target = null,
        array = [];

      if(_.isArray(event.target.children)){
        array = event.target.children;
      }
      if(array.length <= 0){
        return;
      }

      for(let i = 0, l = array.length; i < l; i++){
        if(array[i].name && this.trackArray.indexOf(array[i].name) > -1){
          target = array[i];
          break;
        }
      }

      if(!target){
        return;
      }

      let track = this[`runTrack_${target.name}`];

      track.trackFlash();

      //let recordCilck = config.content.scrollButton.recordCilck;
      //runTrack.addSheep(recordCilck.name, recordCilck.energy);
      //console.log(target, target.name);
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

    that.container.addChild(mask, trackBg, tips/*, that.fingerCon*/);
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
