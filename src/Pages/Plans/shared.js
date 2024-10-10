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
  addApi: "plan/add",
  editApi: "plan/update",
  detailApi: "plan/detail",
  listApi: "plan/listing",
  statusApi: "plan/status/change",
  deleteApi: "plan/delete",
};

export default shared;
