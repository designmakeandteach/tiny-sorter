# CircuitPython Driver for Tiny Sorter project
# Copyright 2025 Eric Z. Ayers
#
# See https://github.com/designmakeandteach/tiny-sorter
#
# This driver waits on a command from the Serial port.
# Messages are single digits. By default, these messages are:
#
# '1' == A piece of cereal was detected
# '2' == A marshmallow was detected
#
# Once it arrives, it moves the servo to the specified position.
# Between messages it will move the servo to vibrate the sorter

import board
import pwmio
import sys
import time

# Install adafruit_motor in the lib/ directory
# You can download it from https://circuitpython.org/libraries
from adafruit_motor import servo

# ACTION REQUIRED: Update SERVO_PIN to match your microprocessor
# This pin must be attached to a PWM capable port
#
#  * RP2040 based chips (RPI Pico/ others)  have many pins that can do PWM
#  * ESP32-S2 has only a few

# Raspberry Pi Pico and variants
# board.GP2 is pin #4
SERVO_PIN = board.GP2

# Example for Adafruit Feather 2040
# board.D5 is labeled '5' and 'GP07' on the board
# SERVO_PIN = board.D5

# Example for Adafruit Feather ESP32-S3 8MB No PSRAM
# board.D5 is labeled '5' on the board
# SERVO_PIN = board.D5

# Example for Adafruit Feather Huzzah 32 (w/ ESP32-WROOM)
# board.D14 is labeled '14/A6'
# SERVO_PIN = board.D14

# Example for Seeed Studio XIA ESP32-S3
# board.D0 is labeled 'D0', the first pin pin by the 'R'button
# SERVO_PIN = board.D0

# Example for Micro:bit
# Also need to set USE_NONBLOCKING to False
# SERVO_PIN = board.P0


# On most systems, we have a way to get non-blocking I/O working, but
# not all (micro:bit)
USE_NONBLOCKING = True

# On some systems, you may get an error trying to read a character with
# select(). You can change this value to False to try an alternative version
USE_SELECT = True

if USE_NONBLOCKING and USE_SELECT:
    import select

# Message values sent from the webpage
CEREAL_VALUE = "1"
MALLOW_VALUE = "2"

# Angles to use to move the servo after an item is detected
CENTER_POSITION = 90
CEREAL_POSITION = 10
MALLOW_POSITION = 170

# Controls the vibration of the servo betwene pieces
NUM_JIGGLES = 4
JIGGLE_ANGLE = 15
JIGGLE_DELAY = 0.1

# -------------------------------------------------------------------------
# Global Variables
# -------------------------------------------------------------------------

pwm = pwmio.PWMOut(SERVO_PIN, duty_cycle=2**15, frequency=50)
sorter_servo = servo.Servo(pwm)

# -------------------------------------------------------------------------
# Helper routines
# -------------------------------------------------------------------------


# Attempts to read a command consisting of a digit
# Discards all but the last digit read.
# If no input is available, returns None
def read_command():
    if USE_NONBLOCKING:
        if USE_SELECT:
            return read_command_nonblocking_select()
        else:
            return read_command_nonblocking_no_select()
    else:
        return read_command_blocking()


# Moves the servo back and forth to vibrate the sorter and move the
# items down the chute.
def jiggle():
    print("Jiggle!")
    for i in range(0, NUM_JIGGLES):
        sorter_servo.angle = CENTER_POSITION + JIGGLE_ANGLE
        time.sleep(JIGGLE_DELAY)
        sorter_servo.angle = CENTER_POSITION - JIGGLE_ANGLE
        time.sleep(JIGGLE_DELAY)
    time.sleep(JIGGLE_DELAY)


# Helper routine to move the sorter and give the item time to fall
def move_to_position_and_wait(angle, timeout=2):
    sorter_servo.angle = angle
    time.sleep(timeout)


# After receivng a command to dump the sorter, moves into
# that position, then re-centers the servo and prepares
# for the next command
def dump_sorter(angle):
    move_to_position_and_wait(angle)
    move_to_position_and_wait(CENTER_POSITION, 1)
    # Throwaway any data that's come while we have been waiting
    if USE_NONBLOCKING:
        throwaway = read_command()


# Read from the serial port without blocking.
# On some CircuitPython installations select() may not be available
def read_command_nonblocking_no_select():
    val = None
    if sys.stdin.in_waiting > 0:
        # Read all available bytes
        raw_input = sys.stdin.read(sys.stdin.in_waiting)
        # We only want the last valid command, throw the rest away
        for tmp_val in list(raw_input):
            if tmp_val.isdigit():
                val = tmp_val
    return val


# A version that reads a character non-blocking using select()
def read_command_nonblocking_select():
    val = None
    while select.select([sys.stdin], [], [], 0)[0]:
        tmp_val = sys.stdin.read(1)
        if tmp_val.isdigit():
            val = tmp_val
    return val


# Using non-blocking input is less than ideal, but sometimes it's all we have
def read_command_blocking():
    val = None
    raw_input = input()
    # We only want the last valid command, throw the rest away
    for tmp_val in list(raw_input):
        if tmp_val.isdigit():
            val = tmp_val
    return val


# -------------------------------------------------------------------------
# Main Logic
# -------------------------------------------------------------------------

print("Waiting for data")
move_to_position_and_wait(CENTER_POSITION)

while True:
    # Read a single digit command from the input
    command = read_command()
    print("Received: input: ", command)
    if command == CEREAL_VALUE:
        print("Cereal Detected")
        dump_sorter(CEREAL_POSITION)
    elif command == MALLOW_VALUE:
        print("Mallow Detected")
        dump_sorter(MALLOW_POSITION)
    else:
        jiggle()
