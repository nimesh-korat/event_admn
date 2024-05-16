import React from "react";
import { Link } from "react-router-dom";

function Header() {
  function on_off_sidebar() {
    return document.body.classList.toggle("sidebar-icon-only");
  }

  function responsiveSidebar() {
    return document.getElementById("sidebar").classList.toggle("active");
  }

  return (
    <>
      <nav
        className="navbar col-lg-12 col-12 p-0"
        style={{ position: "fixed", zIndex: "1" }}
      >
        <div className="navbar-menu-wrapper d-flex align-items-stretch">
          <button
            className="navbar-toggler navbar-toggler align-self-center"
            type="button"
            onClick={on_off_sidebar}
          >
            <span className="mdi mdi-chevron-double-left" />
          </button>

          <ul className="navbar-nav navbar-nav-right">
            <li className="nav-item nav-logout d-none d-md-block mr-3">
              <Link className="nav-link" to="/">
                Dashboard
              </Link>
            </li>
            <li className="nav-item nav-logout d-none d-lg-block">
              <Link className="nav-link" to="/">
                <i className="mdi mdi-home-circle" />
              </Link>
            </li>
          </ul>
          <button
            className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
            type="button"
            onClick={responsiveSidebar}
            data-toggle="offcanvas"
          >
            <span className="mdi mdi-menu" />
          </button>
        </div>
      </nav>
    </>
  );
}

export default Header;
