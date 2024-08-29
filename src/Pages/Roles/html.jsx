import React from "react";
import Layout from "../../components/global/layout";
import Pagination from "react-pagination-js";
import "./style.scss";
import { Link } from "react-router-dom";
import environment from "../../environment";
import { Tooltip } from "antd";
import { HiOutlineArrowDown } from "react-icons/hi";
import { BsTrash3 } from "react-icons/bs";
import { FiEdit3, FiPlus } from "react-icons/fi";
import SelectDropdown from "../../components/common/SelectDropdown";
import statusModel from "../../models/status.model";
import { PiEyeLight } from "react-icons/pi";
import { LiaEdit, LiaTrashAlt } from "react-icons/lia";
const Html = ({
  clear,
  sortClass,
  sorting,
  view,
  edit,
  reset,
  add,
  colClick,
  tab,
  tabChange,
  ChangeRole,
  dynamicStyle = false,
  className = null,
  ChangeStatus,
  openModal,
  statusChange,
  pageChange,
  addCol,
  deleteItem,
  exportCsv,
  uTableCols,
  removeCol,
  filters,
  tableCols,
  blockunblock,
  loaging,
  data,
  exportfun,
  roles,
  role,
  isAllow,
  total = { total },
}) => {
  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-semibold text-[#111827]"> Roles</h3>
          <p className="text-sm font-normal text-[#75757A]">
            Here you can see all about your Roles
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* {isAllow("addRoles") ? (
            <Link
              className="bg-primary leading-10 h-10 flex items-center shadow-btn px-6 hover:opacity-80 text-sm text-white rounded-lg gap-2"
              to="/roles/add"
            >
              <FiPlus className="text-xl text-white" /> Add Role
            </Link>
          ) : (
            <></>
          )} */}

          <SelectDropdown
            id="statusDropdown"
            displayValue="name"
            placeholder="All Status"
            intialValue={filters.status}
            result={(e) => {
              ChangeStatus(e.value);
            }}
            options={statusModel.list}
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

      {tab == "grid" ? (
        <></>
      ) : (
        <>
          <div className="shadow-box w-full bg-white rounded-lg">
            <div className="scrollbar w-full overflow-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 capitalize bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr className="">
                    <th
                      scope="col"
                      className="px-2 py-4"
                      onClick={(e) => sorting("name")}
                    >
                      Role Name{" "}
                      <span className="ml-1">
                        <HiOutlineArrowDown className="shrink-0 inline text-sm" />
                      </span>
                    </th>
                    <th scope="col" className="px-2 py-4">
                      Status
                    </th>
                    <th scope="col" className="px-2 py-4">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!loaging &&
                    data &&
                    data.map((itm, i) => {
                      if (
                        itm.id != environment.adminRoleId &&
                        itm.id != environment.userRoleId
                      )
                        return (
                          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-2 py-4">{itm.name}</td>
                            <td className="px-2 py-4">
                              <div
                                className="w-32"
                                onClick={() => statusChange(itm)}
                              >
                                <span
                                  className={`bg-[#063688] cursor-pointer text-sm !px-3 h-[30px] w-[100px] flex items-center justify-center border border-[#EBEBEB] text-[#3C3E49A3] !rounded capitalize 
                          ${
                            itm.status == "deactive"
                              ? " bg-gray-200 text-black"
                              : "bg-[#063688] text-white"
                          }`}
                                >
                                  {itm.status == "deactive"
                                    ? "inactive"
                                    : "active"}
                                </span>
                              </div>
                            </td>

                            {/* dropdown */}
                            <td className="px-2 py-4">
                              <div className="flex items-center justify-start gap-1.5">
                                {isAllow(`editRoles`) && itm.name == "Staff" ? (
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
                                {/* {itm.id != environment.adminRoleId &&
                                itm.id != environment.userRoleId &&
                                isAllow("deleteRoles") ? (
                                  <>
                                    <Tooltip placement="top" title="Delete">
                                      <span
                                        className="border cursor-pointer  hover:opacity-70 rounded-lg bg-[#06368814] w-10 h-10 !text-primary flex items-center justify-center text-lg "
                                        onClick={() => deleteItem(itm.id)}
                                      >
                                        <LiaTrashAlt />
                                      </span>
                                    </Tooltip>
                                  </>
                                ) : (
                                  <></>
                                )} */}
                              </div>
                            </td>

                            {/* end */}
                          </tr>
                        );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!loaging && total == 0 ? (
        <div className="py-3 text-center">No Data</div>
      ) : (
        <></>
      )}

      {!loaging && total > filters.count ? (
        <div className="paginationWrapper  mt-15 ">
          {/* <span className='text-sm text-gray-600'>Show {filters.count} from {total} Categories</span> */}
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

      {loaging ? (
        <div className="text-center py-4">
          <img src="/assets/img/loader.gif" className="pageLoader" />
        </div>
      ) : (
        <></>
      )}
    </Layout>
  );
};

export default Html;
