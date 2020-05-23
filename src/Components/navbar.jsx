import React, { Component } from "react";
import "./navbar.css";

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curAlgo: "BSP",
            visuState: "stop",
        };
    }

    render() {
        return (
            <header>
                <div id="title">Procedural Dungeon Generation Visualizer</div>
                <ul id="nav">
                    <li>
                        <a href="#">1</a>
                    </li>
                    <li>
                        <a href="#">2</a>
                    </li>
                    <li>
                        <a href="#">3</a>
                    </li>
                </ul>

                {/* <button id="vis" onClick={() => this.props.visualizeAlgo()}>
                    Visualize BSP
                </button> */}

                {this.showButton()}
            </header>
        );
    }

    showButton() {
        if (this.state.visuState === "stop")
            return (
                <button id="vis" onClick={() => this.visualizeBSPSplit()}>
                    Visualize BSP
                </button>
            );
        if (this.state.visuState === "start")
            return (
                <button id="vis" onClick={() => this.resetVisualization()}>
                    Reset Visualization
                </button>
            );
    }

    visualizeBSPSplit() {
        this.setState({ visuState: "start" });

        let g = document.getElementById("BSP-split");

        let durTotal = 0;

        for (let i = 0; i < g.childElementCount; i++) {
            let path = g.children[i];
            let dur = path.children[0].getAttribute("dur");

            //trim the word s
            dur = dur.substring(0, dur.length - 1);
            dur *= 1000;

            setTimeout(() => {
                path.children[0].beginElement();
            }, durTotal + i * 200);

            durTotal += dur;
        }

        durTotal += g.childElementCount * 200 + 500;
        let a = document.getElementById("animate-split-gray");
        let durA = 0;
        durA = a.getAttribute("dur");
        durA = durA.substring(0, durA.length - 1);
        durA *= 1000;

        setTimeout(() => {
            a.beginElement();
            a = document.getElementById("animate-split-thin");
            a.beginElement();
        }, durTotal);

        console.log(durA);
        durTotal += durA;

        g = document.getElementById("BSP-rooms");
        console.log(g);
        console.log(g.children);

        for (let i = 0; i < g.childElementCount; i++) {
            let path = g.children[i];
            let dur = path.children[0].getAttribute("dur");

            //trim the word s
            dur = dur.substring(0, dur.length - 1);
            dur *= 1000;

            setTimeout(() => {
                path.children[0].beginElement();
            }, durTotal + i * 200);

            durTotal += dur;
        }
    }

    resetVisualization() {
        this.setState({ visuState: "stop" });

        let g = document.getElementById("BSP-split");
        while (g.childElementCount) {
            let path = g.children[0];
            path.parentNode.removeChild(path);
        }
        this.props.resetHandler();
    }
}

export default Navbar;
