import { createSlice } from "@reduxjs/toolkit";

const storedUser = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: storedUser || null,
  token: storedUser?.token || null,
};
  
  const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      setUser: (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token
      },
      logoutUser: (state) => {
        state.user = null;
        state.token = null;
      },
    },
  });
  
  export const { setUser, logoutUser } = authSlice.actions;
  export default authSlice.reducer;
  