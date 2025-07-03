# Design, Make, and Teach Tiny Sorter Project

A refresh of the Google AI Experiment [Tiny Sorter](https://experiments.withgoogle.com/tiny-sorter/).

This is the source for the Tiny Sorter web page hosted on [p5js.org](https://editor.p5js.org/designmakeandteach/full/6qflZwLtf).
Please file any issues or enhancement ideas on [github](https://github.com/designmakeandteach/tiny-sorter).

## How to use this Page

First, you need to train an image model at [Teachable Machines](https://teachablemachine.withgoogle.com/train)
Then, you can take that model and visit this web page to control a sorting machine attached to your laptop!

For more details on how to use this in a classroom environment, see [Design, Make, and Teach](https://designmakeandteach.com/projects/tiny-sorter).

## Changes from 2019 Google Experiment

This updates the webpage to use the WebSerial protocol so that it can
be used with any microprocessor that presents a serial port to the 
device running the Chrome browser.

The code has been reorganized and updated to fix some error conditions and remove unused code.

## UI Testing

Add the query string `?test=true` to the URL to see a test interface.

## WebSerial library

This project uses the [gohai/p5.webserial library for p5](https://github.com/gohai/p5.webserial) to implement the WebSerial support.
