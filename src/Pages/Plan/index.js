import { useEffect, useState } from 'react';
import ApiClient from '../../methods/api/apiClient';
// import './style.scss';
import loader from '../../methods/loader';
import Html from './html';
import {  useNavigate } from 'react-router-dom';
import axios from 'axios';
import environment from '../../environment';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const Plans = (p) => {
  const user = useSelector((state) => state.user);
  const searchState = {data:''};
  const [filters, setFilter] = useState({ page: 1, count: 50, search: '' })
  const [data, setData] = useState([])
  const [tab, setTab] = useState('list')
  const [total, setTotal] = useState(0)
  const [loaging, setLoader] = useState(true)
  const [activeplan, setActiveplan] = useState()
  const history = useNavigate()
  const [pricing, setpricing] = useState()
  const [appliedcurrency, setappliedcurrency] = useState()
  const [currencyiso, setcurrencyiso] = useState('usd')
  const [features, setFeatures] = useState()
  const [interval, setInterval] = useState(1)

  useEffect(() => {
    getappliedcurrency()
    getFeatures()
  }, [])

  useEffect(() => {
    if (user && user.loggedIn) {
      setFilter({ ...filters, search: searchState.data })
      getData({ search: searchState.data, page: 1 })
    }
  }, [])

  const getactivePlan = () => {
    let filter={};
    if(user?.subRole?.id==environment.SubRolePartner){
      filter = { id :user.id||user?._id}
    }else{
      filter={}
    }
    ApiClient.get('api/getMyPlan', filter).then(res => {
      if (res.success) {
        setActiveplan(res.data)
      }
    })
  }

  const getFeatures = () => {
    ApiClient.get('api/grouped/features', { page: 1, count: 100, status: 'active' }).then(res => {
      if (res.success) {
        setFeatures(res.data)
      }
    })
  }

  const getData = (p = {}) => {
    getactivePlan()
    setLoader(true)
    let filter = { ...filters, ...p }
    loader(true)

    const response=(res)=>{
      if (res.success) {
        setData(res.data.map(itm => {
          itm.id = itm._id
          return itm
        }))
        setTotal(res.total)
      }
      loader(false)
      setLoader(false)
    }

    ApiClient.get('api/plan/list',filter).then(response)
  }


  const clear = () => {
    setFilter({ ...filters, search: '', page: 1 })
    getData({ search: '', page: 1 })
  }

  const filter = (p = {}) => {
    setFilter({ ...filters, page: 1, ...p })
    getData({ page: 1, ...p })
  }

  const reset = () => {
    let p = {
      interval: '',
      currencyId: ''
    }
    setFilter({ ...filters, page: 1, ...p })
    getData({ page: 1, ...p })
  }


  const deleteItem = (id) => {
    if (window.confirm("Do you want to delete this")) {
      loader(true)
      ApiClient.delete('', { id: id }).then(res => {
        if (res.success) {
          toast.success(res.message)
          clear()
        }
        loader(false)
      })
    }
  }

  const exportCsv = () => {
    loader(true)
    ApiClient.get('user/csv').then(res => {
      if (res.success) {
        let url = res.path
        let downloadAnchor = document.getElementById("downloadJS")
        downloadAnchor.href = url
        downloadAnchor.click()
      }
      loader(false)
    })
  }

  const isChecked = (item, fitm) => {
    let value = false
    if (item.feature) {
      Object.keys(item.feature).map(oitm => {
        let farr = item.feature[oitm]
        let ext = farr.find(itm => itm.id == fitm.id)
        if (ext?.checked) value = true
      })
    }
    return value
  }

  const changeInterval = (p) => {
    setInterval(p)
  }

  const getPrice = (p) => {
    let value = 0
    let intervalKey = 'monthlyPrice'
    if (interval == 1) intervalKey = 'monthlyPrice'
    if (interval == 3) intervalKey = 'threeMonthPrice'
    if (interval == 6) intervalKey = 'sixMonthPrice'
    if (interval == 12) intervalKey = 'yearlyPrice'

    value = p?.[intervalKey]?.[currencyiso] || 0
    return Number(value)
  }

  const exportfun = async () => {
    const token = await localStorage.getItem("token");
    const req = await axios({
      method: "get",
      url: `${environment.api}`,
      responseType: "blob",
      body: { token: token }
    });
    var blob = new Blob([req.data], {
      type: req.headers["content-type"],
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `Plans.xlsx`;
    link.click();
  }


  const freePlanSubmit=(p)=>{
    loader(true)
    ApiClient.post('api/purchase/free-plan',{ userId:user._id,
      planId: p.id,}).then(res=>{
        loader(false)
        if(res.success){
         getData()
        }
      })
  }

  const getplandetails = (p) => {
    if(p.planType=='free'){
        freePlanSubmit(p)
        return
    }
    if (!currencyiso) {
      toast.error('Please Select Currency.')
      return
    }
    else {

      console.log("p",p)

      let price = getPrice(p)
      if (!price) {
        toast.error('Please Select Another Currency.')
        return
      }
      let payload = {
        user_id:user._id,
        plan_id: p.id,
        planType: 'month',
        interval_count: interval,
        subscription_currency: currencyiso,
        stripe_price_id: p?.pricing?.find(item => item?.interval_count == interval && item?.currency == currencyiso.toLowerCase())?.stripe_price_id||''
      }
      setLoader(true)
      loader(true)
      ApiClient.post(`api/payOnStripe`, payload).then(res => {
        loader(false)
        if (res.success) {
          window.location.assign(res.data.url)
        }else{
          toast.error(res.message)
        }
        setLoader(false)
      })
    }
  }

  const addcard = () => {
    document.getElementById("closePaymentModal").click()
    history("/cards/add")
  }

  const cancelplan = (id) => {
    if (window.confirm('Do you want to cancel this subscription.')) {
      ApiClient.delete(`api/cancel/subscription`, { id: id }).then(res => {
        if (res.success) {
          getData();
        }
      })
    }
  }

  const getappliedcurrency = () => {
    ApiClient.get('api/currency/applied?page=1&count=100&status=active').then(res => {
      if (res.success) {
        setappliedcurrency(res.data.map(itm => {
          return { ...itm, id: itm.isoCode.toLowerCase() }
        }))
      }
    })
  }

  return <><Html
    features={features}
    getPrice={getPrice}
    changeInterval={changeInterval}
    filter={filter}
    interval={interval}
    tab={tab}
    isChecked={isChecked}
    activeplan={activeplan}
    addcard={addcard}
    reset={reset}
    deleteItem={deleteItem}
    exportCsv={exportCsv}
    loaging={loaging}
    data={data}
    total={total}
    appliedcurrency={appliedcurrency}
    exportfun={exportfun}
    getplandetails={getplandetails}
    setpricing={setpricing}
    pricing={pricing}
    cancelplan={cancelplan}
    setcurrencyiso={setcurrencyiso}
    currencyiso={currencyiso}
    user={user}
  />
  </>;
};

export default Plans;
