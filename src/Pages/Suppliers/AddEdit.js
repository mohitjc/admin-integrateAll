import React, { useState, useEffect, Fragment } from "react";
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

  const [images, setImages] = useState({ image: "" });
  const [materials, setMeterials] = useState([{name:''}]);
  const [form, setform] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    company: '',
    address: '',
    address2: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [category, setCategory] = useState([]);
  const history = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const user = useSelector((state) => state.user);
  const inValidEmail = methodModel.emailvalidation(form?.email);

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
      material:materials,
      role: environment.supplierRoleId,
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

  const getCategory=()=>{
    ApiClient.get('category/listing',{status:'active'}).then(res=>{
      if(res.success){
        setCategory(res.data)
      }
    })
  }

  const getMaterials=()=>{
    let prm={
      supplier:id
    }
    ApiClient.get('material/listing',prm).then(res=>{
      if(res.success){
        let arr=res.data
        arr=arr.map(itm=>{
          return {
            name:itm.name,
            category:itm.category,
            id:itm.id,
            price:itm.price,
            quantity:itm.quantity,
            unit:itm.unit,
            vat_included:itm.vat_included,
            vat:itm.vat,
          }
        })
        setMeterials(arr)
      }
    })
  }

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
      getMaterials()
    }
    getCategory()
  }, [id]);


  const updateMaterial=(i,key,value)=>{
    let arr=materials
    arr[i][key]=value
    setMeterials([...arr])
  }

  const addMaterial=()=>{
    let arr=materials
    arr.push({
      name:'',
    })
    setMeterials([...arr])
  }

  const removeMaterial=(mi)=>{
    let arr=materials
   arr=arr.filter((itm,i)=>i!=mi)
    setMeterials([...arr])
  }
  

  return (
    <>
      <Layout>
        <form onSubmit={handleSubmit} autoComplete="off">
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
            <div className="">
              <FormControl
                type="text"
                label="First Name"
                value={form.firstName}
                onChange={(e) => setform({ ...form, firstName: e })}
                required
              />
            </div>

            <div className="">
              <FormControl
                type="text"
                label="Last Name"
                value={form.lastName}
                onChange={(e) => setform({ ...form, lastName: e })}
                required
              />
            </div>

              <div className=" mb-3">
                <FormControl
                  type="text"
                  name="email"
                  label="Email"
                  value={form.email}
                  onChange={(e) => setform({ ...form, email: e })}
                  required
                  disabled={id ? true : false}
                />
                {form.email && submitted && !inValidEmail && (
                  <div className="invalid-feedback d-block">
                    Please enter valid email
                  </div>
                )}
              </div>
              <div className="mobile_number mb-3">
                <FormControl
                  type="phone"
                  name="mobileNo"
                  label="Mobile No"
                  value={form.mobileNo}
                  onChange={(e) => setform({ ...form, mobileNo: e })}
                  required
                />
                {submitted && !form.mobileNo && (
                  <div className="invalid-feedback d-block">
                    Mobile is required
                  </div>
                )}
              </div>
              <div className=" mb-3">
                <FormControl
                  type="text"
                  label="Company"
                  value={form.company}
                  onChange={(e) => setform({ ...form, company: e })}
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

              {!id?<>
                <div className="col-span-full">
              <h5 className="mb-2">Materials</h5>
                {materials.map((itm, i) => {
                  return <Fragment key={i}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 shadow border p-3 mb-3">
                      <div className=" mb-3">
                        <FormControl
                          type="text"
                          label="Name"
                          value={itm.name}
                          onChange={(e) => updateMaterial(i,'name',e)}
                          required
                        />
                      </div>

                      <div className=" mb-3">
                        <FormControl
                          type="select"
                          label="Category"
                          theme="search"
                          placeholder="Select Option"
                          options={category}
                          value={itm.category}
                          onChange={(e) => updateMaterial(i,'category',e)}
                          required
                        />
                      </div>
                      <div className=" mb-3">
                        <FormControl
                          type="text"
                          label="Price"
                          value={itm.price}
                          onChange={(e) => updateMaterial(i,'price',e)}
                          required
                        />
                      </div>
                      <div className=" mb-3">
                        <FormControl
                          type="select"
                          label="VAT Included"
                          theme="search"
                          placeholder="Select Option"
                          options={
                            [
                              { id: 'yes', name: 'Yes' },
                              { id: 'no', name: 'No' },
                            ]
                          }
                          value={itm.vat_included}
                          onChange={(e) => updateMaterial(i,'vat_included',e)}
                          required
                        />
                      </div>
                      {itm.vat_included == 'yes' ? <>
                        <div className=" mb-3">
                          <FormControl
                            type="number"
                            label="VAT"
                            value={itm.vat}
                            onChange={(e) => updateMaterial(i,'vat',e)}
                            required
                          />
                        </div>
                      </> : <></>}

                      <div className=" mb-3">
                        <FormControl
                          type="text"
                          label="Unit"
                          value={itm.unit}
                          onChange={(e) => updateMaterial(i,'unit',e)}
                          required
                        />
                      </div>
                      <div className=" mb-3">
                        <FormControl
                          type="number"
                          label="Quantity"
                          value={itm.quantity}
                          onChange={(e) => updateMaterial(i,'quantity',e)}
                          required
                        />
                      </div>
                      <div className="text-right col-span-full">
                     
                        {materials.length > 1 ? <>
                          <button type="button" onClick={() => removeMaterial(i)} className="text-white bg-[#ff2626] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Remove</button>
                        </> : <></>}
                      </div>
                    </div>
                  </Fragment>
                })}
                <div className="text-right mb-4">
                <button type="button" onClick={addMaterial} className="text-white bg-[#063688] bg-[#063688] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Add Material</button>
                </div>
              </div>
              </>:<></>}

              

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
