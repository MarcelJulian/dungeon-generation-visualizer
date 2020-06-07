import React, { Component } from "react";
import LeftPane from "./leftPane.jsx";
import ControlPanel from "./controlPanel.jsx";

export default class ContentLayout extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="content-layout-wrapper">
                <ControlPanel
                    bspHandler={this.props.bspHandler}
                    visuTimestamps={this.props.visuTimestamps}
                ></ControlPanel>
                <LeftPane></LeftPane>
            </div>
        );
    }
}
