'use strict';

import Adapter from '../lib/adapter';

export default class BB8 extends Adapter {
  constructor() {

    const filter = {
      filters: [{
        services: ['22bb746f-2bb0-7554-2d6f-726568705327']
      }, {
        // Some BB8 toys advertise -2ba0- instead of -2bb0-.
        services: ['22bb746f-2ba0-7554-2d6f-726568705327']
      }]
    };

    let characteristicList = {};
    characteristicList['22bb746f-2bb0-7554-2d6f-726568705327'] = ['22bb746f-2bbd-7554-2d6f-726568705327','22bb746f-2bb2-7554-2d6f-726568705327','22bb746f-2bbf-7554-2d6f-726568705327'];
    characteristicList['22bb746f-2ba0-7554-2d6f-726568705327'] = ['22bb746f-2ba1-7554-2d6f-726568705327'];

    super(filter, characteristicList);

    document.addEventListener('WebComponentsReady', () => {
      this.controlCharacteristic = null;
      this.sequence = 0;
      this.busy = false;


      // End of WebComponentsReady Event
    });

    // Notice : This is bad prosses...
    this.count = 0;
    for ( var service in characteristicList ) {
      for ( var characteristic in characteristicList[service] ) {
        this.count++;
      }
    }
    this.roopConunt = 1;
    this.on('afterConnect', _ => {
      if(this.roopConunt !== this.count){
        this.roopConunt++;
      } else {
        let bytes = new Uint8Array('011i3'.split('').map(c => c.charCodeAt()));
        this.characteristics.get('22bb746f-2bbd-7554-2d6f-726568705327').writeValue(bytes)
          .then(() => {
            console.log('Anti DOS write done.');
          })
          .then(() => {
            // Get TX Power characteristic
            let array = new Uint8Array([0x07]);
            return this.characteristics.get("22bb746f-2bb2-7554-2d6f-726568705327").writeValue(array)
              .then(() => {
              console.log('TX Power write done.');
            })
          })
          .then(() => {
            // Get Wake CPU characteristic
            let array = new Uint8Array([0x01]);
            return this.characteristics.get("22bb746f-2bbf-7554-2d6f-726568705327").writeValue(array)
              .then(() => {
                console.log('Wake CPU write done.');
              })
          })
          .then(() => {
            // Get Wake CPU characteristic
            let array = new Uint8Array([0x01]);
            this.controlCharacteristic = this.characteristics.get("22bb746f-2ba1-7554-2d6f-726568705327");
            return this.setColor(0, 250, 0);
          }).catch(this.handleError);

        let joystick = new RetroJoyStick({
          retroStickElement: document.querySelector('#retrostick')
        });
        joystick.subscribe('change', stick => {
          this.roll(stick.angle);
        });

      }
    });

    // End of constructor
  }

  setColor(r, g, b){
    console.log('Set color: r='+r+',g='+g+',b='+b);
    if (this.busy) {
      // Return if another operation pending
      return Promise.resolve();
    }
    this.busy = true;
    let did = 0x02; // Virtual device ID
    let cid = 0x20; // Set RGB LED Output command
    // Color command data: red, green, blue, flag
    let data = new Uint8Array([r, g, b, 0]);
    this.sendCommand(did, cid, data).then(() => {
        this.busy = false;
      })
      .catch(this.handleError);
  }

  sendCommand(did, cid, data) {
    // Create client command packets
    // API docs: https://github.com/orbotix/DeveloperResources/blob/master/docs/Sphero_API_1.50.pdf
    // Next sequence number
    let seq = this.sequence & 255;
    this.sequence += 1
    // Start of packet #2
    let sop2 = 0xfc;
    sop2 |= 1; // Answer
    sop2 |= 2; // Reset timeout
    // Data length
    let dlen = data.byteLength + 1;
    let sum = data.reduce((a, b) => {
      return a + b;
    });
    // Checksum
    let chk = (sum + did + cid + seq + dlen) & 255;
    chk ^= 255;
    let checksum = new Uint8Array([chk]);
    let packets = new Uint8Array([0xff, sop2, did, cid, seq, dlen]);
    // Append arrays: packet + data + checksum
    let array = new Uint8Array(packets.byteLength + data.byteLength + checksum.byteLength);
    array.set(packets, 0);
    array.set(data, packets.byteLength);
    array.set(checksum, packets.byteLength + data.byteLength);
    return this.controlCharacteristic.writeValue(array).then(() => {
      console.log('Command write done.');
    });
  }

  roll(heading) {
    console.log('Roll heading='+heading);
    if (this.busy) {
      // Return if another operation pending
      return Promise.resolve();
    }
    this.busy = true;
    let did = 0x02; // Virtual device ID
    let cid = 0x30; // Roll command
    // Roll command data: speed, heading (MSB), heading (LSB), state
    let data = new Uint8Array([10, heading >> 8, heading & 0xFF, 1]);
    this.sendCommand(did, cid, data).then(() => {
        this.busy = false;
      })
      .catch(this.handleError);
  }


}
window.app = new BB8();
