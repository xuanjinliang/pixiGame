/**
 * Created by xuanjinliang on 2018/12/07.
 */

import * as PIXI from 'pixi.js';
import 'pixi-tween';
import '../../common/style/common.less';

import config from './config';
import resource from './resource';
import GameBg from './gameBg';
import Content from "./content";

class Index {
  constructor(){
    this.loadComplete = false;
    this.container = null;
    this.gameBg = new GameBg();
    this.content = null;
  }

  setContainer(){
    this.container = new PIXI.Container();

    this.container.width = config.containerW;
    this.container.height = config.containerH;

    this.setContainerLocation();

    this.content = new Content();

    this.container.addChild(this.content.setContentRect());

    /*const tween = PIXI.tweenManager.createTween(this.gameBg.setBg());
    tween.from({ x: 0 }).to({ x: 250 });
    tween.time = 1000;
    tween.repeat = 10;
    tween.on('start', () => {
      console.log('tween started');
    });
    tween.on('repeat', ( loopCount ) => {
      console.log(`loopCount:${loopCount}`);
    });
    tween.start();*/

    config.stage.addChild(this.gameBg.setBg(), this.container, this.gameBg.setShade(config.stageW, config.stageH));
  }

  handleFileLoad(){
    let that = this;
    PIXI.loader.add(resource.mainfest)
      /*.on("progress", (loader, resource) => {
        console.log(resource);
        console.log(loader);
      })*/
      .load(() => {
        //console.log(loader, resources);
        that.loadLoadingComplete();
      });
  }

  loadLoadingComplete() {
    this.loadComplete = true;
    this.setContainer();
  }

  setContainerLocation() {
    if(config.canvasW / config.canvasH > config.WHRadio){
      config.containerRadio = config.stageH / config.containerH;
      this.container.x = (config.stageW - config.containerW * config.containerRadio) / 2;
    }else{
      config.containerRadio = config.stageW / config.containerW;
      this.container.x = 0;
    }
    this.container.y = (config.stageH - config.containerH * config.containerRadio) / 2;
    this.container.scale.set(config.containerRadio);

    this.gameBg.resizeBg();
    this.gameBg.resizeShade(config.stageW, config.stageH);
    /*config.success.resize();
    config.fail.resize();*/
  }

  stageBreakHandler() {
    PIXI.tweenManager.update();
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
    config.app = new PIXI.Application({
      antialias: true,
      backgroundColor: "0x82c845"
    });
    config.app.renderer.autoResize = true;
    config.stage = config.app.stage;

    document.querySelector('#main').appendChild(config.app.view);
    this.resizeCanvas();
    this.handleFileLoad();

    /*config.stage.interactive = true;
    config.stage.buttonMode = true;
    config.stage.on('click', function(event){
      console.log(321, event);
    });*/

    config.app.ticker.add(this.stageBreakHandler.bind(this));
  }

  event(){
    window.addEventListener('DOMContentLoaded', this.addCanvas.bind(this));
    window.addEventListener('resize', this.resizeCanvas.bind(this));
  }

  init(){
    let type = "WebGL";
    if(!PIXI.utils.isWebGLSupported()){
      type = "canvas";
    }

    PIXI.utils.sayHello(type);
    this.event();

  }
}

const index = new Index();
index.init();






