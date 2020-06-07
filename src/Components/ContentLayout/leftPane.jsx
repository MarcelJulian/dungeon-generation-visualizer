import React, { Component } from "react";
import "./leftPane.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default class LeftPane extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="left-wrapper">
                <div id="steps-hide">{this.showArrow()}</div>
                <div id="steps-panel">
                    <div id="steps-title">Steps</div>
                    {this.showSteps()}
                </div>
            </div>
        );
    }

    showSteps() {
        return (
            <ul id="steps-ul">
                <li>1. Split Tree</li>
                <li>2. Create Rooms</li>
                <li>3. Connect Rooms</li>
            </ul>
        );
    }

    showArrow() {
        return (
            <FontAwesomeIcon
                icon={faChevronRight}
                id="steps-hide-icon"
                onClick={this.hideLeftPaneHandler}
            />
        );
    }

    hideLeftPaneHandler() {
        let e = document.getElementById("steps-panel");
        let h = document.getElementById("steps-hide-icon");

        if (e.style.width === "0px") {
            e.style.width = "200px";
            h.style.transform = "rotate(-180deg)";
        } else {
            e.style.width = "0px";
            h.style.transform = "rotate(0deg)";
        }
    }
}
