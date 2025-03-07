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

    // Font definition for A-Z, 0-9, ?, !, % (5x8 bitmaps, stored in row-major order now)
    const font: FontMap = {
        'A': [0x08, 0x14, 0x22, 0x3E, 0x22],
        'B': [0x3C, 0x2A, 0x2A, 0x2A, 0x1C],
        'C': [0x1C, 0x22, 0x20, 0x22, 0x1C],
        'D': [0x3C, 0x22, 0x22, 0x22, 0x1C],
        'E': [0x3E, 0x28, 0x3C, 0x28, 0x3E],
        'F': [0x3E, 0x28, 0x3C, 0x28, 0x20]
    };

    function transposeFontData(input: number[]): number[] {
        let output: number[] = new Array(8).fill(0);
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 5; col++) {
                if (input[col] & (1 << row)) {
                    output[row] |= (1 << col);
                }
            }
        }
        return output;
    }

    function getMessageBitmap(text: string): number[] {
        let bitmap: number[] = new Array(16).fill(0);
        for (let char of text.toUpperCase()) {
            if (font[char]) {
                bitmap = bitmap.concat(transposeFontData(font[char]));
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
