import { Coor } from "../helper.js";

export default class Connector {
    constructor(leftSide, rightSide, isSplitVertical, splitPos) {
        let path = [];
        // leftSide.forEach((element) => {
        //     console.log("Left: X: " + element.getX() + " Y: " + element.getY());
        // });

        // rightSide.forEach((element) => {
        //     console.log(
        //         "Right: X: " + element.getX() + " Y: " + element.getY()
        //     );
        // });

        let randLeft = Math.floor(Math.random() * leftSide.length);
        let randRight = Math.floor(Math.random() * rightSide.length);

        let coorLeftX = leftSide[randLeft].getX();
        let coorLeftY = leftSide[randLeft].getY();
        let coorRightX = rightSide[randRight].getX();
        let coorRightY = rightSide[randRight].getY();

        if (isSplitVertical) {
            let split = splitPos - Math.floor(Math.random() * 2);
            // console.log("Split: " + split);

            for (let i = coorLeftX + 1; i <= split; i++) {
                path.push(new Coor(i, coorLeftY));
                // console.log("First Step: " + i + ", " + coorLeftY);
            }

            if (coorLeftY < coorRightY) {
                for (let i = coorLeftY + 1; i <= coorRightY; i++) {
                    path.push(new Coor(split, i));
                    // console.log("Second Step < : " + split + ", " + i);
                }
            } else if (coorLeftY > coorRightY) {
                for (let i = coorLeftY - 1; i >= coorRightY; i--) {
                    path.push(new Coor(split, i));
                    // console.log("Second Step > : " + split + ", " + i);
                }
            } else {
                //straight
            }

            for (let i = split + 1; i < coorRightX; i++) {
                path.push(new Coor(i, coorRightY));
                // console.log("Third Step: " + i + ", " + coorRightY);
            }
        } else {
            let split = splitPos - Math.floor(Math.random() * 2);
            // console.log("Split: " + split);
            //left: (1,6) (2,6) (3,6) (4,6) (5,6)
            //right: (1,9) (2,9)

            for (let i = coorLeftY + 1; i <= split; i++) {
                path.push(new Coor(coorLeftX, i));
                // console.log("First Step: " + coorLeftX + ", " + i);
            }

            if (coorLeftX < coorRightX) {
                for (let i = coorLeftX + 1; i <= coorRightX; i++) {
                    path.push(new Coor(i, split));
                    // console.log("Second Step < : " + i + ", " + split);
                }
            } else if (coorLeftX > coorRightX) {
                for (let i = coorLeftX - 1; i >= coorRightX; i--) {
                    path.push(new Coor(i, split));
                    // console.log("Second Step > : " + i + ", " + split);
                }
            } else {
                //straight
            }

            for (let i = split + 1; i < coorRightY; i++) {
                path.push(new Coor(coorRightX, i));
                // console.log("Third Step: " + coorRightX + ", " + i);
            }
        }

        this.path = path;
    }

    getPath = () => this.path;
}
