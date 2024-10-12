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
  check: "Continent",
  title: "Continents",
  addTitle: "Continent",
  url: "continent",
  types:types,
  addApi: "address/continents/add",
  editApi: "address/continents/update",
  detailApi: "address/continents/detail",
  listApi: "address/continents/list",
  statusApi: "address/continents/statusUpdate",
  deleteApi: "address/continents/delete",
};

export default shared;
