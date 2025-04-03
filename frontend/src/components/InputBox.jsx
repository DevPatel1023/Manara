import React from "react";

const InputBox = ({ title, placeholder, type, name , value , onChange,style}) => {
  return (
    <div className="w-full mb-4">
      <label htmlFor={name} className="block items-start text-black text-sm  font-normal mt-3 mb-2 text-left dark:text-white">{title}</label> 
      <input 
      type={type} 
      name={name} 
      id={title} 
      placeholder={placeholder} 
      value={value} 
      onChange={onChange} className={`shadow appearance-none rounded border w-full py-2 px-3 text-gray-800 leading-tight focus:shadow-outline ${style}`}/>
    </div>
  );
};

export default InputBox;
