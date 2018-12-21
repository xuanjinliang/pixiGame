/**
 * Created by xuanjinliang on 2018/12/18.
 */

import {Container, loader, Sprite, extras, tween, tweenManager} from "pixi.js";
import config from './config';

class Sheep{
  constructor(width, height, energy) {
    this.sheepContainer = new Container();
    this.sheepW = width;
    this.trackW = width;
    this.trackH = height;
    this.sheepAnimate = null;
    this.sheepMinHeight = 0;
    this.sheepMaxHeight = this.trackH;
    this.hit = false;   //记录是否碰撞
    this.energy = energy || 0;  //能量值
    this.totalEnergy = energy || 0; //用户记录总的能量值
    this.smiling = null;
    this.sleepCon = null;
    this.sheepSheet = config.sheet.sheep;
    this.sleepSheet = config.sheet.sleep;
    this.scaleAnim = null;
    this.delete = false;
  }

  sheepResize() {
    let that = this;
    if(!that.sheepAnimate){
      return;
    }

    let scale = that.sheepW / that.sheepAnimate.width;

    if(that.sheepAnimate.name.indexOf(1) > -1){
      scale *= 0.6;
    }else if(that.sheepAnimate.name.indexOf(2) > -1){
      scale *= 0.7;
    }

    that.sheepAnimate.scale.set(scale);
  }

  getSheepRectangle() {
    let minWidth = this.sheepContainer.minWidth,
      minHeight = this.sheepContainer.minHeight,
      width = this.sheepContainer.width,
      height = this.sheepContainer.height;

    return {
      x: this.sheepContainer.x,
      y: this.sheepContainer.y,
      width: minWidth > width ? minWidth : width,
      height: minHeight > height ? minHeight : height
    };
  }

  runFlash() {
    if(this.scaleAnim){
      this.scaleAnim.reset();
      this.scaleAnim.remove();
    }

    if(!this.sheepAnimate.playing){
      let index = this.sheepContainer.getChildIndex(this.sheepAnimate);
      this.sheepContainer.removeChild(this.sheepAnimate);

      let sheepAnimate = new extras.AnimatedSprite(this.sheepSheet.animations[this.sheepAnimate.name]);
      sheepAnimate.name = this.sheepAnimate.name;

      this.sheepAnimate = sheepAnimate;
      this.sheepResize();
      sheepAnimate.loop = true;
      sheepAnimate.animationSpeed = 0.1;
      sheepAnimate.play();

      this.sheepContainer.addChildAt(sheepAnimate, index);
    }

  }

  sheepScale() {
    let that = this;
    let scaleAnim = tweenManager.createTween(that.sheepAnimate);
    scaleAnim.loop = true;
    scaleAnim.pingPong = true;
    scaleAnim.time = 600;
    scaleAnim.easing = tween.Easing.linear();
    scaleAnim.from({
      scale: {x: that.sheepAnimate.scale.x, y: that.sheepAnimate.scale.y}
    }).to({
      scale: {x: that.sheepAnimate.scale.x * 0.8, y: that.sheepAnimate.scale.y * 0.8}
    }).start();
    /*.on('update', () => {
      console.log('width-->', that.sheepContainer.width, that.getSheepRectangle().width);
    })*/

    that.scaleAnim = scaleAnim;
  }

  sleep() {
    let sleepAnimate = new extras.AnimatedSprite(this.sleepSheet.animations.sleep);
    sleepAnimate.scale.set(0.6);

    sleepAnimate.loop = true;
    sleepAnimate.animationSpeed = 0.1;
    sleepAnimate.play();
    sleepAnimate.visible = false;

    return sleepAnimate;
  }

  smillingAnim() {
    let that = this;

    if(that.smiling.visible == true){
      return;
    }

    that.smiling.visible = true;

    let smilingAnim = tweenManager.createTween(that.smiling);
    smilingAnim.loop = true;
    smilingAnim.pingPong = true;
    smilingAnim.time = 500;
    smilingAnim.easing = tween.Easing.linear();
    smilingAnim.from({
      scale: {x: 1, y: 1}
    }).to({
      scale: {x: 0.8, y: 0.8}
    }).start();

    setTimeout(() => {
      that.smiling.visible = false;
      smilingAnim.reset();
      smilingAnim.remove();
    }, 2000);
  }

  showSmiling(bool) {
    let container = new Container();

    const width = 51;

    let smilingBg = new Sprite(loader.resources['smilingBg'].texture);

    smilingBg.pivot.x = smilingBg.width / 2;
    smilingBg.pivot.y = smilingBg.height / 2;
    let scale = width / smilingBg.width;
    smilingBg.scale.set(scale, bool ? scale : -scale );

    let smiling = new Sprite(loader.resources[bool?'smiling1':'smiling2'].texture);

    smiling.pivot.x = smiling.width / 2;
    smiling.pivot.y = smiling.height / 2;

    smiling.scale.set(width / smiling.width);

    container.addChild(smilingBg, smiling);
    container.width = width;
    container.height = smilingBg.height;

    container.y = smilingBg.height / 2;

    if(!bool){
      container.y = 0 - container.y;
    }

    container.x = -width / 2;
    container.visible = false;

    return container;
  }

  setSheep(str) {
    let that = this;

    that.sheepAnimate = new Sprite(this.sheepSheet.textures[`${str}.png`]);
    that.sheepAnimate.name = str;
    that.sheepResize();

    that.sheepContainer.x = that.trackW / 2;

    if(str.indexOf('b') > -1){
      that.direction = 'down';
      that.sheepContainer.y = that.sheepAnimate.height / 2;
      that.smiling = this.showSmiling();
    }else{
      that.direction = 'up';
      that.sheepContainer.y = that.trackH - that.sheepAnimate.height / 2;
      that.smiling = this.showSmiling(1);
    }
    that.sheepMinHeight += that.sheepAnimate.height / 2;
    that.sheepMaxHeight -= that.sheepAnimate.height / 2;

    /*let shape = new Graphics();
    shape.beginFill('0x000fff').drawRect(0, 0, that.sheepAnimate.width, that.sheepAnimate.height).closePath();

    shape.pivot.set(that.sheepAnimate.width / 2, that.sheepAnimate.height / 2);*/

    that.sheepContainer.addChild(that.sheepAnimate, that.smiling);

    //that.sheepContainer.hitArea = new Rectangle(0, 0, that.sheepAnimate.width, that.sheepAnimate.height);
    that.sheepContainer.minWidth = that.sheepAnimate.width;
    that.sheepContainer.minHeight = that.sheepAnimate.height;

    that.sleepCon = that.sleep();

    that.sheepContainer.addChild(that.sleepCon);
    that.sleepCon.x = that.sleepCon.width / 2 + 6;
    that.sleepCon.y = -that.sleepCon.height / 2 - 10;

    that.sheepScale();
  }

  init(str) {
    this.setSheep(str);
    return this.sheepContainer;
  }
}

export default Sheep;
