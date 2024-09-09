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
import environment from "../../environment";

const AddEdit = () => {
  const { id } = useParams();
  const [form, setform] = useState({
    name: "",
    address: "",
    address2: "",
    state: "",
    zipCode: "",
    addedBy: "",
    country: "",
  });
  const history = useNavigate();
  const [clients, setClients] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const user = useSelector((state) => state.user);
  const formValidation = [
    // { key: "mobileNo", required: true },
    // { key: "email", required: true, message: "Email is required", email: true },
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
      id: id,
    };
    if (id) {
      method = "put";
      url = shared.editApi;
    } else {
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

  const getClients = () => {
    ApiClient.get("user/listing", {
      role: environment.userRoleId,
      status: "active",
    }).then((res) => {
      if (res.success) {
        setClients(res.data);
      }
    });
  };

  useEffect(() => {
    if (id) {
      loader(true);
      ApiClient.get(shared.detailApi, { id }).then((res) => {
        if (res.success) {
          let value = res.data;
          let payload = form;
          payload.id = id;
          Object.keys(payload).map((itm) => {
            payload[itm] = value[itm];
          });
          if (payload.addedBy?._id) payload.addedBy = payload.addedBy?._id;

          payload.id = id;
          setform({
            ...payload,
          });
        }
        loader(false);
      });
    }
    getClients();
  }, [id]);

  return (
    <>
      <Layout>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center mb-8">
            <Tooltip placement="top" title="Back">
              <Link
                to={`/${shared.url}`}
                className="!px-4  py-2 flex items-center justify-center  rounded-lg shadow-btn hover:bg-[#1E5DBC] hover:text-white border transition-all bg-white mr-3"
              >
                <i className="fa fa-angle-left text-lg"></i>
              </Link>
            </Tooltip>
            <div>
              <h3 className="text-lg lg:text-2xl font-semibold text-[#111827]">
                {form && form.id ? "Edit" : "Add"} {shared.addTitle}
              </h3>
              <p class="text-xs lg:text-sm font-normal text-[#75757A]">
                Here you can see all about your {shared.addTitle}
              </p>
            </div>
          </div>

          <div className="pprofile1 mb-10">
            <div>
              <h4 className="p-4 border-b  font-medium rounded-[5px] rounded-bl-[0] rounded-br-[0] flex items-center text-[#1E5DBC] ">
                  <img src ="/assets/img/usero-blue.svg" className="me-3 bg-[#e9f0f8] p-2 rounded-md"/>
                Basic Information
              </h4>
            </div>

            <div className="grid grid-cols-12 gap-4 p-4">
              <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  type="text"
                  label="Name"
                  value={form.name}
                  onChange={(e) => setform({ ...form, name: e })}
                  required
                />
              </div>

              <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  type="select"
                  label="Client"
                  theme="search"
                  value={form.addedBy}
                  options={clients}
                  displayValue="fullName"
                  onChange={(e) => setform({ ...form, addedBy: e })}
                  required
                />
              </div>
            </div>
          </div>
          <div className="pprofile1 mb-10">
            <div>
              <h4 className="p-4 border-b  font-medium rounded-[5px] rounded-bl-[0] rounded-br-[0] flex items-center text-[#1E5DBC] ">
                  <img src ="/assets/img/usero-blue.svg" className="me-3 bg-[#e9f0f8] p-2 rounded-md"/>
                Address
              </h4>
            </div>
            <div className="grid grid-cols-12 gap-4 p-4">
            <div className="lg:col-span-6 col-span-12 mb-3">
              <FormControl
                type="text"
                label="Street Address"
                value={form.address}
                onChange={(e) => setform({ ...form, address: e })}
                required
              />
            </div>
            <div className="lg:col-span-6 col-span-12 mb-3">
              <FormControl
                type="text"
                label="Street Address Line 2"
                value={form.address2}
                onChange={(e) => setform({ ...form, address2: e })}
              />
            </div>
            <div className="lg:col-span-6 col-span-12 mb-3">
              <FormControl
                type="text"
                label="State / Province"
                value={form.state}
                onChange={(e) => setform({ ...form, state: e })}
              />
            </div>

            <div className="lg:col-span-6 col-span-12 mb-3">
              <FormControl
                type="text"
                label="Postal / Zip Code"
                value={form.zipCode}
                maxlength="8"
                onChange={(e) => setform({ ...form, zipCode: e })}
              />
            </div>

            <div className="lg:col-span-6 col-span-12 mb-3">
              <FormControl
                type="text"
                label="Country"
                value={form.country}
                onChange={(e) => setform({ ...form, country: e })}
              />
            </div>
          </div>
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="text-white bg-[#1E5DBC] bg-[#1E5DBC] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center  mb-2"
            >
              Save
            </button>
          </div>
        </form>
      </Layout>
    </>
  );
};

export default AddEdit;
