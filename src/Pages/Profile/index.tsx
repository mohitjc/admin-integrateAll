import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/global/layout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import "./profile.scss";
import methodModel from "../../methods/methods";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state: any) => state.user);
  const [data, setData]: any = useState("");
  const [questions, setQuestions]: any = useState([]);
  const gallaryData = () => {
    loader(true);
    ApiClient.get(`user/detail`, { id: user._id }).then((res) => {
      if (res.success) {
        setData(res.data);
      }
      loader(false);
    });
  };

  useEffect(() => {
    if (user.loggedIn) {
      gallaryData();
    }
  }, []);

  const sortedQuestions = questions?.sort(
    (a: any, b: any) => a.order - b.order
  );

  return (
    <Layout>
      <div className="wrapper_section">
        <div className="flex items-center  justify-between">
          <h3 className=" text-lg lg:text-2xl font-semibold text-[#111827]">
            Profile Information
          </h3>
          <Link
            to="/profile/edit"
            className="px-2 lg:!px-4 text-sm font-normal bg-[#1E5DBC]  text-white h-10 flex items-center justify-center gap-2 !bg-primary rounded-lg shadow-btn hover:opacity-80 transition-all focus:ring-2 ring-[#EDEBFC] disabled:bg-[#D0CAF6] disabled:cursor-not-allowed"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
            </svg>
            Edit Profile
          </Link>
        </div>

        <div className="inner_part sm:mt-3 md:mt-3 p-6 shadow-box overflow-hidden rounded-lg bg-white   ">
          <div className="grid items-center grid-cols-12 gap-4 mb-5">
            <div className="col-span-12 md:col-span-12 lg:col-span-12">
              <div className="flex items-center gap-4 shrink-0">
                <div className="w-[20%]">
                  <img
                    src={methodModel.userImg(data && data.image)}
                    className="h-36 w-36 rounded-full object-cover mx-auto"
                  />
                </div>
                <div className="grid grid-cols-12 gap-4 ml-4 w-full lg:border-l border-dashed border-gray-400 pl-5">
                  <div className="col-span-12 md:col-span-6">
                    <label className="text-gray-600">Name</label>
                    <p className="text-[14px] text-gray-700  text-[#7e7d7d]  bg-[#1e5dbc1c] p-[5px_7px] rounded">
                      {" "}
                      {/* <LiaUserSolid className="text-xl" /> */}
                      {data && data.fullName}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <label className="text-gray-600">Email</label>
                    <p className="text-[14px] text-gray-700  text-[#7e7d7d]  bg-[#1e5dbc1c] p-[5px_7px] rounded">
                      {/* <MdOutlineEmail className="text-xl" /> */}
                      {data && data.email}
                    </p>
                  </div>

                  <div className="col-span-12 md:col-span-6 ">
                    <label className="text-gray-600">Phone Number</label>
                    <p className="text-[14px] text-gray-700  text-[#7e7d7d]  bg-[#1e5dbc1c] p-[5px_7px] rounded ">
                      {/* <MdOutlinePhone className="text-xl" /> */}
                      {String(data.mobileNo ? "+" + data.mobileNo : "N/A")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
