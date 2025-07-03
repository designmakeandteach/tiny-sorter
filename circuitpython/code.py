# CircuitPython Driver for Tiny Sorter project
# Copyright 2025 Eric Z. Ayers
#
# See https://github.com/designmakeandteach/tiny-sorter

import board
import pwmio
import select
import sys
import time

from adafruit_motor import servo

SERVO_PIN = board.GP10
       
CEREAL_VALUE = '1'
MALLOW_VALUE = '2'

CENTER_POSITION = 90
CEREAL_POSITION = 10
MALLOW_POSITION = 170

NUM_JIGGLES = 4
JIGGLE_ANGLE = 15
JIGGLE_DELAY = .1

# -------------------------------------------------------------------------
# Global Variables
# -------------------------------------------------------------------------

pwm = pwmio.PWMOut(board.GP10, duty_cycle=2 ** 15, frequency=50)
sorter_servo = servo.Servo(pwm)

# -------------------------------------------------------------------------
# Helper routines
# -------------------------------------------------------------------------
def move_to_position_and_wait(angle):
    sorter_servo.angle = angle
    time.sleep(2)
    
def jiggle():
    print("Jiggle!")
    for i in range(0, NUM_JIGGLES):
        sorter_servo.angle = CENTER_POSITION + JIGGLE_ANGLE
        time.sleep(JIGGLE_DELAY)
        sorter_servo.angle = CENTER_POSITION - JIGGLE_ANGLE
        time.sleep(JIGGLE_DELAY)
    time.sleep(JIGGLE_DELAY)
  
# Here's an alternate version. select() may not be available
# on all systems.
#
#def read_char_nonblocking():
#    if sys.stdin.in_waiting > 0:
#        # Read available bytes
#        raw_input = sys.stdin.read(sys.stdin.in_waiting)
#        # we only want the last character, throw the rest away
#        return raw_input[-1]
#    else:
#        return None

# Attempts to read a command consisting of a digit
# Discards all but the last digit read.
# If no input is available, returns None
def read_char_nonblocking():
    val = None
    while select.select([sys.stdin], [], [], 0)[0]:
        tmp_val = sys.stdin.read(1)
        if tmp_val.isdigit():
            val = tmp_val
    return val

# -------------------------------------------------------------------------
# Main Logic
# -------------------------------------------------------------------------

print("Waiting for data")
move_to_position_and_wait(CENTER_POSITION)

while True:
    # TODO(zundel): change to non-blocking read
    value = read_char_nonblocking()
    print("Received: input: ", value)
    if value == CEREAL_VALUE:
        print("Cereal Detected")
        move_to_position_and_wait(CEREAL_POSITION)
    elif value == MALLOW_VALUE:
        print("Mallow Detected")
        move_to_position_and_wait(MALLOW_POSITION)
    else:
        jiggle()
    