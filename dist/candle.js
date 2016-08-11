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

var CANDLE_SERVICE_UUID = 0xFF02;
var CANDLE_DEVICE_NAME_UUID = 0xFFFF;
var CANDLE_COLOR_UUID = 0xFFFC;
var CANDLE_EFFECT_UUID = 0xFFFB;
var CANDLE_BLOW_NOTIFICATIONS_UUID = 0x2A37;
var r = 255,
    g = 255,
    b = 255;

var PLAYBULB = (function (_Adapter) {
  _inherits(PLAYBULB, _Adapter);

  function PLAYBULB() {
    var _this = this;

    _classCallCheck(this, PLAYBULB);

    var filter = {
      filters: [{
        services: [CANDLE_SERVICE_UUID]
      }],
      optionalServices: ['battery_service'] };

    var characteristicList = {};
    characteristicList[CANDLE_SERVICE_UUID] = [CANDLE_DEVICE_NAME_UUID, CANDLE_COLOR_UUID, CANDLE_EFFECT_UUID, CANDLE_BLOW_NOTIFICATIONS_UUID];
    characteristicList['battery_service'] = ['battery_level'];

    _get(Object.getPrototypeOf(PLAYBULB.prototype), 'constructor', this).call(this, filter, characteristicList);

    this.colorChanging = false;
    this._isEffectSet = false;

    document.addEventListener('WebComponentsReady', function () {

      document.querySelector('#noEffect').addEventListener('click', _this.changeColor.bind(_this));
      document.querySelector('#candleEffect').addEventListener('click', _this.changeColor.bind(_this));
      document.querySelector('#flashing').addEventListener('click', _this.changeColor.bind(_this));
      document.querySelector('#pulse').addEventListener('click', _this.changeColor.bind(_this));
      document.querySelector('#rainbow').addEventListener('click', _this.changeColor.bind(_this));
      document.querySelector('#rainbowFade').addEventListener('click', _this.changeColor.bind(_this));

      _this.$canvas = document.querySelector('canvas');

      _this.img = new Image();
      _this.img.src = 'color-wheel.png';
      _this.img.onload = function () {
        _this.$canvas = document.querySelector('canvas');
        _this.context = _this.$canvas.getContext('2d');

        _this.$canvas.width = 300 * devicePixelRatio;
        _this.$canvas.height = 300 * devicePixelRatio;
        _this.$canvas.style.width = "300px";
        _this.$canvas.style.height = "300px";

        _this.$canvas.addEventListener('click', _this.draw.bind(_this));
        _this.$canvas.addEventListener('touchmove', function (evt) {
          evt.preventDefault();
          _this.draw(evt.targetTouches[0]);
        });
        _this.context.drawImage(_this.img, 0, 0, _this.$canvas.width, _this.$canvas.height);
      };

      // End of WebComponentsReady Event
    });

    this.on('afterConnect', function (_) {});

    // End of constructor
  }

  _createClass(PLAYBULB, [{
    key: 'draw',
    value: function draw(evt) {
      // Refresh canvas in case user zooms and devicePixelRatio changes.
      this.$canvas.width = 300 * devicePixelRatio;
      this.$canvas.height = 300 * devicePixelRatio;
      this.context.drawImage(this.img, 0, 0, this.$canvas.width, this.$canvas.height);

      var rect = this.$canvas.getBoundingClientRect();
      var x = Math.round((evt.clientX - rect.left) * devicePixelRatio);
      var y = Math.round((evt.clientY - rect.top) * devicePixelRatio);
      var data = this.context.getImageData(0, 0, this.$canvas.width, this.$canvas.height).data;

      r = data[(this.$canvas.width * y + x) * 4];
      g = data[(this.$canvas.width * y + x) * 4 + 1];
      b = data[(this.$canvas.width * y + x) * 4 + 2];

      this.changeColor();

      this.context.beginPath();
      this.context.arc(x, y + 2, 10 * devicePixelRatio, 0, 2 * Math.PI, false);
      this.context.shadowColor = '#333';
      this.context.shadowBlur = 4 * devicePixelRatio;
      this.context.fillStyle = 'white';
      this.context.fill();
    }
  }, {
    key: 'changeColor',
    value: function changeColor() {
      if (this.colorChanging) {
        return;
      }
      this.colorChanging = true;
      var effect = document.querySelector('[name="effectSwitch"]:checked').id;
      switch (effect) {
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
  }, {
    key: 'onColorChanged',
    value: function onColorChanged(rgb) {
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

  }, {
    key: 'setColor',
    value: function setColor(r, g, b) {
      var _this2 = this;

      return Promise.resolve().then(function (_) {
        if (_this2._isEffectSet) {
          // Turn off Color Effect first.
          var data = [0x00, r, g, b, 0x05, 0x00, 0x01, 0x00];
          return _this2.characteristics.get(CANDLE_EFFECT_UUID).writeValue(new Uint8Array(data));
        }
      }).then(function (_) {
        var data = [0x00, r, g, b];
        return _this2.characteristics.get(CANDLE_COLOR_UUID).writeValue(new Uint8Array(data));
      }).then(function (_) {
        return [r, g, b];
      });
    }
  }, {
    key: 'setCandleEffectColor',
    value: function setCandleEffectColor(r, g, b) {
      var _this3 = this;

      var data = [0x00, r, g, b, 0x04, 0x00, 0x01, 0x00];
      return this.characteristics.get(CANDLE_EFFECT_UUID).writeValue(new Uint8Array(data)).then(function (_) {
        _this3._isEffectSet = true;
        return [r, g, b];
      });
    }
  }, {
    key: 'setFlashingColor',
    value: function setFlashingColor(r, g, b) {
      var _this4 = this;

      var data = [0x00, r, g, b, 0x00, 0x00, 0x1F, 0x00];
      return this.characteristics.get(CANDLE_EFFECT_UUID).writeValue(new Uint8Array(data)).then(function (_) {
        _this4._isEffectSet = true;
        return [r, g, b];
      });
    }
  }, {
    key: 'setPulseColor',
    value: function setPulseColor(r, g, b) {
      var _this5 = this;

      var newRed = Math.min(Math.round(r / 64) * 64, 255);
      var newGreen = Math.min(Math.round(g / 64) * 64, 255);
      var newBlue = Math.min(Math.round(b / 64) * 64, 255);
      var data = [0x00, newRed, newGreen, newBlue, 0x01, 0x00, 0x09, 0x00];
      return this.characteristics.get(CANDLE_EFFECT_UUID).writeValue(new Uint8Array(data)).then(function (_) {
        _this5._isEffectSet = true;
        return [r, g, b];
      });
    }
  }, {
    key: 'setRainbow',
    value: function setRainbow() {
      var _this6 = this;

      var data = [0x01, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0x00];
      return this.characteristics.get(CANDLE_EFFECT_UUID).writeValue(new Uint8Array(data)).then(function (_) {
        _this6._isEffectSet = true;
      });
    }
  }, {
    key: 'setRainbowFade',
    value: function setRainbowFade() {
      var _this7 = this;

      var data = [0x01, 0x00, 0x00, 0x00, 0x03, 0x00, 0x26, 0x00];
      return this.characteristics.get(CANDLE_EFFECT_UUID).writeValue(new Uint8Array(data)).then(function (_) {
        _this7._isEffectSet = true;
      });
    }
  }]);

  return PLAYBULB;
})(_libAdapter2['default']);

exports['default'] = PLAYBULB;

window.app = new PLAYBULB();
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvMDEwMDY1MjEvZGV2L3NpbXBsZS13ZWJibHVldG9vdGgvY2FuZGxlL2FwcC5qcyIsIi9Vc2Vycy8wMTAwNjUyMS9kZXYvc2ltcGxlLXdlYmJsdWV0b290aC9saWIvYWRhcHRlci5qcyIsIm5vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsWUFBWSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUVPLGdCQUFnQjs7OztBQUVwQyxJQUFNLG1CQUFtQixHQUFHLE1BQU0sQ0FBQztBQUNuQyxJQUFNLHVCQUF1QixHQUFHLE1BQU0sQ0FBQztBQUN2QyxJQUFNLGlCQUFpQixHQUFHLE1BQU0sQ0FBQztBQUNqQyxJQUFNLGtCQUFrQixHQUFHLE1BQU0sQ0FBQztBQUNsQyxJQUFNLDhCQUE4QixHQUFHLE1BQU0sQ0FBQztBQUM5QyxJQUFJLENBQUMsR0FBRyxHQUFHO0lBQUUsQ0FBQyxHQUFHLEdBQUc7SUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDOztJQUVULFFBQVE7WUFBUixRQUFROztBQUNoQixXQURRLFFBQVEsR0FDYjs7OzBCQURLLFFBQVE7O0FBR3pCLFFBQU0sTUFBTSxHQUFHO0FBQ2IsYUFBTyxFQUFDLENBQUM7QUFDUCxnQkFBUSxFQUFDLENBQUUsbUJBQW1CLENBQUU7T0FDakMsQ0FBQztBQUNGLHNCQUFnQixFQUFFLENBQUMsaUJBQWlCLENBQUMsRUFBQyxDQUFDOztBQUV6QyxRQUFJLGtCQUFrQixHQUFHLEVBQUUsQ0FBQztBQUM1QixzQkFBa0IsQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQ3hDLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsa0JBQWtCLEVBQ2xCLDhCQUE4QixDQUFDLENBQUM7QUFDbEMsc0JBQWtCLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDOztBQUUxRCwr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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IEFkYXB0ZXIgZnJvbSAnLi4vbGliL2FkYXB0ZXInO1xuXG5jb25zdCBDQU5ETEVfU0VSVklDRV9VVUlEID0gMHhGRjAyO1xuY29uc3QgQ0FORExFX0RFVklDRV9OQU1FX1VVSUQgPSAweEZGRkY7XG5jb25zdCBDQU5ETEVfQ09MT1JfVVVJRCA9IDB4RkZGQztcbmNvbnN0IENBTkRMRV9FRkZFQ1RfVVVJRCA9IDB4RkZGQjtcbmNvbnN0IENBTkRMRV9CTE9XX05PVElGSUNBVElPTlNfVVVJRCA9IDB4MkEzNztcbmxldCByID0gMjU1LCBnID0gMjU1LCBiID0gMjU1O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQTEFZQlVMQiBleHRlbmRzIEFkYXB0ZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIGNvbnN0IGZpbHRlciA9IHtcbiAgICAgIGZpbHRlcnM6W3tcbiAgICAgICAgc2VydmljZXM6WyBDQU5ETEVfU0VSVklDRV9VVUlEIF1cbiAgICAgIH1dLFxuICAgICAgb3B0aW9uYWxTZXJ2aWNlczogWydiYXR0ZXJ5X3NlcnZpY2UnXX07XG5cbiAgICBsZXQgY2hhcmFjdGVyaXN0aWNMaXN0ID0ge307XG4gICAgY2hhcmFjdGVyaXN0aWNMaXN0W0NBTkRMRV9TRVJWSUNFX1VVSURdID0gW1xuICAgICAgQ0FORExFX0RFVklDRV9OQU1FX1VVSUQsXG4gICAgICBDQU5ETEVfQ09MT1JfVVVJRCxcbiAgICAgIENBTkRMRV9FRkZFQ1RfVVVJRCxcbiAgICAgIENBTkRMRV9CTE9XX05PVElGSUNBVElPTlNfVVVJRF07XG4gICAgY2hhcmFjdGVyaXN0aWNMaXN0WydiYXR0ZXJ5X3NlcnZpY2UnXSA9IFsnYmF0dGVyeV9sZXZlbCddO1xuXG4gICAgc3VwZXIoZmlsdGVyLCBjaGFyYWN0ZXJpc3RpY0xpc3QpO1xuXG4gICAgdGhpcy5jb2xvckNoYW5naW5nID0gZmFsc2U7XG4gICAgdGhpcy5faXNFZmZlY3RTZXQgPSBmYWxzZTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ1dlYkNvbXBvbmVudHNSZWFkeScsICgpID0+IHtcblxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI25vRWZmZWN0JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNoYW5nZUNvbG9yLmJpbmQodGhpcykpO1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NhbmRsZUVmZmVjdCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5jaGFuZ2VDb2xvci5iaW5kKHRoaXMpKTtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNmbGFzaGluZycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5jaGFuZ2VDb2xvci5iaW5kKHRoaXMpKTtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwdWxzZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5jaGFuZ2VDb2xvci5iaW5kKHRoaXMpKTtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyYWluYm93JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNoYW5nZUNvbG9yLmJpbmQodGhpcykpO1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JhaW5ib3dGYWRlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNoYW5nZUNvbG9yLmJpbmQodGhpcykpO1xuXG4gICAgICB0aGlzLiRjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdjYW52YXMnKTtcblxuICAgICAgdGhpcy5pbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgIHRoaXMuaW1nLnNyYyA9ICdjb2xvci13aGVlbC5wbmcnXG4gICAgICB0aGlzLmltZy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuJGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2NhbnZhcycpO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSB0aGlzLiRjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgICB0aGlzLiRjYW52YXMud2lkdGggPSAzMDAgKiBkZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICB0aGlzLiRjYW52YXMuaGVpZ2h0ID0gMzAwICogZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgdGhpcy4kY2FudmFzLnN0eWxlLndpZHRoID0gXCIzMDBweFwiO1xuICAgICAgICB0aGlzLiRjYW52YXMuc3R5bGUuaGVpZ2h0ID0gXCIzMDBweFwiO1xuXG4gICAgICAgIHRoaXMuJGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy4kY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIGV2dCA9PiB7XG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdGhpcy5kcmF3KGV2dC50YXJnZXRUb3VjaGVzWzBdKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5kcmF3SW1hZ2UodGhpcy5pbWcsIDAsIDAsIHRoaXMuJGNhbnZhcy53aWR0aCwgdGhpcy4kY2FudmFzLmhlaWdodCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEVuZCBvZiBXZWJDb21wb25lbnRzUmVhZHkgRXZlbnRcbiAgICB9KTtcblxuICAgIHRoaXMub24oJ2FmdGVyQ29ubmVjdCcsIF8gPT4ge1xuICAgIH0pXG5cbiAgLy8gRW5kIG9mIGNvbnN0cnVjdG9yXG4gIH1cblxuICBkcmF3KGV2dCkge1xuICAgIC8vIFJlZnJlc2ggY2FudmFzIGluIGNhc2UgdXNlciB6b29tcyBhbmQgZGV2aWNlUGl4ZWxSYXRpbyBjaGFuZ2VzLlxuICAgIHRoaXMuJGNhbnZhcy53aWR0aCA9IDMwMCAqIGRldmljZVBpeGVsUmF0aW87XG4gICAgdGhpcy4kY2FudmFzLmhlaWdodCA9IDMwMCAqIGRldmljZVBpeGVsUmF0aW87XG4gICAgdGhpcy5jb250ZXh0LmRyYXdJbWFnZSh0aGlzLmltZywgMCwgMCwgdGhpcy4kY2FudmFzLndpZHRoLCB0aGlzLiRjYW52YXMuaGVpZ2h0KTtcblxuICAgIHZhciByZWN0ID0gdGhpcy4kY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHZhciB4ID0gTWF0aC5yb3VuZCgoZXZ0LmNsaWVudFggLSByZWN0LmxlZnQpICogZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgdmFyIHkgPSBNYXRoLnJvdW5kKChldnQuY2xpZW50WSAtIHJlY3QudG9wKSAqIGRldmljZVBpeGVsUmF0aW8pO1xuICAgIHZhciBkYXRhID0gdGhpcy5jb250ZXh0LmdldEltYWdlRGF0YSgwLCAwLCB0aGlzLiRjYW52YXMud2lkdGgsIHRoaXMuJGNhbnZhcy5oZWlnaHQpLmRhdGE7XG5cbiAgICByID0gZGF0YVsoKHRoaXMuJGNhbnZhcy53aWR0aCAqIHkpICsgeCkgKiA0XTtcbiAgICBnID0gZGF0YVsoKHRoaXMuJGNhbnZhcy53aWR0aCAqIHkpICsgeCkgKiA0ICsgMV07XG4gICAgYiA9IGRhdGFbKCh0aGlzLiRjYW52YXMud2lkdGggKiB5KSArIHgpICogNCArIDJdO1xuXG4gICAgdGhpcy5jaGFuZ2VDb2xvcigpO1xuXG4gICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuY29udGV4dC5hcmMoeCwgeSArIDIsIDEwICogZGV2aWNlUGl4ZWxSYXRpbywgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcbiAgICB0aGlzLmNvbnRleHQuc2hhZG93Q29sb3IgPSAnIzMzMyc7XG4gICAgdGhpcy5jb250ZXh0LnNoYWRvd0JsdXIgPSA0ICogZGV2aWNlUGl4ZWxSYXRpbztcbiAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gJ3doaXRlJztcbiAgICB0aGlzLmNvbnRleHQuZmlsbCgpO1xuICB9O1xuXG4gIGNoYW5nZUNvbG9yKCkge1xuICAgIGlmICh0aGlzLmNvbG9yQ2hhbmdpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5jb2xvckNoYW5naW5nID0gdHJ1ZTtcbiAgICB2YXIgZWZmZWN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW25hbWU9XCJlZmZlY3RTd2l0Y2hcIl06Y2hlY2tlZCcpLmlkO1xuICAgIHN3aXRjaChlZmZlY3QpIHtcbiAgICAgIGNhc2UgJ25vRWZmZWN0JzpcbiAgICAgICAgdGhpcy5zZXRDb2xvcihyLCBnLCBiKS50aGVuKHRoaXMub25Db2xvckNoYW5nZWQuYmluZCh0aGlzKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY2FuZGxlRWZmZWN0JzpcbiAgICAgICAgdGhpcy5zZXRDYW5kbGVFZmZlY3RDb2xvcihyLCBnLCBiKS50aGVuKHRoaXMub25Db2xvckNoYW5nZWQuYmluZCh0aGlzKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZmxhc2hpbmcnOlxuICAgICAgICB0aGlzLnNldEZsYXNoaW5nQ29sb3IociwgZywgYikudGhlbih0aGlzLm9uQ29sb3JDaGFuZ2VkLmJpbmQodGhpcykpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3B1bHNlJzpcbiAgICAgICAgdGhpcy5zZXRQdWxzZUNvbG9yKHIsIGcsIGIpLnRoZW4odGhpcy5vbkNvbG9yQ2hhbmdlZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyYWluYm93JzpcbiAgICAgICAgdGhpcy5zZXRSYWluYm93KCkudGhlbih0aGlzLm9uQ29sb3JDaGFuZ2VkLmJpbmQodGhpcykpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3JhaW5ib3dGYWRlJzpcbiAgICAgICAgdGhpcy5zZXRSYWluYm93RmFkZSgpLnRoZW4odGhpcy5vbkNvbG9yQ2hhbmdlZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgb25Db2xvckNoYW5nZWQocmdiKSB7XG4gICAgaWYgKHJnYikge1xuICAgICAgY29uc29sZS5sb2coJ0NvbG9yIGNoYW5nZWQgdG8gJyArIHJnYik7XG4gICAgICByID0gcmdiWzBdO1xuICAgICAgZyA9IHJnYlsxXTtcbiAgICAgIGIgPSByZ2JbMl07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdDb2xvciBjaGFuZ2VkJyk7XG4gICAgfVxuICAgIHRoaXMuY29sb3JDaGFuZ2luZyA9IGZhbHNlO1xuICB9XG5cbiAgLypcbiAgICogQ2FuZGxlIFNlcnZpY2VcbiAgICovXG5cbiAgc2V0Q29sb3IociwgZywgYikge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgICAgLnRoZW4oXyA9PiB7XG4gICAgICAgIGlmICh0aGlzLl9pc0VmZmVjdFNldCkge1xuICAgICAgICAgIC8vIFR1cm4gb2ZmIENvbG9yIEVmZmVjdCBmaXJzdC5cbiAgICAgICAgICBsZXQgZGF0YSA9IFsweDAwLCByLCBnLCBiLCAweDA1LCAweDAwLCAweDAxLCAweDAwXTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jaGFyYWN0ZXJpc3RpY3MuZ2V0KENBTkRMRV9FRkZFQ1RfVVVJRCkud3JpdGVWYWx1ZShuZXcgVWludDhBcnJheShkYXRhKSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC50aGVuKF8gPT4ge1xuICAgICAgICBsZXQgZGF0YSA9IFsweDAwLCByLCBnLCBiXTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhcmFjdGVyaXN0aWNzLmdldChDQU5ETEVfQ09MT1JfVVVJRCkud3JpdGVWYWx1ZShuZXcgVWludDhBcnJheShkYXRhKSlcbiAgICAgIH0pXG4gICAgICAudGhlbihfID0+IFtyLGcsYl0pO1xuICB9XG5cbiAgc2V0Q2FuZGxlRWZmZWN0Q29sb3IociwgZywgYikge1xuICAgIGxldCBkYXRhID0gWzB4MDAsIHIsIGcsIGIsIDB4MDQsIDB4MDAsIDB4MDEsIDB4MDBdO1xuICAgIHJldHVybiB0aGlzLmNoYXJhY3RlcmlzdGljcy5nZXQoQ0FORExFX0VGRkVDVF9VVUlEKS53cml0ZVZhbHVlKG5ldyBVaW50OEFycmF5KGRhdGEpKVxuICAgICAgLnRoZW4oXyA9PiB7XG4gICAgICAgIHRoaXMuX2lzRWZmZWN0U2V0ID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIFtyLGcsYl07XG4gICAgICB9KTtcbiAgfVxuICBzZXRGbGFzaGluZ0NvbG9yKHIsIGcsIGIpIHtcbiAgICBsZXQgZGF0YSA9IFsweDAwLCByLCBnLCBiLCAweDAwLCAweDAwLCAweDFGLCAweDAwXTtcbiAgICByZXR1cm4gdGhpcy5jaGFyYWN0ZXJpc3RpY3MuZ2V0KENBTkRMRV9FRkZFQ1RfVVVJRCkud3JpdGVWYWx1ZShuZXcgVWludDhBcnJheShkYXRhKSlcbiAgICAgIC50aGVuKF8gPT4ge1xuICAgICAgICB0aGlzLl9pc0VmZmVjdFNldCA9IHRydWU7XG4gICAgICAgIHJldHVybiBbcixnLGJdO1xuICAgICAgfSk7XG4gIH1cbiAgc2V0UHVsc2VDb2xvcihyLCBnLCBiKSB7XG4gICAgbGV0IG5ld1JlZCA9IE1hdGgubWluKE1hdGgucm91bmQociAvIDY0KSAqIDY0LCAyNTUpO1xuICAgIGxldCBuZXdHcmVlbiA9IE1hdGgubWluKE1hdGgucm91bmQoZyAvIDY0KSAqIDY0LCAyNTUpO1xuICAgIGxldCBuZXdCbHVlID0gTWF0aC5taW4oTWF0aC5yb3VuZChiIC8gNjQpICogNjQsIDI1NSk7XG4gICAgbGV0IGRhdGEgPSBbMHgwMCwgbmV3UmVkLCBuZXdHcmVlbiwgbmV3Qmx1ZSwgMHgwMSwgMHgwMCwgMHgwOSwgMHgwMF07XG4gICAgcmV0dXJuIHRoaXMuY2hhcmFjdGVyaXN0aWNzLmdldChDQU5ETEVfRUZGRUNUX1VVSUQpLndyaXRlVmFsdWUobmV3IFVpbnQ4QXJyYXkoZGF0YSkpXG4gICAgICAudGhlbihfID0+IHtcbiAgICAgICAgdGhpcy5faXNFZmZlY3RTZXQgPSB0cnVlO1xuICAgICAgICByZXR1cm4gW3IsZyxiXTtcbiAgICAgIH0pO1xuICB9XG4gIHNldFJhaW5ib3coKSB7XG4gICAgbGV0IGRhdGEgPSBbMHgwMSwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMiwgMHgwMCwgMHgwMSwgMHgwMF07XG4gICAgcmV0dXJuIHRoaXMuY2hhcmFjdGVyaXN0aWNzLmdldChDQU5ETEVfRUZGRUNUX1VVSUQpLndyaXRlVmFsdWUobmV3IFVpbnQ4QXJyYXkoZGF0YSkpXG4gICAgICAudGhlbihfID0+IHtcbiAgICAgICAgdGhpcy5faXNFZmZlY3RTZXQgPSB0cnVlO1xuICAgICAgfSk7XG4gIH1cbiAgc2V0UmFpbmJvd0ZhZGUoKSB7XG4gICAgbGV0IGRhdGEgPSBbMHgwMSwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMywgMHgwMCwgMHgyNiwgMHgwMF07XG4gICAgcmV0dXJuIHRoaXMuY2hhcmFjdGVyaXN0aWNzLmdldChDQU5ETEVfRUZGRUNUX1VVSUQpLndyaXRlVmFsdWUobmV3IFVpbnQ4QXJyYXkoZGF0YSkpXG4gICAgICAudGhlbihfID0+IHtcbiAgICAgICAgdGhpcy5faXNFZmZlY3RTZXQgPSB0cnVlO1xuICAgICAgfSk7XG4gIH1cblxufVxud2luZG93LmFwcCA9IG5ldyBQTEFZQlVMQigpO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcbmNvbnN0IGRlYnVnID0gdHJ1ZTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWRhcHRlciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKGZpbHRlciwgY2hhcmFjdGVyaXN0aWNMaXN0KSB7XG5cbiAgICBzdXBlcigpO1xuICAgIHRoaXMuY2hhcmFjdGVyaXN0aWNzID0gbmV3IE1hcCgpO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignV2ViQ29tcG9uZW50c1JlYWR5JywgKCkgPT4ge1xuICAgICAgdGhpcy4kY29ubmVjdFRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb25uZWN0Jyk7XG4gICAgICB0aGlzLiRwcm9ncmVzcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwcm9ncmVzcycpO1xuICAgICAgdGhpcy4kZGlhbG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RpYWxvZycpO1xuICAgICAgdGhpcy4kbWVzc2FnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtZXNzYWdlJyk7XG4gICAgICB0aGlzLiRwcm9ncmVzcy5oaWRkZW4gPSB0cnVlO1xuICAgICAgdGhpcy5idXN5ID0gZmFsc2U7XG4gICAgICB0aGlzLmdhdHRTZXJ2ZXIgPSBudWxsO1xuICAgICAgdGhpcy5jaGFyYWN0ZXJpc3RpY3MgPSBuZXcgTWFwKCk7XG5cbiAgICAgIC8vIENoZWNrIGlmIGJyb3dzZXIgc3VwcG9ydHMgV2ViIEJsdWV0b290aCBBUEkuXG4gICAgICBpZiAobmF2aWdhdG9yLmJsdWV0b290aCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuby1ibHVldG9vdGhcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuby1ibHVldG9vdGhcIikub3BlbigpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLiRjb25uZWN0VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICB0aGlzLiRwcm9ncmVzcy5oaWRkZW4gPSBmYWxzZTtcbiAgICAgICAgY29uc29sZS5sb2coJ2Nvbm5lY3RpbmcuLi4nKTtcbiAgICAgICAgaWYodHJ1ZSkgeyAvLyBUT0RPXG4gICAgICAgICAgbmF2aWdhdG9yLmJsdWV0b290aC5yZXF1ZXN0RGV2aWNlKGZpbHRlcilcbiAgICAgICAgICAgIC50aGVuKGRldmljZSA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCc+IEZvdW5kICcgKyBkZXZpY2UubmFtZSk7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDb25uZWN0aW5nIHRvIEdBVFQgU2VydmVyLi4uJyk7XG4gICAgICAgICAgICAgIHJldHVybiBkZXZpY2UuZ2F0dC5jb25uZWN0KCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oc2VydmVyID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5nYXR0U2VydmVyID0gc2VydmVyO1xuICAgICAgICAgICAgICAvLyBHZXQgc2VydmljZVxuICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoT2JqZWN0LmtleXMoY2hhcmFjdGVyaXN0aWNMaXN0KS5tYXAodGFyZ2V0U2VydmljZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgX3NlcnZpY2UgPSAoaXNOYU4odGFyZ2V0U2VydmljZSkpID8gdGFyZ2V0U2VydmljZSA6IHBhcnNlSW50KHRhcmdldFNlcnZpY2UpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2F0dFNlcnZlci5nZXRQcmltYXJ5U2VydmljZShfc2VydmljZSlcbiAgICAgICAgICAgICAgICAgIC50aGVuKHNlcnZpY2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgY2hhcmFjdGVyaXN0aWNcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGNoYXJhY3RlcmlzdGljTGlzdFtfc2VydmljZV0ubWFwKHRhcmdldENoYXJhY3RlcmlzdGljID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRhcmdldENoYXJhY3RlcmlzdGljKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oY2hhcmFjdGVyaXN0aWMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnPiBGb3VuZCBjaGFyYWN0ZXJpc3RpYycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJhY3RlcmlzdGljcy5zZXQodGFyZ2V0Q2hhcmFjdGVyaXN0aWMsIGNoYXJhY3RlcmlzdGljKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdhZnRlckNvbm5lY3QnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH0pKS50aGVuKF8gPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuJHByb2dyZXNzLmhpZGRlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgLy90aGlzLmVtaXQoJ2FmdGVyQ29ubmVjdCcpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihfID0+IHtcbiAgICAgICAgICAgICAgLy90aGlzLmVtaXQoJ2FmdGVyQ29ubmVjdCcpLmJpbmQodGhpcyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3IuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgaGFuZGxlRXJyb3IoZXJyb3IpIHtcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgLy9yZXNldFZhcmlhYmxlcygpO1xuICAgIC8vdGhpcy4kZGlhbG9nLm9wZW4oKTtcbiAgfVxuXG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LicpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuXG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgdmFyIG07XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCFlbWl0dGVyLl9ldmVudHMgfHwgIWVtaXR0ZXIuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSAwO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKGVtaXR0ZXIuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gMTtcbiAgZWxzZVxuICAgIHJldCA9IGVtaXR0ZXIuX2V2ZW50c1t0eXBlXS5sZW5ndGg7XG4gIHJldHVybiByZXQ7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iXX0=
