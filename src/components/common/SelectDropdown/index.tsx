import React from "react";
import HtmlT from "./html";

const SelectDropdown = ({intialValue,options,isSingle,valueType='string', result,displayValue='name',id,placeholder="Select Status",disabled=false,name,required=false,theme='normal'}:any) => {
    const handleChange=(e:any)=>{
        let v=e
        if(valueType=='object'){
            v=options.find((itm:any)=>itm.id==e)
        }
        result({event:"value",value:v})
    }

    return <>
        <HtmlT
        id={id}
        name={name}
        required={required}
        theme={theme}
        disabled={disabled}
        placeholder={placeholder}
        isSingle={isSingle}
        displayValue={displayValue}
        options={options}
        selectedValues={intialValue}
        handleChange={handleChange}
        />
    </>
}

export default SelectDropdown