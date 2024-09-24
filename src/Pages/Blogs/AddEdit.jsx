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

const AddEditBlogs = () => {
  const { id } = useParams();
  const [images, setImages] = useState({ image: "" });
  const [form, setform] = useState({
    title: "",
    description: "",
    keywords: [],
    meta_keywords:[],
    meta_desc: "",
    meta_title: "",
  });
  const history = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const user = useSelector((state) => state.user);

  const formValidation = [
    // { key: "title", required: true },
    // { key: "meta_desc", required: true },
    // { key: "meta_title", required: true },
    // { key: "description", required: true },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    let invalid = methodModel.getFormError(formValidation, form);

    if (invalid) return;
    let method = "post";
    let value;
    let url = shared.addApi;
    value = {
      ...form,
      ...images,
    };

    if (id) {
      value = {
        ...form,
        id: id,
        ...images,
      };

      method = "put";
      url = shared.editApi;
    } else {
      delete value.id;
    }

    loader(true);
    ApiClient.allApi(url, value, method).then((res) => {
      if (res.success) {
        history(`/${shared.url}`);
      }
      loader(false);
    });
  };

  const imageResult = (e, key) => {
    images[key] = e.value;
    setImages(images);
    if (submitted == true) {
      setSubmitted(false);
    }
  };

  const handleInputChange = (e) => {
    setform({
      ...form,
      meta_keywords: e,
    });
  };

  const addKeyword = (e) => {
    e.preventDefault();
    if (form?.meta_keywords && !form.keywords.includes(form.meta_keywords)) {
      setform({
        ...form,
        keywords: [...form.keywords, form.meta_keywords],
        meta_keywords: "",
      });
    }
  };

  const removeKeyword = (keywordToRemove) => {
    setform({
      ...form,
      keywords: form.keywords.filter((keyword) => keyword !== keywordToRemove),
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
          let img = images;
          Object.keys(img).map((itm) => {
            img[itm] = value[itm];
          });
          setImages({ ...img });
        }
        loader(false);
      });
    }
  }, [id]);

  return (
    <>
      <Layout>
        <form onSubmit={handleSubmit}>
        <div className="flex items-center mb-8">
              <Tooltip placement="top" title="Back">
                <Link
                  to={`/${shared.url}`}
                   className="!px-4  py-2 flex items-center justify-center  rounded-lg shadow-btn hover:bg-[#1E5DBC] hover:text-white border transition-all bg-white mr-3" >
                  <i className="fa fa-angle-left text-lg"></i>
                </Link>
              </Tooltip>
              <div>
                <h3 className="text-lg lg:text-2xl font-semibold text-[#111827]">
                  {id ? "Edit" : "Add"} {shared.addTitle}
                </h3>
                <p class="text-xs lg:text-sm font-normal text-[#75757A]">Here you can see all about your {shared.addTitle}</p>
              </div>
            </div>
          <div className="pprofile1 mb-10">
           
          <div><h4 class="p-4 border-b  font-medium rounded-[5px] rounded-bl-[0] rounded-br-[0] flex items-center text-[#1E5DBC] "><img src="/assets/img/usero-blue.svg" class="me-3 bg-[#e9f0f8] p-2 rounded-md" />Blog Information</h4></div>
            <div className="grid grid-cols-12 gap-4 p-4">
              <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  name="name"
                  type="text"
                  label="Title"
                  value={form.title}
                  onChange={(e) => setform({ ...form, title: e })}
                  required
                />
              </div>

              <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  name="metaname"
                  type="text"
                  label="Meta Title"
                  value={form.meta_title}
                  onChange={(e) => setform({ ...form, meta_title: e })}
                  required
                />
              </div>
              <div className="col-span-full mb-3">
              <FormControl
                  name="metaname"
                  type="badge"
                  label="Keywords"
                  value={form.meta_keywords}
                  onChange={(e) => setform({ ...form, meta_keywords: e })}
                  
                />
            </div>
            <div className="col-span-full mb-3">
              <div className=" mb-3">
                <FormControl
                  required
                  type="editor"
                  label="Description"
                  value={form.description}
                  onChange={(e) => setform({ ...form, description: e })}
                />
              </div>
              <div className=" mb-3">
                <FormControl
                  required
                  type="textarea"
                  name="meta_desc"
                  label="Meta Description"
                  value={form.meta_desc}
                  onChange={(e) => setform({ ...form, meta_desc: e })}
                />
              </div>
            </div>
            <div className=" col-span-full mb-3">
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

export default AddEditBlogs;
