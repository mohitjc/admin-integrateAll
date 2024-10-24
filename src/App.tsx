import React, { Suspense } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "react-phone-input-2/lib/style.css";
import "react-quill/dist/quill.snow.css";
import "./scss/main.scss";
import configureStoreProd from "./Pages/config/configureStore.prod";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import { lazy } from "react";

const { persistor, store } = configureStoreProd();

function App() {
  
  const routes = [
    { url: "/login", path: "Login" },
    { url: "/dashboard", path: "Dashboard" },
    { url: "*", path: "NotFoundPage" },
    { url: "/profile", path: "Profile" },
    { url: "/profile/:tab", path: "Settings" },
    { url: "/forgotpassword", path: "Forgotpassword" },
    { url: "/resetpassword", path: "Resetpassword" },
    { url: "/staff", path: "Users" },
    { url: "/staff/edit/:id", path: "Users/AddEdit" },
    { url: "/staff/add", path: "Users/AddEdit" },
    { url: "/staff/detail/:id", path: "Users/View" },
    { url: "/role", path: "Roles" },
    { url: "/role/edit/:id", path: "Roles/AddEdit" },
    { url: "/role/add", path: "Roles/AddEdit" },
    { url: "/role/detail/:id", path: "Roles/View" },
    { url: "/material", path: "Materials" },
    { url: "/material/edit/:id", path: "Materials/AddEdit" },
    { url: "/material/add", path: "Materials/AddEdit" },
    { url: "/material/detail/:id", path: "Materials/View" },
    { url: "/project", path: "Projects" },
    { url: "/project/edit/:id", path: "Projects/AddEdit" },
    { url: "/project/add", path: "Projects/AddEdit" },
    { url: "/project/detail/:id", path: "Projects/View" },
    { url: "/feature", path: "Features" },
    { url: "/feature/edit/:id", path: "Features/AddEdit" },
    { url: "/feature/add", path: "Features/AddEdit" },
    { url: "/feature/detail/:id", path: "Features/View" },
    { url: "/country", path: "Country" },
    { url: "/country/edit/:id", path: "Country/AddEdit" },
    { url: "/country/add", path: "Country/AddEdit" },
    { url: "/country/detail/:id", path: "Country/View" },
    { url: "/state", path: "State" },
    { url: "/state/edit/:id", path: "State/AddEdit" },
    { url: "/state/add", path: "State/AddEdit" },
    { url: "/state/detail/:id", path: "State/View" },
    { url: "/city", path: "City" },
    { url: "/city/edit/:id", path: "City/AddEdit" },
    { url: "/city/add", path: "City/AddEdit" },
    { url: "/city/detail/:id", path: "City/View" },
    { url: "/Continent", path: "Continent" },
    { url: "/continent/edit/:id", path: "Continent/AddEdit" },
    { url: "/continent/add", path: "Continent/AddEdit" },
    { url: "/continent/detail/:id", path: "Continent/View" },
    { url: "/plan", path: "Plans" },
    { url: "/plan/edit/:id", path: "Plans/AddEdit" },
    { url: "/plan/add", path: "Plans/AddEdit" },
    { url: "/plan/detail/:id", path: "Plans/View" },
    { url: "/category", path: "Category" },
    { url: "/category/edit/:id", path: "Category/AddEdit" },
    { url: "/category/add", path: "Category/AddEdit" },
    { url: "/category/detail/:id", path: "Category/View" },
    { url: "/categorytype", path: "CategoryType" },   //categpry type routes
    { url: "/categorytype/edit/:id", path: "CategoryType/AddEdit" },
    { url: "/categorytype/add", path: "CategoryType/AddEdit" },
    { url: "/categorytype/detail/:id", path: "CategoryType/View" },
    { url: "/", element: <Navigate to="/login" /> },
    { url: "/chat", path: "Chat" },
    { url: "/content", path: "Content" },
    { url: "/content/detail/:slug", path: "Content/View" },
    { url: "/content/add", path: "Content/AddEdit" },
    { url: "/content/edit/:slug", path: "Content/AddEdit" },
    { url: "/customers", path: "Customers" },
    { url: "/customers/edit/:id", path: "Customers/AddEdit" },
    { url: "/customers/add", path: "Customers/AddEdit" },
    { url: "/customers/detail/:id", path: "Customers/View" },
    { url: "/blogs", path: "Blogs" },
    { url: "/blogs/edit/:id", path: "Blogs/AddEdit" },
    { url: "/blogs/add", path: "Blogs/AddEdit" },
    { url: "/blogs/detail/:id", path: "Blogs/View" },
    { url: "/faqs", path: "Faq" },
    { url: "/faqs/edit/:id", path: "Faq/AddEdit" },
    { url: "/faqs/add", path: "Faq/AddEdit" },
    { url: "/faqs/detail/:id", path: "Faq/View" },
    { url: "/sitedetails", path: "SiteDetails" },
    { url: "/sitedetails/edit/:id", path: "SiteDetails/AddEdit" },
    { url: "/sitedetails/add", path: "SiteDetails/AddEdit" },
    { url: "/sitedetails/detail/:id", path: "SiteDetails/View" },
    { url: "/newsletter", path: "Newsletter" },
  ];

  sessionStorage.clear();

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={"loading ..."} persistor={persistor}>
          <Suspense
            fallback={
              <div id="loader" className="loaderDiv">
                <div>
                  <img
                    src="/assets/img/loader.gif"
                    alt="logo"
                    className="loaderlogo"
                  />
                </div>
              </div>
            }
          >
            <Router>
              <Routes>
                {routes.map((itm) => {
                  const Element = lazy(() => import(`./Pages/${itm.path}`));
                  return (
                    <Route
                      path={itm.url}
                      element={itm.path ? <Element /> : itm.element}
                    />
                  );
                })}
              </Routes>
            </Router>
          </Suspense>
        </PersistGate>
      </Provider>
      <div id="loader" className="loaderDiv d-none">
        <div>
          <img src="/assets/img/loader.gif" alt="logo" className="loaderlogo" />
        </div>
      </div>
      <ToastContainer position="top-right" />
    </>
  );
}

export default App;
