import React from "react";
import { withRouter } from "react-router-dom";

function Footer() {
  return (
      <footer className="py-2 bg-dark mt-2 fixed-bottom">
        <p className="m-0 text-center text-white">
          Copyright &copy; Argentum
        </p>
      </footer>
  );
}

export default withRouter(Footer);