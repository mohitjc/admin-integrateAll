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
import ImageUpload from "../../components/common/ImageUpload";

const AddEditBlogs = () => {
  const { id } = useParams();
  const [images, setImages] = useState({ image: "" });
  const [form, setform] = useState({
    name: "",
    short_description: "",
    keywords: [],
    meta_desc: "",
    meta_title: "",
  });
  const history = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const user = useSelector((state) => state.user);

  const formValidation = [
    { key: "name", required: true },
    { key: "meta_desc", required: true },
    { key: "meta_title", required: true },
    { key: "short_description", required: true },
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
      meta_keyword: e,
    });
  };

  const addKeyword = (e) => {
    e.preventDefault();
    if (form?.meta_keyword && !form.keywords.includes(form.meta_keyword)) {
      setform({
        ...form,
        keywords: [...form.keywords, form.meta_keyword],
        meta_keyword: "",
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
          setform({
            ...form,
            keywords: res?.data?.keywords,
            name: res?.data?.name,
            meta_desc: res?.data?.meta_desc,
            meta_title: res?.data?.meta_title,
            short_description: res?.data?.short_description,
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
                  {id ? "Edit" : "Add"} {shared.addTitle}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-12  gap-4">
              <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  name="name"
                  type="text"
                  label="Title"
                  value={form.name}
                  onChange={(e) => setform({ ...form, name: e })}
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
              <div className="">
                <label className="text-sm mb-2 block">Keywords</label>
               <div className="flex items-center w-full gap-3">
               <input
                  type="text"
                  className="relative  bg-white w-full rounded-lg h-10 flex items-center gap-2 overflow-hidden border border-[#00000036] px-3"
                  name="meta_keyword"
                  label="Keywords"
                  value={form.meta_keyword}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addKeyword();
                    }
                  }}
                />
                <button onClick={addKeyword} className="btn btn-primary">
                  Add
                </button>
               </div>
              </div>
              <ul className="flex items-center mt-2">
                {form.keywords.map((keyword, index) => (
                  <li key={index} className="bg-[#e0e7f1] text-[#2b2b2b] py-[4px] px-[10px] text-xs rounded-[4px] me-1">
                    {keyword}
                    <button onClick={() => removeKeyword(keyword)} className="ms-1 text-xs">✖</button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-full mb-3">
              <div className=" mb-3">
                <FormControl
                  required
                  type="textarea"
                  name="short_description"
                  label="Description"
                  value={form.short_description}
                  onChange={(e) => setform({ ...form, short_description: e })}
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

export default AddEditBlogs;
