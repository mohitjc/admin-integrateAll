import { Link } from "react-router-dom";
import { GoLock } from "react-icons/go";

const AuthLayout = ({ children }: any) => {
  return (
    <>
      <div className="relative flex flex-col items-center justify-center h-screen mx-auto">
        <div className=" w-full   mx-auto  ">       
          <div className="relative w-full h-screen  flex">
            <div className="h-full 2xl:w-8/12 lg:w-7/12 md:w-6/12  w-full md:block hidden ">
              <div className="bg-img h-full ">
                
              </div>
            </div>
            <div className="flex items-center justify-center h-full 2xl:w-4/12 lg:w-5/12  md:w-6/12 w-full bg-black     z-20 py-6 px-8   z-20">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
