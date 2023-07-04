import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Registration from './Pages/Registration';
import Login from './Pages/Login';
import firebaseConfig from './firebase.config';
import Home from './Pages/Home';
import store from './store'
import { Provider } from 'react-redux'
import Profile from './Pages/Profile';
import Message from './Pages/Message';
import ForgotPassword from './Pages/Forgotpassword';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Registration/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/home",
    element: <Home/>,
  },
  {
    path: "/profile",
    element: <Profile/>,
  },
  {
    path: "/message",
    element: <Message/>,
  },
  {
    path: "/forgottonpassword",
    element: <ForgotPassword />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

