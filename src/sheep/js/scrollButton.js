/**
 * Created by xuanjinliang on 2018/12/11.
 */

import _ from 'lodash';
import * as PIXI from 'pixi.js';
import config from './config';
import loadJson from '../json/load.json';

class ScrollButton {

  constructor() {
    this.scrollContainer = null;
    this.scrollContainerW = 0;
    this.scrollContainerH = 0;
    this.wSheepArray = [
      {
        imgId: 1,
        name: 'w1',
        energy: 20
      },
      {
        imgId: 2,
        name: 'w2',
        energy: 40
      },
      {
        imgId: 3,
        name: 'w3',
        energy: 60
      }];
    this.recordCilck = null;
    this.loadAnimate = null;
  }

  buttonScope(buttonCon, index) {
    let buttonConW = buttonCon.width;

    let obj = {
      alpha: 1,
      x: this.scrollContainerW / 2,
      y: buttonConW * index + buttonConW / 2
    };

    if(index < 0){
      obj.alpha = 0;
      obj.y = (0 - obj.y) * index;
    }else if(index <= 1){
      obj.alpha = (index + 1) * 0.3;
      obj.y -= buttonConW * 0.1;
    }

    if(index > 2){
      obj.alpha = 0;
    }

    return obj;
  }

  scrollAnim() {
    let that = this,
      target = that.recordCilck,
      newButton = that.button(0, target.imgId);

    let newButtonScope = that.buttonScope(newButton, -1);

    newButton.x = newButtonScope.x;
    newButton.y = newButtonScope.y;
    newButton.alpha = newButtonScope.alpha;

    that.scrollContainer.addChildAt(newButton, 0);

    let newObj = {
      con: newButton,
      name: target.name,
      energy: target.energy,
      imgId: target.imgId
    };

    that.wSheepArray.unshift(newObj);

    that.wSheepArray.forEach((o, index) => {
      let buttonCon = o.con,
        scope = that.buttonScope(buttonCon, index);

      const tween = PIXI.tweenManager.createTween(buttonCon);
      tween.time = 500;
      tween.easing = PIXI.tween.Easing.linear();
      tween.loop = false;
      tween.pingPong = false;
      tween.from({
        x: buttonCon.x,
        y: buttonCon.y,
        alpha: buttonCon.alpha
      }).to({
        x: scope.x,
        y: scope.y,
        alpha: scope.alpha
      }).on('end', function() {
        if(o.con.alpha == 0){
          that.scrollContainer.removeChild(o.con);
          that.wSheepArray.pop();
        }
      }).start();

      if(that.wSheepArray.length - 2 == index){
        that.buttonLoad(o);
      }
    });
  }

  setLoadAnim() {
    return new Promise((resolve) => {
      let loadSheet = new PIXI.Spritesheet(PIXI.loader.resources['load'].texture.baseTexture, loadJson);

      let loadW = this.scrollContainerH / 3;

      loadSheet.parse(() => {
        let textures = Object.keys(loadSheet.textures).map((t) => loadSheet.textures[t]);

        let loadAnimate = new PIXI.extras.AnimatedSprite(textures);
        loadAnimate.scale.set(loadW / loadAnimate.width, loadW / loadAnimate.height);

        loadAnimate.loop = false;

        resolve(loadAnimate);
      });
    });
  }

  buttonLoad(button) {
    let that = this;

    that.recordCilck = button;
    that.recordCilck.addBool = false;
    that.recordCilck.complateFun = null;

    const tween = PIXI.tweenManager.createTween(that.loadAnimate);
    tween.time = config.buttonLoadTime;
    tween.easing = PIXI.tween.Easing.linear();
    tween.loop = false;
    tween.pingPong = false;
    tween.from({currentAnimationFrame: 0}).to({currentAnimationFrame: 7}).on('end', function() {
      that.recordCilck.addBool = true;
      if(_.isFunction(that.recordCilck.complateFun)){
        that.recordCilck.complateFun();
      }
    }).on('update', function() {
      if(_.isNumber(that.loadAnimate.currentAnimationFrame)){
        that.loadAnimate.gotoAndStop(parseInt(that.loadAnimate.currentAnimationFrame));
      }
    }).start();

    button.con.addChild(that.loadAnimate);
  }

  button(index, imgId) {
    let buttonCon = new PIXI.Container(),
      buttonConW = this.scrollContainerH / 3,
      name = `sheepButton${imgId}`;

    let button = new PIXI.Sprite(
        PIXI.loader.resources[name].texture
      );

    buttonCon.name = name;

    button.scale.set(buttonConW / button.width);

    buttonCon.pivot.x = buttonConW / 2;
    buttonCon.pivot.y = buttonConW / 2;

    buttonCon.addChild(button);

    buttonCon.width = buttonConW;
    buttonCon.height = buttonConW;

    let scope = this.buttonScope(buttonCon, index);

    buttonCon.alpha = scope.alpha;
    buttonCon.x = scope.x;
    buttonCon.y = scope.y;

    return buttonCon;
  }

  setScrollCon(){
    let that = this;

    that.scrollContainerW = 74;
    that.scrollContainerH = 180;

    that.scrollContainer = new PIXI.Container();

    that.wSheepArray.forEach((o, index) => {
      o.con = that.button(index, o.imgId);
      that.scrollContainer.addChild(o.con);
    });

    that.setLoadAnim().then((result) => {
      that.loadAnimate = result;
      that.buttonLoad(that.wSheepArray[that.wSheepArray.length - 1]);
    });


    return that.scrollContainer;
  }
}

export default ScrollButton;
