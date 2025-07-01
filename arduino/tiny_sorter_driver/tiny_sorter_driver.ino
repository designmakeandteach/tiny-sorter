// Driver for the TinySorter AI project.
//
// Tiny Sorter demonstrates how to use Google's Teachable Machine 
// controlled by a webpage with a physical device.
//
// Originally published by Google AI Experiments in 2019 (Copyright & License Unknown)
// https://experiments.withgoogle.com/tiny-sorter/view/
// https://experiments.withgoogle.com/tiny-sorter/view/assets/img/sorter_sketch.zip
//
// Updates Copyright 2025 by Eric Ayers 
// Distributed under terms of the MIT license
// https://designmakeandteach.com/
// eric@designmakeandteach.com

#include <Servo.h>

// Set to 0 to debug or use the updated WebSerial driver
// Set to 1 to use the microcontroller as aWebUSB device. (as originally published by Google)
#define USE_WEB_USB 0

#if USE_WEB_USB

// The original TinySorter project uses WebUSB to connect to the serial port.
// This will only work with an addon library and certain devices like the Arduino Leonardo
// To install the library, see https://github.com/webusb/arduino/
#include <WebUSB.h>
WebUSB WebUSBSerial(1 /* https:// */, "editor.p5js.org/designmakeandteach/full/yiTc27eXT/");
// Override to use the WebUSB Serial port
#define Serial WebUSBSerial

// For evaluating data sent from the webpage. The WebUSB version of the project uses binary data.
#define ASCII_OFFSET 0
#else
// Use the default serial port. 
// This is helpful for testing and using the WebSerial protocol.

// Values sent from the webpage to tell us what it detected. Use ASCII characters.
#define ASCII_OFFSET 48 // The character '0' is 48 (decimal) in ASCII
#endif /* USE_WEB_USB */

const int CEREAL_VALUE = 1;
const int MALLOW_VALUE = 2;

Servo sorter_servo;

const int SERVO_PIN = 9;         // Might be labled D9 on your board

// The adjustments below control the vibration of the sorter
const int NUM_JIGGLES = 4;     
const int JIGGLE_ANGLE = 15;    
const int JIGGLE_DELAY = 100;  

// The adjustments below set the limits of the servo.
const int CENTER_POSITION = 90;  // Servo horn points straight up
const int CEREAL_POSITION = 10;  // direction to tilt when a piece of cereal is detected
const int MALLOW_POSITION = 170; // direction to tilt when a marshmallow detected

void setup() {
  sorter_servo.attach(SERVO_PIN);

  // Move the servo to show to both extremes to show that the sketch has started
  sorter_servo.write(CEREAL_POSITION);
  delay(250); // Wait for the servo to move
  sorter_servo.write(MALLOW_POSITION);
  delay(250);

  // Center the servo. This allows you to adjust the horn.
  sorter_servo.write(CENTER_POSITION);
  delay(3000);
}

// Move the servo back and forth to create vibrations that will
// allow the objects to be sorted to slide down the ramp.
void jiggle() {
  Serial.write("Jiggle!\r\n");
  for (int i = 0; i < NUM_JIGGLES; i++) {
    sorter_servo.write(CENTER_POSITION + JIGGLE_ANGLE);
    delay(JIGGLE_DELAY);
    sorter_servo.write(CENTER_POSITION - JIGGLE_ANGLE);
    delay(JIGGLE_DELAY);
  }
  delay(100);
  // Wait until our message is fully sent out the serial port
  Serial.flush();
}

// Wait for the serial port to become available. When using WebUSB
// This is when the website connects to your board
void wait_for_serial_port() {

  while (!Serial) {
    ;
  }
  Serial.begin(9600);
  Serial.write("Arduino: Sketch begins.\r\n");
  Serial.flush();

  // Give a jiggle to show the serial port is attached
  jiggle();
  delay(250);
}

// Arduino main loop
void loop() {

  if (!Serial) {
    // If the serial port is not connected, all of our calls to the
    // serial port will fail trying to dereference a NULL pointer
    wait_for_serial_port();

  } else if (Serial.available()) {
    // ASCII_OFFSET adjusts between binary and ASCII input
    int detected_value = Serial.read() - ASCII_OFFSET;  

    if (CEREAL_VALUE == detected_value) {
      Serial.write("Cereal detected.\r\n");

      // Tip the servo toward the cereal bowl
      sorter_servo.write(CEREAL_POSITION);
      delay(2000);

      // Move servo back to the center
      sorter_servo.write(CENTER_POSITION);
      delay(1000);
    } else if (MALLOW_VALUE == detected_value) {
      Serial.write("Mallow detected.\r\n");

      // Tip the servo toward the marshmallow bowl
      sorter_servo.write(MALLOW_POSITION);
      delay(2000);
      
      // Go back to the center
      sorter_servo.write(CENTER_POSITION);
      delay(1000);
    } else {
      Serial.write("Unknown value: '");
      Serial.write(detected_value);
      Serial.write("' detected.\r\n");
    }

    //
    // For a more sophisticated sorter, you might have more values.
    // You could add that logic here.
    //

    // The microprocessor has been delaying and might get behind in
    // processing serial input. Skip over the old data to get the
    // most recent input in the next iteration of loop()
    while (Serial.available()) {
      Serial.read();
      delay(1);
    }

    // Flush any output to the serial port.
    Serial.flush();
  } else {
    // No data came in, try vibrating the sorter
    jiggle();
  }
}
