const status=[
  {id:'pending',name:'Pending'},
  {id:'complete',name:'Complete'},
]

const shared = {
  check: "Invoice",
  title: "Invoices",
  addTitle: "Invoice",
  url: "invoice",
  addApi: "skill/add",
  editApi: "skill/update",
  detailApi: "invoice/detail",
  listApi: "invoice/listing",
  statusApi: "skill/status/change",
  status:status,
  deleteApi: "skill/delete",
};

export default shared;
