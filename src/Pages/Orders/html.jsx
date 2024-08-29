import React, { useEffect, useState } from "react";
import Layout from "../../components/global/layout";
import "./style.scss";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";
import { FiEdit3, FiPlus } from "react-icons/fi";
import { BsTrash3 } from "react-icons/bs";
import Table from "../../components/Table";
import SelectDropdown from "../../components/common/SelectDropdown";
import statusModel from "../../models/status.model";
import datepipeModel from "../../models/datepipemodel";
import shared from "./shared";
import Select from "react-select";
import ApiClient from "../../methods/api/apiClient";
import { useSelector } from "react-redux";
import methodModel from "../../methods/methods";
import { PiEyeLight } from "react-icons/pi";
import { LiaEdit, LiaTrashAlt } from "react-icons/lia";
import environment from "../../environment";
import { MdOutlinePublish } from "react-icons/md";
import { IoMdCopy } from "react-icons/io";
import { MdOutlineDownload } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import Pagination from "react-pagination-js";

import moment from "moment";
import DateRangePicker from "../../components/common/DateRangePicker";
import pipeModel from "../../models/pipeModel";
const Html = ({
  sorting,
  filter,
  edit,
  view,
  statusChange,
  pageChange,
  count,
  deleteItem,
  clear,
  filters,
  setFilter,
  data,
  isAllow,
  handleCopy,
  copySuccess,
  hanldeUserChange,
  selectId,
  total = { total },
}) => {
  const user = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoader] = useState(false);
  const [searchBy, setSearchBy] = useState("date");
  // const [filters, setFilters] = useState({startDate:'',endDate:''});

  const getUsersList = (search = "") => {
    const url = "orders/get/users";
    const parms = `Token=2f02f294-b57b-1783-2ef6-173f1fb628bb&limit=20&searchTerm=${search}`;
    const cookies = `&Cookie=heapSampling=0.7224022750841044; optimizelyEndUserId=oeu1720695541021r0.3829475046979349; gcl_au=1.1.56638464.1720695542; clAnalyticsId=7641554472643988; mkto_trk=id:215-EWB-051&token:_mch-clover.com-1720695542532-50641; tt_enable_cookie=1; ttp=cG_-4tgCi3JS3bBTI4mriKLMLSl; intercom-device-id-z49p7d1f=01b8ae76-e529-48c1-b544-7dac2cccebbc; ga=GA1.2.1388398470.1720680213; salesforcePartnerId=a077000000UioEH; evidon_suppress_notification_cookie={"date":"2024-07-11T10:59:28.301Z"}; fbp=fb.1.1720695587957.217241613850960703; intercom-id-z49p7d1f=004891ee-be51-43bd-bc09-e78eaa72d6a4; isCloverMerchant=true; mg=W8WV2BC4E2D3C|NQRCFW56ND65W|AGM687903RN4G|54WFXR0JWJ6R4|56JSK5YMR1JTW|1DANPV3T99JC6|K5ZSTKXWT23PE|SK88S16Q6HP6Y|1RM6MAR9KM1ZR|2N7CPRWGMC5W0|76NKQ28RCKS2G|54JXEW8K6RD7G|Z0SERP2SGT738|H91XYWCD7K922|964JW7XH9J238|WTNT2B7AXA25T|WEEC5MJCHWN32|F2GGW45TY4PBP|3Q32VKMVY0N8A|0YPAZ3PYT6N4R|SNQ9W7VG32JNG|12WRQW810Z5H0|22WJ340XSFHGY|5GJTJEWK7W082|72ZMBA6SC0QST|M7AAY85VE6E5C|G9QCV8QZVHZ02|ZW5S4N762ETK0|4J20MDT5FSWCY|CZTWSJM43PDPM|4Y30AWXP4PHCP|H4Y208ZKMK23J|V3BN06GQRRMCT|8SGDP1PZ8VNN4|Y9VY6RWP3NRNY|T2KRKC2V1N4ZA|0CCV9BPSCHEHR|7RPYDFM0ESF8C|CHGP8HDD12NQ6|QWSC9WAAQQPPA|V2YZ2C6Y4A59M|V58CBYF4HHPEC|9ERJZBZN9K6ET|8W86GESW5JP4C|TETCBFTZAPVS6|1QWN1395PXJ2M|1YMY5RA62ZKCM|DDVB5MMZJNV52|6B7KT61EHD12W|WJ5WB9JAZ6WTA|QQVYF2JSSPFDR|CC9QE1G9E4YHM|K33EKWHM9YHEG|7BCQYPT1AWXH8|2VVHAZ5ARRY3W|NTVWE5FFF0TCR|XHTGZ1TJ6DME6|8PTZPZJS6NDVW|W18NBY3JS54T4|XRX2SXPZ1PV6W|A9EVSGR2MXDC8|HEV8H2G0EGYTG|ZYX64T7ABXPAR|69PSKG8B0P5YY|AS76M9EER3Z0R|CB03ASTHJNP5G|1K3N6G626QZ30|2G089XP8DTXGG|X032Y268PA0SC|ZR835JBP9Z51W|SFKSDR7D949FE|XCZ5A6QD4C2Y6|GS4N5YYVQ84ZG|5KZDVRAXV032R|9XXMV1PTSNTXA|E0RYNBD6Z1VVR|AQXQ1H24396KE|YSBDBQNF38YJ6|EA404FCDBD3AC; rememberMe=3e8b1750423469a60c097c6e55547a62; isCloverMerchant=true; gaconnector_lc_content=; gaconnector_lc_medium=; gaconnector_fc_medium=; gaconnector_region=; gaconnector_GA_Client_ID=; gaconnector_fc_referrer=; gaconnector_lc_referrer=; gaconnector_fc_campaign=; gaconnector_lc_campaign=; gaconnector_all_traffic_sources=; gaconnector_fc_content=; gaconnector_fc_channel=; gaconnector_lc_channel=; clck=r0j778%7C2%7Cfnh%7C0%7C1653; intercom-session-z49p7d1f=; utag_main=v_id:0190a172511e004b15e64d6d70b005065001705d0086e$_sn:3$_ss:1$_st:1721043366139$_pn:1%3Bexp-session$ses_id:1721041566139%3Bexp-session; hp2_id.1285302910=%7B%22userId%22%3A%223429983775932588%22%2C%22pageviewId%22%3A%225475222746674479%22%2C%22sessionId%22%3A%222069023653461345%22%2C%22identity%22%3Anull%2C%22trackerVersion%22%3A%224.0%22%7D; rdt_uuid=1720695542207.3cefb786-de63-4fbd-ac11-86029ca3f6a0; uetvid=952cbdf03f7411ef89bfc787c86e2a9f; agentId=526970240887; ga_E0HY8L2X5Z=GS1.2.1721041566.3.0.1721041570.56.0.0; ga_G417SXG087=GS1.2.1721041566.3.0.1721041570.56.0.0; ga_SSTH1SLK31=GS1.2.1721041566.3.0.1721041570.0.0.0; ga_94KD9B9TBM=GS1.2.1721041566.3.0.1721041570.0.0.0; ga_8BNMS5TPY2=GS1.2.1721049057.3.1.1721050459.58.0.0; sessionContext={"id":"3WF2DDDRWZS41","type":"merchant"}; hp2_id.2538680622=%7B%22userId%22%3A%224634200528955785%22%2C%22pageviewId%22%3A%228237949139166292%22%2C%22sessionId%22%3A%225127658700072143%22%2C%22identity%22%3Anull%2C%22trackerVersion%22%3A%224.0%22%7D; gid=GA1.2.356368658.1721285414; hp2_ses_props.144423122=%7B%22ts%22%3A1721285414792%2C%22d%22%3A%22www.clover.com%22%2C%22h%22%3A%22%2Flogin%22%7D; sessionToken=494f8d9a-b3ca-46ba-b3e8-1f888f3724e0; gat=1; _hp2_id.144423122=%7B%22userId%22%3A%221683286691086799%22%2C%22pageviewId%22%3A%227850611896777889%22%2C%22sessionId%22%3A%221676480886441147%22%2C%22identity%22%3A%220817c4af4d9e6da942ea133d827d61056ce0f5606ccebd51d71084f831d16299%22%2C%22trackerVersion%22%3A%224.0%22%2C%22identityField%22%3Anull%2C%22isIdentified%22%3A1%2C%22oldIdentity%22%3Anull%7D`;
    if (!search) setLoader(true);
    ApiClient.get(url + "?" + parms).then((res) => {
      setLoader(false);
      if (res.success) {
        setUsers(
          res.data.elements?.map((item) => {
            return { value: item?.id, label: item?.primaryDisplay };
          })
        );
      }
    });
  };

  useEffect(() => {
    getUsersList();
  }, []);

  const columns = [
    {
      key: "title",
      name: "Title",
      sort: true,
      render: (row) => {
        return (
          <>
            <div className="w-32 cursor-pointer" onClick={() => view(row?.id)}>
              <Tooltip placement="top" title="View">
                <span className="capitalize">{row?.title || "N/A"} </span>
              </Tooltip>
            </div>
          </>
        );
      },
    },
    {
      key: "tags",
      name: "Tags",
      sort: true,
      render: (row) => {
        return <span className="capitalize">{row?.tags}</span>;
      },
    },
    {
      key: "category",
      name: "Category",
      render: (row) => {
        return <span className="capitalize">{row?.category_detail?.name}</span>;
      },
    },
    {
      key: "video",
      name: "Video",
      render: (row) => {
        return (
          <>
            <video
              src={`${environment.api}/${row?.video}`}
              width="130px"
              className="h-20 object-cover"
              controls
            />
          </>
        );
      },
    },
    {
      key: "publish date",
      name: "Publish Date",
      render: (row) => {
        return (
          <span className="capitalize">
            {row?.date ? moment(row?.date)?.format("YYYY-MM-DD") : "N/A"}
          </span>
        );
      },
    },
    {
      key: "status",
      name: "Status",
      render: (row) => {
        return (
          <>
            <div className="w-32" onClick={() => statusChange(row)}>
              <span
                className={`bg-[#063688] cursor-pointer text-sm !px-3 h-[30px] w-[100px] flex items-center justify-center border border-[#EBEBEB] text-[#3C3E49A3] !rounded capitalize 
                          ${
                            row.status == "deactive"
                              ? " bg-gray-200 text-black"
                              : "bg-[#063688] text-white"
                          }`}
              >
                {row.status == "deactive" ? "inactive" : "active"}
              </span>
            </div>
          </>
        );
      },
    },
    {
      key: "action",
      name: "Action",
      render: (itm) => {
        return (
          <>
            <div className="flex items-center justify-start gap-1.5">
              {isAllow(`edit${shared.check}`) ? (
                <Tooltip placement="top" title="Edit">
                  <a
                    className="border cursor-pointer  hover:opacity-70 rounded-lg bg-[#06368814] w-10 h-10 !text-primary flex items-center justify-center text-lg"
                    onClick={(e) => edit(itm.id)}
                  >
                    <LiaEdit />
                  </a>
                </Tooltip>
              ) : (
                <></>
              )}
              {isAllow(`delete${shared.check}`) ? (
                <Tooltip placement="top" title="Delete">
                  {" "}
                  <span
                    className="border cursor-pointer  hover:opacity-70 rounded-lg bg-[#06368814] w-10 h-10 !text-primary flex items-center justify-center text-lg "
                    onClick={() => deleteItem(itm.id)}
                  >
                    <LiaTrashAlt />
                  </span>{" "}
                </Tooltip>
              ) : (
                <></>
              )}
              {selectId === itm?.id && copySuccess ? (
                "Copied!"
              ) : (
                <Tooltip placement="top" title="copy link">
                  <a
                    className="border cursor-pointer  hover:opacity-70 rounded-lg bg-[#06368814] w-10 h-10 !text-primary flex items-center justify-center text-lg"
                    onClick={(e) =>
                      handleCopy(`${environment.api}${itm.video}`, itm?.id)
                    }
                  >
                    <IoMdCopy />
                  </a>
                </Tooltip>
              )}
            </div>
          </>
        );
      },
    },
  ];

  return (
    <Layout>
      <div className="flex flex-wrap justify-between items-center gap-y-4">
        <div>
          <h3 className="text-2xl font-semibold text-[#111827]">
            {" "}
            {shared.title}
          </h3>
          <p class="text-sm font-normal text-[#75757A]">
            Here you can see all about the {shared.title}
          </p>
        </div>

        <a id="downloadFile"></a>

        <div className="flex">
          {/* <button className="!px-2.5 text-[#3C3E49] text-sm font-normal py-2.5 flex items-center justify-center gap-2 bg-[#fff] rounded-lg shadow-btn hover:bg-[#F3F2F5] border border-[#D0D5DD] transition-all focus:ring-2 ring-[#F1F2F3] disabled:bg-[#F3F2F5] disabled:cursor-not-allowed mr-3" onClick={() => exportfun()}>
                        <PiFileCsv className="text-typo text-xl" />  Export CSV
                    </button> */}

          {isAllow(`add${shared.check}`) ? (
            <Link
              className="bg-primary leading-10 mr-3 h-10 flex items-center shadow-btn px-6 hover:opacity-80 text-sm text-white rounded-lg gap-2"
              to={`/${shared.url}/add`}
            >
              <FiPlus className="text-xl text-white" /> Add {shared.addTitle}
            </Link>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className="shadow-box w-full bg-white rounded-lg mt-6">
        <div className="flex p-4 items-end justify-end  flex-wrap gap-4">
          {/* <form
            class="flex items-center max-w-sm"
            onSubmit={(e) => {
              e.preventDefault();
              filter();
            }}
          >
            <label for="simple-search" class="sr-only">
              Search
            </label>
            <div class="relative w-full">
              <input
                type="text"
                id="simple-search"
                value={filters.search}
                onChange={(e) => {
                  setFilter({ ...filters, search: e.target.value });
                }}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-[#063688]block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500 pr-10"
                placeholder="Search"
                required
              />
              {filters?.search && (
                <i
                  className="fa fa-times absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
                  aria-hidden="true"
                  onClick={(e) => clear()}
                ></i>
              )}
            </div>
            <button
              type="submit"
              class="p-2.5 m-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-[#063688] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                class="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span class="sr-only">Search</span>
            </button>
          </form> */}

          <div className=" flex gap-6">
            <div className="mr-auto ">
            <label>Search By</label>
            <div className="flex gap-3 mt-2">
            <div class="flex items-center">
                  <input id="default-radio-1"   style={{ accentColor: "#063688" }} type="radio" value="user" checked={searchBy=='user'?true:false} onChange={e=>setSearchBy(e.target.value)} name="default-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 "/>
                  <label for="default-radio-1" class="ms-2 cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-300">User</label>
              </div>
              <div class="flex items-center">
                  <input id="default-radio-2"  style={{ accentColor: "#063688" }} type="radio" checked={searchBy=='date'?true:false} value="date" onChange={e=>setSearchBy(e.target.value)} name="default-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 "/>
                  <label for="default-radio-2" class="ms-2 text-sm cursor-pointer font-medium text-gray-900 dark:text-gray-300">Date</label>
              </div>
            </div>
            </div>
           

            {searchBy=='user'?<>
                <div className="">
                  <div className="">
                    <label>
                      By User {loading ? <span>Loading...</span> : <></>}
                    </label>
                  </div>
                  <Select
                    value={filters?.customerId || null}
                    onChange={(e) => hanldeUserChange(e)}
                    options={users}
                    onInputChange={(e) => {
                      console.log("onInputChange", e);
                      getUsersList(e);
                    }}
                    className="w-96"
                    placeholder="Select User"
                  />
                </div>
              </>
            : (
              <>
                <div>
                  <label>By Date</label>
                  <DateRangePicker
                    value={{
                      startDate: filters.startDate,
                      endDate: filters.endDate,
                    }}
                    onChange={(e) => {
                      filter({
                        startDate: datepipeModel.datetostring(e.startDate),
                        endDate: datepipeModel.datetostring(e.endDate),
                      });
                    }}
                  />
                </div>
              </>
            )}
            {/* {filters.search || filters.customerId ? (
              <>
                <button
                  className="bg-primary leading-10 h-10 inline-block shadow-btn px-6 hover:opacity-80 text-sm text-white rounded-lg"
                  onClick={() => clear()}
                >
                  Reset
                </button>
              </>
            ) : (
              <></>
            )} */}
          </div>
        </div>

        <>
          <div className="px-4">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left px-2 py-4">Order ID</th>
                    <th className="text-left px-2 py-4">Date</th>
                    <th className="text-left px-2 py-4">Name</th>
                    <th className="text-left px-2 py-4">Employee</th>
                    <th className="text-left px-2 py-4">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((_order) => {
                    return (
                      <tr>
                        <td className="w-[150px] px-2 py-4">{_order.id}</td>
                        <td className="w-[150px] px-2 py-4">
                          {moment(_order?.createdTime).format("LL")}
                        </td>
                        <td className="w-[400px] px-2 py-4">
                          <div className="flex gap-1 flex-wrap">
                            {_order?.lineItems?.elements.map((itm) => {
                              return (
                                <span className="inline-block px-[10px] py-[3px] text-white rounded bg-[#f7665c] text-[12px]">
                                  {itm?.name} || ${pipeModel.number(itm.price)}
                                </span>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-2 py-4">
                          {_order?.employee?.name || "--"}
                        </td>
                        <td className="px-2 py-4">
                          ${pipeModel.number(_order?.total)}
                        </td>
                      </tr>
                    );
                    // return (
                    //   <>
                    //     {_order?.lineItems?.elements.map((itm) => {
                    //       return (
                    //         <>
                    //           <tr>
                    //             <td>{moment(itm?.createdTime).format("LL")}</td>
                    //             <td>{itm?.name}</td>
                    //             <td>{_order?.employee?.name || "--"}</td>
                    //             <td>${itm?.price}</td>
                    //           </tr>
                    //         </>
                    //       );
                    //     })}
                    //   </>
                    // );
                  })}
                </tbody>
              </table>
            </div>

            {total > filters.count ? (
              <div className="paginationWrapper  mt-15">
                <Pagination
                  currentPage={filters.page}
                  totalSize={total}
                  sizePerPage={filters.count}
                  changeCurrentPage={pageChange}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        </>
      </div>
    </Layout>
  );
};

export default Html;
