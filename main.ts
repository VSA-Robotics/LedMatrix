//% color="#AA278D" weight=100
namespace LedMatrix {
    // =========================================================================
    // GUIDELINES FOR USING LED MATRIX EXTENSION
    // =========================================================================
    // 1. **Orientation**:
    //    - This extension assumes an 8x16 LED matrix with 16 columns (0-15) horizontally (left to right) and 8 rows (0-7) vertically (top to bottom).
    //    - If letters appear rotated or scrolling is incorrect:
    //      - Physically orient the matrix with 16 columns wide and 8 rows tall.
    //      - Check wiring (e.g., SCK, DIN) and adjust `setLed` mapping if needed.
    //      - Use `console.log` to debug (visible in simulator’s console).
    // 2. **Initialization**:
    //    - Use `initialize LED matrix with SCK %sck and DIN %din`.
    //    - Select micro:bit pins (e.g., P15 for SCK, P16 for DIN).
    //    - Example: `LedMatrix.initialize(DigitalPin.P15, DigitalPin.P16)`
    // 3. **Basic Usage**:
    //    - Clear the display with `clear display`.
    //    - Set LEDs with `set LED at row %row column %col to %state` (0 = off, 1 = on).
    //    - Scroll text with `scroll text %text with speed %speed direction %direction` (speed: 50-1000ms, direction: 0 = left, 1 = right).
    //    - Draw shapes with `draw line` or `draw rectangle`.
    // 4. **Tips**:
    //    - Use speed 100-300ms for readable text scrolling.
    //    - Row range: 0-7 (top to bottom), Column range: 0-15 (left to right).
    //    - Font supports A-Z, 0-9, ?, ! (uppercase only).
    // =========================================================================

    // Global variables for pins and buffer
    let sckPin: DigitalPin;
    let dinPin: DigitalPin;
    let matrixBuffer: number[] = [];
    for (let i = 0; i < 16; i++) {
        matrixBuffer.push(0); // Initialize 16-column buffer (hardware columns)
    }

    // Define the font type to allow indexing by string
    interface FontMap {
        [key: string]: number[];
    }

    const font: FontMap = {
    'A': [0x3E, 0x48, 0x48, 0x48, 0x3E],  
    'B': [0x7E, 0x52, 0x52, 0x52, 0x2C],  
    'C': [0x3C, 0x42, 0x42, 0x42, 0x24],  
    'D': [0x7E, 0x42, 0x42, 0x42, 0x3C],  
    'E': [0x7E, 0x52, 0x52, 0x52, 0x42],  
    'F': [0x7E, 0x50, 0x50, 0x50, 0x40],  
    'G': [0x3C, 0x42, 0x52, 0x52, 0x2E],  
    'H': [0x7E, 0x08, 0x08, 0x08, 0x7E],  
    'I': [0x42, 0x42, 0x7E, 0x42, 0x42],  
    'J': [0x02, 0x02, 0x42, 0x7E, 0x40],  
    'K': [0x7E, 0x08, 0x14, 0x22, 0x42],  
    'L': [0x7E, 0x02, 0x02, 0x02, 0x02],  
    'M': [0x7E, 0x20, 0x18, 0x20, 0x7E],  
    'N': [0x7E, 0x20, 0x10, 0x08, 0x7E],  
    'O': [0x3C, 0x42, 0x42, 0x42, 0x3C],  
    'P': [0x7E, 0x50, 0x50, 0x50, 0x30],  
    'Q': [0x3C, 0x42, 0x46, 0x42, 0x3D],  
    'R': [0x7E, 0x48, 0x4C, 0x52, 0x22],  
    'S': [0x22, 0x52, 0x52, 0x52, 0x4C],
    'T': [0x40, 0x40, 0x7E, 0x40, 0x40],  
    'U': [0x7C, 0x02, 0x02, 0x02, 0x7C],  
    'V': [0x78, 0x04, 0x02, 0x04, 0x78],  
    'W': [0x7E, 0x04, 0x08, 0x04, 0x7E],  
    'X': [0x62, 0x14, 0x08, 0x14, 0x62],  
    'Y': [0x70, 0x08, 0x06, 0x08, 0x70],  
    'Z': [0x42, 0x46, 0x4A, 0x52, 0x60] 
};

    // Low-level communication functions
    function sendBit(bit: number) {
        pins.digitalWritePin(sckPin, 0);
        pins.digitalWritePin(dinPin, bit);
        control.waitMicros(2);
        pins.digitalWritePin(sckPin, 1);
        control.waitMicros(2);
    }

    function sendByte(byte: number) {
        for (let i = 7; i >= 0; i--) {
            sendBit((byte >> i) & 1);
        }
    }

    function startSignal() {
        pins.digitalWritePin(sckPin, 0);
        control.waitMicros(1);
        pins.digitalWritePin(sckPin, 1);
        pins.digitalWritePin(dinPin, 1);
        pins.digitalWritePin(dinPin, 0);
    }

    function endSignal() {
        pins.digitalWritePin(sckPin, 0);
        control.waitMicros(2);
        pins.digitalWritePin(dinPin, 0);
        pins.digitalWritePin(sckPin, 1);
        control.waitMicros(1);
        pins.digitalWritePin(dinPin, 1);
    }

    function writeBytesToAddress(address: number, data: number[]) {
        if (address > 15 || data.length === 0) return;
        startSignal();
        sendByte(0b01000000); // Auto-increment mode
        endSignal();
        startSignal();
        sendByte(0b11000000); // Starting at address 0
        for (let k = 0; k < data.length; k++) {
            sendByte(data[k]);
        }
        endSignal();
        startSignal();
        sendByte(0b10001000); // Display on, default brightness
        endSignal();
    }

    function showRows(data: number[]) {
        writeBytesToAddress(0, data);
    }

    function clearScreen() {
        let data: number[] = [];
        for (let i = 0; i < 16; i++) {
            data.push(0);
        }
        writeBytesToAddress(0, data);
    }

    function turnOnScreen() {
        startSignal();
        sendByte(0b10001000); // Display on, default brightness
        endSignal();
        clearScreen();
    }

    function updateDisplay() {
        showRows(matrixBuffer);
    }

    // Exported block functions

    /**
     * Initialize the LED matrix with specified SCK and DIN pins.
     * @param sck The clock pin for the LED matrix (e.g., P15).
     * @param din The data input pin for the LED matrix (e.g., P16).
     */
    //% block="initialize LED matrix with SCK %sck and DIN %din"
    //% sck.fieldEditor="gridpicker"
    //% sck.fieldOptions.columns=4
    //% din.fieldEditor="gridpicker"
    //% din.fieldOptions.columns=4
    export function initialize(sck: DigitalPin, din: DigitalPin) {
        sckPin = sck;
        dinPin = din;
        pins.digitalWritePin(dinPin, 1);
        pins.digitalWritePin(sckPin, 1);
        turnOnScreen();
        console.log(`LED Matrix initialized with SCK: ${sck}, DIN: ${din}`);
    }

    /**
     * Set the state of an individual LED on the 8x16 matrix.
     * @param row The row index (0-7, top to bottom) to set the LED.
     * @param col The column index (0-15, left to right) to set the LED.
     * @param state The state to set (0 for off, 1 for on).
     */
    //% block="set LED at row %row column %col to %state"
    //% row.min=0 row.max=7
    //% col.min=0 col.max=15
    //% state.min=0 state.max=1
    export function setLed(row: number, col: number, state: number) {
        if (row < 0 || row >= 8 || col < 0 || col >= 16) return;
        let hardwareCol = col; // Logical column becomes hardware column
        let hardwareRow = row; // Direct mapping, no shift
        if (state) {
            matrixBuffer[hardwareCol] |= (1 << hardwareRow);
        } else {
            matrixBuffer[hardwareCol] &= ~(1 << hardwareRow);
        }
        updateDisplay();
    }

    /**
     * Clear the entire LED matrix display.
     * Turns off all LEDs on the 8x16 matrix.
     */
    //% block="clear display"
    export function clear() {
        matrixBuffer = [];
        for (let i = 0; i < 16; i++) {
            matrixBuffer.push(0);
        }
        updateDisplay();
    }

    /**
     * Scroll text across the LED matrix.
     * @param text The text to scroll (supports A-Z, 0-9, ?, !).
     * @param speed The delay between frames in milliseconds (50-1000).
     * @param direction The scroll direction (0 for left, 1 for right).
     */
    //% block="scroll text %text with speed %speed direction %direction"
    //% speed.min=50 speed.max=1000
    //% direction.min=0 direction.max=1
    export function scrollText(text: string, speed: number, direction: number) {
        let bitmap = getMessageBitmap(text);
        if (direction === 0) { // Scroll left to right
            let maxStartCol = bitmap.length - 16; // Adjusted for 16 columns
            for (let startCol = 0; startCol <= maxStartCol; startCol++) {
                displayMessage(bitmap, startCol);
                basic.pause(speed);
            }
        } else if (direction === 1) { // Scroll right to left
            let minStartCol = 0 - 16;
            for (let startCol = bitmap.length - 16; startCol >= minStartCol; startCol--) {
                displayMessage(bitmap, startCol);
                basic.pause(speed);
            }
        }
    }

    /**
     * Draw a rectangle on the LED matrix.
     * @param x The starting column (0-15, left to right) of the rectangle.
     * @param y The starting row (0-7, top to bottom) of the rectangle.
     * @param width The width of the rectangle (1-16).
     * @param height The height of the rectangle (1-8).
     * @param state The state to set (0 for off, 1 for on).
     */
    //% block="draw rectangle at x %x y %y width %width height %height state %state"
    //% x.min=0 x.max=15
    //% y.min=0 y.max=7
    //% width.min=1 width.max=16
    //% height.min=1 height.max=8
    //% state.min=0 state.max=1
    export function drawRectangle(x: number, y: number, width: number, height: number, state: number) {
        for (let c = x; c < x + width && c < 16; c++) {
            for (let r = y; r < y + height && r < 8; r++) {
                setLed(r, c, state);
            }
        }
        updateDisplay();
    }

    /**
     * Draw a line on the LED matrix (horizontal or vertical).
     * @param startRow The starting row (0-7, top to bottom) of the line.
     * @param startCol The starting column (0-15, left to right) of the line.
     * @param endRow The ending row (0-7, top to bottom) of the line.
     * @param endCol The ending column (0-15, left to right) of the line.
     */
    //% block="draw line from row %startRow col %startCol to row %endRow col %endCol"
    //% startRow.min=0 startRow.max=7
    //% startCol.min=0 startCol.max=15
    //% endRow.min=0 endRow.max=7
    //% endCol.min=0 endCol.max=15
    export function drawLine(startRow: number, startCol: number, endRow: number, endCol: number) {
        if (startRow === endRow) {
            // Horizontal line
            let minCol = Math.min(startCol, endCol);
            let maxCol = Math.max(startCol, endCol);
            for (let col = minCol; col <= maxCol && col < 16; col++) {
                setLed(startRow, col, 1);
            }
        } else if (startCol === endCol) {
            // Vertical line
            let minRow = Math.min(startRow, endRow);
            let maxRow = Math.max(startRow, endRow);
            for (let row = minRow; row <= maxRow && row < 8; row++) {
                setLed(row, startCol, 1);
            }
        }
        updateDisplay();
    }

    // Helper functions for scrolling text
    function getMessageBitmap(text: string): number[] {
        let bitmap: number[] = [];
        for (let i = 0; i < 16; i++) bitmap.push(0); // Initial padding (16 columns)
        for (let char of text.toUpperCase()) {
            if (font[char]) {
                bitmap = bitmap.concat(font[char]); // Use font directly without rotation
            } else {
                bitmap = bitmap.concat(font[' ']); // Use space for undefined characters
            }
            bitmap.push(0); // Space between characters
        }
        if (text.length > 0) bitmap.pop(); // Remove extra space at end
        for (let i = 0; i < 16; i++) bitmap.push(0); // Final padding
        return bitmap;
    }

    function displayMessage(bitmap: number[], startCol: number) {
        // Clear the buffer
        matrixBuffer = [];
        for (let i = 0; i < 16; i++) {
            matrixBuffer.push(0);
        }

        // Map the bitmap (logical columns) to hardware columns
        for (let hardwareCol = 0; hardwareCol < 16; hardwareCol++) {
            let colData = 0;
            let bitmapIdx = hardwareCol + startCol;
            if (bitmapIdx >= 0 && bitmapIdx < bitmap.length) {
                colData = bitmap[bitmapIdx]; // Directly use the column data
            }
            matrixBuffer[hardwareCol] = colData;
        }
        updateDisplay();
    }
}
