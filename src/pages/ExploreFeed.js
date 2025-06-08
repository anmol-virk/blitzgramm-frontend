import React, {useState, useEffect} from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchPosts } from "./PostSlice"
import Sidebar from "../components/Sidebar"

const ExploreFeed = () => {
    const {posts : allPosts = [], status, error} = useSelector(state => state.posts)
    console.log("All posts:", allPosts)

    const dispatch = useDispatch()

    useEffect(() => {
        if(status === "idle"){
           dispatch(fetchPosts())
        }
       }, [dispatch, status])

       return (
        <div className="bg-secondary-subtle py-4">
          <div className="row container">
            <div className="col-md-3">
          <Sidebar />
          </div>
          <div className="col-md-8">
          <h2>Explore Feed</h2>
          {allPosts.map((post) => (
            <div className="card mb-3" key={post._id}>
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <div className="mb-3">                
                 <img 
                   src={post.media?.imageUrl} 
                  className="img-fluid rounded" 
                    alt="Post media" 
                 />
                </div>
                <p className="card-text">{post.content}</p>
                <p className="text-muted">By: {post.user?.name}</p>
              </div>
            </div>
          ))}
          </div>
          </div>
        </div>
      );
}

export default ExploreFeed