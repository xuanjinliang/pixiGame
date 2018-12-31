/**
 * Created by xuanjinliang on 2018/12/31.
 */

import Stats from 'stats-js';
import '../../common/style/common.less';
import {Application, Container, loader, Graphics, spine} from "pixi.js";
import "pixi-spine";
import config from "config";
import resource from "./resource";

import DragonJson from '../json/Dragon.json';
import DragonAtlas from '../atlas/Dragon.atlas';

let stats = new Stats();
stats.showPanel(0);

class Index{
  constructor() {
    this.loadComplete = false;
    this.container = new Container();
    this.AnimateBool = true;
  }

  boneTest() {
    let spineAtlas = new spine.core.TextureAtlas(DragonAtlas, function(line, callback) {
      //console.log('line-->', line);
      //callback(BaseTexture.fromImage(line));
      callback(loader.resources['Dragon'].texture.baseTexture);
    });
    let spineAtlasLoader = new spine.core.AtlasAttachmentLoader(spineAtlas);
    let spineJsonParser = new spine.core.SkeletonJson(spineAtlasLoader);

    // in case if you want everything scaled up two times
    spineJsonParser.scale = 0.4;
    //console.log(spineJsonParser);

    let spineData = spineJsonParser.readSkeletonData(DragonJson),
      dragon = new spine.Spine(spineData);

    dragon.pivot.set(dragon.width / 2, dragon.height / 2);
    let localRect = dragon.getLocalBounds();
    dragon.position.set(-localRect.x + config.containerW / 2, -localRect.y + config.containerH / 2);
    dragon.state.setAnimation(0, 'stand', true);

    this.container.addChild(dragon);

    this.container.interactive = true;

    this.container.on('pointertap', () => {
      let str = this.AnimateBool ? 'walk' : 'stand';
      this.AnimateBool = !this.AnimateBool;
      dragon.state.setAnimation(0, str, true);
    });
  }

  setContainer(){
    let shape = new Graphics();
    shape.lineStyle(1, '0x000000', 1, 0).beginFill('0xffffff').drawRect(0, 0, config.containerW, config.containerH).closePath();

    this.container.addChild(shape);

    config.stage.addChild(this.container);

    this.container.pivot.set(config.containerW / 2, config.containerH / 2);
    this.setContainerLocation();
  }

  handleFileLoad(){
    let that = this;
    //先加载所有图片
    loader.add(resource.mainfest)
      .load(() => {
        that.loadLoadingComplete();
      });
  }

  loadLoadingComplete() {
    this.loadComplete = true;
    this.setContainer();

    this.boneTest();
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
    stats.begin();
    stats.end();
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
    this.handleFileLoad();
    //this.loadLoadingComplete();

    config.app.ticker.add(this.stageBreakHandler, this);
    document.body.appendChild( stats.dom );
  }

  init() {
    window.addEventListener('DOMContentLoaded', this.addCanvas.bind(this));
    window.addEventListener('resize', this.resizeCanvas.bind(this));
  }
}

const index = new Index();
index.init();
