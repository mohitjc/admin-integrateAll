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
import Select from 'react-select';

const AddEdit = () => {
  const { id } = useParams();
  const [companyType, setCompanyType] = useState([])
  const [images, setImages] = useState({ image: "" });
  const [form, setform] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    company:"",
    companyType:"",
    companyMobileNo:"",
    CompanyEmail:"",
    companyAddress:"",
    websiteURL:"",
    contactName:"",
    currency:""
  });
  const history = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const user = useSelector((state) => state.user);
  const inValidEmail = methodModel.emailvalidation(form?.email);
  const inValidEmailCompany = methodModel.emailvalidation(form?.CompanyEmail);

  const formValidation = [
    { key: "mobileNo", required: true },
    { key: "email", required: true, message: "Email is required", email: true },
    {key:'CompanyEmail', required: true, message: "Company Email is required", email: true },
    { key: "companyMobileNo", required: true },
  ];
  const getData = (p = {}) => {
    ApiClient.get("category/listing", {status:'active', categoryType:"Business"}).then((res) => {
      if (res.success) {
        const data = res?.data?.map((data)=>{
          return{
            "id":data?.id || data?._id,
            "name" : data?.name
          }
        })
        setCompanyType(data);
      }
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    let invalid = methodModel.getFormError(formValidation, form);
    
    if (invalid) return;
    let method = "post";
    let url = shared.addApi;
    let value = {
      ...form,
      role: environment.userRoleId,
    };

    if (value.id) {
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



  useEffect(() => {
    if (id) {
      loader(true);
      ApiClient.get(shared.detailApi, { id }).then((res) => {
        if (res.success) {
          let value = res.data;
          let payload = form;
          Object.keys(payload).map((itm) => {
            payload[itm] = value[itm];
          });

          if (payload.role?._id) payload.role = payload.role?._id;
          payload.id = id;
          setform({
            ...payload,
          });

          let img = images;
          Object.keys(img).map((itm) => {
            img[itm] = value[itm];
          });
          setImages({ ...img });
        }
        loader(false);
      });
    }

    getData()
  }, [id]);


  return (
    <>
      <Layout>
        <form onSubmit={handleSubmit} autoComplete="off">
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
                  label="First Name"
                  value={form.firstName}
                  onChange={(e) => setform({ ...form, firstName: e })}
                  required
                />
              </div>
              <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  type="text"
                  name="full_name"
                  label="Last Name"
                  value={form.lastName}
                  onChange={(e) => setform({ ...form, lastName: e })}
                  required
                />
              </div>
              {/* <div className="mobile_number mb-3">
                <FormControl
                  type="select"
                  name="role"
                  label="Role"
                  value={roleOptions[0]?.id}
                  options={roleOptions}
                  onChange={(e) => setform({ ...form, role: e })}
                  required
                  theme="search"
                />
                {submitted && !form.role && (
                  <div className="invalid-feedback d-block">
                    Role is required
                  </div>
                )}
              </div> */}

              <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  type="text"
                  name="email"
                  label="Email"
                  value={form.email}
                  onChange={(e) => setform({ ...form, email: e })}
                  required
                  // disabled={id ? true : false}
                />
                {form.email && submitted && !inValidEmail && (
                  <div className="invalid-feedback d-block" style={{ color: 'red' }}>
                    Please enter valid email
                  </div>
                )}
              </div>
              <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  type="phone"
                  name="mobileNo"
                  label="Mobile No"
                  value={form.mobileNo}
                  onChange={(e) => setform({ ...form, mobileNo: e })}
                  required
                />
                {submitted && !form.mobileNo && (
                  <div className="invalid-feedback d-block" style={{ color: 'red' }}>
                    Mobile is required
                  </div>
                )}
              </div>
              {/* <div className="mb-3">
                <FormControl
                  type="date"
                  label="DOB"
                  value={form.dob}
                  onChange={(e) => setform({ ...form, dob: e })}
                  required
                />
              </div> */}

             
            </div>
            <div>
              <h4 className="p-4 border-b border-t  font-medium rounded-[5px] rounded-bl-[0] rounded-br-[0] flex items-center text-[#1E5DBC] ">
                  <img src ="/assets/img/usero-blue.svg" className="me-3 bg-[#e9f0f8] p-2 rounded-md"/>
                Company Profile
              </h4>
            </div>
            <div className="grid grid-cols-12 gap-4 p-4">
            <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  type="text"
                  label="Company Name"
                  value={form.company}
                  onChange={(e) => setform({ ...form, company: e })}
                  required
                />
              </div>
              <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  type="select"
                  label="Business Type"
                  value={form.companyType}
                  options={companyType}
                  theme="search"
                  onChange={(e) => setform({ ...form, companyType: e })}
                  required
                />
              </div>
              <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  type="phone"
                  name="companyMobileNo"
                  label="Company Mobile No"
                  value={form.companyMobileNo}
                  onChange={(e) => setform({ ...form, companyMobileNo: e })}
                  required
                />
                {submitted && !form.companyMobileNo && (
                  <div className="invalid-feedback d-block" style={{ color: 'red' }}>
                    Company Mobile is required
                  </div>
                )}
              </div>
              <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  type="text"
                  name="CompanyEmail"
                  label="Company Email"
                  value={form.CompanyEmail}
                  onChange={(e) => setform({ ...form, CompanyEmail: e })}
                  required
                  // disabled={id ? true : false}
                />
                {submitted && form.CompanyEmail && !inValidEmailCompany && (
                  <div className="invalid-feedback d-block" style={{ color: 'red' }}>
                   Please enter valid  Company Email
                  </div>
                )}
              </div>
              
              </div>
              <div>
              <h4 className="p-4 border-b border-t  font-medium rounded-[5px] rounded-bl-[0] rounded-br-[0] flex items-center text-[#1E5DBC] ">
                  <img src ="/assets/img/usero-blue.svg" className="me-3 bg-[#e9f0f8] p-2 rounded-md"/>
                Company Information
              </h4>
            </div>
            <div className="grid grid-cols-12 gap-4 p-4">
            <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  type="text"
                  label="Company Address"
                  value={form.companyAddress}
                  onChange={(e) => setform({ ...form, companyAddress: e })}
                  required
                />
              </div>
              <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  type="text"
                  label="Contact Name"
                  value={form.contactName}
                  onChange={(e) => setform({ ...form, contactName: e })}
                  required
                />
              </div>
              <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  type="select"
                  label="Currency"
                  value={form.currency}
                  options={shared.currencyOptions}
                  theme="search"
                  onChange={(e) => setform({ ...form, currency: e })}
                  required
                />
                  {/* <MultiSelectDropdown
                    id="statusDropdown"
                    // placeholder="Select Amenities"
                    intialValue={form?.currency}
                    className="mt-1 capitalize"
                    result={(e) => setform({ ...form, currency: e })}
                    options={shared.currencyOptions}
                    required={true}
                  /> */}
              </div>
              {/* <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  type="select"
                  label="Product"
                  value={form.companyType}
                  options={shared.currencyOptions}
                  theme="search"
                  onChange={(e) => setform({ ...form, companyType: e })}
                  required
                />
              </div> */}
              <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  type="text"
                  label="Website URL"
                  value={form.websiteURL}
                  onChange={(e) => setform({ ...form, websiteURL: e })}
                  required
                />
              </div>
              </div>
          </div>

          {/* <div className="pprofile1 mb-10">
                <div>
                  <h4 className="p-4 border-b  font-medium rounded-[5px] rounded-bl-[0] rounded-br-[0] flex items-center text-[#1E5DBC] ">
                  <IoLocationSharp className="me-3 bg-[#e9f0f8] text-[40px] p-2 rounded-md text-[#1E5DBC]" />
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
              </div> */}

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
