import React, { Component } from "react";
//TODO: change BSP.js to index.js, go refactor!
import BSP from "./BinarySpacePartitioning/BSP.js";
import {
    BspFirstSplitPath,
    BspSplitPath,
    BspRoomPath,
    BspConnectorPath,
} from "./BinarySpacePartitioning/SvgComponents.jsx";
import { ConvertedLeaf } from "./BinarySpacePartitioning/leaf.js";
import { ConvertedRoom } from "./BinarySpacePartitioning/room.js";
import Leaf from "./BinarySpacePartitioning/leaf.js";
import Room from "./BinarySpacePartitioning/room.js";
import Connector from "./BinarySpacePartitioning/connector.js";
import "./grid.css";
import { Coor } from "./helper.js";

class Grid extends Component {
    constructor(props) {
        super(props);

        this.state = {
            winWidth: window.innerWidth,
            //61 is header height
            //TODO: convert magic number
            winHeight: window.innerHeight - 41.8 - 73.3,
            row: 15,
            column: 25,
            interval: 30,
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.curBspTree = null;
    }

    componentDidMount() {
        //get new window Width and Height
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions);

        let { visuTimestamps, visuTimestampsSplit } = connectBspPaths();
        if (this.props.bspTree === null) {
            this.props.bspHandler(
                this.curBspTree,
                visuTimestamps,
                visuTimestampsSplit
            );
        }
    }

    componentDidUpdate() {
        let { visuTimestamps, visuTimestampsSplit } = connectBspPaths();
        if (this.props.bspTree === null) {
            this.props.bspHandler(
                this.curBspTree,
                visuTimestamps,
                visuTimestampsSplit
            );
        }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        let headerHeight = document.getElementById("navbar").offsetHeight;
        let controlHeight = document.getElementById("control-panel")
            .offsetHeight;

        let curWidth = window.innerWidth - 400;
        //61 is header height
        let curHeight = window.innerHeight - headerHeight - controlHeight - 1;
        this.setState({
            winWidth: curWidth,
            winHeight: curHeight,
        });
    }

    updateTree = (passedTree) => {
        this.curBspTree = passedTree;
    };

    randNum = () => Math.floor(Math.random() * 1000);

    render() {
        var gridStyle = {
            width: this.state.winWidth,
            height: this.state.winHeight,
        };

        return (
            <div key={this.randNum()} id="visualizer">
                <div id="grid" style={gridStyle}>
                    <table>
                        <tbody>{this.createGrid()}</tbody>
                    </table>
                </div>

                <BspSplitSvg
                    curState={this.state}
                    visuSpeed={this.props.visuSpeed}
                    bspTree={this.props.bspTree}
                    bspHandler={this.props.bspHandler}
                    updateTree={this.updateTree}
                    settingOptions={this.props.settingOptions}
                />
            </div>
        );
    }

    createGrid = () => {
        let grid = [];
        let tdStyle = {
            width: this.state.interval + "px",
            height: this.state.interval + "px",
        };

        let header = [];
        for (let i = 0; i < this.state.column; i++)
            header.push(
                <th key={i} scope="col" style={tdStyle}>
                    {i}
                </th>
            );

        let noBorderStyle = {
            border: "none",
        };

        grid.push(
            <tr key="-1">
                <td style={noBorderStyle}></td>
                {header}
            </tr>
        );

        // Outer loop to create parent
        for (let i = 0; i < this.state.row; i++) {
            let children = [];
            children.push(
                <th key={i} scope="row" style={tdStyle}>
                    {i}
                </th>
            );
            //Inner loop to create children
            for (let j = 0; j < this.state.column; j++) {
                children.push(
                    <td
                        id={`node-${i + 1}-${j + 1}`}
                        key={`node-${i + 1}-${j + 1}`}
                        style={tdStyle}
                    ></td>
                );
            }
            //Create the parent and add the children
            grid.push(
                <tr id={`row-${i + 1}`} key={`row-${i + 1}`}>
                    {children}
                </tr>
            );
        }
        return grid;
    };
}

function calculateBsp(col, row, settingOptions) {
    return BSP(0, 0, col, row, settingOptions);
}

function BspSplitSvg(props) {
    let tree = null;
    if (props.bspTree === null) {
        tree = calculateBsp(
            props.curState.column,
            props.curState.row,
            props.settingOptions
        );
        props.updateTree(tree);
    } else tree = props.bspTree;

    var gridStyle = {
        width: props.curState.winWidth,
        height: props.curState.winHeight,
    };

    return (
        <svg id={"svgRoot"} style={gridStyle}>
            <g id="bsp-split" className="bsp-svg-paths">
                {createFirstSplitPath(tree[0], props.curState, props.visuSpeed)}
                {createSplitPath(tree, props.curState, props.visuSpeed)}
            </g>

            {getAnimateSplitGray()}
            {getAnimateSplitThin()}

            <g id="bsp-rooms" className="bsp-svg-paths">
                {createRoomPath(tree, props.curState, props.visuSpeed)}
            </g>
            <g id="bsp-connectors" className="bsp-svg-paths">
                {createConnectorPath(tree, props.curState, props.visuSpeed)}
            </g>
        </svg>
    );
}

function createFirstSplitPath(node, curState, visuSpeed) {
    let convertedLeaf = convertSize(node, curState);
    return (
        <BspFirstSplitPath
            convertedLeaf={convertedLeaf}
            visuSpeed={visuSpeed}
        ></BspFirstSplitPath>
    );
}

function createSplitPath(tree, curState, visuSpeed) {
    let paths = [];
    let cnt = 1;

    for (let i = 0; i < tree.length; i++) {
        let leaf = tree[i];
        // console.log(i + " splitPos: " + leaf.getSplitPos());
        if (leaf.getSplitPos() === 0) continue;

        let convertedLeaf = convertSize(leaf, curState);
        let id = "bsp-split-path-" + cnt;
        cnt++;

        paths.push(
            <BspSplitPath
                key={id}
                id={id}
                convertedLeaf={convertedLeaf}
                visuSpeed={visuSpeed}
            ></BspSplitPath>
        );
    }
    return paths;
}

function createRoomPath(tree, curState, visuSpeed) {
    let paths = [];
    let cnt = 0;

    for (let i = 0; i < tree.length; i++) {
        let leaf = tree[i];

        if (leaf.getRoom() === null) continue;

        let convertedRoom = convertSize(leaf.getRoom(), curState);
        let id = "bsp-room-path-" + cnt;
        cnt++;

        paths.push(
            <BspRoomPath
                key={id}
                id={id}
                convertedRoom={convertedRoom}
                visuSpeed={visuSpeed}
            ></BspRoomPath>
        );
    }
    return paths;
}

function createConnectorPath(tree, curState, visuSpeed) {
    let paths = [];
    let cnt = 0;
    for (let i = tree.length - 1; i >= 0; i--) {
        let node = tree[i];

        if (node.getConnector() === null) continue;

        let convertedConnector = convertSize(node.getConnector(), curState);
        let id = "bsp-connector-path-" + cnt;
        cnt++;

        paths.push(
            <BspConnectorPath
                key={id}
                id={id}
                convertedConnector={convertedConnector}
                visuSpeed={visuSpeed}
                interval={curState.interval}
                isSplitVertical={node.getIsSplitVertical()}
            ></BspConnectorPath>
        );
    }
    return paths;
}

function convertSize(obj, curState) {
    const interval = curState.interval;
    const gridWidth = (curState.column * interval) / 2;
    const gridHeight = (curState.row * interval) / 2;
    const winXCenter = curState.winWidth / 2;
    const winYCenter = curState.winHeight / 2;

    var x = winXCenter - gridWidth;
    var y = winYCenter - gridHeight;

    if (obj instanceof Leaf)
        return new ConvertedLeaf(
            x + obj.getX() * interval + interval / 2,
            y + obj.getY() * interval + interval / 2,
            obj.getWidth() * interval,
            obj.getHeight() * interval,
            obj.getIsSplitVertical(),
            obj.getSplitPos() * interval
        );

    if (obj instanceof Room) {
        return new ConvertedRoom(
            x + obj.getX() * interval + interval / 2,
            y + obj.getY() * interval + interval / 2,
            obj.getWidth() * interval,
            obj.getHeight() * interval
        );
    }
    if (obj instanceof Connector) {
        let convertedConnector = [];
        obj.getPath().forEach((coor) => {
            let coorX = coor.getX(),
                coorY = coor.getY();
            coorX = x + coorX * interval + interval / 2;
            coorY = y + coorY * interval + interval / 2;
            convertedConnector.push(new Coor(coorX, coorY));
        });
        return convertedConnector;
    }
}

function getAnimateSplitGray() {
    return (
        <animate
            id="animate-split-gray"
            xlinkHref="#bsp-split"
            attributeType="CSS"
            attributeName="stroke"
            to="gray"
            dur="1s"
            fill="freeze"
            begin="indefinite"
        />
    );
}

function getAnimateSplitThin() {
    return (
        <animate
            id="animate-split-thin"
            xlinkHref="#bsp-split"
            attributeType="CSS"
            attributeName="stroke-width"
            to="3"
            dur="1s"
            fill="freeze"
            begin="indefinite"
        />
    );
}

function connectBspPaths() {
    let g = document.getElementById("bsp-split");

    let n = g.childElementCount - 1;
    let beginAnim = "bsp-split-anim-" + n + ".end + 0.2s";

    let animGray = document.getElementById("animate-split-gray");
    let animThin = document.getElementById("animate-split-thin");

    animGray.setAttribute("begin", beginAnim);
    animThin.setAttribute("begin", beginAnim);

    g = document.getElementById("bsp-rooms");
    n = g.childElementCount - 1;
    let beginDoor = "bsp-room-anim-" + n + ".end + 0.2s";

    let animDoor = document.getElementById("bsp-door-anim-0");
    let animDoor2 = document.getElementById("bsp-door2-anim-0");
    animDoor.setAttribute("begin", beginDoor);
    animDoor2.setAttribute("begin", beginDoor);

    let svgRoot = document.getElementById("svgRoot");
    let animateTags = svgRoot.getElementsByTagName("animate");
    let totalDuration = 0;
    let timestamps = [0];
    let timestampsSplit = [];
    // console.log(animateTags);
    for (let i = 0; i < animateTags.length; i++) {
        //These animations begin concurrently with another animation
        if (animateTags[i].id === "animate-split-thin") continue;
        else if (animateTags[i].id.includes("door2")) continue;
        else if (animateTags[i].id.includes("anim2")) continue;

        let dur = animateTags[i].getAttribute("dur");
        dur = dur.substring(0, dur.length - 1);
        dur *= 1000;
        totalDuration += dur + 200;

        if (animateTags[i].id === "bsp-split-anim-0") {
            timestampsSplit.push(totalDuration);
        } else if (animateTags[i].id === "animate-split-gray") {
            timestampsSplit.push(totalDuration);
        } else if (animateTags[i].id === "bsp-door-anim-0") {
            timestampsSplit.push(totalDuration - dur - 200);
        }

        timestamps.push(totalDuration);
    }

    //pushing the last timestamp
    timestampsSplit.push(timestamps[timestamps.length - 1]);

    return {
        visuTimestamps: timestamps,
        visuTimestampsSplit: timestampsSplit,
    };
}

export default Grid;
