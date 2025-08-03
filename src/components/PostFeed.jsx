import React, { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

const COLORS = {
  accentGreen: '#A8E6CF',
  accentBlue: '#B3E5FC',
  background: '#fff',
  card: '#fff',
  accentBrown: '#D7CCC8',
  black: '#111',
  instagram: '#E4405F',
};

// Cloudinary config
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dyaw2n1xi/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "beach_wave";

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "posts"));
      const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Fetched posts:', fetched); // Debug log
      setPosts(fetched.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)));
      setLoading(false);
    };
    fetchPosts();
  }, []);

  // Add a new post with image (Cloudinary)
  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;
    setLoading(true);
    let imageUrl = '';
    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      imageUrl = data.secure_url;
    }
    await addDoc(collection(db, "posts"), {
      author,
      content,
      location,
      imageUrl,
      timestamp: serverTimestamp(),
      likes: 0,
      comments: []
    });
    // Re-fetch posts to ensure the latest post (with image) is shown
    const querySnapshot = await getDocs(collection(db, "posts"));
    const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(fetched.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)));
    setAuthor('');
    setContent('');
    setLocation('');
    setImage(null);
    setLoading(false);
  };

  // Handle like functionality
  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
      } else {
        newLiked.add(postId);
      }
      return newLiked;
    });
  };

  // Handle comment functionality
  const handleComment = (postId) => {
    if (!newComment.trim()) return;
    
    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), {
        id: Date.now(),
        text: newComment,
        author: author || 'Anonymous',
        timestamp: new Date().toISOString()
      }]
    }));
    setNewComment('');
  };

  // Toggle comments visibility
  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleDeletePost = async (postId) => {
    setPostToDelete(postId);
    setOpenDeleteDialog(true);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;
    await deleteDoc(doc(db, "posts", postToDelete));
    setOpenDeleteDialog(false);
    setPostToDelete(null);
    // Re-fetch posts to ensure the latest post (with image) is shown
    const querySnapshot = await getDocs(collection(db, "posts"));
    const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(fetched.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)));
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setPostToDelete(null);
  };

  return (
    <Box
      sx={{
        background: '#E3F2FD',
        py: 4,
        width: '100%',
        maxWidth: 4800,
        mx: 'auto',
        px: 0
      }}
    >
      <Card sx={{ width: '100%', borderRadius: 6, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', background: COLORS.card, p: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: COLORS.instagram, mb: 4, textAlign: 'center', letterSpacing: 1 }}>
            📱 Post Feed
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
            {/* Left Side - Post Creation Form */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', mb: 4, background: COLORS.background }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.instagram, mb: 3 }}>
                    Create New Post
                  </Typography>
                  <Box component="form" onSubmit={handleAddPost} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: COLORS.instagram, width: 40, height: 40 }}>👤</Avatar>
                      <TextField
                        label="Your Name"
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                        size="small"
                        sx={{ flex: 1, borderRadius: 3, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                      />
                    </Box>
                    
                    <TextField
                      label="📍 Location (optional)"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      size="small"
                      sx={{ borderRadius: 3, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                    
                    <TextField
                      label="What's on your mind?"
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      multiline
                      rows={3}
                      sx={{ borderRadius: 3, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                    
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => setImage(e.target.files[0])}
                        style={{ display: 'none' }}
                        id="post-image-upload"
                      />
                      <label htmlFor="post-image-upload">
                        <Button 
                          variant="outlined" 
                          component="span" 
                          sx={{ 
                            borderRadius: 3, 
                            color: COLORS.instagram, 
                            borderColor: COLORS.instagram, 
                            '&:hover': { background: COLORS.instagram, color: '#fff' },
                            textTransform: 'none',
                            fontWeight: 600
                          }}
                        >
                          📷 {image ? "Image Selected" : "Add Image"}
                        </Button>
                      </label>
                      
                      <Button 
                        type="submit" 
                        variant="contained" 
                        sx={{ 
                          background: COLORS.instagram, 
                          color: '#fff', 
                          fontWeight: 700, 
                          borderRadius: 3, 
                          '&:hover': { background: '#C13584' },
                          textTransform: 'none',
                          px: 3
                        }}
                        disabled={loading}
                      >
                        {loading ? "Posting..." : "📤 Post"}
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
            
            {/* Right Side - Posts List */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.instagram, mb: 3 }}>
                Recent Posts
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {loading ? (
                  <Typography sx={{ color: COLORS.accentBrown, textAlign: 'center', py: 4 }}>
                    Loading posts...
                  </Typography>
                ) : posts.length === 0 ? (
                  <Typography sx={{ color: COLORS.accentBrown, textAlign: 'center', py: 4 }}>
                    No posts yet. Be the first to post!
                  </Typography>
                ) : (
                  posts.filter(post => {
                    // Comprehensive validation
                    if (!post || typeof post !== 'object') return false;
                    if (!post.id || typeof post.id !== 'string') return false;
                    if (post.author && typeof post.author !== 'string') return false;
                    if (post.content && typeof post.content !== 'string') return false;
                    if (post.location && typeof post.location !== 'string') return false;
                    return true;
                  }).map(post => (
                    <Card key={post.id} sx={{ borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', background: COLORS.card, overflow: 'hidden' }}>
                      <CardContent sx={{ p: 0 }}>
                        {/* Post Header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: `1px solid ${COLORS.background}` }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ bgcolor: COLORS.instagram, width: 32, height: 32, fontSize: '14px' }}>👤</Avatar>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: COLORS.black }}>
                                {post.author || 'Anonymous'}
                              </Typography>
                              {post.location && typeof post.location === 'string' && (
                                <Typography variant="caption" sx={{ color: COLORS.accentBrown }}>
                                  📍 {post.location}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                          <IconButton
                            onClick={() => handleDeletePost(post.id)}
                            sx={{ color: COLORS.accentBrown, '&:hover': { color: '#E4405F' } }}
                          >
                            🗑️
                          </IconButton>
                        </Box>
                        
                        {/* Post Content */}
                        <Box sx={{ p: 2 }}>
                          <Typography sx={{ color: COLORS.black, mb: 2 }}>
                            {post.content || 'No content'}
                          </Typography>
                          
                          {post.imageUrl && typeof post.imageUrl === 'string' && (
                            <Box sx={{ mt: 2, mb: 2, borderRadius: 2, overflow: 'hidden' }}>
                              <img 
                                src={post.imageUrl} 
                                alt="Post" 
                                style={{ 
                                  width: '100%', 
                                  height: 'auto',
                                  maxHeight: '250px',
                                  objectFit: 'cover',
                                  display: 'block'
                                }} 
                              />
                            </Box>
                          )}
                        </Box>
                        
                        {/* Post Footer */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, pt: 0, borderTop: `1px solid ${COLORS.background}` }}>
                          <Button
                            onClick={() => handleLike(post.id)}
                            sx={{ 
                              color: likedPosts.has(post.id) ? '#E4405F' : COLORS.accentBrown,
                              minWidth: 'auto',
                              p: 1,
                              '&:hover': { background: 'rgba(228, 64, 95, 0.1)' }
                            }}
                          >
                            {likedPosts.has(post.id) ? '❤️' : '🤍'} Like
                          </Button>
                          <Button
                            onClick={() => toggleComments(post.id)}
                            sx={{ 
                              color: COLORS.accentBrown,
                              minWidth: 'auto',
                              p: 1,
                              '&:hover': { background: 'rgba(179, 229, 252, 0.1)' }
                            }}
                          >
                            💬 Comment ({comments[post.id]?.length || 0})
                          </Button>
                          <Button
                            sx={{ 
                              color: COLORS.accentBrown,
                              minWidth: 'auto',
                              p: 1,
                              '&:hover': { background: 'rgba(168, 230, 207, 0.1)' }
                            }}
                          >
                            📤 Share
                          </Button>
                        </Box>

                        {/* Comments Section */}
                        {showComments[post.id] && (
                          <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${COLORS.background}`, px: 2, pb: 2 }}>
                            {/* Add Comment */}
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                              <TextField
                                size="small"
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                              />
                              <Button
                                onClick={() => handleComment(post.id)}
                                disabled={!newComment.trim()}
                                sx={{ 
                                  background: COLORS.instagram,
                                  color: '#fff',
                                  borderRadius: 2,
                                  '&:hover': { background: '#C13584' },
                                  '&:disabled': { background: COLORS.accentBrown }
                                }}
                              >
                                Post
                              </Button>
                            </Box>

                            {/* Display Comments */}
                            <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                              {comments[post.id]?.filter(comment => {
                                // Validate comment structure
                                if (!comment || typeof comment !== 'object') return false;
                                if (!comment.id || typeof comment.id !== 'number') return false;
                                if (!comment.author || typeof comment.author !== 'string') return false;
                                if (!comment.text || typeof comment.text !== 'string') return false;
                                return true;
                              }).map((comment) => (
                                <Box key={comment.id} sx={{ mb: 1, p: 1, background: 'rgba(0,0,0,0.02)', borderRadius: 1 }}>
                                  <Typography variant="caption" sx={{ fontWeight: 600, color: COLORS.black }}>
                                    {comment.author || 'Anonymous'}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: COLORS.black }}>
                                    {comment.text || 'No comment text'}
                                  </Typography>
                                </Box>
                              ))}
                              {(!comments[post.id] || comments[post.id].length === 0) && (
                                <Typography variant="caption" sx={{ color: COLORS.accentBrown, fontStyle: 'italic' }}>
                                  No comments yet. Be the first to comment!
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: COLORS.instagram, 
          color: '#fff',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12
        }}>
          🗑️ Delete Post
        </DialogTitle>
        <DialogContent sx={{ p: 3, background: COLORS.background }}>
          <Typography variant="body1" sx={{ color: COLORS.black, mb: 2 }}>
            Are you sure you want to delete this post?
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.accentBrown }}>
            This action cannot be undone and the post will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, background: COLORS.background, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
          <Button 
            onClick={handleCancelDelete} 
            sx={{ 
              color: COLORS.accentBrown,
              '&:hover': { background: 'rgba(179, 229, 252, 0.1)' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDeletePost} 
            sx={{ 
              background: '#E4405F',
              color: '#fff',
              '&:hover': { background: '#C13584' }
            }}
            variant="contained"
          >
            Delete Post
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostFeed; 