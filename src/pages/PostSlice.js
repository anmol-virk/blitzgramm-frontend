import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const prefixUrl = "https://blitzgramm-backend.vercel.app"
const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

export const fetchPosts = createAsyncThunk(
    "posts/fetchPosts",
    async () => {
        const response = await axios.get(`${prefixUrl}/posts`, axiosConfig)
        console.log("API Response:", response.data.data.posts )
        return response.data.data.posts
    }
)

export const addnewPostAsync = createAsyncThunk("posts/addPost",
     async (newPost) => {
     const response = await axios.post(`${prefixUrl}/user/post`, newPost, axiosConfig)
     return response.data
})

export const updatePostAsync = createAsyncThunk("posts/updatePost", async (updatedPost) => {
    const response = await axios.put(`${prefixUrl}/posts/edit/${updatedPost._id}`, updatedPost, axiosConfig)
    return response.data
})

export const deletePostAsync = createAsyncThunk("posts/deletePost", async (id) => {
    await axios.delete(`${prefixUrl}/user/posts/${id}`, axiosConfig)
    return id
})

export const likepostAsync = createAsyncThunk("likePost/likepostAsync", async (postId) => {
    const response = await axios.post(`${prefixUrl}/posts/like/${postId}`, axiosConfig)
    return response.data
})

export const postsSlice = createSlice({
    name: "posts",
    initialState: {
        posts: [],
        status: "idle",
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchPosts.pending, (state) => {
            state.status = "loading"
        })
        .addCase(fetchPosts.fulfilled, (state, action) => {
            state.status = "success"
            state.posts = action.payload
        })
        .addCase(fetchPosts.rejected, (state, action) => {
            state.status = "error"
            state.error = action.error.message
        })
        .addCase(addnewPostAsync.fulfilled, (state, action) => {
            console.log( "okok", state.posts);
            state.posts.push(action.payload)
        })
        .addCase(updatePostAsync.fulfilled, (state, action) => {
            const index = state.posts.findIndex((post) => post._id === action.payload._id)
         if(index !== -1){
            state.posts[index] = action.payload
         }
        })
        .addCase(deletePostAsync.fulfilled, (state, action) => {
            state.posts = state.posts.filter((post) => post._id !== action.payload)
        })
        .addCase(likepostAsync.fulfilled, (state, action) => {
            
            const index = state.posts.findIndex((post) => post._id === action.payload._id )
            if(index !== -1){
                state.posts[index] = action.payload
            }
        });
    }
})

export default postsSlice.reducer