import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/global/layout";
import { useEffect, useState } from "react";
import datepipeModel from "../../models/datepipemodel";
import ApiClient from "../../methods/api/apiClient";
import { useParams } from "react-router-dom";
import shared from "./shared";
import loader from "../../methods/loader";
import { Tooltip } from "antd";
import questionsKeys from "../Profile/questions";
import { useSelector } from "react-redux";
import { LiaUserSolid } from "react-icons/lia";
import { MdOutlineEmail, MdOutlinePhone } from "react-icons/md";
import methodModel from "../../methods/methods";
import { GrUserSettings } from "react-icons/gr";
import { rolePermission, rolePermissions } from "../../models/type.model";

const View = () => {
  const user = useSelector((state) => state.user);

  const [data, setData] = useState();
  const [questions, setQuestions] = useState([]);

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

  const permissions = rolePermissions;
  const permission = rolePermission;

  const isAllChecked = () => {
    let value = true;
    if(!data?.permissions) return
    let permissions = data?.permissions;
    Object.keys(permissions).map((itm) => {
      if (!permissions[itm]) value = false;
    });
    return value;
  };

  const isAllPCheck = (key = "read") => {
    let value = true;
    permissions.map((itm) => {
      if (!data?.permissions[`${key}${itm.key}`]) value = false;
    });
    return value;
  };

  const isCheckAll = (key) => {
    let value = true;
    permission.map((itm) => {
      if (!data?.permissions[`${itm.key}${key}`]) value = false;
    });
    return value;
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
                className="!px-4  py-2 cursor-pointer flex items-center justify-center  rounded-lg shadow-btn hover:bg-[#F3F2F5] border transition-all  mr-3 bg-[#1E5DBC] text-white hover:text-black"
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
              <h4 className="p-4 border-b  font-medium rounded-[5px] rounded-bl-[0] rounded-br-[0] flex items-center text-[#1E5DBC] ">
                  <img src ="/assets/img/usero-blue.svg" className="me-3 bg-[#e9f0f8] p-2 rounded-md"/>
                Basic Information
              </h4>
            </div>
               <div className="grid grid-cols-12 p-4">
               <div className="col-span-6 flex flex-col mb-5">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1 ">Name:</label>
                  <p className="text-[14px] text-black font-medium capitalize">
                    {" "}
                    {/* <LiaUserSolid className="text-xl text-[#1E5DBC]" /> */}
                    {data && data.fullName}
                  </p>
                </div>
                  <div className="col-span-6 flex flex-col mb-5">
                   <label className="text-[14px] text-[#0000009c] tracking-wider mb-1  ">Email:</label>
                   <p className="text-[14px] text-black font-medium">
                    {/* <MdOutlineEmail className="text-xl text-[#1E5DBC]" /> */}
                    {data && data.email}
                  </p>
                </div>

                  <div className="col-span-6 flex flex-col mb-5">
                  <label className="text-[14px] text-[#0000009c] tracking-wider mb-1  ">Mobile Number:</label>
                   <p className="text-[14px] text-black font-medium">
                    {/* <MdOutlinePhone className="text-xl text-[#1E5DBC]" />+ */}
                    {data?.mobileNo || "--"}
                  </p>
                </div>
               </div>
              </div>
             
            </div>
           <div className="col-span-12">
           {/* <div className="shadow-box w-full bg-white rounded-lg mb-6">
                <div className="scrollbar w-full overflow-auto">
                  <div class="table_section tablepadding w-full">
                    <p className="text-xl font-semibold text-[#111827] px-4 pb-3 pt-3">
                      Permissions
                    </p>
                    <table class="w-full">
                      <thead class="table_head roleTable">
                        <tr class="border-b border-[#EAECF0]">
                          <th
                            scope="col"
                            class="cursor-pointer text-[#82838B] !border-l-0 font-normal text-sm !border border-[#EAECF0] px-4 text-left bg-[#F7FAFF] !py-3 ' onClick={e => sorting('name')}"
                          ></th>
                          <th
                            scope="col"
                            class="cursor-pointer text-[#82838B] !border-l-0 font-normal text-sm !border border-[#EAECF0] px-4 text-left bg-[#F7FAFF] !py-3 ' onClick={e => sorting('name')}"
                          >
                            <input
                              type="checkbox"
                              checked={isAllChecked()}
                              className="h-4 w-4"
                            />
                              <span className="ms-2"> All</span>
                          </th>
                          {permission.map((itm) => {
                            return (
                              <>
                                <th
                                  scope="col"
                                  class="cursor-pointer text-[#82838B] !border-l-0 font-normal text-sm !border border-[#EAECF0] px-4 text-left bg-[#F7FAFF] !py-3 ' onClick={e => sorting('name')}"
                                >
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4"
                                    checked={isAllPCheck(itm.key)}
                                  />
                                 <span className="ms-2"> {itm.name}</span>
                                </th>
                              </>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody className="roleTable">
                        {permissions.map((itm) => {
                          return (
                            <>
                              <tr>
                                <td className="!text-typo !border-l-0 cursor-pointer !px-4 text-sm font-normal !py-4 !border text-left border-[#EAECF0]">
                                  {itm.name}
                                </td>
                                <td className="!text-typo !border-l-0 cursor-pointer !px-4 text-sm font-normal !py-4 !border text-left border-[#EAECF0]">
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4 green_check cursor-pointer shrink-0 rounded-[4px] !border !border-[#3C3E49A3] !text-white"
                                    name={itm.key}
                                    checked={isCheckAll(itm.key)}
                                  />
                                </td>
                                {permission.map((pitm) => {
                                  return (
                                    <td className="!text-typo !border-l-0 cursor-pointer !px-4 text-sm font-normal !py-4 !border text-left border-[#EAECF0]">
                                      <div Name="checkList">
                                        <label className="mb-0">
                                          <input
                                            type="checkbox"
                                            className="h-4 w-4 green_check cursor-pointer shrink-0 rounded-[4px] !border !border-[#3C3E49A3] !text-white"
                                            checked={
                                              data?.permissions[
                                                `${pitm.key}${itm.key}`
                                              ]
                                            }
                                          />
                                        </label>
                                      </div>
                                    </td>
                                  );
                                })}
                              </tr>
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div> */}
           </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default View;
