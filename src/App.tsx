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
    { url: "/user", path: "Users" },
    { url: "/user/edit/:id", path: "Users/AddEdit" },
    { url: "/user/add", path: "Users/AddEdit" },
    { url: "/user/detail/:id", path: "Users/View" },
    { url: "/contractor", path: "Contractors" },
    { url: "/contractor/edit/:id", path: "Contractors/AddEdit" },
    { url: "/contractor/add", path: "Contractors/AddEdit" },
    { url: "/contractor/detail/:id", path: "Contractors/View" },
    { url: "/skill", path: "Skills" },
    { url: "/skill/edit/:id", path: "Skills/AddEdit" },
    { url: "/skill/add", path: "Skills/AddEdit" },
    { url: "/skill/detail/:id", path: "Skills/View" },
    { url: "/supplier", path: "Suppliers" },
    { url: "/supplier/edit/:id", path: "Suppliers/AddEdit" },
    { url: "/supplier/add", path: "Suppliers/AddEdit" },
    { url: "/supplier/detail/:id", path: "Suppliers/View" },
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
    { url: "/category", path: "Category" },
    { url: "/category/edit/:id", path: "Category/AddEdit" },
    { url: "/category/add", path: "Category/AddEdit" },
    { url: "/category/detail/:id", path: "Category/View" },
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
    { url: "/contract", path: "Contract" },
    { url: "/contract/detail/:id", path: "Contract/View" },
    { url: "/blogs", path: "Blogs" },
    { url: "/blogs/edit/:id", path: "Blogs/AddEdit" },
    { url: "/blogs/add", path: "Blogs/AddEdit" },
    { url: "/blogs/detail/:id", path: "Blogs/View" },
    { url: "/faqs", path: "Faq" },
    { url: "/faqs/edit/:id", path: "Faq/AddEdit" },
    { url: "/faqs/add", path: "Faq/AddEdit" },
    { url: "/faqs/detail/:id", path: "Faq/View" },
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
