import { InputFieldProps } from "./types";

export const InputField = ({ label, type, name, placeholder, onChangeHandler, errorMsg }: InputFieldProps): JSX.Element => {
  return (
    <div className="flex flex-col items-start p-2 w-full">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={onChangeHandler}
        className="border-[1.5px] border-slate-300 rounded-md text-sm w-full p-2 bg-transparent focus:border-purple-300 focus:outline-none"
      />
      {errorMsg && <p className=" text-red-500 text-[0.6rem]">{errorMsg}</p>}
    </div>
  );
};
