//Classes in javascript is weird. Using classes in this project is fine but,
//it's better to benefit from the prototype aspect of javascript than the classics.

class Leaf {
    leftChild = null;
    rightChild = null;

    isSplitVertical = false;
    isSplitHorizontal = false;

    splitPos = 0;

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
    lowerLim = 0.3;
    upperLim = 0.7;

    //smallest possible width and height
    minWidth = 4;
    minHeight = 4;

    //TODO: convert these limits to props

    splitVertical() {
        //width is too small to be splitted
        if (this.width < this.minWidth * 2) return false;

        let boundary = Math.floor(
            this.width - this.width * (this.lowerLim + 1.0 - this.upperLim)
        );
        let rand = Math.floor(Math.random() * boundary);
        rand += Math.floor(this.width * this.lowerLim);

        //preventing rand being lower than the min size
        if (rand < this.minWidth || this.width - rand < this.minWidth)
            rand = this.minWidth;

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
            this.height - this.height * (this.lowerLim + 1.0 - this.upperLim)
        );
        let rand = Math.floor(Math.random() * boundary);
        rand += Math.floor(this.height * this.lowerLim);

        //preventing rand being lower than the min size
        if (rand < this.minHeight || this.height - rand < this.minHeight)
            rand = this.minHeight;

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
