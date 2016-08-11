(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.app = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _libAdapter = require('../lib/adapter');

var _libAdapter2 = _interopRequireDefault(_libAdapter);

var Dotti = (function (_Adapter) {
  _inherits(Dotti, _Adapter);

  function Dotti() {
    var _this = this;

    _classCallCheck(this, Dotti);

    var filter = {
      filters: [{
        namePrefix: 'Dotti'
      }],
      optionalServices: ['0000fff0-0000-1000-8000-00805f9b34fb'] };

    var characteristicList = {};
    characteristicList['0000fff0-0000-1000-8000-00805f9b34fb'] = ['0000fff3-0000-1000-8000-00805f9b34fb'];

    _get(Object.getPrototypeOf(Dotti.prototype), 'constructor', this).call(this, filter, characteristicList);

    document.addEventListener('WebComponentsReady', function () {
      _this.$picker = document.querySelector('#picker');
      _this.$pickerButton = document.querySelector('#colorPicker');
      _this.$clearButton = document.querySelector('#colorClear');
      _this.$activeColorButton = document.querySelector('#color1');
      _this.$activeColorButton.style = {};
      _this.colorChangeListener = null;
      _this.commandQueue = [];
      _this.currentColor = {};

      _this.writeCharacteristic = null;
      _this.$picker.alwaysShowAlpha = false;
      _this.$picker.colorValue = 1;
      _this.$picker.shape = 'huebox';

      for (var i = 1; i <= 8; i++) {
        for (var j = 1; j <= 8; j++) {
          var button = document.querySelector('#button' + i + '' + j);
          button.style.backgroundColor = "#000000";
          button.addEventListener('click', _this.buttonClicked.bind(_this));
        }
      }

      for (var i = 1; i <= 6; i++) {
        var button = document.querySelector('#color' + i);
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

          //this.drawHeart();
        }
        button.addEventListener('click', _this.colorClicked.bind(_this));
      }

      _this.currentColor = _this.colorFromRgb(_this.$activeColorButton.style.backgroundColor);

      _this.$pickerButton.addEventListener('click', function (event) {
        if (_this.colorChangeListener) {
          _this.$picker.removeEventListener('color-as-string-changed', _this.colorChangeListener);
        }
        _this.$picker.set('immediateColor', _this.colorFromRgb(_this.$activeColorButton.style.backgroundColor));
        _this.$picker.addEventListener('color-as-string-changed', _this.colorChangeListener = function () {
          _this.$activeColorButton.style.backgroundColor = _this.colorToHex(_this.$picker.color);
          _this.currentColor.red = _this.$picker.color.red;
          _this.currentColor.green = _this.$picker.color.green;
          _this.currentColor.blue = _this.$picker.color.blue;
          _this.currentColor.alpha = _this.$picker.color.alpha;
        });
        _this.$picker.open();
      });

      _this.$clearButton.addEventListener('click', function (event) {
        _this.clearPanel();
      });

      // End of WebComponentsReady Event
    });

    this.on('afterConnect', function (_) {
      _this.writeCharacteristic = _this.characteristics.get('0000fff3-0000-1000-8000-00805f9b34fb');
      _this.clearPanel();
    });

    // End of constructor
  }

  _createClass(Dotti, [{
    key: 'clearPanel',
    value: function clearPanel() {
      for (var i = 1; i <= 8; i++) {
        for (var j = 1; j <= 8; j++) {
          var button = document.querySelector('#button' + i + '' + j);
          button.style.backgroundColor = "#000000";
        }
      }
      this.setPanelColor(0, 0, 0);
    }
  }, {
    key: 'resetOtherPaletteButtons',
    value: function resetOtherPaletteButtons(currentButton) {
      for (var i = 1; i <= 6; i++) {
        var button = document.querySelector('#color' + i);
        if (button.id != currentButton.id) {
          button.active = false;
        }
      }
    }
  }, {
    key: 'setPanelColor',
    value: function setPanelColor(red, green, blue) {
      var _this2 = this;

      console.log('Set panel color');
      var command = 0x0601;
      var cmd = new Uint8Array([command >> 8 & 0xff, command & 0xff, red, green, blue]);
      this.sendCommand(cmd).then(function () {
        console.log('panel color set.');
        _this2.drawHeart();
      })['catch'](this.handleError);
    }
  }, {
    key: 'sendCommand',
    value: function sendCommand(cmd) {
      var _this3 = this;

      if (true) {
        //TODO writeCharacteristic
        // Handle one command at a time
        if (this.busy) {
          // Queue commands
          this.commandQueue.push(cmd);
          return Promise.resolve();
        }
        this.busy = true;
        return this.writeCharacteristic.writeValue(cmd).then(function () {
          _this3.busy = false;
          // Get next command from queue
          var nextCommand = _this3.commandQueue.shift();
          if (nextCommand) {
            _this3.sendCommand(nextCommand);
          }
        });
      } else {
        return Promise.resolve();
      }
    }
  }, {
    key: 'buttonClicked',
    value: function buttonClicked(event) {
      var id = event.target.id;
      this.setLedColor(Number(id.substring(6, 7)), Number(id.substring(7, 8)), this.currentColor.red, this.currentColor.green, this.currentColor.blue);
      event.target.style.backgroundColor = this.colorToHex(this.currentColor);
    }
  }, {
    key: 'colorClicked',
    value: function colorClicked(event) {
      this.$activeColorButton = event.target;
      this.resetOtherPaletteButtons(this.$activeColorButton);
      this.currentColor = this.colorFromRgb(this.$activeColorButton.style.backgroundColor);
    }
  }, {
    key: 'colorToHex',
    value: function colorToHex(value) {
      var hex = '#';
      ['red', 'green', 'blue'].forEach(function (color) {
        var hexComponent = value[color].toString(16);
        var length = hexComponent.length;
        hex += length < 2 ? '0' : '';
        hex += length < 1 ? '0' : '';
        hex += hexComponent;
      });
      return hex;
    }
  }, {
    key: 'colorFromRgb',
    value: function colorFromRgb(value) {
      var result = /^rgb\(([\d]{1,3}),\s([\d]{1,3}),\s([\d]{1,3})\)$/i.exec(value);
      if (result) {
        return { "red": parseInt(result[1]), "green": parseInt(result[2]), "blue": parseInt(result[3]), "alpha": 1 };
      } else {
        return this.currentColor;
      }
    }
  }, {
    key: 'setLedColor',
    value: function setLedColor(row, column, red, green, blue) {
      console.log('Set LED color: ' + red + ', ' + green + ', ' + blue);
      var position = (row - 1) * 8 + column;
      var command = 0x0702;
      var cmd = new Uint8Array([command >> 8 & 0xff, command & 0xff, position, red, green, blue]);
      this.sendCommand(cmd).then(function () {
        console.log('LED color set.');
      })['catch'](this.handleError);
    }
  }, {
    key: 'drawHeart',
    value: function drawHeart() {
      this.setLedColor(1, 2, 255, 0, 0);
      this.setLedColor(1, 3, 255, 0, 0);
      this.setLedColor(1, 6, 255, 0, 0);
      this.setLedColor(1, 7, 255, 0, 0);
      this.setLedColor(2, 1, 255, 0, 0);
      this.setLedColor(2, 2, 255, 0, 0);
      this.setLedColor(2, 3, 255, 0, 0);
      this.setLedColor(2, 4, 255, 0, 0);
      this.setLedColor(2, 5, 255, 0, 0);
      this.setLedColor(2, 6, 255, 0, 0);
      this.setLedColor(2, 7, 255, 0, 0);
      this.setLedColor(2, 8, 255, 0, 0);
      this.setLedColor(3, 1, 255, 0, 0);
      this.setLedColor(3, 2, 255, 0, 0);
      this.setLedColor(3, 3, 255, 0, 0);
      this.setLedColor(3, 4, 255, 0, 0);
      this.setLedColor(3, 5, 255, 0, 0);
      this.setLedColor(3, 6, 255, 0, 0);
      this.setLedColor(3, 7, 255, 0, 0);
      this.setLedColor(3, 8, 255, 0, 0);
      this.setLedColor(4, 1, 255, 0, 0);
      this.setLedColor(4, 2, 255, 0, 0);
      this.setLedColor(4, 3, 255, 0, 0);
      this.setLedColor(4, 4, 255, 0, 0);
      this.setLedColor(4, 5, 255, 0, 0);
      this.setLedColor(4, 6, 255, 0, 0);
      this.setLedColor(4, 7, 255, 0, 0);
      this.setLedColor(4, 8, 255, 0, 0);
      this.setLedColor(5, 1, 255, 0, 0);
      this.setLedColor(5, 2, 255, 0, 0);
      this.setLedColor(5, 3, 255, 0, 0);
      this.setLedColor(5, 4, 255, 0, 0);
      this.setLedColor(5, 5, 255, 0, 0);
      this.setLedColor(5, 6, 255, 0, 0);
      this.setLedColor(5, 7, 255, 0, 0);
      this.setLedColor(5, 8, 255, 0, 0);
      this.setLedColor(6, 2, 255, 0, 0);
      this.setLedColor(6, 3, 255, 0, 0);
      this.setLedColor(6, 4, 255, 0, 0);
      this.setLedColor(6, 5, 255, 0, 0);
      this.setLedColor(6, 6, 255, 0, 0);
      this.setLedColor(6, 7, 255, 0, 0);
      this.setLedColor(7, 3, 255, 0, 0);
      this.setLedColor(7, 4, 255, 0, 0);
      this.setLedColor(7, 5, 255, 0, 0);
      this.setLedColor(7, 6, 255, 0, 0);
      this.setLedColor(8, 4, 255, 0, 0);
      this.setLedColor(8, 5, 255, 0, 0);

      document.querySelector('#button12').style.backgroundColor = '#f00';
      document.querySelector('#button13').style.backgroundColor = '#f00';
      document.querySelector('#button16').style.backgroundColor = '#f00';
      document.querySelector('#button17').style.backgroundColor = '#f00';
      document.querySelector('#button21').style.backgroundColor = '#f00';
      document.querySelector('#button22').style.backgroundColor = '#f00';
      document.querySelector('#button23').style.backgroundColor = '#f00';
      document.querySelector('#button24').style.backgroundColor = '#f00';
      document.querySelector('#button25').style.backgroundColor = '#f00';
      document.querySelector('#button26').style.backgroundColor = '#f00';
      document.querySelector('#button27').style.backgroundColor = '#f00';
      document.querySelector('#button28').style.backgroundColor = '#f00';
      document.querySelector('#button31').style.backgroundColor = '#f00';
      document.querySelector('#button32').style.backgroundColor = '#f00';
      document.querySelector('#button33').style.backgroundColor = '#f00';
      document.querySelector('#button34').style.backgroundColor = '#f00';
      document.querySelector('#button35').style.backgroundColor = '#f00';
      document.querySelector('#button36').style.backgroundColor = '#f00';
      document.querySelector('#button37').style.backgroundColor = '#f00';
      document.querySelector('#button38').style.backgroundColor = '#f00';
      document.querySelector('#button41').style.backgroundColor = '#f00';
      document.querySelector('#button42').style.backgroundColor = '#f00';
      document.querySelector('#button43').style.backgroundColor = '#f00';
      document.querySelector('#button44').style.backgroundColor = '#f00';
      document.querySelector('#button45').style.backgroundColor = '#f00';
      document.querySelector('#button46').style.backgroundColor = '#f00';
      document.querySelector('#button47').style.backgroundColor = '#f00';
      document.querySelector('#button48').style.backgroundColor = '#f00';
      document.querySelector('#button51').style.backgroundColor = '#f00';
      document.querySelector('#button52').style.backgroundColor = '#f00';
      document.querySelector('#button53').style.backgroundColor = '#f00';
      document.querySelector('#button54').style.backgroundColor = '#f00';
      document.querySelector('#button55').style.backgroundColor = '#f00';
      document.querySelector('#button56').style.backgroundColor = '#f00';
      document.querySelector('#button57').style.backgroundColor = '#f00';
      document.querySelector('#button58').style.backgroundColor = '#f00';
      document.querySelector('#button62').style.backgroundColor = '#f00';
      document.querySelector('#button63').style.backgroundColor = '#f00';
      document.querySelector('#button64').style.backgroundColor = '#f00';
      document.querySelector('#button65').style.backgroundColor = '#f00';
      document.querySelector('#button66').style.backgroundColor = '#f00';
      document.querySelector('#button67').style.backgroundColor = '#f00';
      document.querySelector('#button73').style.backgroundColor = '#f00';
      document.querySelector('#button74').style.backgroundColor = '#f00';
      document.querySelector('#button75').style.backgroundColor = '#f00';
      document.querySelector('#button76').style.backgroundColor = '#f00';
      document.querySelector('#button84').style.backgroundColor = '#f00';
      document.querySelector('#button85').style.backgroundColor = '#f00';
    }
  }]);

  return Dotti;
})(_libAdapter2['default']);

exports['default'] = Dotti;

window.app = new Dotti();
module.exports = exports['default'];

},{"../lib/adapter":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require('events').EventEmitter;
var debug = true;

var Adapter = (function (_EventEmitter) {
  _inherits(Adapter, _EventEmitter);

  function Adapter(filter, characteristicList) {
    var _this = this;

    _classCallCheck(this, Adapter);

    _get(Object.getPrototypeOf(Adapter.prototype), 'constructor', this).call(this);
    this.characteristics = new Map();

    document.addEventListener('WebComponentsReady', function () {
      _this.$connectToggle = document.querySelector('#connect');
      _this.$progress = document.querySelector('#progress');
      _this.$dialog = document.querySelector('#dialog');
      _this.$message = document.querySelector('#message');
      _this.$progress.hidden = true;
      _this.busy = false;
      _this.gattServer = null;
      _this.characteristics = new Map();

      // Check if browser supports Web Bluetooth API.
      if (navigator.bluetooth == undefined) {
        document.getElementById("no-bluetooth").style.display = "block";
        document.getElementById("no-bluetooth").open();
      }

      _this.$connectToggle.addEventListener('click', function () {
        _this.$progress.hidden = false;
        console.log('connecting...');
        if (true) {
          // TODO
          navigator.bluetooth.requestDevice(filter).then(function (device) {
            console.log('> Found ' + device.name);
            console.log('Connecting to GATT Server...');
            return device.gatt.connect();
          }).then(function (server) {
            _this.gattServer = server;
            // Get service
            return Promise.all(Object.keys(characteristicList).map(function (targetService) {
              var _service = isNaN(targetService) ? targetService : parseInt(targetService);
              _this.gattServer.getPrimaryService(_service).then(function (service) {
                // Get characteristic
                return Promise.all(characteristicList[_service].map(function (targetCharacteristic) {
                  service.getCharacteristic(targetCharacteristic).then(function (characteristic) {
                    console.log('> Found characteristic');
                    _this.characteristics.set(targetCharacteristic, characteristic);
                    _this.emit('afterConnect');
                  });
                }));
              });
            })).then(function (_) {
              _this.$progress.hidden = true;
              //this.emit('afterConnect');
            });
          }).then(function (_) {
            //this.emit('afterConnect').bind(this);
          })['catch'](_this.handleError.bind(_this));
        }
      });
    });
  }

  _createClass(Adapter, [{
    key: 'handleError',
    value: function handleError(error) {
      console.log(error);
      //resetVariables();
      //this.$dialog.open();
    }
  }]);

  return Adapter;
})(EventEmitter);

exports['default'] = Adapter;
module.exports = exports['default'];

},{"events":3}],3:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvMDEwMDY1MjEvZGV2L3NpbXBsZS13ZWJibHVldG9vdGgvZG90dGkvYXBwLmpzIiwiL1VzZXJzLzAxMDA2NTIxL2Rldi9zaW1wbGUtd2ViYmx1ZXRvb3RoL2xpYi9hZGFwdGVyLmpzIiwibm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBRU8sZ0JBQWdCOzs7O0lBRWYsS0FBSztZQUFMLEtBQUs7O0FBQ2IsV0FEUSxLQUFLLEdBQ1Y7OzswQkFESyxLQUFLOztBQUd0QixRQUFNLE1BQU0sR0FBRztBQUNiLGFBQU8sRUFBQyxDQUFDO0FBQ1Asa0JBQVUsRUFBRSxPQUFPO09BQ3BCLENBQUM7QUFDRixzQkFBZ0IsRUFBRSxDQUFDLHNDQUFzQyxDQUFDLEVBQUMsQ0FBQzs7QUFFOUQsUUFBSSxrQkFBa0IsR0FBRyxFQUFFLENBQUM7QUFDNUIsc0JBQWtCLENBQUMsc0NBQXNDLENBQUMsR0FBRyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7O0FBRXRHLCtCQVppQixLQUFLLDZDQVloQixNQUFNLEVBQUUsa0JBQWtCLEVBQUU7O0FBRWxDLFlBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFBRSxZQUFNO0FBQ3BELFlBQUssT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakQsWUFBSyxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUM1RCxZQUFLLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzFELFlBQUssa0JBQWtCLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM1RCxZQUFLLGtCQUFrQixDQUFDLEtBQUssR0FBRyxF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VyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxVQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFbEMsY0FBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQztBQUNuRSxjQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDO0FBQ25FLGNBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUM7QUFDbkUsY0FBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQztBQUNuRSxjQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDO0FBQ25FLGNBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUM7QUFDbkUsY0FBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQztBQUNuRSxjQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDO0FBQ25FLGNBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUM7QUFDbkUsY0FBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQztBQUNuRSxjQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDO0FBQ25FLGNBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUM7QUFDbkUsY0FBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQztBQUNuRSxjQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDO0FBQ25FLGNBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUM7QUFDbkUsY0FBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQztBQUNuRSxjQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDO0FBQ25FLGNBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUM7QUFDbkUsY0FBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQztBQUNuRSxjQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDO0FBQ25FLGNBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUM7QUFDbkUsY0FBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQztBQUNuRSxjQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDO0FBQ25FLGNBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUM7QUFDbkUsY0FBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQztBQUNuRSxjQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDO0FBQ25FLGNBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUM7QUFDbkUsY0FBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQztBQUNuRSxjQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDO0FBQ25FLGNBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUM7QUFDbkUsY0FBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQztBQUNuRSxjQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDO0FBQ25FLGNBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUM7QUFDbkUsY0FBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQztBQUNuRSxjQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDO0FBQ25FLGNBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUM7QUFDbkUsY0FBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQztBQUNuRSxjQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDO0FBQ25FLGNBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUs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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBBZGFwdGVyIGZyb20gJy4uL2xpYi9hZGFwdGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG90dGkgZXh0ZW5kcyBBZGFwdGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICBjb25zdCBmaWx0ZXIgPSB7XG4gICAgICBmaWx0ZXJzOlt7XG4gICAgICAgIG5hbWVQcmVmaXg6ICdEb3R0aScsXG4gICAgICB9XSxcbiAgICAgIG9wdGlvbmFsU2VydmljZXM6IFsnMDAwMGZmZjAtMDAwMC0xMDAwLTgwMDAtMDA4MDVmOWIzNGZiJ119O1xuXG4gICAgbGV0IGNoYXJhY3RlcmlzdGljTGlzdCA9IHt9O1xuICAgIGNoYXJhY3RlcmlzdGljTGlzdFsnMDAwMGZmZjAtMDAwMC0xMDAwLTgwMDAtMDA4MDVmOWIzNGZiJ10gPSBbJzAwMDBmZmYzLTAwMDAtMTAwMC04MDAwLTAwODA1ZjliMzRmYiddO1xuXG4gICAgc3VwZXIoZmlsdGVyLCBjaGFyYWN0ZXJpc3RpY0xpc3QpO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignV2ViQ29tcG9uZW50c1JlYWR5JywgKCkgPT4ge1xuICAgICAgdGhpcy4kcGlja2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BpY2tlcicpO1xuICAgICAgdGhpcy4kcGlja2VyQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbG9yUGlja2VyJyk7XG4gICAgICB0aGlzLiRjbGVhckJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb2xvckNsZWFyJyk7XG4gICAgICB0aGlzLiRhY3RpdmVDb2xvckJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb2xvcjEnKTtcbiAgICAgIHRoaXMuJGFjdGl2ZUNvbG9yQnV0dG9uLnN0eWxlID0ge307XG4gICAgICB0aGlzLmNvbG9yQ2hhbmdlTGlzdGVuZXIgPSBudWxsO1xuICAgICAgdGhpcy5jb21tYW5kUXVldWUgPSBbXTtcbiAgICAgIHRoaXMuY3VycmVudENvbG9yID0ge307XG5cbiAgICAgIHRoaXMud3JpdGVDaGFyYWN0ZXJpc3RpYyA9IG51bGw7XG4gICAgICB0aGlzLiRwaWNrZXIuYWx3YXlzU2hvd0FscGhhID0gZmFsc2U7XG4gICAgICB0aGlzLiRwaWNrZXIuY29sb3JWYWx1ZSA9IDE7XG4gICAgICB0aGlzLiRwaWNrZXIuc2hhcGUgPSAnaHVlYm94JztcblxuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gODsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAxOyBqIDw9IDg7IGorKykge1xuICAgICAgICAgIGxldCBidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uJyArIGkgKyAnJyArIGopO1xuICAgICAgICAgIGJ1dHRvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiMwMDAwMDBcIjtcbiAgICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmJ1dHRvbkNsaWNrZWQuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gNjsgaSsrKSB7XG4gICAgICAgIGxldCBidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29sb3InICsgaSk7XG4gICAgICAgIHN3aXRjaCAoaSkge1xuICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIGJ1dHRvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNmMDBcIjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGJ1dHRvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiMwZjBcIjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIGJ1dHRvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiMwMGZcIjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIGJ1dHRvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNmZmJlMDBcIjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgIGJ1dHRvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiMwMDBcIjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBidXR0b24uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjZmZmXCI7XG5cbiAgICAgICAgICAgIC8vdGhpcy5kcmF3SGVhcnQoKTtcbiAgICAgICAgfVxuICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNvbG9yQ2xpY2tlZC5iaW5kKHRoaXMpKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jdXJyZW50Q29sb3IgPSB0aGlzLmNvbG9yRnJvbVJnYih0aGlzLiRhY3RpdmVDb2xvckJ1dHRvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IpO1xuXG4gICAgICB0aGlzLiRwaWNrZXJCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgICAgIGlmICh0aGlzLmNvbG9yQ2hhbmdlTGlzdGVuZXIpIHtcbiAgICAgICAgICB0aGlzLiRwaWNrZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignY29sb3ItYXMtc3RyaW5nLWNoYW5nZWQnLCB0aGlzLmNvbG9yQ2hhbmdlTGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJHBpY2tlci5zZXQoJ2ltbWVkaWF0ZUNvbG9yJywgdGhpcy5jb2xvckZyb21SZ2IodGhpcy4kYWN0aXZlQ29sb3JCdXR0b24uc3R5bGUuYmFja2dyb3VuZENvbG9yKSk7XG4gICAgICAgIHRoaXMuJHBpY2tlci5hZGRFdmVudExpc3RlbmVyKCdjb2xvci1hcy1zdHJpbmctY2hhbmdlZCcsIHRoaXMuY29sb3JDaGFuZ2VMaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLiRhY3RpdmVDb2xvckJ1dHRvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLmNvbG9yVG9IZXgodGhpcy4kcGlja2VyLmNvbG9yKTtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRDb2xvci5yZWQgPSB0aGlzLiRwaWNrZXIuY29sb3IucmVkO1xuICAgICAgICAgIHRoaXMuY3VycmVudENvbG9yLmdyZWVuID0gdGhpcy4kcGlja2VyLmNvbG9yLmdyZWVuO1xuICAgICAgICAgIHRoaXMuY3VycmVudENvbG9yLmJsdWUgPSB0aGlzLiRwaWNrZXIuY29sb3IuYmx1ZTtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRDb2xvci5hbHBoYSA9IHRoaXMuJHBpY2tlci5jb2xvci5hbHBoYTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuJHBpY2tlci5vcGVuKCk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy4kY2xlYXJCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XG4gICAgICAgIHRoaXMuY2xlYXJQYW5lbCgpO1xuICAgICAgfSk7XG5cbiAgICAvLyBFbmQgb2YgV2ViQ29tcG9uZW50c1JlYWR5IEV2ZW50XG4gICAgfSk7XG5cbiAgICB0aGlzLm9uKCdhZnRlckNvbm5lY3QnLCBfID0+IHtcbiAgICAgIHRoaXMud3JpdGVDaGFyYWN0ZXJpc3RpYyA9IHRoaXMuY2hhcmFjdGVyaXN0aWNzLmdldCgnMDAwMGZmZjMtMDAwMC0xMDAwLTgwMDAtMDA4MDVmOWIzNGZiJyk7XG4gICAgICB0aGlzLmNsZWFyUGFuZWwoKTtcbiAgICB9KVxuXG4gIC8vIEVuZCBvZiBjb25zdHJ1Y3RvclxuICB9XG5cbiAgY2xlYXJQYW5lbCgpe1xuICAgIGZvciAobGV0IGk9MTsgaTw9ODsgaSsrKSB7XG4gICAgICBmb3IobGV0IGo9MTsgajw9ODsgaisrKSB7XG4gICAgICAgIGxldCBidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uJytpKycnK2opO1xuICAgICAgICBidXR0b24uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjMDAwMDAwXCI7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuc2V0UGFuZWxDb2xvcigwLCAwLCAwKTtcbiAgfVxuXG4gIHJlc2V0T3RoZXJQYWxldHRlQnV0dG9ucyhjdXJyZW50QnV0dG9uKSB7XG4gICAgZm9yKGxldCBpPTE7IGk8PTY7IGkrKykge1xuICAgICAgbGV0IGJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb2xvcicraSk7XG4gICAgICBpZiAoYnV0dG9uLmlkICE9IGN1cnJlbnRCdXR0b24uaWQpIHtcbiAgICAgICAgYnV0dG9uLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNldFBhbmVsQ29sb3IocmVkLCBncmVlbiwgYmx1ZSkge1xuICAgIGNvbnNvbGUubG9nKCdTZXQgcGFuZWwgY29sb3InKTtcbiAgICBsZXQgY29tbWFuZCA9IDB4MDYwMTtcbiAgICBsZXQgY21kID0gbmV3IFVpbnQ4QXJyYXkoWyhjb21tYW5kID4+IDgpICYgMHhmZiwgY29tbWFuZCAmIDB4ZmYsIHJlZCwgZ3JlZW4sIGJsdWVdKTtcbiAgICB0aGlzLnNlbmRDb21tYW5kKGNtZCkudGhlbigoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdwYW5lbCBjb2xvciBzZXQuJyk7XG4gICAgICB0aGlzLmRyYXdIZWFydCgpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9yKTtcbiAgfVxuXG4gIHNlbmRDb21tYW5kKGNtZCkge1xuICAgIGlmICh0cnVlKSB7IC8vVE9ETyB3cml0ZUNoYXJhY3RlcmlzdGljXG4gICAgICAvLyBIYW5kbGUgb25lIGNvbW1hbmQgYXQgYSB0aW1lXG4gICAgICBpZiAodGhpcy5idXN5KSB7XG4gICAgICAgIC8vIFF1ZXVlIGNvbW1hbmRzXG4gICAgICAgIHRoaXMuY29tbWFuZFF1ZXVlLnB1c2goY21kKTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgfVxuICAgICAgdGhpcy5idXN5ID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0aGlzLndyaXRlQ2hhcmFjdGVyaXN0aWMud3JpdGVWYWx1ZShjbWQpXG4gICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmJ1c3kgPSBmYWxzZTtcbiAgICAgICAgICAvLyBHZXQgbmV4dCBjb21tYW5kIGZyb20gcXVldWVcbiAgICAgICAgICBsZXQgbmV4dENvbW1hbmQgPSB0aGlzLmNvbW1hbmRRdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgIGlmIChuZXh0Q29tbWFuZCkge1xuICAgICAgICAgICAgdGhpcy5zZW5kQ29tbWFuZChuZXh0Q29tbWFuZCk7XG4gICAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gIH1cblxuICBidXR0b25DbGlja2VkKGV2ZW50KSB7XG4gICAgbGV0IGlkID0gZXZlbnQudGFyZ2V0LmlkO1xuICAgIHRoaXMuc2V0TGVkQ29sb3IoTnVtYmVyKGlkLnN1YnN0cmluZyg2LDcpKSwgTnVtYmVyKGlkLnN1YnN0cmluZyg3LDgpKSwgdGhpcy5jdXJyZW50Q29sb3IucmVkLCB0aGlzLmN1cnJlbnRDb2xvci5ncmVlbiwgdGhpcy5jdXJyZW50Q29sb3IuYmx1ZSk7XG4gICAgZXZlbnQudGFyZ2V0LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuY29sb3JUb0hleCh0aGlzLmN1cnJlbnRDb2xvcik7XG4gIH1cblxuICBjb2xvckNsaWNrZWQoZXZlbnQpIHtcbiAgICB0aGlzLiRhY3RpdmVDb2xvckJ1dHRvbiA9IGV2ZW50LnRhcmdldDtcbiAgICB0aGlzLnJlc2V0T3RoZXJQYWxldHRlQnV0dG9ucyh0aGlzLiRhY3RpdmVDb2xvckJ1dHRvbik7XG4gICAgdGhpcy5jdXJyZW50Q29sb3IgPSB0aGlzLmNvbG9yRnJvbVJnYih0aGlzLiRhY3RpdmVDb2xvckJ1dHRvbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IpO1xuICB9XG5cbiAgY29sb3JUb0hleCh2YWx1ZSkge1xuICAgIGxldCBoZXggPSAnIyc7XG4gICAgWydyZWQnLCAnZ3JlZW4nLCAnYmx1ZSddLmZvckVhY2goZnVuY3Rpb24oY29sb3IpIHtcbiAgICAgIGxldCBoZXhDb21wb25lbnQgPSB2YWx1ZVtjb2xvcl0udG9TdHJpbmcoMTYpO1xuICAgICAgbGV0IGxlbmd0aCA9IGhleENvbXBvbmVudC5sZW5ndGg7XG4gICAgICBoZXggKz0gbGVuZ3RoIDwgMiA/ICcwJyA6ICcnO1xuICAgICAgaGV4ICs9IGxlbmd0aCA8IDEgPyAnMCcgOiAnJztcbiAgICAgIGhleCArPSBoZXhDb21wb25lbnQ7XG4gICAgfSk7XG4gICAgcmV0dXJuIGhleDtcbiAgfVxuXG4gIGNvbG9yRnJvbVJnYih2YWx1ZSkge1xuICAgIGxldCByZXN1bHQgPSAvXnJnYlxcKChbXFxkXXsxLDN9KSxcXHMoW1xcZF17MSwzfSksXFxzKFtcXGRdezEsM30pXFwpJC9pLmV4ZWModmFsdWUpO1xuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgIHJldHVybiB7XCJyZWRcIjogcGFyc2VJbnQocmVzdWx0WzFdKSwgXCJncmVlblwiOiBwYXJzZUludChyZXN1bHRbMl0pLCBcImJsdWVcIjogcGFyc2VJbnQocmVzdWx0WzNdKSwgXCJhbHBoYVwiOiAxfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY3VycmVudENvbG9yO1xuICAgIH1cbiAgfVxuXG4gIHNldExlZENvbG9yKHJvdywgY29sdW1uLCByZWQsIGdyZWVuLCBibHVlKSB7XG4gICAgY29uc29sZS5sb2coJ1NldCBMRUQgY29sb3I6ICcgKyByZWQgKyAnLCAnICsgZ3JlZW4gKyAnLCAnICsgYmx1ZSk7XG4gICAgbGV0IHBvc2l0aW9uID0gKHJvdy0xKSo4ICsgY29sdW1uO1xuICAgIGxldCBjb21tYW5kID0gMHgwNzAyO1xuICAgIGxldCBjbWQgPSBuZXcgVWludDhBcnJheShbKGNvbW1hbmQgPj4gOCkgJiAweGZmLCBjb21tYW5kICYgMHhmZiwgcG9zaXRpb24sIHJlZCwgZ3JlZW4sIGJsdWVdKTtcbiAgICB0aGlzLnNlbmRDb21tYW5kKGNtZCkudGhlbigoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdMRUQgY29sb3Igc2V0LicpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9yKTtcbiAgfVxuXG4gIGRyYXdIZWFydCgpe1xuICAgIHRoaXMuc2V0TGVkQ29sb3IoMSwgMiwgMjU1LCAwLCAwKTtcbiAgICB0aGlzLnNldExlZENvbG9yKDEsIDMsIDI1NSwgMCwgMCk7XG4gICAgdGhpcy5zZXRMZWRDb2xvcigxLCA2LCAyNTUsIDAsIDApO1xuICAgIHRoaXMuc2V0TGVkQ29sb3IoMSwgNywgMjU1LCAwLCAwKTtcbiAgICB0aGlzLnNldExlZENvbG9yKDIsIDEsIDI1NSwgMCwgMCk7XG4gICAgdGhpcy5zZXRMZWRDb2xvcigyLCAyLCAyNTUsIDAsIDApO1xuICAgIHRoaXMuc2V0TGVkQ29sb3IoMiwgMywgMjU1LCAwLCAwKTtcbiAgICB0aGlzLnNldExlZENvbG9yKDIsIDQsIDI1NSwgMCwgMCk7XG4gICAgdGhpcy5zZXRMZWRDb2xvcigyLCA1LCAyNTUsIDAsIDApO1xuICAgIHRoaXMuc2V0TGVkQ29sb3IoMiwgNiwgMjU1LCAwLCAwKTtcbiAgICB0aGlzLnNldExlZENvbG9yKDIsIDcsIDI1NSwgMCwgMCk7XG4gICAgdGhpcy5zZXRMZWRDb2xvcigyLCA4LCAyNTUsIDAsIDApO1xuICAgIHRoaXMuc2V0TGVkQ29sb3IoMywgMSwgMjU1LCAwLCAwKTtcbiAgICB0aGlzLnNldExlZENvbG9yKDMsIDIsIDI1NSwgMCwgMCk7XG4gICAgdGhpcy5zZXRMZWRDb2xvcigzLCAzLCAyNTUsIDAsIDApO1xuICAgIHRoaXMuc2V0TGVkQ29sb3IoMywgNCwgMjU1LCAwLCAwKTtcbiAgICB0aGlzLnNldExlZENvbG9yKDMsIDUsIDI1NSwgMCwgMCk7XG4gICAgdGhpcy5zZXRMZWRDb2xvcigzLCA2LCAyNTUsIDAsIDApO1xuICAgIHRoaXMuc2V0TGVkQ29sb3IoMywgNywgMjU1LCAwLCAwKTtcbiAgICB0aGlzLnNldExlZENvbG9yKDMsIDgsIDI1NSwgMCwgMCk7XG4gICAgdGhpcy5zZXRMZWRDb2xvcig0LCAxLCAyNTUsIDAsIDApO1xuICAgIHRoaXMuc2V0TGVkQ29sb3IoNCwgMiwgMjU1LCAwLCAwKTtcbiAgICB0aGlzLnNldExlZENvbG9yKDQsIDMsIDI1NSwgMCwgMCk7XG4gICAgdGhpcy5zZXRMZWRDb2xvcig0LCA0LCAyNTUsIDAsIDApO1xuICAgIHRoaXMuc2V0TGVkQ29sb3IoNCwgNSwgMjU1LCAwLCAwKTtcbiAgICB0aGlzLnNldExlZENvbG9yKDQsIDYsIDI1NSwgMCwgMCk7XG4gICAgdGhpcy5zZXRMZWRDb2xvcig0LCA3LCAyNTUsIDAsIDApO1xuICAgIHRoaXMuc2V0TGVkQ29sb3IoNCwgOCwgMjU1LCAwLCAwKTtcbiAgICB0aGlzLnNldExlZENvbG9yKDUsIDEsIDI1NSwgMCwgMCk7XG4gICAgdGhpcy5zZXRMZWRDb2xvcig1LCAyLCAyNTUsIDAsIDApO1xuICAgIHRoaXMuc2V0TGVkQ29sb3IoNSwgMywgMjU1LCAwLCAwKTtcbiAgICB0aGlzLnNldExlZENvbG9yKDUsIDQsIDI1NSwgMCwgMCk7XG4gICAgdGhpcy5zZXRMZWRDb2xvcig1LCA1LCAyNTUsIDAsIDApO1xuICAgIHRoaXMuc2V0TGVkQ29sb3IoNSwgNiwgMjU1LCAwLCAwKTtcbiAgICB0aGlzLnNldExlZENvbG9yKDUsIDcsIDI1NSwgMCwgMCk7XG4gICAgdGhpcy5zZXRMZWRDb2xvcig1LCA4LCAyNTUsIDAsIDApO1xuICAgIHRoaXMuc2V0TGVkQ29sb3IoNiwgMiwgMjU1LCAwLCAwKTtcbiAgICB0aGlzLnNldExlZENvbG9yKDYsIDMsIDI1NSwgMCwgMCk7XG4gICAgdGhpcy5zZXRMZWRDb2xvcig2LCA0LCAyNTUsIDAsIDApO1xuICAgIHRoaXMuc2V0TGVkQ29sb3IoNiwgNSwgMjU1LCAwLCAwKTtcbiAgICB0aGlzLnNldExlZENvbG9yKDYsIDYsIDI1NSwgMCwgMCk7XG4gICAgdGhpcy5zZXRMZWRDb2xvcig2LCA3LCAyNTUsIDAsIDApO1xuICAgIHRoaXMuc2V0TGVkQ29sb3IoNywgMywgMjU1LCAwLCAwKTtcbiAgICB0aGlzLnNldExlZENvbG9yKDcsIDQsIDI1NSwgMCwgMCk7XG4gICAgdGhpcy5zZXRMZWRDb2xvcig3LCA1LCAyNTUsIDAsIDApO1xuICAgIHRoaXMuc2V0TGVkQ29sb3IoNywgNiwgMjU1LCAwLCAwKTtcbiAgICB0aGlzLnNldExlZENvbG9yKDgsIDQsIDI1NSwgMCwgMCk7XG4gICAgdGhpcy5zZXRMZWRDb2xvcig4LCA1LCAyNTUsIDAsIDApO1xuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbjEyJykuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmMDAnO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b24xMycpLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZjAwJztcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uMTYnKS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2YwMCc7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbjE3Jykuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmMDAnO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b24yMScpLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZjAwJztcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uMjInKS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2YwMCc7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbjIzJykuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmMDAnO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b24yNCcpLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZjAwJztcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uMjUnKS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2YwMCc7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbjI2Jykuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmMDAnO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b24yNycpLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZjAwJztcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uMjgnKS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2YwMCc7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbjMxJykuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmMDAnO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b24zMicpLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZjAwJztcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uMzMnKS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2YwMCc7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbjM0Jykuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmMDAnO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b24zNScpLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZjAwJztcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uMzYnKS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2YwMCc7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbjM3Jykuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmMDAnO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b24zOCcpLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZjAwJztcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uNDEnKS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2YwMCc7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbjQyJykuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmMDAnO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b240MycpLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZjAwJztcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uNDQnKS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2YwMCc7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbjQ1Jykuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmMDAnO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b240NicpLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZjAwJztcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uNDcnKS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2YwMCc7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbjQ4Jykuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmMDAnO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b241MScpLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZjAwJztcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uNTInKS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2YwMCc7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbjUzJykuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmMDAnO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b241NCcpLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZjAwJztcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uNTUnKS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2YwMCc7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbjU2Jykuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmMDAnO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b241NycpLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZjAwJztcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uNTgnKS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2YwMCc7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbjYyJykuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmMDAnO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b242MycpLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZjAwJztcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uNjQnKS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2YwMCc7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbjY1Jykuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmMDAnO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b242NicpLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZjAwJztcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uNjcnKS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2YwMCc7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbjczJykuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmMDAnO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b243NCcpLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZjAwJztcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uNzUnKS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2YwMCc7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2J1dHRvbjc2Jykuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmMDAnO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNidXR0b244NCcpLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZjAwJztcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYnV0dG9uODUnKS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2YwMCc7XG4gIH1cblxuXG59XG53aW5kb3cuYXBwID0gbmV3IERvdHRpKCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcbmNvbnN0IGRlYnVnID0gdHJ1ZTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWRhcHRlciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKGZpbHRlciwgY2hhcmFjdGVyaXN0aWNMaXN0KSB7XG5cbiAgICBzdXBlcigpO1xuICAgIHRoaXMuY2hhcmFjdGVyaXN0aWNzID0gbmV3IE1hcCgpO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignV2ViQ29tcG9uZW50c1JlYWR5JywgKCkgPT4ge1xuICAgICAgdGhpcy4kY29ubmVjdFRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb25uZWN0Jyk7XG4gICAgICB0aGlzLiRwcm9ncmVzcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwcm9ncmVzcycpO1xuICAgICAgdGhpcy4kZGlhbG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RpYWxvZycpO1xuICAgICAgdGhpcy4kbWVzc2FnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtZXNzYWdlJyk7XG4gICAgICB0aGlzLiRwcm9ncmVzcy5oaWRkZW4gPSB0cnVlO1xuICAgICAgdGhpcy5idXN5ID0gZmFsc2U7XG4gICAgICB0aGlzLmdhdHRTZXJ2ZXIgPSBudWxsO1xuICAgICAgdGhpcy5jaGFyYWN0ZXJpc3RpY3MgPSBuZXcgTWFwKCk7XG5cbiAgICAgIC8vIENoZWNrIGlmIGJyb3dzZXIgc3VwcG9ydHMgV2ViIEJsdWV0b290aCBBUEkuXG4gICAgICBpZiAobmF2aWdhdG9yLmJsdWV0b290aCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuby1ibHVldG9vdGhcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuby1ibHVldG9vdGhcIikub3BlbigpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLiRjb25uZWN0VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICB0aGlzLiRwcm9ncmVzcy5oaWRkZW4gPSBmYWxzZTtcbiAgICAgICAgY29uc29sZS5sb2coJ2Nvbm5lY3RpbmcuLi4nKTtcbiAgICAgICAgaWYodHJ1ZSkgeyAvLyBUT0RPXG4gICAgICAgICAgbmF2aWdhdG9yLmJsdWV0b290aC5yZXF1ZXN0RGV2aWNlKGZpbHRlcilcbiAgICAgICAgICAgIC50aGVuKGRldmljZSA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCc+IEZvdW5kICcgKyBkZXZpY2UubmFtZSk7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDb25uZWN0aW5nIHRvIEdBVFQgU2VydmVyLi4uJyk7XG4gICAgICAgICAgICAgIHJldHVybiBkZXZpY2UuZ2F0dC5jb25uZWN0KCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oc2VydmVyID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5nYXR0U2VydmVyID0gc2VydmVyO1xuICAgICAgICAgICAgICAvLyBHZXQgc2VydmljZVxuICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoT2JqZWN0LmtleXMoY2hhcmFjdGVyaXN0aWNMaXN0KS5tYXAodGFyZ2V0U2VydmljZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgX3NlcnZpY2UgPSAoaXNOYU4odGFyZ2V0U2VydmljZSkpID8gdGFyZ2V0U2VydmljZSA6IHBhcnNlSW50KHRhcmdldFNlcnZpY2UpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2F0dFNlcnZlci5nZXRQcmltYXJ5U2VydmljZShfc2VydmljZSlcbiAgICAgICAgICAgICAgICAgIC50aGVuKHNlcnZpY2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgY2hhcmFjdGVyaXN0aWNcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGNoYXJhY3RlcmlzdGljTGlzdFtfc2VydmljZV0ubWFwKHRhcmdldENoYXJhY3RlcmlzdGljID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRhcmdldENoYXJhY3RlcmlzdGljKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oY2hhcmFjdGVyaXN0aWMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnPiBGb3VuZCBjaGFyYWN0ZXJpc3RpYycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJhY3RlcmlzdGljcy5zZXQodGFyZ2V0Q2hhcmFjdGVyaXN0aWMsIGNoYXJhY3RlcmlzdGljKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdhZnRlckNvbm5lY3QnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH0pKS50aGVuKF8gPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuJHByb2dyZXNzLmhpZGRlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgLy90aGlzLmVtaXQoJ2FmdGVyQ29ubmVjdCcpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihfID0+IHtcbiAgICAgICAgICAgICAgLy90aGlzLmVtaXQoJ2FmdGVyQ29ubmVjdCcpLmJpbmQodGhpcyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3IuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgaGFuZGxlRXJyb3IoZXJyb3IpIHtcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgLy9yZXNldFZhcmlhYmxlcygpO1xuICAgIC8vdGhpcy4kZGlhbG9nLm9wZW4oKTtcbiAgfVxuXG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LicpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuXG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgdmFyIG07XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCFlbWl0dGVyLl9ldmVudHMgfHwgIWVtaXR0ZXIuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSAwO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKGVtaXR0ZXIuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gMTtcbiAgZWxzZVxuICAgIHJldCA9IGVtaXR0ZXIuX2V2ZW50c1t0eXBlXS5sZW5ndGg7XG4gIHJldHVybiByZXQ7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iXX0=
