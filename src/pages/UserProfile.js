import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, followUser, unfollowUser } from "./UserSlice";
import { fetchPosts, likepostAsync, deletePostAsync } from "./PostSlice";
import Sidebar from "../components/Sidebar";
import { setUser } from "../components/authSlice";

const avatarOptions = [
  "https://cdn-icons-png.flaticon.com/128/1999/1999625.png",
  "https://cdn-icons-png.flaticon.com/128/4140/4140037.png",
  "https://cdn-icons-png.flaticon.com/128/924/924915.png",
  "https://cdn-icons-png.flaticon.com/128/11107/11107521.png",
  "https://cdn-icons-png.flaticon.com/128/7070/7070249.png",
];

const UserProfile = () => {
  const dispatch = useDispatch()
  const {posts: postArray = []} = useSelector(state => state.posts)
const {users: userArray = [], status, error} = useSelector(state => state.users)
const loggedInUser = useSelector((state) => state.auth?.user);
const loggedInUserId = loggedInUser?.userId;

const userPosts = loggedInUserId
? postArray.filter((post) => post.user?._id === loggedInUserId)
: [];

  const [isEditing, setIsEditing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]); 
  const [bio, setBio] = useState("This is your bio. Add something about yourself!"); 
  const [tempBio, setTempBio] = useState(bio);
  const [tempAvatar, setTempAvatar] = useState(selectedAvatar);

  useEffect(() => {
    if(status === "idle" && loggedInUser){
       dispatch(fetchUsers())
       dispatch(fetchPosts())
    }
   }, [dispatch, status, loggedInUser])

   useEffect(() => {
    const savedBio = localStorage.getItem("bio");
    const savedAvatar = localStorage.getItem("avatar");
    const savedUser = localStorage.getItem("user");

    if (savedBio) setBio(savedBio);
    if (savedAvatar) setSelectedAvatar(savedAvatar);
    if (savedUser && !loggedInUser) {
      dispatch(setUser({ user: JSON.parse(savedUser), token: null }));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("bio", tempBio)
    localStorage.setItem("avatar", tempAvatar)
    localStorage.setItem("user", JSON.stringify({
      ...loggedInUser,
      bio: tempBio,
      avatar: tempAvatar
    }));
    setBio(tempBio);
    setSelectedAvatar(tempAvatar);
    setIsEditing(false);
    
    dispatch(setUser({
      user: {
        ...loggedInUser,
        bio: tempBio,
        avatar: tempAvatar
      },
      token: loggedInUser?.token || null
    }));
    
  };

  const handleCancel = () => {
    setTempBio(bio);
    setTempAvatar(selectedAvatar);
    setIsEditing(false);
  };
  const handleLike = (postId) => {
    dispatch(likepostAsync(postId))
  }  
  const toggleFollowBtn = (id, following) => {
   if(loggedInUserId){
    if (following) {
      dispatch(unfollowUser({ id: loggedInUserId, followUserId: id }));
    } else {
      dispatch(followUser({ id: loggedInUserId, followUserId: id }));
    }}
  };

  return (
    <div className="py-4 text-center bg-secondary-subtle">
      <div className="container-fluid">
        <div className="row">
      <Sidebar />
      <div className="col">
      <h2 className="mb-4">Profile Page</h2>

      <div className="mb-4">
        <img
          src={selectedAvatar}
          alt="Profile Avatar"
          className="rounded-circle"
          style={{ width: "150px", height: "150px" }}
        />
      </div>

      <div className="mb-4">
        <h4>Bio</h4>
        <p>{bio}</p>
      </div>

      {isEditing ? (
        <div>
          <h4>Edit Profile</h4>

          <div className="mb-3">
            <h5>Select an Avatar</h5>
            <div className="d-flex justify-content-center gap-3">
              {avatarOptions.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  className={`rounded-circle ${tempAvatar === avatar ? "border border-primary" : ""}`}
                  style={{ width: "75px", height: "75px", cursor: "pointer" }}
                  onClick={() => setTempAvatar(avatar)}
                />
              ))}
            </div>
          </div>

          <div className="mb-3">
            <h5>Edit Bio</h5>
            <textarea
              value={tempBio}
              onChange={(e) => setTempBio(e.target.value)}
              className="form-control"
              rows="3"
            />
          </div>

          <button className="btn btn-primary mx-2" onClick={handleSave}>
            Save
          </button>
          <button className="btn btn-secondary mx-2" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      ) : (
        <button className="btn btn-outline-primary mb-3" onClick={() => setIsEditing(true)}>
          Edit Profile
        </button>
      )}
     <div className="ms-5">
  {userPosts.map((post) => (
    <div className="col-md-12 " key={post._id}>
      <div className="card shadow-sm h-100 border-0">

        {post.media?.imageUrl && (
          <img
            src={post.media.imageUrl}
            className="card-img-top rounded-top"
            alt="Post media"
            style={{ objectFit: "cover", height: "250px" }}
          />
        )}

        <div className="card-body text-start d-flex flex-column">
          <p>@{post.user?.name}</p>
          <h5 className="card-title fw-bold">{post.title}</h5>
          <p className="card-text">{post.content}</p>

          <div className="mt-auto">
            <p className="text-muted small mb-2">
              {new Date(post.createdAt).toLocaleDateString("en-CA")}
            </p>

            <div className="d-flex align-items-center gap-2">
              <button 
                className="btn btn-light border" 
                onClick={() => handleLike(post._id)}
              >
                {post.like ? "❤️ Liked" : "🤍 Like"}
              </button>

              <span className="badge bg-primary">
                {post.likes} {post.likes === 1 ? "Like" : "Likes"}
              </span>

              <button 
                className="btn btn-outline-danger ms-auto" 
                onClick={() => dispatch(deletePostAsync(post._id))}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
     </div>

     <div className="col-md-3 mt-4">
  {userArray.map((user) => (
    <div className="card mb-2 shadow-sm border-0 py-1" key={user._id}>
      <div className="row g-0 align-items-center">
        
        <div className="col-3 d-flex justify-content-center">
          <div 
            className="rounded-circle bg-light d-flex align-items-center justify-content-center border"
            style={{ width: "60px", height: "60px" }}
          >
            <span className="text-muted small">Img</span>
          </div>
        </div>

        <div className="col-6">
          <div className="card-body p-2">
            <h6 className="card-title mb-1 fw-bold">{user.name}</h6>
            <p className="card-text text-muted small">@{user.name}</p>
          </div>
        </div>

        <div className="col-3 d-flex justify-content-end pe-2">
          <button
            onClick={() => toggleFollowBtn(user._id, user.following)}
            className={`btn btn-sm ${user.following ? "btn-outline-danger" : "btn-outline-primary"}`}
          >
            {user.following ? "Unfollow" : "Follow"}
          </button>
        </div>
        
      </div>
    </div>
  ))}
</div>
</div>
    </div>
    </div>
  );
};

export default UserProfile;
