import React, { Component } from "react";
import Navbar from "./navbar.jsx";
import Grid from "./grid.jsx";

class main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curAlgo: "BSP",
            visuSpeed: 750, //750 px / sec
            BSPtree: null,
        };
    }

    // getVisualizationState = () => this.state.curVisualization;

    BSPtreeHandler = (val) => {
        this.setState({ BSPtree: val });
    };

    render() {
        return (
            <div>
                <Navbar BSPtreeHandler={this.BSPtreeHandler} />
                <Grid
                    algo={this.state.curAlgo}
                    visuState={this.state.visuState}
                    visuSpeed={this.state.visuSpeed}
                    BSPtree={this.state.BSPtree}
                    BSPtreeHandler={this.BSPtreeHandler}
                />
            </div>
        );
    }
}

export default main;
