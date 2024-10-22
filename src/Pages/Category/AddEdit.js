import React, { useState, useEffect } from "react";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/global/layout";
import { Tooltip } from "antd";
import FormControl from "../../components/common/FormControl";
import shared from "./shared";
import { useSelector } from "react-redux";
import ImageUpload from "../../components/common/ImageUpload";

const AddEdit = () => {
  const { id } = useParams();
  const [formFields, setFormFields] = useState({ categories: [{ name: "", categoryType: "" }] });
  const [images, setImages] = useState([{}]); 
  const [lastCategoryType, setLastCategoryType] = useState(""); // Step 1: New state for last category type
  const history = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const user = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    let invalid = formFields.categories.some((field) => !field.name || !field.categoryType);
  
    if (invalid) return;
  
    const payload = id ? 
    {
      ...formFields.categories[0],
      image: images[0]?.image || "",
      id:id 
    } :
    {
      categories: formFields.categories.map((field, index) => ({
        ...field,
        image: images[index]?.image || "",
      })),
    };
    let method = id ? "put" : "post";
    let url = id ? shared.editApi : shared.addApi;
  
    loader(true);
    ApiClient.allApi(url, payload, method).then((res) => {
      if (res.success) {
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
          const value = res.data;
          setFormFields({ categories: [{ name: value.name, categoryType: value.categoryType }] });
          setImages([{ image: value.image }]);
          setLastCategoryType(value.categoryType); // Set the last category type from fetched data
        }
        loader(false);
      });
    }
  }, [id]);

  const imageResult = (e, index) => {
    const updatedImages = [...images]; 
    updatedImages[index] = { image: e.value };
    setImages(updatedImages);
    
    if (submitted) {
      setSubmitted(false);
    }
  };

  const addField = () => {
    setFormFields((prev) => ({
      categories: [...prev.categories, { name: "", categoryType: lastCategoryType }] // Step 3: Use lastCategoryType
    }));
  };

  const removeField = (index) => {
    setFormFields((prev) => ({
      categories: prev.categories.filter((_, i) => i !== index)
    }));
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center mb-8">
          <Tooltip placement="top" title="Back">
            <Link
              to={`/${shared.url}`}
              className="!px-4 py-2 flex items-center justify-center rounded-lg shadow-btn hover:bg-[#1E5DBC] hover:text-white border transition-all bg-white mr-3"
            >
              <i className="fa fa-angle-left text-lg"></i>
            </Link>
          </Tooltip>
          <div>
            <h3 className="text-lg lg:text-2xl font-semibold text-[#111827]">
              {id ? "Edit" : "Add"} {shared.addTitle}
            </h3>
            <p className="text-xs lg:text-sm font-normal text-[#75757A]">
              Here you can see all about your {shared.addTitle}
            </p>
          </div>
        </div>
        <div className="pprofile1 mb-10 ">
          <h4 className="p-4 border-b font-medium rounded-[5px] flex items-center text-[#1E5DBC] ">
            <img src="/assets/img/usero-blue.svg" className="me-3 bg-[#e9f0f8] p-2 rounded-md" />
            Basic Information
          </h4>
          {formFields.categories.map((field, index) => (
            <div className="grid grid-cols-12 gap-4 p-4" key={index}>
              <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  type="text"
                  label="Name"
                  value={field.name}
                  onChange={(e) => {
                    const updatedFields = [...formFields.categories];
                    updatedFields[index].name = e;
                    setFormFields({ categories: updatedFields });
                  }}
                  required
                />
              </div>
              <div className="lg:col-span-6 col-span-12 mb-3">
                <FormControl
                  type="select"
                  label="Type"
                  value={field.categoryType}
                  options={shared.types}
                  theme="search"
                  onChange={(e) => {
                    const updatedFields = [...formFields.categories];
                    updatedFields[index].categoryType = e;
                    setFormFields({ categories: updatedFields });
                    setLastCategoryType(e); // Update lastCategoryType when changed
                  }}
                  required
                />
              </div>
              <div className="lg:col-span-6 col-span-12 mb-3">
                <label className="block mb-2">Icon</label>
                <ImageUpload
                  model="users"
                  result={(e) => imageResult(e, index)} 
                  value={images[index]?.image || ""}
                  multiple={false}
                  label="Choose Icon"
                />
              </div>
              {index >= 1 && (
                <div className="lg:col-span-6 col-span-12 mb-3">
                  <button type="button" onClick={() => removeField(index)} className="text-red-500">
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}
          <div className="text-right mb-4">
            <button type="button" onClick={addField} className="text-white bg-[#1E5DBC] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2">
              Add Another Field
            </button>
          </div>
        </div>
        <div className="text-right">
          <button
            type="submit"
            className="text-white bg-[#1E5DBC] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
          >
            Save
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default AddEdit;

