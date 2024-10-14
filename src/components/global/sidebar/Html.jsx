import { Fragment, React, useEffect, useState } from "react";
import { Disclosure, Transition, Menu } from "@headlessui/react";
import styles from "./index.module.css";
import { Link, NavLink, useLocation } from "react-router-dom";
import { RiHome6Line } from "react-icons/ri";
import { TiArrowSortedDown } from "react-icons/ti";
import { TbUserShield } from "react-icons/tb";
import { TbUserCog } from "react-icons/tb";
import { RiUser6Line } from "react-icons/ri";
import { RiUserSettingsLine } from "react-icons/ri";

import { MdOutlineGroups } from "react-icons/md";

import environment from "../../../environment";
import ApiClient from "../../../methods/api/apiClient";
import { FiUsers } from "react-icons/fi";
import { LuLogOut, LuUser } from "react-icons/lu";
import { GoLock } from "react-icons/go";
import { logout } from "../../../Pages/actions/user";
import methodModel from "../../../methods/methods";
import { IoArrowDownCircleSharp } from "react-icons/io5";
import { RxDoubleArrowDown } from "react-icons/rx";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Html = ({ ListItemLink, tabclass, isAllow, route, isOpen, user }) => {
  const [activeplan, setActiveplan] = useState();
  const role = user?.customerRole?.name === "Group Leader";
  const getactivePlan = () => {
    let filter = {};
    if (user?.subRole?.id == environment.SubRolePartner) {
      filter = { id: user.id || user?._id };
    } else {
      filter = {};
    }
    ApiClient.get("api/getMyPlan", filter).then((res) => {
      if (res.success) {
        setActiveplan(res?.data);
      }
    });
  };

  const location = useLocation();
  useEffect(() => {
    if (user?.customerRole?.name === "Group Leader") {
      getactivePlan();
    }
  }, []);

  const activecls = (tab) => {
    let url = window.location.href;
    let value = false;
    tab?.map((itm) => {
      if (url.includes(itm)) value = true;
    });
    return value;
  };

  const menus = [
    {
      name: "Main Menu",
    },
    {
      name: "Dashboard",
      icon: <img src="/assets/img/dashboard.svg" alt=""/>,
      activeIcon: <img src="/assets/img/dashboard-blue.svg" alt=""/>,
      url: "/dashboard",
      key: "readDashboard",
    },
    // {
    //   name: "Roles and Permissions",
    //   icon: <img src="/assets/img/role.svg" alt=""/>,
    //   activeIcon: <img src="/assets/img/role-blue.svg" alt=""/>,
    //   url: "/role",
    //   key: "readRoles",
    // },
    {
      name: "Staff",
      icon: <img src="/assets/img/usero.svg" alt=""/>,
      activeIcon: <img src="/assets/img/usero-blue.svg" alt=""/>,
      url: "/user",
      key: "readstaff",
    },
    {
      name: "Categories",
      activeIcon: <img src="/assets/img/material-blue.svg" alt=""/>,
      icon: <img src="/assets/img/contractor.svg" alt=""/>,
      activeIcon: <img src="/assets/img/dashboard.svg" alt=""/>,
      url: "/category",
    },
    {
      name: "Static Pages",
      activeIcon: <img src="/assets/img/material-blue.svg" alt=""/>,
      icon: <img src="/assets/img/contractor.svg" alt=""/>,
      activeIcon: <img src="/assets/img/dashboard.svg" alt=""/>,
      url: "/content",
    },
    {
      name: "Users",
      icon: <img src="/assets/img/job.svg" alt="" />,
      activeIcon: <img src="/assets/img/job-blue.svg" alt=""/>,
      url: "/customers",
      key: "readCustomers",
    },
     {
      name: "Subscription Plan",
      icon: <img src="/assets/img/client.svg" alt=""/>,
      activeIcon: <img src="/assets/img/user-blue.svg" alt=""/>,
      menu: [
        {
          name: "Features",
          icon: <FiUsers className="text-inherit shrink-0 text-lg" />,
          url: "/feature",
          key: "readFeature",
        },
        {
          name: "Plans",
          icon: <FiUsers className="text-inherit shrink-0 text-lg" />,
          url: "/plan",
          key: "readPlan",
        },
      ],
    },
    {
      name: "Geo",
      icon: <img src="/assets/img/client.svg" alt=""/>,
      activeIcon: <img src="/assets/img/user-blue.svg" alt=""/>,
      menu: [
        {
          name: "City",
          icon: <FiUsers className="text-inherit shrink-0 text-lg" />,
          url: "/city",
          key: "readCustomers",
        },
        {
          name: "State",
          icon: <FiUsers className="text-inherit shrink-0 text-lg" />,
          url: "/state",
          key: "readProject",
        },
        {
          name: "County",
          icon: <FiUsers className="text-inherit shrink-0 text-lg" />,
          url: "/country",
          key: "readProject",
        },
        {
          name: "Continent",
          icon: <FiUsers className="text-inherit shrink-0 text-lg" />,
          url: "/continent",
          key: "readContinent",
        },
      ],
    },
    // {
    //   name: "Product",
    //   icon: <img src="/assets/img/job.svg" alt="" />,
    //   activeIcon: <img src="/assets/img/job-blue.svg" alt="" />,
    //   url: "/product",
    //   key: "readProduct",
    // },
   
  ];

  return (
    <>
      <div
        className={`px-[12px] sidebar-padding ${isOpen && styles.sm_sidebar}`}
        component="siderbar"
      >
        <div className="flex items-center  justify-between w-full  rounded-[5px] border bg-[#e9f0f9] relative  my-1 p-3 profile-hidden">
          <div className="flex items-center ">
            <img
              alt="image"
              src={methodModel.userImg(user.image)}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="ml-2 text-left ">
              <b className="capitalize text-[14px]">{user.fullName}</b>
              <p className="grayCls mb-0 text-capitalize text-[12px]">
                {user.role?.name}
              </p>
            </div>
          </div>
          <Menu as="div" className=" ps-2 delete-drop">
            <div>
              <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md    py-1 text-sm font-semibold text-gray-900 ">
                <div className="flex items-center bg-white border p-3 rounded-[50px]">
               
                <RxDoubleArrowDown className="text-[#5b6b79] text-[16px] "/>

                </div>
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white w-full shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/profile"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm flex items-center gap-2"
                        )}
                      >
                        <LuUser /> Profile
                      </Link>
                    )}
                  </Menu.Item>
                  {/* <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/dashboard"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm flex align-center flex items-center gap-2"
                      )}
                    >
                      <RxDashboard /> Dashboard
                    </Link>
                  )}
                </Menu.Item> */}
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/profile/change-password"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm flex items-center gap-2"
                        )}
                      >
                        <GoLock />
                        Change Password
                      </Link>
                    )}
                  </Menu.Item>

                  <Menu.Item className="divide-y-1 divide-gray-800 pt-1  mt-2">
                    <p className="border-t"></p>
                  </Menu.Item>

                  <Menu.Item className="">
                    {({ active }) => (
                      <span
                        onClick={() => logout()}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block w-full px-4 py-2 text-left text-sm ancortag flex items-center gap-2 cursor-pointer"
                        )}
                      >
                        <LuLogOut /> Logout
                      </span>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        <ul className="space-y-2 ">
          {menus.map((itm) => {
            return (
              <>
                {itm.icon ? (
                  <>
                    <li>
                      {itm.menu ? (
                        <>
                          {isAllow(
                            itm.menu.map((itm) => itm.key).toString()
                          ) ? (
                            <>
                              <Disclosure
                                as="div"
                                defaultOpen={activecls(
                                  itm.menu.map((itm) => itm.url)
                                )}
                              >
                                {({ open }) => (
                                  <>
                                    <tooltip placement="right" title={itm.name}>
                                      <Disclosure.Button className="w-full p-4 rounded-md flex items-center justify-between gap-[12px] transition-all duration-300 sidebar-drop">
                                          <span className="text-sm fow-full  rounded-md flex items-center justify-between gap-[12px] transition-all duration-300nt-normal text-inherit flex items-center gap-[12px] crm ">
                                            {!open ? <>
                                              {itm?.icon}
                                            </> : <>
                                              {itm?.activeIcon}
                                            </>}
                                            <span className="text-inherit leading-none sidebar_text">
                                              {itm.name}
                                            </span>
                                          </span>
                                        <TiArrowSortedDown
                                          className={`${
                                            open ? "" : "-rotate-90 transform"
                                          } h-3 w-3 transition-all duration-500`}
                                        />
                                      </Disclosure.Button>
                                    </tooltip>
                                    <Transition
                                      enter="transition duration-300 ease-in-out"
                                      enterFrom="transform scale-95 opacity-0"
                                      enterTo="transform scale-300 opacity-300"
                                      leave="transition duration-300 ease-in-out"
                                      leaveFrom="transform scale-300 opacity-300"
                                      leaveTo="transform scale-95 opacity-0"
                                    >
                                      <Disclosure.Panel className=" mt-[4px] ">
                                        <ul className="space-y-2">
                                          {itm.menu?.map((sitm) => {
                                            return (
                                              <>
                                                {isAllow(sitm.key) ? (
                                                  <li className="px-4">
                                                    {" "}
                                                    <NavLink
                                                      className={(isActive) =>
                                                        "p-4 rounded-md block text-sm font-normal text-[#333] cursor-pointer !no-underline transition-all " +
                                                        (location?.pathname.includes(sitm.url) &&
                                                          " !text-[#1E5DBC] !bg-[#e5edfa]  !font-medium")
                                                      }
                                                      to={sitm.url}
                                                    >
                                                     <div className="flex items-center relative ">
                                                     <span className="w-[7px] h-[7px] bg-[#596b77] rounded-full block absolute -left-[4px]"></span>
                                                      <span
                                                        className="text-inherit leading-none sidebar_text ps-5"
                                                        title={sitm.name}
                                                      >
                                                        {sitm.name}
                                                      </span>
                                                     </div>
                                                    </NavLink>
                                                  </li>
                                                ) : null}
                                              </>
                                            );
                                          })}
                                        </ul>
                                      </Disclosure.Panel>
                                    </Transition>
                                  </>
                                )}
                              </Disclosure>
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      ) : (
                        <>
                          {isAllow(itm.key) ? (
                            <>
                              <tooltip
                                placement="top"
                                color="#1E5DBC"
                                title={itm.name}
                              >
                                <NavLink
                                  to={itm.url}
                                  className={(isActive) =>
                                    "p-4 rounded-md flex items-center gap-[12px] text-sm font-normal text-[#333] hover:!text-[#1E5DBC] hover:bg-[#e5edfa] !no-underline transition-all " +
                                    (location?.pathname.includes(itm.url)&&
                                      " !text-[#1E5DBC] !bg-[#e5edfa] !font-medium")
                                  }
                                >
                                  {!(location?.pathname.includes(itm.url))?<>
                                    {itm.icon}
                                  </>:<>
                                  {itm?.activeIcon}
                                  </>}
                                  
                                  <span className="text-inherit leading-none sidebar_text">
                                    {itm.name}
                                  </span>
                                </NavLink>
                              </tooltip>
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <h6
                        className={`${
                          isOpen
                            ? "py-[12px] "
                            : "p-[12px]  text-md"
                        } text-xs font-medium text-[#7E8B99] mt-[12px]`}
                      >
                        <span className=" sidebar_text text-center">
                          {" "}
                          {itm.name}{" "}
                        </span>
                      </h6>
                    </li>
                  </>
                )}
              </>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Html;
