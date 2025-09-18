
import React, { useState } from 'react';
import type { ThreadData } from '../types';
import Post from './Post';
import PostForm from './PostForm';
import { ReplyIcon } from './icons';

interface ThreadProps {
  thread: ThreadData;
  onReplySuccess: () => void;
}

const MAX_REPLIES_SHOWN = 3;

const Thread: React.FC<ThreadProps> = ({ thread, onReplySuccess }) => {
  const [isReplying, setIsReplying] = useState(false);
  const hiddenRepliesCount = thread.replies.length - MAX_REPLIES_SHOWN;
  
  const handleReplySuccess = () => {
    setIsReplying(false);
    onReplySuccess();
  }

  return (
    <div id={`thread-${thread.id}`} className="bg-gray-800/50 rounded-lg shadow-lg overflow-hidden border border-gray-700/50">
      <div className="p-3 md:p-4">
        <div className="flex items-center mb-2">
            <h3 className="text-lg font-bold text-cyan-400">{thread.subject}</h3>
            <button
                onClick={() => setIsReplying(!isReplying)}
                className="ml-auto flex items-center gap-1 text-sm text-gray-400 hover:text-white transition"
                aria-expanded={isReplying}
            >
                <ReplyIcon />
                <span>Reply</span>
            </button>
        </div>

        <Post post={thread.op} isOp={true} />

        {isReplying && (
          <div className="my-4">
            <PostForm threadId={thread.id} onPostSuccess={handleReplySuccess} />
          </div>
        )}
        
        {hiddenRepliesCount > 0 && (
          <p className="text-sm text-gray-500 my-3 ml-12">
            {hiddenRepliesCount} more {hiddenRepliesCount === 1 ? 'reply' : 'replies'} omitted.
          </p>
        )}

        <div className="space-y-3 mt-3 ml-4 md:ml-8 border-l-2 border-gray-700/50 pl-4 md:pl-6">
          {thread.replies.slice(-MAX_REPLIES_SHOWN).map((reply) => (
            <Post key={reply.id} post={reply} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Thread;
