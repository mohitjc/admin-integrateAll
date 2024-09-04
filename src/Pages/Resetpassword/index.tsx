import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import methodModel from "../../methods/methods";
import "./style.scss";
import AuthLayout from "../../components/AuthLayout";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { FiEye, FiEyeOff } from "react-icons/fi";


const Resetpassword = () => {
  const history = useNavigate();

  const user = useSelector((state: any) => state.user);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      history("/dashboard");
    }
  }, []);

  const formValidation = [
    {
      key: "confirmPassword",
      minLength: 8,
      confirmMatch: ["confirmPassword", "newPassword"],
    },
    { key: "newPassword", minLength: 8 },
  ];

  const [form, setForm]: any = useState({
    confirmPassword: "",
    newPassword: "",
    code: "",
    id: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [eyes, setEyes] = useState({ newPassword: false, confirmPassword: false });

  const getError = (key: any) => {
    return methodModel.getError(key, form, formValidation);
  };

  useEffect(() => {
    let prm = {
      // email: methodModel.getPrams('email'),
      id: methodModel.getPrams("id"),
      code: methodModel.getPrams("code"),
    };

    setForm({ ...form, ...prm });
  }, []);

  const hendleSubmit = (e: any) => {
    e.preventDefault();
    setSubmitted(true);
    let invalid = methodModel.getFormError(formValidation, form);
    if (invalid) return;
    loader(true);
    let payload = {
      password: form.newPassword,
      verificationCode: form.code,
      id: form.id,
    };
    ApiClient.put("user/reset/password", payload).then((res) => {
      if (res.success) {
        setTimeout(() => {
          toast.success(res.message);
        }, 100);

        history("/login");
      }
      loader(false);
    });
  };

  return (
    <>
      <AuthLayout>
        <form
          className="w-11/12 xl:w-4/12 lg:w-5/12 	mx-auto bg-[#fff] border border-[#00000024] p-[24px] rounded-[30px]"
          onSubmit={hendleSubmit}
        >
          <div className=" mb-4">
            <h3 className="text-[30px] font-semibold text-[#333] ">
              New Password
            </h3>
            <span className="flex w-10 h-1 bg-[#063688] mt-1"></span>
            <p className="text-[16px] font-normal text-[#333] mt-4 mb-4">
              Please create a new password that you don’t use on any other site.
            </p>
          </div>

          <div className="mb-3">
          <div className="relative">
                <div className="absolute  z-[99] p-3 px-4 bg-[#00358512] text-[#0035859c] rounded-tl-[7px] rounded-bl-[7px]">
                  <i className="fa fa-lock " aria-hidden="true"></i>
                </div>
                <input
                  type={eyes.newPassword ? "text" : "password"}
                  className="mb-5 relative  bg-white w-full  rounded-lg h-12 flex items-center gap-2 overflow-hidden  mb-0 bginput w-full pl-[55px]"
                  value={form.newPassword}
                  maxLength={16}
                  onChange={(e) =>
                    setForm({ ...form, newPassword: e.target.value })
                  }
                  placeholder="New Password"
                  required
                />
               {eyes.newPassword ? (
                    <FiEye
                      className="top-4 right-3 absolute text-[#333] cursor-pointer"
                      onClick={() =>
                        setEyes({ ...eyes, newPassword: !eyes.newPassword })
                      }
                    />
                  ) : (
                    <FiEyeOff
                      className="top-4 right-3 absolute text-[#333] cursor-pointer"
                      onClick={() =>
                        setEyes({ ...eyes, newPassword: !eyes.newPassword })
                      }
                    />
                  )}
              </div>

              {submitted && getError("newPassword").invalid ? (
                <div className="invalid-feedback d-block">
                  Min Length must be 8 characters long
                </div>
              ) : (
                <></>
              )}
            <div className="mb-3">
              {/* <label>Confirm Password<span className="start">*</span></label> */}

              <div className="relative">
              <div className="absolute  z-[99] p-3 px-4 bg-[#00358512] text-[#0035859c] rounded-tl-[7px] rounded-bl-[7px]">
                  <i className="fa fa-lock " aria-hidden="true"></i>
                </div>
                <input
                  type={eyes.confirmPassword ? "text" : "password"}
                  className="mb-5 relative  bg-white w-full  rounded-lg h-12 flex items-center gap-2 overflow-hidden  mb-0 bginput w-full pl-[55px]"
                  value={form.confirmPassword}
                  maxLength={16}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  placeholder="Confirm Password"
                  required
                />
                  {eyes.confirmPassword ? (
                    <FiEye
                      className="top-4 right-3 absolute text-[#333] cursor-pointer"
                      onClick={() =>
                        setEyes({ ...eyes, confirmPassword: !eyes.confirmPassword })
                      }
                    />
                  ) : (
                    <FiEyeOff
                      className="top-4 right-3 absolute text-[#333] cursor-pointer"
                      onClick={() =>
                        setEyes({ ...eyes, confirmPassword: !eyes.confirmPassword })
                      }
                    />
                  )}
              </div>
              {submitted && getError("confirmPassword").err.confirmMatch ? (
                <div className="invalid-feedback d-block">
                  Confirm Password is not matched with New Password
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className=" mt-6">
            <button
              type="submit"
              className="w-full text-white bg-[#063688]   focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center  mb-4"
            >
              Save
            </button>
          </div>

          {/* <p className='accopuntt'> Just Remember?<a class="sign_up" href="/login"> Sign Up</a></p> */}
        </form>
      </AuthLayout>
    </>
  );
};

export default Resetpassword;
