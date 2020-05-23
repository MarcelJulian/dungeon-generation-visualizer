//Classes in javascript is weird. Using classes in this project is fine but,
//it's better to benefit from the prototype aspect of javascript than the classics.
import Room from "./room.js";

class Leaf {
    leftChild = null;
    rightChild = null;

    isSplitVertical = false;
    isSplitHorizontal = false;

    splitPos = 0;

    room = null;

    constructor(
        x,
        y,
        width,
        height,
        isSplitVertical = false,
        isSplitHorizontal = false,
        splitPos = 0
    ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isSplitVertical = isSplitVertical;
        this.isSplitHorizontal = isSplitHorizontal;
        this.splitPos = splitPos;
    }

    split() {
        if (this.leftChild != null || this.rightChild != null) return false;

        //if l or w is 50% larger, force split. Else, the split is random.
        if (this.width / this.height >= 1.5) this.isSplitVertical = true;
        else if (this.height / this.width >= 1.5) this.isSplitHorizontal = true;
        else {
            let rand = Math.floor(Math.random() * 2);
            if (rand) this.isSplitVertical = true;
            else this.isSplitHorizontal = true;
        }

        if (this.isSplitVertical) return this.splitVertical();
        else if (this.isSplitHorizontal) return this.splitHorizontal();
    }

    //lowest and highest multiplier for random
    //these limits are needed to either make the splits size vary or similar
    lowerLim = 0.2;
    upperLim = 0.8;

    //smallest possible width and height
    minWidth = 4;
    minHeight = 4;

    //TODO: convert these limits to props

    splitVertical() {
        //width is too small to be splitted
        if (this.width < this.minWidth * 2) return false;

        let boundary = Math.floor(
            this.width - this.width * (this.upperLim - this.lowerLim)
        );

        //preventing size being lower than the min size
        boundary =
            boundary > this.width - this.minWidth * 2
                ? this.width - this.minWidth * 2
                : boundary;
        boundary += 1;
        let min =
            this.width * this.lowerLim > this.minWidth
                ? this.width * this.lowerLim
                : this.minWidth;

        let rand = Math.floor(Math.random() * boundary);
        rand += Math.floor(min);

        this.splitPos = rand;

        this.leftChild = new Leaf(this.x, this.y, rand, this.height);
        this.rightChild = new Leaf(
            this.x + rand,
            this.y,
            this.width - rand,
            this.height
        );
        return true;
    }

    splitHorizontal() {
        //height is too small to be splitted
        if (this.height < this.minHeight * 2) return false;

        let boundary = Math.floor(
            this.height - this.height * (this.upperLim - this.lowerLim)
        );

        //preventing size being lower than the min size
        boundary =
            boundary > this.height - this.minHeight * 2
                ? this.height - this.minHeight * 2
                : boundary;
        boundary += 1;
        let min =
            this.height * this.lowerLim > this.minHeight
                ? this.height * this.lowerLim
                : this.minHeight;

        let rand = Math.floor(Math.random() * boundary);
        rand += Math.floor(min);

        this.splitPos = rand;

        this.leftChild = new Leaf(this.x, this.y, this.width, rand);
        this.rightChild = new Leaf(
            this.x,
            this.y + rand,
            this.width,
            this.height - rand
        );
        return true;
    }

    createRoom() {
        if (this.leftChild !== null) return;
        if (this.room !== null) return;
        this.room = new Room(this.x, this.y, this.width, this.height);
    }

    toString() {
        console.log("x: " + this.x + " y: " + this.y);
        console.log("width: " + this.width + " height: " + this.height);
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
    getLeftChild = () => this.leftChild;
    getRightChild = () => this.rightChild;
    getIsSplitVertical = () => this.isSplitVertical;
    getIsSplitHorizontal = () => this.isSplitHorizontal;
    getSplitPos = () => this.splitPos;
    getRoom = () => this.room;
}

class ConvertedLeaf {
    constructor(
        x,
        y,
        width,
        height,
        isSplitVertical,
        isSplitHorizontal,
        splitPos
    ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isSplitVertical = isSplitVertical;
        this.isSplitHorizontal = isSplitHorizontal;
        this.splitPos = splitPos;
    }

    getSize = () => {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
        };
    };

    getAll = () => {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            isSplitVertical: this.isSplitVertical,
            isSplitHorizontal: this.isSplitHorizontal,
            splitPos: this.splitPos,
        };
    };
}

export default Leaf;

export { ConvertedLeaf };
