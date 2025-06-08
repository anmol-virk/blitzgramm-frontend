import { configureStore } from "@reduxjs/toolkit";
import { postsSlice } from "../pages/PostSlice";
import userReducer from "../pages/UserSlice"
import { bookmarkSlice } from "../pages/bookmarkSlice";
import authReducer from "../components/authSlice";

const store = configureStore({
    reducer: {
       posts: postsSlice.reducer,
       users: userReducer,
       bookmarks: bookmarkSlice.reducer,
       auth: authReducer
    }
})

export default store