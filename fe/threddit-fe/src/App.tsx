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

const App: React.FC = () => {
  return (
    <>
      <Router>
        <ThredditNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/create-subreddit' element={<CreateSubreddit />} />
          <Route path='/r/:subredditName' element={<SubredditView />}></Route>
          <Route path='/user/:username' element={<UserProfileView />}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
