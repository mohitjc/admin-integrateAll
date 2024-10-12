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

const AddEdit = () => {
  const { id } = useParams();
  const [form, setform] = useState({
    name: "",
    continent:"",
    country:"",
    region:""
    // type:''
  });
  const [images, setImages] = useState({ image: "" });
  const [continentOptions, setContinentOptions] = useState([])
  const [countryOptions, setCountryOptions] = useState([])
  const [stateOptions, setStateOptions] = useState([])
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
      // ...images,
      // id: id,
    };
    if (id) {
      method = "put";
      url = shared.editApi;
    } else {

      // value.features=[{
      //   name:form.name
      // }]      
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
  // useEffect(() => {
  //   if (id) {
  //     loader(true);
  //     ApiClient.get(shared.detailApi, { id }).then((res) => {
  //       if (res.success) {
  //         let value = res.data;
  //         let payload = form;
  //         payload.id = id;
  //         Object.keys(payload).map((itm) => {
  //           payload[itm] = value[itm];
  //         });

  //         payload.id = id;
  //         setform({
  //           ...payload,
  //         });

  //         let img = images;
  //         Object.keys(img).map((itm) => {
  //           img[itm] = value[itm];
  //         });
  //         setImages({ ...img });
  //       }
  //       loader(false);
  //     });
  //   }
  // }, [id]);

    useEffect(() => {
    if (id) {
      ApiClient.get(shared.detailApi, { id }).then((res) => {
        console.log(res,"response")
        if (res.success && Array.isArray(res.data)) {
          const { name, continent, country, region } = res.data[0]; 
          setform({
            name,
            continent: continent,
            country: country,
            region:region,
            id:id
          });
          handleCountryData(continent);
          handleStateData(country);
        }
      });
    }
  }, [id]);

  const imageResult = (e, key) => {
    images[key] = e.value;
    setImages(images);
    if (submitted == true) {
      setSubmitted(false);
    }
  };

  const getData = (p = {}) => {
    ApiClient.get("address/continents/list").then((res) => {
      if (res.success) {
        const data = res?.data?.map((data)=>{
          return{
            "id":data?.id || data?._id,
            "name" : data?.name
          }
        })
        setContinentOptions(data);
      }
    });
  };

  const handleCountryData = (selectedContinent) => {
    if (selectedContinent) {
      ApiClient.get("address/country/list",{continent:selectedContinent}).then((res) => {
        if (res.success) {
          const data = res?.data?.map((data)=>{
            return{
              "id":data?.id || data?._id,
              "name" : data?.name
            }
          })
          setCountryOptions(data);
        }
      });
    } else {
      setCountryOptions([])
    }
      }

      const handleStateData = (selectedCountry) => {
        if (selectedCountry){
          ApiClient.get("address/region/list",{country:selectedCountry}).then((res) => {
            if (res.success) {
              const data = res?.data?.map((data)=>{
                return{
                  "id":data?.id || data?._id,
                  "name" : data?.name
                }
              })
              setStateOptions(data);
            }
          });
        } else {
          setStateOptions([])
        }
          }
    
      useEffect(() => {
        getData()
      },[])

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
          <div className="pprofile1 mb-10 ">
            <div>
              <h4 className="p-4 border-b  font-medium rounded-[5px] rounded-bl-[0] rounded-br-[0] flex items-center text-[#1E5DBC] ">
                  <img src ="/assets/img/usero-blue.svg" className="me-3 bg-[#e9f0f8] p-2 rounded-md"/>
                Basic Information
              </h4>
            </div>
            <div className="grid grid-cols-12 gap-4 p-4">
            <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  type="select"
                  label="Select Continent"
                  value={form.continent}
                  options={continentOptions}
                  theme="search"
                  onChange={(e) => {setform({ ...form, continent: e }); handleCountryData(e)}}
                  required
                />
              </div>
            <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  type="select"
                  label="Select Country"
                  value={form.country}
                  options={countryOptions}
                  theme="search"
                  onChange={(e) => {setform({ ...form, country: e }); handleStateData(e)}}
                  required
                />
              </div>
              <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  type="select"
                  label="Select State"
                  value={form.region}
                  options={stateOptions}
                  theme="search"
                  onChange={(e) => setform({ ...form, region: e })}
                  required
                />
              </div>
              <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  type="text"
                  label="City Name"
                  value={form.name}
                  onChange={(e) => setform({ ...form, name: e })}
                  required
                />
              </div>
              {/* <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  type="select"
                  label="Type"
                  value={form.type}
                  options={shared.types}
                  theme="search"
                  onChange={(e) => setform({ ...form, type: e })}
                  required
                />
              </div> */}
              {/* <div className="lg:col-span-6 col-span-12 mb-3">
                <label className="block mb-2">Image</label>

                <ImageUpload
                  model="users"
                  result={(e) => imageResult(e, "image")}
                  value={images.image || form.image}
                  multiple={false}
                  label="Choose Images"
                />
              </div> */}
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
