# LED Matrix Extension for micro:bit

This extension provides blocks to control an 8x16 LED matrix using the micro:bit.

## Usage
- Initialize with `LedMatrix.initialize(sck, din)`.
- Set LEDs with `LedMatrix.setLed(row, col, state)`.
- Scroll text with `LedMatrix.scrollText(text, speed, direction)`.

## Example
```typescript
LedMatrix.initialize(DigitalPin.P0, DigitalPin.P1);
LedMatrix.scrollText("HELLO", 150, 0);
