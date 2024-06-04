import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../methods/api/apiClient";
import loader from "../../methods/loader";
import { Link } from "react-router-dom";
import "./style.scss";
import AuthLayout from "../../components/AuthLayout";
import methodModel from "../../methods/methods";
import { useDispatch, useSelector } from "react-redux";
import { login_success } from "../actions/user";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const history = useNavigate();
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user && user?.loggedIn) {
      history("/dashboard");
    }
  }, []);

  const [ip, setIp] = useState("");
  const [username, setUsername] = useState("");
  const [attandanceEmail, setAttendanceEmail] = useState("");
  const [remember, setRemember] = useState(false);
  const [password, setPassword] = useState("");
  const [eyes, setEyes] = useState({
    password: false,
    confirmPassword: false,
    currentPassword: false,
  });
  const [step, setStep] = useState(1);
  const [otp, setOTP] = useState("");
  const [resp, setRes]: any = useState();
  useEffect(() => {
    let r = localStorage.getItem("remember");
    if (r) {
      let data = JSON.parse(r);
      setUsername(data.email);
      setPassword(data.password);
      setRemember(true);
    }

    // Using an HTTP GET request to ipinfo.io/json

    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        let ip = data.ip;
        localStorage.setItem("IP", ip);
        setIp(ip);
      })
      .catch((error) => console.error("Error fetching IP address:", error));

    let email = methodModel.getPrams("email");
    if (email) setUsername(email);
  }, []);
  let attendance = methodModel.getPrams("attendance");
  const setLogin = async (data: any) => {
    let url = "/profile";
    let eventId = methodModel.getPrams("eventId");

    if (eventId) {
      if (methodModel.getPrams("attended")) {
        try {
          const res = await ApiClient.get(
            `api/attandance?email=${data?.email}&eventId=${eventId}`
          );
          console.log(res.success, "res.success");
          if (res.success === true) {
            url = `/thanku`;
          }
        } catch (error) {
          console.error("Error fetching attendance:", error);
        }
      } else {
        url = `/event/detail/${eventId}`;
      }
    }

    localStorage.setItem("token", data.access_token);
    dispatch(login_success(data));
    history(url);
  };

  const hendleSubmit = (e: any) => {
    e.preventDefault();
    let data: any = {
      email: username,
      password,
      ip_address: ip,
    };

    let url = "user/admin/login";
    if (step == 2) {
      url = "api/two-factor/auth";
      data = {
        id: resp?._id,
        otp: otp,
        ip_address: ip,
      };
    }

    loader(true);
    ApiClient.post(url, data).then(async (res) => {
      if (res.success == true) {
        if (remember) {
          localStorage.setItem("remember", JSON.stringify(data));
        } else {
          localStorage.removeItem("remember");
        }
        if (res.data.two_factor_email_sent || step == 1) {
          setStep(2);
          setRes(res.data);
          setLogin(res.data);
        } else {
          // setLogin(res.data)
        }
        const loginTime = new Date();
        localStorage.setItem("loginTime", loginTime.toISOString());
      }
      loader(false);
    });
  };
  const handleAttendence = (e: any) => {
    e.preventDefault();
    let eventId = methodModel.getPrams("eventId");
    loader(true);
    ApiClient.post("api/find/user", { email: attandanceEmail }, "", true).then(
      (res2) => {
        if (res2.success) {
          let url = `/login?eventId=${eventId}&email=${attandanceEmail}&attended=true`;
          history(url);
        } else {
          let url = `/signup?eventId=${eventId}&email=${attandanceEmail}&attended=true`;
          history(url);
        }
        loader(false);
      }
    );
  };

  return (
    <>
      <AuthLayout>
        {attendance === "true" ? (
          <form onSubmit={handleAttendence}>
            <div>
              <input
                type="email"
                className="shadow-box bg-white mb-6 w-full text-sm placeholder:text-gray-500 rounded-lg h-10 flex items-center gap-2 overflow-hidden px-2 !ring-primary !outline-primary"
                placeholder="Email address"
                value={attandanceEmail}
                onChange={(e) => setAttendanceEmail(e.target.value)}
                required
              />
            </div>
            <div className="mt-8">
              {/* <label><input type="checkbox" checked={remember} onChange={(e)=>setRemember(e.target.checked)} className="mr-2" /> Remember Me</label> */}
              <button
                type="submit"
                className="!px-4 w-full text-sm font-normal text-white h-11 flex items-center justify-center gap-2 !bg-[#EB6A59] rounded-lg shadow-btn hover:opacity-80 transition-all focus:ring-2 ring-[#EDEBFC] disabled:bg-[#D0CAF6] disabled:cursor-not-allowed"
              >
                Mark Attendence
              </button>
            </div>
          </form>
        ) : (
          <form className="w-11/12 md:w-7/12	mx-auto" onSubmit={hendleSubmit}>
           <div className="">
              <h1 className="text-[40px] font-semibold text-white ">Sign In</h1>
              <span className="flex w-10 h-1 bg-[#EB6A59] mt-1"></span>
            </div>
            <p className="text-[20px] font-normal text-white mt-4">
              Please enter your valid details
            </p>
            {step == 1 ? (
              <div className="mt-5">
                <input
                  type="text"
                  className="mb-4 w-full text-sm text-white  h-10 flex items-center gap-2 overflow-hidden bg-transparent border-b border-white/37"
                  placeholder="Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  // disabled={methodModel.getPrams('attended')?true:false}
                  required
                />
                <div className="relative mb-6">
                  <input
                    type={eyes.password ? "text" : "password"}
                    className="mb-4 w-full text-sm text-white  h-10 flex items-center gap-2 overflow-hidden bg-transparent border-b border-white/37"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                  />
                     {eyes.password ? (
                    <FiEye
                      className="top-3 right-3 absolute text-white cursor-pointer"
                      onClick={() =>
                        setEyes({ ...eyes, password: !eyes.password })
                      }
                    />
                  ) : (
                    <FiEyeOff
                      className="top-3 right-3 absolute text-white cursor-pointer"
                      onClick={() =>
                        setEyes({ ...eyes, password: !eyes.password })
                      }
                    />
                  )}
                </div>
              </div>
            ) : (
              <>
                <p className="mb-2">OTP sent on email</p>
                <input
                  type="text"
                  maxLength={6}
                  minLength={6}
                  className="mb-4 w-full text-sm text-white  h-10 flex items-center gap-2 overflow-hidden bg-transparent border-b border-white/37"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value)}
                  required
                />
              </>
            )}

<div className="flex">
              <label className="flex items-center pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="mr-2 h-4 w-4 cursor-pointer"
                  style={{ accentColor: '#EB6A59' }}
                />{" "}
                <span className="text-[14px] font-normal text-white">
                  Remember Me
                </span>
              </label>
              <Link
                className="font-semibold  text-[14px] ml-auto text-[#EB6A59]"
                to="/forgotpassword"
              >
                {" "}
                Forgot Password?
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center">
              <button
                type="submit"
                className="h-11 rounded-full w-52 font-semibold text-center text-white   hover:opacity-80 transition-all "
              >
                Sign in
              </button>
            </div>
            {/* <p className='text-sm mt-3 text-center'>Don't have an account? <Link to="/signup" className='text-[#EB6A59] text-sm'>Sign Up</Link></p> */}
          </form>
        )}
      </AuthLayout>
    </>
  );
};

export default Login;
