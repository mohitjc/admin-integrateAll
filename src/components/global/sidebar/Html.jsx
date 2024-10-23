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
import { MdSpaceDashboard } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { MdListAlt } from "react-icons/md";
import { IoGitMergeOutline } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { FaQuestion } from "react-icons/fa";
import { FaBloggerB } from "react-icons/fa6";
import { TbListDetails } from "react-icons/tb";
import { MdOutlineManageAccounts } from "react-icons/md";

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
      icon: <MdSpaceDashboard className="text-[20px]" />,
      activeIcon: <MdSpaceDashboard className="text-[20px]" />,
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
      icon: <FaUser className="text-[20px]" />,
      activeIcon: <FaUser className="text-[20px]" />,
      url: "/staff",
      key: "readstaff",
    },
    {
      name: "Categories",
      icon: <MdCategory className="text-[20px]" />,
      activeIcon: <MdCategory className="text-[20px]" />,
      url: "/category",
      key:"readCategory"
    },
    {
      name: "Customers",
      icon: <FaUsers className="text-[20px]"/>,
      activeIcon: <FaUsers className="text-[20px]"/>,
      url: "/customers",
      key: "readCustomers", 
    },
     {
      name: "Subscription Plan",
      icon: <MdListAlt className="text-[20px]" />,
      activeIcon: <MdListAlt className="text-[20px]" />,
      menu: [
        {
          name: "Features",
          icon: <FiUsers className="text-[20px]" />,
          url: "/feature",
          key: "readFeature",
        },
        {
          name: "Plans",
          icon: <FiUsers className="text-[20px]" />,
          url: "/plan",
          key: "readPlan",
        },
      ],
    },
    // {
    //   name: "Geo",
    //   icon: <IoGitMergeOutline className="text-[20px]" />,
    //   activeIcon: <IoGitMergeOutline className="text-[20px]" />,
    //   key:"readGeo",
    //   menu: [
    //     {
    //       name: "Continent",
    //       icon: <FiUsers className="text-[20px]" />,
    //       url: "/continent",
    //       key: "readGeo",
    //     },
    //     {
    //       name: "Country",
    //       icon: <FiUsers className="text-[20px]" />,
    //       url: "/country",
    //       key: "readGeo",
    //     },
    //     {
    //       name: "State",
    //       icon: <FiUsers className="text-[20px]" />,
    //       url: "/state",
    //       key: "readGeo",
    //     },
    //     {
    //       name: "City",
    //       icon: <FiUsers className="text-[20px]" />,
    //       url: "/city",
    //       key: "readGeo",
    //     },
    //   ],
    // },
    {
      name: "FAQ",
      icon: <FaQuestion className="text-[20px]" />,
      activeIcon: <FaQuestion className="text-[20px]" />,
      url: "/faqs",
      key: "readFaq",
    },
    {
      name: "Blogs",
      icon:<FaBloggerB className="text-[20px]" />,
      activeIcon: <FaBloggerB className="text-[20px]" />,
      url: "/blogs",
      key: "readBlogs",
    },
    {
      name: "Site Details",
      icon: <TbListDetails className="text-[20px]" />,
      activeIcon: <TbListDetails className="text-[20px]" />,
      url: "/sitedetails",
      key: "readSite",
    },
    {
      name: "Content Management",
      icon: <MdOutlineManageAccounts className="text-[20px]" />,
      activeIcon: <MdOutlineManageAccounts className="text-[20px]" />,
      url: "/content",
      key:'readContent'
    },
  ];

  return (
    <>
      <div
        className={`px-[12px] sidebar-padding ${isOpen && styles.sm_sidebar}`}
        component="siderbar"
      >
      
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
