import React, { Component } from "react";
import "./navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

class Navbar extends Component {
    render() {
        return (
            <header id="navbar">
                <div id="title">
                    <b>Dungeon Generation Visualizer</b>
                </div>
                <a href="https://github.com/MarcelJulian/dungeon-generation-visualizer">
                    <FontAwesomeIcon icon={faGithub} id="gh-icon" size="lg" />
                </a>
            </header>
        );
    }
}

export default Navbar;
