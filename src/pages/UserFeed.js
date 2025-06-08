import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, addnewPostAsync, updatePostAsync, deletePostAsync, likepostAsync } from "./PostSlice";
import { addBookmark, removeBookmark, fetchBookmarks } from "./bookmarkSlice";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const UserFeed = () => {
  const dispatch = useDispatch();
  const { posts: postArray = [], status, error } = useSelector(state => state.posts);
  const { bookmarks = [] } = useSelector((state) => state.bookmarks);

  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [postForm, setPostForm] = useState({
    id: null, 
    title: "", 
    content: "", 
    likes: 0, 
    createdAt: Date.now(), 
    media: null 
  });
 
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState("date");

  useEffect(() => {
    if(status === "idle"){
      dispatch(fetchPosts());
    }
  }, [dispatch, status]);

  useEffect(() => {
    dispatch(fetchBookmarks());
  }, [dispatch]);

  useEffect(() => {
    if (postArray.length > 0) {
      let updatedPosts = [...postArray];
  
      if (sortOrder === "trending") {
        updatedPosts.sort((a, b) => b.likes - a.likes);
      } else if (sortOrder === "date") {
        updatedPosts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt) 
        );
      }
  
      setFilteredPosts(updatedPosts); 
    }
  }, [postArray, sortOrder]);

  const handleFilterTrending = () => {
    setSortOrder("trending");
  };

  const handleSortByDate = () => {
    setSortOrder("date");
  };
  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
  };
 
  const handleUpload = async () => {
    if (!image) {
      return null;
    }
      setIsUploading(true)
      const formdata = new FormData();
    formdata.append("image", image);

    try {
      const response = await axios.post(
        "https://blitzgramm-backend.vercel.app/upload",
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUploadedImageUrl(response.data.imageUrl);
      setIsUploading(false);
      return response.data.imageId;
    } catch (error) {
      console.error("Error uploading image:", error);
      setIsUploading(false);
      return null;
    }
    }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let mediaUrl = postForm.media

    if (image) {
      mediaUrl = await handleUpload();
    }
    
    const finalPostData = {
      ...postForm,
      media: mediaUrl
    };
    
    if (isEditing) {
      dispatch(updatePostAsync(finalPostData));
    } else {
      dispatch(addnewPostAsync(finalPostData));
    }
    setPostForm({id: null, title: "", content: "", likes: 0, createdAt: Date.now(), media: null });
    setImage(null);
    setUploadedImageUrl("");
    setIsCreating(false);
    setIsEditing(false);
  };

  const startEditing = (post) => {
    setPostForm(post);
    setIsEditing(true);
    setUploadedImageUrl(post.media || "")
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };
  
  const handleLike = (postId) => {
    dispatch(likepostAsync(postId));
  };  

  const handleBookmark = (postId) => {
    if (!postId) return; 
    
    const isBookmarked = bookmarks.some(bookmark => 
      bookmark && 
      bookmark.post && 
      bookmark.post._id && 
      bookmark.post._id === postId
    );
    
    if (isBookmarked) {
      dispatch(removeBookmark(postId));
    } else {
      dispatch(addBookmark(postId));
    }
  };
   
  return(
    <div className="bg-secondary-subtle py-4">
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 me-4">
          <Sidebar />
        </div>
        
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h2 className="h4 mb-0">Posts Feed</h2>
              <div className="btn-group">
                <button 
                  className={`btn btn-sm ${sortOrder === "date" ? "btn-light" : "btn-outline-light"}`} 
                  onClick={handleSortByDate}
                >
                  <i className="bi bi-calendar me-1"></i> Latest
                </button>
                <button 
                  className={`btn btn-sm ${sortOrder === "trending" ? "btn-light" : "btn-outline-light"}`} 
                  onClick={handleFilterTrending}
                >
                  <i className="bi bi-graph-up me-1"></i> Trending
                </button>
              </div>
            </div>
            <div className="card-body p-0">
              {status === "loading" && (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading posts...</p>
                </div>
              )}
              
              {status === "error" && (
                <div className="alert alert-danger m-3" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Error loading posts: {error}
                </div>
              )}
              
              {status === "success" && filteredPosts.length === 0 && (
                <div className="text-center py-5">
                  <i className="bi bi-journal-x" style={{ fontSize: "3rem" }}></i>
                  <p className="text-muted mt-2">No posts found</p>
                </div>
              )}
              
              {status === "success" && filteredPosts.length > 0 && (
                <div className="post-list">
                  {filteredPosts.map((post) => (
                    <div className="card border-0 border-bottom rounded-0" key={post._id}>
                      <div className="card-body">
                        {post.media && (
                          <div className="mb-3">
                            <img 
                              src={post.media.imageUrl} 
                              className="img-fluid rounded" 
                              alt="Post media" 
                            />
                          </div>
                        )}
                        <h5 className="card-title">{post.title}</h5>
                        <p className="card-text">{post.content}</p>
                        <div className="d-flex align-items-center text-muted small mb-3">
                          <i className="bi bi-calendar me-1"></i>
                          <span>
                            {new Date(post.createdAt).toLocaleDateString("en-CA", {
                              year: "numeric",
                              month: "short",
                              day: "numeric"
                            })}
                          </span>
                        </div>
                        
                        <div className="d-flex flex-wrap gap-2">
                          <button className="btn mx-3" onClick={() => handleLike(post._id)}>
                            {post.like ? "❤️" : "🤍"}{post.likes}
                          </button>
                          
                          <button 
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => post && post._id && handleBookmark(post._id)}
                          >
                            <i className="bi bi-bookmark me-1"></i>
                            {bookmarks && bookmarks.some(b => 
                              b && b.post && b.post._id && b.post._id === post._id
                            ) ? "Saved" : "Bookmark"}
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => startEditing(post)}
                          >
                            <i className="bi bi-pencil me-1"></i>
                            Edit
                          </button>
                          
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => dispatch(deletePostAsync(post._id))}
                          >
                            <i className="bi bi-trash me-1"></i>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h3 className="h5 mb-0">
                {isEditing ? "Edit Post" : "Create New Post"}
              </h3>
            </div>
            <div className="card-body">
              {!isCreating && !isEditing ? (
                <div className="text-center py-4">
                  <i className="bi bi-plus-circle" style={{ fontSize: "2rem" }}></i>
                  <p className="my-3">Share your thoughts with the community</p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setIsCreating(true)}
                  >
                    Create New Post
                  </button>
                </div>
              ) : (
                <form onSubmit={(e) => { handleSubmit(e); }}>
                  <div className="mb-3">
                    <label htmlFor="postTitle" className="form-label">Title</label>
                    <input
                      type="text"
                      id="postTitle"
                      name="title"
                      value={postForm.title}
                      onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                      placeholder="Add a descriptive title"
                      className="form-control"
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="postContent" className="form-label">Content</label>
                    <textarea
                      id="postContent"
                      name="content"
                      value={postForm.content}
                      onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                      placeholder="What's on your mind?"
                      className="form-control"
                      rows="5"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="likes" className="form-label">Likes</label>
                    <input
                      type="text"
                      id="likes"
                      name="likes"
                      value={postForm.likes}
                      onChange={(e) => setPostForm({...postForm, likes: e.target.value})}
                      placeholder="Add likes"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="postMedia" className="form-label">Media (optional)</label>
                    <input
                      type="file"
                      id="postMedia"
                      onChange={handleImageUpload}
                      accept="image/*,video/*"
                      className="form-control"
                    />
                    {uploadedImageUrl && (
                      <div className="mt-2">
                        <img 
                          src={uploadedImageUrl} 
                          alt="Preview" 
                          className="img-thumbnail" 
                          style={{ maxHeight: "100px" }} 
                        />
                      </div>
                    )}
                    <div className="form-text">Add an image or video to your post</div>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-primary flex-grow-1" 
                      type="submit"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <i className={`bi ${isEditing ? "bi-check-circle" : "bi-send"} me-1`}></i>
                          {isEditing ? "Update Post" : "Publish Post"}
                        </>
                      )}
                    </button>
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button"
                      onClick={() => {
                        setIsCreating(false);
                        setIsEditing(false);
                        setPostForm({id: null, title: "", content: "", likes: 0, createdAt: Date.now(), media: null});
                        setImage(null);
                        setUploadedImageUrl("")
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default UserFeed;