import React, { Component } from "react";
// import LeftPanel from "./leftPanel.jsx";
import RightPanel from "./rightPanel.jsx";
import ControlPanel from "./controlPanel.jsx";

export default class ContentLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resetState: true,
        };
    }

    resetStateHandler = (v) => {
        this.setState({
            resetState: v,
        });
    };

    render() {
        return (
            <div id="content-layout-wrapper">
                <ControlPanel
                    bspHandler={this.props.bspHandler}
                    visuTimestamps={this.props.visuTimestamps}
                    resetState={this.state.resetState}
                    resetStateHandler={this.resetStateHandler}
                />
                {/* <LeftPanel
                    visuTimestamps={this.props.visuTimestamps}
                    visuTimestampsSplit={this.props.visuTimestampsSplit}
                /> */}
                <RightPanel
                    visuTimestamps={this.props.visuTimestamps}
                    visuTimestampsSplit={this.props.visuTimestampsSplit}
                    settingOptionsHandler={this.props.settingOptionsHandler}
                    bspHandler={this.props.bspHandler}
                    resetStateHandler={this.resetStateHandler}
                />
            </div>
        );
    }
}
