# Tiny Sorter

A fun project that introduces you to AI, electronics, and mechanical engineering—no
experience necessary! You'll learn how to train a TensorFlow model using Google's
[Teachable Machine](https://teachablemachine.withgoogle.com/) to recognize two
different categories of items, then build a machine to sort them.

<video controls width="600">
  <source src="https://storage.googleapis.com/gweb-experiments.appspot.com/7153-hero.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

This makes a great short lesson (1-2 days of class time) for high school-level Engineering or Computer Science
courses. The machine can be built using low cost, easy-to-find, reusable parts—perfect for
classrooms or homeschoolers.

## Materials

In addition to paper, tape, and scissors, you'll need:

- A laptop or desktop computer with a webcam (Mac, Windows, or Linux should work)
- A microcontroller compatible with CircuitPython or the Arduino environment such as the [Pico 2 W](https://www.adafruit.com/product/6315) or [Adafruit Feather ESP32-S2](https://www.adafruit.com/product/6282)
- A [micro servo](https://www.adafruit.com/product/169)  
- [Jumper wires](https://www.adafruit.com/product/1953) to connect the micro servo to the microcontroller
- A USB cable to connect your laptop to the microcontroller

We recommend [Adafruit](https://adafruit.com) for both tutorials and the
components needed to complete the project, but you can source them from a number
of places including SparkFun or Amazon in the USA.

## Instructions

See [Tiny Sorter Experiment from 2019](https://experiments.withgoogle.com/tiny-sorter) for the
original project guidelines. See [Design, Make, and Teach](https://designmakeandteach.com/projects/tiny-sorter)
for up to date instructions for using more modern mictocontrollers like
the Raspberry Pi Pico and for resources how to incorporate tiny-sorter into
your lesson plans!

## History

This project builds on the [Tiny Sorter](https://experiments.withgoogle.com/tiny-sorter)
Google Experiment launched in 2019, which combined Teachable Machine with
Arduino. It's been updated to modernize the logic for compatibility with
newer versions of Chrome and a wider range of microcontroller and
development environments.

## Repo Contents

- **arduino**: Sketch for installing on a microcontroller using the
[Arduino](https://arduino.cc) environment (C++)
- **circuitpython**: Source code for installing on a microcontroller
using [CircuitPython](https://circuitpython.org) (Python)
- **p5js**: Source code for the webpage to run your model
