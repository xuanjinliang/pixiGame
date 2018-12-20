/**
 * Created by xuanjinliang on 2018/12/13.
 */

import {Container, Sprite, loader, Rectangle, tweenManager, tween, Text} from "pixi.js";
import Sheep from "./sheep";
import {angleToRadians, hitTestRectangle} from "common";
import config from './config';

class EachTrack{
  constructor(name){
    this.name = name;
    this.container = new Container();
    this.containerW = 49;
    this.containerH = 455;
    this.runTrack = null;
    this.distance = 0.5;
    this.trackBArray = []; //记录黑羊进入跑道
    this.trackWArray = []; //记录白羊进入跑道
    this.firstWSheep = null; //记录第一白羊，用于碰撞
    this.firstBSheep = null; //记录第一黑羊，用于碰撞
    this.energyContainer = null;
    this.cry1 = null;
    this.cry1Timeout = null;
    this.cry2 = null;
    this.cry2Timeout = null;
    this.space = null;
    this.spaceTimeout = null;
    this.runTrackTween = null;
  }

  addNoSpace() {
    let that = this;
    clearTimeout(that.spaceTimeout);

    if(that.container.getChildByName('space')){
      that.container.removeChild(that.space);
    }

    that.container.addChild(that.space);

    that.spaceTimeout = setTimeout(function(){
      that.container.removeChild(that.space);
    }, 500);
  }

  noSpace(){
    let noSpace = new Sprite(loader.resources['noSpace'].texture);

    noSpace.name = 'space';
    noSpace.scale.set(this.containerW / noSpace.width);

    return noSpace;
  }

  setEnergyText(num, bool) {
    let fontName = bool ? 'fontText1' : 'fontText',
      fontText = this.energyContainer.getChildByName(fontName);

    fontText.text = num;
    fontText.pivot.set(fontText.width / 2, fontText.height / 2);
    fontText.rotation = angleToRadians(-90);
    fontText.x = this.energyContainer.width / 2;
    fontText.y = this.energyContainer.height / 2 * ( 1 + ( bool ? 0.5 : -0.5) );
  }

  showEnergy() {
    this.energyContainer = new Container();
    let energy = new Sprite(loader.resources['energy'].texture);

    energy.pivot.set(energy.width / 2, energy.height / 2);
    energy.scale.set(this.containerW / energy.width / 2);
    energy.y = energy.height / 2;
    energy.x = energy.width / 2;

    energy.name = 'energy';

    const style = {
      fontFamily: 'Arial',
      fontSize: '14px',
      fill: '#ffffff'
    };

    let fontText = new Text('', style);
    fontText.name = 'fontText';

    let fontText1 = new Text('', style);
    fontText1.name = 'fontText1';

    this.energyContainer.addChild(energy, fontText, fontText1);
    this.energyContainer.x = -10;
    this.energyContainer.visible = false;

    return this.energyContainer;
  }

  getSheepBounds(name, energy) {
    let sheep = new Sheep(this.containerW, this.containerH, energy);
    sheep.init(name);
    return sheep.getSheepRectangle();
  }

  removeSheep() {
    if(this.trackWArray.length <= 0){
      return;
    }
    let sheep = this.trackWArray[this.trackWArray.length - 1];
    if(sheep && sheep.addBool === false){
      this.trackWArray.pop();
      this.container.removeChild(sheep.sheepContainer);
    }
  }

  addSheep(name, energy) {
    let sheep = new Sheep(this.containerW, this.containerH, energy);

    let con = sheep.init(name);

    //con.y = sheep.sheepMaxHeight;
    //con.y = 83;

    this.container.addChildAt(con, 0);

    if(name.indexOf('b') > -1){
      this.trackBArray.push(sheep);
    }else{
      this.trackWArray.push(sheep);
    }
  }

  addCryFace(bool) {
    let that = this,
      time = bool ? 'cry1Timeout' : 'cry2Timeout',
      str = bool ? 'cry1' : 'cry2';

    clearTimeout(that[time]);

    if(that.container.getChildByName(str)){
      that.container.removeChild(that[str]);
    }

    that.container.addChildAt(that[str], that.container.getChildIndex(that.runTrack) - 1);

    that[time] = setTimeout(() => {
      that.container.removeChild(that[str]);
    }, 2000);
  }

  showCryFace(bool) {
    let container = new Container();

    let cryBg = new Sprite(loader.resources['cryBg'].texture);
    cryBg.pivot.set(cryBg.width / 2, cryBg.height / 2);
    cryBg.scale.set(this.containerW / cryBg.width);

    if(!bool){
      cryBg.rotation = angleToRadians(180);
    }

    let cry = new Sprite(loader.resources[bool?'cry1':'cry2'].texture);
    cry.pivot.set(cry.width / 2, cry.height / 2);
    cry.scale.set(this.containerW / cry.width);

    container.name = bool?'cry1':'cry2';

    container.addChild(cryBg, cry);

    return container;
  }

  showSmile(array, index) {
    let len = array.length;

    if(len - 1 <= index){
      return;
    }

    let target = array[index + 1];

    target.smillingAnim();
  }

  trackFlash() {
    if(this.runTrackTween && this.runTrackTween.active){
      return;
    }

    this.runTrackTween = tweenManager.createTween(this.runTrack);
    this.runTrackTween.repeat = 1;
    this.runTrackTween.pingPong = true;
    this.runTrackTween.time = 300;
    this.runTrackTween.easing = tween.Easing.linear();
    this.runTrackTween.to({
      alpha: 1
    }).start();
  }

  crash(array, bool) {
    if(this.firstBSheep && this.firstWSheep && Array.isArray(array) && array.length > 1){
      let len = array.length,
        nowEle = array[len - 1],
        preEle = array[len - 2];

      if(nowEle.hit == false){
        let nowSheep = nowEle.sheepContainer,
          target = preEle.sheepContainer;

        if(hitTestRectangle(nowSheep, target)){
          nowEle.hit = true;
          if(bool){
            this.firstBSheep.totalEnergy += nowEle.energy;
          }else{
            this.firstWSheep.totalEnergy += nowEle.energy;
          }
        }
      }
    }
  }

  //bool 为false 为正方向，true为反方向
  runDirection(o, array, bool){
    let that = this,
      compareBool = bool ? o.sheepContainer.y > o.sheepMaxHeight : o.sheepContainer.y < o.sheepMinHeight;

    //console.log(o.sheepContainer.y, o.sheepMaxHeight, o.sheepMinHeight, compareBool);
    if(compareBool){
      o.bound = true;
    }

    o.sheepContainer.y += (bool ? that.distance : - that.distance);

    let removeBool = bool ? (o.getSheepRectangle().height + o.sheepMaxHeight <= o.sheepContainer.y) :
      (o.sheepContainer.y + o.getSheepRectangle().height / 2 < 0);

    //console.log('removeBool-->', removeBool);
    if(removeBool){
      o.delete = true;
      that.container.removeChild(o.sheepContainer);
      return o;
    }

    array.push(o);
    return o;
  }

  runEle() {
    let that = this,
      newBArray = [],
      newWArray = [];

    /*if(that.firstWSheep && that.firstWSheep.hit){
      console.log('firstWSheep-->', that.firstWSheep.sheepContainer);
      console.log('firstBSheep-->', that.firstBSheep.sheepContainer);
      return;
    }*/

    //白羊
    that.firstWSheep = null;
    if(that.trackWArray.length > 0){
      that.trackWArray.forEach((o, index) => {
        //羊在加载
        if(o.addBool === false){
          newWArray.push(o);
          return;
        }

        //记录赛道第一只羊
        if(!that.firstWSheep){
          that.firstWSheep = o;
        }

        //碰撞后显示进度条
        if(that.firstWSheep.hit && that.firstBSheep){
          that.energyContainer.y = that.firstWSheep.sheepContainer.y - (that.energyContainer.height + that.firstWSheep.getSheepRectangle().height) / 2;
          that.energyContainer.visible = true;
          that.setEnergyText(that.firstBSheep.totalEnergy);
          that.setEnergyText(that.firstWSheep.totalEnergy, 1);
        }else{
          that.energyContainer.visible = false;
        }

        if(o.hit && that.firstWSheep.hit && that.firstBSheep && that.firstWSheep.totalEnergy < that.firstBSheep.totalEnergy){
          that.runDirection(o, newWArray, 1);
        }else{
          let arriveSheep = that.runDirection(o, newWArray);
          if(arriveSheep.bound){
            if(o.energy != 0){
              that.showSmile(that.trackWArray, index);
              that.addCryFace(1);
            }
            if(o.energy > 0 && config.content.topBar){
              config.content.topBar.progressBar.setBarPool(o.energy);
            }
            o.energy = 0;
          }
        }
        that.crash(newWArray);
      });
    }

    that.trackWArray = newWArray;

    //黑羊
    that.firstBSheep = null;
    if(that.trackBArray.length > 0){
      that.trackBArray.forEach((o, index) => {

        if(!that.firstBSheep){
          that.firstBSheep = o;
        }

        //黑羊与白羊碰撞
        if(index == 0 && that.firstWSheep){
          let sheep = that.firstWSheep.sheepContainer,  //白羊
            target = that.firstBSheep.sheepContainer;  //黑羊


          if(hitTestRectangle(sheep, target)){
            that.firstWSheep.runFlash();
            that.firstBSheep.runFlash();

            //记录最开始位置已经碰撞
            that.firstWSheep.hit = true;
            that.firstBSheep.hit = true;
          }
        }

        if(!that.firstWSheep){
          that.energyContainer.visible = false;
        }

        if(o.hit && that.firstBSheep.hit && that.firstWSheep && that.firstWSheep.totalEnergy >= that.firstBSheep.totalEnergy){
          that.runDirection(o, newBArray);
        }else{
          let arriveSheep = that.runDirection(o, newBArray, 1);
          if(arriveSheep.bound){
            if(o.energy != 0){
              that.showSmile(that.trackBArray, index);
              that.addCryFace(0);
            }
            if(o.energy > 0 && config.content.footBar){
              config.content.footBar.setBarPool(o.energy);
            }
            o.energy = 0;
          }
        }
        that.crash(newBArray, 1);
      });
    }

    that.trackBArray = newBArray;

    if(that.firstWSheep && that.firstWSheep.delete){
      that.firstWSheep.totalEnergy = 0;
    }

    if(that.firstBSheep && that.firstBSheep.delete){
      that.firstBSheep.totalEnergy = 0;
    }
  }

  init() {
    this.runTrack = new Sprite(loader.resources['track'].texture);

    this.runTrack.scale.set(this.containerW / this.runTrack.width, this.containerH / this.runTrack.height);

    this.runTrack.alpha = 0;

    this.container.name = this.name;

    this.space = this.noSpace();
    this.space.y = this.containerH - this.space.height;

    this.cry1 = this.showCryFace();
    this.cry2 = this.showCryFace(1);

    this.cry1.x = this.containerW / 2;
    this.cry1.y = this.cry1.height / 2;

    this.cry2.x = this.containerW / 2;
    this.cry2.y = this.containerH - this.cry2.height / 2;

    this.container.addChild(this.runTrack, this.showEnergy());
    this.container.interactive = true;

    //this.addSheep('b1', 20);
    //this.addSheep('w3', 60);
    //this.setEnergyText(20);
    //this.setEnergyText(40, 1);
    /*this.trackWArray[0].runFlash();
    this.trackBArray[0].runFlash();*/
    /*let that = this;
    setTimeout(() => {
      that.addSheep('w2', 40);
    }, 2000);*/

    this.container.hitArea = new Rectangle(0, 0, this.runTrack.width, this.runTrack.height);
    return this.container;
  }
}

export default EachTrack;
