//% color="#AA278D" weight=100
namespace LedMatrix {
    // =========================================================================
    // LED Matrix Initialization & Global Variables
    // =========================================================================
    let sckPin: DigitalPin;
    let dinPin: DigitalPin;
    let matrixBuffer: number[] = new Array(16).fill(0);

    // =========================================================================
    // Font Map (Corrected Orientation)
    // =========================================================================
    const font: { [key: string]: number[] } = {
        'A': [0x1C, 0x22, 0x3E, 0x22, 0x22],
        'B': [0x3C, 0x22, 0x3C, 0x22, 0x3C],
        'C': [0x1C, 0x22, 0x20, 0x22, 0x1C],
        'D': [0x3C, 0x22, 0x22, 0x22, 0x3C],
        'E': [0x3E, 0x20, 0x3C, 0x20, 0x3E],
        'F': [0x3E, 0x20, 0x3C, 0x20, 0x20],
        ' ': [0x00, 0x00, 0x00, 0x00, 0x00] // Space character
    };

    // =========================================================================
    // Low-Level Communication Functions
    // =========================================================================
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
        sendByte(0b11000000); // Start at address 0
        for (let k = 0; k < data.length; k++) {
            sendByte(data[k]);
        }
        endSignal();
        startSignal();
        sendByte(0b10001000); // Display ON
        endSignal();
    }

    function updateDisplay() {
        writeBytesToAddress(0, matrixBuffer);
    }

    // =========================================================================
    // LED Matrix Display Functions
    // =========================================================================
    export function initialize(sck: DigitalPin, din: DigitalPin) {
        sckPin = sck;
        dinPin = din;
        pins.digitalWritePin(dinPin, 1);
        pins.digitalWritePin(sckPin, 1);
        clear();
    }

    export function setLed(row: number, col: number, state: number) {
        if (row < 0 || row >= 8 || col < 0 || col >= 16) {
            console.log(`Invalid LED position: row=${row}, col=${col}`);
            return;
        }
        if (state) {
            matrixBuffer[col] |= (1 << row);
        } else {
            matrixBuffer[col] &= ~(1 << row);
        }
        updateDisplay();
    }

    export function clear() {
        matrixBuffer.fill(0);
        updateDisplay();
    }

    // =========================================================================
    // Text Scrolling Fix
    // =========================================================================
    function flipVertical(pattern: number): number {
        let reversed = 0;
        for (let i = 0; i < 8; i++) {
            reversed <<= 1;
            reversed |= (pattern >> i) & 1;
        }
        return reversed;
    }

    function getMessageBitmap(text: string): number[] {
        let bitmap: number[] = new Array(16).fill(0);
        for (let char of text.toUpperCase()) {
            if (font[char]) {
                for (let colPattern of font[char]) {
                    bitmap.push(flipVertical(colPattern));
                }
            } else {
                bitmap.push(0); // Unrecognized character
            }
            bitmap.push(0); // Space between characters
        }
        return bitmap.concat(new Array(16).fill(0)); // End padding
    }

    function displayMessage(bitmap: number[], startCol: number) {
        for (let c = 0; c < 16; c++) {
            let msgCol = startCol + c;
            matrixBuffer[c] = (msgCol >= 0 && msgCol < bitmap.length) ? bitmap[msgCol] : 0;
        }
        updateDisplay();
    }

    export function scrollText(text: string, speed: number, direction: number) {
        let bitmap = getMessageBitmap(text);
        let maxStartCol = bitmap.length - 16;

        if (direction === 0) { // Scroll left
            for (let startCol = 0; startCol <= maxStartCol; startCol++) {
                displayMessage(bitmap, startCol);
                basic.pause(speed);
            }
        } else { // Scroll right
            for (let startCol = maxStartCol; startCol >= 0; startCol--) {
                displayMessage(bitmap, startCol);
                basic.pause(speed);
            }
        }
    }
}
