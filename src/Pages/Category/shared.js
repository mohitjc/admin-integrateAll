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
  {
    id:'Business',
    name:'Business'
  }
]
const shared = {
  check: "Category",
  title: "Categories",
  addTitle: "Category",
  url: "category",
  types:types,
  addApi: "category/add",
  editApi: "category/update",
  detailApi: "category/detail",
  listApi: "category/listing",
  statusApi: "category/status/change",
  deleteApi: "category/delete",
};

export default shared;
