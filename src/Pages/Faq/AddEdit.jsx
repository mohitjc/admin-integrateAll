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
  const faqId = id ? parseInt(id, 10) : null;
  const history = useNavigate();
  
  const [form, setForm] = useState({
    faqDetail: [{ question: "", answer: "", categoryId: "" }]
  });
  const [submitted, setSubmitted] = useState(false);
  const [categories, setCategories] = useState([]);
  const user = useSelector((state) => state.user);

  const formValidation = [
    { key: "question", required: true },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const invalid = form.faqDetail.some(faq => methodModel.getFormError(formValidation, faq));

    if (invalid) return;

    const method = id ? "put" : "post";
    const url = id ? shared.editApi : shared.addApi;
    loader(true);

    const payload = faqId
    ? {
        id: faqId,
        question: form.faqDetail[0].question,
        answer: form.faqDetail[0].answer,
        categoryId: form.faqDetail[0].categoryId,
      } 
    : { faqs: form.faqDetail };
    ApiClient.allApi(url, payload, method).then((res) => {
      loader(false);
      if (res.success) {
        history(`/${shared.url}`);
      }
    });
  };

  const getCategories = () => {
    ApiClient.get('category/listing', { status: 'active', categoryType: 'FAQ' }).then(res => {
      if (res.success) {
        setCategories(res.data);
      }
    });
  };

  useEffect(() => {
    if (id) {
      loader(true);
      ApiClient.get(shared.detailApi, { id }).then((res) => {
        if (res.success) {
          setForm({faqDetail:[{ question: res?.data?.question, answer: res?.data?.answer, categoryId: res?.data?.categoryId }] });
        }
        loader(false);
      });
    }
    getCategories();
  }, [id]);

  const handleAddFaq = () => {
    setForm((prevForm) => ({
      ...prevForm,
      faqDetail: [...prevForm.faqDetail, { question: "", answer: "", categoryId: "" }]
    }));
  };

  const handleChange = (index, key, value) => {
    const updatedFaqs = form.faqDetail?.map((faq, i) => (
      i === index ? { ...faq, [key]: value } : faq
    ));
    setForm({ faqDetail: updatedFaqs });
  };

  const handleRemoveFaq = (index) => {
    const updatedFaqs = form.faqDetail.filter((_, i) => i !== index);
    setForm({ faqDetail: updatedFaqs });
  };

  return (
    <>
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
            </div>
          </div>
          
          <div className="pprofile1">
            <h4 className="p-4 border-b font-medium rounded-[5px] rounded-bl-[0] rounded-br-[0] flex items-center text-[#1E5DBC]">
              <img src="/assets/img/usero-blue.svg" className="me-3 bg-[#e9f0f8] p-2 rounded-md" />
              Basic Information
            </h4>
            <div className="p-[15px]">
              {form.faqDetail.map((faq, index) => (
                <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div className="mb-3">
                    <FormControl
                      type="text"
                      label="Question"
                      value={faq.question}
                      onChange={(e) => handleChange(index, 'question', e)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <FormControl
                      type="select"
                      label="Category"
                      value={faq.categoryId}
                      theme="search"
                      options={categories}
                      onChange={(e) => handleChange(index, 'categoryId', e)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <FormControl
                      type="textarea"
                      name="answer"
                      label="Answer"
                      value={faq.answer}
                      onChange={(e) => handleChange(index, 'answer', e)}
                      required
                    />
                  </div>
                  {index >=1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(index)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                  )}
                </div>
              ))}
              <div className="text-right">
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="text-white bg-[#1E5DBC] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 mx-3"
                >
                  Add Another FAQ
                </button>
                <button
                  type="submit"
                  className="text-white bg-[#1E5DBC] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </Layout>
    </>
  );
};

export default AddEditFaq;
