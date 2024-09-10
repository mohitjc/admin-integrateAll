import React, { useEffect, useRef, useState } from "react";
import ApiClient from "../../../methods/api/apiClient";
import Html from "./html";
import "./style.scss";

const ImageUpload = ({
  model,
  result,
  accept="image/*",
  value,
  multiple,
  required,
  err,
  label = "",
  type="img"
}) => {
  const inputElement = useRef();
  const [img, setImg] = useState("");
  const [loading, setLoader] = useState(false);

  const uploadImage = async (e) => {
    let url = "upload/multiple-images";
      let key='files'
    let files = e.target.files;
    // if (multiple) {
    //   url = "upload/multiple-images";
    //   key='files'
    // }

    let images = [];
    if (img) images = img;

    setLoader(true);
    ApiClient.multiImageUpload(url, files, {}, key).then((res) => {
      console.log("res", res);
      e.target.value='';
      if (res.success) {
        let image = res.files.map((itm) => itm.fileName);
        // let image = [res.fileName]
        if (!multiple) {
          setImg(image[0]);
          result({ event: "value", value: image[0] });
        } else {
          images = [...images, ...image];
          setImg(images);
          result({ event: "value", value: images });
        }
      }
      setLoader(false);
    });
  };

  const remove = (index) => {
    if (multiple) {
      let images = img.filter((itm, idx) => idx !== index);
      result({ event: "remove", value: images });
      setImg(images);
    } else {
      result({ event: "remove", value: "" });
      setImg("");
    }
  };

  useEffect(() => {
    setImg(value);
  }, [value]);

  return (
    <>
      <Html
      type={type}
        label={label}
        multiple={multiple}
        inputElement={inputElement}
        uploadImage={uploadImage}
        img={img}
        model={model}
        accept={accept}
        required={required}
        loader={loading}
        err={err}
        remove={remove}
      />
    </>
  );
};
export default ImageUpload;
