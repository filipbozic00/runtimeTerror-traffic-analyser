import React from "react";
import { withRouter } from "react-router-dom";

function Navigation() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light border-rounded bg-dark text-white">
      <a className="navbar-brand text-white mx-5 my-auto" style={{fontSize: 28}} href="/">Project</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse mx-2" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto my-auto" style={{fontSize: 20}}>
            <li className="nav-item">
                <a className="nav-link text-light" href="/">Home</a> 
            </li>
            <li className="nav-item">
                <a className="nav-link text-light" href="/map">Map</a> 
            </li>
            <li className="nav-item">
                <a className="nav-link text-light" href="/images">Images</a> 
            </li>
            <li className="nav-item">
                <a className="nav-link text-light" href="/aboutus">About us</a> 
            </li>
        </ul>
      </div>
    </nav>
  );
}

export default withRouter(Navigation);