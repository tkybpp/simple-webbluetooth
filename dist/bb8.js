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

var BB8 = (function (_Adapter) {
  _inherits(BB8, _Adapter);

  function BB8() {
    var _this = this;

    _classCallCheck(this, BB8);

    var filter = {
      filters: [{
        services: ['22bb746f-2bb0-7554-2d6f-726568705327']
      }, {
        // Some BB8 toys advertise -2ba0- instead of -2bb0-.
        services: ['22bb746f-2ba0-7554-2d6f-726568705327']
      }]
    };

    var characteristicList = {};
    characteristicList['22bb746f-2bb0-7554-2d6f-726568705327'] = ['22bb746f-2bbd-7554-2d6f-726568705327', '22bb746f-2bb2-7554-2d6f-726568705327', '22bb746f-2bbf-7554-2d6f-726568705327'];
    characteristicList['22bb746f-2ba0-7554-2d6f-726568705327'] = ['22bb746f-2ba1-7554-2d6f-726568705327'];

    _get(Object.getPrototypeOf(BB8.prototype), 'constructor', this).call(this, filter, characteristicList);

    document.addEventListener('WebComponentsReady', function () {
      _this.controlCharacteristic = null;
      _this.sequence = 0;
      _this.busy = false;

      // End of WebComponentsReady Event
    });

    // Notice : This is bad prosses...
    this.count = 0;
    for (var service in characteristicList) {
      for (var _ in characteristicList[service]) {
        this.count++;
      }
    }
    this.roopConunt = 1;
    this.on('afterConnect', function (_) {
      if (_this.roopConunt !== _this.count) {
        _this.roopConunt++;
      } else {
        var bytes = new Uint8Array('011i3'.split('').map(function (c) {
          return c.charCodeAt();
        }));
        _this.characteristics.get('22bb746f-2bbd-7554-2d6f-726568705327').writeValue(bytes).then(function () {
          console.log('Anti DOS write done.');
        }).then(function () {
          // Get TX Power characteristic
          var array = new Uint8Array([0x07]);
          return _this.characteristics.get("22bb746f-2bb2-7554-2d6f-726568705327").writeValue(array).then(function () {
            console.log('TX Power write done.');
          });
        }).then(function () {
          // Get Wake CPU characteristic
          var array = new Uint8Array([0x01]);
          return _this.characteristics.get("22bb746f-2bbf-7554-2d6f-726568705327").writeValue(array).then(function () {
            console.log('Wake CPU write done.');
          });
        }).then(function () {
          // Get Wake CPU characteristic
          var array = new Uint8Array([0x01]);
          _this.controlCharacteristic = _this.characteristics.get("22bb746f-2ba1-7554-2d6f-726568705327");
          return _this.setColor(0, 250, 0);
        })['catch'](_this.handleError);

        var joystick = new RetroJoyStick({
          retroStickElement: document.querySelector('#retrostick')
        });
        joystick.subscribe('change', function (stick) {
          _this.roll(stick.angle);
        });
      }
    });

    // End of constructor
  }

  _createClass(BB8, [{
    key: 'setColor',
    value: function setColor(r, g, b) {
      var _this2 = this;

      console.log('Set color: r=' + r + ',g=' + g + ',b=' + b);
      if (this.busy) {
        // Return if another operation pending
        return Promise.resolve();
      }
      this.busy = true;
      var did = 0x02; // Virtual device ID
      var cid = 0x20; // Set RGB LED Output command
      // Color command data: red, green, blue, flag
      var data = new Uint8Array([r, g, b, 0]);
      this.sendCommand(did, cid, data).then(function () {
        _this2.busy = false;
      })['catch'](this.handleError);
    }
  }, {
    key: 'sendCommand',
    value: function sendCommand(did, cid, data) {
      // Create client command packets
      // API docs: https://github.com/orbotix/DeveloperResources/blob/master/docs/Sphero_API_1.50.pdf
      // Next sequence number
      var seq = this.sequence & 255;
      this.sequence += 1;
      // Start of packet #2
      var sop2 = 0xfc;
      sop2 |= 1; // Answer
      sop2 |= 2; // Reset timeout
      // Data length
      var dlen = data.byteLength + 1;
      var sum = data.reduce(function (a, b) {
        return a + b;
      });
      // Checksum
      var chk = sum + did + cid + seq + dlen & 255;
      chk ^= 255;
      var checksum = new Uint8Array([chk]);
      var packets = new Uint8Array([0xff, sop2, did, cid, seq, dlen]);
      // Append arrays: packet + data + checksum
      var array = new Uint8Array(packets.byteLength + data.byteLength + checksum.byteLength);
      array.set(packets, 0);
      array.set(data, packets.byteLength);
      array.set(checksum, packets.byteLength + data.byteLength);
      return this.controlCharacteristic.writeValue(array).then(function () {
        console.log('Command write done.');
      });
    }
  }, {
    key: 'roll',
    value: function roll(heading) {
      var _this3 = this;

      console.log('Roll heading=' + heading);
      if (this.busy) {
        // Return if another operation pending
        return Promise.resolve();
      }
      this.busy = true;
      var did = 0x02; // Virtual device ID
      var cid = 0x30; // Roll command
      // Roll command data: speed, heading (MSB), heading (LSB), state
      var data = new Uint8Array([10, heading >> 8, heading & 0xFF, 1]);
      this.sendCommand(did, cid, data).then(function () {
        _this3.busy = false;
      })['catch'](this.handleError);
    }
  }]);

  return BB8;
})(_libAdapter2['default']);

exports['default'] = BB8;

window.app = new BB8();
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvMDEwMDY1MjEvZGV2L3NpbXBsZS13ZWJibHVldG9vdGgvYmI4L2FwcC5qcyIsIi9Vc2Vycy8wMTAwNjUyMS9kZXYvc2ltcGxlLXdlYmJsdWV0b290aC9saWIvYWRhcHRlci5qcyIsIm5vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsWUFBWSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUVPLGdCQUFnQjs7OztJQUVmLEdBQUc7WUFBSCxHQUFHOztBQUNYLFdBRFEsR0FBRyxHQUNSOzs7MEJBREssR0FBRzs7QUFHcEIsUUFBTSxNQUFNLEdBQUc7QUFDYixhQUFPLEVBQUUsQ0FBQztBQUNSLGdCQUFRLEVBQUUsQ0FBQyxzQ0FBc0MsQ0FBQztPQUNuRCxFQUFFOztBQUVELGdCQUFRLEVBQUUsQ0FBQyxzQ0FBc0MsQ0FBQztPQUNuRCxDQUFDO0tBQ0gsQ0FBQzs7QUFFRixRQUFJLGtCQUFrQixHQUFHLEVBQUUsQ0FBQztBQUM1QixzQkFBa0IsQ0FBQyxzQ0FBc0MsQ0FBQyxHQUFHLENBQUMsc0NBQXNDLEVBQUMsc0NBQXNDLEVBQUMsc0NBQXNDLENBQUMsQ0FBQztBQUNwTCxzQkFBa0IsQ0FBQyxzQ0FBc0MsQ0FBQyxHQUFHLENBQUMsc0NBQXNDLENBQUMsQ0FBQzs7QUFFdEcsK0JBaEJpQixHQUFHLDZDQWdCZCxNQUFNLEVBQUUsa0JBQWtCLEVBQUU7O0FBRWxDLFlBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFBRSxZQUFNO0FBQ3BELFlBQUsscUJBQXFCLEdBQUcsSUFBSSxDQUFDO0FBQ2xDLFlBQUssUUFBUSxHQUFHLENBQUMsQ0FBQztBQUNsQixZQUFLLElBQUksR0FBRyxLQUFLLENBQUM7OztLQUduQixDQUFDLENBQUM7OztBQUdILFFBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsU0FB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IEFkYXB0ZXIgZnJvbSAnLi4vbGliL2FkYXB0ZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCQjggZXh0ZW5kcyBBZGFwdGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICBjb25zdCBmaWx0ZXIgPSB7XG4gICAgICBmaWx0ZXJzOiBbe1xuICAgICAgICBzZXJ2aWNlczogWycyMmJiNzQ2Zi0yYmIwLTc1NTQtMmQ2Zi03MjY1Njg3MDUzMjcnXVxuICAgICAgfSwge1xuICAgICAgICAvLyBTb21lIEJCOCB0b3lzIGFkdmVydGlzZSAtMmJhMC0gaW5zdGVhZCBvZiAtMmJiMC0uXG4gICAgICAgIHNlcnZpY2VzOiBbJzIyYmI3NDZmLTJiYTAtNzU1NC0yZDZmLTcyNjU2ODcwNTMyNyddXG4gICAgICB9XVxuICAgIH07XG5cbiAgICBsZXQgY2hhcmFjdGVyaXN0aWNMaXN0ID0ge307XG4gICAgY2hhcmFjdGVyaXN0aWNMaXN0WycyMmJiNzQ2Zi0yYmIwLTc1NTQtMmQ2Zi03MjY1Njg3MDUzMjcnXSA9IFsnMjJiYjc0NmYtMmJiZC03NTU0LTJkNmYtNzI2NTY4NzA1MzI3JywnMjJiYjc0NmYtMmJiMi03NTU0LTJkNmYtNzI2NTY4NzA1MzI3JywnMjJiYjc0NmYtMmJiZi03NTU0LTJkNmYtNzI2NTY4NzA1MzI3J107XG4gICAgY2hhcmFjdGVyaXN0aWNMaXN0WycyMmJiNzQ2Zi0yYmEwLTc1NTQtMmQ2Zi03MjY1Njg3MDUzMjcnXSA9IFsnMjJiYjc0NmYtMmJhMS03NTU0LTJkNmYtNzI2NTY4NzA1MzI3J107XG5cbiAgICBzdXBlcihmaWx0ZXIsIGNoYXJhY3RlcmlzdGljTGlzdCk7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdXZWJDb21wb25lbnRzUmVhZHknLCAoKSA9PiB7XG4gICAgICB0aGlzLmNvbnRyb2xDaGFyYWN0ZXJpc3RpYyA9IG51bGw7XG4gICAgICB0aGlzLnNlcXVlbmNlID0gMDtcbiAgICAgIHRoaXMuYnVzeSA9IGZhbHNlO1xuXG4gICAgICAvLyBFbmQgb2YgV2ViQ29tcG9uZW50c1JlYWR5IEV2ZW50XG4gICAgfSk7XG5cbiAgICAvLyBOb3RpY2UgOiBUaGlzIGlzIGJhZCBwcm9zc2VzLi4uXG4gICAgdGhpcy5jb3VudCA9IDA7XG4gICAgZm9yICggbGV0IHNlcnZpY2UgaW4gY2hhcmFjdGVyaXN0aWNMaXN0ICkge1xuICAgICAgZm9yICggbGV0IF8gaW4gY2hhcmFjdGVyaXN0aWNMaXN0W3NlcnZpY2VdICkge1xuICAgICAgICB0aGlzLmNvdW50Kys7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucm9vcENvbnVudCA9IDE7XG4gICAgdGhpcy5vbignYWZ0ZXJDb25uZWN0JywgXyA9PiB7XG4gICAgICBpZih0aGlzLnJvb3BDb251bnQgIT09IHRoaXMuY291bnQpe1xuICAgICAgICB0aGlzLnJvb3BDb251bnQrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBieXRlcyA9IG5ldyBVaW50OEFycmF5KCcwMTFpMycuc3BsaXQoJycpLm1hcChjID0+IGMuY2hhckNvZGVBdCgpKSk7XG4gICAgICAgIHRoaXMuY2hhcmFjdGVyaXN0aWNzLmdldCgnMjJiYjc0NmYtMmJiZC03NTU0LTJkNmYtNzI2NTY4NzA1MzI3Jykud3JpdGVWYWx1ZShieXRlcylcbiAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQW50aSBET1Mgd3JpdGUgZG9uZS4nKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIC8vIEdldCBUWCBQb3dlciBjaGFyYWN0ZXJpc3RpY1xuICAgICAgICAgICAgbGV0IGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoWzB4MDddKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoYXJhY3RlcmlzdGljcy5nZXQoXCIyMmJiNzQ2Zi0yYmIyLTc1NTQtMmQ2Zi03MjY1Njg3MDUzMjdcIikud3JpdGVWYWx1ZShhcnJheSlcbiAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnVFggUG93ZXIgd3JpdGUgZG9uZS4nKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAvLyBHZXQgV2FrZSBDUFUgY2hhcmFjdGVyaXN0aWNcbiAgICAgICAgICAgIGxldCBhcnJheSA9IG5ldyBVaW50OEFycmF5KFsweDAxXSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGFyYWN0ZXJpc3RpY3MuZ2V0KFwiMjJiYjc0NmYtMmJiZi03NTU0LTJkNmYtNzI2NTY4NzA1MzI3XCIpLndyaXRlVmFsdWUoYXJyYXkpXG4gICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnV2FrZSBDUFUgd3JpdGUgZG9uZS4nKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIC8vIEdldCBXYWtlIENQVSBjaGFyYWN0ZXJpc3RpY1xuICAgICAgICAgICAgbGV0IGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoWzB4MDFdKTtcbiAgICAgICAgICAgIHRoaXMuY29udHJvbENoYXJhY3RlcmlzdGljID0gdGhpcy5jaGFyYWN0ZXJpc3RpY3MuZ2V0KFwiMjJiYjc0NmYtMmJhMS03NTU0LTJkNmYtNzI2NTY4NzA1MzI3XCIpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0Q29sb3IoMCwgMjUwLCAwKTtcbiAgICAgICAgICB9KS5jYXRjaCh0aGlzLmhhbmRsZUVycm9yKTtcblxuICAgICAgICBsZXQgam95c3RpY2sgPSBuZXcgUmV0cm9Kb3lTdGljayh7XG4gICAgICAgICAgcmV0cm9TdGlja0VsZW1lbnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZXRyb3N0aWNrJylcbiAgICAgICAgfSk7XG4gICAgICAgIGpveXN0aWNrLnN1YnNjcmliZSgnY2hhbmdlJywgc3RpY2sgPT4ge1xuICAgICAgICAgIHRoaXMucm9sbChzdGljay5hbmdsZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBFbmQgb2YgY29uc3RydWN0b3JcbiAgfVxuXG4gIHNldENvbG9yKHIsIGcsIGIpe1xuICAgIGNvbnNvbGUubG9nKCdTZXQgY29sb3I6IHI9JytyKycsZz0nK2crJyxiPScrYik7XG4gICAgaWYgKHRoaXMuYnVzeSkge1xuICAgICAgLy8gUmV0dXJuIGlmIGFub3RoZXIgb3BlcmF0aW9uIHBlbmRpbmdcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gICAgdGhpcy5idXN5ID0gdHJ1ZTtcbiAgICBsZXQgZGlkID0gMHgwMjsgLy8gVmlydHVhbCBkZXZpY2UgSURcbiAgICBsZXQgY2lkID0gMHgyMDsgLy8gU2V0IFJHQiBMRUQgT3V0cHV0IGNvbW1hbmRcbiAgICAvLyBDb2xvciBjb21tYW5kIGRhdGE6IHJlZCwgZ3JlZW4sIGJsdWUsIGZsYWdcbiAgICBsZXQgZGF0YSA9IG5ldyBVaW50OEFycmF5KFtyLCBnLCBiLCAwXSk7XG4gICAgdGhpcy5zZW5kQ29tbWFuZChkaWQsIGNpZCwgZGF0YSkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuYnVzeSA9IGZhbHNlO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9yKTtcbiAgfVxuXG4gIHNlbmRDb21tYW5kKGRpZCwgY2lkLCBkYXRhKSB7XG4gICAgLy8gQ3JlYXRlIGNsaWVudCBjb21tYW5kIHBhY2tldHNcbiAgICAvLyBBUEkgZG9jczogaHR0cHM6Ly9naXRodWIuY29tL29yYm90aXgvRGV2ZWxvcGVyUmVzb3VyY2VzL2Jsb2IvbWFzdGVyL2RvY3MvU3BoZXJvX0FQSV8xLjUwLnBkZlxuICAgIC8vIE5leHQgc2VxdWVuY2UgbnVtYmVyXG4gICAgbGV0IHNlcSA9IHRoaXMuc2VxdWVuY2UgJiAyNTU7XG4gICAgdGhpcy5zZXF1ZW5jZSArPSAxXG4gICAgLy8gU3RhcnQgb2YgcGFja2V0ICMyXG4gICAgbGV0IHNvcDIgPSAweGZjO1xuICAgIHNvcDIgfD0gMTsgLy8gQW5zd2VyXG4gICAgc29wMiB8PSAyOyAvLyBSZXNldCB0aW1lb3V0XG4gICAgLy8gRGF0YSBsZW5ndGhcbiAgICBsZXQgZGxlbiA9IGRhdGEuYnl0ZUxlbmd0aCArIDE7XG4gICAgbGV0IHN1bSA9IGRhdGEucmVkdWNlKChhLCBiKSA9PiB7XG4gICAgICByZXR1cm4gYSArIGI7XG4gICAgfSk7XG4gICAgLy8gQ2hlY2tzdW1cbiAgICBsZXQgY2hrID0gKHN1bSArIGRpZCArIGNpZCArIHNlcSArIGRsZW4pICYgMjU1O1xuICAgIGNoayBePSAyNTU7XG4gICAgbGV0IGNoZWNrc3VtID0gbmV3IFVpbnQ4QXJyYXkoW2Noa10pO1xuICAgIGxldCBwYWNrZXRzID0gbmV3IFVpbnQ4QXJyYXkoWzB4ZmYsIHNvcDIsIGRpZCwgY2lkLCBzZXEsIGRsZW5dKTtcbiAgICAvLyBBcHBlbmQgYXJyYXlzOiBwYWNrZXQgKyBkYXRhICsgY2hlY2tzdW1cbiAgICBsZXQgYXJyYXkgPSBuZXcgVWludDhBcnJheShwYWNrZXRzLmJ5dGVMZW5ndGggKyBkYXRhLmJ5dGVMZW5ndGggKyBjaGVja3N1bS5ieXRlTGVuZ3RoKTtcbiAgICBhcnJheS5zZXQocGFja2V0cywgMCk7XG4gICAgYXJyYXkuc2V0KGRhdGEsIHBhY2tldHMuYnl0ZUxlbmd0aCk7XG4gICAgYXJyYXkuc2V0KGNoZWNrc3VtLCBwYWNrZXRzLmJ5dGVMZW5ndGggKyBkYXRhLmJ5dGVMZW5ndGgpO1xuICAgIHJldHVybiB0aGlzLmNvbnRyb2xDaGFyYWN0ZXJpc3RpYy53cml0ZVZhbHVlKGFycmF5KS50aGVuKCgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdDb21tYW5kIHdyaXRlIGRvbmUuJyk7XG4gICAgfSk7XG4gIH1cblxuICByb2xsKGhlYWRpbmcpIHtcbiAgICBjb25zb2xlLmxvZygnUm9sbCBoZWFkaW5nPScraGVhZGluZyk7XG4gICAgaWYgKHRoaXMuYnVzeSkge1xuICAgICAgLy8gUmV0dXJuIGlmIGFub3RoZXIgb3BlcmF0aW9uIHBlbmRpbmdcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4gICAgdGhpcy5idXN5ID0gdHJ1ZTtcbiAgICBsZXQgZGlkID0gMHgwMjsgLy8gVmlydHVhbCBkZXZpY2UgSURcbiAgICBsZXQgY2lkID0gMHgzMDsgLy8gUm9sbCBjb21tYW5kXG4gICAgLy8gUm9sbCBjb21tYW5kIGRhdGE6IHNwZWVkLCBoZWFkaW5nIChNU0IpLCBoZWFkaW5nIChMU0IpLCBzdGF0ZVxuICAgIGxldCBkYXRhID0gbmV3IFVpbnQ4QXJyYXkoWzEwLCBoZWFkaW5nID4+IDgsIGhlYWRpbmcgJiAweEZGLCAxXSk7XG4gICAgdGhpcy5zZW5kQ29tbWFuZChkaWQsIGNpZCwgZGF0YSkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMuYnVzeSA9IGZhbHNlO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCh0aGlzLmhhbmRsZUVycm9yKTtcbiAgfVxuXG5cbn1cbndpbmRvdy5hcHAgPSBuZXcgQkI4KCk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcbmNvbnN0IGRlYnVnID0gdHJ1ZTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWRhcHRlciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKGZpbHRlciwgY2hhcmFjdGVyaXN0aWNMaXN0KSB7XG5cbiAgICBzdXBlcigpO1xuICAgIHRoaXMuY2hhcmFjdGVyaXN0aWNzID0gbmV3IE1hcCgpO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignV2ViQ29tcG9uZW50c1JlYWR5JywgKCkgPT4ge1xuICAgICAgdGhpcy4kY29ubmVjdFRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb25uZWN0Jyk7XG4gICAgICB0aGlzLiRwcm9ncmVzcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwcm9ncmVzcycpO1xuICAgICAgdGhpcy4kZGlhbG9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RpYWxvZycpO1xuICAgICAgdGhpcy4kbWVzc2FnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtZXNzYWdlJyk7XG4gICAgICB0aGlzLiRwcm9ncmVzcy5oaWRkZW4gPSB0cnVlO1xuICAgICAgdGhpcy5idXN5ID0gZmFsc2U7XG4gICAgICB0aGlzLmdhdHRTZXJ2ZXIgPSBudWxsO1xuICAgICAgdGhpcy5jaGFyYWN0ZXJpc3RpY3MgPSBuZXcgTWFwKCk7XG5cbiAgICAgIC8vIENoZWNrIGlmIGJyb3dzZXIgc3VwcG9ydHMgV2ViIEJsdWV0b290aCBBUEkuXG4gICAgICBpZiAobmF2aWdhdG9yLmJsdWV0b290aCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuby1ibHVldG9vdGhcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuby1ibHVldG9vdGhcIikub3BlbigpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLiRjb25uZWN0VG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICB0aGlzLiRwcm9ncmVzcy5oaWRkZW4gPSBmYWxzZTtcbiAgICAgICAgY29uc29sZS5sb2coJ2Nvbm5lY3RpbmcuLi4nKTtcbiAgICAgICAgaWYodHJ1ZSkgeyAvLyBUT0RPXG4gICAgICAgICAgbmF2aWdhdG9yLmJsdWV0b290aC5yZXF1ZXN0RGV2aWNlKGZpbHRlcilcbiAgICAgICAgICAgIC50aGVuKGRldmljZSA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCc+IEZvdW5kICcgKyBkZXZpY2UubmFtZSk7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDb25uZWN0aW5nIHRvIEdBVFQgU2VydmVyLi4uJyk7XG4gICAgICAgICAgICAgIHJldHVybiBkZXZpY2UuZ2F0dC5jb25uZWN0KCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oc2VydmVyID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5nYXR0U2VydmVyID0gc2VydmVyO1xuICAgICAgICAgICAgICAvLyBHZXQgc2VydmljZVxuICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoT2JqZWN0LmtleXMoY2hhcmFjdGVyaXN0aWNMaXN0KS5tYXAodGFyZ2V0U2VydmljZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgX3NlcnZpY2UgPSAoaXNOYU4odGFyZ2V0U2VydmljZSkpID8gdGFyZ2V0U2VydmljZSA6IHBhcnNlSW50KHRhcmdldFNlcnZpY2UpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2F0dFNlcnZlci5nZXRQcmltYXJ5U2VydmljZShfc2VydmljZSlcbiAgICAgICAgICAgICAgICAgIC50aGVuKHNlcnZpY2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgY2hhcmFjdGVyaXN0aWNcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGNoYXJhY3RlcmlzdGljTGlzdFtfc2VydmljZV0ubWFwKHRhcmdldENoYXJhY3RlcmlzdGljID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRhcmdldENoYXJhY3RlcmlzdGljKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oY2hhcmFjdGVyaXN0aWMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnPiBGb3VuZCBjaGFyYWN0ZXJpc3RpYycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJhY3RlcmlzdGljcy5zZXQodGFyZ2V0Q2hhcmFjdGVyaXN0aWMsIGNoYXJhY3RlcmlzdGljKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdhZnRlckNvbm5lY3QnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH0pKS50aGVuKF8gPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuJHByb2dyZXNzLmhpZGRlbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgLy90aGlzLmVtaXQoJ2FmdGVyQ29ubmVjdCcpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihfID0+IHtcbiAgICAgICAgICAgICAgLy90aGlzLmVtaXQoJ2FmdGVyQ29ubmVjdCcpLmJpbmQodGhpcyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKHRoaXMuaGFuZGxlRXJyb3IuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgaGFuZGxlRXJyb3IoZXJyb3IpIHtcbiAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgLy9yZXNldFZhcmlhYmxlcygpO1xuICAgIC8vdGhpcy4kZGlhbG9nLm9wZW4oKTtcbiAgfVxuXG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LicpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuXG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgdmFyIG07XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCFlbWl0dGVyLl9ldmVudHMgfHwgIWVtaXR0ZXIuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSAwO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKGVtaXR0ZXIuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gMTtcbiAgZWxzZVxuICAgIHJldCA9IGVtaXR0ZXIuX2V2ZW50c1t0eXBlXS5sZW5ndGg7XG4gIHJldHVybiByZXQ7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iXX0=
