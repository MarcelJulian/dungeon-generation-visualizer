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
            visuTimestampsSplit: null,
            settingOptions: [0, 0, 0],
        };
    }

    bspHandler = (tree, ts = null, tsSplit = null) => {
        this.setState({
            bspTree: tree,
            visuTimestamps: ts,
            visuTimestampsSplit: tsSplit,
        });
    };

    settingOptionsHandler = (o) => {
        let tempSpeed = 750;
        if (o[0] === 1) tempSpeed = 1500;
        this.setState({
            settingOptions: o,
            visuSpeed: tempSpeed,
        });
    };

    render() {
        return (
            <div id="main-wrapper">
                <Navbar />
                <ContentLayout
                    bspHandler={this.bspHandler}
                    visuTimestamps={this.state.visuTimestamps}
                    visuTimestampsSplit={this.state.visuTimestampsSplit}
                    settingOptionsHandler={this.settingOptionsHandler}
                />
                <Grid
                    algo={this.state.curAlgo}
                    visuState={this.state.visuState}
                    visuSpeed={this.state.visuSpeed}
                    bspTree={this.state.bspTree}
                    bspHandler={this.bspHandler}
                    settingOptions={this.state.settingOptions}
                />
            </div>
        );
    }
}

export default main;
