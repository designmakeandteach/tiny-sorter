# Arduino Driver for tiny-sorter

This is an updated driver for the [Tiny Sorter](https://designmakeandteach.com/projects/tiny-sorter) project from
Design, Make, and Teach.

## Compatible Microcontrollers

If you use the default code,

## Compatibility with Original Google Experiment

The driver is compatible with
the original [Tiny Sorter Experiment](https://experiments.withgoogle.com/tiny-sorter/)
if you update the line:

```C
#define USE_WEB_USB 1
```

However, this only works on a few microcontrollers (e.g. Arduino Leonardo which is now discontinued)
and can be difficult to get working.

See the [WebUSB](https://github.com/webusb/arduino) project page on github and
this [issue](https://github.com/webusb/arduino/issues/106)
if you are having problems using the WebUSB driver on Windows 10/11.

As of July 2025, The original P5 website for the experiment doesn't work with
versions of Chrome released after December 2024. An updated version of the original
p5 project can be found [on editor.p5js](https://editor.p5js.org/designmakeandteach/full/6qflZwLtf).
