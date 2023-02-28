import React from "react";
import { categoryData } from "../../../utils/categories";
import { CategorySelectionProps } from "../types";

export const CategorySelection = ({ catIndex, setCatIndex }: CategorySelectionProps): JSX.Element => {
  const categories = [{ label: "all", name: "all", value: "all" }, ...categoryData];

  return (
    <div className="grid grid-cols-5 sm:grid-cols-11 content-center gap-2 p-2">
      {categories.map((category, index) => (
        <button
          key={index}
          onClick={() => setCatIndex({ index: index, cat: category.name })}
          className={`${
            catIndex.index === index ? "border-purple-300 shadow-md shadow-slate-300 bg-purple-200 scale-110 duration-300" : ""} 
            border-2 rounded-full flex justify-center items-center font-bold text-[0.55rem] sm:text-[0.7rem] p-2 w-full 
            hover:bg-purple-200`}
        >
          {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
        </button>
      ))}
    </div>
  );
};
