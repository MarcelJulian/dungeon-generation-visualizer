import React, { Component } from "react";
import "./navbar.css";

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curAlgo: "BSP",
            visuState: "unplayed",
        };

        this.pausePlay = this.pausePlay.bind(this);
        this.stop = this.stop.bind(this);
    }

    render() {
        return (
            <header>
                <div id="title">
                    <b>Dungeon Generation Visualizer</b>
                </div>
                <div id="algo">
                    {this.showButton()}
                    <div id="algo-name">Binary Space Partitioning</div>
                </div>

                <div id="control">
                    {this.showPausePlayButton()}
                    {this.showStopButton()}
                </div>
            </header>
        );
    }

    showButton() {
        if (this.state.visuState === "unplayed")
            return (
                <button id="vis" onClick={() => this.visualizeBSPSplit()}>
                    Visualize
                </button>
            );
        if (
            this.state.visuState === "start" ||
            this.state.visuState === "pause"
        )
            return (
                <button id="vis" onClick={() => this.resetVisualization()}>
                    Reset
                </button>
            );
    }

    visualizeBSPSplit() {
        this.setState({ visuState: "start" });

        let g = document.getElementById("BSP-split");

        let n = g.childElementCount - 1;
        let beginAnim = "BSP-split-anim-" + n + ".end + 0.2s";

        let animGray = document.getElementById("animate-split-gray");
        let animThin = document.getElementById("animate-split-thin");

        animGray.setAttribute("begin", beginAnim);
        animThin.setAttribute("begin", beginAnim);

        g = document.getElementById("BSP-rooms");
        n = g.childElementCount - 1;
        let beginDoor = "BSP-room-anim-" + n + ".end + 0.2s";

        let animDoor = document.getElementById("BSP-door-anim-0");
        let animDoor2 = document.getElementById("BSP-door2-anim-0");
        animDoor.setAttribute("begin", beginDoor);
        animDoor2.setAttribute("begin", beginDoor);

        //add class, (element).classList.add("")

        let SVGRoot = document.getElementById("SVGRoot");
        SVGRoot.setCurrentTime(0);
        SVGRoot.unpauseAnimations();
    }

    resetVisualization() {
        this.setState({ visuState: "unplayed" });

        let g = document.getElementById("BSP-split");
        while (g.childElementCount) {
            let path = g.children[0];
            path.parentNode.removeChild(path);
        }

        this.props.BSPtreeHandler(null);
    }

    showStopButton() {
        if (this.state.visuState === "unplayed") return;
        return (
            <img
                src={process.env.PUBLIC_URL + "/stop.png"}
                onClick={this.stop}
            />
        );
    }

    stop() {
        let SVGRoot = document.getElementById("SVGRoot");

        SVGRoot.setCurrentTime(0);
        this.setState({ visuState: "pause" });

        if (!SVGRoot.animationsPaused()) {
            SVGRoot.pauseAnimations();
        }
    }

    showPausePlayButton() {
        if (this.state.visuState === "unplayed") return;
        return (
            <img
                src={
                    process.env.PUBLIC_URL +
                    (this.state.visuState === "start"
                        ? "/pause.png"
                        : "/play.png")
                }
                onClick={this.pausePlay}
            />
        );
    }

    pausePlay() {
        if (this.state.visuState === "pause")
            this.setState({ visuState: "start" });
        else if (this.state.visuState === "start")
            this.setState({ visuState: "pause" });

        let SVGRoot = document.getElementById("SVGRoot");
        if (SVGRoot === null) return;
        console.log(SVGRoot.getCurrentTime());

        if (SVGRoot.animationsPaused()) {
            SVGRoot.unpauseAnimations();
        } else {
            SVGRoot.pauseAnimations();
        }
    }
}

export default Navbar;
