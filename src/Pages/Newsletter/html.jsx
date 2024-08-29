import React, { useEffect, useState } from "react";
import Layout from "../../components/global/layout";
// import "./style.scss";
import { Tooltip } from "antd";
import Table from "../../components/Table";

import shared from "./shared";
import { useSelector } from "react-redux";


import moment from "moment";
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
      key: "email",
      name: "Email",
      sort: true,
      render: (row) => {
        return <span >{row?.email}</span>;
      },
    },
    {
        key: "createdAt",
        name: "Subscribed At",
        // sort: true,
        render: (row) => {
          return <span className="capitalize">{moment(row?.createdAt).format("DD-MM-YYYY")}</span>;
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
          </form>

       
        </div>

        {!loaging ? (
          <>
          <div className="px-4 pb-4">
          <Table
              className="mb-3"
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
