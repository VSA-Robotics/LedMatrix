//% color="#AA278D" weight=100
namespace LedMatrix {
    // =========================================================================
    // GUIDELINES FOR USING LED MATRIX EXTENSION
    // =========================================================================
    // 1. **Initialization**: Use `initialize LED matrix with SCK %sck and DIN %din`
    //    - Select micro:bit pins (e.g., P15 for SCK, P16 for DIN).
    //    - Example: `LedMatrix.initialize(DigitalPin.P15, DigitalPin.P16)`
    // 2. **Basic Usage**:
    //    - Clear the display with `clear display`.
    //    - Set LEDs with `set LED at row %row column %col to %state` (0 = off, 1 = on).
    //    - Scroll text with `scroll text %text with speed %speed direction %direction` (speed: 50-1000ms, direction: 0 = left, 1 = right).
    //    - Draw shapes with `draw line from row %startRow col %startCol to row %endRow col %endCol` or `draw rectangle at x %x y %y width %width height %height state %state`.
    // 3. **Tips**:
    //    - Use speed 100-300ms for readable text scrolling.
    //    - Row range: 0-7, Column range: 0-15 (for 8x16 matrix).
    //    - Ensure your 8x16 LED matrix is wired with 16 columns horizontally and 8 rows vertically.
    // =========================================================================

    // Global variables for pins and buffer
    let sckPin: DigitalPin;
    let dinPin: DigitalPin;
    let matrixBuffer: number[] = [];
    for (let i = 0; i < 16; i++) {
        matrixBuffer.push(0); // Initialize 16 bytes for 8 rows (2 bytes per row)
    }

    // Define the font type to allow indexing by string
    interface FontMap {
        [key: string]: number[];
    }

    // Font definition for A-Z, 0-9, and symbols (5 columns per character, 5 rows high)
    const font: FontMap = {
        'A': [0b01110, 0b10001, 0b11111, 0b10001, 0b10001],
        'B': [0b11110, 0b10001, 0b11110, 0b10001, 0b11110],
        'C': [0b01110, 0b10001, 0b10000, 0b10001, 0b01110],
        'D': [0b11100, 0b10010, 0b10001, 0b10010, 0b11100],
        'E': [0b11111, 0b10000, 0b11110, 0b10000, 0b11111],
        'F': [0b11111, 0b10000, 0b11110, 0b10000, 0b10000],
        'G': [0b01110, 0b10001, 0b10000, 0b10011, 0b01110],
        'H': [0b10001, 0b10001, 0b11111, 0b10001, 0b10001],
        'I': [0b01110, 0b00100, 0b00100, 0b00100, 0b01110],
        'J': [0b00010, 0b00010, 0b00010, 0b10010, 0b01100],
        'K': [0b10001, 0b10010, 0b10100, 0b11000, 0b10001],
        'L': [0b10000, 0b10000, 0b10000, 0b10000, 0b11111],
        'M': [0b10001, 0b11011, 0b10101, 0b10001, 0b10001],
        'N': [0b10001, 0b11001, 0b10101, 0b10011, 0b10001],
        'O': [0b01110, 0b10001, 0b10001, 0b10001, 0b01110],
        'P': [0b11110, 0b10001, 0b11110, 0b10000, 0b10000],
        'Q': [0b01110, 0b10001, 0b10001, 0b10011, 0b01101],
        'R': [0b11110, 0b10001, 0b11110, 0b10010, 0b10001],
        'S': [0b01110, 0b10000, 0b01110, 0b00001, 0b01110],
        'T': [0b11111, 0b00100, 0b00100, 0b00100, 0b00100],
        'U': [0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
        'V': [0b10001, 0b10001, 0b01010, 0b01010, 0b00100],
        'W': [0b10001, 0b10001, 0b10101, 0b11011, 0b10001],
        'X': [0b10001, 0b01010, 0b00100, 0b01010, 0b10001],
        'Y': [0b10001, 0b01010, 0b00100, 0b00100, 0b00100],
        'Z': [0b11111, 0b00010, 0b00100, 0b01000, 0b11111],
        '0': [0b01110, 0b10001, 0b10001, 0b10001, 0b01110],
        '1': [0b00100, 0b01100, 0b00100, 0b00100, 0b01110],
        '2': [0b01110, 0b00001, 0b01110, 0b10000, 0b11111],
        '3': [0b11110, 0b00001, 0b00110, 0b00001, 0b11110],
        '4': [0b10001, 0b10001, 0b11111, 0b00001, 0b00001],
        '5': [0b11111, 0b10000, 0b11110, 0b00001, 0b11110],
        '6': [0b01110, 0b10000, 0b11110, 0b10001, 0b01110],
        '7': [0b11111, 0b00001, 0b00010, 0b00100, 0b00100],
        '8': [0b01110, 0b10001, 0b01110, 0b10001, 0b01110],
        '9': [0b01110, 0b10001, 0b01111, 0b00001, 0b01110],
        ',': [0b00000, 0b00000, 0b00000, 0b00100, 0b01000],
        '.': [0b00000, 0b00000, 0b00000, 0b00000, 0b00100],
        '?': [0b01110, 0b00001, 0b00110, 0b00000, 0b00100],
        '!': [0b00100, 0b00100, 0b00100, 0b00000, 0b00100],
        '%': [0b11001, 0b11010, 0b00100, 0b01011, 0b10011],
        ' ': [0b00000, 0b00000, 0b00000, 0b00000, 0b00000] // Space character
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
    }

    /**
     * Set the state of an individual LED on the 8x16 matrix.
     * @param row The row index (0-7) to set the LED.
     * @param col The column index (0-15) to set the LED.
     * @param state The state to set (0 for off, 1 for on).
     */
    //% block="set LED at row %row column %col to %state"
    //% row.min=0 row.max=7
    //% col.min=0 col.max=15
    //% state.min=0 state.max=1
    export function setLed(row: number, col: number, state: number) {
        if (row < 0 || row >= 8 || col < 0 || col >= 16) {
            return; // Silent fail
        }
        const byteIndex = 2 * row + Math.floor(col / 8);
        const bitPosition = col % 8;
        if (state) {
            matrixBuffer[byteIndex] |= (1 << bitPosition);
        } else {
            matrixBuffer[byteIndex] &= ~(1 << bitPosition);
        }
        updateDisplay();
    }

    /**
     * Clear the entire LED matrix display.
     * Turns off all LEDs on the 8x16 matrix.
     */
    //% block="clear display"
    export function clear() {
        for (let i = 0; i < 16; i++) {
            matrixBuffer[i] = 0;
        }
        updateDisplay();
    }

    /**
     * Scroll text across the LED matrix.
     * @param text The text to scroll (supports A-Z, 0-9, ,, ., ?, !, %).
     * @param speed The delay between frames in milliseconds (50-1000).
     * @param direction The scroll direction (0 for left, 1 for right).
     */
    //% block="scroll text %text with speed %speed direction %direction"
    //% speed.min=50 speed.max=1000
    //% direction.min=0 direction.max=1
    export function scrollText(text: string, speed: number, direction: number) {
        const bitmap = getMessageBitmap(text);
        if (direction === 0) { // Scroll left (right-to-left)
            const maxStartCol = bitmap.length - 16;
            for (let startCol = 0; startCol <= maxStartCol; startCol++) {
                displayMessage(bitmap, startCol);
                basic.pause(speed);
            }
        } else if (direction === 1) { // Scroll right (left-to-right)
            const minStartCol = -16;
            for (let startCol = bitmap.length - 16; startCol >= minStartCol; startCol--) {
                displayMessage(bitmap, startCol);
                basic.pause(speed);
            }
        }
    }

    /**
     * Draw a rectangle on the LED matrix.
     * @param x The starting column (0-15) of the rectangle.
     * @param y The starting row (0-7) of the rectangle.
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
    }

    /**
     * Draw a line on the LED matrix (horizontal or vertical only).
     * @param startRow The starting row (0-7) of the line.
     * @param startCol The starting column (0-15) of the line.
     * @param endRow The ending row (0-7) of the line.
     * @param endCol The ending column (0-15) of the line.
     */
    //% block="draw line from row %startRow col %startCol to row %endRow col %endCol"
    //% startRow.min=0 startRow.max=7
    //% startCol.min=0 startCol.max=15
    //% endRow.min=0 endRow.max=7
    //% endCol.min=0 endCol.max=15
    export function drawLine(startRow: number, startCol: number, endRow: number, endCol: number) {
        if (startRow === endRow) {
            // Horizontal line
            const minCol = Math.min(startCol, endCol);
            const maxCol = Math.max(startCol, endCol);
            for (let col = minCol; col <= maxCol && col < 16; col++) {
                setLed(startRow, col, 1);
            }
        } else if (startCol === endCol) {
            // Vertical line
            const minRow = Math.min(startRow, endRow);
            const maxRow = Math.max(startRow, endRow);
            for (let row = minRow; row <= maxRow && row < 8; row++) {
                setLed(row, startCol, 1);
            }
        }
    }

    // Helper functions for scrolling text
    function getMessageBitmap(text: string): number[] {
        let bitmap: number[] = [];
        for (let i = 0; i < 16; i++) bitmap.push(0); // Initial padding

        for (let char of text.toUpperCase()) {
            if (font[char]) {
                for (let c = 0; c < 5; c++) { // For each column of the character
                    let columnPattern = 0;
                    for (let r = 0; r < 5; r++) { // For each row
                        let bit = (font[char][r] >> (4 - c)) & 1; // Get bit for column c
                        columnPattern |= (bit << r); // Set bit r in column pattern
                    }
                    bitmap.push(columnPattern);
                }
            } else {
                for (let c = 0; c < 5; c++) {
                    bitmap.push(0); // Undefined characters as spaces
                }
            }
            bitmap.push(0); // Space between characters
        }
        if (text.length > 0) bitmap.pop(); // Remove extra space at end
        for (let i = 0; i < 16; i++) bitmap.push(0); // Final padding
        return bitmap;
    }

    function displayMessage(bitmap: number[], startCol: number) {
        for (let r = 0; r < 8; r++) {
            let byte0 = 0; // Columns 0-7
            let byte1 = 0; // Columns 8-15
            for (let c = 0; c < 8; c++) {
                const msgCol = startCol + c;
                if (msgCol >= 0 && msgCol < bitmap.length) {
                    if (bitmap[msgCol] & (1 << r)) {
                        byte0 |= (1 << c);
                    }
                }
            }
            for (let c = 8; c < 16; c++) {
                const msgCol = startCol + c;
                if (msgCol >= 0 && msgCol < bitmap.length) {
                    if (bitmap[msgCol] & (1 << r)) {
                        byte1 |= (1 << (c - 8));
                    }
                }
            }
            matrixBuffer[2 * r] = byte0;
            matrixBuffer[2 * r + 1] = byte1;
        }
        updateDisplay();
    }
}
