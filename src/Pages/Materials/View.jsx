import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/global/layout";
import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import { useParams } from "react-router-dom";
import shared from "./shared";
import loader from "../../methods/loader";
import { Tooltip } from "antd";
import { useSelector } from "react-redux";

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
                className="!px-4  py-2 cursor-pointer flex items-center justify-center  rounded-lg shadow-btn hover:bg-[#F3F2F5] border transition-all  mr-3 bg-[#05388fed] text-white hover:text-black"
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
                  <h4 className="p-4 bg-[#0636881a] font-medium">Basic Information</h4>
                </div>
               <div className="grid grid-cols-12 p-4">
               <div className="col-span-6 flex flex-col mb-5">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 ">Name:</label>
                  <p className="text-[14px] text-black font-medium capitalize">
                    {" "}
                    {/* <LiaUserSolid className="text-xl text-[#063688]" /> */}
                    {data && data.name}
                  </p>
                </div>
                <div className="col-span-6 flex flex-col mb-5">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 ">Category:</label>
                  <p className="text-[14px] text-black font-medium capitalize">
                    {data && data.category?.name}
                  </p>
                </div>
                <div className="col-span-6 flex flex-col mb-5">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 ">Supplier:</label>
                  <p className="text-[14px] text-black font-medium capitalize">
                    {data && data.supplier?.fullName}
                  </p>
                </div>
                <div className="col-span-6 flex flex-col mb-5">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 ">Price:</label>
                  <p className="text-[14px] text-black font-medium capitalize">
                    {data && data.price}
                  </p>
                </div>
                <div className="col-span-6 flex flex-col mb-5">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 ">Quantity:</label>
                  <p className="text-[14px] text-black font-medium capitalize">
                    {data && data.quantity}
                  </p>
                </div>
                <div className="col-span-6 flex flex-col mb-5">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 ">Vat Included:</label>
                  <p className="text-[14px] text-black font-medium capitalize">
                    {data && data.vat_included?'Yes':'No'}
                  </p>
                </div>
                <div className="col-span-6 flex flex-col mb-5">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 ">vat:</label>
                  <p className="text-[14px] text-black font-medium capitalize">
                    {data && data.vat}
                  </p>
                </div>
                <div className="col-span-6 flex flex-col mb-5">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 ">Unit:</label>
                  <p className="text-[14px] text-black font-medium capitalize">
                    {data && data.unit}
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
