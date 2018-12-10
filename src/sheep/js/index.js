/**
 * Created by xuanjinliang on 2018/12/07.
 */

import * as PIXI from 'pixi.js';
import '../../common/style/common.less';

import config from './config';
import resource from './resource';

class Index {
  constructor(){

  }

  handleFileLoad(){
    console.log(resource.mainfest);
    PIXI.loader.add(resource.mainfest)
      .on("progress", (loader, resource) => {
        console.log("loading: " + resource.url);
        console.log("progress: " + loader.progress + "%");
      })
      .load(() => {
        console.log("All files loaded");
      });
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






