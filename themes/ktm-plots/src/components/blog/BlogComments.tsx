'use client';

import { useState, useEffect, useCallback } from 'react';

// Use local Next.js API proxy so browser requests are same-origin (no CORS).
const COMMENTS_API = '/api/comments';

interface Reply {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
  status: string;
}

interface Comment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
  status: string;
  replies: Reply[];
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function Avatar({ name }: { name: string }) {
  return (
    <div style={{
      width: '36px', height: '36px', borderRadius: '50%',
      background: 'linear-gradient(135deg, var(--color-primary), #8B0000)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.8rem', fontWeight: 800, color: '#fff', flexShrink: 0
    }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function CommentForm({
  postId,
  parentId,
  onSuccess,
  onCancel,
  compact = false,
}: {
  postId: string;
  parentId?: string;
  onSuccess: () => void;
  onCancel?: () => void;
  compact?: boolean;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(COMMENTS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, authorName: name, authorEmail: email, postId, parentId }),
      });
      if (res.ok) {
        setSubmitted(true);
        onSuccess();
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ padding: '1rem', background: '#F0FDF4', borderRadius: '10px', border: '1px solid #BBF7D0', fontSize: '0.875rem', color: '#166534', fontWeight: 600 }}>
        ✓ {parentId ? 'Reply' : 'Comment'} submitted — it will appear after review.
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.65rem 0.875rem',
    border: '1.5px solid #E5E7EB', borderRadius: '8px',
    fontSize: '0.875rem', color: 'var(--color-secondary)', outline: 'none',
    background: '#FAFAFA', boxSizing: 'border-box',
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {!compact && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <input style={inputStyle} required placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
          <input style={inputStyle} required type="email" placeholder="Email (not shown)" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
      )}
      {compact && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <input style={{ ...inputStyle, fontSize: '0.8rem', padding: '0.55rem 0.75rem' }} required placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
          <input style={{ ...inputStyle, fontSize: '0.8rem', padding: '0.55rem 0.75rem' }} required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
      )}
      <textarea
        style={{ ...inputStyle, minHeight: compact ? '72px' : '100px', resize: 'vertical', fontFamily: 'inherit' }}
        required
        placeholder={parentId ? 'Write your reply…' : 'Share your thoughts…'}
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '8px',
            padding: compact ? '0.55rem 1rem' : '0.7rem 1.5rem',
            fontSize: compact ? '0.8rem' : '0.875rem', fontWeight: 700, cursor: 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Posting…' : parentId ? 'Post Reply' : 'Post Comment'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: 'transparent', color: '#6B7280', border: '1.5px solid #E5E7EB',
              borderRadius: '8px', padding: '0.55rem 0.875rem', fontSize: '0.8rem',
              fontWeight: 600, cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function CommentItem({ comment, postId, onReload }: { comment: Comment; postId: string; onReload: () => void }) {
  const [replying, setReplying] = useState(false);
  const approvedReplies = comment.replies?.filter(r => r.status === 'APPROVED') ?? [];

  return (
    <div style={{ display: 'flex', gap: '0.875rem' }}>
      <Avatar name={comment.authorName} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '0.875rem 1rem', marginBottom: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.25rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-secondary)' }}>{comment.authorName}</span>
            <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{timeAgo(comment.createdAt)}</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.65, margin: 0 }}>{comment.content}</p>
        </div>

        <button
          onClick={() => setReplying(r => !r)}
          style={{ background: 'none', border: 'none', fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer', padding: '0', marginBottom: '0.5rem' }}
        >
          {replying ? '✕ Cancel' : '↩ Reply'}
        </button>

        {replying && (
          <div style={{ marginBottom: '0.75rem' }}>
            <CommentForm
              postId={postId}
              parentId={comment.id}
              onSuccess={() => { setReplying(false); onReload(); }}
              onCancel={() => setReplying(false)}
              compact
            />
          </div>
        )}

        {/* Replies */}
        {approvedReplies.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '0.5rem', borderLeft: '2px solid #FEE2E2', marginTop: '0.5rem' }}>
            {approvedReplies.map(reply => (
              <div key={reply.id} style={{ display: 'flex', gap: '0.75rem' }}>
                <Avatar name={reply.authorName} />
                <div style={{ flex: 1, background: '#FEF2F2', borderRadius: '10px', padding: '0.75rem 0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem', flexWrap: 'wrap', gap: '0.25rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--color-secondary)' }}>{reply.authorName}</span>
                    <span style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>{timeAgo(reply.createdAt)}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#374151', lineHeight: 1.6, margin: 0 }}>{reply.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BlogComments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${COMMENTS_API}?postId=${postId}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      }
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => { load(); }, [load]);

  const approved = comments.filter(c => c.status === 'APPROVED');

  return (
    <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: 'clamp(1.5rem, 4vw, 2rem)', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', marginTop: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid #F3F4F6' }}>
        <div style={{ width: '36px', height: '36px', background: '#FEE2E2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="17" height="17" fill="none" stroke="var(--color-primary)" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-secondary)', margin: 0 }}>
          Comments {approved.length > 0 && <span style={{ color: '#9CA3AF', fontWeight: 600 }}>({approved.length})</span>}
        </h3>
      </div>

      {/* Existing comments */}
      {loading ? (
        <div style={{ color: '#9CA3AF', fontSize: '0.875rem', textAlign: 'center', padding: '1.5rem 0' }}>Loading comments…</div>
      ) : approved.length === 0 ? (
        <p style={{ color: '#9CA3AF', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
          {approved.map(comment => (
            <CommentItem key={comment.id} comment={comment} postId={postId} onReload={load} />
          ))}
        </div>
      )}

      {/* New comment form */}
      <div style={{ borderTop: approved.length > 0 ? '2px solid #F3F4F6' : 'none', paddingTop: approved.length > 0 ? '1.5rem' : '0' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-secondary)', marginBottom: '1rem' }}>Leave a Comment</h4>
        <CommentForm postId={postId} onSuccess={load} />
        <p style={{ fontSize: '0.72rem', color: '#9CA3AF', marginTop: '0.75rem' }}>
          Comments are reviewed before publishing. Your email will not be displayed.
        </p>
      </div>
    </div>
  );
}
