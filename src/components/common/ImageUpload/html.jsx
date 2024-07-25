import React from "react";
import methodModel from "../../../methods/methods";
import { FiPlus } from "react-icons/fi";

const Html = ({
  inputElement,
  uploadImage,
  img,
  remove,
  loader,
  model,
  multiple,
  required,
  err,
  label = "",
}) => {
  return (
    <>
      <label
        className={`block cursor-pointer text-gray-500 bg-white border-2 border-dashed border-[#063688] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-8 py-4 text-center ${
          img && !multiple ? "d-none" : ""
        }`}
      >
        <input
          type="file"
          className="hidden"
          ref={inputElement}
          accept="image/*"
          multiple={multiple ? true : false}
          disabled={loader}
          onChange={(e) => {
            uploadImage(e);
          }}
        />
        <div className="flex flex-col items-center justify-center">
          <FiPlus className="text-2xl text-[#063688]" />
          <span>{label || "Please upload images"}</span>
        </div>
      </label>

      {loader ? (
        <div className="text-success text-center mt-2">
          Uploading... <i className="fa fa-spinner fa-spin"></i>
        </div>
      ) : (
        <></>
      )}

      {multiple ? (
        <>
          <div className="imagesRow">
            {img &&
              img.map((itm, i) => {
                return (
                  <div className="imagethumbWrapper">
                    <img
                      src={methodModel.noImg(itm, model)}
                      className="thumbnail"
                    />
                    <i
                      className="fa fa-times"
                      title="Remove"
                      onClick={(e) => remove(i)}
                    ></i>
                  </div>
                );
              })}
          </div>
        </>
      ) : (
        <>
          {img ? (
            <div className="imagethumbWrapper">
              <img src={methodModel.noImg(img, model)} className="thumbnail" />
              <i
                className="fa fa-times"
                title="Remove"
                onClick={(e) => remove()}
              ></i>
            </div>
          ) : (
            <></>
          )}
        </>
      )}

      {required && !img ? (
        <div className="text-danger">{err ? err : "Image is Required"}</div>
      ) : (
        <></>
      )}
    </>
  );
};
export default Html;
