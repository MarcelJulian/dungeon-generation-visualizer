class Room {
    minWidth = 2;
    minHeight = 2;

    constructor(x, y, width, height) {
        //to prevent rooms going too close to each other
        let roomWidthBoundary = width - 2 - this.minWidth + 1;
        let roomHeightBoundary = height - 2 - this.minHeight + 1;

        this.width =
            Math.floor(Math.random() * roomWidthBoundary) + this.minWidth;
        this.height =
            Math.floor(Math.random() * roomHeightBoundary) + this.minHeight;

        let roomXBoundary = width - 2 - this.width + 1;
        let roomYBoundary = height - 2 - this.height + 1;

        this.x = Math.floor(Math.random() * roomXBoundary) + x + 1;
        this.y = Math.floor(Math.random() * roomYBoundary) + y + 1;
    }

    getX = () => this.x;
    getY = () => this.y;
    getWidth = () => this.width;
    getHeight = () => this.height;
    getSize = () => {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
        };
    };
}

class ConvertedRoom {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    getSize = () => {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
        };
    };
}

export default Room;
export { ConvertedRoom };
