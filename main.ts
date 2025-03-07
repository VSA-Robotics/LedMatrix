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

    // Function to initialize LED matrix
    export function initialize(sck: DigitalPin, din: DigitalPin) {
        sckPin = sck;
        dinPin = din;
        clearDisplay();
    }

    // Function to clear the display
    export function clearDisplay() {
        matrixBuffer.fill(0);
        updateDisplay();
    }

    // Function to update the display
    function updateDisplay() {
        // This function should send matrixBuffer data to the LED matrix
    }

    // Define the font type to allow indexing by string
    interface FontMap {
        [key: string]: number[];
    }

const font: FontMap = {
    'A': [0b01110, 0b10001, 0b11111, 0b10001, 0b10001],
    'B': [0b11110, 0b10001, 0b11110, 0b10001, 0b11110],
    'C': [0b01110, 0b10001, 0b10000, 0b10001, 0b01110],
    'D': [0b11100, 0b10010, 0b10001, 0b10010, 0b11100],
    'E': [0b11111, 0b10000, 0b11110, 0b10000, 0b11111],
    'F': [0b11111, 0b10000, 0b11110, 0b10000, 0b10000]
    // Add more letters here...
};

    // Function to convert character to LED matrix format
    function getCharacterBitmap(char: string): number[] {
        if (font[char]) {
            return transposeFontData(font[char]);
        }
        return new Array(8).fill(0); // Return empty space for unsupported characters
    }

    // Function to transpose font data
    function transposeFontData(input: number[]): number[] {
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

    // Function to scroll text across the LED matrix
    export function scrollText(text: string, speed: number, direction: number) {
        let bitmap: number[] = [];
        for (let char of text.toUpperCase()) {
            bitmap = bitmap.concat(getCharacterBitmap(char));
            bitmap.push(0); // Space between characters
        }
        displayScrollingText(bitmap, speed, direction);
    }

    // Function to handle scrolling effect
    function displayScrollingText(bitmap: number[], speed: number, direction: number) {
        let maxStartCol = bitmap.length - 16;
        for (let startCol = 0; startCol <= maxStartCol; startCol++) {
            updateDisplay();
            basic.pause(speed);
        }
    }
}
