import React, { useEffect, useState } from "react";
import Layout from "../../components/global/layout";
import "./style.scss";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";
import { FiPlus } from "react-icons/fi";
import Table from "../../components/Table";
import shared from "./shared";
import ApiClient from "../../methods/api/apiClient";
import { useSelector } from "react-redux";
import { PiEyeLight } from "react-icons/pi";
import { LiaEdit, LiaTrashAlt } from "react-icons/lia";
import environment from "../../environment";
import FormControl from "../../components/common/FormControl";
import loader from "../../methods/loader";
import pipeModel from "../../models/pipeModel";
import datepipeModel from "../../models/datepipemodel";
import Modal from "../../components/common/Modal";
import { AiOutlineUser } from "react-icons/ai";

const Html = ({
  sorting,
  filter,
  edit,
  view,
  statusChange,
  pageChange,
  count,
  deleteItem,
  clear,
  filters,
  setFilter,
  loaging,
  data,
  changestatus,
  isAllow,
  total,
  sortClass,
  getRolesData,
  uploadFile,
}) => {
  const user = useSelector((state) => state.user);
  const [clients, setClients] = useState([]);
  const [contractor, setContractor] = useState([]);
  const [property, setProperty] = useState([]);
  
  const [isModal, setIsModal] = useState(false);
  const [isInvoiceModal, setInvoiceModal] = useState(false);
  const [form, setForm] = useState({
    id: "",
    contractor: "",
  });
  const [invoiceForm, setInvoiceForm] = useState({
    id: "",
    contractor: "",
  });

  const assign = (row) => {
    setForm({
      id: row.id,
      contractor: row.contractor,
    });
    setIsModal(true);
  };

  const assignContractor = () => {
    let payload = {
      id: form.id,
      contractor: form.contractor,
    };
    loader(true);
    ApiClient.put("job/assign/contractor", payload).then((res) => {
      loader(false);
      if (res.success) {
        setIsModal(false);
        filter();
      }
    });
  };

  const columns = [
    {
      key: "title",
      name: "Title",
      sort: true,
      render: (row) => {
        return <span className="capitalize">{row?.title}</span>;
      },
    },
    {
      key: "estimate",
      name: "Estimate",
      sort: true,
      render: (row) => {
        return (
          <span className="capitalize">
            {pipeModel.currency(row?.estimate)}
          </span>
        );
      },
    },
    {
      key: "preferedTime",
      name: "Preferred Time",
      sort: true,
      render: (row) => {
        return (
          <span className="capitalize">
            {datepipeModel.datetime(
              datepipeModel.datetodatepicker(row?.preferedTime)
            )}
          </span>
        );
      },
    },
    {
      key: "clientName",
      name: "Client",
      sort: true,
      render: (row) => {
        return <span className="capitalize">{row?.clientName}</span>;
      },
    },

    {
      key: "contractorName",
      name: "Contractor",
      sort: true,
      render: (row) => {
        return (
          <>
            <span className="capitalize">
              {row?.contractorName || "Assign Contractor"}
            </span>
          </>
        );
      },
    },
    {
      key: "property",
      name: "Project",
      sort: true,
      render: (row) => {
        return <span className="capitalize">{row?.property_detail?.name}</span>;
      },
    },
    {
      key: "status",
      name: "Status",
      render: (row) => {
        return (
          <>
            <div className="w-32">
              <span
                className={` 
                          
                  ${row.status}
                  
               `}
              >
                {row.status}
              </span>
            </div>
          </>
        );
      },
    },
    {
      key: "action",
      name: "Action",
      render: (itm) => {
        return (
          <>
            <div className="flex items-center justify-start gap-1.5">
              {isAllow(`read${shared.check}`) ? (
                <Tooltip placement="top" title="View">
                  <span
                    className="border cursor-pointer  hover:opacity-70 rounded-lg bg-[#1E5DBC14] w-10 h-10 !text-primary flex items-center justify-center text-lg"
                    onClick={(e) => view(itm.id)}
                  >
                    <PiEyeLight />
                  </span>
                </Tooltip>
              ) : (
                <></>
              )}
              {isAllow(`edit${shared.check}`) && itm.status == "pending" ? (
                <Tooltip placement="top" title="Edit">
                  <span
                    className="border cursor-pointer  hover:opacity-70 rounded-lg bg-[#1E5DBC14] w-10 h-10 !text-primary flex items-center justify-center text-lg"
                    onClick={(e) => edit(itm.id)}
                  >
                    <LiaEdit />
                  </span>
                </Tooltip>
              ) : (
                <></>
              )}
              {isAllow(`edit${shared.check}`) && itm.status == "pending" ? (
                <Tooltip placement="top" title="Assign Contractor">
                  <a
                    className="border cursor-pointer  hover:opacity-70 rounded-lg bg-[#1E5DBC14] w-10 h-10 !text-primary flex items-center justify-center text-lg"
                    onClick={(e) => assign(itm)}
                  >
                    <AiOutlineUser />
                  </a>
                </Tooltip>
              ) : (
                <></>
              )}

              {isAllow(`delete${shared.check}`) && itm.status == "pending" ? (
                <Tooltip placement="top" title="Delete">
                  <span
                    className="border cursor-pointer  hover:opacity-70 rounded-lg bg-[#1E5DBC14] w-10 h-10 !text-primary flex items-center justify-center text-lg"
                    onClick={() => deleteItem(itm.id)}
                  >
                    <LiaTrashAlt />
                  </span>
                </Tooltip>
              ) : (
                <></>
              )}

{isAllow(`edit${shared.check}`) && (itm.status == 'completed') ? (
                <Tooltip placement="top" title="Generate Invoice">
                  <a
                    className="border cursor-pointer  hover:opacity-70 rounded-lg bg-[#1E5DBC14] w-10 h-10 !text-primary flex items-center justify-center text-lg"
                    onClick={(e) => generateInvoice(itm)}
                  >
                   <span class="material-symbols-outlined">description</span>
                  </a>
                </Tooltip>
              ) : (
                <></>
              )}
            </div>
          </>
        );
      },
    },
  ];

  const getProperties = () => {
    ApiClient.get("property/listing", { status: "active" }).then((res) => {
      if (res.success) {
        setProperty(res.data);
      }
    });
  };

  const getContractor = () => {
    ApiClient.get("user/listing", {
      status: "active",
      role: environment.contractorRoleId,
    }).then((res) => {
      if (res.success) {
        setContractor(res.data);
      }
    });
  };

  const getClients = () => {
    ApiClient.get("user/listing", {
      status: "active",
      role: environment.userRoleId,
    }).then((res) => {
      if (res.success) {
        setClients(res.data);
      }
    });
  };

  useEffect(() => {
    getClients();
    getContractor();
    getProperties();
  }, []);

  const onSubmit = () => {
    assignContractor();
  };

  const materialTotal=()=>{
    let arr=invoiceForm.material||[]
    arr=arr.map(itm=>Number(itm.price||0))
    if(!arr?.length) return 0
     return arr?.reduce((total, num)=>total + num)
  }

  const serviceFee=(time=0)=>{
    let hourlyRate=user.hourlyRate||0
    time=Number(time||0)/60

    hourlyRate=hourlyRate*time
    // console.log("hourlyRate",hourlyRate)
    // console.log("time",time)
    return hourlyRate
  }

  const getTime=(form)=>{
    let hr=Number(form.hours||0)
    let minutes=Number(form.minutes||0)
    hr=hr*60
    return hr+minutes
  }

  const updateMaterial=(index,key,v)=>{
    let arr=invoiceForm.material||[]
    arr[index][key]=v
    setInvoiceForm({
      ...invoiceForm,
      material:arr,
    })
  }

  const generateInvoice=(row)=>{
    console.log("row",row)
    setInvoiceModal(true)
    setInvoiceForm({
      id:row.id,
      material:row.material,
      hours:row.hours,
      minutes:row.minutes,
    })
    

  }

  const generateInvoiceSubmit=()=>{
    console.log("invoiceForm",invoiceForm)
  }
  

  return (
    <>
      <Layout>
        <div className="flex flex-wrap justify-between items-center gap-y-4">
          <div>
            <h3 className="text-2xl font-semibold text-[#111827]">
              {" "}
              {shared.title}
            </h3>
            <p class="text-sm font-normal text-[#75757A]">
              Here you can see all about your {shared.title}
            </p>
          </div>

          <a id="downloadFile"></a>

          <div className="flex">
            {/* <button className="!px-2.5 text-[#3C3E49] text-sm font-normal py-2.5 flex items-center justify-center gap-2 bg-[#fff] rounded-lg shadow-btn hover:bg-[#F3F2F5] border border-[#D0D5DD] transition-all focus:ring-2 ring-[#F1F2F3] disabled:bg-[#F3F2F5] disabled:cursor-not-allowed mr-3" onClick={() => exportfun()}>
                        <PiFileCsv className="text-typo text-xl" />  Export CSV
                    </button> */}

            {isAllow(`add${shared.check}`) ? (
              <Link
                className="bg-primary leading-10 ms-3 h-10 flex items-center shadow-btn px-6 hover:opacity-80 text-sm text-white rounded-lg gap-2"
                to={`/${shared.url}/add`}
              >
                <FiPlus className="text-xl text-white" /> Add {shared.addTitle}
              </Link>
            ) : (
              <></>
            )}
          </div>
        </div>

        <div className="shadow-box w-full bg-white rounded-lg mt-6">
          <div className="flex p-4 items-center flex-wrap">
            <form
              class="flex items-center max-w-sm"
              onSubmit={(e) => {
                e.preventDefault();
                filter();
              }}
            >
              <label for="simple-search" class="sr-only">
                Search
              </label>
              <div class="relative w-full">
                {/* <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"/>
                                </svg>
                            </div> */}
                <input
                  type="text"
                  id="simple-search"
                  value={filters.search}
                  onChange={(e) => {
                    setFilter({ ...filters, search: e.target.value });
                  }}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-[#1E5DBC]block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500 pr-10"
                  placeholder="Search"
                  // required
                />
                {filters?.search && (
                  <i
                    className="fa fa-times absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
                    aria-hidden="true"
                    onClick={(e) => clear()}
                  ></i>
                )}
              </div>
              <button
                type="submit"
                class="p-2.5 m-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-[#1E5DBC] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg
                  class="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
                <span class="sr-only">Search</span>
              </button>
            </form>

            <div className="flex gap-2 ml-auto">
              <FormControl
                type="select"
                displayValue="fullName"
                value={filters.contractor}
                placeholder="All Contractors"
                theme="search"
                onChange={(e) => filter({ contractor: e })}
                options={contractor}
                required
              />
              <FormControl
                type="select"
                displayValue="fullName"
                value={filters.client}
                placeholder="All Clients"
                theme="search"
                onChange={(e) => filter({ client: e })}
                options={clients}
                required
              />
              <FormControl
                type="select"
                displayValue="name"
                value={filters.property}
                placeholder="All Projects"
                theme="search"
                onChange={(e) => filter({ property: e })}
                options={property}
                required
              />

              {filters.status ||
              filters.contractor ||
              filters.client ||
              filters.property ? (
                <>
                  <button
                    className="bg-primary leading-10 h-10 inline-block shadow-btn px-6 hover:opacity-80 text-sm text-white rounded-lg"
                    onClick={() => clear()}
                  >
                    Reset
                  </button>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>

          {!loaging ? (
            <>
              <div className="px-4 pb-4">
                <Table
                  className=""
                  data={data}
                  columns={columns}
                  page={filters.page}
                  count={filters.count}
                  filters={filters}
                  total={total}
                  result={(e) => {
                    if (e.event == "page") pageChange(e.value);
                    if (e.event == "sort") {
                      sorting(e.value);
                      sortClass(e.value);
                    }
                    if (e.event == "count") count(e.value);
                  }}
                />
              </div>
            </>
          ) : (
            <></>
          )}

          {loaging ? (
            <div className="text-center py-4">
              <img src="/assets/img/loader.gif" className="pageLoader" />
            </div>
          ) : (
            <></>
          )}
        </div>
      </Layout>

      {isInvoiceModal ? <>
        <Modal
          title="Generate Invoice"
          body={<>
            <form className="grid gap-2 grid-cols-2" onSubmit={e=>{e.preventDefault();generateInvoiceSubmit()}}>
            <div>
            <FormControl
                  type="number"
                  label="Hours"
                  value={invoiceForm.hours}
                />
            </div>
            <div>
            <FormControl
                  type="number"
                  label="Minutes"
                  value={invoiceForm.minutes}
                />
            </div>

            <div className="col-span-full">

                <div className="mt-2">
                  <h5 className="mb-2">Materials</h5>
                  {invoiceForm.material?.map((itm, i) => {
                    return <div className="p-2 border grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <FormControl
                          type="text"
                          label="Name"
                          value={itm.name}
                          // onChange={(e) => updateMaterial(i,'name',e)}
                          disabled
                          required
                        />
                      </div>
                      <div>
                        <FormControl
                          type="text"
                          label="Price (£)"
                          value={itm.price}
                          onChange={(e) => updateMaterial(i, 'price', e)}
                          required
                        />
                      </div>
                    </div>
                  })}
                </div>

                <div className="p-2 bg-gray-300 rounded mb-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label>Materials Price</label>
                    </div>
                    <div>
                      <span>{pipeModel.currency(materialTotal())}</span>
                    </div>
                    <div>
                      <label>Service Fee</label>
                    </div>
                    <div>
                      <span>{pipeModel.currency(serviceFee(getTime(invoiceForm)))}</span>
                    </div>
                    <div>
                      <label>Total</label>
                    </div>
                    <div>
                      <span>{pipeModel.currency(serviceFee(getTime(invoiceForm))+materialTotal())}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <button className="bg-primary leading-10 ms-3 h-10 inline-flex items-center shadow-btn px-6 hover:opacity-80 text-sm text-white rounded-lg gap-2">Generate Invoice</button>
                </div>

            </div>

            </form>
          </>}

          result={e => {
            setInvoiceModal(false)
          }}
        />
      </> : <></>}

      {isModal ? (
        <>
          <Modal
            title=" Contractor"
            body={
              <>
               <div className="border">
                <div className="bg-[#f2f3f4] p-3 border-b">
                  <h3 className="font-[600]">Assign Contractor</h3>
                </div>
               <form
                  className="grid gap-2 grid-cols-12 p-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                  }}
                >
                 
                  <div className="col-span-9 ">
                    <div>
                      <FormControl
                        type="select"
                        displayValue="fullName"
                        value={form.contractor}
                        placeholder="Assign Contractor"
                        theme="search"
                        onChange={(e) =>
                          setForm({
                            ...form,
                            contractor: e,
                          })
                        }
                        options={contractor}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-span-3">
                    <button className="bg-primary leading-10 ms-3 h-10 inline-flex items-center shadow-btn px-6 hover:opacity-80 text-sm text-white rounded-lg gap-2">
                      Assign
                    </button>
                  </div>
                </form>
                    </div>
                
              </>
            }
            result={(e) => {
              setIsModal(false);
            }}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Html;
