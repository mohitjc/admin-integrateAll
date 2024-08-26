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

const View = () => {
  const user = useSelector((state) => state.user);
  const [filters, setFilter] = useState({ page: 1, count: 10, search: "" });
  const [total, setTotal] = useState(0);
  const [data, setData] = useState();
  const [counterOfferData, setcounterOfferData] = useState();

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
  const getConterOffers = (p={}) => {
    let payload={...filters,...p}
    loader(true);
    ApiClient.get(shared.counterListApi, { ...payload }).then((res) => {
      loader(false);
      if (res.success) {
        setcounterOfferData(res.data);
        setTotal(res?.total)
      }
    });
  };

  useEffect(() => {
    getDetail();
    getConterOffers({assignment_id:id});
  }, []);

  const statusChange=()=>{

  }

  const getData=()=>{

  }

  const columns = [
    {
      key: "message",
      name: "Message",
      render: (row) => {
        return <Tooltip placement="top" title={row?.message}><span className="capitalize" title="">{row?.message?row?.message?.slice(0,30):'--'}</span></Tooltip>
      },
    },
    {
      key: "price",
      name: "Price ",
      render: (row) => {
        return (
          <span className="">$ {row?.counterOffer||'--'}</span>
        );
      },
    },
    {
      key: "status",
      name: "Status",
      render: (row) => {
        return (
          <> 
<span className={`capitalize ${row?.status?row.status:''}`}>{row?.status}</span>
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
            <span>{moment(itm?.createdAt).format('DD-MM-YYYY')}</span>
          </>
        );
      },
    },
  ];

  const pageChange = (e) => {
    setFilter({ ...filters, page: e });
    getConterOffers({ page: e });
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
            <div>
              <h3 className="text-lg lg:text-2xl font-semibold text-[#111827]">
                {shared.addTitle} Details
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <div className="  shadow-box overflow-hidden rounded-lg bg-white  gap-4 shrink-0 mb-5 capitalize">
              <div>
                  <h4 className="p-4 bg-[#0636881a] font-medium">Basic Information</h4>
                </div>
               <div className="grid grid-cols-12 p-4">
               <div className="col-span-6 flex items-center mb-3">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 ">Title:</label>
                  <p className="text-[14px] text-black font-medium">
                    {" "}
                    {/* <LiaUserSolid className="text-xl text-[#063688]" /> */}
                    {data && data.title}
                  </p>
                </div>
                

                  <div className="col-span-6 flex items-center mb-3">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1  ">Due Date :</label>
                   <p className="text-[14px] text-black font-medium">
                    {/* <MdOutlinePhone className="text-xl text-[#063688]" />+ */}
                    {moment(data?.dueDate).format("DD-MM-YYYY") || "--"}
                  </p>
                </div>
                <div className="col-span-6 flex items-center mb-3">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1  ">Status :</label>
                   <p className="text-[14px] text-black font-medium width-fit">
                    {/* <MdOutlinePhone className="text-xl text-[#063688]" />+ */}
                    {data?.status|| "--"}
                  </p>
                </div>
                <div className="col-span-12 flex items-center mb-3">
                   <label className="text-[14px] text-[#0000009c] tracking-wider mb-1  ">Description:</label>
                   <p  dangerouslySetInnerHTML={{__html: data?.description}} className="text-[14px] text-black font-medium desc-text"></p>
                </div>
               </div>
              </div>
             
            </div>
           
          </div>
         
            <div className="grid grid-cols-12 gap-6 mb-5">
            <div className="col-span-12">
              <div className="  shadow-box overflow-hidden rounded-lg bg-white  gap-4 shrink-0 ">
              <div>
                  <h4 className="p-4 bg-[#0636881a] font-medium">Staff Details</h4>
                </div>
               <div className="grid grid-cols-12 p-4">
               <div className="col-span-6 flex items-center mb-3">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 ">Name:</label>
                  <p className="text-[14px] text-black font-medium"> 
                    {data && data.staff?.fullName || "--"}
                  </p>
                </div>         
                <div className="col-span-6 flex items-center mb-3">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 ">Email:</label>
                  <p className="text-[14px] text-black font-medium"> 
                    {data && data.staff?.email ||"--"}
                  </p>
                </div>
                
               
               </div>
              </div>
             
            </div>
           
          </div>

              <div>
                  <h4 className="p-4 bg-[#0636881a] font-medium">Counter Offers</h4>
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
        </div>
      </Layout>
    </>
  );
};

export default View;
