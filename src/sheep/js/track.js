/**
 * Created by xuanjinliang on 2018/12/13.
 */

import {Container, Sprite, loader, Graphics, tweenManager, tween} from "pixi.js";
import Tips from './tips';
import {angleToRadians} from 'common';

class Track{
  constructor() {
    this.container = null;
    this.fingerCon = null;
    this.containerW = 293;
    this.containerH = 455;
    this.cutWidth = 323;
    this.cutX = -(this.cutWidth - this.containerW) / 2;
    this.recordTrackName = '';
    this.trackArray = ['first', 'second', 'third', 'fourth', 'fifth'];
    this.gameStart = false;
    this.addBsheepTimeout = null;
    this.tips = new Tips();
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

    let runTime = 500;
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

    that.container = new Container();

    let trackBg = new Sprite(loader.resources['trackBg'].texture);

    trackBg.scale.set(this.containerW / trackBg.width, this.containerH / trackBg.height);

    let mask = new Graphics();
    mask.beginFill('0x000000').drawRect(0, 0, this.containerW, this.containerH).closePath();

    that.container.mask = mask;

    let tips = new Tips().init();
    tips.x = -4;
    tips.y = this.containerH / 2 + 40;

    that.fingerCon = this.finger();

    that.fingerCon.x = 0;
    that.fingerCon.y = that.containerW / 2;

    that.container.addChild(mask, trackBg, tips, that.fingerCon);

    setTimeout(() => {
      that.container.removeChild(tips);
    }, 2000);

    return that.container;

  }
}

export default Track;
