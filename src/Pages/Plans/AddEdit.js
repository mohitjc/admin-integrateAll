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
    // type:''
  });
  const [features, setFeatures] = useState([]);
  const [sfeatures, setSFeatures] = useState([]);
  const [images, setImages] = useState({ image: "" });
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
      feature:sfeatures,
      id: id,
    };
    if (id) {
      method = "put";
      url = shared.editApi;
    } else {
      delete value.id;
    }

    value.pricing=[
      {
        "interval": "month",
        "interval_count": 1,
        "currency": "usd",
        "unit_amount": Number(form.monthlyAmount)
      },
      {
        "interval": "month",
        "interval_count": 3,
        "currency": "usd",
        "unit_amount": Number(form.threeMonthAmount)
      },
      {
        "interval": "month",
        "interval_count": 6,
        "currency": "usd",
        "unit_amount": Number(form.sixMonthAmount)
      },
      {
        "interval": "month",
        "interval_count": 12,
        "currency": "usd",
        "unit_amount": Number(form.yearlyAmount)
      }
    ]
    value.monthlyPrice={
      usd:Number(form.monthlyAmount)
    }

    console.log("value",value)
    loader(true);
    ApiClient.allApi(url, value, method).then((res) => {
      if (res.success) {
        // ToastsStore.success(res.message)
        history(`/${shared.url}`);
      }
      loader(false);
    });
  };


  const getFeatures=()=>{
    ApiClient.get('feature/get-feature-list',{status:'active'}).then(res=>{
      if(res.success){
        setFeatures(res.data)
      }
    })
  }

  useEffect(() => {
    if (id) {
      loader(true);
      ApiClient.get(shared.detailApi, { id }).then((res) => {
        if (res.success) {
          let value = res.data;
          let pricing=res.data.pricing
          let payload = form;
          payload.id = id;
          Object.keys(payload).map((itm) => {
            payload[itm] = value[itm];
          });

          let monthlyAmount=pricing.find(itm=>itm?.interval_count==1)?.unit_amount||0
          let threeMonthAmount=pricing.find(itm=>itm?.interval_count==3)?.unit_amount||0
          let sixMonthAmount=pricing.find(itm=>itm?.interval_count==6)?.unit_amount||0
          let yearlyAmount=pricing.find(itm=>itm?.interval_count==12)?.unit_amount||0

          payload.id = id;
          setform({
            ...payload,
            monthlyAmount,
            threeMonthAmount,
            sixMonthAmount,
            yearlyAmount
          });

          console.log("value",value)

          setSFeatures(value.feature.map(itm=>String(itm)))

          let img = images;
          Object.keys(img).map((itm) => {
            img[itm] = value[itm];
          });
          setImages({ ...img });
        }
        loader(false);
      });
    }
    getFeatures()
  }, [id]);

  const imageResult = (e, key) => {
    images[key] = e.value;
    setImages(images);
    if (submitted == true) {
      setSubmitted(false);
    }
  };

  const selectF = (e) => {
    let checked = e.target.checked
    let value = e.target.value
    let arr = sfeatures
    if (checked) {
      arr.push(value)
    } else {
      arr = arr.filter(itm => itm != value)
    }
console.log("arr",arr)
    setSFeatures([...arr])
  }

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
                <img src="/assets/img/usero-blue.svg" className="me-3 bg-[#e9f0f8] p-2 rounded-md" />
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
              <div className="col-span-full">
                <div className="grid grid-cols-4 gap-3">
                  <div className="">
                    <FormControl
                      type="number"
                      label="Monthly Price"
                      value={form.monthlyAmount}
                      onChange={(e) => setform({ ...form, monthlyAmount: e })}
                      required
                    />
                  </div>
                  <div className="">
                    <FormControl
                      type="number"
                      label="3 Months Price"
                      value={form.threeMonthAmount}
                      onChange={(e) => setform({ ...form, threeMonthAmount: e })}
                      
                    />
                  </div>
                  <div className="">
                    <FormControl
                      type="number"
                      label="6 Months Price"
                      value={form.sixMonthAmount}
                      onChange={(e) => setform({ ...form, sixMonthAmount: e })}
                      
                    />
                  </div>
                  <div className="">
                    <FormControl
                      type="number"
                      label="Yearly Price"
                      value={form.yearlyAmount}
                      onChange={(e) => setform({ ...form, yearlyAmount: e })}
                      
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-full">
                <h5>Features</h5>
                <div>
                  {features.map(itm=>{
                    return  <label class="flex items-center mb-4" key={itm.id}>
                    <input onChange={e=>selectF(e)} checked={sfeatures.includes(String(itm.id))} value={itm.id} type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <span class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{itm.name}</span>
                  </label>
                  })}
                </div>
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