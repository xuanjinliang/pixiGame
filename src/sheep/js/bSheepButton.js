/**
 * Created by xuanjinliang on 2018/12/18.
 */

import {Container, Sprite, loader} from "pixi.js";

class BSheepButton{
  constructor(){
    this.container = new Container();
    this.containerW = 50;
    this.recordSheep = null;
    this.bSheepArray = [
      {
        imgId: 1,
        name: 'b1',
        energy: 20
      },
      {
        imgId: 2,
        name: 'b2',
        energy: 40
      },
      {
        imgId: 3,
        name: 'b3',
        energy: 60
      }];
  }

  addSheep(index) {
    let bSheep = new Sprite(loader.resources[`bSheep${this.bSheepArray[index].imgId}`].texture);

    let width = 40;

    bSheep.pivot.x = bSheep.width / 2;
    bSheep.pivot.y = bSheep.height / 2;
    bSheep.x = this.container.width / 2;
    bSheep.y = this.container.height / 2;
    bSheep.scale.set(width / bSheep.width);

    if(!this.recordSheep){
      this.recordSheep = bSheep;
    }else{
      this.container.removeChild(this.recordSheep);
    }
    this.container.addChild(bSheep);

    if(this.container.visible == false){
      this.container.visible = true;
    }
  }

  init() {
    let bg = new Sprite(loader.resources['bSheepBg'].texture);

    bg.scale.set(this.containerW / bg.width);

    this.container.addChild(bg);
    this.container.width = this.containerW;
    this.container.height = bg.height;
    this.container.visible = false;

    //this.addSheep(0);
    //this.addSheep(1);
    //this.addSheep(2);
    return this.container;
  }
}

export default BSheepButton;
