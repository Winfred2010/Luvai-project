import React, { useState } from 'react';
import { ForumPost, UserRole } from '../types';
import { translations } from '../translations';
import { MessageSquare, Heart, CornerDownRight, Plus, Send, CheckCircle, Shield } from 'lucide-react';

interface ForumSectionProps {
  language: 'en' | 'sw';
  userRole: UserRole;
}

export default function ForumSection({ language, userRole }: ForumSectionProps) {
  const t = translations[language];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddPost, setShowAddPost] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState<'healing' | 'skills' | 'legal' | 'parenting' | 'general'>('healing');
  
  // Local state for replies
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: 'fp1',
      userId: 'mother_1',
      userName: 'Mama Mercy Ngozi',
      userRole: 'mother',
      title: 'There is light after the storm - My Soap-making shop progress',
      content: 'I left a domestic abusive marriage with nothing but a blanket. Today I finished my second batch of lavender laundry soaps! Don’t lose hope, sister.',
      date: '2026-06-28',
      category: 'healing',
      likes: ['user_2', 'user_3'],
      replies: [
        { id: 'fr1', userId: 'mentor_1', userName: 'Dr. Jane Sang', userRole: 'mentor', content: 'Incredible work, Mercy! Your courage is an inspiration to all of us.', date: '2026-06-29' }
      ]
    },
    {
      id: 'fp2',
      userId: 'trainer_1',
      userName: 'Grace Wanza (Basketry Expert)',
      userRole: 'trainer',
      title: 'Free sisal dye materials available at Safe Center on Friday',
      content: 'For our students enrolled in basketry: I have procured a sack of natural eco-friendly green and teal dyes. Please come collect your share!',
      date: '2026-06-29',
      category: 'skills',
      likes: ['user_1'],
      replies: []
    }
  ]);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (postTitle && postContent) {
      const newPost: ForumPost = {
        id: `fp_${Date.now()}`,
        userId: 'user_self',
        userName: userRole === 'admin' ? 'System Administrator' : userRole === 'trainer' ? 'Certified Trainer (You)' : 'Mama Member (You)',
        userRole: userRole,
        title: postTitle,
        content: postContent,
        date: new Date().toISOString().split('T')[0],
        category: postCategory,
        likes: [],
        replies: []
      };

      setPosts((prev) => [newPost, ...prev]);
      setPostTitle('');
      setPostContent('');
      setShowAddPost(false);
    }
  };

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const alreadyLiked = p.likes.includes('user_self');
          const newLikes = alreadyLiked
            ? p.likes.filter((id) => id !== 'user_self')
            : [...p.likes, 'user_self'];
          return { ...p, likes: newLikes };
        }
        return p;
      })
    );
  };

  const handleAddReply = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    const txt = replyText[postId];
    if (txt && txt.trim()) {
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              replies: [
                ...p.replies,
                {
                  id: `reply_${Date.now()}`,
                  userId: 'user_self',
                  userName: userRole === 'admin' ? 'Administrator' : userRole === 'mentor' ? 'Mentor Support' : 'Mama Member',
                  userRole: userRole,
                  content: txt,
                  date: new Date().toLocaleDateString()
                }
              ]
            };
          }
          return p;
        })
      );

      setReplyText((prev) => ({ ...prev, [postId]: '' }));
    }
  };

  const categories = ['all', 'healing', 'skills', 'legal', 'parenting', 'general'];

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Intro header */}
      <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-purple-950 flex items-center gap-2">
            <MessageSquare className="w-5.5 h-5.5 text-purple-600 animate-pulse" />
            {t.forumTitle}
          </h2>
          <p className="text-sm text-purple-900 mt-1 leading-relaxed">
            {t.forumDesc}
          </p>
        </div>
        <button
          id="btn-show-add-post"
          onClick={() => setShowAddPost(!showAddPost)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg cursor-pointer transition shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addPostButton}</span>
        </button>
      </div>

      {/* Add New Topic form */}
      {showAddPost && (
        <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6 max-w-2xl animate-fade-in">
          <h3 className="font-bold text-gray-900 mb-4">{t.addPostButton}</h3>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t.postTitle}</label>
              <input
                type="text"
                required
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="Title..."
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Forum Category</label>
              <select
                value={postCategory}
                onChange={(e: any) => setPostCategory(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="healing">Emotional Healing & Trauma Care</option>
                <option value="skills">Vocational Skills & Entrepreneurship</option>
                <option value="legal">Legal Rights disputes</option>
                <option value="parenting">Single-Mother Parenting tips</option>
                <option value="general">General Chit-Chat</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t.postContent}</label>
              <textarea
                required
                rows={4}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Share your encouragement, query, or updates..."
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
              ></textarea>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddPost(false)}
                className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                {t.close}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer shadow-xs"
              >
                {t.submitPost}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Forum categories filters */}
      <div className="flex flex-wrap gap-1.5 pb-2 border-b border-gray-50">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition cursor-pointer capitalize ${
              selectedCategory === cat
                ? 'bg-purple-600 border-purple-600 text-white shadow-xs'
                : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200'
            }`}
          >
            {cat === 'all' ? 'All Spaces' : cat}
          </button>
        ))}
      </div>

      {/* Posts display list */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const hasLiked = post.likes.includes('user_self');

          return (
            <div key={post.id} className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-4 hover:border-purple-200 transition-all">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full tracking-wider">
                    {post.category}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold">{post.date}</span>
                </div>
                <h3 className="font-extrabold text-gray-800 text-base">{post.title}</h3>
                <div className="flex items-center gap-1.5 pt-1">
                  <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[9px]">
                    {post.userName.charAt(0)}
                  </div>
                  <p className="text-[10px] font-bold text-gray-500">
                    {post.userName} <span className="font-medium text-gray-400">({post.userRole})</span>
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-100/50">
                {post.content}
              </p>

              {/* Likes & replies count header */}
              <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 border-t border-gray-50 pt-3">
                <button
                  id={`btn-like-${post.id}`}
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                    hasLiked ? 'text-rose-600' : 'hover:text-rose-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                  <span>{post.likes.length} {t.likes}</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <span>{post.replies.length} {t.repliesLabel}</span>
                </div>
              </div>

              {/* Nested replies display */}
              {post.replies.length > 0 && (
                <div className="space-y-3 pl-4 border-l-2 border-gray-100 mt-2">
                  {post.replies.map((reply) => (
                    <div key={reply.id} className="p-3 bg-purple-50/40 rounded-xl border border-purple-100/30 flex items-start gap-2.5">
                      <CornerDownRight className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black text-purple-950">
                            {reply.userName} <span className="font-medium text-gray-400">({reply.userRole})</span>
                          </p>
                          <span className="text-[9px] text-gray-400 font-semibold">{reply.date}</span>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Write a reply form */}
              <form onSubmit={(e) => handleAddReply(e, post.id)} className="flex gap-2 pt-2">
                <input
                  type="text"
                  required
                  value={replyText[post.id] || ''}
                  onChange={(e) => setReplyText((prev) => ({ ...prev, [post.id]: e.target.value }))}
                  placeholder={t.addReplyPlaceholder}
                  className="flex-1 text-xs px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500"
                />
                <button
                  id={`btn-reply-${post.id}`}
                  type="submit"
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t.submitReply}</span>
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
