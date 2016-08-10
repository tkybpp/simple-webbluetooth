'use strict';

const EventEmitter = require('events').EventEmitter;
const debug = true;

export default class Adapter extends EventEmitter {
  constructor(filter, characteristicList) {

    super();
    this.characteristics = new Map();

    document.addEventListener('WebComponentsReady', () => {
      this.$connectToggle = document.querySelector('#connect');
      this.$progress = document.querySelector('#progress');
      this.$dialog = document.querySelector('#dialog');
      this.$message = document.querySelector('#message');
      this.$progress.hidden = true;
      this.busy = false;
      this.gattServer = null;
      this.characteristics = new Map();

      // Check if browser supports Web Bluetooth API.
      if (navigator.bluetooth == undefined) {
        document.getElementById("no-bluetooth").style.display = "block";
        document.getElementById("no-bluetooth").open();
      }

      this.$connectToggle.addEventListener('click', () => {
        this.$progress.hidden = false;
        console.log('connecting...');
        if(true) { // TODO
          navigator.bluetooth.requestDevice(filter)
            .then(device => {
              console.log('> Found ' + device.name);
              console.log('Connecting to GATT Server...');
              return device.gatt.connect();
            })
            .then(server => {
              this.gattServer = server;
              // Get service
              return Promise.all(Object.keys(characteristicList).map(targetService => {
                const _service = (isNaN(targetService)) ? targetService : parseInt(targetService);
                this.gattServer.getPrimaryService(_service)
                  .then(service => {
                    // Get characteristic
                    return Promise.all(characteristicList[_service].map(targetCharacteristic => {
                      service.getCharacteristic(targetCharacteristic)
                        .then(characteristic => {
                          console.log('> Found write characteristic');
                          this.characteristics.set(targetCharacteristic, characteristic);
                          this.emit('afterConnect');
                        });
                    }))
                  })
              })).then(_ => {
                console.log(this.characteristics);
                this.$progress.hidden = true;
                //this.emit('afterConnect');
              });
            })
            .then(_ => {
              //this.emit('afterConnect').bind(this);
            })
            .catch(this.handleError.bind(this));
        }
      });
    });
  }

  handleError(error) {
    console.log(error);
    //resetVariables();
    //this.$dialog.open();
  }
  getCharacteristic(target) {
    return this.characteristics.get(target);
  }



}
