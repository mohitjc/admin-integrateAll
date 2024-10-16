import React, { useEffect, useState } from "react";
import Layout from "../../components/global/layout";
import "./style.scss";
import { Tooltip } from "antd";
import Table from "../../components/Table";
import SelectDropdown from "../../components/common/SelectDropdown";
import statusModel from "../../models/status.model";
import shared from "./shared";
import { useSelector } from "react-redux";
import { PiEyeLight } from "react-icons/pi";
import { LiaEdit } from "react-icons/lia";
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
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
  loaging,
  data,
  changestatus,
  isAllow,
  total = { total },
}) => {
  const user = useSelector((state) => state.user);
  const columns = [
    {
      key: "title",
      name: "Title",
      sort: true,
      render: (row) => {
        return <span className="capitalize">{row?.title}</span>;
      },
    },
    {
      key: "slug",
      name: "Slug",
      sort: true,
      render: (row) => {
        return <span className="">{row?.slug}</span>;
      },
    },
    // {
    //   key: "status",
    //   name: "Status",
    //   render: (row) => {
    //     return (
    //       <>
    //         <div className="w-32" onClick={() => statusChange(row)}>
    //           <span
    //             className={`bg-[#1E5DBC] cursor-pointer text-sm !px-3 h-[30px] w-[100px] flex items-center justify-center border border-[#EBEBEB] text-[#3C3E49A3] !rounded capitalize 
    //                       ${
    //                         row.status == "deactive"
    //                           ? " bg-gray-200 text-black"
    //                           : "bg-[#1E5DBC] text-white"
    //                       }`}
    //           >
    //             {row.status == "deactive" ? "inactive" : "active"}
    //           </span>
    //         </div>
    //       </>
    //     );
    //   },
    // },
    {
      key: "action",
      name: "Actions",
      render: (itm) => {
        return (
          <>
            <div className="flex items-center justify-start gap-1.5">
              {isAllow(`read${shared.check}`) ? (
                <Tooltip placement="top" title="View">
                  <a
                    className="border cursor-pointer  hover:opacity-70 rounded-lg bg-[#1E5DBC14] w-10 h-10 !text-primary flex items-center justify-center text-lg"
                    onClick={(e) => view(itm.slug)}
                  >
                    <PiEyeLight />
                  </a>
                </Tooltip>
              ) : (
                <></>
              )}
              {isAllow(`edit${shared.check}`) ? (
              <Tooltip placement="top" title="Edit">
                <a
                  className="border cursor-pointer  hover:opacity-70 rounded-lg bg-[#1E5DBC14] w-10 h-10 !text-primary flex items-center justify-center text-lg"
                  onClick={(e) => edit(itm.slug)}
                >
                  <LiaEdit />
                </a>
              </Tooltip>
              ) : (
                <></>
              )}
              {/* {isAllow(`delete${shared.check}`) ? (  
              <Tooltip placement="top" title="Delete">
                {" "}
                <span
                  className="border cursor-pointer  hover:opacity-70 rounded-lg bg-[#1E5DBC14] w-10 h-10 !text-primary flex items-center justify-center text-lg"
                  onClick={() => deleteItem(itm.slug)}
                >
                  <LiaTrashAlt />
                </span>{" "}
              </Tooltip>):<></>} */}
            </div>
          </>
        );
      },
    },
  ];

  /*  const getGroups = () => {
    let f = {
      page: 1,
      count: 10,
    };
    ApiClient.get("api/group/list", f).then((res) => {
      if (res.success) {
        setGroup(res.data);
      }
    });
  };
 */
  //   useEffect(() => {
  //       getGroups()
  //   }, [])

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

        <div className="flex">
          {/* {isAllow(`add${shared.check}`) ? ( */}
          {/* <Link
            className="bg-primary leading-10 ms-3 h-10 flex items-center shadow-btn px-6 hover:opacity-80 text-sm text-white rounded-lg gap-2"
            to={`/${shared.url}/add`}
          >
            <FiPlus className="text-xl text-white" /> Add {shared.addTitle}
          </Link> */}
          {/* ) : (
            <></>
          )} */}
        </div>
      </div>

      <div className="shadow-box w-full p-4 bg-white rounded-lg mt-6">
        <div className="flex mb-3 p-4 items-center flex-wrap">
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
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-[#1E5DBC]block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500 pr-10"
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
              class="p-2.5 m-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-[#1E5DBC] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
            {/* <SelectDropdown
              id="statusDropdown"
              displayValue="name"
              placeholder="All Status"
              intialValue={filters.status}
              result={(e) => {
                changestatus(e.value);
              }}
              options={statusModel.list}
            /> */}
            {/* <SelectDropdown
                            id="statusDropdown"
                            displayValue="name"
                            placeholder='All Groups'
                            intialValue={filters.groupId}
                            theme="search"
                            result={e => filter({ groupId: e.value })}
                            options={groups}
                        /> */}
            {filters.status || filters.groupId ? (
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
              className=""
              data={data}
              columns={columns}
              page={filters.page}
              count={filters.count}
              total={total}
              result={(e) => {
                if (e.event == "page") pageChange(e.value);
                if (e.event == "sort") sorting(e.value);
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
