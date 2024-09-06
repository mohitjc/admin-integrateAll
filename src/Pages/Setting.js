import React, { useState, useEffect } from 'react';
import Layout from '../components/global/layout';
import ApiClient from '../methods/api/apiClient';
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import FormControl from "../components/common/FormControl";
const Setting = () => {
  const options = [
    { id: 1, name: ' 1 Month' },
    { id: 2, name: '2 Month' },
    { id: 3, name: '3 Month' },
    { id: 4, name: '4 Month' },
    { id: 5, name: '5 Month' },
    { id: 6, name: '6 Month' },
  ];

  const [form, setForm] = useState({ memberGroup: "3", connectMeetHistory: "" });
  const [getdata, setGetData] = useState()
  const user = useSelector((state) => state?.user);
  useEffect(() => {
    getSettingData();
  }, []);
  const getSettingData = () => {
    const id = user?.groupId?._id;
    ApiClient.get(`api/event-group/setting?groupId=${id}`).then(res => {
      if (res.success) {
        setGetData(res.data);
        if (res.data && res.data.length > 0) {
          setForm({ memberGroup: res?.data[0].groupMemberLimit });
          setForm({ connectMeetHistory: res?.data[0].historyMonths });
        }
      }
    });
  };

  const handleSave = () => {

    if (getdata && getdata.length > 0) {
      const id = getdata[0]?._id
      let payload = {
        id: id,
        groupMemberLimit: form?.memberGroup,
        historyMonths: form?.connectMeetHistory
      }
      ApiClient.put(`api/event-group/setting/update`, payload).then(res => {
        if (res.success) {
          toast(res?.message)
          getSettingData()
        }
      });
    }
    else {
      const id = user?.groupId?._id;
      let payload = {
        groupId: id,
        groupMemberLimit: form?.memberGroup,
        historyMonths: form?.connectMeetHistory
      }
      ApiClient.post(`api/event-group/setting`, payload).then(res => {
        if (res) {
          toast(res?.message)
          getSettingData()
        }
      });
    }
  };

  const handleChange = (event) => {
    setForm({ ...form, memberGroup: event.target.value });
  };

  return (
    <Layout>
      <div className='shadow-box bg-white rounded-lg mt-6 p-2 lg:p-6 w-full lg:w-96'>
        <div className='inputs_date'>
          <label className='mb-1 block'>My group settings</label>
          <input
            type="text"
            placeholder="Member Group"
            className='relative shadow-box bg-white w-full rounded-lg h-10 flex items-center gap-2 overflow-hidden px-2 border border-gray-100'
            value={form?.memberGroup}
            onChange={handleChange}
          />
        </div>


        <FormControl
          type="select"
          label="Connect Meet History"
          displayValue="name"
          placeholder="Select Connect Meet History"
          value={form?.connectMeetHistory}
          onChange={e => setForm({ ...form, connectMeetHistory: e })}
          options={options}
          theme="search"

        // error={getError('timezone')}
        />

        <div className='flex items-center justify-end'>
          <button
            className='bg-[#1E5DBC] px-4 py-2 rounded-lg text-white mt-4'
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Setting;
