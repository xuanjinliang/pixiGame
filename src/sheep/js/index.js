/**
 * Created by xuanjinliang on 2018/12/07.
 */

//import Stats from 'stats-js';
import * as PIXI from 'pixi.js';
import 'pixi-tween';
import '../../common/style/common.less';
import loadJson from '../json/load.json';
import progressBarJson from "../json/progressBar.json";
import sheepJson from "../json/sheep.json";
import sleepJson from "../json/sleep.json";
import howler from 'howler';
import bgSound from "../sound/bg.mp3";

import {loadSheet} from 'common';
import config from './config';
import resource from './resource';
import GameBg from './gameBg';
import Content from "./content";
import Success from "./success";
import Fail from "./Fail";

/*let stats = new Stats();
stats.showPanel(0);*/

class Index {
  constructor(){
    this.loadComplete = false;
    this.container = null;
    this.gameBg = new GameBg();
    this.success = new Success();
    this.fail = new Fail();
    this.result = false;
  }

  setContainer(){
    this.container = new PIXI.Container();

    config.content = new Content();

    this.container.addChild(config.content.setContentRect(), this.gameBg.setDownload());

    config.stage.addChild(this.gameBg.setBg(), this.container, this.gameBg.setShade(config.stageW, config.stageH), this.success.init(), this.fail.init());

    this.container.pivot.set(config.containerW / 2, config.containerH / 2);

    this.setContainerLocation();
  }

  removeGame(){
    this.result = false;
    this.gameBg = new GameBg();
    this.success = new Success();
    this.fail = new Fail();
    this.container.removeChildren(0);
    config.stage.removeChildren(0);
  }

  handleFileLoad(){
    let that = this;
    //先加载所有图片
    PIXI.loader.add(resource.mainfest)
      /*.on("progress", (loader, resource) => {
        console.log(resource);
        console.log(loader);
      })*/
      .load(() => {
        //console.log(loader, resources);
        //再加载当前游戏所需要的雪碧json
        Promise.all([
          loadSheet('load', loadJson),
          loadSheet('progressBar', progressBarJson),
          loadSheet('sheep', sheepJson),
          loadSheet('sleep', sleepJson)
        ]).then((result) => {
          result.forEach((o) => {
            config.sheet[o.name] = o;
          });
          that.loadLoadingComplete();
        });
      });
  }

  loadLoadingComplete() {
    this.loadComplete = true;
    this.setContainer();

    this.success.tryFun = this.fail.tryFun = () => {
      this.removeGame();
      this.setContainer();
      //createjsSet();
    };
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

    this.gameBg.resizeBg();
    this.gameBg.resizeShade(config.stageW, config.stageH);
    this.success.resize();
    this.fail.resize();
  }

  stageBreakHandler() {
    //stats.begin();
    if(!this.result && config.content && config.content.topBar && config.content.topBar.progressBar.remain <= 0){
      this.gameBg.shade.visible = true;
      this.success.container.visible = true;
      this.result = true;
    }

    if(!this.result && config.content && config.content.footBar && config.content.footBar.remain <= 0){
      this.gameBg.shade.visible = true;
      this.fail.container.visible = true;
      this.result = true;
    }

    if(!this.result){
      if(config.content && config.content.track){
        //更新赛道每只羊的运行
        config.content.track.runEachTrack.call(config.content.track);
      }
    }else if(config.content.track.addBsheepTimeout){
      clearTimeout(config.content.track.addBsheepTimeout);
      config.content.track.addBsheepTimeout = null;
    }

    PIXI.tweenManager.update();
    //stats.end();
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

    config.sound = new howler.Howl({
      src: bgSound,
      loop: true
    });
    config.sound.play();

    config.app.ticker.add(this.stageBreakHandler, this);
    //document.body.appendChild( stats.dom );
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






