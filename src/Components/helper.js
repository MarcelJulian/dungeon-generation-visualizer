class Coor {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getX = () => this.x;
    getY = () => this.y;
    getData = () => {
        return {
            x: this.x,
            y: this.y,
        };
    };
}

class Size {
    constructor(coor, width, height) {
        this.coor = coor;
        this.width = width;
        this.height = height;
    }

    getCoor = () => this.coor;
    getX = () => this.coor.getX();
    getY = () => this.coor.getY();
    getWidth = () => this.width;
    getHeight = () => this.height;
    getX2 = () => this.coor.getX() + this.width;
    getY2 = () => this.coor.getY() + this.height;
    getData = () => {
        return {
            x: this.coor.getX(),
            y: this.coor.getY(),
            width: this.width,
            height: this.height,
        };
    };
}

export { Coor, Size };
