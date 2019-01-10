/**
 * Created by xuanjinliang on 2018/12/21.
 */

import _ from "lodash";
import {Container, loader, Sprite, Graphics, extras, tweenManager, tween, Point} from "pixi.js";
import config from "./config";
import Sound from "./Sound";
import {angleToRadians, hitTestGloable, fbClick} from "common";

class Content{
  constructor() {
    this.containerW = config.containerW;
    this.containerH = config.containerH;
    this.container = new Container();
    this.iconContainer = new Container();
    this.sound = new Sound();
    this.head = null;
    this.hand = null;
    this.arrow = null;
    this.moveIconArray = [];
    this.moveContainer = new Container();
    this.videoAnimate = null;
    this.currentVideoName = null;
    this.recordVideo = [];
    this.eventControl = false;
    this.download = null;
    this.tiktokCon = null;
    this.videoWinCon = null;
  }

  video(name = 'video_1') {
    if(this.videoWinCon && this.videoAnimate){
      this.videoAnimate.stop();
      this.videoWinCon.removeChild(this.videoAnimate);
    }

    this.changeHead(parseInt(name.split('_')[1]));
    this.sound.play(name);
    this.currentVideoName = name;

    let animateName = name;
    let videoAnimate = new extras.AnimatedSprite(config.sheet.video.animations[animateName]);
    videoAnimate.playNum = 0;
    videoAnimate.scale.set(210 / videoAnimate.width, 372 / videoAnimate.height);

    videoAnimate.loop = true;
    videoAnimate.animationSpeed = 0.1;

    this.videoWinCon.addChild(videoAnimate);

    videoAnimate.onLoop = () => {
      if(this.recordVideo.indexOf(animateName) == -1){
        this.recordVideo.push(animateName);
      }
      if(this.eventControl == false){
        if(videoAnimate.playNum > 0){
          this.moveAnim();
        }else{
          videoAnimate.playNum += 1;
        }
      }
    };

    videoAnimate.play();

    this.videoAnimate = videoAnimate;
  }

  videoWin() {
    this.videoWinCon = new Container();

    let mask = new Graphics();
    mask.beginFill().drawRect(0, 0, 210, 372).closePath();

    this.video('video_1');

    this.videoWinCon.addChild(mask);
    this.videoWinCon.mask = mask;

    return this.videoWinCon;
  }

  resetMove() {
    this.moveIconArray.forEach((move, index) => {

      move.scale.set(70 / move.texture.baseTexture.width);
      move.anchor.x = 0.5;
      move.y = 10;
      move.alpha = 1;

      switch(index){
        case 0:
          move.x = move.width - 10;
          break;
        case 1:
          move.scale.set(90 / move.texture.baseTexture.width);
          move.x = config.containerW / 2;
          move.y = 0;
          break;
        case 2:
          move.x = config.containerW - move.width + 10;
          break;
      }
    });
  }

  moveIcon() {
    this.moveContainer = new Container();

    for(let i = 1; i < 4; i++){
      let move = new Sprite(loader.resources[`move${i}`].texture);
      move.name = `video_${i}`;
      this.moveIconArray.push(move);
      this.moveContainer.addChild(move);
      this.event(move);
    }

    this.resetMove();

    let smiling = new Sprite(loader.resources['smiling'].texture);

    smiling.scale.set(40 / smiling.width);
    smiling.anchor.set(0.5, 0.5);
    smiling.x = 40;
    smiling.y = 82;
    smiling.rotation = 0;

    const smilingTween = tweenManager.createTween(smiling);
    smilingTween.loop = true;
    smilingTween.pingPong = true;
    smilingTween.time = 500;
    smilingTween.easing = tween.Easing.linear();
    smilingTween.from({
      rotation: 0
    }).to({
      rotation: angleToRadians(-40)
    }).start();

    let play = new Sprite(loader.resources['play'].texture);

    play.scale.set(30 / play.width);
    play.anchor.set(0.5, 0.5);
    play.x = this.containerW - 40;
    play.y = 90;

    const playTween = tweenManager.createTween(play);
    playTween.loop = true;
    playTween.pingPong = true;
    playTween.time = 500;
    playTween.easing = tween.Easing.linear();
    playTween.from({
      rotation: 0
    }).to({
      rotation: angleToRadians(-40)
    }).start();

    let arrow = new Sprite(loader.resources['arrow'].texture);

    arrow.scale.set(40 / arrow.width);
    arrow.anchor.x = 0.5;
    arrow.x = this.containerW / 2;
    arrow.y = -40;

    const arrowTween = tweenManager.createTween(arrow);
    arrowTween.loop = true;
    arrowTween.pingPong = true;
    arrowTween.time = 500;
    arrowTween.easing = tween.Easing.linear();
    arrowTween.from({
      y: -40
    }).to({
      y: -60
    }).start();

    let hand = new Sprite(loader.resources['hand'].texture);

    hand.scale.set(50 / hand.width);
    hand.anchor.x = 0.5;
    hand.x = (this.containerW + hand.width) / 2;
    hand.y = 60;

    const handTween = tweenManager.createTween(hand);
    handTween.loop = true;
    handTween.pingPong = true;
    handTween.time = 2000;
    handTween.easing = tween.Easing.linear();
    handTween.from({
      y: 60
    }).to({
      y: -60
    }).start();

    this.hand = hand;
    this.arrow = arrow;

    this.moveContainer.addChild(smiling, play, arrow, hand);

    return this.moveContainer;
  }

  tiktokAnim() {
    const tiktokTween = tweenManager.createTween(this.tiktokCon);
    tiktokTween.time = 500;
    tiktokTween.easing = tween.Easing.outBounce();
    tiktokTween.from({
      scale: {
        x: 0,
        y: 0
      }
    }).to({
      scale: {
        x: 230 / this.tiktokCon.texture.baseTexture.width,
        y: 230 / this.tiktokCon.texture.baseTexture.width
      }
    }).start();
  }

  tiktok() {
    let tiktok = new Sprite(loader.resources['tiktok'].texture);

    tiktok.scale = 0;
    tiktok.anchor.set(0.5, 0.5);

    return tiktok;
  }

  downloadAnim() {
    let scale = this.download.scale;
    this.download.y = this.containerH / 1.2;

    const downloadTween = tweenManager.createTween(this.download);
    downloadTween.loop = true;
    downloadTween.pingPong = true;
    downloadTween.time = 500;
    downloadTween.easing = tween.Easing.linear();
    downloadTween.from({
      scale: {
        x: scale.x,
        y: scale.y
      }
    }).to({
      scale: {
        x: 260 / this.download.texture.baseTexture.width,
        y: 260 / this.download.texture.baseTexture.width
      }
    }).start();
  }

  endCard() {
    this.container.removeChildren(0);
    this.tiktokAnim();
    this.downloadAnim();
    this.container.addChild(this.download, this.tiktokCon);
  }

  changeHead(num) {
    if(!_.isNumber(num)){
      return;
    }

    if(this.head){
      this.iconContainer.removeChild(this.head);
    }

    this.head = new Sprite(loader.resources[`head${num}`].texture);

    this.iconContainer.addChild(this.head);
  }

  icon() {
    this.iconContainer = new Container();

    this.changeHead(1);

    let heart = new Sprite(loader.resources['heart'].texture);
    heart.anchor.set(0.5, 0.5);
    heart.x = (53 - heart.width) / 2 + heart.width / 2;
    heart.y = 70 + heart.height / 2;

    let msg = new Sprite(loader.resources['msg'].texture);
    msg.anchor.set(0.5, 0.5);
    msg.x = (53 - msg.width) / 2 + msg.width / 2;
    msg.y = 120 + msg.height / 2;

    let transmit = new Sprite(loader.resources['transmit'].texture);
    transmit.anchor.set(0.5, 0.5);
    transmit.x = (53 - transmit.width) / 2 + transmit.width / 2;
    transmit.y = 170 + transmit.height / 2;

    this.iconContainer.addChild(heart, msg, transmit);

    const iconTween = tweenManager.createTween(heart);
    iconTween.loop = true;
    iconTween.pingPong = true;
    iconTween.time = 500;
    iconTween.easing = tween.Easing.linear();
    iconTween.from({
      scale: {x: 1, y: 1}
    }).to({
      scale: {x: 1.2, y: 1.2}
    }).start();

    this.iconContainer.interactive = true;
    this.iconContainer.on('pointertap', (event) => {
      event.stopPropagation();
      this.endCard();
    });

    return this.iconContainer;
  }

  moveAnim() {
    let that = this;
    let newMove = new Sprite(that.moveIconArray[0].texture);

    newMove.name = that.moveIconArray[0].name;
    newMove.scale.set(60 / newMove.width);
    newMove.anchor.x = 0.5;
    newMove.x = config.containerW - newMove.width + 10;
    newMove.y = 15;
    newMove.alpha = 0;

    that.moveIconArray.push(newMove);
    that.moveContainer.addChildAt(newMove, 3);
    this.event(newMove);

    for(let i = 0, l = this.moveIconArray.length; i < l; i++) {
      let move = this.moveIconArray[i];

      let fromObj = {
          scale: {
            x: move.scale.x,
            y: move.scale.y
          },
          y: move.y,
          x: move.x,
          alpha: move.alpha
        },
        toObj = {};

      switch (i) {
        case 0:
          toObj = {
            scale: {x: 60 / move.texture.baseTexture.width, y: 60 / move.texture.baseTexture.width},
            y: 15,
            alpha: 0
          };
          break;
        case 1:
          toObj = {
            scale: {x: 70 / move.texture.baseTexture.width, y: 70 / move.texture.baseTexture.width},
            x: 70 - 10,
            y: 10
          };
          that.video(move.name);
          break;
        case 2:
          toObj = {
            scale: {x: 90 / move.texture.baseTexture.width, y: 90 / move.texture.baseTexture.width},
            x: config.containerW / 2,
            y: 0
          };
          break;
        case 3:
          toObj = {
            scale: {x: 70 / move.texture.baseTexture.width, y: 70 / move.texture.baseTexture.width},
            x: config.containerW - 70 + 10,
            y: 10,
            alpha: 1
          };
          break;
      }

      const moveTween = tweenManager.createTween(move);
      moveTween.time = 300;
      moveTween.easing = tween.Easing.linear();
      moveTween.from(fromObj).to(toObj).on('end', () => {
        if(move.alpha == 0){
          that.moveContainer.removeChild(move);
          that.moveIconArray.shift();
        }
      }).start();
    }
  }

  event(ele) {
    let that = this,
      isMove = false,
      dragging = false,
      startPoint = null,
      startLocalPoint = null;

    ele.interactive = true;

    function DragMove(event) {
      event.stopPropagation();
      if(dragging){
        let newPosition = this.data.getLocalPosition(this.parent);
        this.x = startPoint.x + (newPosition.x - startLocalPoint.x);
        this.y = startPoint.y + (newPosition.y - startLocalPoint.y);
        isMove = true;
      }
    }

    function DragEnd(event){
      event.stopPropagation();
      that.eventControl = false;

      if(that.recordVideo.length == that.moveIconArray.length){
        that.endCard();
        return;
      }

      let newPoint = new Point(this.getGlobalPosition().x, this.getGlobalPosition().y + this.getBounds().height / 2);

      if(isMove == false || (hitTestGloable(newPoint, that.videoWinCon) && this.name != that.currentVideoName)){
        that.video(this.name);

        let index = that.moveIconArray.indexOf(this);
        let array = that.moveIconArray.slice(index, that.moveIconArray.length),
          array1 = that.moveIconArray.slice(0, index);
        that.moveIconArray = array.concat(array1);
      }

      that.moveContainer.setChildIndex(this, 0);
      that.resetMove();

      this.off("pointermove", DragMove);
    }

    function DragDown(event){
      event.stopPropagation();
      that.eventControl = true;
      this.data = event.data;
      startPoint = {x: this.x, y: this.y};
      startLocalPoint = this.data.getLocalPosition(this.parent);
      that.moveContainer.removeChild(that.hand);
      that.moveContainer.removeChild(that.arrow);
      that.moveContainer.setChildIndex(this, that.moveContainer.children.length - 1);
      dragging = true;
      isMove = false;

      this.on("pointermove", DragMove);
    }

    ele.on('pointerdown', DragDown);
    //ele.on("pointermove", DragMove);
    ele.on("pointerup", DragEnd);
    ele.on("pointerupoutside", DragEnd);
  }

  init() {
    let phone = new Sprite(loader.resources['phone'].texture);

    let decorate1 = new Sprite(loader.resources['decorate'].texture);
    let decorate2 = new Sprite(loader.resources['decorate'].texture);

    decorate1.x = this.containerW - decorate1.width - 6;
    decorate1.y = this.containerH / 5.8;

    decorate2.x = 12;
    decorate2.y = this.containerH / 2;

    let iconCon = this.icon();

    iconCon.x = this.containerW - 110;
    iconCon.y = 180;

    let videoWin = this.videoWin();
    videoWin.x = 52;
    videoWin.y = 94;

    let moveIconCon = this.moveIcon();

    moveIconCon.y = this.containerH - 140;

    this.download = new Sprite(loader.resources['download'].texture);
    this.download.pivot.x = this.download.width / 2;
    this.download.y = this.containerH - 68;
    this.download.x = this.containerW / 2;

    this.download.interactive = true;
    this.download.on('pointertap', fbClick);

    this.tiktokCon = this.tiktok();

    this.tiktokCon.x = this.containerW / 2;
    this.tiktokCon.y = this.containerH / 2;

    this.container.addChild(phone, videoWin, decorate1, decorate2, iconCon, this.download, moveIconCon);
    //this.moveAnim();

    return this.container;
  }
}

export default Content;
