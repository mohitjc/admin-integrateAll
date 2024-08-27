const status=[
  {id:'accepted',name:'Accepted'},
  {id:'rejected',name:'Rejected'},
  {id:'completed',name:'Completed'},
  {id:'counteroffered',name:'Counter Offered'},
  {id:'pending',name:'Pending'},
  {id:'contractcreated',name:'Contract Created'},
  {id:'offer-received',name:'offer-received'}
]

// ['pending', 'completed', 'overdue','accepted','rejected','counteroffered',"contractcreated","offer-received","quotation-submitted","staff-accepted"],

const getWordPrice=(w=0,estimates=[])=>{
  let word=Number(w||0)
  let price=0
  let word_count=estimates?.wordCount||0
  let estimatedPrice=estimates?.estimatedPrice||0

  let per=(word_count*100)/word
  price=(estimatedPrice*100)/per
  return Number(price.toFixed(2))
}


const shared = {
  check: "Assignment",
  getWordPrice:getWordPrice,
  title: "Assignment",
  addTitle: "Assignment",
  url: "assignment",
  status:status,
  addApi: "assignment/add",
  editApi: "assignment/update",
  detailApi: "assignment/detail",
  counterdetail :"counter-offer/detail",
  listApi: "assignment/listing",
  statusApi: "user/status/change",
  deleteApi: "assignment/delete",
  counterListApi: "counter-offer/listing"
};

export default shared;
