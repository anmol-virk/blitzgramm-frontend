import { Link } from "react-router-dom"
import LogoutButton from "./Logout"
import './Sidebar.css'

const Sidebar = () => {
    return(
        <>
         <header className="bg-lightgrey text-dark py-3 col-md-2">
    <nav className="text-start">
      <div className="sidebar">
      <h3 className="title mx-3">Blitzgramm</h3>
      <Link className="sidebar-link" to={"/profile"}>Profile</Link>
      <Link className="sidebar-link" to={"/userfeed"}>Userfeed</Link>
      <Link className="sidebar-link" to={"/explorefeed"}>Explore</Link>
      <Link className="sidebar-link" to={"/users/bookmarks"}>Bookmarks</Link>
      <div className="sidebar-link logoutBtn">
      <LogoutButton />
      </div>
      </div>
    </nav>
  </header>
        </>
    )
}

export default Sidebar;