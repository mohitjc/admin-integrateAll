import { useEffect, useState } from "react";
import Layout from "../../components/global/layout";
import Chart from "../../components/Charts/Chart";
import { IoHandRightOutline } from "react-icons/io5";
import PieChart from "../../components/Charts/Piechart";
import DoughnutChart from "../../components/Charts/DonutChart";
import ApiClient from "../../methods/api/apiClient";
import SelectDropdown from "../../components/common/SelectDropdown";
import loader from "../../methods/loader";
import LineChart from "../../components/common/LineChart";

const Dashboard = () => {
  const [data, setData] = useState();
  const [productData, setProductData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [totalAmounts, setTotalAmount] = useState([]);
  const [dates, setDates] = useState([]);
  const [filters, setFilter] = useState({monthly:'monthly',type:'monthly',startDate:'',endDate:''});
  const [aggregation, setAggregation] = useState("monthly");
  const list = [
    { id: "daily", name: "Daily" },
    { id: "weekly", name: "Weekly" },
    { id: "monthly", name: "Monthly" },
    { id: "yearly", name: "Yearly" },
  ];
  const getAllCounts = () => {
    ApiClient.get("dashboard/all-counts").then((res) => {
      if (res.success) {
        setData(res.data?.[0]);
      }
    });
  };

  

  const getOrders=(p={})=>{
    let f={
      ...filters,
      ...p
    }
    
    ApiClient.get('orders/graph/data',f).then(res=>{
      if(res.success){
        let data=res.data
        // let arr=Object.keys(data)
        data=data.map(itm=>{
          let date=`${itm._id.date_year}-${itm._id.date_month}-${itm._id.day}`
          if(f.type=='monthly') date=`${itm._id.date_year}-${itm._id.date_month}`
          if(f.type=='yearly') date=`${itm._id.date_year}`
          return {
            avgOrderValue:itm.avgOrderValue.toFixed(2),
            totalOrders:itm.totalOrders,
            totalSale:itm.totalSale.toFixed(2),
            date:date
          }
        }) 
        setOrderData(data)
      }
    })
  }

  const getProducts=(p={})=>{
    let f={
      "expand": "tags",
      "expand1": "categories",
      "expand2": "taxRates",
      "expand3": "modifierGroups",
      "expand4": "itemStock",
      "expand5": "options",
      "expand6": "menuItem",
      "orderBy": "name ASC",
      "offset": 1,
      "limit": 1000,
      "Token": "2f02f294-b57b-1783-2ef6-173f1fb628bb",
      "monthly": filters.monthly,
      ...p
    }
    
    ApiClient.post('dashboard/graph/products',{},f).then(res=>{
      if(res.success){
        let data=res.data.monthly
        let arr=Object.keys(data)
        arr=arr.map(itm=>{
          return {
            count:data[itm],
            date:itm
          }
        }) 
        setProductData(arr)
      }
    })
  }

  useEffect(() => {
    // getProducts()
    getAllCounts();
    getOrders();
  }, []);

  useEffect(() => {
    getRewardGraph();
  }, [aggregation]);

  const getRewardGraph = () => {
    loader(true)
    const payload = {
      Token: "sFov-YObWxbL-o2y9PTBh7PG7XwqDRb85FuDK4yEcbQ",
      email: "maheshm%2B1071%40parasightsolutions.com",
      aggregation: aggregation,
    };
    ApiClient.post("dashboard/graph/rewards", payload).then((res) => {
      if (res.success) {
        loader(false)

        let data=res.data
        let arr=Object.keys(data)
        arr=arr.map(itm=>{
          return {
            totalAmount:data[itm].totalAmount?.toFixed(2),
            count:data[itm].count,
            date:itm
          }
        }) 

        // console.log("arr",arr)
        setDates(arr)
        // for (const date in res.data) {
        //   if (res.data.hasOwnProperty(date)) {
        //     totalAmounts?.push(res.data[date].totalAmount);
        //     dates?.push(date);
        //     setTotalAmount(totalAmounts)
        //     setDates(dates)
        //   }
        // }
       
      }
    });
  };

  const changestatus = (e) => {
    setAggregation(e);
  };

 const filter=(p={})=>{
  setFilter({...filters,...p})
  // getProducts(p)
  getOrders(p)
 }

 

  return (
    <>
      <Layout>
        <h4 className="text-2xl font-bold mb-3 flex items-center gap-2">
          <IoHandRightOutline className="text-3xl slow-shake text-[#063688]" />
          <span className="">Hi,</span> Admin Shroom
        </h4>

        <div className="shadow-box w-full bg-white rounded-lg mt-6 p-6">
          <div className=" grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col-reverse  border border-gray-200 shadow-sm px-6 py-2 rounded-lg relative">
              <dt className="text-base leading-7 text-black/40">Total Staff</dt>
              <dd className="text-2xl font-bold leading-9  text-black">
                {data?.totalUsers}
              </dd>
              <img
                src="../assets/img/d1.svg"
                className="absolute  right-6 top-1/2 -translate-y-1/2 h-7"
              />
            </div>
            <div className="flex flex-col-reverse  border border-gray-200 shadow-sm px-6 py-2 rounded-lg relative">
              <dt className="text-base leading-7 text-black/40">
                Total Students
              </dt>
              <dd className="text-2xl font-bold leading-9  text-black">
                {data?.totalProducts}
              </dd>
              <img
                src="../assets/img/d2.svg"
                className="absolute  text-green-500 right-6 top-1/2 -translate-y-1/2 h-7"
              />
            </div>
            <div className="flex flex-col-reverse  border border-gray-200 shadow-sm px-6 py-2 rounded-lg relative">
              <dt className="text-base leading-7 text-black/40">
                Total Categories
              </dt>
              <dd className="text-2xl font-bold leading-9  text-black">
                {data?.totalCategory}
              </dd>
              <img
                src="../assets/img/d4.svg"
                className="absolute  right-6 top-1/2 -translate-y-1/2 h-7"
              />
            </div>
            <div className="flex flex-col-reverse  border border-gray-200 shadow-sm px-6 py-2 rounded-lg relative">
              <dt className="text-base leading-7 text-black/40">
                Total Assignment
              </dt>
              <dd className="text-2xl font-bold leading-9  text-black">
                {data?.totalReview}
              </dd>
              <img
                src="../assets/img/d5.svg"
                className="absolute  right-6 top-1/2 -translate-y-1/2 h-7"
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 mt-6">
            {/* <div className="col-span-12 md:col-span-12">
              <div className="chatr_ones border border-gray-200 p-6 rounded-lg">
                <div className="names_heads">
                  <h5 className="font-semibold text-xl">Categories</h5>
                </div>
                <Chart />
              </div>
            </div> */}

            {/* <div className="col-span-12 md:col-span-6">
              <div className="chatr_ones border border-gray-200 p-6 rounded-lg">
                <div className="names_heads">
                  <h5 className="font-semibold text-xl">Products</h5>
                </div>
                <PieChart />
              </div>
            </div> */}

            {/* <div className="col-span-12 md:col-span-6">
              <div className="chatr_ones border border-gray-200 p-6 rounded-lg">
                <div className="names_heads">
                  <h5 className="font-semibold text-xl">Questions</h5>
                </div>
                <DoughnutChart />
              </div>
            </div> */}
            <div className="col-span-12 md:col-span-12">
              <div className="chatr_ones border border-gray-200 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <h5 className="font-semibold text-xl">Assignment</h5>
                  <div className="">
                  <SelectDropdown
                  // id="statusDropdown"
                  displayValue="name"
                  intialValue={aggregation}
                  result={(e) => {
                    changestatus(e.value);
                  }}
                  options={list}
                />
                  </div>
                </div>
               
                {/* <Chart
                  totalAmounts={totalAmounts}
                  dates={dates}
                  name={"Reward Points"}
                  type={""}
                /> */}
                 <LineChart
                  legends={[
                    {label:'Total Assignment',key:'count'},
                    // {label:'Total Amount',key:'totalAmount'},
                  ]}
                  data={dates}
                />
              </div>
            </div>
            <div className="col-span-12 md:col-span-12">
              <div className="chatr_ones border border-gray-200 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <h5 className="font-semibold text-xl">Students</h5>
                  <div className="">
                  <SelectDropdown
                  // id="statusDropdown"
                  displayValue="name"
                  intialValue={filters.type}
                  result={(e) => {
                    filter({type:e.value})
                  }}
                  options={list}
                />
                  </div>
                </div>

                <LineChart
                  legends={[
                    {label:'Total Students',key:'totalOrders'},
                    // {label:'Total Sale',key:'totalSale'},
                    // {label:'Avg Order Value',key:'avgOrderValue'},
                  ]}
                  data={orderData}
                />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Dashboard;
