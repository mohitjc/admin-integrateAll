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
import Select from "react-select";
import { MdDelete } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";

const SiteDetails = () => {
  const { id } = useParams();
  const [images, setImages] = useState({ logo: "", fabIcon: "" });
  const [siteId, setSiteId] = useState();
  const [form, setForm] = useState({
    name: "",
    script: [{ script: "" }],
    socialMedia: [{ name: "", link: "", icon: "" }],
  });
  const history = useNavigate();
  const user = useSelector((state) => state.user);

  const socialOptions = [
    { value: "Facebook", label: "Facebook" },
    { value: "Twitter", label: "Twitter" },
    { value: "Instagram", label: "Instagram" },
  ];

  // useEffect(() => {
  //   if (user.id) {
  //     loader(true);
  //     ApiClient.allApi(shared.detailApi, { id: user.id }).then((res) => {
  //       if (res.success) {
  //         const { name, logo, fabIcon, script = [], socialMedia , id} = res.data;
  //         setForm({
  //           name: name,
  //           script: script ? script?.map(script => ({ script:script.dfdffsdfdfd })) : [],
  //           socialMedia: socialMedia ? socialMedia.map(media =>({

  //             name: media.website,
  //             link: media.link,
  //             icon: media.icon,
  //           })) : [],
  //         });
  //         setImages({ logo, fabIcon });
  //         setSiteId(id)
  //       }
  //       loader(false);
  //     });
  //   }
  // }, []);
  useEffect(() => {
    if (user.id) {
      loader(true);
      ApiClient.allApi(shared.detailApi).then((res) => {
        if (res.success) {
          const {
            name,
            logo,
            fabIcon,
            script = [],
            socialMedia,
            id,
          } = res.data;
          const scriptArray = script.map((s) => ({ script: s?.script }));

          setForm({
            name: name,
            // script: Array.isArray(script) ? script.map(script => ({ script: script.script })) : [],
            script: scriptArray,
            socialMedia: socialMedia
              ? socialMedia.map((media) => ({
                  name: media.name,
                  link: media.link,
                  icon: media.icon,
                }))
              : [],
          });
          setImages({ logo, fabIcon });
          setSiteId(id);
        }
        loader(false);
      });
    }
  }, [user.id]);

  const handleAddSocialMedia = () => {
    setForm((prevForm) => ({
      ...prevForm,
      socialMedia: [...prevForm.socialMedia, { name: "", link: "", icon: "" }],
    }));
  };

  const handleRemoveSocialMedia = (index) => {
    setForm((prevForm) => ({
      ...prevForm,
      socialMedia: prevForm.socialMedia.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (index, field, value) => {
    const updatedEntries = form.socialMedia.map((entry, i) =>
      i === index ? { ...entry, [field]: value } : entry
    );
    setForm({ ...form, socialMedia: updatedEntries });
  };

  const handleIconChange = (index, iconUrl) => {
    const updatedEntries = form.socialMedia.map((entry, i) =>
      i === index ? { ...entry, icon: iconUrl } : entry
    );
    setForm({ ...form, socialMedia: updatedEntries });
  };

  const handleAddScript = () => {
    setForm((prevForm) => ({
      ...prevForm,
      script: [...prevForm.script, { script: "" }],
    }));
  };

  const handleRemoveScript = (index) => {
    setForm((prevForm) => ({
      ...prevForm,
      script: prevForm.script.filter((_, i) => i !== index),
    }));
  };

  const handleScriptChange = (index, value) => {
    const updatedScripts = form.script.map((script, i) =>
      i === index ? { script: value } : script
    );
    setForm({ ...form, script: updatedScripts });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let invalid = methodModel.getFormError([], form);

    if (invalid) return;
    const scriptsArray = form.script.map((entry) => ({
      [`script`]: entry.script,
    }));
    const value = {
      ...form,
      ...images,
      //   script: form.script.reduce((acc, entry, index) => {
      //     acc[`script${index + 1}`] = entry.script;
      //     return acc;
      // }),
      script: scriptsArray,
      ...(siteId ? { id: siteId } : {}),
    };
    const method = siteId ? "put" : "post";
    const url = siteId ? `site/editSiteDetail?id=${siteId}` : shared.addApi;

    loader(true);
    ApiClient.allApi(url, value, method).then((res) => {
      if (res.success) {
        history(`/${shared.url}`);
      }
      loader(false);
    });
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center mb-8">
          {/* <Tooltip placement="top" title="Back">
            <Link
              to={`/${shared.url}`}
              className="!px-4 py-2 flex items-center justify-center rounded-lg shadow-btn hover:bg-[#1E5DBC] hover:text-white border transition-all bg-white mr-3"
            >
              <i className="fa fa-angle-left text-lg"></i>
            </Link>
          </Tooltip> */}
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
            <img
              src="/assets/img/usero-blue.svg"
              className="me-3 bg-[#e9f0f8] p-2 rounded-md"
            />
            Site Information
          </h4>
          <div className="grid grid-cols-12 items-center gap-4 p-4">
            <div className="lg:col-span-6 col-span-12 mb-3">
              <FormControl
                name="name"
                type="text"
                label="Title"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e })}
                required
              />
            </div>
            <div className="lg:col-span-3 col-span-12 mb-3">
              <label className="lablefontcls">Choose Logo</label>
              <ImageUpload
                model="users"
                result={(e) =>
                  setImages((prev) => ({ ...prev, logo: e.value }))
                }
                value={images.logo || form.logo}
                multiple={false}
                label="Choose Logo"
              />
            </div>
            <div className="lg:col-span-3 col-span-12 mb-3">
              <label className="lablefontcls">Choose Fabicon</label>
              <ImageUpload
                model="users"
                result={(e) =>
                  setImages((prev) => ({ ...prev, fabIcon: e.value }))
                }
                value={images.fabIcon || form.fabIcon}
                multiple={false}
                label="Choose Fabicon"
              />
            </div>
            <div className="lg:col-span-12 col-span-12 mb-3">
              <button
                type="button"
                onClick={handleAddSocialMedia}
                className="flex items-center text-[#1E5DBC] font-[600]"
              >
                Add Another Social Media{" "}
                <IoIosAddCircleOutline className="ml-3 text-[21px] text-[#1e5dbc]" />
              </button>
              {form.socialMedia.map((entry, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-4 bg-white shadow-lg p-5 border rounded-lg mb-3 "
                >
                  <div className="lg:col-span-12 col-span-12 mb-3 border-b pb-3 flex justify-between gap-5 ">
                    {index >= 1 && (
                      <MdDelete
                        className="text-[red] shadow-lg w-[30px] h-[30px] border rounded-full p-2 cursor-pointer"
                        onClick={() => handleRemoveSocialMedia(index)}
                      />
                    )}
                  </div>

                  <div className="lg:col-span-6 col-span-12 mb-3">
                    <div className="flex justify-between	">
                    </div>
                    {/* <Select
                      options={socialOptions}
                      onChange={(selectedOption) =>
                        handleInputChange(index, "name", selectedOption.value)
                      }
                      placeholder="Select Social Media"
                      className="mr-2 w-[100%]"
                      value={socialOptions.find(
                        (option) => option.value === entry.name
                      )}
                    /> */}
                    {/* <div className="lg:col-span-6 col-span-12 mb-3"> */}
                    <FormControl
                      name="name"
                      type="text"
                      label="Social Media Name"
                      value={entry.name}
                      onChange={(e) => handleInputChange(index, "name", e)}
                      required
                    />
                    {/* </div> */}
                  </div>
                  <div className="lg:col-span-6 col-span-12 mb-3">
                    <FormControl
                      name={`socialLink${index}`}
                      type="text"
                      label="Link"
                      value={entry.link}
                      onChange={(e) => handleInputChange(index, "link", e)}
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
            </div>
            <div className="col-span-12 mb-3">
              <div>
                <button
                  type="button"
                  onClick={handleAddScript}
                  className="mb-3 flex items-center text-[#1E5DBC] font-[600]"
                >
                  Add Another Script{" "}
                  <IoIosAddCircleOutline className="ml-3 text-[21px] text-[#1e5dbc]" />
                </button>
              </div>

              <div className="grid grid-cols-12 gap-5">
                {form.script?.map((scriptEntry, index) => (
                  <div
                    key={index}
                    className="lg:col-span-6 col-span-12 shadow-lg p-5 border rounded-lg"
                  >
                    <div className="flex justify-between">
                      <label className="mb-2">Script</label>
                      {index >= 1 && (
                        <MdDelete
                          className="text-[red]"
                          onClick={() => handleRemoveScript(index)}
                        />
                      )}
                    </div>
                    <FormControl
                      name={`script${index + 1}`}
                      type="textarea"
                      value={scriptEntry.script}
                      onChange={(e) => handleScriptChange(index, e)}
                      required
                    />
                  </div>
                ))}
              </div>
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
