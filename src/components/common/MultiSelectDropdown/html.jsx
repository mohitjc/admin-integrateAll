import React from "react";
import "./style.scss";
import Select from "react-select";

const Html = ({ options, selectedValues, handleChange, displayValue, id }) => {
  let _options = options?.map((itm) => {
    return { value: itm.id, label: itm[displayValue] };
  });

  if (_options?.length > 1 && options?.length - selectedValues?.length > 1) {
    _options = [
      {
        value: "all",
        label: "Select All",
      },
    ].concat(_options);
  }

  return (
    <>
      <div className="selectDropdown">
        <Select
          defaultValue={displayValue}
          isMulti
          value={selectedValues || []}
          // options={
          //   options?.map((itm) => {
          //     return { value: itm.id, label: itm[displayValue] };
          //   }) || []
          // }
          options={_options}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={(e) => handleChange(e)}
        />
      </div>
    </>
  );
};

export default Html;
