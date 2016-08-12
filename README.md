# simple-webbluetooth

## Description
This provide a simple adapter which make is easy to create WebBluetooth application.  
You only have to set filter and service/characteristic identifiers.

## Live demo

- [PLAY BULB CANDLE](https://tkybpp.github.io/simple-webbluetooth/candle/)
- [DOTTI LED DISPLAY](https://tkybpp.github.io/simple-webbluetooth/dotti/)
- [BB-8](https://tkybpp.github.io/simple-webbluetooth/bb8/)

## How to use
You can use these demo on your local environment.  

To use SSL on localhost with WebBluetoothAPI:
  1. Generate key with `openssl genrsa -out localhost.key 2048`
  2. Generate cert with `openssl req -new -x509 -key localhost.key -out localhost.cert -days 3650 -subj /CN=localhost`
  3. Put them in a directory `/keys/`
  4. Start server with  `node server.js`
  5. Now you can visit [`localhost:3000`](https://localhost:3000/name-of-sample-app/) with SSL from your browser.

To update and build js file:
 1. `npm install`
 2. Update/Create js file in each samples
 3. `npm run build:js:(candle|dotti)` to build js file  
      `npm run build:all` can build all file at thesame time
 4. You can also use Watchify `npm rum watch:js:(candle|dotti)`

## Reference

- [Web Bluetooth Specification (Official)](https://webbluetoothcg.github.io/web-bluetooth/) , [(Japanese)](https://tkybpp.github.io/web-bluetooth-jp/)

### Notice
This examples is with reference to these demos:  
[https://github.com/WebBluetoothCG/demos](https://github.com/WebBluetoothCG/demos)


[![Analytics](https://ga-beacon.appspot.com/UA-81839949-3/simple-webbluetooth)](https://github.com/tkybpp/simple-webbluetooth)
