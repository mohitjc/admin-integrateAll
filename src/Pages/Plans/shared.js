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


  const options= [
    { name: 1, id: 1 },
    { name: 2, id: 2 },
    { name: 3, id: 3 },
    { name: 4, id: 4 },
    { name: 5, id: 5 },
    { name: 6, id: 6 },
    { name: 7, id: 7 },
    { name: 8, id: 8 },
    { name: 9, id: 9 },
    { name: 10, id: 10 },
    { name: 11, id: 11 },
    { name: 12, id: 12 },
    { name: 13, id: 13 },
    { name: 14, id: 14 },
    { name: 15, id: 15 },
    { name: 16, id: 16 },
    { name: 17, id: 17 },
    { name: 18, id: 18 },
    { name: 19, id: 19 },
    { name: 20, id: 20 },
    { name: 21, id: 21 },
    { name: 22, id: 22 },
    { name: 23, id: 23 },
    { name: 24, id: 24 },
    { name: 25, id: 25 },
    { name: 26, id: 26 },
    { name: 27, id: 27 },
    { name: 28, id: 28 },
    { name: 29, id: 29 },
    { name: 30, id: 30 }
  ]

  const planType = [
    { id: 'stripe', name: 'Stripe' },
    { id: 'frontend', name: 'Frontend' },
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
  options:options,
  planType:planType
};

export default shared;
