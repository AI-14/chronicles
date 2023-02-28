import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useEditBlogMutation } from "../../hooks/blogs/useEditBlogMutation";
import { useGetBlogQuery } from "../../hooks/blogs/useGetBlogQuery";
import { categoryData } from "../../utils/categories";
import { reactQuillModules } from "../../utils/constants";
import { SelectCoverImage } from "./components/SelectCoverImage";

export const EditBlog = (): JSX.Element => {
  const authToken = localStorage.getItem("authToken");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [previewCoverImage, setPreviewCoverImage] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");
  const [coverImage, setCoverImage] = useState<File | null>();
  const [category, setCategory] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const { blogId } = useParams() as any;
  const navigate = useNavigate();

  const { data: _ } = useGetBlogQuery(
    blogId,
    authToken,
    (data: any) => {
      setTitle(data?.title);
      setSubtitle(data?.subtitle);
      setCategory(data?.category);
      setContent(data?.content);
    },
    (_: any) => {
      toast.error("Error in fetching blog. Please try again later.");
    }
  );

  const { mutate: editBlog } = useEditBlogMutation(
    (_: any) => {
      setIsLoading(false);
      navigate("/", { replace: true });
    },
    (_: any) => {
      setIsLoading(false);
      toast.error("Error in editing blog. Please try again later.");
    }
  );

  useEffect(() => {
    if (coverImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewCoverImage(reader.result as string);
      };
      reader.readAsDataURL(coverImage);
    } else {
      setPreviewCoverImage(null);
    }
  }, [coverImage]);

  const titleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value);
  };

  const subtitleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSubtitle(e.target.value);
  };

  const categoryOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCategory(e.target.value);
  };

  const coverImageOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files) {
      setCoverImage(files[0]);
    } else {
      setCoverImage(null);
    }
  };

  const validateFormData = (): boolean => {
    if (!title || !subtitle || !category) {
      toast.error("All fields are mandatory except the cover-image");
      return false;
    } else if (title.length < 10 || title.length > 255) {
      toast.error("Title must be between 10-255 characters");
      return false;
    } else if (subtitle.length < 10 || subtitle.length > 255) {
      toast.error("Subtitle must be between 10-300 characters");
      return false;
    }

    return true;
  };

  const submit = (e: React.MouseEvent<HTMLButtonElement>, status: string): void => {
    e.preventDefault();

    if (validateFormData()) {
      setIsLoading(true);

      const data = new FormData();
      data.append("title", title);
      data.append("subtitle", subtitle);

      if (coverImage) {
        data.append("cover_image", coverImage);
      }

      data.append("category", category);
      data.append("content", content);
      data.append("status", status);

      editBlog({ blogId, data, authToken });
    }
  };

  return (
    <div className="mx-auto max-w-[1080px] mt-20">
      <form className="w-full p-4 h-full">
        {/** Title */}
        <div className="flex flex-col items-start p-2">
          <label>Title</label>
          <input
            type="text"
            name="title"
            placeholder="Title of your blog... (10-255 characters)"
            minLength={10}
            maxLength={255}
            value={title}
            onChange={titleOnChange}
            className="border-[1.5px] border-slate-300 rounded-md text-sm w-full p-2 bg-transparent focus:border-purple-300 focus:outline-none"
          />
        </div>

        {/** Subtitle */}
        <div className="flex flex-col items-start p-2">
          <label>Sub-title</label>
          <input
            type="text"
            name="subtitle"
            placeholder="Sub-title of your blog... (10-300 characters)"
            min={10}
            maxLength={300}
            value={subtitle}
            onChange={subtitleOnChange}
            className="border-[1.5px] border-slate-300 rounded-md text-sm w-full p-2 bg-transparent focus:border-purple-300 focus:outline-none"
          />
        </div>

        {/** Categories */}
        <div className="flex justify-center gap-8 flex-wrap">
          {categoryData.map((cat, index) => (
            <div key={index} className="flex flex-col gap-2 font-bold">
              <label>{cat.label}</label>
              <input type="radio" name={cat.name} value={cat.value} checked={category === cat.value} onChange={categoryOnChange} />
            </div>
          ))}
        </div>

        <SelectCoverImage previewImage={previewCoverImage} onChangeHandler={coverImageOnChange} />

        {/** Editor */}
        <div className="w-full p-2">
          <ReactQuill theme="snow" modules={reactQuillModules} value={content} onChange={setContent} placeholder="Start writing :) ..." preserveWhitespace />
        </div>

        {/** Draft/publish buttons */}
        <div className="flex justify-center">
          <div className="flex justify-between gap-x-4 items-center w-1/2 p-2">
            <button
              type="button"
              onClick={(e) => {
                submit(e, "draft");
              }}
              className="rounded-md w-1/2 border-[1.5px] border-darkpurple hover:scale-105 duration-300"
            >
              {isLoading ? <ClipLoader color="#000000" loading={isLoading} size={15} aria-label="loading-spinner" data-testid="loader" /> : "Draft"}
            </button>
            <button
              type="button"
              onClick={(e) => {
                submit(e, "publish");
              }}
              className="rounded-md w-1/2 bg-darkpurple border-[1.9px] border-darkpurple hover:bg-lightpurple hover:scale-105 duration-300"
            >
              {isLoading ? <ClipLoader color="#000000" loading={isLoading} size={15} aria-label="loading-spinner" data-testid="loader" /> : "Publish"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
