import React, { Component } from "react";
import BSP from "./BSP/BSP.js";
import {
    BSPFirstSplitPath,
    BSPSplitPath,
    BSPRoomPath,
    BSPConnectorPath,
} from "./BSP/SVGComponents.jsx";
import { ConvertedLeaf } from "./BSP/leaf.js";
import { ConvertedRoom } from "./BSP/room.js";
import Leaf from "./BSP/leaf.js";
import Room from "./BSP/room.js";
import Connector from "./BSP/connector.js";
import "./grid.css";
import { Coor } from "./helper.js";

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

                <BSPSplitSVG
                    curState={this.state}
                    visuSpeed={this.props.visuSpeed}
                    BSPtree={this.props.BSPtree}
                    BSPtreeHandler={this.props.BSPtreeHandler}
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
                <th scope="col" style={tdStyle}>
                    {i}
                </th>
            );

        let noBorderStyle = {
            border: "none",
        };

        grid.push(
            <tr>
                <td style={noBorderStyle}></td>
                {header}
            </tr>
        );

        // Outer loop to create parent
        for (let i = 0; i < this.state.row; i++) {
            let children = [];
            children.push(
                <th scope="row" style={tdStyle}>
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

function calculateBSP(col, row) {
    return BSP(0, 0, col, row);
}

function BSPSplitSVG(props) {
    console.log(document.documentElement);

    let tree = null;
    if (props.BSPtree === null) {
        tree = calculateBSP(props.curState.column, props.curState.row);
        props.BSPtreeHandler(tree);
    } else tree = props.BSPtree;

    console.log(props.BSPtree);

    // var tree = [];
    // tree.push(new Leaf(0, 0, 25, 15, true, false, 10));
    // tree.push(new Leaf(0, 0, 10, 15, false, true, 8));
    // tree.push(new Leaf(10, 0, 15, 15, false, true, 3));
    console.log("tree: " + tree);
    // console.log(props.curState);

    // tree.forEach((n, idx) => {
    //     console.log("connector: " + idx);
    //     let temp = n.getConnector();
    //     if (temp !== null) temp.forEach((n) => console.log(n.getData()));
    // });

    var gridStyle = {
        width: props.curState.winWidth,
        height: props.curState.winHeight,
    };

    return (
        <svg id={"SVGRoot"} style={gridStyle}>
            <g id="BSP-split" className="BSP-svg-paths">
                {createFirstSplitPath(tree[0], props.curState, props.visuSpeed)}
                {createSplitPath(tree, props.curState, props.visuSpeed)}
            </g>

            {getAnimateSplitGray()}
            {getAnimateSplitThin()}

            <g id="BSP-rooms" className="BSP-svg-paths">
                {createRoomPath(tree, props.curState, props.visuSpeed)}
            </g>
            <g id="BSP-connectors" className="BSP-svg-paths">
                {createConnectorPath(tree, props.curState, props.visuSpeed)}
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
    let cnt = 1;

    for (let i = 0; i < tree.length; i++) {
        let leaf = tree[i];
        // console.log(i + " splitPos: " + leaf.getSplitPos());
        if (leaf.getSplitPos() === 0) continue;

        let convertedLeaf = convertSize(leaf, curState);
        let id = "BSP-split-path-" + cnt;
        cnt++;

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
    let cnt = 0;

    for (let i = 0; i < tree.length; i++) {
        let leaf = tree[i];

        if (leaf.getRoom() === null) continue;

        let convertedRoom = convertSize(leaf.getRoom(), curState);
        let id = "BSP-room-path-" + cnt;
        cnt++;

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

function createConnectorPath(tree, curState, visuSpeed) {
    let paths = [];
    let cnt = 0;
    for (let i = tree.length - 1; i >= 0; i--) {
        let node = tree[i];

        if (node.getConnector() === null) continue;

        let convertedConnector = convertSize(node.getConnector(), curState);
        let id = "BSP-connector-path-" + cnt;
        cnt++;

        paths.push(
            <BSPConnectorPath
                key={id}
                id={id}
                convertedConnector={convertedConnector}
                visuSpeed={visuSpeed}
                interval={curState.interval}
                isSplitVertical={node.getIsSplitVertical()}
            ></BSPConnectorPath>
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
            xlinkHref="#BSP-split"
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
            xlinkHref="#BSP-split"
            attributeType="CSS"
            attributeName="stroke-width"
            to="3"
            dur="1s"
            fill="freeze"
            begin="indefinite"
        />
    );
}

export default Grid;
