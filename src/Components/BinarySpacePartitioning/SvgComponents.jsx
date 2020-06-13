import React, { Component } from "react";
import "./SvgComponents.css";

var delay = " + 0.2s";

export class BspFirstSplitPath extends Component {
    componentDidMount() {
        let svgRoot = document.getElementById("svgRoot");
        svgRoot.pauseAnimations();
    }

    render() {
        const { convertedLeaf, visuSpeed } = this.props;

        let { x, y, width, height } = convertedLeaf.getSize();

        let pathString = getRectanglePath(x, y, width, height);

        let length = (width + height) * 2;
        let pathStyle = {
            strokeDasharray: length,
            strokeDashoffset: length,
        };

        let dur = getVisualizationDuration(visuSpeed, length);

        return (
            <path id="bsp-split-path-0" d={pathString} style={pathStyle}>
                {animatePath(dur, "bsp-split-anim-0", "0s")}
            </path>
        );
    }
}

export class BspSplitPath extends Component {
    render() {
        const { id, convertedLeaf, visuSpeed } = this.props;

        let {
            x,
            y,
            width,
            height,
            isSplitVertical,
            splitPos,
        } = convertedLeaf.getAll();

        let { x1, y1, x2, y2 } = getLineSplitPath(
            x,
            y,
            width,
            height,
            isSplitVertical,
            splitPos
        );

        let length = 0;
        if (isSplitVertical) length = height;
        else length = width;

        let pathStyle = {
            strokeDasharray: length,
            strokeDashoffset: length,
        };

        let dur = getVisualizationDuration(visuSpeed, length);

        let idAnim = id.replace("path", "anim");
        let idx = id.lastIndexOf("-");
        let num = parseInt(id.slice(idx + 1)) - 1;
        let begin = idAnim.slice(0, idx + 1) + num + ".end" + delay;

        return (
            <line id={id} x1={x1} y1={y1} x2={x2} y2={y2} style={pathStyle}>
                {animatePath(dur, idAnim, begin)}
            </line>
        );
    }
}

export class BspRoomPath extends Component {
    render() {
        const { id, convertedRoom, visuSpeed } = this.props;

        let { x, y, width, height } = convertedRoom.getSize();

        let pathString = getRectanglePath(x, y, width, height);

        let length = (width + height) * 2;
        let pathStyle = {
            strokeDasharray: length,
            strokeDashoffset: length,
        };

        let dur = getVisualizationDuration(visuSpeed, length);
        let idAnim = id.replace("path", "anim");
        let idx = id.lastIndexOf("-");
        let num = parseInt(id.slice(idx + 1)) - 1;
        let begin = idAnim.slice(0, idx + 1) + num + ".end" + delay;
        if (num === -1) begin = "animate-split-gray.end" + delay;

        return (
            <path id={id} d={pathString} style={pathStyle}>
                {animatePath(dur, idAnim, begin)}
            </path>
        );
    }
}

export class BspConnectorPath extends Component {
    render() {
        const {
            id,
            convertedConnector,
            visuSpeed,
            interval,
            isSplitVertical,
        } = this.props;

        let { path1, path2 } = getConnectorPath(
            convertedConnector,
            interval,
            isSplitVertical
        );

        let length = convertedConnector.length * interval;
        let pathStyle = {
            strokeDasharray: length,
            strokeDashoffset: length,
            // strokeWidth: 3,
        };

        let dur = getVisualizationDuration(visuSpeed, length * 2);

        let id2 = id.replace("path", "path2");

        let idAnim = id.replace("path", "anim");
        let idAnim2 = idAnim.replace("anim", "anim2");
        let idDoor = idAnim.replace("connector", "door");
        let idx = id.lastIndexOf("-");
        let num = parseInt(id.slice(idx + 1)) - 1;
        let begin = idDoor + ".end" + delay;
        let beginDoor = idAnim.slice(0, idx + 1) + num + ".end" + delay;

        let door = () =>
            getDoorPath(
                convertedConnector,
                interval,
                isSplitVertical,
                idDoor,
                beginDoor
            );

        return (
            <g>
                {door()}
                <polyline id={id} points={path1} style={pathStyle}>
                    {animatePath(dur, idAnim, begin)}
                </polyline>
                <polyline id={id2} points={path2} style={pathStyle}>
                    {animatePath(dur, idAnim2, begin)}
                </polyline>
            </g>
        );
    }
}

function animatePath(dur, id, begin = "indefinite") {
    return (
        <animate
            id={id}
            attributeType="CSS"
            attributeName="stroke-dashoffset"
            to="0"
            dur={dur + "s"}
            fill="freeze"
            begin={begin}
        />
    );
}

function getVisualizationDuration(visuSpeed, length) {
    return length / visuSpeed;
}

function getRectanglePath(x, y, width, height) {
    return (
        "M" +
        x +
        " " +
        y +
        " L" +
        (x + width) +
        " " +
        y +
        " L" +
        (x + width) +
        " " +
        (y + height) +
        " L" +
        x +
        " " +
        (y + height) +
        " L" +
        x +
        " " +
        y +
        " Z"
    );
}

function getLineSplitPath(x, y, width, height, isSplitVertical, splitPos) {
    if (isSplitVertical)
        return {
            x1: x + splitPos,
            y1: y,
            x2: x + splitPos,
            y2: y + height,
        };
    return {
        x1: x,
        y1: y + splitPos,
        x2: x + width,
        y2: y + splitPos,
    };
}

function getConnectorPath(path, interval, isSplitVertical) {
    let turnIdx = [],
        lastDir = "",
        dirList = [];
    let path1 = "",
        path2 = "";

    for (let i = 0; i < path.length - 1; i++) {
        let curDir = getDir(
            path[i].getX(),
            path[i].getY(),
            path[i + 1].getX(),
            path[i + 1].getY()
        );
        if (lastDir === "") {
            lastDir = curDir;
            dirList.push(curDir);
        } else if (lastDir !== curDir) {
            lastDir = curDir;
            turnIdx.push(i);
            dirList.push(curDir);
        }
    }

    //straight line
    if (dirList.length === 1) {
        let c1 = path[0],
            c2 = path[path.length - 1];
        const c1x = c1.getX(),
            c1y = c1.getY(),
            c2x = c2.getX(),
            c2y = c2.getY();
        const c1x_i = c1x + interval,
            c1y_i = c1y + interval,
            c2x_i = c2x + interval,
            c2y_i = c2y + interval;

        if (dirList[0] === "down") {
            path1 = c1x + "," + c1y + " " + c2x + "," + c2y_i;
            path2 = c1x_i + "," + c1y + " " + c2x_i + "," + c2y_i;
        } else if (dirList[0] === "right") {
            path1 = c1x + "," + c1y_i + " " + c2x_i + "," + c2y_i;
            path2 = c1x + "," + c1y + " " + c2x_i + "," + c2y;
        } else console.log("Error Connector with length 1. Dir: " + dirList[0]);
    } else if (dirList.length === 2) {
        //1 turn
        let c1 = path[0],
            c2 = path[turnIdx[0]],
            c3 = path[path.length - 1];
        const c1x = c1.getX(),
            c1y = c1.getY(),
            c2x = c2.getX(),
            c2y = c2.getY(),
            c3x = c3.getX(),
            c3y = c3.getY();
        const c1x_i = c1x + interval,
            c1y_i = c1y + interval,
            c2x_i = c2x + interval,
            c2y_i = c2y + interval,
            c3x_i = c3x + interval,
            c3y_i = c3y + interval;

        if (
            dirList[0] === "down" &&
            dirList[1] === "right" &&
            isSplitVertical
        ) {
            path1 = c1x + "," + c1y_i + " " + c2x + "," + c2y_i;
            path1 += " " + c3x_i + "," + c3y_i;
            path2 = c1x + "," + c1y + " " + c1x_i + "," + c1y;
            path2 += " " + c2x_i + "," + c2y + " " + c3x_i + "," + c3y;
        } else if (
            dirList[0] === "down" &&
            dirList[1] === "right" &&
            !isSplitVertical
        ) {
            path1 = c1x + "," + c1y + " " + c2x + "," + c2y_i;
            path1 += " " + c3x + "," + c3y_i;
            path2 = c1x_i + "," + c1y + " " + c2x_i + "," + c2y;
            path2 += " " + c3x_i + "," + c3y + " " + c3x_i + "," + c3y_i;
        } else if (
            dirList[0] === "right" &&
            dirList[1] === "down" &&
            isSplitVertical
        ) {
            path1 = c1x + "," + c1y + " " + c2x_i + "," + c2y;
            path1 += " " + c3x_i + "," + c3y;
            path2 = c1x + "," + c1y_i + " " + c2x + "," + c2y_i;
            path2 += " " + c3x + "," + c3y_i + " " + c3x_i + "," + c3y_i;
        } else if (
            dirList[0] === "right" &&
            dirList[1] === "down" &&
            !isSplitVertical
        ) {
            path1 = c1x + "," + c1y + " " + c1x + "," + c1y_i;
            path1 += " " + c2x + "," + c2y_i + " " + c3x + "," + c3y_i;
            path2 = c1x_i + "," + c1y + " " + c2x_i + "," + c2y;
            path2 += " " + c3x_i + "," + c3y_i;
        } else if (dirList[0] === "up" && dirList[1] === "right") {
            path1 = c1x + "," + c1y + " " + c2x + "," + c2y;
            path1 += " " + c3x_i + "," + c3y;
            path2 = c1x + "," + c1y_i + " " + c1x_i + "," + c1y_i;
            path2 += " " + c2x_i + "," + c2y_i + " " + c3x_i + "," + c3y_i;
        } else if (dirList[0] === "right" && dirList[1] === "up") {
            path1 = c1x + "," + c1y + " " + c2x + "," + c2y;
            path1 += " " + c3x + "," + c3y + " " + c3x_i + "," + c3y;
            path2 = c1x + "," + c1y_i + " " + c2x_i + "," + c2y_i;
            path2 += " " + c3x_i + "," + c3y_i;
        } else if (dirList[0] === "left" && dirList[1] === "down") {
            path1 = c1x + "," + c1y + " " + c2x + "," + c2y;
            path1 += " " + c3x + "," + c3y_i;
            path2 = c1x_i + "," + c1y + " " + c1x_i + "," + c1y_i;
            path2 += " " + c2x_i + "," + c2y_i + " " + c3x_i + "," + c3y_i;
        } else if (dirList[0] === "down" && dirList[1] === "left") {
            path1 = c1x + "," + c1y + " " + c2x + "," + c2y;
            path1 += " " + c3x + "," + c3y + " " + c3x + "," + c3y_i;
            path2 = c1x_i + "," + c1y + " " + c2x_i + "," + c2y_i;
            path2 += " " + c3x_i + "," + c3y_i;
        } else
            console.log(
                "Error Connector with length 2. Dir: " +
                    dirList[0] +
                    " to " +
                    dirList[1]
            );
    } else if (dirList.length === 3) {
        //2 turn
        let c1 = path[0],
            c2 = path[turnIdx[0]],
            c3 = path[turnIdx[1]],
            c4 = path[path.length - 1];
        const c1x = c1.getX(),
            c1y = c1.getY(),
            c2x = c2.getX(),
            c2y = c2.getY(),
            c3x = c3.getX(),
            c3y = c3.getY(),
            c4x = c4.getX(),
            c4y = c4.getY();
        const c1x_i = c1x + interval,
            c1y_i = c1y + interval,
            c2x_i = c2x + interval,
            c2y_i = c2y + interval,
            c3x_i = c3x + interval,
            c3y_i = c3y + interval,
            c4x_i = c4x + interval,
            c4y_i = c4y + interval;

        if (
            dirList[0] === "down" &&
            dirList[1] === "right" &&
            dirList[2] === "down"
        ) {
            path1 = c1x + "," + c1y + " " + c2x + "," + c2y_i;
            path1 += " " + c3x + "," + c3y_i + " " + c4x + "," + c4y_i;
            path2 = c1x_i + "," + c1y + " " + c2x_i + "," + c2y;
            path2 += " " + c3x_i + "," + c3y + " " + c4x_i + "," + c4y_i;
        } else if (
            dirList[0] === "down" &&
            dirList[1] === "left" &&
            dirList[2] === "down"
        ) {
            path1 = c1x + "," + c1y + " " + c2x + "," + c2y;
            path1 += " " + c3x + "," + c3y + " " + c4x + "," + c4y_i;
            path2 = c1x_i + "," + c1y + " " + c2x_i + "," + c2y_i;
            path2 += " " + c3x_i + "," + c3y_i + " " + c4x_i + "," + c4y_i;
        } else if (
            dirList[0] === "right" &&
            dirList[1] === "down" &&
            dirList[2] === "right"
        ) {
            path1 = c1x + "," + c1y_i + " " + c2x + "," + c2y_i;
            path1 += " " + c3x + "," + c3y_i + " " + c4x_i + "," + c4y_i;
            path2 = c1x + "," + c1y + " " + c2x_i + "," + c2y;
            path2 += " " + c3x_i + "," + c3y + " " + c4x_i + "," + c4y;
        } else if (
            dirList[0] === "right" &&
            dirList[1] === "up" &&
            dirList[2] === "right"
        ) {
            path1 = c1x + "," + c1y + " " + c2x + "," + c2y;
            path1 += " " + c3x + "," + c3y + " " + c4x_i + "," + c4y;
            path2 = c1x + "," + c1y_i + " " + c2x_i + "," + c2y_i;
            path2 += " " + c3x_i + "," + c3y_i + " " + c4x_i + "," + c4y_i;
        } else
            console.log(
                "Error Connector with length 3. Dir: " +
                    dirList[0] +
                    " to " +
                    dirList[1] +
                    " to " +
                    dirList[2]
            );
    }

    return {
        path1: path1,
        path2: path2,
    };
}

function getDoorPath(path, interval, isSplitVertical, id, begin) {
    // let pathStyleThin = {
    //     strokeDasharray: interval - 5,
    //     strokeDashoffset: interval - 5,
    //     stroke: "black",
    //     strokeWidth: 1,
    // };
    let pathStyleWhite = {
        strokeDasharray: interval - 5,
        strokeDashoffset: interval - 5,
        stroke: "white",
        strokeWidth: 5,
    };

    let dur = 0.25;

    let c1 = path[0],
        c2 = path[path.length - 1];
    const c1x = c1.getX(),
        c1y = c1.getY(),
        c2x = c2.getX(),
        c2y = c2.getY();
    const c1x_i = c1x + interval,
        c1y_i = c1y + interval,
        c2x_i = c2x + interval,
        c2y_i = c2y + interval;

    let x1 = 0,
        y1 = 0,
        x2 = 0,
        y2 = 0,
        x3 = 0,
        y3 = 0,
        x4 = 0,
        y4 = 0;
    if (isSplitVertical) {
        x1 = c1x;
        y1 = c1y + 2.5;
        x2 = c1x;
        y2 = c1y_i - 2.5;
        x3 = c2x_i;
        y3 = c2y + 2.5;
        x4 = c2x_i;
        y4 = c2y_i - 2.5;
    } else {
        x1 = c1x + 2.5;
        y1 = c1y;
        x2 = c1x_i - 2.5;
        y2 = c1y;
        x3 = c2x + 2.5;
        y3 = c2y_i;
        x4 = c2x_i - 2.5;
        y4 = c2y_i;
    }

    let id1 = id;
    let id2 = id.replace("door", "door2");
    return (
        <g>
            <line x1={x1} y1={y1} x2={x2} y2={y2} style={pathStyleWhite}>
                {animatePath(dur, id1, begin)}
            </line>
            {/* <line x1={x1} y1={y1} x2={x2} y2={y2} style={pathStyleThin}>
                {animatePath(dur)}
            </line> */}
            <line x1={x3} y1={y3} x2={x4} y2={y4} style={pathStyleWhite}>
                {animatePath(dur, id2, begin)}
            </line>
            {/* <line x1={x3} y1={y3} x2={x4} y2={y4} style={pathStyleThin}>
                {animatePath(dur)}
            </line> */}
        </g>
    );
}

function getDir(x1, y1, x2, y2) {
    if (x1 > x2) return "left";
    else if (x1 < x2) return "right";
    else if (y1 > y2) return "up";
    else if (y1 < y2) return "down";
}
