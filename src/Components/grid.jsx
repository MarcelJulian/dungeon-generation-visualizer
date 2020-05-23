import React, { Component } from "react";
import BSP from "./BSP/BSP.js";
import {
    BSPFirstSplitPath,
    BSPSplitPath,
    BSPRoomPath,
} from "./BSP/SVGComponents.jsx";
import { ConvertedLeaf } from "./BSP/leaf.js";
import { ConvertedRoom } from "./BSP/room.js";
import Leaf from "./BSP/leaf.js";
import Room from "./BSP/room.js";
import "./grid.css";

class Grid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            winWidth: window.innerWidth,
            //99 is from padding (30+30) and 39 of button height
            //TODO: convert magic number
            winHeight: window.innerHeight - 99,
            row: 15,
            column: 25,
            interval: 30,
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        //get new window Width and Height
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        let curWidth = window.innerWidth;
        //99 is from padding (30+30) and 39 of button height
        let curHeight = window.innerHeight - 99;
        this.setState({
            winWidth: curWidth,
            winHeight: curHeight,
        });
    }

    randNum = () => Math.random() * 1000;

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

                <BSPSplitSVG
                    curState={this.state}
                    visuSpeed={this.props.visuSpeed}
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

        // Outer loop to create parent
        for (let i = 0; i < this.state.row; i++) {
            let children = [];
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

function calculateBSP(col, row) {
    return BSP(0, 0, col, row);
}

function BSPSplitSVG(props) {
    const tree = calculateBSP(props.curState.column, props.curState.row);
    // var tree = [];
    // tree.push(new Leaf(0, 0, 25, 15, true, false, 10));
    // tree.push(new Leaf(0, 0, 10, 15, false, true, 8));
    // tree.push(new Leaf(10, 0, 15, 15, false, true, 3));
    console.log(tree);
    // console.log(props.curState);

    var gridStyle = {
        width: props.curState.winWidth,
        height: props.curState.winHeight,
    };

    return (
        <svg style={gridStyle}>
            <g id="BSP-split" className="BSP-svg-paths">
                {createFirstSplitPath(tree[0], props.curState, props.visuSpeed)}
                {createSplitPath(tree, props.curState, props.visuSpeed)}
            </g>
            {getAnimateSplitGray()}
            {getAnimateSplitThin()}
            <g id="BSP-rooms" className="BSP-svg-paths">
                {createRoomPath(tree, props.curState, props.visuSpeed)}
            </g>
        </svg>
    );
}

function createFirstSplitPath(node, curState, visuSpeed) {
    let convertedLeaf = convertSize(node, curState);
    return (
        <BSPFirstSplitPath
            convertedLeaf={convertedLeaf}
            visuSpeed={visuSpeed}
        ></BSPFirstSplitPath>
    );
}

function createSplitPath(tree, curState, visuSpeed) {
    let paths = [];
    for (let i = 0; i < tree.length; i++) {
        let leaf = tree[i];
        // console.log(i + " splitPos: " + leaf.getSplitPos());
        if (leaf.getSplitPos() === 0) continue;

        let convertedLeaf = convertSize(leaf, curState);
        let id = "BSP-split-path-" + (i + 1);
        paths.push(
            <BSPSplitPath
                key={id}
                id={id}
                convertedLeaf={convertedLeaf}
                visuSpeed={visuSpeed}
            ></BSPSplitPath>
        );
    }
    return paths;
}

function createRoomPath(tree, curState, visuSpeed) {
    let paths = [];
    for (let i = 0; i < tree.length; i++) {
        let leaf = tree[i];

        if (leaf.getRoom() === null) continue;

        let convertedRoom = convertSize(leaf.getRoom(), curState);
        let id = "BSP-room-path-" + (i + 1);
        paths.push(
            <BSPRoomPath
                key={id}
                id={id}
                convertedRoom={convertedRoom}
                visuSpeed={visuSpeed}
            ></BSPRoomPath>
        );
    }
    return paths;
}

function convertSize(node, curState) {
    const interval = curState.interval;
    const gridWidth = (curState.column * interval) / 2;
    const gridHeight = (curState.row * interval) / 2;
    const winXCenter = curState.winWidth / 2;
    const winYCenter = curState.winHeight / 2;

    var x = winXCenter - gridWidth;
    var y = winYCenter - gridHeight;

    if (node instanceof Leaf)
        return new ConvertedLeaf(
            x + node.getX() * interval,
            y + node.getY() * interval,
            node.getWidth() * interval,
            node.getHeight() * interval,
            node.getIsSplitVertical(),
            node.getIsSplitHorizontal(),
            node.getSplitPos() * interval
        );

    if (node instanceof Room) {
        return new ConvertedRoom(
            x + node.getX() * interval,
            y + node.getY() * interval,
            node.getWidth() * interval,
            node.getHeight() * interval
        );
    }
}

function getAnimateSplitGray() {
    return (
        <animate
            id="animate-split-gray"
            xlinkHref="#BSP-split"
            attributeType="CSS"
            attributeName="stroke"
            to="gray"
            dur="2s"
            fill="freeze"
            begin="indefinite"
        />
    );
}

function getAnimateSplitThin() {
    return (
        <animate
            id="animate-split-thin"
            xlinkHref="#BSP-split"
            attributeType="CSS"
            attributeName="stroke-width"
            to="3"
            dur="2s"
            fill="freeze"
            begin="indefinite"
        />
    );
}

function convertRoom() {}

export default Grid;
