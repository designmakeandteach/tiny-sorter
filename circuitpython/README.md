# CircuitPython driver for Tiny Sorter
#
# Meant to communicate with a web page running using WebSerial
# 

## Installing

1. Copy `code.py` to the CIRCUITPY drive on your computer.
2. Find the Adafruit Circuit Python Bundle for the version of CircuitPython
installed on your microcontroller. 
3. Copy the folder `lib/adafruit_motor` to the `lib` folder on 
the CIRCUITPY drive.
4. Attach your servo and test. You may need to modify this line of
code to match the pin you are using for the servo:

```
SERVO_PIN = board.GP10
```

## Testing

This was tested with CircuitPython 9.x on the following devices:

- Raspberry Pi Pico 2

It should work for other devices, but if you run into problems with select() not 
being supported, you can try uncommentng an alternative
read function `read_char_nonblocking()`
