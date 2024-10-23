import React, { useState, useEffect } from "react";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/global/layout";
import { Tooltip } from "antd";
import FormControl from "../../components/common/FormControl";
import shared, { days, recommended, trialPeriodData } from "./shared";
import { useSelector } from "react-redux";

const AddEdit = () => {
  const { id } = useParams();
  const [form, setform] = useState({
    name: "",
    recomended: "",
    type: '',
    trialPeriod: "",
    discountOption:'no',
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
      feature: sfeatures,
      id: id,
    };
    if (id) {
      method = "put";
      url = shared.editApi;
    } else {
      delete value.id;
    }

    value.pricing = [
      {
        "interval": "month",
        "interval_count": 1,
        "currency": "aud",
        "unit_amount": Number(form.monthlyAmount||0),
        "discount_amount": Number(form.monthlyAmountDiscount||0)
      },
      {
        "interval": "month",
        "interval_count": 3,
        "currency": "aud",
        "unit_amount": Number(form.threeMonthAmount||0),
        "discount_amount": Number(form.threeMonthAmountDiscount||0)
      },
      {
        "interval": "month",
        "interval_count": 6,
        "currency": "aud",
        "unit_amount": Number(form.sixMonthAmount||0),
        "discount_amount": Number(form.sixMonthAmountDiscount||0)
      },
      {
        "interval": "month",
        "interval_count": 12,
        "currency": "aud",
        "unit_amount": Number(form.yearlyAmount||0),
        "discount_amount": Number(form.yearlyAmountDiscount||0)
      }
    ]
    value.monthlyPrice = {
      aud: Number(form.monthlyAmount)
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


  const getFeatures = () => {
    ApiClient.get('feature/get-feature-list', { status: 'active' }).then(res => {
      if (res.success) {
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
          let pricing = res.data.pricing
          let payload = form;
          payload.id = id;
          Object.keys(payload).map((itm) => {
            payload[itm] = value[itm];
          });

          let monthlyAmount = pricing.find(itm => itm?.interval_count == 1)?.unit_amount || 0
          let threeMonthAmount = pricing.find(itm => itm?.interval_count == 3)?.unit_amount || 0
          let sixMonthAmount = pricing.find(itm => itm?.interval_count == 6)?.unit_amount || 0
          let yearlyAmount = pricing.find(itm => itm?.interval_count == 12)?.unit_amount || 0

          let monthlyAmountDiscount = pricing.find(itm => itm?.interval_count == 1)?.discount_amount || 0
          let threeMonthAmountDiscount = pricing.find(itm => itm?.interval_count == 3)?.discount_amount || 0
          let sixMonthAmountDiscount = pricing.find(itm => itm?.interval_count == 6)?.discount_amount || 0
          let yearlyAmountDiscount = pricing.find(itm => itm?.interval_count == 12)?.discount_amount || 0

          payload.id = id;
          setform({
            ...payload,
            monthlyAmount,
            threeMonthAmount,
            sixMonthAmount,
            yearlyAmount,
            monthlyAmountDiscount,
            threeMonthAmountDiscount,
            sixMonthAmountDiscount,
            yearlyAmountDiscount,
          });

          console.log("value", value)

          setSFeatures(value.feature.map(itm => String(itm)))

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
    setSFeatures([...arr])
  }

  const recommendedArray = [
    { name: "Yes", id: "Yes" }, { name: "No", id: "No" }
  ]
  const trialPeriodOptions = shared.options.map(option => ({ value: option.value, label: option.label }));

  const planType = [
    { id: 'stripe', name: 'Stripe' },
    { id: 'frontend', name: 'Frontend' },
  ]

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

              <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  type="select"
                  label="Type"
                  theme="search"
                  value={form.type}
                  onChange={(e) => setform({ ...form, type: e })}
                  options={planType}
                  required
                />
              </div>

              <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  type="radio"
                  label="Discount"
                  value={form.discountOption}
                  onChange={(e) => {
                   
                    if(e=='no'){
                      setform({ 
                        ...form, 
                        discountOption: e,
                        monthlyAmountDiscount:0,
                        threeMonthAmountDiscount:0,
                        sixMonthAmountDiscount:0,
                        yearlyAmountDiscount:0,
                       })
                    }else{
                      setform({ ...form, discountOption: e })
                    }
                  }}
                  options={[
                    {id:'yes',name:'Yes'},
                    {id:'no',name:'No'},
                  ]}
                  required
                />
              </div>

              <div className="col-span-full">
                <div className="grid grid-cols-12 gap-3">
                  <div className="lg:col-span-12 col-span-12 mb-3">


                    <div class="relative overflow-x-auto">
                      <table class="w-full border text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th scope="col" class="px-10 border py-3 text-center">
                              Duration
                            </th>
                            <th scope="col" class="px-10 border py-3 text-center">
                             Price (AUD)
                            </th>
                            {form.discountOption == 'yes' ? <>
                              <th scope="col" class="px-10 border py-3 text-center">
                                Discount Price (AUD)
                              </th>
                            </> : <></>}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th class="px-10 py-4 border text-center">1 Month</th>
                            <td class="px-4 py-4 border text-center">   <FormControl
                              type="number"
                              value={form.monthlyAmount}
                              onChange={(e) => setform({ ...form, monthlyAmount: e })}
                            // required
                            /></td>
                             {form.discountOption == 'yes' ? <>
                              <td class="px-4 py-4 border text-center">   <FormControl
                              type="number"
                              value={form.monthlyAmountDiscount}
                              onChange={(e) => setform({ ...form, monthlyAmountDiscount: e })}
                            /></td>
                            </> : <></>}
                          </tr>
                          <tr>
                            <th class="px-10 py-4 border text-center">
                              3 Month
                            </th>
                            <td class="px-4 border py-4 text-center">
                              <FormControl
                                type="number"
                                value={form.threeMonthAmount}
                                onChange={(e) => setform({ ...form, threeMonthAmount: e })}

                              />
                            </td>
                            {form.discountOption == 'yes' ? <>
                              <td class="px-4 py-4 border text-center">   <FormControl
                              type="number"
                              value={form.threeMonthAmountDiscount}
                              onChange={(e) => setform({ ...form, threeMonthAmountDiscount: e })}
                            /></td>
                            </> : <></>}
                          </tr>
                          <tr>
                            <th class="px-10 py-4 border text-center">6 Month</th>
                            <td class="px-4 py-4 border text-center">    <FormControl
                              type="number"

                              value={form.sixMonthAmount}
                              onChange={(e) => setform({ ...form, sixMonthAmount: e })}

                            /></td>
                             {form.discountOption == 'yes' ? <>
                              <td class="px-4 py-4 border text-center">   <FormControl
                              type="number"
                              value={form.sixMonthAmountDiscount}
                              onChange={(e) => setform({ ...form, sixMonthAmountDiscount: e })}
                            /></td>
                            </> : <></>}
                          </tr>
                          <tr>
                            <th class="px-10 py-4 border text-center">12 Month</th>
                            <td class="px-4 py-4 border text-center">
                              <FormControl
                                type="number"
                                value={form.yearlyAmount}
                                onChange={(e) => setform({ ...form, yearlyAmount: e })}

                              /></td>
                               {form.discountOption == 'yes' ? <>
                              <td class="px-4 py-4 border text-center">   <FormControl
                              type="number"
                              value={form.yearlyAmountDiscount}
                              onChange={(e) => setform({ ...form, yearlyAmountDiscount: e })}
                            /></td>
                            </> : <></>}
                          </tr>
                        </tbody>
                      </table>
                    </div>

                  </div>
                </div>
              </div>
              {/* <div className="col-span-full">
                <div className="grid grid-cols-4 gap-3">
                  <div className="">
                    <FormControl
                      type="number"
                      label="Monthly (USD)"
                      value={form.monthlyAmountUSD}
                      onChange={(e) => setform({ ...form, monthlyAmountUSD: e })}
                      // required
                    />
                  </div>
                  <div className="">
                    <FormControl
                      type="number"
                      label="3 Months (USD)"
                      value={form.threeMonthAmountUSD}
                      onChange={(e) => setform({ ...form, threeMonthAmountUSD: e })}
                      
                    />
                  </div>
                  <div className="">
                    <FormControl
                      type="number"
                      label="6 Months (USD)"
                      value={form.sixMonthAmountUSD}
                      onChange={(e) => setform({ ...form, sixMonthAmountUSD: e })}
                      
                    />
                  </div>
                  <div className="">
                    <FormControl
                      type="number"
                      label="Yearly (USD)"
                      value={form.yearlyAmountUSD}
                      onChange={(e) => setform({ ...form, yearlyAmountUSD: e })}
                      
                    />
                  </div>
                </div>
              </div> */}
              {/* <div className="col-span-full">
                <div className="grid grid-cols-4 gap-3">
                  <div className="">
                    <FormControl
                      type="number"
                      label="Monthly (NZD)"
                      value={form.monthlyAmountNZD}
                      onChange={(e) => setform({ ...form, monthlyAmountNZD: e })}
                      // required
                    />
                  </div>
                  <div className="">
                    <FormControl
                      type="number"
                      label="3 Months (NZD)"
                      value={form.threeMonthAmountNZD}
                      onChange={(e) => setform({ ...form, threeMonthAmountNZD: e })}
                      
                    />
                  </div>
                  <div className="">
                    <FormControl
                      type="number"
                      label="6 Months (NZD)"
                      value={form.sixMonthAmountNZD}
                      onChange={(e) => setform({ ...form, sixMonthAmountNZD: e })}
                      
                    />
                  </div>
                  <div className="">
                    <FormControl
                      type="number"
                      label="Yearly (NZD)"
                      value={form.yearlyAmountNZD}
                      onChange={(e) => setform({ ...form, yearlyAmountNZD: e })}
                      
                    />
                  </div>
                </div>
              </div>   */}
              <div className="col-span-full ">
                <label className="text-sm mb-2 block">Feature Text</label>
                <div className="flex justify-between  items-center rounded p-4">
                  {features.map(itm => {
                    return <label class="flex items-center " key={itm.id}>
                      <input onChange={e => selectF(e)} checked={sfeatures.includes(String(itm.id))} value={itm.id} type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
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
