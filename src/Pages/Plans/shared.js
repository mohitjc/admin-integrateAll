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
  check: "Plan",
  title: "Plans",
  addTitle: "Plan",
  url: "plan",
  types:types,
  addApi: "category/add",
  editApi: "category/update",
  detailApi: "category/detail",
  listApi: "category/listing",
  statusApi: "category/status/change",
  deleteApi: "category/delete",
};

export default shared;
