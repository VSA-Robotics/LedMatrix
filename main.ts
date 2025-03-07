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
    let matrixBuffer: number[] = new Array(16).fill(0);

    // Define the font type to allow indexing by string
    interface FontMap {
        [key: string]: number[];
    }

    // Font definition corrected for proper orientation
    const font: FontMap = {
        'A': [0b01110, 0b10001, 0b11111, 0b10001, 0b10001],
        'B': [0b11110, 0b10001, 0b11110, 0b10001, 0b11110],
        'C': [0b01110, 0b10001, 0b10000, 0b10001, 0b01110],
        'D': [0b11100, 0b10010, 0b10001, 0b10010, 0b11100],
        'E': [0b11111, 0b10000, 0b11110, 0b10000, 0b11111],
        'F': [0b11111, 0b10000, 0b11110, 0b10000, 0b10000]
    };

    function rotateFontData(input: number[]): number[] {
        let output: number[] = new Array(8).fill(0);
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 8; col++) {
                if (input[row] & (1 << col)) {
                    output[col] |= (1 << row);
                }
            }
        }
        return output;
    }

    function getMessageBitmap(text: string): number[] {
        let bitmap: number[] = new Array(16).fill(0);
        for (let char of text.toUpperCase()) {
            if (font[char]) {
                bitmap = bitmap.concat(rotateFontData(font[char]));
            } else {
                bitmap = bitmap.concat(new Array(8).fill(0));
            }
            bitmap.push(0);
        }
        return bitmap;
    }

    function displayMessage(bitmap: number[], startCol: number) {
        for (let c = 0; c < 16; c++) {
            let msgCol = startCol + c;
            matrixBuffer[c] = (msgCol >= 0 && msgCol < bitmap.length) ? bitmap[msgCol] : 0;
        }
        updateDisplay();
    }
}
