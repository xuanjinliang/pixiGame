/**
 * Created by xuanjinliang on 2018/12/24.
 */

import howler from 'howler';
import sound1 from '../Sound/1.mp3';
import sound2 from '../Sound/2.mp3';
import sound3 from '../Sound/3.mp3';

class Sound{
  constructor(){
    this.arraySrc = [sound1, sound2, sound3];
    this.arraySound = [];
    this.init();
  }

  init() {
    this.arraySrc.forEach((src) => {
      let sound = new howler.Howl({
        src: src,
        loop: true,
        autoplay: true
      });

      this.arraySound.push(sound);
    });
  }

  play(name) {
    let num = name.split('_')[1] - 1;
    this.arraySound.forEach((o) => {
      o.stop();
    });

    this.arraySound[num].play();
  }
}

export default Sound;
