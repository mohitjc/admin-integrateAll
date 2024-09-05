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
    name: "",
    category:'',
    price:'',
    vat_included:false,
    vat:'',
    unit:'',
    quantity:'',
    supplier:''
  });
  const [images, setImages] = useState({ image: "" });
  const [category, setCategory] = useState([]);
  const [supplier, setSupplier] = useState([]);
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
        standAlone:form.supplier?false:true,
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


  const getCategory=()=>{
    ApiClient.get('category/listing',{status:'active'}).then(res=>{
      if(res.success){
        setCategory(res.data)
      }
    })
  }

  const getSupplier=()=>{
    ApiClient.get('user/listing',{status:'active',role:environment.supplierRoleId}).then(res=>{
      if(res.success){
        setSupplier(res.data)
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

          if(payload.category?._id) payload.category=payload.category?._id
          if(payload.supplier?._id) payload.supplier=payload.supplier?._id
          

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
    getSupplier()
    getCategory()
  }, [id]);


  const imageResult = (e, key) => {
    images[key] = e.value;
    setImages(images);
    if (submitted == true) {
      setSubmitted(false);
    }
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

              <div className=" mb-3">
                <FormControl
                  type="select"
                  label="Supplier"
                  value={form.supplier}
                  theme="search"
                  placeholder="Select Option"
                  displayValue="fullName"
                  options={supplier}
                  onChange={(e) => setform({ ...form, supplier: e })}
                />
              </div>
             
              <div className=" mb-3">
                <FormControl
                  type="select"
                  label="Category"
                  value={form.category}
                  theme="search"
                  placeholder="Select Option"
                  options={category}
                  onChange={(e) => setform({ ...form, category: e })}
                  required
                />
              </div>
              <div className=" mb-3">
                <FormControl
                  type="text"
                  label="Price"
                  value={form.price}
                  onChange={(e) => setform({ ...form, price: e })}
                  required
                />
              </div>
              <div className=" mb-3">
                <FormControl
                  type="select"
                  label="VAT Included"
                  value={form.vat_included}
                  theme="search"
                  placeholder="Select Option"
                  options={
                    [
                      {id:true,name:'Yes'},
                      {id:false,name:'No'},
                    ]
                  }
                  onChange={(e) => setform({ ...form, vat_included: e })}
                  required
                />
              </div>
              {form.vat_included?<>
                <div className=" mb-3">
                <FormControl
                  type="number"
                  label="VAT"
                  value={form.vat}
                  onChange={(e) => setform({ ...form, vat: e })}
                  required
                />
              </div>
              </>:<></>}
             
              <div className=" mb-3">
                <FormControl
                  type="number"
                  label="Unit"
                  value={form.unit}
                  onChange={(e) => setform({ ...form, unit: e })}
                  required
                />
              </div>
              <div className=" mb-3">
                <FormControl
                  type="number"
                  label="Quantity"
                  value={form.quantity}
                  onChange={(e) => setform({ ...form, quantity: e })}
                  required
                />
              </div>
              <div className="mb-3">
              <label className="lablefontcls">Image</label>
              <br></br>
              <ImageUpload
                model="users"
                result={(e) => imageResult(e, "image")}
                value={images.image || form.image}
                multiple={false}
                label="Choose Images"
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
