/**
 * Created by xuanjinliang on 2018/12/11.
 */

import * as PIXI from 'pixi.js';
import progressBarJson from "../json/progressBar";

class ProgressBar{
  constructor() {
    this.container = new PIXI.Container();
    this.containerW = 314;
    this.containerH = 42;
    this.progressBarSheet = null;
    this.progressBarAnimate = null;
    this.pBar = null;
    this.fontText = null;
    this.remainPool = [];
    this.totalBar = 200;
    this.remain = 200;
    this.runBool = false;
  }

  setProgressBar(){
    let that = this;
    return new Promise((resolve) => {
      that.progressBarSheet = new PIXI.Spritesheet(PIXI.loader.resources['progressBar'].texture.baseTexture, progressBarJson);

      that.progressBarSheet.parse(() => {

        let progressBarAnimate = new PIXI.Sprite(that.progressBarSheet.textures['progressBar3.png']);
        progressBarAnimate.scale.set(that.containerW / progressBarAnimate.width, that.containerH / progressBarAnimate.height);

        resolve(progressBarAnimate);
      });
    });
  }

  setProgressBarSprite() {
    let that = this;

    this.container.removeChild(that.progressBarAnimate);

    that.progressBarAnimate = new PIXI.extras.AnimatedSprite(that.progressBarSheet.animations.progressBar);
    that.progressBarAnimate.scale.set(that.containerW / that.progressBarAnimate.width, that.containerH / that.progressBarAnimate.height);

    that.progressBarAnimate.loop = true;
    that.progressBarAnimate.animationSpeed = 0.2;
    that.progressBarAnimate.play();

    this.container.addChildAt(that.progressBarAnimate, 0);
  }

  setBarAnim() {
    let that = this;
    if(that.runBool || that.remain <= 0 || that.remainPool.length <= 0){
      return;
    }

    that.runBool = true;
    let n = that.remainPool.shift();

    that.remain -= n;

    if(that.remain <= 0){
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
    tween.from({frameWidth: pBarTexture.width}).to({frameWidth: targetW}).on('end', function(){
      that.runBool = false;
      if(that.remainPool.length > 0){
        that.setBarAnim();
      }
    }).on('update', function(){
      that.pBar.texture.frame = new PIXI.Rectangle(0, 0, that.pBar.frameWidth, that.pBar.texture.height);
    }).start();

    if(that.remain <= 40 && this.progressBarAnimate.playing != true){
      this.setProgressBarSprite();
    }

  }

  setBarPool(num) {
    this.remainPool.push(num);
    this.setBarAnim();
  }

  init() {
    let that = this;
    this.setProgressBar().then((result) => {
      that.progressBarAnimate = result;
      this.container.addChildAt(this.progressBarAnimate, 0);
    });

    let pBar = new PIXI.Sprite(
      PIXI.loader.resources['pBar'].texture
    ),
      pBarW = 295,
      pBarH = 24,
      borderWidth = 9,
      borderHeight = 6;

    pBar.x = borderWidth;
    pBar.y = borderHeight;
    pBar.scale.set(pBarW / pBar.width, pBarH / pBar.height);

    that.pBar = pBar;

    that.fontText = new PIXI.Text(`${that.remain} / ${that.totalBar}`, {
      fontFamily: 'Arial',
      fontSize: '24px',
      fontWeight: 'bold',
      fill: '#ffffff'
    });

    that.fontText.x = (that.containerW - that.fontText.width) / 2;
    that.fontText.y = (that.containerH - that.fontText.height) / 2 - 3;

    this.container.addChild(pBar, that.fontText);

    return this.container;
  }
}

export default ProgressBar;
