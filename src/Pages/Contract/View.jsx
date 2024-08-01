import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/global/layout";
import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import { useParams } from "react-router-dom";
import shared from "./shared";
import loader from "../../methods/loader";
import { Tooltip } from "antd";
import { useSelector } from "react-redux";
import moment from "moment";
import datepipeModel from "../../models/datepipemodel";
import pipeModel from "../../models/pipeModel";
import methodModel from "../../methods/methods";

const View = () => {
  const user = useSelector((state) => state.user);

  const [data, setData] = useState();

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
                className="!px-4  py-2 cursor-pointer flex items-center justify-center  rounded-lg shadow-btn hover:bg-[#F3F2F5] border transition-all  mr-3"
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
               
               <div className="grid grid-cols-12 p-4">
               <div className="col-span-6 flex items-center mb-3">
                  <label className="text-[14px] text-[#0000009c] tracking-wider w-[130px]">Title:</label>
                  <p className="text-[14px] text-black font-medium ms-3">
                    {" "}
                    {/* <LiaUserSolid className="text-xl text-[#063688]" /> */}
                    {data && data.title}
                  </p>
                </div>

                  <div className="col-span-6 flex items-center mb-3">
                  <label className="text-[14px] text-[#0000009c] tracking-wider  w-[130px]">Start Date :</label>
                   <p className="text-[14px] text-black font-medium ms-3">
                    {/* <MdOutlinePhone className="text-xl text-[#063688]" />+ */}
                   {datepipeModel.date(data?.startDate)}
                  </p>
                </div>
                <div className="col-span-6 flex items-center mb-3">
                  <label className="text-[14px] text-[#0000009c] tracking-wider  w-[130px]">End Date :</label>
                   <p className="text-[14px] text-black font-medium ms-3">
                    {/* <MdOutlinePhone className="text-xl text-[#063688]" />+ */}
                   {datepipeModel.date(data?.endDate)}
                  </p>
                </div>
                <div className="col-span-6 flex items-center mb-3">
                  <label className="text-[14px] text-[#0000009c] tracking-wider  w-[130px]">Total Amount :</label>
                   <p className="text-[14px] text-black font-medium ms-3">
                    {/* <MdOutlinePhone className="text-xl text-[#063688]" />+ */}
                    {pipeModel.number(data?.total_amount)}
                  </p>
                </div>
                <div className="col-span-6 flex items-center mb-3">
                  <label className="text-[14px] text-[#0000009c] tracking-wider  w-[130px]">Total Amount :</label>
                   <p className="text-[14px] text-black font-medium ms-3">
                    {/* <MdOutlinePhone className="text-xl text-[#063688]" />+ */}
                    {pipeModel.number(data?.total_amount)}
                  </p>
                </div>
                <div className="col-span-6 flex items-center mb-3">
                  <label className="text-[14px] text-[#0000009c] tracking-wider  w-[130px]">Terms :</label>
                   <p className="text-[14px] text-black font-medium ms-3">
                    {/* <MdOutlinePhone className="text-xl text-[#063688]" />+ */}
                    <div dangerouslySetInnerHTML={{__html:data?.terms}}></div>
                  </p>
                </div>
                <div className="col-span-6 flex items-center mb-3">
                  <label className="text-[14px] text-[#0000009c] tracking-wider  w-[130px]">Document :</label>
                   <p className="text-[14px] text-black font-medium ms-3">
                    {/* <MdOutlinePhone className="text-xl text-[#063688]" />+ */}
                    {data?.doc_url?<>
                    <a href={methodModel.noImg(data?.doc_url)} target="_new">
                    <span class="material-symbols-outlined">draft</span>
                    </a>
                    </>:<></>}
                  </p>
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
