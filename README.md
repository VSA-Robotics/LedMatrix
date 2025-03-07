# LED Matrix Extension for micro:bit

Welcome to the LED Matrix Extension for micro:bit! This extension allows you to control an **8x16 LED matrix** using a micro:bit. You can light up individual LEDs, scroll text across the display, and draw simple shapes like lines and rectangles—all with easy-to-use functions designed for the MakeCode editor.

Whether you're building a scrolling message board, creating pixel art, or experimenting with animations, this extension has you covered.

## Features
- Control an 8x16 LED matrix via two pins (SCK and DIN).
- Turn individual LEDs on or off.
- Scroll text in either direction with adjustable speed.
- Draw lines and rectangles directly on the matrix.
- Clear the display with a single command.

## Installation

To use this extension in your micro:bit project, follow these steps:

1. Open the [MakeCode editor](https://makecode.microbit.org/) in your browser.
2. Click on the **"Extensions"** option in the block menu.
3. In the search bar, enter the URL of this repository (e.g., `https://github.com/your-repo/led-matrix-extension`) or search for "LedMatrix" if it’s published.
4. Click **"Add to Project"** to install the extension into your MakeCode environment.

### Manual Installation (Optional)
If the extension isn’t available via search, you can manually add it:
- Copy the extension’s source code from the repository.
- Paste it into a new file in your project under the **"Explorer"** tab in MakeCode.

Once installed, the extension’s blocks will appear in the MakeCode toolbox, ready for use.

## Usage

This section explains how to use the extension’s core functions. All examples are written in TypeScript, but you can also use the equivalent blocks in the MakeCode editor.

### Initialization
Before using the LED matrix, you must initialize it by specifying the pins connected to **SCK (clock)** and **DIN (data input)** on your micro:bit. For example:

```typescript
LedMatrix.initialize(DigitalPin.P15, DigitalPin.P16);
```

- `DigitalPin.P15`: SCK pin (adjust based on your wiring).
- `DigitalPin.P16`: DIN pin (adjust based on your wiring).

Run this command once at the start of your program to set up the matrix.

### Setting Individual LEDs
To turn an LED on or off, use the `setLed` function. You’ll need to specify the row (0-7), column (0-15), and state (0 for off, 1 for on):

```typescript
LedMatrix.setLed(2, 3, 1); // Turns on the LED at row 2, column 3
LedMatrix.setLed(2, 3, 0); // Turns it off
```

### Clearing the Display
To turn off all LEDs and reset the matrix to a blank state, use:

```typescript
LedMatrix.clear();
```

### Scrolling Text
Display scrolling text with the `scrollText` function. You can customize the message, speed, and direction:

```typescript
LedMatrix.scrollText("HELLO", 200, 0); // Scrolls "HELLO" from right to left at 200ms per frame
```

- **Text**: The message to display (e.g., `"HELLO"`).
- **Speed**: Delay between frames in milliseconds (e.g., `200` for a moderate pace).
- **Direction**: `0` for left, `1` for right.

### Drawing Shapes
The extension includes functions to draw basic shapes on the matrix.

#### Draw a Line
Use `drawLine` to create horizontal or vertical lines by specifying the start and end coordinates:

```typescript
LedMatrix.drawLine(0, 0, 0, 15); // Draws a horizontal line across the top row
LedMatrix.drawLine(0, 5, 7, 5);  // Draws a vertical line in column 5
```

- Parameters: `startRow`, `startCol`, `endRow`, `endCol`.

#### Draw a Rectangle
Use `drawRectangle` to draw a rectangle by defining its position, size, and state:

```typescript
LedMatrix.drawRectangle(2, 2, 4, 4, 1); // Draws a 4x4 rectangle starting at column 2, row 2
```

- Parameters: `x` (start column), `y` (start row), `width`, `height`, `state` (1 for on, 0 for off).

## Examples

Here are some practical examples to help you get started.

### Example 1: Turn On a Single LED
```typescript
LedMatrix.initialize(DigitalPin.P15, DigitalPin.P16);
LedMatrix.setLed(0, 0, 1); // Lights up the top-left LED
```

### Example 2: Scroll a Message
```typescript
LedMatrix.initialize(DigitalPin.P15, DigitalPin.P16);
LedMatrix.scrollText("MICROBIT", 150, 0); // Scrolls "MICROBIT" left at 150ms per frame
```

### Example 3: Draw a Border
```typescript
LedMatrix.initialize(DigitalPin.P15, DigitalPin.P16);
LedMatrix.drawRectangle(0, 0, 16, 8, 1); // Draws a full-screen border (all LEDs on)
LedMatrix.drawRectangle(1, 1, 14, 6, 0); // Clears the inner area, leaving a border
```

### Example 4: Animate a Line
```typescript
LedMatrix.initialize(DigitalPin.P15, DigitalPin.P16);
for (let col = 0; col < 16; col++) {
    LedMatrix.clear();
    LedMatrix.drawLine(0, col, 7, col); // Draws a vertical line moving across the matrix
    basic.pause(100); // Wait 100ms between frames
}
```

## Troubleshooting

If you run into issues, try these solutions:

- **No display output**: 
  - Double-check that the matrix is powered (e.g., 5V or 3.3V, depending on your model).
  - Verify that the SCK and DIN pins match your wiring in the `initialize` function.
- **Text is upside down or mirrored**: 
  - Some matrices have different orientations. You may need to adjust the extension’s code (e.g., add a `flipVertical` function) or rotate your physical matrix.
- **LEDs light up in the wrong positions**: 
  - Ensure your row and column indices are correct (rows: 0-7, columns: 0-15).
- **Scrolling is too fast/slow**: 
  - Adjust the speed parameter in `scrollText` (higher values slow it down).
