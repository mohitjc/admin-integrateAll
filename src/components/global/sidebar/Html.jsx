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
      icon: <img src="assets/img/dashboard.svg" alt=""/>,
      url: "/dashboard",
      key: "readDashboard",
    },
    {
      name: "Roles and Permissions",
      icon: <img src="assets/img/usero.svg" alt=""/>,
      url: "/role",
      key: "readRoles",
    },
    {
      name: "Staff",
      icon: <img src="assets/img/usero.svg" alt=""/>,
      url: "/user",
      key: "readstaff",
    },
    {
      name: "Contractor",
      icon: <img src="assets/img/contractor.svg" alt=""/>,
      url: "/contractor",
      key: "readContractor",
    },
    {
      name: "Materials",
      icon: <img src="assets/img/contractor.svg" alt=""/>,
      menu: [
        {
          name: "Category",
          icon: <img src="assets/img/usero.svg" alt=""/>,
          url: "/category",
          key: "readMaterial",
        },
        {
          name: "Materials",
          icon: <img src="assets/img/contractor.svg" alt=""/>,
          url: "/material",
          key: "readMaterial",
        },
      ],
    },
    {
      name: "Suppliers",
      icon: <img src="assets/img/box.svg" alt=""/>,
      url: "/supplier",
      key: "readSupplier",
    },
   
    {
      name: "Client",
      icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="11" fill="#B9C0C6"/>
      <path d="M10.9945 11.8016C12.923 11.8016 14.4863 10.0552 14.4863 7.9008C14.4863 5.74645 12.923 4 10.9945 4C9.06603 4 7.50269 5.74645 7.50269 7.9008C7.50269 10.0552 9.06603 11.8016 10.9945 11.8016Z" fill="#5A6B78"/>
      <path d="M17.8385 15.1181C17.21 13.9478 16.0228 12.9726 14.4864 12.3875C14.0673 12.2575 13.5785 12.2575 13.2293 12.4525C12.5309 12.8426 11.8326 13.0376 10.9945 13.0376C10.1565 13.0376 9.45813 12.8426 8.75976 12.4525C8.41058 12.3225 7.92172 12.2575 7.5027 12.4525C5.9663 13.0376 4.77908 14.0128 4.15055 15.1831C3.6617 16.0282 4.4299 17.0034 5.47745 17.0034H16.5116C17.5592 17.0034 18.3274 16.0282 17.8385 15.1181Z" fill="#5A6B78"/>
      </svg>
      ,
      menu: [
        {
          name: "Client",
          icon: <FiUsers className="text-inherit shrink-0 text-lg" />,
          url: "/customers",
          key: "readCustomers",
        },
        {
          name: "Project",
          icon: <FiUsers className="text-inherit shrink-0 text-lg" />,
          url: "/project",
          key: "readCustomers",
        },
      ],
    },
    // {
    //   name: "Contract",
    //   icon: <RiContractLine className="text-inherit shrink-0 text-lg" />,
    //   url: "/contract",
    //   key: "",
    // },
    // {
    //   name: "Content Management",
    //   icon: <MdContentPaste className="text-inherit shrink-0 text-lg" />,
    //   url: "/content",
    //   key: "readContent",
    // },

    // {
    //   name: "Blogs",
    //   icon: <LiaBlogSolid className="text-inherit shrink-0 text-lg" />,
    //   url: "/blogs",
    //   key: "readBlogs",
    // },

    // {
    //   name: "Faqs",
    //   icon: <MdOutlineQuestionMark className="text-inherit shrink-0 text-lg"/>,
    //   url: "/faqs",
    //   key: "readFaqs",
    // },

    // {
    //   name: "Newsletter",
    //   icon: <PiNewspaper className="text-inherit shrink-0 text-lg"/>,
    //   url: "/newsletter",
    //   key: "readNewsletter",
    // },
  ];

  return (
    <>
      <div
        className={`px-[12px] ${isOpen && styles.sm_sidebar}`}
        component="siderbar"
      >
        <div className="flex items-center gap-4  justify-center w-full  rounded-[5px] border bg-[#f3f5f7] relative  my-1 p-3">
          <div className="flex items-center">
            <img
              alt="image"
              src={methodModel.userImg(user.image)}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="ml-2 text-left">
              <b className="capitalize text-[14px]">{user.fullName}</b>
              <p className="grayCls mb-0 text-capitalize text-[12px]">
                {user.customerRole?.name}Administrator
              </p>
            </div>
          </div>
          <Menu as="div" className=" px-2">
            <div>
              <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md    py-1 text-sm font-semibold text-gray-900 ">
                <div className="flex items-center bg-[#eff0f2] border p-3 rounded-[50px]">
               
                <RxDoubleArrowDown className="text-[#5b6b79] text-[16px]"/>

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
                        id="logoutBtn"
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
                                      <Disclosure.Button className="w-full p-4 rounded-md flex items-center justify-between gap-[12px] transition-all duration-300">
                                        <span className="text-sm fow-full  rounded-md flex items-center justify-between gap-[12px] transition-all duration-300nt-normal text-inherit flex items-center gap-[12px] crm">
                                          {itm.icon}
                                          <span className="text-inherit leading-none sidebar_text">
                                            {itm.name}
                                          </span>
                                        </span>
                                        <TiArrowSortedDown
                                          className={`${
                                            open ? "" : "-rotate-90 transform"
                                          } h-4 w-4 transition-all duration-500`}
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
                                      <Disclosure.Panel className="pl-[30px] mt-[4px] ">
                                        <ul className="space-y-2">
                                          {itm.menu?.map((sitm) => {
                                            return (
                                              <>
                                                {isAllow(sitm.key) ? (
                                                  <li>
                                                    {" "}
                                                    <NavLink
                                                      className={(isActive) =>
                                                        "p-2.5 rounded-md block text-sm font-normal text-[#333] cursor-pointer !no-underline transition-all " +
                                                        (location?.pathname ==
                                                          sitm.url &&
                                                          " !text-[#fff] bg-[#063688] !font-medium")
                                                      }
                                                      to={sitm.url}
                                                    >
                                                      <span
                                                        className="text-inherit leading-none sidebar_text"
                                                        title={sitm.name}
                                                      >
                                                        {sitm.name}
                                                      </span>
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
                                color="#063688"
                                title={itm.name}
                              >
                                <NavLink
                                  to={itm.url}
                                  className={(isActive) =>
                                    "p-4 rounded-md flex items-center gap-[12px] text-sm font-normal text-[#333] hover:!text-[#3b7ffa] hover:bg-[#e5edfa] !no-underline transition-all " +
                                    (location?.pathname === itm.url &&
                                      " !text-[#3b7ffa] !bg-[#e5edfa] !font-medium")
                                  }
                                >
                                  {itm.icon}
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
