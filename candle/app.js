'use strict';

import Adapter from '../lib/adapter';

const CANDLE_SERVICE_UUID = 0xFF02;
const CANDLE_DEVICE_NAME_UUID = 0xFFFF;
const CANDLE_COLOR_UUID = 0xFFFC;
const CANDLE_EFFECT_UUID = 0xFFFB;
const CANDLE_BLOW_NOTIFICATIONS_UUID = 0x2A37;
let r = 255, g = 255, b = 255;

export default class PLAYBULB extends Adapter {
  constructor() {

    const filter = {
      filters:[{
        services:[ CANDLE_SERVICE_UUID ]
      }],
      optionalServices: ['battery_service']};

    let characteristicList = {};
    characteristicList[CANDLE_SERVICE_UUID] = [
      CANDLE_DEVICE_NAME_UUID,
      CANDLE_COLOR_UUID,
      CANDLE_EFFECT_UUID,
      CANDLE_BLOW_NOTIFICATIONS_UUID];
    characteristicList['battery_service'] = ['battery_level'];

    super(filter, characteristicList);

    this.colorChanging = false;
    this._isEffectSet = false;

    document.addEventListener('WebComponentsReady', () => {

      document.querySelector('#noEffect').addEventListener('click', this.changeColor.bind(this));
      document.querySelector('#candleEffect').addEventListener('click', this.changeColor.bind(this));
      document.querySelector('#flashing').addEventListener('click', this.changeColor.bind(this));
      document.querySelector('#pulse').addEventListener('click', this.changeColor.bind(this));
      document.querySelector('#rainbow').addEventListener('click', this.changeColor.bind(this));
      document.querySelector('#rainbowFade').addEventListener('click', this.changeColor.bind(this));

      this.$canvas = document.querySelector('canvas');

      this.img = new Image();
      this.img.src = 'color-wheel.png'
      this.img.onload = () => {
        this.$canvas = document.querySelector('canvas');
        this.context = this.$canvas.getContext('2d');

        this.$canvas.width = 300 * devicePixelRatio;
        this.$canvas.height = 300 * devicePixelRatio;
        this.$canvas.style.width = "300px";
        this.$canvas.style.height = "300px";

        this.$canvas.addEventListener('click', this.draw.bind(this));
        this.$canvas.addEventListener('touchmove', evt => {
          evt.preventDefault();
          this.draw(evt.targetTouches[0]);
        });
        this.context.drawImage(this.img, 0, 0, this.$canvas.width, this.$canvas.height);
      }

      // End of WebComponentsReady Event
    });

    this.on('afterConnect', _ => {
    })

  // End of constructor
  }

  draw(evt) {
    // Refresh canvas in case user zooms and devicePixelRatio changes.
    this.$canvas.width = 300 * devicePixelRatio;
    this.$canvas.height = 300 * devicePixelRatio;
    this.context.drawImage(this.img, 0, 0, this.$canvas.width, this.$canvas.height);

    var rect = this.$canvas.getBoundingClientRect();
    var x = Math.round((evt.clientX - rect.left) * devicePixelRatio);
    var y = Math.round((evt.clientY - rect.top) * devicePixelRatio);
    var data = this.context.getImageData(0, 0, this.$canvas.width, this.$canvas.height).data;

    r = data[((this.$canvas.width * y) + x) * 4];
    g = data[((this.$canvas.width * y) + x) * 4 + 1];
    b = data[((this.$canvas.width * y) + x) * 4 + 2];

    this.changeColor();

    this.context.beginPath();
    this.context.arc(x, y + 2, 10 * devicePixelRatio, 0, 2 * Math.PI, false);
    this.context.shadowColor = '#333';
    this.context.shadowBlur = 4 * devicePixelRatio;
    this.context.fillStyle = 'white';
    this.context.fill();
  };

  changeColor() {
    if (this.colorChanging) {
      return;
    }
    this.colorChanging = true;
    var effect = document.querySelector('[name="effectSwitch"]:checked').id;
    switch(effect) {
      case 'noEffect':
        this.setColor(r, g, b).then(this.onColorChanged.bind(this));
        break;
      case 'candleEffect':
        this.setCandleEffectColor(r, g, b).then(this.onColorChanged.bind(this));
        break;
      case 'flashing':
        this.setFlashingColor(r, g, b).then(this.onColorChanged.bind(this));
        break;
      case 'pulse':
        this.setPulseColor(r, g, b).then(this.onColorChanged.bind(this));
        break;
      case 'rainbow':
        this.setRainbow().then(this.onColorChanged.bind(this));
        break;
      case 'rainbowFade':
        this.setRainbowFade().then(this.onColorChanged.bind(this));
        break;
    }
  }

  onColorChanged(rgb) {
    if (rgb) {
      console.log('Color changed to ' + rgb);
      r = rgb[0];
      g = rgb[1];
      b = rgb[2];
    } else {
      console.log('Color changed');
    }
    this.colorChanging = false;
  }

  /*
   * Candle Service
   */

  setColor(r, g, b) {
    return Promise.resolve()
      .then(_ => {
        if (this._isEffectSet) {
          // Turn off Color Effect first.
          let data = [0x00, r, g, b, 0x05, 0x00, 0x01, 0x00];
          return this.characteristics.get(CANDLE_EFFECT_UUID).writeValue(new Uint8Array(data))
        }
      })
      .then(_ => {
        let data = [0x00, r, g, b];
        return this.characteristics.get(CANDLE_COLOR_UUID).writeValue(new Uint8Array(data))
      })
      .then(_ => [r,g,b]);
  }

  setCandleEffectColor(r, g, b) {
    let data = [0x00, r, g, b, 0x04, 0x00, 0x01, 0x00];
    return this.characteristics.get(CANDLE_EFFECT_UUID).writeValue(new Uint8Array(data))
      .then(_ => {
        this._isEffectSet = true;
        return [r,g,b];
      });
  }
  setFlashingColor(r, g, b) {
    let data = [0x00, r, g, b, 0x00, 0x00, 0x1F, 0x00];
    return this.characteristics.get(CANDLE_EFFECT_UUID).writeValue(new Uint8Array(data))
      .then(_ => {
        this._isEffectSet = true;
        return [r,g,b];
      });
  }
  setPulseColor(r, g, b) {
    let newRed = Math.min(Math.round(r / 64) * 64, 255);
    let newGreen = Math.min(Math.round(g / 64) * 64, 255);
    let newBlue = Math.min(Math.round(b / 64) * 64, 255);
    let data = [0x00, newRed, newGreen, newBlue, 0x01, 0x00, 0x09, 0x00];
    return this.characteristics.get(CANDLE_EFFECT_UUID).writeValue(new Uint8Array(data))
      .then(_ => {
        this._isEffectSet = true;
        return [r,g,b];
      });
  }
  setRainbow() {
    let data = [0x01, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0x00];
    return this.characteristics.get(CANDLE_EFFECT_UUID).writeValue(new Uint8Array(data))
      .then(_ => {
        this._isEffectSet = true;
      });
  }
  setRainbowFade() {
    let data = [0x01, 0x00, 0x00, 0x00, 0x03, 0x00, 0x26, 0x00];
    return this.characteristics.get(CANDLE_EFFECT_UUID).writeValue(new Uint8Array(data))
      .then(_ => {
        this._isEffectSet = true;
      });
  }

}
window.app = new PLAYBULB();

