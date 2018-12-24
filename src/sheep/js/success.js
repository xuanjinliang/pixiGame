/**
 * Created by xuanjinliang on 2018/12/20.
 */

import {Container, Sprite, loader, tweenManager, tween} from "pixi.js";
import config from "./config";
import {fbClick} from "common";

class Success{
  constructor(){
    this.container = new Container();
    this.win = null;
    this.continue = null;
    this.tryFun = null;
  }

  resize() {
    if(this.win){
      this.win.x = config.stageW / 2;
      this.win.y = config.stageH / 2 - 150;
    }

    if(this.continue){
      this.continue.x = config.stageW / 2;
      this.continue.y = config.stageH - this.continue.height * 2;
    }
  }

  init() {
    this.win = new Sprite(loader.resources['win'].texture);
    this.win.pivot.set(this.win.width / 2, this.win.height / 2);

    this.continue = new Sprite(loader.resources['continueImg'].texture);
    this.continue.pivot.set(this.continue.width / 2, this.continue.height / 2);

    const continueTween = tweenManager.createTween(this.continue);
    continueTween.loop = true;
    continueTween.pingPong = true;
    continueTween.time = 600;
    continueTween.easing = tween.Easing.linear();
    continueTween.from({
      scale: {x: 1, y: 1}
    }).to({
      scale: {x: 0.8, y: 0.8}
    }).start();

    this.continue.interactive = true;
    this.continue.on('pointertap', (event) => {
      event.stopPropagation();
      fbClick(this.tryFun);
    });

    this.resize();

    this.container.addChild(this.win, this.continue);
    this.container.visible = false;

    return this.container;
  }
}

export default Success;
