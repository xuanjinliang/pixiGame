/**
 * Created by xuanjinliang on 2018/12/28.
 */

import '../../common/style/common.less';
import {Application, Container, Graphics, tweenManager} from "pixi.js";
import 'pixi-tween';
import p2 from 'p2';
import config from "config";

class Index{
  constructor() {
    this.loadComplete = false;
    this.container = new Container();
    this.world = new p2.World({
      gravity:[0, -9.81]
    });
    this.rectangleBody = null;
    this.rectShape = null;
    this.maxSubSteps = 10;
    this.fixedTimeStep = 1 / 60;
    this.lastTimeSeconds = null;
    this.mouseBody = null;
    this.mouseConstraint = null;
  }

  addRectangle() {
    let rectW = 120,
      rectH = 60,
      rectL = 50 + rectW / 2,
      rectT = 20 + rectH / 2;

    let rectangleShape = new p2.Box({
      width: rectW,
      height: rectH
    });

    this.rectangleBody = new p2.Body({
      mass: 5,
      position: [rectL, config.containerH - rectT],
      angularAcceleration: 0.1
    });

    this.rectangleBody.addShape(rectangleShape);
    this.world.addBody(this.rectangleBody);

    let rectShape = new Graphics();
    rectShape.lineStyle(1, '0x000000', 1, 0).beginFill('0xffffff').drawRect(0, 0, rectW, rectH).closePath();
    rectShape.pivot.set(rectW / 2, rectH / 2);

    rectShape.x = rectL;
    rectShape.y = rectT;

    this.rectShape = rectShape;
    this.container.addChild(this.rectShape);

    this.mouseBody = new p2.Body();
    this.world.addBody(this.mouseBody);
  }

  setWall() {
    //天花板
    let floor = new p2.Body({
      angle: Math.PI,
      position: [0, config.containerH]
    });

    //右墙
    let rightWall = new p2.Body({
      angle: Math.PI / 2,
      position: [config.containerW, 0]
    });

    //地面
    let ceiling = new p2.Body({
      position: [0, 0]
    });

    //左墙
    let leftWall = new p2.Body({
      angle: -Math.PI / 2,
      position: [0, 0]
    });

    floor.addShape(new p2.Plane());
    ceiling.addShape(new p2.Plane());
    rightWall.addShape(new p2.Plane());
    leftWall.addShape(new p2.Plane());

    this.world.addBody(floor);
    this.world.addBody(rightWall);
    this.world.addBody(ceiling);
    this.world.addBody(leftWall);
  }

  getPhysicsCoord(event) {
    let x = event.x,
      y = event.y;

    y = config.containerH - y;

    return [x, y];
  }

  event() {
    let that = this,
      startLocalPoint = null;

    that.rectShape.interactive = true;

    /** @this Foo */
    function onDragEnd(){
      event.stopPropagation();
      that.world.removeConstraint(that.mouseConstraint);
      that.mouseConstraint = null;
      this.off('pointermove', onDragMove);
    }

    /** @this Foo */
    function onDragMove(event){
      event.stopPropagation();
      let newPosition = that.getPhysicsCoord(this.data.getLocalPosition(this.parent));
      that.mouseBody.position[0] = newPosition[0];
      that.mouseBody.position[1] = newPosition[1];
    }

    /** @this Foo */
    function onDragDown(event){
      event.stopPropagation();
      this.data = event.data;
      startLocalPoint = this.data.getLocalPosition(this.parent);
      let position = that.getPhysicsCoord(startLocalPoint);
      let hitBodies = that.world.hitTest(position, [that.rectangleBody]);

      if(hitBodies.length){
        that.mouseBody.position[0] = position[0];
        that.mouseBody.position[1] = position[1];

        that.mouseConstraint = new p2.RevoluteConstraint(that.mouseBody, that.rectangleBody, {
          worldPivot: position,
          collideConnected: false
        });

        that.world.addConstraint(that.mouseConstraint);
        this.on('pointermove', onDragMove);
      }
    }

    that.rectShape.on('pointerdown', onDragDown);
    that.rectShape.on('pointerup', onDragEnd);
    that.rectShape.on('pointercancel', onDragEnd);
    that.rectShape.on('pointerupoutside', onDragEnd);
  }

  run(){
    //console.log(this.rectangleBody.interpolatedPosition);
    this.rectShape.x = this.rectangleBody.interpolatedPosition[0];
    this.rectShape.y = config.containerH - this.rectangleBody.interpolatedPosition[1];
    this.rectShape.rotation = -this.rectangleBody.angle;
  }

  setContainer(){
    let shape = new Graphics();
    shape.lineStyle(1, '0x000000', 1, 0).beginFill('0xffffff').drawRect(0, 0, config.containerW, config.containerH).closePath();

    this.container.addChild(shape);

    config.stage.addChild(this.container);

    this.container.pivot.set(config.containerW / 2, config.containerH / 2);
    this.setContainerLocation();
  }

  loadLoadingComplete() {
    this.loadComplete = true;
    this.setContainer();

    this.addRectangle();
    this.setWall();
    this.event();
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
    let timeSeconds = config.app.ticker.lastTime / 1000;
    this.lastTimeSeconds = this.lastTimeSeconds || timeSeconds;
    let timeSinceLastCall = timeSeconds - this.lastTimeSeconds;
    if(this.world && this.world.step){
      this.world.step(this.fixedTimeStep, timeSinceLastCall, this.maxSubSteps);
    }
    this.run();
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

    config.app.ticker.add(this.stageBreakHandler, this);
  }

  init() {
    window.addEventListener('DOMContentLoaded', this.addCanvas.bind(this));
    window.addEventListener('resize', this.resizeCanvas.bind(this));
  }
}

const index = new Index();
index.init();
