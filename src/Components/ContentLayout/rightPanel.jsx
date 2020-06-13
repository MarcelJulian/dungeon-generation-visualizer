import React, { Component } from "react";
import { setSliderPos } from "./controlPanelSlider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronRight,
    faChevronDown,
    faLongArrowAltLeft,
    faLongArrowAltRight,
    faRedoAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./rightPanel.css";

export default class RightPanel extends Component {
    stepListener = null;
    lastpage = 1;

    constructor(props) {
        super(props);
        this.state = {
            curPage: 1,
            settingOptions: [0, 0, 0],
        };
    }

    componentDidUpdate() {
        this.deactivateListener();
        if (this.lastPage !== this.state.curPage) {
            if (this.state.curPage >= 3 && this.state.curPage <= 5) {
                this.jumpToStep(this.state.curPage - 3);
                this.activateListener(this.state.curPage - 3);
            }
            this.lastPage = this.state.curPage;
        }
        this.highlightOption();
    }

    jumpToStep = (i) => {
        let svgRoot = document.getElementById("svgRoot");
        svgRoot.setCurrentTime(this.props.visuTimestampsSplit[i] / 1000);
        setSliderPos(this.props.visuTimestamps);
        svgRoot.pauseAnimations();
        this.props.resetStateHandler(true);
    };

    activateListener = (i) => {
        if (this.stepListener === null) {
            this.stepListener = setInterval(() => {
                this.limitStep(i);
            }, 100);
        }
    };

    deactivateListener = () => {
        if (this.stepListener !== null) {
            clearInterval(this.stepListener);
            this.stepListener = null;
        }
    };

    limitStep = (i) => {
        let svgRoot = document.getElementById("svgRoot");
        let curTime = Math.round(svgRoot.getCurrentTime() * 1000);
        let tsSplit = this.props.visuTimestampsSplit;

        if (curTime > tsSplit[i + 1]) {
            svgRoot.setCurrentTime(tsSplit[i + 1] / 1000);
            setSliderPos(this.props.visuTimestamps);
            svgRoot.pauseAnimations();
            this.props.resetStateHandler(true);
        }
    };

    highlightOption = () => {
        for (let i = 1; i <= 3; i++) {
            if (i === 2) continue;
            let e0 = document.getElementById("settings-" + i + "-0");
            let e1 = document.getElementById("settings-" + i + "-1");

            if (e0.classList.contains("selected"))
                e0.classList.remove("selected");
            if (e1.classList.contains("selected"))
                e1.classList.remove("selected");
        }

        for (let i = 0; i <= 2; i++) {
            if (i === 1) continue;
            let e0 = document.getElementById("settings-" + (i + 1) + "-0");
            let e1 = document.getElementById("settings-" + (i + 1) + "-1");

            if (this.state.settingOptions[i] === 0)
                e0.classList.add("selected");
            else e1.classList.add("selected");
        }
    };

    render() {
        return (
            <div id="right-wrapper">
                <div id="settings-wrapper">
                    <div id="settings-hide">{this.showArrow("settings")}</div>
                    <div id="settings-panel">
                        <div id="settings-title" className="panel-title">
                            Settings
                        </div>
                        <div id="settings-content">
                            <div className="settings-row">
                                <div className="settings-type">Speed</div>
                                <div
                                    id="settings-1-0"
                                    className="settings-option"
                                    onClick={() => this.changeSelected(1, 0)}
                                >
                                    Slow
                                </div>
                                <div
                                    id="settings-1-1"
                                    className="settings-option"
                                    onClick={() => this.changeSelected(1, 1)}
                                >
                                    Fast
                                </div>
                            </div>
                            {/* <div className="settings-row">
                                <div className="settings-type">Splits</div>
                                <div
                                    id="settings-2-0"
                                    className="settings-option"
                                    onClick={() => this.changeSelected(2, 0)}
                                >
                                    Diverse
                                </div>
                                <div
                                    id="settings-2-1"
                                    className="settings-option"
                                    onClick={() => this.changeSelected(2, 1)}
                                >
                                    Uniform
                                </div>
                            </div> */}
                            <div className="settings-row">
                                <div className="settings-type">Rooms</div>
                                <div
                                    id="settings-3-0"
                                    className="settings-option"
                                    onClick={() => this.changeSelected(3, 0)}
                                >
                                    Few
                                </div>
                                <div
                                    id="settings-3-1"
                                    className="settings-option"
                                    onClick={() => this.changeSelected(3, 1)}
                                >
                                    Lots
                                </div>
                            </div>
                            <button onClick={this.reset}>
                                Reset Visualization
                            </button>
                        </div>
                    </div>
                </div>
                <div id="desc-wrapper">
                    <div id="desc-hide">{this.showArrow("desc")}</div>
                    <div id="desc-panel">
                        <div id="desc-title" className="panel-title">
                            Description
                        </div>
                        <div id="desc-content-wrapper">
                            {this.showDescContentTitle()}
                            {this.showDescReplayIcon()}
                            {this.showDescContent()}
                            {this.showDescContentPage()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    changeSelected(row, o) {
        let temp = this.state.settingOptions;
        temp[row - 1] = o;

        this.setState({
            settingOptions: temp,
        });
    }

    reset = () => {
        let g = document.getElementById("bsp-split");
        while (g.childElementCount) {
            let path = g.children[0];
            path.parentNode.removeChild(path);
        }
        let svgRoot = document.getElementById("svgRoot");
        svgRoot.setCurrentTime(0);
        setSliderPos(this.props.visuTimestamps);

        this.props.bspHandler(null);
        this.props.settingOptionsHandler(this.state.settingOptions);
        this.props.resetStateHandler(true);
    };

    showArrow = (s) => {
        return (
            <FontAwesomeIcon
                icon={faChevronRight}
                id={s + "-hide-icon"}
                className="right-icon"
                onClick={() => this.hideRightPanelHandler(s)}
            />
        );
    };

    showDescContentTitle = () => {
        let title = "";
        switch (this.state.curPage) {
            case 1:
                title = "Web Intro";
                break;
            case 2:
                title = "BSP Intro";
                break;
            case 3:
                title = "First Step - Split Tree";
                break;
            case 4:
                title = "Second Step - Create Rooms";
                break;
            case 5:
                title = "Third Step - Connect Rooms";
                break;
            case 6:
                title = "End Note";
                break;
            default:
                break;
        }
        return <div id="desc-content-title">{title}</div>;
    };

    showDescReplayIcon = () => {
        if (this.state.curPage >= 3 && this.state.curPage <= 5) {
            return (
                <FontAwesomeIcon
                    icon={faRedoAlt}
                    id="desc-replay-icon"
                    size="lg"
                    title="Replay"
                    onClick={() => this.jumpToStep(this.state.curPage - 3)}
                />
            );
        }
    };

    showDescContent = () => {
        switch (this.state.curPage) {
            case 1:
                return (
                    <div id="desc-content">
                        <div className="desc-subtitle">
                            Welcome to Dungeon Generation Visualizer!
                        </div>
                        <p>
                            This web will visualize dungeon generation
                            algorithms (as of now, there’s only 1 algorithm).
                            Through this visualization, we hope that the users
                            may learn something.
                        </p>
                        <br />
                        <div className="desc-subtitle">
                            So, what’s “Dungeon Generation”?
                        </div>
                        <p>
                            Dungeon generation is the act of creating
                            “procedurally generated” dungeon. “Procedural
                            generation” means that the dungeon is created using
                            algorithm, not manually. This means that the dungeon
                            created will be different every time the algorithm
                            is run. This concept is usually used in games,
                            notably rogue-like games.
                        </p>
                        <br />
                        <div>
                            *dungeon: in game terms, it refers to a maze-like
                            structure
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div id="desc-content">
                        <p>
                            BSP algo is one of the standard implementations of
                            dungeon generation. It is easy to understand and
                            features rectangular rooms.
                        </p>
                        <p>This algo works in 3 steps:</p>
                        <ol>
                            <li>Split Tree</li>
                            <li>Create Rooms</li>
                            <li>Connect Rooms</li>
                        </ol>
                    </div>
                );

            case 3:
                return (
                    <div id="desc-content">
                        <p>
                            This name of the algorithm derives from this step.
                            In this step, the algo receives the size of desired
                            dungeon and split it into several areas. This
                            original size is referred as the root of the tree.
                            The algo recurse through the root by following these
                            steps:
                        </p>
                        <br />
                        <ol className="desc-list-wrapper">
                            <div
                                id="desc-list-dropdown-wrapper-1"
                                className="desc-list-dropdown-wrapper"
                            >
                                <li className="desc-list">
                                    Pick the split direction randomly (vertical
                                    or horizontal)
                                </li>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    id={"desc-list-icon-1"}
                                    className="desc-list-icon"
                                    size="xs"
                                    onClick={() => this.showDropDown(1)}
                                />
                            </div>

                            <p
                                id="desc-list-dropdown-1"
                                className="desc-list-dropdown"
                            >
                                You can also add another rule such as,
                                forcefully splitting horizontally when the width
                                is double the height. This will make more
                                uniform splits.
                            </p>

                            <div
                                id="desc-list-dropdown-wrapper-2"
                                className="desc-list-dropdown-wrapper"
                            >
                                <li className="desc-list">
                                    Check if the node is big enough to split
                                </li>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    id={"desc-list-icon-2"}
                                    className="desc-list-icon"
                                    size="xs"
                                    onClick={() => this.showDropDown(2)}
                                />
                            </div>

                            <p
                                id="desc-list-dropdown-2"
                                className="desc-list-dropdown"
                            >
                                The split areas must be able to contain the
                                minimum size of the room. For example, if I have
                                a minimum size of 6, a length of &lt;12 won’t be
                                split.
                            </p>

                            <div
                                id="desc-list-dropdown-wrapper-3"
                                className="desc-list-dropdown-wrapper"
                            >
                                <li className="desc-list">
                                    If true, pick the split point randomly from
                                    the length or width of the node
                                </li>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    id="desc-list-icon-3"
                                    className="desc-list-icon"
                                    size="xs"
                                    onClick={() => this.showDropDown(3)}
                                />
                            </div>

                            <p
                                id="desc-list-dropdown-3"
                                className="desc-list-dropdown"
                            >
                                You can either make it more uniform (e.g. by
                                picking the splitting point of 0.4-0.6 from the
                                length) or more diverse (e.g. by picking the
                                splitting point of 0.2-0.8 from the length)
                            </p>

                            <li className="desc-list">
                                Then, run the same algo from the node’s children
                            </li>
                            <li className="desc-list">Else, return null</li>
                        </ol>
                        <br />
                        <p>
                            Finishing this step, we’ll get the several areas
                            which will be the place where we create our rooms.{" "}
                        </p>
                    </div>
                );
            case 4:
                return (
                    <div id="desc-content">
                        <p>
                            Next, we need to create the rooms for the areas
                            we’ve split. The step is done by looping through the
                            leaf nodes (the nodes which don’t have any child)
                            created from the first step. The rooms are created
                            by simply picking a random width and height from the
                            available range.
                        </p>
                        <p>
                            Usually, there’s a minimum room size to prevent
                            creating a very small room. (In this case, the min
                            room size is 2, so the smallest room possible is a
                            2x2)
                        </p>
                    </div>
                );
            case 5:
                return (
                    <div id="desc-content">
                        <p>
                            Lastly, connect the created rooms. The algo first
                            connect the rooms that are siblings, then it goes up
                            level by level, until it reaches the root. The algo
                            recurse from the root by following these steps:
                        </p>
                        <br />
                        <ol className="desc-list-wrapper">
                            <li className="desc-list">
                                Check if the left and right child has been
                                connected
                            </li>
                            <li className="desc-list">
                                If false, connect the rooms in left and right
                                child first
                            </li>
                            <div
                                id="desc-list-dropdown-wrapper-3"
                                className="desc-list-dropdown-wrapper"
                            >
                                <li className="desc-list">
                                    Then, check the direction of the split
                                </li>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    id="desc-list-icon-3"
                                    className="desc-list-icon"
                                    size="xs"
                                    onClick={() => this.showDropDown(3)}
                                />
                            </div>

                            <div
                                id="desc-list-dropdown-3"
                                className="desc-list-dropdown"
                            >
                                <p>
                                    This is to determine the side we could take.
                                    For example, a vertical split means we take
                                    the right side of the rooms in the left
                                    child and the left side of rooms in the
                                    right child.
                                </p>
                                <br />
                                <img
                                    src={
                                        process.env.PUBLIC_URL +
                                        "/example_1.png"
                                    }
                                    alt="example_1"
                                />
                                <br />
                                <div>Example with vertical split</div>
                            </div>

                            <div
                                id="desc-list-dropdown-wrapper-4"
                                className="desc-list-dropdown-wrapper"
                            >
                                <li className="desc-list">
                                    Remove the sides that are unreachable
                                </li>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    id="desc-list-icon-4"
                                    className="desc-list-icon"
                                    size="xs"
                                    onClick={() => this.showDropDown(4)}
                                />
                            </div>

                            <p
                                id="desc-list-dropdown-4"
                                className="desc-list-dropdown"
                            >
                                In cases where the left and right child has
                                several rooms, there are also several sides that
                                are taken. To prevent clipping, we just take the
                                sides that are closer to the node’s split point.
                            </p>

                            <div
                                id="desc-list-dropdown-wrapper-5"
                                className="desc-list-dropdown-wrapper"
                            >
                                <li className="desc-list">
                                    Pick a random point from the available sides
                                </li>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    id="desc-list-icon-5"
                                    className="desc-list-icon"
                                    size="xs"
                                    onClick={() => this.showDropDown(5)}
                                />
                            </div>

                            <p
                                id="desc-list-dropdown-5"
                                className="desc-list-dropdown"
                            >
                                In my version of the algo, the child’s connector
                                is also included. With this, there could be
                                T-shaped intersections, instead of solely long
                                corridors.
                            </p>

                            <div
                                id="desc-list-dropdown-wrapper-6"
                                className="desc-list-dropdown-wrapper"
                            >
                                <li className="desc-list">
                                    Connect the points
                                </li>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    id="desc-list-icon-6"
                                    className="desc-list-icon"
                                    size="xs"
                                    onClick={() => this.showDropDown(6)}
                                />
                            </div>

                            <p
                                id="desc-list-dropdown-6"
                                className="desc-list-dropdown"
                            >
                                In this version, I hard code the algo (check the
                                github for more details). This could be made
                                easier by using pathfinding algorithm.
                            </p>
                        </ol>
                    </div>
                );
            case 6:
                return (
                    <div id="desc-content">
                        <p>
                            Done! That’s the basic version of dungeon generation
                            using binary split partitioning tree. The algo could
                            be customized to fit the developer’s needs. For
                            example,{" "}
                        </p>
                        <br />
                        <ul>
                            <li>
                                Using pre-generated rooms rather than creating
                                it randomly
                            </li>
                            <li>
                                Adding other needed game elements like, spawn
                                locations, treasure, stair to next level, etc.
                            </li>
                            <li>
                                As mentioned before, using pathfinding
                                algorithm. With it, the connectors may become
                                more diverse.
                            </li>
                            <li>And many more</li>
                        </ul>
                        <br />
                        <p>
                            Thanks for reading this simple tutorial. Feel free
                            to explore the visualization to understand the algo
                            deeper (or even look at the code itself in the
                            github page). Feedbacks are appreciated.
                        </p>
                    </div>
                );
            default:
                break;
        }
    };

    showDropDown = (i) => {
        let wrapper = document.getElementById(
            "desc-list-dropdown-wrapper-" + i
        );
        let icon = document.getElementById("desc-list-icon-" + i);
        let detail = document.getElementById("desc-list-dropdown-" + i);

        if (icon.style.transform === "rotate(180deg)") {
            //hide
            icon.style.transform = "rotate(0deg)";
            detail.style.maxHeight = "0px";
            if (detail.classList.contains("selected"))
                detail.classList.remove("selected");
            if (wrapper.classList.contains("selected")) {
                wrapper.classList.remove("selected");
                wrapper.children[0].style.fontWeight = "normal";
            }
        } else {
            //show
            this.resetDropDown();
            icon.style.transform = "rotate(180deg)";
            detail.style.maxHeight = "400px";
            detail.classList.add("selected");
            wrapper.classList.add("selected");
            wrapper.children[0].style.fontWeight = "bold";
        }
    };

    resetDropDown = () => {
        for (let i = 1; i <= 6; i++) {
            let wrapper = document.getElementById(
                "desc-list-dropdown-wrapper-" + i
            );
            if (wrapper === null) continue;
            let icon = document.getElementById("desc-list-icon-" + i);
            let detail = document.getElementById("desc-list-dropdown-" + i);

            if (icon.style.transform === "rotate(180deg)") {
                //hide
                icon.style.transform = "rotate(0deg)";
                detail.style.height = "0px";
                if (detail.classList.contains("selected"))
                    detail.classList.remove("selected");
                if (wrapper.classList.contains("selected"))
                    wrapper.classList.remove("selected");
            }
        }
    };

    showDescContentPage = () => {
        let curPage = this.state.curPage;

        return (
            <div id="desc-content-page-wrapper">
                <FontAwesomeIcon
                    icon={faLongArrowAltLeft}
                    id="desc-left-icon"
                    className="right-icon"
                    size="lg"
                    onClick={this.prevPage}
                    title="Previous Page"
                />
                <div id="desc-content-page"> {curPage + " / 6"}</div>
                <FontAwesomeIcon
                    icon={faLongArrowAltRight}
                    id="desc-right-icon"
                    className="right-icon"
                    size="lg"
                    onClick={this.nextPage}
                    title="Next Page"
                />
            </div>
        );
    };

    prevPage = () => {
        if (this.state.curPage !== 1) {
            this.setState({
                curPage: this.state.curPage - 1,
            });
        }
    };

    nextPage = () => {
        if (this.state.curPage !== 6) {
            this.setState({
                curPage: this.state.curPage + 1,
            });
        }
    };

    hideRightPanelHandler = (s) => {
        let e = document.getElementById(s + "-panel");
        let h = document.getElementById(s + "-hide-icon");

        if (e.style.width === "0px") {
            //show
            e.style.width = "350px";
            h.style.transform = "rotate(0deg)";
        } else {
            //hide
            e.style.width = "0px";
            h.style.transform = "rotate(-180deg)";
        }
    };
}
