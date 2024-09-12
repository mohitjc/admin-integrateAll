import React, { useEffect, useState } from "react";
import methodModel from "../../../methods/methods";
import Html from "./html";

const MultiSelectDropdown = ({
  intialValue,
  placeholder='Select',
  options,
  result,
  displayValue = "name",
  className='select capitalize',
  disabled=false,
  required=false,
  id,
}) => {
  const [selectedValues, setSelectedValues] = useState([]);

  const handleChange = (e) => {
    let isAll = e.find(function (option) {
      return option.value === "all";
    });
    if (isAll) {
      let value = [];
      value = options?.map((itm) => {
        return itm.id;
      });
      result({ event: "value", value: value });
    } else {
      let value = [];
      value = e.map((itm) => {
        return itm.value;
      });
      result({ event: "value", value: value });
    }
    // let value = [];
    // value = e.map((itm) => {
    //   return itm.value;
    // });
    // result({ event: "value", value: value });
  };

  useEffect(() => {
    let value = [];
    if (intialValue?.length && options?.length) {
      value = intialValue?.map((itm) => {
        return {
          ...methodModel.find(options, itm, "id"),
          value: methodModel.find(options, itm, "id")?.id || "",
          label:
            methodModel.find(options, itm, "id")?.[displayValue] || "Not Exist",
        };
      });
    }
    setSelectedValues(value);
  }, [intialValue, options]);

  return (
    <>
      <Html
      className={className}
        id={id}
        required={required}
        disabled={disabled}
        displayValue={displayValue}
        placeholder={placeholder}
        options={options}
        selectedValues={selectedValues}
        handleChange={handleChange}
      />
    </>
  );
};

export default MultiSelectDropdown;
