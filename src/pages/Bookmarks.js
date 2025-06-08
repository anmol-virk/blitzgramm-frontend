import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeBookmark, fetchBookmarks } from "./bookmarkSlice";
import { fetchPosts } from "./PostSlice";
import Sidebar from "../components/Sidebar";

const Bookmarks = () => {
    const dispatch = useDispatch()
  const { posts : postArray = [] } = useSelector((state) => state.posts);
  const { bookmarks = [] } = useSelector((state) => state.bookmarks);
  console.log("All poossts",postArray)
  console.log("Bookmarks", bookmarks)

  useEffect(() => {
      dispatch(fetchPosts());
      dispatch(fetchBookmarks());
  }, [dispatch]);


  return (
    <div className="bg-secondary-subtle py-4">
      <div className="row container">
        <div className="col-md-3">
     <Sidebar />
     </div>
     <div className="col-md-9">
      <h2>Bookmarked Posts</h2>
      {bookmarks.length === 0 ? (
        <p>No bookmarked posts yet.</p>
      ) : (
        bookmarks
        .filter((bookmark) => bookmark.post !== null) 
        .map((post) => (
          <div className="card mb-3 col-md-6" key={post._id}>
            <div className="card-body">
              <h5 className="card-title">{post.post.title}</h5>
              <p className="card-text">{post.post.content}</p>
              <button className="btn btn-danger" onClick={() =>  dispatch(removeBookmark(post.post._id))}>Remove</button>
            </div>
          </div>
        ))
      )}
      </div>
      </div>
    </div>
  );
};

export default Bookmarks;
