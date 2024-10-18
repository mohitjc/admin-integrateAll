
const currencyOptions = [
  { id: 'US Dollar (USD)', name: 'US Dollar (USD)' },
  { id: 'Euro (EUR)', name: 'Euro (EUR)' },
  { id: 'British Pound (GBP)', name: 'British Pound (GBP)' },
  { id: 'Australian Dollar (AUD)', name: 'Australian Dollar (AUD)' },
  { id: 'Japanese Yen (JPY)', name: 'Japanese Yen (JPY)' },
];



const shared = {
  check: "Customers",
  title: "Customers",
  addTitle: "Customer",
  url: "customers",
  addApi: "user/add",
  editApi: "user/updateDetails",
  detailApi: "user/detail",
  listApi: "user/getListing",
  statusApi: "user/activateDeactivateProfile",
  deleteApi: "user/delete",
  currencyOptions:currencyOptions
};

export default shared;
