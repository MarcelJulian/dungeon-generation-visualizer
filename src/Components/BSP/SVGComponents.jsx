import React, { Component } from "react";
import "./SVGComponents.css";

class BSPFirstSplitPath extends Component {
    render() {
        const { convertedLeaf, visuSpeed } = this.props;

        let { x, y, width, height } = convertedLeaf.getSize();

        let pathString = getRectangleSplitPath(x, y, width, height);

        let length = (width + height) * 2;
        let pathStyle = {
            strokeDasharray: length,
            strokeDashoffset: length,
        };

        let dur = getVisualizationDuration(visuSpeed, length);

        return (
            <path id="BSP-split-path-0" d={pathString} style={pathStyle}>
                {getAnimateTag(dur)}
            </path>
        );
    }
}
class BSPSplitPath extends Component {
    render() {
        const { id, convertedLeaf, visuSpeed } = this.props;

        let {
            x,
            y,
            width,
            height,
            isSplitVertical,
            isSplitHorizontal,
            splitPos,
        } = convertedLeaf.getAll();

        let { x1, y1, x2, y2 } = getLineSplitPath(
            x,
            y,
            width,
            height,
            isSplitVertical,
            isSplitHorizontal,
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

        return (
            <line id={id} x1={x1} y1={y1} x2={x2} y2={y2} style={pathStyle}>
                {getAnimateTag(dur)}
            </line>
        );
    }
}

function getAnimateTag(dur) {
    return (
        <animate
            attributeType="CSS"
            attributeName="stroke-dashoffset"
            to="0"
            dur={dur + "s"}
            fill="freeze"
            begin="indefinite"
        />
    );
}

function getVisualizationDuration(visuSpeed, length) {
    return length / visuSpeed;
}

export { BSPFirstSplitPath, BSPSplitPath };

function getRectangleSplitPath(x, y, width, height) {
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

function getLineSplitPath(
    x,
    y,
    width,
    height,
    isSplitVertical,
    isSplitHorizontal,
    splitPos
) {
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
