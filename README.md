# Blitzgramm (Social Media Platform)

A full-stack social media app with Redux for state management, user-driven feed sorting(trending, recent), bookmarks and a responsive UI built with React.

---

## Login

**Guest**
Username: `tony@email.com`
Password: `tony123`

---
## Quick Start

```
git clone https://github.com/anmol-virk/blitzgramm-frontend.git
cd <blitzgramm-frontend>
npm install
npm start
```

---

## Technologies
- React JS
- Node JS
- Express
- MongoDB
- JWT

---

## Features
**Profile Page**
- An editable Bio section with profile picture.
- List of all the Posts by User and their basic details with a sidebar to navigate further.
- To the right side various Users which you can follow or unfollow.

**Userfeed**
- List of all the posts with user-driven feed sorting(trending, latest).
- Images can be Liked, Bookmarked, Edited or Delete.
- To the right, a Section to create new posts (choosing file, likes and publish them).

**Explorefeed**
- List of all the Posts by all Users.

**Bookmarks**
- List of all the Bookmarked Posts.

---

## API Reference

### ***GET /api/posts***
List of all Posts created by User.

### ***POST posts/api/user/post***
Adds a new Post.

### ***PUT /api/posts/edit/:postId***
Edit and Update a Post by its ID.

### ***POST /api/posts/like/:postId***
Like a Post by ID.

### ***POST /api/users/follow/:followUserId***
Follow a User by its ID.

### ***POST /api/users/unfollow/:followUserId***
Unfollow a User by its ID.

---

## Contact

For bugs or feature request, please reach out to anmolthisside@gmail.com