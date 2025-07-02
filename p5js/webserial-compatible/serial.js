(function () {
  "use strict";
  
  // NB(zundel): Updated to replace listening for DOMMutationEvent to MutationObserver pattern
  const observer = new MutationObserver((mutations, obs) => {
    const connectButton = document.querySelector("#connect");

    if (connectButton) {
      console.log("Serial: Connect button detected in DOM");

      function connect() {
        port.connect().then(
          () => {
            connectButton.textContent = "DISCONNECT";

            port.onReceive = (data) => {
              let textDecoder = new TextDecoder();
              console.log(textDecoder.decode(data));
            };
            port.onReceiveError = (error) => {
              console.error(error);
            };
          },
          (error) => {
            console.error("Serial: Failed to connect:", error);
          }
        );
      }

      connectButton.addEventListener("click", function () {
        console.log("Serial: Connect Arduino Clicked");

        if (port) {
          port.disconnect();
          connectButton.textContent = "CONNECT ARDUINO";
          port = null;
        } else {
          serial
            .requestPort()
            .then((selectedPort) => {
              port = selectedPort;
              connect();
            })
            .catch((error) => {
              console.error("Serial: Port request failed:", error);
            });
        }
      });

      obs.disconnect(); // Stop observing once the element is found and initialized
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();

// From https://github.com/webusb/arduino/blob/gh-pages/demos/serial.js
// NB(zundel): Added some logging to help debug USB connectivity problems
var serial = {};

(function () {
  "use strict";

  serial.getPorts = function () {
    console.log("Serial: Calling usb.getDevices()");
    return navigator.usb.getDevices().then((devices) => {
      console.log(devices);
      return devices.map((device) => new serial.Port(device));
    });
  };

  serial.requestPort = function () {
    const filters = [
      { vendorId: 0x2341, productId: 0x8036 },
      { vendorId: 0x2341, productId: 0x8037 },
      { vendorId: 0x2341, productId: 0x804d },
      { vendorId: 0x2341, productId: 0x804e },
      { vendorId: 0x2341, productId: 0x804f },
      { vendorId: 0x2341, productId: 0x8050 },
    ];
    console.log("Serial: Requesting USB Device");
    return navigator.usb
      .requestDevice({ filters: filters })
      .then((device) => {
        console.log("Serial: Got a new USB device", device);
        return new serial.Port(device);
      });
  };

  serial.Port = function (device) {
    this.device_ = device;
  };

  serial.Port.prototype.connect = function () {
    console.log("Serial: Running connect()");
    let readLoop = () => {
      console.log("Serial: Entering readLoop()");
      this.device_.transferIn(5, 64).then(
        (result) => {
          this.onReceive(result.data);
          readLoop();
        },
        (error) => {
          console.log("Error from transferIn:", error);
          this.onReceiveError(error);
        }
      );
    };

    let interfaceToClaim = 2;
    let dev_promise = this.device_
      .open()
      .then(() => {
        console.log("Serial: Open Started");
        if (this.device_.configuration === null) {
          console.log("Serial: Got null configuration");
          return this.device_.selectConfiguration(1);
        }
      })
      .then(() => {
        console.log("Serial: About to claim interface. If this hangs (no Claim complete message), try updating your USB driver. See https://github.com/webusb/arduino/issues/106");
        // Find the interface object
        const targetInterface = this.device_.configuration.interfaces.find(
          (iface) => iface.interfaceNumber === interfaceToClaim
        );

        if (!targetInterface) {
          console.error(`Interface ${interfaceToClaim} not found.`);
          alert(
            `Serial: Error claiming WebUSB interface ${interfaceToClaim}. Is your attached device running the WebUSB sketch?`
          );
          return;
        }
        let result = this.device_.claimInterface(interfaceToClaim);
        return result;
      })
      .then(() => {
        console.log("Serial: Claim complete. Selecting Alternate Interface");
        return this.device_.selectAlternateInterface(2, 0);
      })
      .then(() => {
        console.log("Serial: controlTransferOut()");
        return this.device_.controlTransferOut({
          requestType: "class",
          recipient: "interface",
          request: 0x22,
          value: 0x01,
          index: 0x02,
        });
      })
      .then(() => {
        readLoop();
      });

    console.log("Serial: device open returned: ", dev_promise);
    return dev_promise;
  };

  serial.Port.prototype.disconnect = function () {
    return this.device_
      .controlTransferOut({
        requestType: "class",
        recipient: "interface",
        request: 0x22,
        value: 0x00,
        index: 0x02,
      })
      .then(() => this.device_.close());
  };

  serial.Port.prototype.send = function (data) {
    console.log("Serial: sending data: ")
    return this.device_.transferOut(4, data);
  };
})();
