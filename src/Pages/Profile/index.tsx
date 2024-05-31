import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/global/layout";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import "./profile.scss";
import methodModel from "../../methods/methods";
import { useSelector } from "react-redux";
import { LiaUserSolid } from "react-icons/lia";
import { MdOutlineEmail, MdOutlinePhone } from "react-icons/md";
import questionsKeys from "./questions";

const Profile = () => {
  const user = useSelector((state: any) => state.user);
  const [data, setData]: any = useState("");
  const [questions, setQuestions]: any = useState([]);
  const gallaryData = () => {
    loader(true);
    ApiClient.get(`user/profile`, { id: user._id }).then((res) => {
      if (res.success) {
        setData(res.data);
      }
      loader(false);
    });
  };

  const getQuestionsList = () => {
    ApiClient.get(`onboarding-questions/list`, { id: user._id }).then((res) => {
      if (res.success) {
        setQuestions(res.data);
      }
    });
  };

  useEffect(() => {
    if (user.loggedIn) {
      gallaryData();
      getQuestionsList();
    }
  }, []);

  const sortedQuestions = questions?.sort(
    (a: any, b: any) => a.order - b.order
  );

  console.log("questions", questions);

  return (
    <Layout>
      <div className="wrapper_section">
        <div className="flex items-center  justify-between mb-8">
          <h3 className=" text-lg lg:text-2xl font-semibold text-[#111827]">
            Profile Information
          </h3>
          <Link
            to="/profile/edit"
            className="px-2 lg:!px-4 text-sm font-normal bg-[#EB6A59] hover:bg-orange-700 text-white h-10 flex items-center justify-center gap-2 !bg-primary rounded-lg shadow-btn hover:opacity-80 transition-all focus:ring-2 ring-[#EDEBFC] disabled:bg-[#D0CAF6] disabled:cursor-not-allowed"
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


        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4 lg:col-span-3">
              <div className="flex items-center justify-center py-8 shadow-box overflow-hidden rounded-lg bg-white  gap-4 shrink-0 sticky top-6">
                
                <div className="flex flex-col items-center gap-4">
                <div className="">
                  <img
                    src={methodModel.userImg(data && data.image)}
                    className="h-36 w-36 rounded-full object-cover mx-auto"
                  />
                </div>
                  <div className="text-center">
                   
                    <p className="text-md text-gray-700 flex items-center  flex flex-col ">
                      {" "}
                      <LiaUserSolid className="text-xl text-[#EB6A59]" />
                      {data && data.fullName}
                    </p>
                  </div>
                  <div className="text-center">
                   
                    <p className="text-md text-gray-700 flex items-center  flex flex-col ">
                      <MdOutlineEmail className="text-xl text-[#EB6A59]" />
                      {data && data.email}
                    </p>
                  </div>

                  <div className="text-center">
                  
                    <p className="text-md text-gray-700 flex items-center  flex flex-col ">
                      <MdOutlinePhone className="text-xl text-[#EB6A59]" />
                      {String(data.mobileNo ? "+" + data.mobileNo : "N/A")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
      

        <div className="col-span-12 md:col-span-8 lg:col-span-9    ">
          
          <div className="p-6 shadow-box overflow-hidden rounded-lg bg-white ">
            <div className="text-xl mb-5">Onboarding Answers :-</div>
            {sortedQuestions?.map((item: any, index: any) => {
              let key: any = questionsKeys[item.title];
              let answer = data[key];
              if (data[key] == true || data[key] == false) {
                answer = data[key] == true ? "Yes" : "No";
              }
              if (Array.isArray(answer)) {
                answer = answer.join(", ");
              }
              return (
                <div
                  key={index}
                  className={`${
                    index > 0
                      ? "mt-3  last:border-0 border-b border-gray-200 pb-4"
                      : "mt-0 last:border-0 border-b border-gray-200 pb-4"
                  }`}
                >
                  <div className="text-xl mb-3 font-bold mb-2 ">
                    {item.title}
                  </div>
                  <div className="flex items-start font-semibold gap-2 mb-2 ">
                    <span className="h-8 w-8 justify-center flex items-center bg-gray-200 shrink-0">
                      Q
                    </span>{" "}
                    {item.question}
                  </div>
                  <div className="flex items-start font-regular gap-2">
                    <span className="h-8 w-8 justify-center text-white flex items-center bg-[#EB6A59] shrink-0">
                      A
                    </span>
                    <span> {answer}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
