import React, { useState, useEffect } from 'react';
import { FaHeart, FaComment, FaShare, FaBookmark } from 'react-icons/fa';
import '../Styles/CollegeLife.css';

const CollegeLife = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'John Doe',
      content: 'Just finished my first week of college! Any tips for managing time between classes and social life?',
      likes: 15,
      comments: 5,
      timestamp: '2h ago'
    },
    {
      id: 2,
      author: 'Jane Smith',
      content: 'Looking for study partners for Computer Science 101. Anyone interested?',
      likes: 8,
      comments: 3,
      timestamp: '4h ago'
    }
  ]);

  const [dailyTips, setDailyTips] = useState([
    "Join at least one club or organization in your first semester to build connections.",
    "Create a study schedule and stick to it - consistency is key to academic success.",
    "Don't be afraid to ask for help - professors and TAs are there to support you."
  ]);

  const [newPost, setNewPost] = useState('');

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      const post = {
        id: posts.length + 1,
        author: 'You',
        content: newPost,
        likes: 0,
        comments: 0,
        timestamp: 'Just now'
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  return (
    <div className="college-life">
      <div className="container mx-auto px-4 py-8">
        {/* Daily Tips Section */}
        <div className="daily-tips mb-8">
          <h2 className="text-2xl font-bold mb-4">Daily College Life Tips</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            {dailyTips.map((tip, index) => (
              <div key={index} className="tip-item mb-4 last:mb-0">
                <p className="text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Create Post Section */}
        <div className="create-post mb-8">
          <form onSubmit={handlePostSubmit} className="bg-white rounded-lg shadow-md p-6">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your college experience..."
              className="w-full p-4 border rounded-lg mb-4"
              rows="3"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Post
            </button>
          </form>
        </div>

        {/* Posts Feed */}
        <div className="posts-feed">
          {posts.map(post => (
            <div key={post.id} className="post-card bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="post-header mb-4">
                <h3 className="font-bold">{post.author}</h3>
                <span className="text-gray-500 text-sm">{post.timestamp}</span>
              </div>
              <p className="post-content mb-4">{post.content}</p>
              <div className="post-actions flex items-center space-x-6">
                <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
                  <FaHeart />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500">
                  <FaComment />
                  <span>{post.comments}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-500 hover:text-purple-500">
                  <FaShare />
                </button>
                <button className="flex items-center space-x-2 text-gray-500 hover:text-yellow-500">
                  <FaBookmark />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollegeLife; 