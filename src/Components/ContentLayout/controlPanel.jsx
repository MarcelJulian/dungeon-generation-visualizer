import React, { Component } from "react";
import "./controlPanel.css";
import ControlPanelSlider from "./controlPanelSlider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlay,
    faPause,
    faStop,
    faStepForward,
    faStepBackward,
    faRedoAlt,
} from "@fortawesome/free-solid-svg-icons";

export default class ControlPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curAlgo: "bsp",
            visuState: "pause",
        };
    }

    render() {
        return (
            <div id="control-panel">
                <div id="control-wrapper">
                    <div id="control-algo-title">BINARY SPACE PARTITIONING</div>
                    {this.showControlButtons()}
                </div>
                <ControlPanelSlider
                    visuState={this.state.visuState}
                    visuTimestamps={this.props.visuTimestamps}
                />
            </div>
        );
    }

    showControlButtons = () => {
        return (
            <div id="control-icons">
                <FontAwesomeIcon
                    icon={faRedoAlt}
                    className="icons"
                    size="lg"
                    onClick={this.reset}
                    title="Reset"
                />
                <FontAwesomeIcon
                    icon={faStepBackward}
                    className="icons"
                    onClick={this.stepBackward}
                />

                {this.showPausePlayButton()}

                <FontAwesomeIcon
                    icon={faStepForward}
                    className="icons"
                    onClick={this.stepForward}
                />
                <FontAwesomeIcon
                    icon={faStop}
                    id="stop-icon"
                    className="icons"
                    size="lg"
                    onClick={this.stop}
                    title="Stop"
                />
            </div>
        );
    };

    reset = () => {
        this.setState({ visuState: "pause" });

        let g = document.getElementById("bsp-split");
        while (g.childElementCount) {
            let path = g.children[0];
            path.parentNode.removeChild(path);
        }

        this.props.bspHandler(null);
    };

    stepBackward = () => {
        let svgRoot = document.getElementById("svgRoot");
        let curTime = Math.round(svgRoot.getCurrentTime() * 1000);
        let ts = this.props.visuTimestamps;
        //preventing overflow
        if (curTime <= 0) return;

        let nextIdx = ts.findIndex((t) => t >= curTime);
        let prevTime = ts[nextIdx - 1] / 1000;

        svgRoot.setCurrentTime(prevTime);

        this.setSliderPos();
    };

    showPausePlayButton() {
        return (
            <FontAwesomeIcon
                icon={this.state.visuState === "start" ? faPause : faPlay}
                className="icons"
                size="lg"
                onClick={this.pausePlay}
                title={this.state.visuState === "start" ? "Pause" : "Play"}
            />
        );
    }

    pausePlay = () => {
        if (this.state.visuState === "pause")
            this.setState({ visuState: "start" });
        else if (this.state.visuState === "start")
            this.setState({ visuState: "pause" });

        let svgRoot = document.getElementById("svgRoot");
        if (svgRoot === null) return;

        if (svgRoot.animationsPaused()) {
            svgRoot.unpauseAnimations();
        } else {
            svgRoot.pauseAnimations();
        }
    };

    stepForward = () => {
        let svgRoot = document.getElementById("svgRoot");
        let curTime = Math.round(svgRoot.getCurrentTime() * 1000);
        let ts = this.props.visuTimestamps;
        //preventing overflow
        if (curTime >= ts[ts.length - 1]) return;

        let nextTime = ts.find((t) => t > curTime) / 1000;
        svgRoot.setCurrentTime(nextTime);

        this.setSliderPos();
    };

    stop = () => {
        let svgRoot = document.getElementById("svgRoot");

        svgRoot.setCurrentTime(0);

        this.setState({ visuState: "pause" });

        if (!svgRoot.animationsPaused()) {
            svgRoot.pauseAnimations();
        }
    };

    setSliderPos = () => {
        let svgRoot = document.getElementById("svgRoot");
        let curTime = Math.round(svgRoot.getCurrentTime() * 1000);
        let ts = this.props.visuTimestamps;
        let maxTime = ts[ts.length - 1];

        let pos = Math.round((curTime / maxTime) * 100000) / 1000;

        let slider = document.getElementById("slider");
        slider.style.width = pos + "%";
    };
}
