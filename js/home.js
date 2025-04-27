/**
 * Home feed related JavaScript for CampusConnect
 * Handles post creation, interactions, and feed filtering
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkAuthStatus();
    
    // Initialize post creation modal
    initializePostModal();
    
    // Initialize post interactions (like, comment, share)
    initializePostInteractions();
    
    // Initialize feed filters
    initializeFeedFilters();
});

/**
 * Check if the user is authenticated
 * Redirect to sign in page if not
 */
function checkAuthStatus() {
    const isAuthenticated = sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail');
    
    if (!isAuthenticated) {
        window.location.href = 'signin.html';
    }
}

/**
 * Initialize the post creation modal
 */
function initializePostModal() {
    const openModalBtn = document.getElementById('open-post-modal');
    const modal = document.getElementById('post-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const postContent = document.querySelector('.post-content');
    const postBtn = document.querySelector('.post-btn');
    
    if (!openModalBtn || !modal) return;
    
    // Open modal
    openModalBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        postContent?.focus();
    });
    
    // Close modal when clicking close button
    closeModalBtn?.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Enable/disable post button based on content
    if (postContent && postBtn) {
        postContent.addEventListener('input', () => {
            postBtn.disabled = postContent.value.trim() === '';
        });
    }
    
    // Handle post creation
    const postForm = document.querySelector('.modal-content');
    if (postForm && postBtn) {
        postBtn.addEventListener('click', (e) => {
            e.preventDefault();
            createNewPost();
        });
    }
    
    // Initialize tag input for posts
    initializePostTags();
    
    // Initialize post link preview
    initializeLinkPreview();
}

/**
 * Initialize post tags input
 */
function initializePostTags() {
    const tagInput = document.querySelector('.tag-input');
    const selectedTags = document.querySelector('.selected-tags');
    
    if (!tagInput || !selectedTags) return;
    
    const tags = new Set();
    
    tagInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            
            const tag = this.value.trim().replace(/,/g, '');
            
            if (tag && !tags.has(tag)) {
                // Add tag to set
                tags.add(tag);
                
                // Create tag element
                const tagElement = createElement('span', { className: 'tag' }, [
                    tag,
                    createElement('span', { 
                        className: 'remove-tag',
                        onclick: function() {
                            tags.delete(tag);
                            this.parentElement.remove();
                        }
                    }, ' ×')
                ]);
                
                // Add to selected tags container
                selectedTags.appendChild(tagElement);
                
                // Clear input
                this.value = '';
            }
        }
    });
}

/**
 * Initialize link preview in post creation
 */
function initializeLinkPreview() {
    const postContent = document.querySelector('.post-content');
    const postPreview = document.getElementById('post-preview');
    
    if (!postContent || !postPreview) return;
    
    postContent.addEventListener('input', debounce(function() {
        // Find URLs in the content
        const content = this.value;
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const match = content.match(urlRegex);
        
        if (match && match.length > 0) {
            const url = match[0];
            
            // For demo purposes, we'll create a mock preview
            // In a real application, this would call an API to fetch the link metadata
            createMockLinkPreview(url, postPreview);
        } else {
            // Clear preview if no URL
            postPreview.innerHTML = '';
        }
    }, 500));
}

/**
 * Create a mock link preview for demonstration
 * @param {String} url - The URL to preview
 * @param {HTMLElement} container - The container for the preview
 */
function createMockLinkPreview(url, container) {
    // Clear previous preview
    container.innerHTML = '';
    
    // Create mock preview based on URL
    const domain = new URL(url).hostname;
    let title, description, image;
    
    if (domain.includes('github')) {
        title = 'GitHub Repository';
        description = 'View this project on GitHub';
        image = 'images/github-preview.jpg';
    } else if (domain.includes('linkedin')) {
        title = 'LinkedIn Profile';
        description = 'Professional profile on LinkedIn';
        image = 'images/linkedin-preview.jpg';
    } else if (domain.includes('medium')) {
        title = 'Medium Article';
        description = 'Read this article on Medium';
        image = 'images/medium-preview.jpg';
    } else {
        title = 'Web Link';
        description = url;
        image = 'images/link-preview.jpg';
    }
    
    // Create preview element
    const previewElement = createElement('div', { className: 'link-preview' }, [
        createElement('div', { className: 'link-image' }, [
            createElement('img', { src: image, alt: 'Link Preview' })
        ]),
        createElement('div', { className: 'link-details' }, [
            createElement('h4', {}, title),
            createElement('p', {}, description),
            createElement('p', { className: 'link-url' }, domain)
        ])
    ]);
    
    // Add to container
    container.appendChild(previewElement);
}

/**
 * Create a new post and add it to the feed
 */
function createNewPost() {
    const postContent = document.querySelector('.post-content');
    const postPreview = document.getElementById('post-preview');
    const selectedTags = document.querySelector('.selected-tags');
    const modal = document.getElementById('post-modal');
    
    if (!postContent || !modal) return;
    
    const content = postContent.value.trim();
    if (!content) return;
    
    // Get current user info
    const userName = sessionStorage.getItem('userName') || 'Rohit Kumar';
    const userImg = 'images/profile.jpg';
    
    // Get current date/time
    const now = new Date();
    
    // Get tags
    const tagElements = selectedTags?.querySelectorAll('.tag') || [];
    const tags = Array.from(tagElements).map(tag => tag.textContent.replace(' ×', ''));
    
    // Get link preview if any
    const hasLinkPreview = postPreview && postPreview.children.length > 0;
    
    // Create post element
    const post = createPostElement({
        author: {
            name: userName,
            image: userImg,
            details: 'Computer Science • 3rd Year'
        },
        content: content,
        timestamp: now,
        tags: tags,
        linkPreview: hasLinkPreview ? postPreview.innerHTML : null
    });
    
    // Add to posts container
    const postsContainer = document.querySelector('.posts-container');
    if (postsContainer) {
        postsContainer.insertBefore(post, postsContainer.firstChild);
    }
    
    // Close modal and reset form
    modal.style.display = 'none';
    postContent.value = '';
    postPreview.innerHTML = '';
    if (selectedTags) selectedTags.innerHTML = '';
    
    // Show success toast
    showToast('Post created successfully!', 'success');
}

/**
 * Create a post element
 * @param {Object} postData - The post data
 * @returns {HTMLElement} The post element
 */
function createPostElement(postData) {
    // Create tags elements
    const tagsElements = postData.tags.map(tag => 
        createElement('span', { className: 'tag' }, tag)
    );
    
    // Create post element
    const post = createElement('article', { className: 'post' }, [
        // Post header
        createElement('div', { className: 'post-header' }, [
            createElement('img', { 
                src: postData.author.image, 
                alt: postData.author.name,
                className: 'post-avatar'
            }),
            createElement('div', { className: 'post-author-info' }, [
                createElement('div', { className: 'post-author-name' }, postData.author.name),
                createElement('div', { className: 'post-meta' }, `${postData.author.details} • just now`)
            ]),
            createElement('button', { className: 'post-menu-btn' }, [
                createElement('i', { className: 'fas fa-ellipsis-h' })
            ])
        ]),
        
        // Post content
        createElement('div', { className: 'post-content' }, [
            createElement('p', {}, postData.content),
            postData.linkPreview ? 
                createElement('div', { 
                    className: 'post-link',
                    innerHTML: postData.linkPreview
                }) : null,
            tagsElements.length > 0 ? 
                createElement('div', { className: 'post-tags' }, tagsElements) : null
        ]),
        
        // Post stats
        createElement('div', { className: 'post-stats' }, [
            createElement('div', { className: 'stat-item' }, [
                createElement('i', { className: 'fas fa-thumbs-up' }),
                createElement('span', {}, '0 Likes')
            ]),
            createElement('div', { className: 'stat-item' }, [
                createElement('span', {}, '0 Comments')
            ]),
            createElement('div', { className: 'stat-item' }, [
                createElement('span', {}, '0 Shares')
            ])
        ]),
        
        // Post actions
        createElement('div', { className: 'post-actions' }, [
            createElement('button', { className: 'post-action-btn' }, [
                createElement('i', { className: 'far fa-thumbs-up' }),
                createElement('span', {}, 'Like')
            ]),
            createElement('button', { className: 'post-action-btn' }, [
                createElement('i', { className: 'far fa-comment' }),
                createElement('span', {}, 'Comment')
            ]),
            createElement('button', { className: 'post-action-btn' }, [
                createElement('i', { className: 'far fa-share-square' }),
                createElement('span', {}, 'Share')
            ])
        ]),
        
        // Post comments
        createElement('div', { className: 'post-comments' }, [
            createElement('div', { className: 'comment-input' }, [
                createElement('img', { 
                    src: postData.author.image, 
                    alt: 'Your Profile',
                    className: 'profile-img-small'
                }),
                createElement('input', { 
                    type: 'text',
                    placeholder: 'Write a comment...',
                    className: 'comment-box'
                }),
                createElement('button', { className: 'comment-send' }, [
                    createElement('i', { className: 'fas fa-paper-plane' })
                ])
            ])
        ])
    ]);
    
    return post;
}

/**
 * Initialize post interactions (like, comment, share)
 */
function initializePostInteractions() {
    document.addEventListener('click', function(e) {
        // Like button
        if (e.target.closest('.post-action-btn:first-child')) {
            const button = e.target.closest('.post-action-btn');
            toggleLike(button);
        }
        
        // Comment button
        if (e.target.closest('.post-action-btn:nth-child(2)')) {
            const button = e.target.closest('.post-action-btn');
            const post = button.closest('.post');
            const commentBox = post.querySelector('.comment-box');
            
            if (commentBox) {
                commentBox.focus();
            }
        }
        
        // Share button
        if (e.target.closest('.post-action-btn:nth-child(3)')) {
            showToast('Share functionality coming soon!', 'info');
        }
        
        // Comment send button
        if (e.target.closest('.comment-send')) {
            const button = e.target.closest('.comment-send');
            const commentInput = button.previousElementSibling;
            addComment(commentInput);
        }
    });
    
    // Add comment on Enter key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.classList.contains('comment-box')) {
            addComment(e.target);
        }
    });
}

/**
 * Toggle like on a post
 * @param {HTMLElement} button - The like button
 */
function toggleLike(button) {
    const post = button.closest('.post');
    const icon = button.querySelector('i');
    const likeCount = post.querySelector('.post-stats .stat-item:first-child span');
    
    // Toggle like state
    const isLiked = icon.classList.contains('fas');
    
    if (isLiked) {
        // Unlike
        icon.classList.remove('fas');
        icon.classList.add('far');
        button.classList.remove('liked');
        
        // Update count
        const currentCount = parseInt(likeCount.textContent) || 0;
        likeCount.textContent = `${Math.max(0, currentCount - 1)} Likes`;
    } else {
        // Like
        icon.classList.remove('far');
        icon.classList.add('fas');
        button.classList.add('liked');
        
        // Update count
        const currentCount = parseInt(likeCount.textContent) || 0;
        likeCount.textContent = `${currentCount + 1} Likes`;
        
        // Add like animation
        const likeAnimation = createElement('div', { className: 'like-animation' });
        button.appendChild(likeAnimation);
        
        // Remove animation after it completes
        setTimeout(() => {
            likeAnimation.remove();
        }, 1000);
    }
}

/**
 * Add a comment to a post
 * @param {HTMLInputElement} commentInput - The comment input field
 */
function addComment(commentInput) {
    const commentText = commentInput.value.trim();
    if (!commentText) return;
    
    const post = commentInput.closest('.post');
    const commentsContainer = post.querySelector('.comments-list');
    
    // Create comments list if it doesn't exist
    if (!commentsContainer) {
        const newCommentsContainer = createElement('div', { className: 'comments-list' });
        post.querySelector('.post-comments').appendChild(newCommentsContainer);
    }
    
    // Get the comments container (existing or newly created)
    const container = post.querySelector('.comments-list');
    
    // Get current user info
    const userName = sessionStorage.getItem('userName') || 'Rohit Kumar';
    const userImg = 'images/profile.jpg';
    
    // Create comment element
    const comment = createElement('div', { className: 'comment' }, [
        createElement('img', { 
            src: userImg, 
            alt: userName,
            className: 'comment-avatar'
        }),
        createElement('div', { className: 'comment-content' }, [
            createElement('div', { className: 'comment-author' }, userName),
            createElement('p', {}, commentText),
            createElement('div', { className: 'comment-actions' }, [
                createElement('button', {}, 'Like'),
                createElement('button', {}, 'Reply'),
                createElement('span', { className: 'comment-time' }, 'just now')
            ])
        ])
    ]);
    
    // Add to container
    container.appendChild(comment);
    
    // Update comment count
    const commentCount = post.querySelector('.post-stats .stat-item:nth-child(2) span');
    const currentCount = parseInt(commentCount.textContent) || 0;
    commentCount.textContent = `${currentCount + 1} Comments`;
    
    // Clear input
    commentInput.value = '';
}

/**
 * Initialize feed filters
 */
function initializeFeedFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filter = this.getAttribute('data-filter');
            
            // Filter posts (for demo purposes, we'll just show a toast)
            showToast(`Viewing ${filter} posts`, 'info');
        });
    });
}

/**
 * Debounce function to limit execution rate
 * @param {Function} func - The function to debounce
 * @param {Number} wait - The debounce wait time in ms
 * @returns {Function} The debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
} 