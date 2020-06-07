import React, { Component } from "react";
import Navbar from "./navbar.jsx";
import Grid from "./grid.jsx";
import ContentLayout from "./ContentLayout";

class main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curAlgo: "bsp",
            visuSpeed: 750, //750 px / sec
            bspTree: null,
            visuTimestamps: null,
        };
    }

    bspHandler = (tree, ts = null) => {
        this.setState({ bspTree: tree, visuTimestamps: ts });
    };

    render() {
        return (
            <div id="main-wrapper">
                <Navbar />
                <ContentLayout
                    bspHandler={this.bspHandler}
                    visuTimestamps={this.state.visuTimestamps}
                />
                <Grid
                    algo={this.state.curAlgo}
                    visuState={this.state.visuState}
                    visuSpeed={this.state.visuSpeed}
                    bspTree={this.state.bspTree}
                    bspHandler={this.bspHandler}
                />
            </div>
        );
    }
}

export default main;
