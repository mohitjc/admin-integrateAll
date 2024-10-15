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
import Select from 'react-select';

const SiteDetails = () => {
  const { id } = useParams();
  const [images, setImages] = useState({ logo: "", fabIcon: "" });
  const [siteId, setSiteId] = useState()
  const [form, setForm] = useState({
    title: "",
    scripts: [],
    socialMediaEntries: [{ platform: "", link: "", icon: "" }],
  });
  const history = useNavigate();
  const user = useSelector((state) => state.user);

  const socialOptions = [
    { value: "Facebook", label: "Facebook" },
    { value: "Twitter", label: "Twitter" },
    { value: "Instagram", label: "Instagram" },
  ];

  useEffect(() => {
    if (user.id) {
      loader(true);
      ApiClient.allApi(shared.detailApi, { id: user.id }).then((res) => {
        console.log(res, "fnasdghkadsgds")
        if (res.success) {
          const { name, logo, fabIcon, scripts, socialMedia , id} = res.data;
          setForm({
            title: name,
            scripts: scripts ? scripts.map(script => ({ script })) : [],
            socialMediaEntries: socialMedia ? socialMedia.map(media => ({
              platform: media.website,
              link: media.link,
              icon: media.icon,
            })) : [],
          });
          setImages({ logo, fabIcon });
          setSiteId(id)
        }
        loader(false);
      });
    }
  }, [user.id]);

  const handleAddSocialMedia = () => {
    setForm((prevForm) => ({
      ...prevForm,
      socialMediaEntries: [
        ...prevForm.socialMediaEntries,
        { platform: "", link: "", icon: "" },
      ],
    }));
  };

  const handleRemoveSocialMedia = (index) => {
    setForm((prevForm) => ({
      ...prevForm,
      socialMediaEntries: prevForm.socialMediaEntries.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (index, field, value) => {
    const updatedEntries = form.socialMediaEntries.map((entry, i) =>
      i === index ? { ...entry, [field]: value } : entry
    );
    setForm({ ...form, socialMediaEntries: updatedEntries });
  };

  const handleIconChange = (index, iconUrl) => {
    const updatedEntries = form.socialMediaEntries.map((entry, i) =>
      i === index ? { ...entry, icon: iconUrl } : entry
    );
    setForm({ ...form, socialMediaEntries: updatedEntries });
  };

  const handleAddScript = () => {
    setForm((prevForm) => ({
      ...prevForm,
      scripts: [...(prevForm.scripts || []), { script: "" }],
    }));
  };

  const handleRemoveScript = (index) => {
    setForm((prevForm) => ({
      ...prevForm,
      scripts: (prevForm.scripts || []).filter((_, i) => i !== index),
    }));
  };

  const handleScriptChange = (index, value) => {
    const updatedScripts = (form.scripts || []).map((script, i) =>
      i === index ? { script: value } : script
    );
    setForm({ ...form, scripts: updatedScripts });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let invalid = methodModel.getFormError([], form);

    if (invalid) return;

    const value = {
      ...form,
      ...images,
      socialMedia: form.socialMediaEntries.map((entry) => ({
        website: entry.platform,
        link: entry.link,
        icon: entry.icon,
      })),
      scripts: form.scripts.map((entry) => entry.script),
    };

    const method = siteId ? "put" : "post";
    const url = siteId ? `site/editSiteDetail?id=${siteId}` : shared.addApi;

    loader(true);
    ApiClient.allApi(url, value, method).then((res) => {
      if (res.success) {
        history(`/${shared.url}`);
      } else {
        // Handle error scenario if needed
      }
      loader(false);
    });
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
        <div className="pprofile1 mb-10">
          <h4 className="p-4 border-b font-medium rounded-[5px] rounded-bl-[0] rounded-br-[0] flex items-center text-[#1E5DBC]">
            <img src="/assets/img/usero-blue.svg" className="me-3 bg-[#e9f0f8] p-2 rounded-md" />
            Site Information
          </h4>
          <div className="grid grid-cols-12 gap-4 p-4">
            <div className="lg:col-span-6 col-span-12 mb-3">
              <FormControl
                name="name"
                type="text"
                label="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e })}
                required
              />
            </div>
            <div className="lg:col-span-3 col-span-12 mb-3">
              <label className="lablefontcls">Choose Logo</label>
              <ImageUpload
                model="users"
                result={(e) => setImages((prev) => ({ ...prev, logo: e.value }))}
                value={images.logo || form.logo}
                multiple={false}
                label="Choose Logo"
              />
            </div>
            <div className="lg:col-span-3 col-span-12 mb-3">
              <label className="lablefontcls">Choose Fabicon</label>
              <ImageUpload
                model="users"
                result={(e) => setImages((prev) => ({ ...prev, fabIcon: e.value }))}
                value={images.fabIcon || form.fabIcon}
                multiple={false}
                label="Choose Fabicon"
              />
            </div>
            <div className="lg:col-span-12 col-span-12 mb-3">
           
              {form.socialMediaEntries.map((entry, index) => (
                <div  key={index}  className="grid grid-cols-12 gap-4 p-4">
                <div className="lg:col-span-6 col-span-12 mb-3">
                  <div className="flex">
                  <label className="mb-2">Social Media</label>
                  <button
                    type="button"
                    onClick={() => handleRemoveSocialMedia(index)}
                    className="ml-2 text-red-500"
                  >
                    Remove
                  </button>
                  </div>
               
                  <Select
                    options={socialOptions}
                    onChange={(selectedOption) => handleInputChange(index, 'platform', selectedOption.value)}
                    placeholder="Select Social Media"
                    className="mr-2"
                    value={socialOptions.find(option => option.value === entry.platform)}
                  />
                  </div>
                  <div className="lg:col-span-6 col-span-12 mb-3">
                  <FormControl
                    name={`socialLink${index}`}
                    type="text"
                    label="Link"
                    value={entry.link}
                    onChange={(e) => handleInputChange(index, 'link', e)}
                    required
                  />
                  </div>
                  <div className="lg:col-span-6 col-span-12 mb-3">
                  <ImageUpload
                    model="users"
                    result={(e) => handleIconChange(index, e.value)}
                    value={entry.icon}
                    multiple={false}
                    label="Choose Icon"
                    className="ml-2"
                  />
                  </div>

               
              
                </div>
              ))}
              <button type="button" onClick={handleAddSocialMedia} className="mt-2">
                Add Another Social Media
              </button>
            </div>
            <div className="lg:col-span-6 col-span-12 mb-3">
              <h4 className="mb-2">Scripts</h4>
              {form.scripts.map((scriptEntry, index) => (
                <div key={index} className="lg:col-span-6 col-span-12 mb-3">
                  <FormControl
                    name={`script${index}`}
                    type="textarea"
                    label={`Script ${index + 1}`}
                    value={scriptEntry.script}
                    onChange={(e) => handleScriptChange(index, e)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveScript(index)}
                    className="ml-2 text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={handleAddScript} className="mt-2">
                Add Another Script
              </button>
            </div>
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

export default SiteDetails;
