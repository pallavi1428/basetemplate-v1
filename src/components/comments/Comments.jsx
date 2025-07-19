import { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { fireDB } from '../../firebase/FirebaseConfig';
import toast from 'react-hot-toast';

const Comments = ({ noteId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('users'));

    // Fetch comments
    useEffect(() => {
        const commentsRef = collection(fireDB, 'notes', noteId, 'comments');
        const q = query(commentsRef, orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const commentsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setComments(commentsData);
        });

        return () => unsubscribe();
    }, [noteId]);

    // Add new comment
    const addComment = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error("Please log in to comment.");
            return navigate('/login');
        }

        if (!newComment.trim()) return;

        setCommentLoading(true);
        try {
            const commentsRef = collection(fireDB, 'notes', noteId, 'comments');
            await addDoc(commentsRef, {
                text: newComment,
                timestamp: serverTimestamp(),
                author: user.name || 'User',
                userId: user.uid,
            });
            setNewComment('');
            toast.success('Comment added!');
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error('Failed to add comment');
        } finally {
            setCommentLoading(false);
        }
    };

    return (
        <div className="mt-8">
            {/* Comment Count */}
            <div className="flex items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Comments</h2>
                <span className="ml-2 text-gray-500">({comments.length})</span>
            </div>

            {/* Comment Form - YouTube-like */}
            <form onSubmit={addComment} className="mb-8">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full p-3 border-b border-gray-300 focus:border-orange-500 focus:outline-none"
                            rows="1"
                            disabled={commentLoading}
                        />
                        <div className="flex justify-end mt-2">
                            <button
                                type="button"
                                onClick={() => setNewComment('')}
                                className="px-4 py-2 mr-2 text-gray-600 hover:text-gray-900"
                                disabled={commentLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`px-4 py-2 rounded-full ${commentLoading || !newComment.trim() ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                                disabled={commentLoading || !newComment.trim()}
                            >
                                {commentLoading ? 'Posting...' : 'Comment'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            {/* Comments List - YouTube-like */}
            <div className="space-y-6">
                {comments.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                                <div className="w-full h-full flex items-center justify-center text-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center mb-1">
                                    <span className="font-medium text-gray-900 mr-2">{comment.author || 'Anonymous'}</span>
                                    <span className="text-xs text-gray-500">
                                        {comment.timestamp?.toDate().toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        }) || 'Just now'}
                                    </span>
                                </div>
                                <p className="text-gray-800">{comment.text}</p>
                                <div className="flex items-center mt-2 text-gray-500 text-sm">
                                    <button className="flex items-center mr-4 hover:text-gray-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                        </svg>
                                        Like
                                    </button>
                                    <button className="flex items-center hover:text-gray-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        Reply
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Comments;