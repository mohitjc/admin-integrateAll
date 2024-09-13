import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/global/layout";
import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import { useParams } from "react-router-dom";
import shared from "./shared";
import loader from "../../methods/loader";
import { Tooltip } from "antd";
import { useSelector } from "react-redux";
import pipeModel from "../../models/pipeModel";
import datepipeModel from "../../models/datepipemodel";
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
        let data=res.data
        data.permissions=data.permissions?.[0]
        setData(data);
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
                  <h4 className="p-4 bg-[#0b5cb81f] font-medium">Basic Information</h4>
                </div>
               <div className="grid grid-cols-12 p-4">
               <div className="col-span-6 flex flex-col mb-5">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 ">Title:</label>
                  <p className="text-[14px] text-black font-medium capitalize">
                    {data && data.title}
                  </p>
                </div>
               <div className="col-span-6 flex flex-col mb-5">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 ">Created At:</label>
                  <p className="text-[14px] text-black font-medium capitalize">
                    {datepipeModel.date(data?.createdAt)}
                  </p>
                </div>
                <div className="col-span-6 flex flex-col mb-5">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 ">Estimate:</label>
                  <p className="text-[14px] text-black font-medium capitalize">
                    {pipeModel.currency(data?.estimate)}
                  </p>
                </div>
                <div className="col-span-6 flex flex-col mb-5">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 ">Client:</label>
                  <p className="text-[14px] text-black font-medium capitalize">
                    {data && data.client?.fullName}
                  </p>
                </div>
                <div className="col-span-6 flex flex-col mb-5">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 ">Contractor:</label>
                  <p className="text-[14px] text-black font-medium capitalize">
                    {data && data.contractor?.fullName}
                  </p>
                </div>
                <div className="col-span-6 flex flex-col mb-5">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 ">Property:</label>
                  <p className="text-[14px] text-black font-medium capitalize">
                    {data && data.property?.name}
                  </p>
                </div>
                <div className="col-span-6 flex flex-col mb-5">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 ">Status:</label>
                  <p className={`text-[14px] text-black font-medium capitalize ${data?.status}`}>
                    {data && data.status}
                  </p>
                </div>
                <div className="col-span-6 flex flex-col mb-5">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 ">Materials:</label>
                  <p className="text-[14px] text-black font-medium capitalize">
                  <span className="flex gap-2">{data?.material?.map((itm, i) => {
                          return <span key={i} className="inline-block bg-[#EBEBEB] py-1 px-2 rounded text-[12px] capitalize">{itm.name}</span>
                        })}</span>
                  </p>
                </div>
                <div className="col-span-full flex flex-col mb-5">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 ">Description:</label>
                  <p className="text-[14px] text-black font-medium capitalize">
                    {data && data.description}
                  </p>
                </div>
                <div className="col-span-full flex flex-col mb-5">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 ">Images:</label>
                  <p className="text-[14px] text-black font-medium capitalize flex flex-wrap gap-3">
                    {data?.images?.map(itm=>{
                     return <img src={methodModel.noImg(itm)} className="w-[150px] h-[150px] object-contain" />
                    })}
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
