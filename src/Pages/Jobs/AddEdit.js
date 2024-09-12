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
import ImageUpload from "../../components/common/ImageUpload";
import environment from "../../environment";

const AddEdit = () => {
  const { id } = useParams();
  const [form, setform] = useState({
    title: "",
    description:'',
    client:'',
    property:'',
    contractor:'',
    estimate:''
  });
  const [images, setImages] = useState({ images: "" });
  const [clients, setClients] = useState([]);
  const [clientDetail, setClientDetail] = useState();
  const [clientDetailLoader, setClientDetailLoader] = useState(false);
  const [contractor, setContractor] = useState([]);
  const [property, setProperty] = useState([]);
  const [propertyLoader, setPropertyLoader] = useState(false);
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
      ...images,
      id: id,
      contractor:form.contractor||null
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


  const getClients=()=>{
    ApiClient.get('user/listing',{status:'active',role:environment.userRoleId}).then(res=>{
      if(res.success){
        setClients(res.data)
      }
    })
  }

  const getContractor=()=>{
    ApiClient.get('user/listing',{status:'active',role:environment.contractorRoleId}).then(res=>{
      if(res.success){
        setContractor(res.data)
      }
    })
  }

  const getProperties=()=>{
    let addedBy=form.client
    if(user.role._id==environment.userRoleId) addedBy=user._id
    setPropertyLoader(true)
    ApiClient.get('property/listing',{status:'active',addedBy:addedBy}).then(res=>{
      setPropertyLoader(false)
      if(res.success){
        setProperty(res.data)
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
          payload.id = id;
          Object.keys(payload).map((itm) => {
            payload[itm] = value[itm];
          });

          payload.id = id;

          if(payload.client?.id)payload.client=payload.client?.id
          if(payload.contractor?.id)payload.contractor=payload.contractor?.id
          if(payload.property?.id)payload.property=payload.property?.id

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
    getClients()
    getContractor()
  }, [id]);

  const imageResult = (e, key) => {
    images[key] = e.value;
    setImages(images);
    if (submitted == true) {
      setSubmitted(false);
    }
  };

  const getClientDetail=(id)=>{
    setClientDetailLoader(true)
    ApiClient.get('user/profile',{id}).then(res=>{
      setClientDetailLoader(false)
      if(res.success){
        setClientDetail(res.data)
      }
    })
  }

  useEffect(()=>{
    getProperties()
    if(form.client){
      getClientDetail(form.client)
    }
  },[form.client])

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
                  label="Title"
                  value={form.title}
                  onChange={(e) => setform({ ...form, title: e })}
                  required
                />
              </div>
              <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  type="number"
                  label="Budget Estimate (£)"
                  value={form.estimate}
                  onChange={(e) => setform({ ...form, estimate: e })}
                />
              </div>
              <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  type="select"
                  label="Client"
                  displayValue="fullName"
                  value={form.client}
                  theme="search"
                  onChange={(e) => setform({ ...form, client: e })}
                  options={clients}
                  required
                />

                {form.client ? <>
                {clientDetailLoader?<>
                  <div className="mt-2 text-green-500">Fetching Detail ...</div>
                </>:<>
                <div className="bg-green-300 p-[10px] rounded text-[12px] mt-2">
                    Client Name : {clientDetail?.fullName} <br />
                    Company : {clientDetail?.company}
                  </div>
                </>}
                  
                </> : <></>}

              </div>
              <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  type="select"
                  label="Contractor"
                  displayValue="fullName"
                  value={form.contractor}
                  theme="search"
                  onChange={(e) => setform({ ...form, contractor: e })}
                  options={contractor}
                />
              </div>
              {form.client?<>
                <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  type="select"
                  label={<>Project {propertyLoader?<span className="text-green-500">Loading...</span>:<></>}</>}
                  displayValue="name"
                  value={form.property}
                  theme="search"
                  onChange={(e) => setform({ ...form, property: e })}
                  options={property}
                  required
                />
              </div>
              </>:<></>}
              <div className="lg:col-span-full mb-3">
                <FormControl
                  type="textarea"
                  label="Description"
                  value={form.description}
                  onChange={(e) => setform({ ...form, description: e })}
                  required
                />
              </div>
              <div className="lg:col-span-6 col-span-12 mb-3">
                <label className="mb-2 block">Images</label>

                <ImageUpload
                  model="users"
                  result={(e) => imageResult(e, "images")}
                  value={images.images}
                  multiple={true}
                  label="Upload Images"
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
