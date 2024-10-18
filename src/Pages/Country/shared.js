const types=[
  {
    id:'Product',
    name:'Product'
  },
  {
    id:'Blog',
    name:'Blog'
  },
  {
    id:'FAQ',
    name:'FAQ'
  },
]
const shared = {
  check: "Geo",
  title: "Countries",
  addTitle: "Country",
  url: "country",
  types:types,
  addApi: "address/country/add",
  editApi: "address/country/update",
  detailApi: "address/country/detail",
  listApi: "address/country/list",
  statusApi: "address/country/statusUpdate",
  deleteApi: "address/country/delete",
};

export default shared;
