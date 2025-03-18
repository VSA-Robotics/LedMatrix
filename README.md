# LED Matrix Extension for micro:bit (v1.0.0)

## Introduction
This micro:bit extension provides a simple interface for controlling an **8x16 LED Matrix** using two digital pins (SCK and DIN). It allows users to **set individual LEDs, draw shapes, and scroll text** with customizable speed and direction.

## Features
- **Easy Initialization**: Configure SCK and DIN pins for communication.
- **Set Individual LEDs**: Control each LED on the matrix by specifying row and column.
- **Clear Display**: Quickly turn off all LEDs.
- **Scroll Text**: Display messages with adjustable speed and direction.
- **Draw Shapes**: Create lines and rectangles for visual effects.

## Installation
1. Open the [MakeCode editor](https://makecode.microbit.org/) in your browser.
2. Click on the **"Extensions"** option in the block menu.
3. In the search bar, enter the URL of this repository (e.g., `https://github.com/VSA-Robotics/LedMatrix`).
4. Click **"Add to Project"** to install the extension into your MakeCode environment.

## Pin Configuration
This extension requires two digital pins to communicate with the LED matrix:
- **SCK (Clock Pin)**: Controls data timing.
- **DIN (Data Input Pin)**: Sends LED state information.

Example Pin Setup:
```javascript
LedMatrix.initialize(DigitalPin.P15, DigitalPin.P16);
```
This initializes the LED matrix using **P15 for SCK** and **P16 for DIN**.

## Blocks and Functions
### 1. Initialize the LED Matrix
```javascript
LedMatrix.initialize(DigitalPin.P15, DigitalPin.P16);
```
- Call this function before using other blocks.
- Adjust `P15` and `P16` to your wiring setup.

### 2. Set Individual LED
```javascript
LedMatrix.setLed(2, 5, 1);
```
- **row**: LED row (0-7, top to bottom).
- **col**: LED column (0-15, left to right).
- **state**: `1` (on) or `0` (off).

### 3. Clear Display
```javascript
LedMatrix.clear();
```
- Turns off all LEDs on the matrix.

### 4. Scroll Text
```javascript
LedMatrix.scrollText("HELLO", 100, 0);
```
- **text**: String to display (supports A-Z, 0-9, ?, !).
- **speed**: Scroll speed in milliseconds (50-1000 ms recommended).
- **direction**: `0` (left to right) or `1` (right to left).

### Example: Scrolling Text Animation
```javascript
LedMatrix.initialize(DigitalPin.P15, DigitalPin.P16);
basic.forever(function () {
    LedMatrix.clear();
    LedMatrix.scrollText("HELLO", 100, 0);
});
```

### 5. Draw a Rectangle
```javascript
LedMatrix.drawRectangle(3, 2, 5, 4, 1);
```
- **x, y**: Starting position.
- **width, height**: Dimensions of the rectangle.
- **state**: `1` (on) or `0` (off).

### 6. Draw a Line
```javascript
LedMatrix.drawLine(0, 0, 0, 7);
```
- Draws a **horizontal or vertical** line between two points.

### 7. Example: Animated Pattern
```javascript
LedMatrix.initialize(DigitalPin.P15, DigitalPin.P16);
basic.forever(function () {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 16; j++) {
            LedMatrix.setLed(i, j, (i + j) % 2);
        }
    }
    basic.pause(500);
    LedMatrix.clear();
    basic.pause(500);
});
```

### 8. Example: Running Light Effect
```javascript
LedMatrix.initialize(DigitalPin.P15, DigitalPin.P16);
let col = 0;
basic.forever(function () {
    LedMatrix.clear();
    for (let row = 0; row < 8; row++) {
        LedMatrix.setLed(row, col, 1);
    }
    col = (col + 1) % 16;
    basic.pause(200);
});
```

## Best Practices & Tips
- Ensure the LED matrix is **physically oriented** with **16 columns wide and 8 rows tall**.
- **Row Range:** `0-7` (top to bottom), **Column Range:** `0-15` (left to right).
- **Recommended scroll speeds:** `100-300ms` for readability.
- If characters appear **rotated**, check your wiring and ensure correct SCK/DIN pin mapping.

## Version History
### v1.0.0 (Initial Release)
- Core functions for LED control, text scrolling, and shape drawing implemented.
- Optimized for MakeCode micro:bit environment.

## License
This project is licensed under the MIT License - feel free to modify and distribute!

---
Enjoy using your LED Matrix with micro:bit! 🚀

