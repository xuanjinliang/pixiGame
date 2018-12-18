/**
 * Created by xuanjinliang on 2018/12/13.
 */

import {Container, Sprite, loader, Rectangle, tweenManager, tween} from "pixi.js";
import Sheep from "./sheep";

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

  addSheep(name, energy) {
    let sheep = new Sheep(this.containerW, this.containerH, energy);

    let con = sheep.init(name);

    //con.y = sheep.sheepMaxHeight;
    //con.y = 83;

    this.container.addChildAt(con, 0);

    setTimeout(sheep.runFlash.bind(sheep), 1000);

    /*if(name.indexOf('b') > -1){
      this.trackBArray.push(sheep);
    }else{
      this.trackWArray.push(sheep);
    }*/
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

  init() {
    this.runTrack = new Sprite(loader.resources['track'].texture);

    this.runTrack.scale.set(this.containerW / this.runTrack.width, this.containerH / this.runTrack.height);

    this.runTrack.alpha = 0;

    this.container.name = this.name;
    this.container.addChild(this.runTrack);

    this.addSheep('b2', 60);
    this.addSheep('w2', 60);

    this.container.hitArea = new Rectangle(0, 0, this.runTrack.width, this.runTrack.height);

    return this.container;
  }
}

export default EachTrack;
