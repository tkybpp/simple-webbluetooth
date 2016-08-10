'use strict';

import Adapter from '../lib/adapter';

export default class Dotti extends Adapter {
  constructor() {

    const filter = {
      filters:[{
        namePrefix: 'Dotti',
      }],
      optionalServices: ['0000fff0-0000-1000-8000-00805f9b34fb']};

    let characteristicList = {};
    characteristicList['0000fff0-0000-1000-8000-00805f9b34fb'] = ['0000fff3-0000-1000-8000-00805f9b34fb'];

    super(filter, characteristicList);

    document.addEventListener('WebComponentsReady', () => {
      this.$picker = document.querySelector('#picker');
      this.$pickerButton = document.querySelector('#colorPicker');
      this.$clearButton = document.querySelector('#colorClear');
      this.$activeColorButton = document.querySelector('#color1');
      this.$activeColorButton.style = {};
      this.colorChangeListener = null;
      this.commandQueue = [];
      this.currentColor = {};

      this.writeCharacteristic = null;
      this.$picker.alwaysShowAlpha = false;
      this.$picker.colorValue = 1;
      this.$picker.shape = 'huebox';

      for (let i = 1; i <= 8; i++) {
        for (let j = 1; j <= 8; j++) {
          let button = document.querySelector('#button' + i + '' + j);
          button.style.backgroundColor = "#000000";
          button.addEventListener('click', this.buttonClicked.bind(this));
        }
      }

      for (let i = 1; i <= 6; i++) {
        let button = document.querySelector('#color' + i);
        switch (i) {
          case 1:
            button.style.backgroundColor = "#f00";
            break;
          case 2:
            button.style.backgroundColor = "#0f0";
            break;
          case 3:
            button.style.backgroundColor = "#00f";
            break;
          case 4:
            button.style.backgroundColor = "#ffbe00";
            break;
          case 5:
            button.style.backgroundColor = "#000";
            break;
          default:
            button.style.backgroundColor = "#fff";
        }
        button.addEventListener('click', this.colorClicked.bind(this));
      }

      this.currentColor = this.colorFromRgb(this.$activeColorButton.style.backgroundColor);

      this.$pickerButton.addEventListener('click', event => {
        if (this.colorChangeListener) {
          this.$picker.removeEventListener('color-as-string-changed', this.colorChangeListener);
        }
        this.$picker.set('immediateColor', this.colorFromRgb(this.$activeColorButton.style.backgroundColor));
        this.$picker.addEventListener('color-as-string-changed', this.colorChangeListener = () => {
          this.$activeColorButton.style.backgroundColor = this.colorToHex(this.$picker.color);
          this.currentColor.red = this.$picker.color.red;
          this.currentColor.green = this.$picker.color.green;
          this.currentColor.blue = this.$picker.color.blue;
          this.currentColor.alpha = this.$picker.color.alpha;
        });
        this.$picker.open();
      });

      this.$clearButton.addEventListener('click', event => {
        this.clearPanel();
      });

    // End of WebComponentsReady Event
    });

    this.on('afterConnect', _ => {
      this.writeCharacteristic = this.characteristics.get('0000fff3-0000-1000-8000-00805f9b34fb');
      this.clearPanel();
    })

  // End of constructor
  }

  clearPanel(){
    for (let i=1; i<=8; i++) {
      for(let j=1; j<=8; j++) {
        let button = document.querySelector('#button'+i+''+j);
        button.style.backgroundColor = "#000000";
      }
    }
    this.setPanelColor(0, 0, 0);
  }

  resetOtherPaletteButtons(currentButton) {
    for(let i=1; i<=6; i++) {
      let button = document.querySelector('#color'+i);
      if (button.id != currentButton.id) {
        button.active = false;
      }
    }
  }

  setPanelColor(red, green, blue) {
    console.log('Set panel color');
    let command = 0x0601;
    let cmd = new Uint8Array([(command >> 8) & 0xff, command & 0xff, red, green, blue]);
    this.sendCommand(cmd).then(() => {
        console.log('panel color set.');
      })
      .catch(this.handleError);
  }

  sendCommand(cmd) {
    if (true) { //TODO writeCharacteristic
      // Handle one command at a time
      if (this.busy) {
        // Queue commands
        this.commandQueue.push(cmd);
        return Promise.resolve();
      }
      this.busy = true;
      return this.writeCharacteristic.writeValue(cmd)
        .then(() => {
          this.busy = false;
          // Get next command from queue
          let nextCommand = this.commandQueue.shift();
          if (nextCommand) {
            this.sendCommand(nextCommand);
          }
      });
    } else {
      return Promise.resolve();
    }
  }

  buttonClicked(event) {
    let id = event.target.id;
    this.setLedColor(Number(id.substring(6,7)), Number(id.substring(7,8)), this.currentColor.red, this.currentColor.green, this.currentColor.blue);
    event.target.style.backgroundColor = this.colorToHex(this.currentColor);
  }

  colorClicked(event) {
    this.$activeColorButton = event.target;
    this.resetOtherPaletteButtons(this.$activeColorButton);
    this.currentColor = this.colorFromRgb(this.$activeColorButton.style.backgroundColor);
  }

  colorToHex(value) {
    let hex = '#';
    ['red', 'green', 'blue'].forEach(function(color) {
      let hexComponent = value[color].toString(16);
      let length = hexComponent.length;
      hex += length < 2 ? '0' : '';
      hex += length < 1 ? '0' : '';
      hex += hexComponent;
    });
    return hex;
  }

  colorFromRgb(value) {
    let result = /^rgb\(([\d]{1,3}),\s([\d]{1,3}),\s([\d]{1,3})\)$/i.exec(value);
    if (result) {
      return {"red": parseInt(result[1]), "green": parseInt(result[2]), "blue": parseInt(result[3]), "alpha": 1};
    } else {
      return this.currentColor;
    }
  }

  setLedColor(row, column, red, green, blue) {
    console.log('Set LED color: ' + red + ', ' + green + ', ' + blue);
    let position = (row-1)*8 + column;
    let command = 0x0702;
    let cmd = new Uint8Array([(command >> 8) & 0xff, command & 0xff, position, red, green, blue]);
    this.sendCommand(cmd).then(() => {
        console.log('LED color set.');
      })
      .catch(this.handleError);
  }

}
window.app = new Dotti();
