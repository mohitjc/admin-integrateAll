import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/global/layout";
import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import { useParams } from "react-router-dom";
import shared from "./shared";
import loader from "../../methods/loader";
import { Tooltip } from "antd";
import { useSelector } from "react-redux";
import methodModel from "../../methods/methods";

const ViewBlog = () => {
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
                className="!px-4  py-2 cursor-pointer flex items-center justify-center  rounded-lg shadow-btn hover:bg-[#F3F2F5] border transition-all  mr-3 bg-[#05388fed] text-white"
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
               <div className="col-span-6 flex items-center mb-4">
                  <label className="text-[14px] text-[#0000009c] tracking-wider w-[160px]">Title:</label>
                  <p className="text-[14px] text-black font-medium ms-3">
                    {" "}
                    {/* <LiaUserSolid className="text-xl text-[#063688]" /> */}
                    {data && data.name}
                  </p>
                </div>
                  <div className="col-span-6 flex items-center mb-4">
                   <label className="text-[14px] text-[#0000009c] tracking-wider  w-[160px]">Description:</label>
                   <p className="text-[14px] text-black font-medium ms-3">
                    {/* <MdOutlineEmail className="text-xl text-[#063688]" /> */}
                    {data && data.short_description}
                  </p>
                </div> 
                <div className="col-span-6 flex items-center mb-4">
                   <label className="text-[14px] text-[#0000009c] tracking-wider  w-[160px]">Meta Title:</label>
                   <p className="text-[14px] text-black font-medium ms-3">
                    {/* <MdOutlineEmail className="text-xl text-[#063688]" /> */}
                    {data && data.meta_title}
                  </p>
                </div> 
                <div className="col-span-6 flex items-center mb-4">
                   <label className="text-[14px] text-[#0000009c] tracking-wider  w-[160px]">Meta Description:</label>
                   <p className="text-[14px] text-black font-medium ms-3">
                    {/* <MdOutlineEmail className="text-xl text-[#063688]" /> */}
                    {data && data.meta_desc}
                  </p></div>
                  <div className="col-span-6 flex items-center mb-4">
                   <label className="text-[14px] text-[#0000009c] tracking-wider  w-[160px]">Meta Description:</label>
                   <p className="text-[14px] text-black font-medium ms-3">
                    {/* <MdOutlineEmail className="text-xl text-[#063688]" /> */}
                    {data && data.keywords.map((itm)=>itm).join(",")}
                  </p>
                </div> 
                    <div className="col-span-full">
                      <label className="profileheddingcls">Images</label>
                      <div className="flex gap-2 flex-wrap items-center">
                              <img src={methodModel.noImg(data?.image)} width="140" />
                      </div>
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

export default ViewBlog;
