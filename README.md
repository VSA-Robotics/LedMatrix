# LED Matrix Extension for micro:bit (v1.0.0)

## Introduction

This micro:bit extension provides a simple interface for controlling an **8x16 LED Matrix** using two digital pins (SCK and DIN). It allows users to **set individual LEDs, draw shapes, and scroll text** with customizable speed and direction.

This extension is designed specifically for the **Makeblock Me LED Matrix (8x16)**. To use this LED matrix, you will need the **Octopus Bit V1.6** to connect the **Me RJ25 Adapter V2.2** to the **Makeblock Me LED Matrix (8x16)**.

## Important Notes Before Using

- **Before starting on MakeCode or installing this extension, you must first initialize the LED matrix via Makeblock Showtime Code**. This ensures the LED Matrix is correctly powered and ready for further programming on MakeCode.
- Before using the LED Matrix (8x16) on MakeCode, you must first **initialize it via Makeblock V1** using mBlock code to turn on the LED Matrix. Once initialized, you can switch to micro:bit for further operations.

## Show Time on Makeblock V1 LED Matrix

Before using the LED Matrix (8x16) with micro:bit, initialize it on Makeblock V1 using the following block code in **mBlock**:

### Steps to Create the Block Code in mBlock

#### 1. Open mBlock and Set Up Your Device:

- Launch **mBlock 5** on your computer.
- Add your device: Click **"Devices"** > **"+ Add"** > Select **"mBot"** (or your specific controller with the LED Matrix).
- Ensure the LED Matrix is connected to a port with a **blue ID** (e.g., **Port 3, 4, 5, or 6 on the Orion**).

#### 2. Start a New Project:

- Create a new project and switch to **"Sprite"** mode (for simplicity, though "Device" mode works too).
- Ensure you’re in **"Upload"** mode (not "Live") so the code runs on the mBot hardware.

#### 3. Add the LED Matrix Extension (if needed):

- Go to **"Extensions"** > **"+ Extension"** > Search for **"LED Matrix"** or **"mBot Add-ons"** > Add the LED Matrix extension if it’s not already available.

#### 4. Assemble the Block Code:

- **Forever Loop:** Use a "Forever" block (from the "Control" category) to continuously update the time.
- **Get the Current Time:**
  - From the **"Data&Blocks"** category, use the **"hour"** block to get the current hour.
  - Use the **"minute"** block to get the current minute.
- **Format the Time as a String:**
  - Use the **"join"** block (from the **"Operators"** category) to combine the hour, a colon (**":"**), and the minute into a single string.
  - Example: `join [hour] ":" [minute]` will create something like **"12:35"**.
- **Display on the LED Matrix:**
  - From the **"LED Matrix"** category, use the **"Show String"** block.
  - Set the **port number** where your LED Matrix is connected (e.g., **Port 3**).
  - Drag the **"join"** block into the **"Show String"** input to display the time.
  - Optionally, adjust the **scroll speed** or **position** (if available in your mBlock version).
- **Add a Delay:**
  - Add a **"Wait"** block (from **"Control"**) with **1 second** to update the display every second.

#### 5. Final Block Code Description:

The assembled code would look like this in mBlock:

```
Forever
    LED Matrix on Port 3 show string [join [hour] ":" [minute]]
    Wait 1 seconds
```

#### 6. Upload the Code:

- Connect your **mBot** to the computer via **USB or Bluetooth**.
- Click **"Upload"** to send the code to the mBot.
- The **LED Matrix** should now display the **current time**, updating every second.

## Installation

1. Open the [MakeCode editor](https://makecode.microbit.org/) in your browser.
2. Click on the **"Extensions"** option in the block menu.
3. In the search bar, enter the URL of this repository (e.g., `https://github.com/VSA-Robotics/LedMatrix`).
4. Click **"Add to Project"** to install the extension into your MakeCode environment.

## Tutorials and Usage Guide

### 1. Initializing the LED Matrix
```javascript
LedMatrix.initialize(DigitalPin.P15, DigitalPin.P16);
```
- Call this function before using other blocks.
- Adjust `P15` and `P16` to your wiring setup.

### 2. Setting an Individual LED
```javascript
LedMatrix.setLed(2, 5, 1);
```
- **row**: LED row (0-7, top to bottom).
- **col**: LED column (0-15, left to right).
- **state**: `1` (on) or `0` (off).

### 3. Clearing the Display
```javascript
LedMatrix.clear();
```
- Turns off all LEDs on the matrix.

### 4. Scrolling Text Example
```javascript
LedMatrix.scrollText("HELLO", 100, 0);
```
- **text**: String to display.
- **speed**: Scroll speed in milliseconds (50-1000 ms recommended).
- **direction**: `0` (left to right) or `1` (right to left).

### 5. Drawing a Rectangle
```javascript
LedMatrix.drawRectangle(3, 2, 5, 4, 1);
```
- **x, y**: Starting position.
- **width, height**: Dimensions of the rectangle.
- **state**: `1` (on) or `0` (off).

### 6. Example: Running Light Effect
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

