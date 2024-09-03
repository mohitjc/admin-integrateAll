import React, { useState, useEffect } from "react";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/global/layout";
import { Tooltip } from "antd";
import FormControl from "../../components/common/FormControl";
import shared from "./shared";
import { useSelector } from "react-redux";
import {
  rolePermission,
  rolePermissions,
  roleType,
} from "../../models/type.model";

const AddEdit = () => {
  const { id } = useParams();
  const [form1, setForm1] = useState({ ...roleType });
  const permissions = rolePermissions;
  const permission = rolePermission;
  const [form, setform] = useState({
    name: "",
  });
  const history = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const user = useSelector((state) => state.user);
  const formValidation = [
    { key: "mobileNo", required: true },
    { key: "email", required: true, message: "Email is required", email: true },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    let invalid = methodModel.getFormError(formValidation, form);

    if (invalid) return;
    let method = "post";
    let url = shared.addApi;
    
     let value = {
        ...form,
        ...form1,
        id: id,
      };
    if (id) {
      method = "put";
      url = shared.editApi;
    } else {
      value.addedBy = user._id;
      delete value.id;
    }

    loader(true);
    ApiClient.allApi(url, value, method).then((res) => {
      if (res.success) {
        // ToastsStore.success(res.message)
        history(`/${shared.url}`);
      }
      loader(false);
    });
  };
  useEffect(() => {
    if (id) {
      loader(true);
      ApiClient.get(shared.detailApi, { id }).then((res) => {
        if (res.success) {
          let value = res.data;
          let payload = form;
          let payload1 = form1;
          let permissions = value.permissions?.[0] || [];

          Object.keys(payload1).map((itm) => {
            if (itm != "permissions") payload1[itm] = value[itm];
          });

          Object.keys(roleType.permissions).map((itm) => {
            payload1.permissions[itm] = permissions[itm] || false;
          });

          payload.id = id;
          setForm1({
            ...payload1,
          });

          Object.keys(payload).map((itm) => {
            payload[itm] = value[itm];
          });

          payload.id = id;
          setform({
            ...payload,
          });
        }
        loader(false);
      });
    }
  }, [id]);


  const setpermission = (key, value) => {
    setForm1({
      ...form1,
      permissions: {
        ...form1.permissions,
        [key]: value,
      },
    });
  };

  const HandleAll = (check) => {
    let value = check ? true : false;
    let permissions = form1.permissions;
    Object.keys(permissions).map((itm) => {
      permissions[itm] = value;
    });
    setForm1({ ...form1, permissions: permissions });
  };
  const isAllChecked = () => {
    let value = true;
    let permissions = form1.permissions;
    Object.keys(permissions).map((itm) => {
      if (!permissions[itm]) value = false;
    });
    return value;
  };

  const HandleAllRead = (check, key = "read") => {
    let value = check ? true : false;

    let keys = {};
    permissions.map((itm) => {
      keys = { ...keys, [`${key}${itm.key}`]: value };
    });

    setForm1({
      ...form1,
      permissions: {
        ...form1.permissions,
        ...keys,
      },
    });
  };
  const isAllPCheck = (key = "read") => {
    let value = true;
    permissions.map((itm) => {
      if (!form1.permissions[`${key}${itm.key}`]) value = false;
    });
    return value;
  };

  const handleAllPermission = (e) => {
    let key = e.name;
    let checked = e.checked;

    let keys = {};
    permission.map((itm) => {
      keys = { ...keys, [`${itm.key}${key}`]: checked };
    });

    setForm1({
      ...form1,
      permissions: {
        ...form1.permissions,
        ...keys,
      },
    });
  };

  const isCheckAll = (key) => {
    let value = true;
    permission.map((itm) => {
      if (!form1.permissions[`${itm.key}${key}`]) value = false;
    });
    return value;
  };
 

  return (
    <>
      <Layout>
        <form onSubmit={handleSubmit}>
          <div className="pprofile1">
            <div className="flex items-center mb-8">
              <Tooltip placement="top" title="Back">
                <Link
                  to={`/${shared.url}`}
                  className="!px-4  py-2 flex items-center justify-center  rounded-lg shadow-btn hover:bg-[#F3F2F5] border transition-all  mr-3"
                >
                  <i className="fa fa-angle-left text-lg"></i>
                </Link>
              </Tooltip>
              <div>
                <h3 className="text-lg lg:text-2xl font-semibold text-[#111827]">
                  {form && form.id ? "Edit" : "Add"} {shared.addTitle}
                </h3>
                {/* <p class="text-xs lg:text-sm font-normal text-[#75757A]">
                  Here you can see all about your {shared.addTitle}
                </p> */}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className=" mb-3">
                <FormControl
                  type="text"
                  label="Name"
                  value={form.name}
                  onChange={(e) => setform({ ...form, name: e })}
                  required
                />
              </div>
            </div>
            <div className="shadow-box w-full bg-white rounded-lg mb-6 mt-4">
                <div className="scrollbar w-full overflow-auto">
                  <div class="table_section tablepadding">
                    <p className="text-xl font-semibold text-[#111827] px-4 py-3">
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
                              onChange={(e) => HandleAll(e.target.checked)}
                              checked={isAllChecked()}
                              className="h-4 w-4 me-1"
                            />
                            All
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
                                    className="h-4 w-4 me-1"
                                    onChange={(e) =>
                                      HandleAllRead(e.target.checked, itm.key)
                                    }
                                    checked={isAllPCheck(itm.key)}
                                  />
                                  {itm.name}
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
                                    onChange={(e) =>
                                      handleAllPermission(e.target)
                                    }
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
                                              form1.permissions[
                                                `${pitm.key}${itm.key}`
                                              ]
                                            }
                                            onChange={(e) =>
                                              setpermission(
                                                `${pitm.key}${itm.key}`,
                                                e.target.checked
                                              )
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
              </div>
            <div className="text-right">
              <button
                type="submit"
                className="text-white bg-[#063688] bg-[#063688] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center  mb-2"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </Layout>
    </>
  );
};

export default AddEdit;
