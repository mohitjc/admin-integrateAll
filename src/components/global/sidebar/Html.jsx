import { React, useEffect, useState } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import styles from "./index.module.css";
import { NavLink, useLocation } from "react-router-dom";
import { Tooltip } from "antd";
import { RiHome6Line, RiUserSettingsLine } from "react-icons/ri";
import { TiArrowSortedDown } from "react-icons/ti";
import { TbCategoryPlus } from "react-icons/tb";
import { BiCartAdd } from "react-icons/bi";
import { PiBellSimpleLight, PiNewspaper } from "react-icons/pi";
import { GrUserSettings } from "react-icons/gr";
import { VscSymbolMisc } from "react-icons/vsc";
import { GoFileMedia } from "react-icons/go";
import { TfiLayoutMediaCenterAlt } from "react-icons/tfi";
import { MdOutlineAssignment } from "react-icons/md";
import { RiContractLine } from "react-icons/ri";
import { FaQuestion } from "react-icons/fa";
import {
  MdContentPaste,
  MdOutlineGroups,
} from "react-icons/md";

import environment from "../../../environment";
import ApiClient from "../../../methods/api/apiClient";
import { FiUsers } from "react-icons/fi";
import { LiaBlogSolid } from "react-icons/lia";

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

  const menus = [
    {
      name: "Main Menu",
    },
    {
      name: "Dashboard",
      icon: <RiHome6Line className="text-inherit shrink-0 text-lg" />,
      url: "/dashboard",
      key: "readDashboard",
    },
    {
      name: "Staff",
      icon: <FiUsers className="text-inherit shrink-0 text-lg" />,
      url: "/user",
      key: "readstaff",
    },
    {
      name: "Students",
      icon: <MdOutlineGroups className="text-inherit shrink-0 text-lg" />,
      url: "/customers",
      key: "readCustomers",
    },
    {
      name: "Assignments",
      icon: <MdOutlineAssignment className="text-inherit shrink-0 text-lg" />,
      url: "/assignment",
      key: "",
    },
    {
      name: "Contract",
      icon: <RiContractLine className="text-inherit shrink-0 text-lg" />,
      url: "/contract",
      key: "",
    },
    {
      name: "Content Management",
      icon: <MdContentPaste className="text-inherit shrink-0 text-lg" />,
      url: "/content",
      key: "readContent",
    },
    {
      name: "Word Estimate",
      icon: <MdOutlineAssignment className="text-inherit shrink-0 text-lg" />,
      url: "/word-estimate",
      key: "readWordCount",
    },

    {
      name: "Blogs",
      icon: <LiaBlogSolid className="text-inherit shrink-0 text-lg" />,
      url: "/blogs",
      key: "readBlogs",
    },

    {
      name: "Faqs",
      icon: <FaQuestion className="text-inherit shrink-0 text-lg" />,
      url: "/faqs",
      key: "readFaqs",
    },

    {
      name: "News Letter",
      icon: <FaQuestion className="text-inherit shrink-0 text-lg" />,
      url: "/newsletter",
      key: "readNewsletter",
    },
    // {
    //   name: "Blogs",
    //   icon: (
    //     <TfiLayoutMediaCenterAlt className="text-[#fff] shrink-0 text-lg" />
    //   ),
    //   url: "/blog",
    //   key: "readBlogs",
    // },
    // {
    //   name: "Content Management",
    //   icon: <MdContentPaste className="text-[#fff] shrink-0 text-lg" />,
    //   url: "/content-management",
    //   tab: "content-management",
    //   menu: [
    //     {
    //       name: "FAQ",
    //       icon: <FaQuestion className="text-[#fff] shrink-0 text-lg" />,
    //       url: "/faq",
    //       key: "readFAQ",
    //     },
    //     {
    //       name: "Content",
    //       icon: <MdContentPaste className="text-[#fff] shrink-0 text-lg" />,
    //       url: "/content",
    //       key: "readContent",
    //     },
    //     {
    //       name: "Newsletter",
    //       icon: <PiNewspaper className="text-[#fff] shrink-0 text-lg" />,
    //       url: "/newsletter",
    //       key: "readNewsletter",
    //     },
    //     {
    //       name: "Subscribers",
    //       icon: (
    //         <MdOutlineMarkEmailRead className="text-[#fff] shrink-0 text-lg" />
    //       ),
    //       url: "/subscribers",
    //       key: "readSubscribers",
    //     },
    //   ],
    // },
    // {
    //   name: "Settings",
    //   icon: <FiSettings className="text-[#fff] shrink-0 text-lg" />,
    //   url: "/profile/settings",
    //   key: "settings",
    // },
  ];

  return (
    <>
      <div
        className={`px-[8px] ${isOpen && styles.sm_sidebar}`}
        component="siderbar"
      >
        <ul className="space-y-2 px-2">
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
                                defaultOpen={tabclass(itm.tab)}
                              >
                                {({ open }) => (
                                  <>
                                    <tooltip placement="right" title={itm.name}>
                                      <Disclosure.Button className="w-full p-2.5 rounded-md flex items-center justify-between text-[#fff]  hover:!text-[#fff] gap-[12px] hover:bg-[#063688] transition-all duration-300">
                                        <span className="text-sm font-normal text-inherit flex items-center gap-[12px] crm">
                                          {itm.icon}
                                          <span className=" text-inherit leading-none sidebar_text">
                                            {itm.name}
                                          </span>
                                        </span>
                                        <TiArrowSortedDown
                                          className={`${
                                            open ? "" : "-rotate-90 transform"
                                          } h-4 w-4 transition-all duration-500  text-[#fff]`}
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
                                                        "p-2.5 rounded-md block text-sm font-normal text-[#d6d6d6] hover:text-[#fff] cursor-pointer  hover:bg-[#063688] !no-underline transition-all " +
                                                        (location?.pathname ==
                                                          sitm.url &&
                                                          " !text-[#fff] !font-medium")
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
                                    "p-2.5 rounded-md flex items-center gap-[12px] text-sm font-normal text-[#333] hover:!text-[#fff] hover:bg-[#063688] !no-underline transition-all " +
                                    (location?.pathname === itm.url &&
                                      " !text-[#fff] !bg-[#063688] !font-medium")
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
                            ? "py-[12px] text-center"
                            : "p-[12px] text-center text-md"
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
