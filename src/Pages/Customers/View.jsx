import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/global/layout";
import { useEffect, useState } from "react";
import datepipeModel from "../../models/datepipemodel";
import ApiClient from "../../methods/api/apiClient";
import { useParams } from "react-router-dom";
import shared from "./shared";
import loader from "../../methods/loader";
import { Tooltip } from "antd";
import questionsKeys from "../Profile/questions";
import { useSelector } from "react-redux";
import { LiaUserSolid } from "react-icons/lia";
import { MdOutlineEmail, MdOutlinePhone } from "react-icons/md";
import methodModel from "../../methods/methods";
import { GrUserSettings } from "react-icons/gr";

const View = () => {
  const user = useSelector((state) => state.user);

  const [data, setData] = useState();
  const [questions, setQuestions] = useState([]);

  const history = useNavigate();
  const { id } = useParams();

  const getDetail = () => {
    loader(true);
    ApiClient.get(shared.detailApi, { id: id }).then((res) => {
      loader(false);
      if (res.success) {
        setData(res.data);
      }
    });
  };

  const sortedQuestions = questions?.sort((a, b) => a.order - b.order);

  useEffect(() => {
    getDetail();
  }, []);

  return (
    <>
      <Layout>
        <div className="wrapper_section">
          <div className="flex items-center mb-8">
            <Tooltip placement="top" title="Back">
              <span
                onClick={() => history(-1)}
                className="!px-4  py-2 cursor-pointer flex items-center justify-center  rounded-lg shadow-btn hover:bg-[#F3F2F5] border transition-all  mr-3 bg-[#1E5DBC] text-white hover:text-black"
              >
                <i className="fa fa-angle-left text-lg"></i>
              </span>
            </Tooltip>
            <div>
              <h3 className="text-lg lg:text-2xl font-semibold text-[#111827]">
                {shared.addTitle} Details
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <div className="  shadow-box overflow-hidden rounded-lg bg-white  gap-4 shrink-0 ">
                <div>
                  <h4 className="p-4 border-b  font-medium rounded-[5px] rounded-bl-[0] rounded-br-[0] flex items-center text-[#1E5DBC] ">
                    <img
                      src="/assets/img/usero-blue.svg"
                      className="me-3 bg-[#e9f0f8] p-2 rounded-md"
                    />
                    Basic Information
                  </h4>
                </div>
                <div className="grid grid-cols-12 p-4">
                  <div className="col-span-6 flex flex-col mb-5">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 ">
                      Name:
                    </label>
                    <p className="text-[14px] text-black font-medium">
                      {" "}
                      {/* <LiaUserSolid className="text-xl text-[#1E5DBC]" /> */}
                      {data && data.fullName}
                    </p>
                  </div>
                  <div className="col-span-6 flex flex-col mb-5">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1  ">
                      Email:
                    </label>
                    <p className="text-[14px] text-black font-medium">
                      {/* <MdOutlineEmail className="text-xl text-[#1E5DBC]" /> */}
                      {data && data.email}
                    </p>
                  </div>

                  <div className="col-span-6 flex flex-col mb-5">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1  ">
                      Mobile Number:
                    </label>
                    <p className="text-[14px] text-black font-medium">
                      {/* <MdOutlinePhone className="text-xl text-[#1E5DBC]" />+ */}
                      +{data?.mobileNo || "--"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-12">
              <div className="  shadow-box overflow-hidden rounded-lg bg-white  gap-4 shrink-0 ">
              <div>
                  <h4 className="p-4 border-b  font-medium rounded-[5px] rounded-bl-[0] rounded-br-[0] flex items-center text-[#1E5DBC] ">
                    <img
                      src="/assets/img/usero-blue.svg"
                      className="me-3 bg-[#e9f0f8] p-2 rounded-md"
                    />
                   Company Profile Information
                  </h4>
                </div>
                <div className="grid grid-cols-12 p-4">
                <div className="col-span-6 flex flex-col mb-5">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1  ">
                      Company Name:
                    </label>
                    <p className="text-[14px] text-black font-medium">
                      {/* <MdOutlinePhone className="text-xl text-[#1E5DBC]" />+ */}
                      {data?.company || "--"}
                    </p>
                  </div>
                  <div className="col-span-6 flex flex-col mb-5">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1  ">
                      Business Type:
                    </label>
                    <p className="text-[14px] text-black font-medium">
                      {/* <MdOutlinePhone className="text-xl text-[#1E5DBC]" />+ */}
                      {data?.businessName && data?.businessName?.name ? data?.businessName?.name : "--"}
                    </p>
                  </div>
                  <div className="col-span-6 flex flex-col mb-5">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1  ">
                      Company Email
                    </label>
                    <p className="text-[14px] text-black font-medium">
                      {/* <GrUserSettings className="text-xl text-[#1E5DBC]" /> */}
                    </p>
                    {data?.CompanyEmail || "--"}
                  </div>
                  <div className="col-span-6 flex flex-col mb-5">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1  ">
                      Company Mobile Number:
                    </label>
                    <p className="text-[14px] text-black font-medium">
                      {/* <MdOutlineEmail className="text-xl text-[#1E5DBC]" /> */}
                      +{data?.companyMobileNo || "--"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <div className="  shadow-box overflow-hidden rounded-lg bg-white  gap-4 shrink-0 ">
              <div>
                  <h4 className="p-4 border-b  font-medium rounded-[5px] rounded-bl-[0] rounded-br-[0] flex items-center text-[#1E5DBC] ">
                    <img
                      src="/assets/img/usero-blue.svg"
                      className="me-3 bg-[#e9f0f8] p-2 rounded-md"
                    />
                   Company Information
                  </h4>
                </div>
                <div className="grid grid-cols-12 p-4">
                <div className="col-span-6 flex flex-col mb-5">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1  ">
                      Company Address
                    </label>
                    <p className="text-[14px] text-black font-medium">
                      {/* <MdOutlinePhone className="text-xl text-[#1E5DBC]" />+ */}
                      {data?.companyAddress || "--"}
                    </p>
                  </div>
                  <div className="col-span-6 flex flex-col mb-5">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1  ">
                      Contact Name:
                    </label>
                    <p className="text-[14px] text-black font-medium">
                      {/* <MdOutlineEmail className="text-xl text-[#1E5DBC]" /> */}
                      {data && data.contactName ? data?.contactName : "--"}
                    </p>
                  </div>

                  <div className="col-span-6 flex flex-col mb-5">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1  ">
                      Currency 
                    </label>
                    <p className="text-[14px] text-black font-medium">
                      {/* <MdOutlinePhone className="text-xl text-[#1E5DBC]" />+ */}
                      {data?.currency || "--"}
                    </p>
                  </div>
                  <div className="col-span-6 flex flex-col mb-5">
                    <label className="text-[14px] text-[#0000009c] tracking-wider mb-1  ">
                      Website URL
                    </label>
                    <p className="text-[14px] text-black font-medium">
                      {/* <GrUserSettings className="text-xl text-[#1E5DBC]" /> */}
                    </p>
                    {data?.websiteURL || "--"}
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </Layout>
    </>
  );
};

export default View;
