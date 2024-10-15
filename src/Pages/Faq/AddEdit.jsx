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

const AddEditFaq = () => {
  const { id } = useParams();

  const [images, setImages] = useState({ image: "" });
  const [form, setform] = useState({
    question: "",
    answer: "", 
    categoryId:""
  });
  const history = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [categories, setCategories] = useState([]);
  const user = useSelector((state) => state.user);
 

  const formValidation = [
    { key: "question", required: true },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    let invalid = methodModel.getFormError(formValidation, form);

    if (invalid) return;
    let method = "post";
    let value ;
    let url = shared.addApi;
   value = {
      ...form,
    };

    if (id) {
      method = "put";
      url = shared.editApi;
      value = {
        ...form,
        id : id
      };
    } else {
      delete value.id;
    }

    loader(true);
    ApiClient.allApi(url, value, method).then((res) => {
      console.log(res,"categoryresponse")
      if (res.success) {
        history(`/${shared.url}`);
      }
      loader(false);
    });
  };

const getCategories=()=>{
  ApiClient.get('category/listing',{status:'active',categoryType:'FAQ'}).then(res=>{
    if(res.success){
      setCategories(res.data)
    }
  })
}

  useEffect(() => {
    if (id) {
      loader(true);
      ApiClient.get(shared.detailApi, { id }).then((res) => {
        console.log(res,"reponseeeee")
        if (res.success) {    
          setform({...form,question : res?.data?.question , answer : res?.data?.answer , categoryId:res?.data?.categoryId})
        }
        loader(false);
      });
    }
    getCategories()
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
            
              </div>
            </div>
          <div className="pprofile1 p-[15px]">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className=" mb-3">
                <FormControl
                  type="text"
                  label="Question"
                  value={form.question}
                  onChange={(e) => setform({ ...form, question: e })}
                  required
                />
              </div>
              <div className=" mb-3">
                <FormControl
                  type="select"
                  label="Category"
                  value={form.categoryId}
                  theme="search"
                  options={categories}
                  onChange={(e) => setform({ ...form, categoryId: e })}
                  required
                />
              </div> 
              <div className=" mb-3">
                <FormControl
                  type="textarea"
                  name="answer"
                  label="Answer"
                  value={form.answer}
                  onChange={(e) => setform({ ...form, answer: e })}
                  required
                />
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
          </div>
        </form>
      </Layout>
    </>
  );
};

export default AddEditFaq;
