/**
 * Created by xuanjinliang on 2018/12/18.
 */

import {Container, loader, Sprite, extras, tween, tweenManager} from "pixi.js";
import sheepJson from "../json/sheep";
import sleepJson from "../json/sleep";
import {loadSheet} from "common";

class Sheep{
  constructor(width, height, energy) {
    this.sheepContainer = new Container();
    this.sheepW = width;
    this.trackW = width;
    this.trackH = height;
    this.shapeW = 0;
    this.shapeH = 0;
    this.sheepAnimate = null;
    this.sheepMinHeight = 0;
    this.sheepMaxHeight = this.trackH;
    this.hit = false;   //记录是否碰撞
    this.energy = energy || 0;  //能量值
    this.totalEnergy = energy || 0; //用户记录总的能量值
    this.smiling = null;
    this.sleepCon = null;
    this.sheepSheet = null;
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

  runFlash() {
    let that = this;
    loadSheet('sheep', sheepJson).then((result) => {
      let index = that.sheepContainer.getChildIndex(that.sheepAnimate);
      that.sheepContainer.removeChild(that.sheepAnimate);

      let sheepAnimate = new extras.AnimatedSprite(result.animations[that.sheepAnimate.name]);
      sheepAnimate.name = that.sheepAnimate.name;

      that.sheepAnimate = sheepAnimate;
      that.sheepResize();
      sheepAnimate.loop = true;
      sheepAnimate.animationSpeed = 0.1;
      sheepAnimate.play();

      that.sheepContainer.addChildAt(sheepAnimate, index);
    });
  }

  sleep() {
    return loadSheet('sleep', sleepJson).then((result) => {
      let sleepAnimate = new extras.AnimatedSprite(result.animations.sleep);
      sleepAnimate.scale.set(0.6);

      sleepAnimate.loop = true;
      sleepAnimate.animationSpeed = 0.1;
      sleepAnimate.play();
      sleepAnimate.visible = false;

      return sleepAnimate;
    });
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

    setTimeout(function(){
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

  init(str) {
    let that = this;
    loadSheet('sheep', sheepJson).then((result) => {
      that.sheepSheet = result;

      that.sheepAnimate = new Sprite(that.sheepSheet.textures[`${str}.png`]);
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

      that.sheepContainer.addChild(that.sheepAnimate, that.smiling);

      that.sleep().then((result) => {
        that.sleepCon = result;
        that.sheepContainer.addChild(result);
        that.sleepCon.x = that.sleepCon.width / 2 + 6;
        that.sleepCon.y = -that.sleepCon.height / 2 - 10;
      });
    });

    return that.sheepContainer;
  }
}

export default Sheep;
