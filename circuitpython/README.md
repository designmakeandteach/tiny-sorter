# CircuitPython driver for Tiny Sorter

This is a driver for the [Tiny Sorter](https://designmakeandteach.com/projects/tiny-sorter) project.

It communicates with a web page running using WebSerial.

## Installing

1. Copy `code.py` to the CIRCUITPY drive on your computer.
2. Find the Adafruit Circuit Python Bundle for the version of CircuitPython
installed on your microcontroller.
3. Copy the folder `lib/adafruit_motor` to the `lib` folder on
the CIRCUITPY drive. Download from the
[CircuitPython Libraries](https://circuitpython.org/libraries) website.
4. Attach your servo and test. You may need to modify this line of
code to match the pin you are using for the servo:

```Python
SERVO_PIN = board.GP2
```

## Tested Devices

This was tested with CircuitPython 9.x on the following devices:

- Raspberry Pi Pico
- Raspberry Pi Pico W
- Raspberry Pi Pico 2
- Adafruit Feather 2040
- Adafruit Feather ESP32-S3 (8MB no PSRAM)
- Adafruit Feather HUZZAH 32 (ESP32-WROOM)
- Seeed Studio Xiao ESP32-S3
- BBC micro:bit v2 (set USE_NONBOCKING False)

## Troubleshooting

### Servo doesn't move

Make sure your pins are connected correctly to the Servo

Servo Wire Color:

- Red: +5V Power (labled VCC, VBUS, VSYS, or USB on most devices)
- Black: 0V Ground (labeled GND on most devices)
- White: Signal (pin set with SERVO_PIN in code.py)

### Website doesn't see the device or reports an error

Only one program can access the serial port at a time.  Try
closing the serial port monitor from your IDE (Thonny or Mu Editor)
or exiting the IDE all together, then try to reconnect.

### Servo moves at the beginning, but then stops

This could be a problem with the code.  Use [Thonny](https://thonny.org/) to
look for a message from the serial console.

You may see an error from Python about select() not
being supported.  Try changing this line of code:

```Python
USE_SELECT = True
```

to read

```Python
USE_SELECT = False
```

### Error from console: object has no attribute 'in_waiting'

Try setting `USE_SELECT` to `True` in code.py

## Contributing and Feedback

See the Design, Make, and Teach [github repository](https://github.com/designmakeandteach/tiny-sorter)
to report any issues or submit a patch.
