import React, { Component } from "react";
import "./controlPanelSlider.css";

export default class ControlPanelSlider extends Component {
    sliderListener = null;

    componentDidMount() {
        if (this.props.visuState === "start") this.activateListener();
        else this.deactivateListener();

        document
            .getElementById("progress-bar")
            .addEventListener("click", this.clickEvent);
    }

    componentDidUpdate() {
        if (this.props.visuState === "start") this.activateListener();
        else this.deactivateListener();
    }

    componentWillUnmount() {
        this.deactivateListener();
        document.removeEventListener("click", this.clickEvent);
    }

    activateListener = () => {
        if (this.sliderListener === null) {
            this.sliderListener = setInterval(() => {
                this.changeSliderWidth();
            }, 10);
        }
    };

    deactivateListener = () => {
        if (this.sliderListener !== null) {
            clearInterval(this.sliderListener);
            this.sliderListener = null;
        }
    };

    changeSliderWidth = () => {
        let svgRoot = document.getElementById("svgRoot");
        let curTime = Math.round(svgRoot.getCurrentTime() * 1000);
        let ts = this.props.visuTimestamps;
        let maxTime = ts[ts.length - 1];

        let pos = Math.round((curTime / maxTime) * 100000) / 1000;

        let slider = document.getElementById("slider");
        if (slider.style.width.includes("100")) {
            this.deactivateListener();
            slider.style.width = "100%";
        } else slider.style.width = pos + "%";
    };

    clickEvent = (e) => {
        let maxW = document.getElementById("progress-bar").clientWidth;

        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left; //x position within the element.

        let pos = Math.round((x / maxW) * 100000) / 1000;

        let slider = document.getElementById("slider");
        slider.style.width = pos + "%";

        let svgRoot = document.getElementById("svgRoot");
        let ts = this.props.visuTimestamps;
        let maxTime = ts[ts.length - 1];
        let clickTime = Math.round((pos * maxTime) / 100) / 1000;

        svgRoot.setCurrentTime(clickTime);
    };

    render() {
        return (
            <div id="progress-bar">
                <div id="slider"></div>
            </div>
        );
    }
}

export function setSliderPos(visuTimestamps) {
    let svgRoot = document.getElementById("svgRoot");
    let curTime = Math.round(svgRoot.getCurrentTime() * 1000);
    let ts = visuTimestamps;
    let maxTime = ts[ts.length - 1];

    let pos = Math.round((curTime / maxTime) * 100000) / 1000;

    let slider = document.getElementById("slider");
    slider.style.width = pos + "%";
}
