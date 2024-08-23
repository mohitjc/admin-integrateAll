import { useNavigate } from "react-router-dom";
import Layout from "../../components/global/layout";
import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import { useParams } from "react-router-dom";
import shared from "./shared";
import loader from "../../methods/loader";
import { Tooltip } from "antd";
import { useSelector } from "react-redux";
import datepipeModel from "../../models/datepipemodel";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { RxRotateCounterClockwise } from "react-icons/rx";
import FormControl from "../../components/common/FormControl";
import Modal from "../../components/common/Modal";

const CounterOfferDetails = () => {
  const user = useSelector((state) => state.user);

  const [data, setData] = useState();
  const [counterModal, setCounterModal] = useState(false);
  const [counterForm, setCounterForm] = useState({
    counterOffer: "",
    message: "",
  });
  const [estimates, setEstimates] = useState([]);
  const getWordEstimate = () => {
    ApiClient.get("word-count/detail").then((res) => {
      if (res.success) {
        setEstimates(res);
      }
    });
  };

  const history = useNavigate();
  const { id } = useParams();

  const getDetail = () => {
    loader(true);
    ApiClient.get(shared.counterdetail, { id: id }).then((res) => {
      loader(false);
      if (res.success) {
        setData(res.data);
      }
    });
  };

  useEffect(() => {
    getDetail();
    getWordEstimate();
  }, []);

  const counterSubmit = (status) => {
    let payload = { 
      status: status == "accept" ? "offer-received" : "rejected",
    };

    loader(true);
    ApiClient.put(`counter-offer/update?id=${id}`, payload).then((res) => {
      loader(false);
      if (res?.success) {
        getDetail();
      }
    });
  };

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
            <div className="flex gap-3">
              <h3 className="text-lg lg:text-2xl font-semibold text-[#111827]">
                Counter Offer Details
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <div className="  shadow-box overflow-hidden rounded-lg bg-white  gap-4 shrink-0 ">
                <div className="flex justify-between p-4 bg-[#0636881a] font-medium items-center">
                  <h4 className="mb-0">Counter Offer Information</h4>
                  <div className="ml-auto flex gap-2">
                    {data?.status == "counteroffered" ? (
                      <>
                        <Tooltip placement="top" title="Accept">
                          <a
                            className="border border-tranparent cursor-pointer  hover:opacity-70 rounded-lg bg-[#06378b] text-white p-2 !text-primary flex items-center justify-center text-[14px]"
                            onClick={(e) => counterSubmit("accept")}
                          >
                            <IoCheckmarkDoneOutline className="me-1 w-5 h-5" />
                            <p> Accept</p>
                          </a>
                        </Tooltip>

                        <Tooltip placement="top" title="Reject">
                          <a
                            className="border border-[#06378b] cursor-pointer  hover:opacity-70 rounded-lg bg-transparent  p-2 !text-primary flex items-center justify-center text-[14px] text-[#06378b]"
                            onClick={(e) => counterSubmit("reject")}
                          >
                            {/* <RxCross2 /> */}
                            <RxRotateCounterClockwise className="w-5 h-5 me-1" />
                            <p>Reject</p>
                          </a>
                        </Tooltip>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-12 p-4">
                <div className="col-span-6 flex flex-col lg:flex-row mb-4">
                    <label className="text-[14px] text-[#0000009c] tracking-wider w-[130px]">
                      Estimated Offer:
                    </label>
                    <p className="text-[14px] text-black font-medium ">
                      {data?.status == "counteroffered"
                        ? "$ " + data.counterOffer
                        : data && data.counterOffer
                        ? "$ " + data.counterOffer
                        : ""}
                    </p>
                  </div>
                  <div className="col-span-6 flex flex-col lg:flex-row mb-4">
                    <label className="text-[14px] text-[#0000009c] tracking-wider w-[130px]">
                      Counter Offer:
                    </label>
                    <p className="text-[14px] text-black font-medium ">
                      {data?.status == "counteroffered"
                        ? "$ " + data.student_counteroffer
                        : data && data.counterOffer
                        ? "$ " + data.counterOffer
                        : ""}
                    </p>
                  </div>
             

                  <div className="col-span-6 flex flex-col lg:flex-row mb-4">
                    <label className="text-[14px] text-[#0000009c] tracking-wider  w-[130px]">
                      Created At :
                    </label>
                    <p className="text-[14px] text-black font-medium ">
                      {datepipeModel.date(data?.createdAt)}
                    </p>
                  </div>
                  <div className="col-span-6 flex flex-col lg:flex-row mb-4">
                    <label className="text-[14px] text-[#0000009c] tracking-wider  w-[130px]">
                      Requested By :
                    </label>
                    <p className="text-[14px] text-black font-medium ">
                      {data?.addedBy?.fullName}
                    </p>
                  </div>
                  <div className="col-span-6 flex flex-col lg:flex-row mb-4">
                    <label className="text-[14px] text-[#0000009c] tracking-wider  w-[130px]">
                      Status :
                    </label>
                    <p
                      className={`text-[14px] text-black font-medium  capitalize ${
                        data?.status ? data?.status : ""
                      }`}
                    >
                      {data?.status}
                    </p>
                  </div>
                  <div className="col-span-6 flex flex-col lg:flex-row mb-4">
                    <label className="text-[14px] text-[#0000009c] tracking-wider  w-[130px]">
                      Assignment :
                    </label>
                    <p
                      className={`text-[14px] text-black font-medium  capitalize `}
                    >
                      {data?.assignment_id?.title}
                    </p>
                  </div>
                  <div className="col-span-12 flex flex-col lg:flex-row mb-4">
                    <label className="text-[14px] text-[#0000009c] tracking-wider  w-[130px]">
                      Message :
                    </label>
                    <p className="text-[14px] text-black font-medium ">
                      {/* <MdOutlinePhone className="text-xl text-[#063688]" />+ */}
                      {data && data?.message}
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

export default CounterOfferDetails;
