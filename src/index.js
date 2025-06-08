import './index.css';
import { StrictMode } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from './App';
import store from './app/store';
import Signup from './components/Signup';
import UserFeed from './pages/UserFeed';
import UserProfile from './pages/UserProfile';
import ExploreFeed from './pages/ExploreFeed';
import Bookmarks from './pages/Bookmarks';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/user/signup",
    element: <Signup />
  },
  {
    path: "/userfeed",
    element: <UserFeed />
  },
  {
    path: "/profile",
    element: <UserProfile />
  },
  {
    path: "/explorefeed",
    element: <ExploreFeed />
  },
  {
    path: "/users/bookmarks",
    element: <Bookmarks />
  },
])
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);

