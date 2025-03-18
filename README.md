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
1. Open [Microsoft MakeCode for micro:bit](https://makecode.microbit.org/).
2. Click on **Extensions** in the Advanced section.
3. Search for `LED Matrix` and select this extension.
4. Add it to your project.

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
LedMatrix.setLed(row, col, state);
```
- **row**: LED row (0-7, top to bottom).
- **col**: LED column (0-15, left to right).
- **state**: `1` (on) or `0` (off).

Example:
```javascript
LedMatrix.setLed(2, 5, 1); // Turns on LED at row 2, column 5.
```

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

### 5. Draw a Rectangle
```javascript
LedMatrix.drawRectangle(x, y, width, height, state);
```
- **x, y**: Starting position.
- **width, height**: Dimensions of the rectangle.
- **state**: `1` (on) or `0` (off).

Example:
```javascript
LedMatrix.drawRectangle(3, 2, 5, 4, 1); // Draws a 5x4 rectangle at (3,2).
```

### 6. Draw a Line
```javascript
LedMatrix.drawLine(startRow, startCol, endRow, endCol);
```
- Draws a **horizontal or vertical** line between two points.

Example:
```javascript
LedMatrix.drawLine(0, 0, 0, 7); // Horizontal line across row 0.
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

## Support
If you encounter any issues, check the [GitHub repository](https://github.com/your-repo-link) or open an issue for assistance.

---
Enjoy using your LED Matrix with micro:bit! 🚀

