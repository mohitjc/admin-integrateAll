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
import Table from "../../components/Table";
import methodModel from "../../methods/methods";
import Swal from "sweetalert2";
import FormControl from "../../components/common/FormControl";
import Modal from "../../components/common/Modal";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";
import { MdCancel } from "react-icons/md";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { RxRotateCounterClockwise } from "react-icons/rx";

const View = () => {
  const user = useSelector((state) => state.user);
  const [filters, setFilter] = useState({ page: 1, count: 10, search: "" });
  const [total, setTotal] = useState(0);
  const [data, setData] = useState();
  const [counterOfferData, setcounterOfferData] = useState();
  const [counterModal, setCounterModal] = useState(false);
  const [counterForm, setCounterForm] = useState({
    counterOffer: "",
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
    ApiClient.get(shared.detailApi, { id: id }).then((res) => {
      loader(false);
      if (res.success) {
        setData(res.data);
      }
    });
  };
  const getConterOffers = (p = {}) => {
    let payload = { ...filters, ...p };
    loader(true);
    ApiClient.get(shared.counterListApi, { ...payload }).then((res) => {
      loader(false);
      if (res.success) {
        setcounterOfferData(res.data);
        setTotal(res?.total);
      }
    });
  };

  useEffect(() => {
    getDetail();
    getConterOffers({ assignment_id: id });
    getWordEstimate();
  }, []);

  const getData = () => {
    getDetail();
    getConterOffers({ assignment_id: id });
  };

  const getWordPrice = (word = 0) => {
    return shared.getWordPrice(word, estimates);
  };

  const columns = [
    {
      key: "message",
      name: "Message",
      render: (row) => {
        return (
          <Tooltip placement="top" title={row?.message}>
            <span className="capitalize" title="">
              {row?.message ? row?.message?.slice(0, 30) : "--"}
            </span>
          </Tooltip>
        );
      },
    },
    {
      key: "price",
      name: "Price ",
      render: (row) => {
        return <span className="">$ {row?.counterOffer || "--"}</span>;
      },
    },
    {
      key: "status",
      name: "Status",
      render: (row) => {
        return (
          <>
            <span className={`capitalize ${row?.status ? row.status : ""}`}>
              {row?.status}
            </span>
            {/* <SelectDropdown
              id="statusDropdown"
              displayValue="name"
              placeholder="All Status"
              intialValue={row?.status}
              result={(e) => {
                statusChange(e.value,row);
              }}
              options={statusModel.status}
            /> */}
          </>
        );
      },
    },
    {
      key: "createdAt",
      name: "Created At",
      render: (itm) => {
        return (
          <>
            <span>{moment(itm?.createdAt).format("DD-MM-YYYY")}</span>
          </>
        );
      },
    },
  ];

  const pageChange = (e) => {
    setFilter({ ...filters, page: e });
    getConterOffers({ page: e });
  };

  const statusChange = (status) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to Reject this assignment ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#063688",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        loader(true);
        ApiClient.put(`${shared.editApi}?id=${id}`, { status }).then((res) => {
          if (res.success) {
            getData();
          }
          loader(false);
        });
      }
    });
  };

  const counterOffer = (status, id) => {
    if (status == "accepted") {
      let price = getWordPrice(data.word_count);
      setCounterForm({
        counterOffer: price,
        estimate_price: price,
        assignment_id: id || data?.id,
        message: "",
      });
      setCounterModal(true);
    }
  };

  const counterSubmit = () => {
    let payload = { ...counterForm };
    delete payload.estimate_price;
    loader(true);
    ApiClient.post(`counter-offer/create`, payload).then((res) => {
      loader(false);
      if (res?.success) {
        setCounterModal(false);
        getData();
      }
    });
  };

  return (
    <>
      <Layout>
        <div className="wrapper_section">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Tooltip placement="top" title="Back">
                <span
                  onClick={() => history(-1)}
                  className="!px-4  py-2 cursor-pointer flex items-center justify-center  rounded-lg shadow-btn hover:bg-[#F3F2F5] border transition-all  mr-3"
                >
                  <i className="fa fa-angle-left text-lg"></i>
                </span>
              </Tooltip>
              <h3 className="text-lg lg:text-2xl font-semibold text-[#111827]">
                {shared.addTitle} Details
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <div className="  shadow-box overflow-hidden rounded-lg bg-white  gap-4 shrink-0 mb-5 capitalize">
                <div className="p-4 bg-[#0636881a] flex items-center justify-between">
                  <h4 className=" font-medium">Basic Information</h4>
                  <div>
                    {data?.status == "pending" ? (
                      <div className="flex gap-4">
                        <a
                          className="border border-tranparent cursor-pointer  hover:opacity-70 rounded-lg bg-[#06378b] text-white p-2 !text-primary flex items-center justify-center text-[14px]"
                          onClick={(e) => counterOffer("accepted", id)}
                        >
                          <IoIosCheckmarkCircleOutline className="w-5 h-5" />

                          <p className="ms-1">Accept</p>
                        </a>
                        <a
                          className="border border-[#06378b] cursor-pointer  hover:opacity-70 rounded-lg bg-transparent  p-2 !text-primary flex items-center justify-center text-[14px] text-[#06378b]"
                          onClick={(e) => statusChange("rejected")}
                        >
                          <RxCrossCircled className="w-5 h-5" />

                          <p className="ms-1">Reject</p>
                        </a>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-12 p-4">
                  <div className="col-span-6 flex items-center mb-3">
                    <label className="text-[14px] text-[#0000009c] tracking-wider w-[130px]">
                      Title:
                    </label>
                    <p className="text-[14px] text-black font-medium ms-3">
                      {" "}
                      {/* <LiaUserSolid className="text-xl text-[#063688]" /> */}
                      {data && data.title}
                    </p>
                  </div>

                  <div className="col-span-6 flex items-center mb-3">
                    <label className="text-[14px] text-[#0000009c] tracking-wider  w-[130px]">
                      Due Date :
                    </label>
                    <p className="text-[14px] text-black font-medium ms-3">
                      {/* <MdOutlinePhone className="text-xl text-[#063688]" />+ */}
                      {moment(data?.dueDate).format("DD-MM-YYYY") || "--"}
                    </p>
                  </div>
                  <div className="col-span-6 flex items-center mb-3">
                    <label className="text-[14px] text-[#0000009c] tracking-wider  w-[130px]">
                      Status :
                    </label>
                    <p
                      className={`${data?.status} text-[14px] text-black font-medium ms-3`}
                    >
                      {/* <MdOutlinePhone className="text-xl text-[#063688]" />+ */}
                      {data?.status || "--"}
                    </p>
                  </div>
                  <div className="col-span-12 flex items-center mb-3">
                    <label className="text-[14px] text-[#0000009c] tracking-wider  w-[130px]">
                      Description:
                    </label>
                    <p
                      dangerouslySetInnerHTML={{ __html: data?.description }}
                      className="text-[14px] text-black font-medium ms-3 desc-text w-[85%]"
                    ></p>
                  </div>
                  {data?.url ? (
                    <div className="col-span-6 flex flex-col lg:flex-row mb-4">
                      <label className="text-[14px] text-[#0000009c] tracking-wider  w-[130px]">
                        Document :
                      </label>

                      <a
                        className="relative w-[50px] h-[50px]"
                        target="_new"
                        href={methodModel.noImg(data?.url, "document")}
                      >
                        <i
                          class="fa fa-download absolute right-0 bottom-0 bg-[#06378b] text-white p-2 text-[8px] rounded-[50px]"
                          aria-hidden="true"
                        ></i>

                        <span class="material-symbols-outlined text-[50px]">
                          draft
                        </span>
                      </a>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>

          {data?.staff ? (
            <>
              <div className="grid grid-cols-12 gap-6 mb-5">
                <div className="col-span-12">
                  <div className="  shadow-box overflow-hidden rounded-lg bg-white  gap-4 shrink-0 ">
                    <div>
                      <h4 className="p-4 bg-[#0636881a] font-medium">
                        Staff Details
                      </h4>
                    </div>
                    <div className="grid grid-cols-12 p-4">
                      <div className="col-span-6 flex items-center mb-3">
                        <label className="text-[14px] text-[#0000009c] tracking-wider w-[130px]">
                          Name:
                        </label>
                        <p className="text-[14px] text-black font-medium ms-3">
                          {(data && data.staff?.fullName) || "--"}
                        </p>
                      </div>
                      <div className="col-span-6 flex items-center mb-3">
                        <label className="text-[14px] text-[#0000009c] tracking-wider w-[130px]">
                          Email:
                        </label>
                        <p className="text-[14px] text-black font-medium ms-3">
                          {(data && data.staff?.email) || "--"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}

          {total ? (
            <>
              <div>
                <h4 className="p-4 bg-[#0636881a] font-medium">
                  Counter Offers
                </h4>
                <div className="ml-auto flex gap-2">
                  {counterOfferData?.status == "counteroffered" ? (
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
              <Table
                className="mb-3"
                data={counterOfferData}
                columns={columns}
                page={filters.page}
                count={filters.count}
                filters={filters}
                total={total}
                result={(e) => {
                  if (e.event == "page") pageChange(e.value);
                  // if (e.event == "sort") {
                  //   sorting(e.value);
                  //   sortClass(e.value);
                  // }
                }}
              />
            </>
          ) : (
            <></>
          )}
        </div>
      </Layout>
      {counterModal ? (
        <>
          <Modal
            title="Counter Offer"
            result={(e) => {
              setCounterModal(false);
            }}
            body={
              <>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    counterSubmit();
                  }}
                >
                  <div>
                    <div className="bg-[#00358512] rounded-[8px]  max-w-[200px] p-3 mx-auto text-center">
                      <div className="mx-auto w-14 h-14 bg-white text-[#003585] rounded-[50px] flex items-center justify-center shadow">
                        <img
                          src="/assets/img/price.svg"
                          className="mx-auto w-10 h-10 p-2 	flex items-center justify-center "
                          alt=""
                        />
                      </div>
                      <h4 className="text-[16px] font-[600] my-3">
                        Estimated Price{" "}
                      </h4>
                      <span>${counterForm.estimate_price}</span>
                    </div>
                    {/* <div>Estimate Price: ${counterForm.estimate_price}</div> */}
                    <div className="mb-4">
                      <FormControl
                        type="number"
                        label="Amount"
                        value={counterForm.counterOffer}
                        maxlength="10"
                        onChange={(e) => {
                          setCounterForm({
                            ...counterForm,
                            counterOffer: Number(e),
                          });
                        }}
                        required={true}
                      />
                    </div>
                    <FormControl
                      type="textarea"
                      label="Message"
                      value={counterForm.message || ""}
                      onChange={(e) => {
                        setCounterForm({ ...counterForm, message: e });
                      }}
                      required={true}
                    />
                  </div>
                  <div className="mt-3 text-right">
                    <button className="btn btn-primary">Send Quotation</button>
                  </div>
                </form>
              </>
            }
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default View;
