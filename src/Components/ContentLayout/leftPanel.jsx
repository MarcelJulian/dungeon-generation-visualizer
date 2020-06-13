import React, { Component } from "react";
import { setSliderPos } from "./controlPanelSlider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronRight,
    faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import "./leftPanel.css";

export default class LeftPanel extends Component {
    visuListener = null;

    constructor(props) {
        super(props);
        this.state = {
            curStepHighlight: 0,
        };
    }

    componentDidMount() {
        this.activateListener();
    }

    componentWillUnmount() {
        this.deactivateListener();
    }

    componentDidUpdate() {
        this.resetStepsClass();
        if (this.state.curStepHighlight !== 0) {
            let e = document.getElementById(
                "steps-" + this.state.curStepHighlight
            );
            e.classList.add("selected");
            this.showDropDown(this.state.curStepHighlight);
        }
    }

    activateListener = () => {
        if (this.visuListener === null) {
            this.visuListener = setInterval(() => {
                this.highlightStep();
            }, 200);
        }
    };

    deactivateListener = () => {
        if (this.visuListener !== null) {
            clearInterval(this.visuListener);
            this.visuListener = null;
        }
    };

    resetStepsClass = () => {
        let tsSplit = this.props.visuTimestampsSplit;

        for (let i = 1; i < tsSplit.length; i++) {
            let e = document.getElementById("steps-" + i);

            if (e.classList.contains("selected"))
                e.classList.remove("selected");

            let icon = document.getElementById("steps-" + i + "-icon");
            let detail = document.getElementById("steps-" + i + "-detail");

            if (icon.style.transform === "rotate(180deg)") {
                //hide
                icon.style.transform = "rotate(0deg)";
                detail.style.maxHeight = "0px";
            }
        }
    };

    highlightStep = () => {
        let svgRoot = document.getElementById("svgRoot");
        let curTime = Math.round(svgRoot.getCurrentTime() * 1000);
        let tsSplit = this.props.visuTimestampsSplit;

        for (let i = 0; i < tsSplit.length; i++) {
            if (curTime < tsSplit[i]) {
                if (this.state.curStepHighlight !== i)
                    this.setState({
                        curStepHighlight: i,
                    });

                break;
            }
        }
    };

    render() {
        return (
            <div id="left-wrapper">
                <div id="steps-hide">{this.showArrow()}</div>
                <div id="steps-panel">
                    <div id="steps-title" className="panel-title">
                        Steps
                    </div>
                    {this.showSteps()}
                </div>
            </div>
        );
    }

    showSteps() {
        return (
            <div id="steps-list">
                {this.showStep(1, "1. Split Tree")}
                <div id="steps-1-detail" className="steps-detail">
                    <div id="steps-1-detail-1">Recurse from root</div>
                    <div id="steps-1-detail-2">
                        rand() between splitting vertically or horizontally
                    </div>
                    <div id="steps-1-detail-3">
                        if(nodeLength &gt; minLength 2) break
                    </div>
                    <div id="steps-1-detail-4">
                        randNum() between 0.2-0.8 of length
                    </div>
                    <div id="steps-1-detail-5">
                        split(leftChild); split(rightChild);
                    </div>
                </div>

                {this.showStep(2, "2. Create Rooms")}
                <div id="steps-2-detail" className="steps-detail">
                    detail2
                </div>

                {this.showStep(3, "3. Connect Rooms")}
                <div id="steps-3-detail" className="steps-detail">
                    detail3
                </div>
            </div>
        );
    }

    showArrow() {
        return (
            <FontAwesomeIcon
                icon={faChevronRight}
                id="steps-hide-icon"
                onClick={this.hideLeftPanelHandler}
            />
        );
    }

    showStep = (i, desc) => {
        return (
            <div
                id={"steps-" + i}
                className="steps-wrapper"
                onClick={() => this.jumpToStep(i)}
            >
                {desc}
                <FontAwesomeIcon
                    icon={faChevronDown}
                    id={"steps-" + i + "-icon"}
                    className="steps-list-icon"
                    size="xs"
                />
            </div>
        );
    };

    jumpToStep = (i) => {
        if (this.state.curStepHighlight === i) {
            this.showDropDown(i);
        } else {
            let svgRoot = document.getElementById("svgRoot");
            svgRoot.setCurrentTime(
                this.props.visuTimestampsSplit[i - 1] / 1000
            );
            setSliderPos(this.props.visuTimestamps);

            this.setState({
                curStepHighlight: i,
            });
        }
    };

    showDropDown = (i) => {
        let icon = document.getElementById("steps-" + i + "-icon");
        let detail = document.getElementById("steps-" + i + "-detail");

        if (icon.style.transform === "rotate(180deg)") {
            //hide
            icon.style.transform = "rotate(0deg)";
            detail.style.maxHeight = "0px";
        } else {
            //show
            icon.style.transform = "rotate(180deg)";
            detail.style.maxHeight = "200px";
        }
    };
}
