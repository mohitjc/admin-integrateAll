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
  title: "Countries",
  addTitle: "Country",
  url: "country",
  types:types,
  addApi: "feature/add-features",
  editApi: "feature/update-feature",
  detailApi: "feature/get-feature-detail",
  listApi: "feature/get-feature-list",
  statusApi: "feature/update-feature",
  deleteApi: "feature/delete-feature",
};

export default shared;