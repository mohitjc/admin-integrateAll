import React, { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import "./style.scss";
import loader from "../../methods/loader";
import Html from "./html";
import { useNavigate } from "react-router-dom";
import environment from "../../environment";
import axios from "axios";
import shared from "./shared";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import Modal from "../../components/common/Modal";
import FormControl from "../../components/common/FormControl";
import ImageUpload from "../../components/common/ImageUpload";
import { toast } from "react-toastify";

const Assignment = () => {
  const user = useSelector((state) => state.user);
  const searchState = { data: "" };
  const [filters, setFilter] = useState({ page: 1, count: 10, search: "" });
  const [data, setData] = useState([]);
  const [staff, setStaff] = useState([]);
  const [total, setTotal] = useState(0);
  const [loaging, setLoader] = useState(true);
  const [counterModal, setCounterModal] = useState(false);
  const [doc,setDoc] = useState("")
  const [completeModal,setcompleteModalModal] = useState(false)
  const [counterForm, setCounterForm] = useState({
    counterOffer:''
  });
  const [completeForm, setcompleteForm] = useState({
    counterOffer:''
  });
  const [completeData, setcompleteData] = useState({});
  const[status,setStatus] = useState("pending")
  const history = useNavigate();

  const sortClass = (key) => {
    let cls = "fa-sort";
    if (filters.key == key && filters.sorder == "asc") cls = "fa-sort-up";
    else if (filters.key == key && filters.sorder == "desc")
      cls = "fa-sort-down";
    return "fa " + cls;
  };

  const completeSubmit = () =>{

  }

  const sorting = (key) => {
    let sorder = "asc";
    if (filters.key == key) {
      if (filters.sorder == "asc") {
        sorder = "desc";
      } else {
        sorder = "asc";
      }
    }

    let sortBy = `${key} ${sorder}`;
    setFilter({ ...filters, sortBy, key, sorder });
    getData({ sortBy, key, sorder });
  };

  const getStaff = (p = {}) => {
    let filter = { page:1,count:50,...p, role:'staff' };
    ApiClient.get('user/listing', filter).then((res) => {
      if (res.success) {
        setStaff(
          res.data.map((itm) => {
            itm.id = itm._id;
            return itm;
          })
        );
      }
    });
  };



  const getData = (p = {}) => {
    setLoader(true);
    let filter = { ...filters, ...p};
    if(user?.role == "staff"){
      filter={...filters, ...p ,staff:user?.id || user?._id}
    }
    ApiClient.get(shared.listApi, filter).then((res) => {
      if (res.success) {
        setData(
          res.data.map((itm) => {
            itm.id = itm._id;
            return itm;
          })
        );
        setTotal(res.total);
      }
      setLoader(false);
    });
  };

  const clear = () => {
    let f = {
      groupId: "",
      search: "",
      status: "",
      page: 1,
    };
    setFilter({ ...filters, ...f });
    getData({ ...f });
  };

  const filter = (p = {}) => {
    let f = {
      page: 1,
      ...p,
    };
    setFilter({ ...filters, ...f });
    getData({ ...f });
  };

  const deleteItem = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete this ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#063688",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        loader(true);
        ApiClient.delete(shared.deleteApi, { id: id }).then((res) => {
          if (res.success) {
            // ToastsStore.success(res.message)
            clear();
          }
          loader(false);
        });
        //   Swal.fire({
        //     icon: "success"
        //   });
      }
    });
  };

  const pageChange = (e) => {
    setFilter({ ...filters, page: e });
    getData({ page: e });
  };
  const count = (e) => {
    setFilter({ ...filters, count: e });
    getData({ ...filters, count: e });
  };
  const changestatus = (e) => {
    setFilter({ ...filters, status: e, page: 1 });
    getData({ status: e, page: 1 });
  };

  const statusChange = () => {

    if (!doc) {
      toast.error("First Upload Assignment")
    }

    ApiClient.put(`${shared?.editApi}?id=${completeData?.id}`, { assignment_file: doc ,status:"completed"}).then((res) => {
      if (res.success) {
        setcompleteModalModal(false)
        setDoc('')
        getData();
      }
      loader(false);
    }).catch((error) => {
      console.error('Error:', error);
      loader(false);
    });
  };  

  const edit = (p={}) => {
    let payload={
      ...p
    }

    Object.keys(payload).map(itm=>{
      if(!payload[itm]) payload[itm]=null
    })

    loader(true);
        ApiClient.put(`${shared.editApi}?id=${payload?.id}`, payload).then((res) => {
          if (res.success) {
            getData();
          }
          loader(false);
        }); 
  };

  const view = (id,offerId) => {
    let url = `/${shared.url}/detail/${id}`;
    history(url);
  };

  const exportfun = async () => {
    const token = await localStorage.getItem("token");
    const req = await axios({
      method: "get",
      url: `${environment.api}api/export/excel`,
      responseType: "blob",
      body: { token: token },
    });
    var blob = new Blob([req.data], {
      type: req.headers["content-type"],
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${shared.title}.xlsx`;
    link.click();
  };

  const uploadFile = (e) => {
    let files = e.target.files;
    let file = files?.item(0);
    let url = "user/import-users";
    if (!file) return;
    loader(true);
    ApiClient.postFormFileData(url, { file }).then((res) => {
      if (res.success) {
        console.log("res", res);
      }
      loader(false);
    });
  };

  const isAllow = (key = "") => {
    // let permissions = user?.permissions?.[0];
    // let value = permissions?.[key];
    // if(user.role=='admin') value=true
    // // return true;
    // return value;
    return true;
  };


  const [estimates, setEstimates] = useState();
  const getWordEstimate=()=>{
    ApiClient.get('word-count/detail').then(res=>{
      if(res.success){
        setEstimates(res)
      }
    })
  }

  useEffect(() => {
    if (user && user.loggedIn) {
      setFilter({ ...filters, search: searchState.data });
      getData({ search: searchState.data, page: 1 });
      getStaff()
      getWordEstimate()
    }
  }, []);

  const counterOffer=(item)=>{ 
    let price=getWordPrice(item.word_count)
    setCounterForm({counterOffer:price,estimate_price:price,assignment_id:item?.id||item?._id,message:''})
    setCounterModal(true)
  }

  const counterSubmit=()=>{
    let payload={...counterForm}
    delete payload.estimate_price
    loader(true)
    ApiClient.post(`counter-offer/create`,payload).then(res=>{
      loader(false)
      if(res?.success){
        setCounterModal(false)
        getData()
        setCounterForm({})
      }else{}
    })
  }


  const getWordPrice=(word=0)=>{
    return shared.getWordPrice(word,estimates)
  }

  const viewQuote = (id) => {
    let url = `/assignment/counter-offer/detail/${id}`;
    history(url);
  };

  return (
    <>
      <Html
      staff={staff}
      getWordPrice={getWordPrice}
        edit={edit}
        counterOffer={counterOffer}
        view={view}
        clear={clear}
        sortClass={sortClass}
        sorting={sorting}
        isAllow={isAllow}
        count={count}
        pageChange={pageChange}
        deleteItem={deleteItem}
        filters={filters}
        setFilter={setFilter}
        filter={filter}
        loaging={loaging}
        data={data}
        total={total}
        statusChange={statusChange}
        changestatus={changestatus}
        exportfun={exportfun}
        uploadFile={uploadFile}
        status={status}
        viewQuote={viewQuote}
        setcompleteData={setcompleteData}
        setcompleteModalModal={setcompleteModalModal}
        setDoc={setDoc}
      />

      {counterModal?<>
        <Modal
      title="Counter Offer"
      result={e=>{
        setCounterModal(false)
      }}
      body={<>
        <form onSubmit={e=>{e.preventDefault();counterSubmit()}}>
          <div>
            <div>Estimate Price: ${counterForm.estimate_price}</div>
          <div className="mb-4">
          <FormControl
            type="number"
            label="Amount"
            value={counterForm.counterOffer}
            maxlength="10"
            onChange={e=>{
              setCounterForm({...counterForm,counterOffer:Number(e)})
            }}
            required={true}
            />
          </div>
            <FormControl
            type="textarea"
            label="Message"
            value={counterForm.message||''}
            onChange={e=>{
              setCounterForm({...counterForm,message:e})
            }}
            required={true}
            />
          </div>
          <div className="mt-3 text-right">
            <button className="btn btn-primary">Add</button>
          </div>
        </form>
      </>}
      />
      </>:<></>}

      {completeModal?<>
        <Modal
      title="Complete Assignment"
      result={e=>{
        setcompleteModalModal(false)
      }}
      body={<>
        {/* <form onSubmit={e=>{e.preventDefault();statusChange()}}> */}
        <div className="mb-3">
                <label className="text-sm  mb-3 block">Upload Assignment</label>
                <div className="upload-big">
                <ImageUpload
                value={doc}
                model="document"
                apiUrl="upload/upload/document"
                type="doc"
                accept=""
                label="Upload Docs"
                result={e=>{
                  setDoc(e.value)
                }}
                />
                </div>
               
            </div>
          <div className="mt-3 text-right">
            <button className="btn btn-primary" onClick={()=>statusChange()}>Send Assignment</button>
          </div>
        {/* </form> */}
      </>}
      />
      </>:<></>}

     
    </>
  );
};

export default Assignment;
