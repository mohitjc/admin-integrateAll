import Layout from "../../components/global/layout";
import "./style.scss";
import { Link, useNavigate } from "react-router-dom";
import { Tooltip } from "antd";
import { FiPlus } from "react-icons/fi";
import Table from "../../components/Table";
import SelectDropdown from "../../components/common/SelectDropdown";
import shared from "./shared";
import { useSelector } from "react-redux";
import { PiEyeLight } from "react-icons/pi";

import { IoChatboxOutline } from "react-icons/io5";

import moment from "moment";
import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import { RxRotateCounterClockwise } from "react-icons/rx";
const Html = ({
  staff,
  counterOffer,
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
  loaging,
  data,
  changestatus,
  isAllow,
  viewQuote,
  setcompleteModalModal,
  status,
  total = { total },
  sortClass,
  getWordPrice,
  setcompleteData,
  setDoc
}) => {
  const user = useSelector((state) => state.user);
  const history=useNavigate()

  const chat=(itm)=>{
    history(`/chat?assignment_id=${itm.id}&role=user`)
  }

  const Staffchat=(itm)=>{
    history(`/chat?assignment_id=${itm.id}&role=staff`)
  }


  const columns = [
    {
      key: "fullName",
      name: "Title",
      sort: true,
      render: (row) => {
        return <span className="capitalize ellipses">{row?.title}</span>;
      },
    },
    {
      key: "dueDate",
      name: "Due date ",
      sort: true,
      render: (row) => {
        return (
          <span className="">{moment(row?.dueDate).format("DD-MM-YYYY")}</span>
        );
      },
    },
    {
      key: "word_count",
      name: "Word Count",
      sort: true,
      render: (row) => {
        return <span className="capitalize ellipses">{row?.word_count}</span>;
      },
    },
    {
      key: "price",
      name: "Estimate Price",
      sort: true,
      render: (row) => {
        return (
          <span className="capitalize ellipses">
            ${getWordPrice(row?.word_count)}
          </span>
        );
      },
    },
    {
      key: "staff",
      name: "Staff",
      render: (row) => {
        return (
          <span className="capitalize ellipses">
            {row?.staffDetail?.fullName || "--"}
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
            <span className={`capitalize ${row?.status}`}>{row?.status}</span>
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
      key: "action",
      name: "Action",
      render: (itm) => {
        return (
          <>
            <div className="flex items-center justify-start gap-1.5">
              {isAllow(`read${shared.check}`) ? (
                <Tooltip placement="top" title="View">
                  <a
                    className="border cursor-pointer  hover:opacity-70 rounded-lg bg-[#06368814] w-10 h-10 !text-primary flex items-center justify-center text-lg"
                    onClick={(e) => view(itm.id)}
                  >
                    <PiEyeLight />
                  </a>
                </Tooltip>
              ) : (
                <></>
              )}
              {/* {itm.counterOfferId ? (
                <>
                  <Tooltip placement="top" title="View Quote">
                    <span
                      className="border cursor-pointer  hover:opacity-70 rounded-lg bg-[#06368814] w-10 h-10 !text-primary flex items-center justify-center text-lg"
                      onClick={() => viewQuote(itm.counterOfferId)}
                    >
                      <RxRotateCounterClockwise className="text-inherit shrink-0 text-lg" />
                    </span>
                  </Tooltip>
                </>
              ) : (
                <></>
              )} */}

              {/* {(itm.status == "accepted" || itm.status == "completed") &&
              user?.role != "staff" &&
              (itm?.counterOfferStatus == "not_accepted" ||
                itm?.counterOfferStatus == "not_given") ? (
                <>
                </>
              ) : (
                <>

                 
                </>
              )} */}
              {(user?.role == "staff" ) ? (
                <>
                  <Tooltip placement="top" title="Complete Assignment">
                    <a
                      className="border cursor-pointer  hover:opacity-70 rounded-lg bg-[#06368814] w-10 h-10 !text-primary flex items-center justify-center text-lg"
                      onClick={(e) =>{
                        setcompleteData(itm);
                        setcompleteModalModal(true);
                        setDoc('')
                        // statusChange("completed", itm, "Complete")
                      }}
                    >
                      <span class="material-symbols-outlined">check</span>
                    </a>
                  </Tooltip>
                </>
              ) : (
                <></>
              )}

              {(itm.status != 'pending' && user?.role != "staff") ? <>
                <Tooltip placement="top" title="Chat with student">
                  <a
                    className="relative border cursor-pointer hover:opacity-70 rounded-lg bg-[#06368814] w-10 h-10 !text-primary flex items-center justify-center text-lg"
                    onClick={(e) => chat(itm)}
                  >
                    <span class="material-symbols-outlined">chat</span>
                    {itm?.unreadMessagesCount != 0 && <span class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {itm?.unreadMessagesCount}
                    </span>}
                  </a>
                </Tooltip>
              </> : <></>}

              {(itm.status != 'pending' && itm?.staffDetail?.fullName) ? <>
                <Tooltip placement="top" title={user?.role == "staff" ?  "Chat with admin" : "Chat with staff"}>
                  <a
                    className="relative border cursor-pointer hover:opacity-70 rounded-lg bg-[#06368814] w-10 h-10 !text-primary flex items-center justify-center text-lg"
                    onClick={(e) => Staffchat(itm)}
                  >
                    <span class="material-symbols-outlined">chat</span>
                    {itm?.unreadMessagesCountForStaff != 0 && <span class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {itm?.unreadMessagesCountForStaff}
                    </span>}
                  </a>
                </Tooltip>
              </> : <></>}
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
            Here you can see all about your {shared.title}
          </p>
        </div>

        <a id="downloadFile"></a>
        {/* <div className="flex">
      

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
        </div> */}
      </div>

      <div className="shadow-box w-full bg-white rounded-lg mt-6">
        <div className="flex p-4 items-center flex-wrap">
          <form
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
              {/* <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"/>
                                </svg>
                            </div> */}
              <input
                type="text"
                id="simple-search"
                value={filters.search}
                onChange={(e) => {
                  setFilter({ ...filters, search: e.target.value });
                }}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-[#063688]block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500 pr-10"
                placeholder="Search"
                // required
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
          </form>

          <div className="flex gap-2 ml-auto">
            <SelectDropdown
              id="statusDropdown"
              displayValue="name"
              placeholder="All Status"
              intialValue={filters.status}
              result={(e) => {
                changestatus(e.value);
              }}
              options={shared.status}
            />
            {filters.status ? (
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
            )}
          </div>
        </div>

        {!loaging ? (
          <>
            <div className="px-4 pb-4">
              <Table
                className="mb-3"
                data={data}
                columns={
                  user?.role == "admin"
                    ? columns
                    : columns?.filter((itm) => itm?.key != "staff")
                }
                page={filters.page}
                count={filters.count}
                filters={filters}
                total={total}
                result={(e) => {
                  if (e.event == "page") pageChange(e.value);
                  if (e.event == "sort") {
                    sorting(e.value);
                    sortClass(e.value);
                  }
                  if (e.event == "count") count(e.value);
                }}
              />
            </div>
          </>
        ) : (
          <></>
        )}

        {loaging ? (
          <div className="text-center py-4">
            <img src="/assets/img/loader.gif" className="pageLoader" />
          </div>
        ) : (
          <></>
        )}
      </div>
    </Layout>
  );
};

export default Html;
