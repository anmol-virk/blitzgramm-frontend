import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getAxiosInstance = () => {
  const token = localStorage.getItem("token");
  return axios.create({
    baseURL: "https://blitzgramm-backend.vercel.app",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addBookmark = createAsyncThunk(
  "bookmarks/addBookmark",
  async (postId) => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.post(`/users/bookmark/${postId}`);
    console.log("APiI Response:", response.data.data);
    return response.data.data; 
  }
);

export const removeBookmark = createAsyncThunk(
  "bookmarks/removeBookmark",
  async (postId) => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.delete(`/users/remove-bookmark/${postId}`);
    return response.data.data; 
  }
);

export const fetchBookmarks = createAsyncThunk(
  "bookmarks/fetchBookmarks",
  async () => {
    const axiosInstance = getAxiosInstance();
    const response = await axiosInstance.get("/users/bookmarks");
    return response.data.data; 
  }
);

export const bookmarkSlice = createSlice({
  name: "bookmarks",
  initialState: {
    bookmarks: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addBookmark.fulfilled, (state, action) => {
        state.bookmarks = [...state.bookmarks, action.payload]
      })
      .addCase(removeBookmark.fulfilled, (state, action) => {
       state.bookmarks = state.bookmarks.filter((bookmark) => bookmark && bookmark.post && bookmark.post._id !== action.payload)
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.bookmarks = action.payload;
      })
  },
});

export default bookmarkSlice.reducer;
