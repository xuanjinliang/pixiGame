/**
 * Created by xuanjinliang on 2018/12/11.
 */

import _ from 'lodash';
import * as PIXI from 'pixi.js';
import config from './config';

class ProgressBar {
  constructor() {
    this.container = new PIXI.Container();
    this.containerW = 314;
    this.containerH = 42;
    this.progressBarAnimate = null;
    this.pBar = null;
    this.fontText = null;
    this.remainPool = [];
    this.totalBar = 200;
    this.remain = 200;
    this.runBool = false;
    this.pBarTexture = null;
    this.progressBarSheet = config.sheet.progressBar;
  }

  setProgressBar() {
    this.progressBarAnimate = new PIXI.Sprite(this.progressBarSheet.textures['progressBar3.png']);
    this.progressBarAnimate.scale.set(this.containerW / this.progressBarAnimate.width, this.containerH / this.progressBarAnimate.height);
    this.container.addChildAt(this.progressBarAnimate, 0);
  }

  setProgressBarSprite() {
    this.container.removeChild(this.progressBarAnimate);
    this.progressBarAnimate = new PIXI.extras.AnimatedSprite(this.progressBarSheet.animations.progressBar);
    this.progressBarAnimate.scale.set(this.containerW / this.progressBarAnimate.width, this.containerH / this.progressBarAnimate.height);

    this.progressBarAnimate.loop = true;
    this.progressBarAnimate.animationSpeed = 0.2;
    this.progressBarAnimate.play();
    this.container.addChildAt(this.progressBarAnimate, 0);
  }

  setBarAnim() {
    let that = this;
    if (that.runBool || that.remain <= 0 || that.remainPool.length <= 0) {
      return;
    }

    that.runBool = true;
    let n = that.remainPool.shift();

    that.remain -= n;

    if (that.remain <= 0) {
      that.remain = 0;
      that.remainPool = [];
    }

    let ratio = that.remain / that.totalBar;

    let pBarTexture = that.pBar.texture,
      targetW = pBarTexture.baseTexture.width * ratio;
    that.fontText.text = `${that.remain} / ${that.totalBar}`;

    const tween = PIXI.tweenManager.createTween(that.pBar);
    tween.time = 300;
    tween.easing = PIXI.tween.Easing.linear();
    tween.loop = false;
    tween.pingPong = false;
    tween.from({frameWidth: pBarTexture.frame.width}).to({frameWidth: targetW}).on('end', function(){
      that.runBool = false;
      if(that.remainPool.length > 0){
        that.setBarAnim();
      }
    }).on('update', function(){
      that.pBar.texture = that.cutImage(that.pBar.frameWidth);
    }).start();

    if (that.remain <= 40 && this.progressBarAnimate.playing != true) {
      this.setProgressBarSprite();
    }

  }

  setBarPool(num) {
    this.remainPool.push(num);
    this.setBarAnim();
  }

  cutImage(targetW) {
    this.pBarTexture = PIXI.loader.resources['pBar'].texture;
    let crop = new PIXI.Rectangle(this.pBarTexture.frame.x, this.pBarTexture.frame.y, (_.isNumber(targetW) ? targetW : this.pBarTexture.frame.width), this.pBarTexture.frame.height);
    return new PIXI.Texture(this.pBarTexture.baseTexture, crop, this.pBarTexture.frame, crop);
  }

  init() {
    this.setProgressBar();

    this.pBar = new PIXI.Sprite(this.cutImage());

    let pBarW = 295,
      pBarH = 24,
      borderWidth = 9,
      borderHeight = 6;

    this.pBar.x = borderWidth;
    this.pBar.y = borderHeight;
    this.pBar.scale.set(pBarW / this.pBar.width, pBarH / this.pBar.height);

    this.fontText = new PIXI.Text(`${this.remain} / ${this.totalBar}`, {
      fontFamily: 'Arial',
      fontSize: '24px',
      fontWeight: 'bold',
      fill: '#ffffff'
    });

    this.fontText.x = (this.containerW - this.fontText.width) / 2;
    this.fontText.y = (this.containerH - this.fontText.height) / 2 - 3;

    this.container.addChild(this.pBar, this.fontText);

    return this.container;
  }
}

export default ProgressBar;
