import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Login from './Login'
import Register from './Register';
import ThredditNavbar from './ThredditNavbar'
import CreatePost from './CreatePost';
import CreateSubreddit from './CreateSubreddit';
import SubredditView from './SubredditView';
import UserProfileView from './UserProfileView';
import { AuthProvider } from './auth/AuthContext';
import PostView from './PostView';

const App: React.FC = () => {
  return (
    <>
      <Router>
        <AuthProvider>
          <ThredditNavbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path='/create-post' element={<CreatePost />} />
            <Route path='/create-subreddit' element={<CreateSubreddit />} />
            <Route path='/r/:subredditName' element={<SubredditView />}></Route>
            <Route path='/r/:subredditName/posts/:postId' element={<PostView />}></Route>
            <Route path='/u/:username' element={<UserProfileView />}></Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  )
}

export default App
