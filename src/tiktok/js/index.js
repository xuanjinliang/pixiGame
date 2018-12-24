/**
 * Created by xuanjinliang on 2018/12/21.
 */

import '../../common/style/common.less';
import {utils, Application, loader, Container, Sprite, tweenManager} from "pixi.js";
import 'pixi-tween';
import {fbClick, loadSheet} from "common";
import config from "./config";
import resource from "./resource";
import Content from "./content";
import GameBg from "./gameBg";
import videoJson from "../json/video";

class Index{
  constructor() {
    this.loadComplete = false;
    this.container = null;
    this.containerW = config.containerW;
    this.containerH = config.containerH;
    this.gameBg = new GameBg();
  }

  setContainer() {
    this.container = new Container();

    this.setContainerLocation();

    config.content = new Content();

    let title = new Sprite(loader.resources['title'].texture);

    title.pivot.x = title.width / 2;
    title.x = this.containerW / 2;
    title.y = -25;

    title.interactive = true;
    title.on('pointertap', (event) => {
      event.stopPropagation();
      fbClick();
    });

    this.container.addChild(config.content.init(), title);

    config.stage.addChild(this.gameBg.setBg(), this.container);
  }

  setContainerLocation(){
    this.container.pivot.set(this.containerW / 2, this.containerH / 2);
    this.container.x = config.canvasW / 2;
    this.container.y = config.canvasH / 2;
    this.container.scale.set(config.containerScaleY);

    this.gameBg.resizeBg();
  }

  stageBreakHandler() {
    tweenManager.update();
  }

  resizeCanvas() {
    if(config.canvasW != document.documentElement.clientWidth || config.canvasH != document.documentElement.clientHeight){
      config.canvasW = document.documentElement.clientWidth;
      config.canvasH = document.documentElement.clientHeight;

      config.containerScaleY = config.canvasH / config.defaultH;
      config.WHRadio = config.canvasW / config.canvasH;

      config.app.renderer.resize(config.canvasW, config.canvasH);

      config.app.view.style = `width:${config.canvasW}px;height:${config.canvasH}px;`;

      if(this.loadComplete){
        this.setContainerLocation();
      }
    }
  }

  loadLoadingComplete() {
    this.loadComplete = true;
    this.setContainer();
  }

  handleFileLoad() {
    let that = this;
    //先加载所有图片
    loader.add(resource.mainfest)
      .load(() => {
        Promise.all([
          loadSheet('video', videoJson)
        ]).then((result) => {
          result.forEach((o) => {
            config.sheet[o.name] = o;
          });
          that.loadLoadingComplete();
        });
      });
  }

  addCanvas(){
    config.app = new Application({
      antialias: true,
      backgroundColor: "0x000000"
    });
    config.app.renderer.autoResize = true;
    config.stage = config.app.stage;

    document.querySelector('#main').appendChild(config.app.view);
    this.resizeCanvas();
    this.handleFileLoad();

    config.app.ticker.add(this.stageBreakHandler.bind(this));
  }

  event(){
    window.addEventListener('DOMContentLoaded', this.addCanvas.bind(this));
    window.addEventListener('resize', this.resizeCanvas.bind(this));
  }

  init(){
    let type = "WebGL";
    if(!utils.isWebGLSupported()){
      type = "canvas";
    }

    utils.sayHello(type);
    this.event();
  }
}

const index = new Index();
index.init();
