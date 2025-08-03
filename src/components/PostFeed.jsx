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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

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
      [postId]: [...(prev[postId] || []), { text: newComment, author: 'Anonymous' }]
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

  // Handle delete post
  const handleDeletePost = async (postId) => {
    setPostToDelete(postId);
    setOpenDeleteDialog(true);
  };

  const confirmDeletePost = async () => {
    if (postToDelete) {
      await deleteDoc(doc(db, "posts", postToDelete));
      setPosts(posts.filter(post => post.id !== postToDelete));
      setOpenDeleteDialog(false);
      setPostToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setPostToDelete(null);
  };

  const handleShare = (post) => {
    const shareText = `${post.author} shared: "${post.content}"${post.location ? ` 📍 ${post.location}` : ''}`;
    const shareUrl = window.location.href;
    
    // Create share data
    const shareData = {
      title: 'CleanWave Post',
      text: shareText,
      url: shareUrl
    };

    // Try native sharing first
    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      // Fallback to manual sharing options
      const shareOptions = [
        {
          name: 'WhatsApp',
          url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
          icon: '💬'
        },
        {
          name: 'Instagram',
          url: `https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`,
          icon: '📷'
        },
        {
          name: 'Facebook',
          url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
          icon: '📘'
        },
        {
          name: 'Twitter',
          url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          icon: '🐦'
        },
        {
          name: 'Copy Link',
          action: () => {
            navigator.clipboard.writeText(shareUrl);
            alert('Link copied to clipboard!');
          },
          icon: '📋'
        }
      ];

      // Show share options
      const selectedOption = window.confirm(
        'Choose sharing method:\n\n' +
        shareOptions.map((option, index) => `${index + 1}. ${option.icon} ${option.name}`).join('\n') +
        '\n\nClick OK to open WhatsApp, or Cancel to see other options.'
      );

      if (selectedOption) {
        // Open WhatsApp
        window.open(shareOptions[0].url, '_blank');
      } else {
        // Show other options
        const option = window.prompt(
          'Enter number for sharing option:\n' +
          shareOptions.map((opt, idx) => `${idx + 1}. ${opt.icon} ${opt.name}`).join('\n')
        );
        
        const optionIndex = parseInt(option) - 1;
        if (optionIndex >= 0 && optionIndex < shareOptions.length) {
          const selectedShareOption = shareOptions[optionIndex];
          if (selectedShareOption.action) {
            selectedShareOption.action();
          } else {
            window.open(selectedShareOption.url, '_blank');
          }
        }
      }
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 4800,
        mx: 'auto',
        px: { xs: 1, sm: 2, md: 0 }
      }}
    >
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
                            fontSize: { xs: '0.875rem', sm: '1rem' }
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
                          fontSize: { xs: '0.875rem', sm: '1rem' }
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
              <Typography 
                variant={isMobile ? "h6" : "h6"} 
                sx={{ 
                  fontWeight: 700, 
                  color: COLORS.instagram, 
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: '1.125rem', sm: '1.25rem' }
                }}
              >
                Recent Posts
              </Typography>
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
                          <IconButton
                            onClick={() => handleDeletePost(post.id)}
                            sx={{ color: COLORS.accentBrown, '&:hover': { color: '#E4405F' } }}
                          >
                            🗑️
                          </IconButton>
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
                              '&:hover': { background: 'rgba(228, 64, 95, 0.1)' }
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
                              '&:hover': { background: 'rgba(179, 229, 252, 0.1)' }
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
                              '&:hover': { background: 'rgba(168, 230, 207, 0.1)' }
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
                            borderTop: `1px solid ${COLORS.background}`, 
                            px: { xs: 1.5, sm: 2 }, 
                            pb: 2 
                          }}>
                            {/* Add Comment */}
                            <Box sx={{ 
                              display: 'flex', 
                              flexDirection: { xs: 'column', sm: 'row' },
                              gap: { xs: 1, sm: 1 }, 
                              mb: 2 
                            }}>
                              <TextField
                                size={isMobile ? "small" : "medium"}
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                sx={{ 
                                  flex: 1, 
                                  '& .MuiOutlinedInput-root': { borderRadius: 2 },
                                  fontSize: { xs: '0.875rem', sm: '1rem' }
                                }}
                              />
                              <Button
                                onClick={() => handleComment(post.id)}
                                disabled={!newComment.trim()}
                                fullWidth={isMobile}
                                sx={{ 
                                  background: COLORS.instagram,
                                  color: '#fff',
                                  borderRadius: 2,
                                  fontSize: { xs: '0.875rem', sm: '1rem' },
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
                                if (!comment.author || typeof comment.author !== 'string') return false;
                                if (!comment.text || typeof comment.text !== 'string') return false;
                                return true;
                              }).map((comment, index) => (
                                <Box key={index} sx={{ 
                                  mb: 1, 
                                  p: { xs: 0.75, sm: 1 }, 
                                  background: 'rgba(0,0,0,0.02)', 
                                  borderRadius: 1 
                                }}>
                                  <Typography 
                                    variant="caption" 
                                    sx={{ 
                                      fontWeight: 600, 
                                      color: COLORS.black,
                                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                    }}
                                  >
                                    {comment.author || 'Anonymous'}
                                  </Typography>
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      color: COLORS.black,
                                      fontSize: { xs: '0.875rem', sm: '1rem' },
                                      lineHeight: 1.4
                                    }}
                                  >
                                    {comment.text || 'No comment text'}
                                  </Typography>
                                </Box>
                              ))}
                              {(!comments[post.id] || comments[post.id].length === 0) && (
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    color: COLORS.accentBrown, 
                                    fontStyle: 'italic',
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                  }}
                                >
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
        fullWidth
        maxWidth={isMobile ? "xs" : "sm"}
        PaperProps={{
          sx: {
            borderRadius: { xs: 2, sm: 3 },
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            mx: { xs: 2, sm: 0 }
          }
        }}
      >
        <DialogTitle sx={{ 
          background: COLORS.instagram, 
          color: '#fff',
          borderTopLeftRadius: { xs: 8, sm: 12 },
          borderTopRightRadius: { xs: 8, sm: 12 },
          fontSize: { xs: '1rem', sm: '1.125rem' },
          fontWeight: 700
        }}>
          🗑️ Delete Post
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 }, background: COLORS.background }}>
          <Typography 
            variant="body1" 
            sx={{ 
              color: COLORS.black, 
              mb: 2,
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            Are you sure you want to delete this post?
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: COLORS.accentBrown,
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            This action cannot be undone and the post will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ 
          p: { xs: 2, sm: 3 }, 
          background: COLORS.background, 
          borderBottomLeftRadius: { xs: 8, sm: 12 }, 
          borderBottomRightRadius: { xs: 8, sm: 12 } 
        }}>
          <Button 
            onClick={handleCancelDelete} 
            sx={{ 
              color: COLORS.accentBrown,
              fontSize: { xs: '0.875rem', sm: '1rem' },
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
              fontSize: { xs: '0.875rem', sm: '1rem' },
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