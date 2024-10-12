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
  check: "Feature",
  title: "Cities",
  addTitle: "City",
  url: "city",
  types:types,
  addApi: "address/city/add",
  editApi: "address/city/update",
  detailApi: "address/city/detail",
  listApi: "address/city/list",
  statusApi: "address/city/statusUpdate",
  deleteApi: "address/city/delete",
};

export default shared;
