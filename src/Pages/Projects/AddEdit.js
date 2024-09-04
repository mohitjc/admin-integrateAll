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

const AddEdit = () => {
  const { id } = useParams();
  const [form, setform] = useState({
    name: "",
    address:'',
    address2:'',
    state:'',
    zipCode:'',
    country:'',
  });
  const history = useNavigate();
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
    value.permissions=[]
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
          payload.id = id;
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

              <div className="col-span-full">
                <h4>Address</h4>
              </div>

              <div className="mb-3">
                <FormControl
                  type="text"
                  label="Street Address"
                  value={form.address}
                  onChange={(e) => setform({ ...form, address: e })}
                  required
                />
              </div>
              <div className="mb-3">
                <FormControl
                  type="text"
                  label="Street Address Line 2"
                  value={form.address2}
                  onChange={(e) => setform({ ...form, address2: e })}
                />
              </div>
              <div className="mb-3">
                <FormControl
                  type="text"
                  label="State / Province"
                  value={form.state}
                  onChange={(e) => setform({ ...form, state: e })}
                />
              </div>

              <div className="mb-3">
                <FormControl
                  type="text"
                  label="Postal / Zip Code"
                  value={form.zipCode}
                  maxlength="6"
                  onChange={(e) => setform({ ...form, zipCode: e })}
                />
              </div>

              <div className="mb-3">
                <FormControl
                  type="text"
                  label="Country"
                  value={form.country}
                  onChange={(e) => setform({ ...form, country: e })}
                />
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
