import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
import { preview } from "../assets";
import { getRandomPrompt } from "../utils/utils";
import Loader from "../components/Loader";

const CreatePost = () => {
  const [formFields, setFormFields] = useState({
    name: "",
    prompt: "",
    photo: "",
  });
  const navigate = useNavigate();

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(formFields.prompt);
    setFormFields({ ...formFields, prompt: randomPrompt });
  };

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const changeHandler = (event) => {
    setFormFields((prevFields) => {
      return { ...prevFields, [event.target.name]: event.target.value };
    });
  };

  const generateImage = async () => {
    if (formFields.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch(
          "https://cheerful-deer-skirt.cyclic.app/api/v1/dalle",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: formFields.prompt,
            }),
          }
        );

        const data = await response.json();
        setFormFields({
          ...formFields,
          photo: `data:image/jpeg;base64,${data.photo}`,
        });
      } catch (err) {
        console.log(err);
        alert(err);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert("Please enter a prompt");
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (formFields.prompt && formFields.photo) {
      setLoading(true);
      try {
        const response = await fetch(
          "https://cheerful-deer-skirt.cyclic.app/api/v1/post",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...formFields }),
          }
        );

        await response.json();
        alert("Success");
        navigate("/");
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please generate an image with proper details");
    }
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Create</h1>
        <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">
          Generate an imaginative image through DALL-E AI and share it with the
          community
        </p>
      </div>

      <form className="mt-16 max-w-3xl" onSubmit={submitHandler}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="Ex., john doe"
            value={formFields.name}
            changeHandler={changeHandler}
          />

          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="An Impressionist oil painting of sunflowers in a purple vase…"
            value={formFields.prompt}
            changeHandler={changeHandler}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />

          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
            {formFields.photo ? (
              <img
                src={formFields.photo}
                alt={formFields.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className=" text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? "Generating..." : "Generate"}
          </button>
        </div>

        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">
            ** Once you have created the image you want, you can share it with
            others in the community **
          </p>
          <button
            type="submit"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? "Sharing..." : "Share with the Community"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
