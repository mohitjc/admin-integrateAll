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
import environment from "../../environment";

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
              <div>
                  <h4 className="p-4 bg-[#0b5cb81f] font-medium">Contract Information</h4>
                </div>
               <div className="grid grid-cols-12 p-4">
               <div className="col-span-6 flex  flex-col mb-5">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 ">Title:</label>
                  <p className="text-[14px] text-black font-medium">
                    {" "}
                    {/* <LiaUserSolid className="text-xl text-[#1E5DBC]" /> */}
                    {data && data.title}
                  </p>
                </div>

                  <div className="col-span-6 flex  flex-col mb-5">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1  ">Start Date :</label>
                   <p className="text-[14px] text-black font-medium">
                    {/* <MdOutlinePhone className="text-xl text-[#1E5DBC]" />+ */}
                   {datepipeModel.date(data?.startDate)}
                  </p>
                </div>
                <div className="col-span-6 flex  flex-col mb-5">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1  ">End Date :</label>
                   <p className="text-[14px] text-black font-medium">
                    {/* <MdOutlinePhone className="text-xl text-[#1E5DBC]" />+ */}
                   {datepipeModel.date(data?.endDate)}
                  </p>
                </div>
                <div className="col-span-6 flex  flex-col mb-5">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1  ">Total Amount :</label>
                   <p className="text-[14px] text-black font-medium">
                    {/* <MdOutlinePhone className="text-xl text-[#1E5DBC]" />+ */}
                    {pipeModel.number(data?.total_amount)}
                  </p>
                </div>
              
                <div className="col-span-12 flex  flex-col mb-5">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1  ">Terms :</label>
                   <p className="text-[14px] text-black font-medium " dangerouslySetInnerHTML={{__html:data?.terms}}>
                   
                  </p>
                </div>
                <div className="col-span-6 flex  flex-col mb-5">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1  ">Document :</label>
                   <p className="text-[14px] text-black font-medium">
                    {/* <MdOutlinePhone className="text-xl text-[#1E5DBC]" />+ */}
                    {data?.doc_url?<>
                    <a href={`${environment.api}document/${data?.doc_url}`} target="_new" className="relative w-[50px] h-[50px]">
                      <i className="fa fa-download absolute right-0 bottom-0 bg-[#06378b] text-white p-[7px] text-[7px] rounded-[50px]"></i>
                    <span class="material-symbols-outlined text-[40px]">draft</span>
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
