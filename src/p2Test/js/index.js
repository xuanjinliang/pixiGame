/**
 * Created by xuanjinliang on 2018/12/28.
 */

import '../../common/style/common.less';
import {Application, Container, tweenManager} from "pixi.js";
import 'pixi-tween';
import p2 from 'p2';
import config from "./config";

class Index{
  constructor() {
    this.loadComplete = false;
    this.container = null;
    this.world = new p2.World({
      gravity:[0, -9.81]
    });
  }

  setContainer(){
    this.container = new Container();

    //this.container.addChild();

    config.stage.addChild(this.container);

    this.container.pivot.set(config.containerW / 2, config.containerH / 2);
    this.setContainerLocation();
  }

  loadLoadingComplete() {
    this.loadComplete = true;
    this.setContainer();
  }

  setContainerLocation() {
    if(config.canvasW / config.canvasH > config.WHRadio){
      config.containerRadio = config.stageH / config.containerH;
    }else{
      config.containerRadio = config.stageW / config.containerW;
    }

    this.container.x = config.stageW / 2;
    this.container.y = config.stageH / 2;

    this.container.scale.set(config.containerRadio);
  }

  stageBreakHandler() {
    tweenManager.update();
  }

  resizeCanvas(){
    if(config.canvasW != document.documentElement.clientWidth || config.canvasH != document.documentElement.clientHeight){
      config.canvasW = document.documentElement.clientWidth;
      config.canvasH = document.documentElement.clientHeight;

      //计算canvas放大的倍数，才到750
      config.stageScaleX = config.defaultW / config.canvasW;

      config.stageW = config.defaultW;
      config.stageH = parseInt(config.stageScaleX * config.canvasH);

      config.app.renderer.resize(config.stageW, config.stageH);

      config.app.view.style = `width:${config.canvasW}px;height:${config.canvasH}px;`;

      if(this.loadComplete){
        this.setContainerLocation();
      }
    }
  }

  addCanvas(){
    config.app = new Application({
      antialias: true,
      backgroundColor: "0xffffff"
    });
    config.app.renderer.autoResize = true;
    config.stage = config.app.stage;

    document.querySelector('#main').appendChild(config.app.view);
    this.resizeCanvas();
    this.loadLoadingComplete();

    config.app.ticker.add(this.stageBreakHandler.bind(this));
  }

  init() {
    window.addEventListener('DOMContentLoaded', this.addCanvas.bind(this));
    window.addEventListener('resize', this.resizeCanvas.bind(this));
  }
}

const index = new Index();
index.init();
