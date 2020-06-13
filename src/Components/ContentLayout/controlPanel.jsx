import React, { Component } from "react";
import "./controlPanel.css";
import ControlPanelSlider from "./controlPanelSlider";
import { setSliderPos } from "./controlPanelSlider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlay,
    faPause,
    faStop,
    faStepForward,
    faStepBackward,
    // faRedoAlt,
} from "@fortawesome/free-solid-svg-icons";

export default class ControlPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curAlgo: "bsp",
            visuState: "pause",
        };
    }

    componentDidUpdate() {
        if (this.props.resetState) {
            //icon Play
            this.setState({
                visuState: "pause",
            });
            this.props.resetStateHandler(false);
        }
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
                {/* <FontAwesomeIcon
                    icon={faRedoAlt}
                    className="icons"
                    size="lg"
                    onClick={this.reset}
                    title="Reset"
                /> */}
                <FontAwesomeIcon
                    icon={faStepBackward}
                    className="icons"
                    onClick={this.stepBackward}
                    title="Prev"
                />

                {this.showPausePlayButton()}

                <FontAwesomeIcon
                    icon={faStepForward}
                    className="icons"
                    onClick={this.stepForward}
                    title="Next"
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
        let svgRoot = document.getElementById("svgRoot");
        svgRoot.setCurrentTime(0);
        setSliderPos(this.props.visuTimestamps);

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

        setSliderPos(this.props.visuTimestamps);
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

        setSliderPos(this.props.visuTimestamps);
    };

    stop = () => {
        let svgRoot = document.getElementById("svgRoot");

        svgRoot.setCurrentTime(0);
        setSliderPos(this.props.visuTimestamps);

        this.setState({ visuState: "pause" });

        if (!svgRoot.animationsPaused()) {
            svgRoot.pauseAnimations();
        }
    };
}
