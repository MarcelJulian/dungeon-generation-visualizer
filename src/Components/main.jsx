import React, { Component } from "react";
import Navbar from "./navbar.jsx";
import Grid from "./grid.jsx";

class main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curAlgo: "BSP",
            visuState: "stop",
            reset: 0,
            visuSpeed: 750, //750 px / sec
        };
    }

    // visualizeAlgoHandler = () => {
    //     if (this.state.visuState === "stop")
    //         this.setState({
    //             visuState: "start",
    //         });
    //     else
    //         this.setState({
    //             visuState: "stop",
    //         });
    // };

    // getVisualizationState = () => this.state.curVisualization;

    resetHandler = () => {
        this.state.reset === 0
            ? this.setState({ reset: 1 })
            : this.setState({ reset: 0 });
    };

    render() {
        return (
            <div>
                <Navbar resetHandler={this.resetHandler} />
                <Grid
                    algo={this.state.curAlgo}
                    visuState={this.state.visuState}
                    visuSpeed={this.state.visuSpeed}
                />
            </div>
        );
    }
}

export default main;
