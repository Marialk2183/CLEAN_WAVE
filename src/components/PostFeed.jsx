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
import { useTheme, useMediaQuery } from '@mui/material';
import { db, auth } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

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
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setAuthor(user.displayName || user.email || 'Anonymous');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Create a query with proper ordering and limits
        const postsQuery = query(
          collection(db, "posts"),
          orderBy("timestamp", "desc"),
          limit(50)
        );
        
        const querySnapshot = await getDocs(postsQuery);
        const fetched = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        
        console.log('Fetched posts:', fetched);
        setPosts(fetched);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts. Please try again later.');
        
        // If it's a permission error, show a helpful message
        if (error.code === 'permission-denied') {
          setError('Access denied. Please make sure you are logged in.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Add a new post with image (Cloudinary)
  const handleAddPost = async (e) => {
    e.preventDefault();
    
    if (!author.trim() || !content.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      let imageUrl = '';
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        
        const response = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('Failed to upload image');
        }
        
        const data = await response.json();
        imageUrl = data.secure_url;
      }

      // Add post to Firestore
      const postData = {
        author: author.trim(),
        content: content.trim(),
        location: location.trim() || null,
        imageUrl: imageUrl || null,
        timestamp: serverTimestamp(),
        likes: 0,
        comments: [],
        userId: currentUser?.uid || null,
        userEmail: currentUser?.email || null,
        createdAt: new Date().toISOString()
      };

      console.log('Creating post with data:', postData);
      console.log('Current user:', currentUser);
      console.log('User ID:', currentUser?.uid);

      const docRef = await addDoc(collection(db, "posts"), postData);
      console.log('Post created successfully with ID:', docRef.id);
      
      // Re-fetch posts to show the new post
      const postsQuery = query(
        collection(db, "posts"),
        orderBy("timestamp", "desc"),
        limit(50)
      );
      const querySnapshot = await getDocs(postsQuery);
      const fetched = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      setPosts(fetched);
      setAuthor('');
      setContent('');
      setLocation('');
      setImage(null);
      
    } catch (error) {
      console.error('Error adding post:', error);
      
      if (error.code === 'permission-denied') {
        setError('Access denied. Please make sure you are logged in and have permission to create posts.');
      } else if (error.code === 'unauthenticated') {
        setError('You must be logged in to create posts. Please log in and try again.');
      } else {
        setError(`Failed to create post: ${error.message}. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
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
    
    try {
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), { 
          text: newComment.trim(), 
          author: currentUser?.displayName || currentUser?.email || 'Anonymous',
          timestamp: new Date().toISOString()
        }]
      }));
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment. Please try again.');
    }
  };

  // Toggle comments visibility
  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Handle delete post
  const handleDeletePost = async (postId) => {
    try {
      // Check if user is authenticated and owns the post
      if (!currentUser) {
        setError('You must be logged in to delete posts.');
        return;
      }
      
      setPostToDelete(postId);
      setOpenDeleteDialog(true);
    } catch (error) {
      console.error('Error preparing to delete post:', error);
      setError('Failed to delete post. Please try again.');
    }
  };

  // Confirm delete post
  const confirmDeletePost = async () => {
    if (!postToDelete) return;
    
    try {
      setError('');
      await deleteDoc(doc(db, "posts", postToDelete));
      
      // Update local state
      setPosts(prev => prev.filter(post => post.id !== postToDelete));
      setOpenDeleteDialog(false);
      setPostToDelete(null);
      
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post. Please try again.');
      
      if (error.code === 'permission-denied') {
        setError('Access denied. You can only delete your own posts.');
      }
    }
  };

  // Handle share functionality
  const handleShare = (post) => {
    try {
      if (navigator.share) {
        navigator.share({
          title: `Post by ${post.author}`,
          text: post.content,
          url: window.location.href
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(post.content);
        alert('Post content copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      // Fallback to alert
      alert('Post content copied to clipboard!');
    }
  };

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '1200px', 
      mx: 'auto', 
      px: { xs: 2, sm: 3, md: 4 },
      py: { xs: 3, sm: 4, md: 5 }
    }}>
      <Card sx={{ 
        width: '100%', 
        borderRadius: { xs: 3, sm: 4, md: 6 }, 
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)', 
        background: COLORS.card, 
        p: { xs: 1, sm: 1.5, md: 2 } 
      }}>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            sx={{ 
              fontWeight: 800, 
              color: COLORS.instagram, 
              mb: { xs: 2, sm: 3, md: 4 }, 
              textAlign: 'center', 
              letterSpacing: 1,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
            }}
          >
            📱 Post Feed
          </Typography>
          
          {/* Error Display */}
          {error && (
            <Box sx={{ 
              mb: 3, 
              p: 2, 
              borderRadius: 2, 
              background: '#ffebee', 
              border: '1px solid #ffcdd2',
              color: '#c62828'
            }}>
              <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                ⚠️ {error}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', lg: 'row' },
            gap: { xs: 3, sm: 4, md: 6 }, 
            alignItems: { xs: 'stretch', lg: 'flex-start' }
          }}>
            {/* Left Side - Post Creation Form */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Card sx={{ 
                borderRadius: { xs: 2, sm: 3 }, 
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)', 
                mb: { xs: 3, sm: 4 }, 
                background: COLORS.background 
              }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography 
                    variant={isMobile ? "h6" : "h6"} 
                    sx={{ 
                      fontWeight: 700, 
                      color: COLORS.instagram, 
                      mb: { xs: 2, sm: 3 },
                      fontSize: { xs: '1.125rem', sm: '1.25rem' }
                    }}
                  >
                    Create New Post
                  </Typography>
                  <Box component="form" onSubmit={handleAddPost} sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'stretch', sm: 'center' }, 
                      gap: { xs: 1, sm: 2 }, 
                      mb: { xs: 1, sm: 2 } 
                    }}>
                      <Avatar sx={{ 
                        bgcolor: COLORS.instagram, 
                        width: { xs: 32, sm: 40 }, 
                        height: { xs: 32, sm: 40 },
                        alignSelf: { xs: 'center', sm: 'flex-start' }
                      }}>👤</Avatar>
                      <TextField
                        label="Your Name"
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                        size={isMobile ? "small" : "medium"}
                        required
                        sx={{ 
                          flex: 1, 
                          borderRadius: 3, 
                          '& .MuiOutlinedInput-root': { borderRadius: 3 } 
                        }}
                      />
                    </Box>
                    
                    <TextField
                      label="📍 Location (optional)"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      size={isMobile ? "small" : "medium"}
                      sx={{ borderRadius: 3, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                    
                    <TextField
                      label="What's on your mind?"
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      multiline
                      rows={isMobile ? 2 : 3}
                      required
                      sx={{ borderRadius: 3, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                    
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: { xs: 1, sm: 2 }, 
                      alignItems: { xs: 'stretch', sm: 'center' } 
                    }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => setImage(e.target.files[0])}
                        style={{ display: 'none' }}
                        id="post-image-upload"
                      />
                      <label htmlFor="post-image-upload" style={{ flex: 1 }}>
                        <Button 
                          variant="outlined" 
                          component="span" 
                          fullWidth={isMobile}
                          sx={{ 
                            borderRadius: 3, 
                            color: COLORS.instagram, 
                            borderColor: COLORS.instagram, 
                            '&:hover': { background: COLORS.instagram, color: '#fff' },
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            minHeight: { xs: '48px', sm: '40px' }
                          }}
                        >
                          📷 {image ? "Image Selected" : "Add Image"}
                        </Button>
                      </label>
                      
                      <Button 
                        type="submit" 
                        variant="contained" 
                        fullWidth={isMobile}
                        sx={{ 
                          background: COLORS.instagram, 
                          color: '#fff', 
                          fontWeight: 700, 
                          borderRadius: 3, 
                          '&:hover': { background: '#C13584' },
                          textTransform: 'none',
                          px: { xs: 2, sm: 3 },
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          minHeight: { xs: '48px', sm: '40px' }
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
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' },
                justifyContent: 'space-between',
                mb: { xs: 2, sm: 3 }
              }}>
                <Typography 
                  variant={isMobile ? "h6" : "h6"} 
                  sx={{ 
                    fontWeight: 700, 
                    color: COLORS.instagram, 
                    fontSize: { xs: '1.125rem', sm: '1.25rem' }
                  }}
                >
                  Recent Posts
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
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
                    <Card key={post.id} sx={{ 
                      borderRadius: { xs: 2, sm: 3 }, 
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08)', 
                      background: COLORS.card, 
                      overflow: 'hidden' 
                    }}>
                      <CardContent sx={{ p: 0 }}>
                        {/* Post Header */}
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          p: { xs: 1.5, sm: 2 }, 
                          borderBottom: `1px solid ${COLORS.background}` 
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ 
                              bgcolor: COLORS.instagram, 
                              width: { xs: 28, sm: 32 }, 
                              height: { xs: 28, sm: 32 }, 
                              fontSize: { xs: '12px', sm: '14px' } 
                            }}>👤</Avatar>
                            <Box>
                              <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                  fontWeight: 600, 
                                  color: COLORS.black,
                                  fontSize: { xs: '0.875rem', sm: '1rem' }
                                }}
                              >
                                {post.author || 'Anonymous'}
                              </Typography>
                              {post.location && typeof post.location === 'string' && (
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    color: COLORS.accentBrown,
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                  }}
                                >
                                  📍 {post.location}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                          {/* Only show delete button if user owns the post or is admin */}
                          {(currentUser && (post.userId === currentUser.uid || currentUser.email === 'admin@cleanwave.com')) && (
                            <Button
                              onClick={() => handleDeletePost(post.id)}
                              variant="outlined"
                              size={isMobile ? "small" : "medium"}
                              sx={{ 
                                color: COLORS.accentBrown, 
                                borderColor: COLORS.accentBrown,
                                minWidth: { xs: '48px', sm: '40px' },
                                minHeight: { xs: '48px', sm: '40px' },
                                width: { xs: '48px', sm: '40px' },
                                height: { xs: '48px', sm: '40px' },
                                borderRadius: '50%',
                                p: 0,
                                '&:hover': { 
                                  color: '#E4405F',
                                  borderColor: '#E4405F',
                                  background: 'rgba(228, 64, 95, 0.1)'
                                },
                                fontSize: { xs: '16px', sm: '14px' },
                                cursor: 'pointer'
                              }}
                            >
                              🗑️
                            </Button>
                          )}
                        </Box>
                        
                        {/* Post Content */}
                        <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
                          <Typography 
                            sx={{ 
                              color: COLORS.black, 
                              mb: 2,
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                              lineHeight: 1.5
                            }}
                          >
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
                                  maxHeight: isMobile ? '200px' : '250px',
                                  objectFit: 'cover',
                                  display: 'block'
                                }} 
                              />
                            </Box>
                          )}
                        </Box>
                        
                        {/* Post Footer */}
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: { xs: 'stretch', sm: 'center' }, 
                          gap: { xs: 1, sm: 2 }, 
                          p: { xs: 1.5, sm: 2 }, 
                          pt: 0, 
                          borderTop: `1px solid ${COLORS.background}` 
                        }}>
                          <Button
                            onClick={() => handleLike(post.id)}
                            fullWidth={isMobile}
                            sx={{ 
                              color: likedPosts.has(post.id) ? '#E4405F' : COLORS.accentBrown,
                              minWidth: 'auto',
                              p: { xs: 0.75, sm: 1 },
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                              '&:hover': { background: 'rgba(228, 64, 95, 0.1)' },
                              minHeight: { xs: '44px', sm: '36px' }
                            }}
                          >
                            {likedPosts.has(post.id) ? '❤️' : '🤍'} Like
                          </Button>
                          <Button
                            onClick={() => toggleComments(post.id)}
                            fullWidth={isMobile}
                            sx={{ 
                              color: COLORS.accentBrown,
                              minWidth: 'auto',
                              p: { xs: 0.75, sm: 1 },
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                              '&:hover': { background: 'rgba(179, 229, 252, 0.1)' },
                              minHeight: { xs: '44px', sm: '36px' }
                            }}
                          >
                            💬 Comment ({comments[post.id]?.length || 0})
                          </Button>
                          <Button
                            onClick={() => handleShare(post)}
                            fullWidth={isMobile}
                            sx={{ 
                              color: COLORS.accentBrown,
                              minWidth: 'auto',
                              p: { xs: 0.75, sm: 1 },
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                              '&:hover': { background: 'rgba(168, 230, 207, 0.1)' },
                              minHeight: { xs: '44px', sm: '36px' }
                            }}
                          >
                            📤 Share
                          </Button>
                        </Box>

                        {/* Comments Section */}
                        {showComments[post.id] && (
                          <Box sx={{ 
                            mt: 2, 
                            pt: 2, 
                            px: { xs: 1.5, sm: 2 }, 
                            borderTop: `1px solid ${COLORS.background}` 
                          }}>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                              <TextField
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                size="small"
                                fullWidth
                                sx={{ 
                                  '& .MuiOutlinedInput-root': { 
                                    borderRadius: 2,
                                    fontSize: { xs: '0.875rem', sm: '1rem' }
                                  } 
                                }}
                              />
                              <Button
                                onClick={() => handleComment(post.id)}
                                variant="contained"
                                size="small"
                                sx={{ 
                                  background: COLORS.instagram,
                                  minWidth: 'auto',
                                  px: 2,
                                  borderRadius: 2,
                                  fontSize: { xs: '0.875rem', sm: '1rem' },
                                  minHeight: { xs: '40px', sm: '32px' }
                                }}
                              >
                                Post
                              </Button>
                            </Box>
                            {comments[post.id]?.map((comment, idx) => (
                              <Box key={idx} sx={{ 
                                p: 1, 
                                mb: 1, 
                                background: COLORS.background, 
                                borderRadius: 2,
                                border: `1px solid ${COLORS.accentBlue}` 
                              }}>
                                <Typography sx={{ 
                                  fontWeight: 600, 
                                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                  color: COLORS.black,
                                  mb: 0.5
                                }}>
                                  {comment.author}
                                </Typography>
                                <Typography sx={{ 
                                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                  color: COLORS.black 
                                }}>
                                  {comment.text}
                                </Typography>
                              </Box>
                            ))}
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
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this post? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDeletePost} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostFeed; 