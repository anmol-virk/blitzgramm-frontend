import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const Prefix_Url = "https://blitzgramm-backend.vercel.app"
const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

export const fetchUsers = createAsyncThunk(
    "users/fetchUsers",
     async () => {
    const response = await axios.get(`${Prefix_Url}/users`, axiosConfig)
    return response.data.data.users
})

export const followUser = createAsyncThunk(
    "users/followUser",
    async ({ userId, followUserId }) => {
      const response = await axios.post(`${Prefix_Url}/users/follow/${followUserId}`, { userId }, axiosConfig);
      return { followUserId };
    }
  );
  
  export const unfollowUser = createAsyncThunk(
    "users/unfollowUser",
    async ({ userId, followUserId }) => {
      const response = await axios.post(`${Prefix_Url}/users/unfollow/${followUserId}`, { userId }, axiosConfig);
      return { followUserId };
    }
  );
  
export const userSlice = createSlice({
    name: "users",
    initialState: {
        users: [],
        id: null,
        status: "idle",
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchUsers.fulfilled, (state, action) => {
            state.users = action.payload
        })
        .addCase(followUser.fulfilled, (state, action) => {
            const {followUserId } = action.payload;
            const user = state.users.find((user) => user._id === followUserId);    
            if (user) {
              user.following = true
            }
          })
          .addCase(unfollowUser.fulfilled, (state, action) => {
            const { followUserId } = action.payload;
            const user = state.users.find((user) => user._id === followUserId);

            if (user) {
              user.following = false
            }
          })
    }
})

export default userSlice.reducer