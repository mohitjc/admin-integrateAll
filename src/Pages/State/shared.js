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
  title: "States",
  addTitle: "State",
  url: "state",
  types:types,
  addApi: "address/region/add",
  editApi: "address/region/update",
  detailApi: "address/region/detail",
  listApi: "address/region/list",
  statusApi: "address/region/statusUpdate",
  deleteApi: "address/region/delete",
};

export default shared;
