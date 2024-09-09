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
import SelectDropdown from "../../components/common/SelectDropdown";
import { toast } from "react-toastify";
const Contract = () => {
  const user = useSelector((state) => state.user);
  const searchState = { data: "" };
  const [filters, setFilter] = useState({ page: 1, count: 10, search: "" });
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loaging, setLoader] = useState(true);
  const history = useNavigate();
  const [staffId, setStaffId] = useState();
  const [staffModal, setstaffModal] = useState(false);
  const [staffData, setStaffData] = useState([]);
  const [staffForm, setstaffForm] = useState({
    staff: "",
  });

  const sortClass = (key) => {
    let cls = "fa-sort";
    if (filters.key == key && filters.sorder == "asc") cls = "fa-sort-up";
    else if (filters.key == key && filters.sorder == "desc")
      cls = "fa-sort-down";
    return "fa " + cls;
  };

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

  const getData = (p = {}) => {
    setLoader(true);
    let filter ;

    
    if(user?.role == "staff"){
      filter ={...filters, ...p , staffId:user?.id || user?._id}
    }else{
      filter = { ...filters, ...p }
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
      text: `Do you want to delete this`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1E5DBC",
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
  const changestaffMember = (e) => {
    setstaffForm({ ...staffForm, staff: e });
  };

  const statusChange = (status, itm) => {
    if (status == "rejected") {
      Swal.fire({
        title: "Are you sure?",
        text: `Do you want to ${
          status == "accepted" ? "Accept" : "Reject"
        } this`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#1E5DBC",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          loader(true);
          ApiClient.put(`${shared.editApi}?id=${itm?.id}`, { status }).then(
            (res) => {
              if (res.success) {
                getData();
              }
              loader(false);
            }
          );
        }
      });
    } else {
      let value = {
        staff: staffForm.staff,
      };
      let method = "put";
      let url = `assignment/update?id=${itm?.assignment_id}`;
      ApiClient.allApi(url, value, method).then((res) => {
        if (res.success) {
          loader(true);
          ApiClient.put(`${shared.editApi}?id=${itm?.id}`, { status }).then(
            (res) => {
              if (res.success) {
                setstaffModal(false);
                setstaffForm({ ...staffForm, staff: "" });
                getData();
              }
              loader(false);
            }
          );
        }
      });
    }
  };

  const edit = (id) => {
    history(`/${shared.url}/edit/${id}`);
  };

  const view = (id) => {
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
    // let permissions = user?.role?.permissions?.[0];
    // let value = permissions?.[key];
    // if(user.role=='admin') value=true
    // // return true;
    // return value;
    return true;
  };

  useEffect(() => {
    if (user && user.loggedIn) {
      setFilter({ ...filters, search: searchState.data });
      getData({ search: searchState.data, page: 1 });
      getStaffmembers();
    }
  }, []);

  const getStaffmembers = () => {
    let filter = { role: "staff" };
    ApiClient.get(shared.stafflist, filter).then((res) => {
      if (res.success) {
        setStaffData(
          res.data.map((itm) => {
            itm.id = itm._id;
            return itm;
          })
        );
      }
      setLoader(false);
    });
  };

  const staffSubmit = () => {
    if (staffForm?.staff == "") {
      toast?.error("Please select the staff member");
    } else {
      statusChange("accepted", staffId);
    }
  };

  return (
    <>
      <Html
        edit={edit}
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
        setstaffModal={setstaffModal}
        staffModal={staffModal}
        setStaffId={setStaffId}
      />
      {staffModal ? (
        <>
          <Modal
            title="Accept Assignment "
            result={(e) => {
              setstaffModal(false);
            }}
            body={
              <>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    staffSubmit();
                  }}
                >
                  <div className="staff-members rounded-[5px] border border-[#00000012]">
                    <div className="flex items-center p-3 border-b border-[#00000012]  bg-[#0035850a] ">
                      <img
                        src="assets/img/id.png"
                        alt="staff"
                        className="w-[50px] "
                      />
                      <h4 className="text-center my-3 font-[600] text-[16px] ms-3">
                        Assign a staff Member
                      </h4>
                    </div>
                    <div className="flex items-center mt-5 mb-2 p-3">
                      <div className=" w-full  mx-auto c-dropdown  ">
                        <SelectDropdown
                          id="statusDropdown"
                          displayValue="fullName"
                          placeholder="All Staff members"
                          intialValue={staffForm?.staff}
                          result={(e) => {
                            changestaffMember(e.value);
                          }}
                          options={staffData}
                        />
                      </div>
                      <button className="btn btn-primary ms-3">Accept</button>
                    </div>
                  </div>
                </form>
              </>
            }
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Contract;
