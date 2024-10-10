import React, { useEffect, useMemo, useState } from "react";
import "./style.scss";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../sidebar";
import Header from "../header";
import permissionModel from "../../../models/permisstion.model";
import ApiClient from "../../../methods/api/apiClient";
import methodModel from "../../../methods/methods";
import environment from "../../../environment";
import { FcOvertime } from "react-icons/fc";
import { BsExclamationTriangle } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { login_success } from "../../../Pages/actions/user";

import { memo } from 'react';


const Layout=memo(function Layout ({ children }) {
  const user = useSelector((state) => state.user);
  const history = useNavigate();
  const [isOpen, setIsopen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user.loggedIn) {
      history("/login");
    } else {
      let permissions = user.roleDetail?.permissions?.[0];
      if (!permissionModel.urlAllow(permissions)) {
        // history("/profile")
      }
      let browseload = localStorage.getItem("browseload");
      if (!browseload) {
        ApiClient.get("user/detail", { id: user._id }).then(async (res) => {
          if (res.success) {
            let data = { ...user, ...res.data };
            dispatch(login_success(data));
          }
        });
      }
    }
  }, []);

  const logo = () => {
    let value = "/assets/img/logo.png";
    return value;
  };

  const logowhite = () => {
    let value = "/assets/img/logo.png";
    return value;
  };

  const logos = () => {
    let value = "/assets/img/logo.png";
    return value;
  };

  const router = () => {
    let route = localStorage.getItem("route");
    history(route);
  };

  const [state, setstate] = useState(false);

  useEffect(() => {
    setstate(localStorage.getItem("sidebar"));
  }, [localStorage.getItem("sidebar")]);

  return (
    <>
      <div component="layout">
        <div onClick={(e) => router()} id="routerDiv"></div>
        <Header isOpen={isOpen} setIsOpen={setIsopen} />

        <div className={`main-wrapper flex ${isOpen ? "active-sidebar" : ""}`}>
          <div className="main-sidebar scrollbar transition-[width] duration-300 ">
            <div className="sidebar-brand text-center p-[9px] mb-4">
              <Link to="/">
                <div className="editLogo">
                  <img
                    src={logowhite()}
                    width=""
                    height="35"
                    className=" show-logo"
                  />
                  <img src={logos()} className="hide-logo" height="35"/>
                </div>
              </Link>
            </div>
            {user?.logo ? (
              <div
                className="flex justify-center"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={methodModel.userImg(user?.logo || "")}
                  alt="photo"
                  width="40"
                  height="40"
                  style={{
                    width: "40px",
                    marginBottom: "2px",
                    height: "40px",
                    borderRadius: "50%",
                  }}
                />
              </div>
            ) : null}
            <Sidebar isOpen={isOpen} />
          </div>

          {/* <div className="main-sidebar  d-md-block">

            <div className="sidebar-brand p-3 pt-4  text-left pl-5">
              <label className='editLogo'>
                <img src={logo()} className="logocls show-logo" />
                <img src={logos()} className=" hide-logo" />
              </label>

            </div>
            <Sidebar />
          </div> */}
          <main className="main">
            <div className="mainarea ">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
});
export default Layout;
