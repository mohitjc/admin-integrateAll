import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/global/layout';
import ApiClient from '../../methods/api/apiClient';
import loader from '../../methods/loader';
import './profile.scss'
import methodModel from '../../methods/methods';
import crendentialModel from '../../models/credential.model';


const Profile = () => {

  const user:any = crendentialModel.getUser()
  const [data, setData]:any = useState('');

  const gallaryData = () => {
    loader(true)
    ApiClient.get(`api/user/detail`, { id: user._id }).then(res => {
      if (res.success) {
        setData(res.data)
      }
      loader(false)

    })
  };

  useEffect(
    () => {
      if (user) {
        gallaryData();
      }
    },
    []
  );

  return (
    <Layout>


      <div className='wrapper_section'>
        <div className='flex items-center  justify-between'>
          <h3 className='text-2xl font-semibold text-[#111827]'>Basic Information</h3>
          <Link to="/profile/edit" className="!px-4 text-sm font-normal bg-blue-500 hover:bg-blue-700 text-white h-10 flex items-center justify-center gap-2 !bg-primary rounded-lg shadow-btn hover:opacity-80 transition-all focus:ring-2 ring-[#EDEBFC] disabled:bg-[#D0CAF6] disabled:cursor-not-allowed">

            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
            Edit Profile

          </Link>
        </div>

        <div className='inner_part sm:mt-3 md:mt-8 p-6 shadow-box overflow-hidden rounded-lg bg-white'>
          <div className='grid items-center grid-cols-12 gap-4'>

            <div className='col-span-12 md:col-span-3 lg:col-span-2'>
              <img src={methodModel.userImg(data && data.image)} className="h-28 w-28 mx-auto" />
            </div>

            <div className='col-span-12 md:col-span-9 lg:col-span-10 pl-5 border-l border-gray-300'>
                <div className='grid grid-cols-2 gap-4'>
                   


                    <div className=''>
                      <div className='text_head'>
                        <label className='text-typo text-base font-normal max-w-sm w-full block'>Name</label>
                      </div>
                      <div className='sub_fatch'>
                        <p className='text-sm text-gray-500'>{data && data.fullName}</p>
                      </div>
                    </div>
                   


                    <div className=''>
                      <div className='text_head'>
                        <label className='text-typo text-base font-normal max-w-sm w-full block'>Email</label>
                      </div>
                      <div className='sub_fatch'>
                        <p className='text-sm text-gray-500' >{data && data.email}</p>
                      </div>
                    </div>
                  

                    <div className=''>
                      <div className='text_head'>
                        <label className='text-typo text-base font-normal max-w-sm w-full block'>Role</label>
                      </div>
                      <div className='sub_fatch'>
                        <p className='text-sm text-gray-500' >{user.customerRoleDetail?.name}</p>
                      </div>
                    </div>
                  


                    <div className=''>
                      <div className='text_head'>
                        <label className='text-typo text-base font-normal max-w-sm w-full block'>Mobile No</label>
                      </div>
                      <div className='sub_fatch'>
                        <p className='text-sm text-gray-500'>{String(data.mobileNo?'+'+data.mobileNo:'')}</p>
                      </div>
                    </div>
                    
                </div>
            </div>


           
          


          </div>
        </div>
      </div>



    </Layout>
  );
};

export default Profile;
