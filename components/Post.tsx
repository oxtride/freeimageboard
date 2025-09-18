
import React, { useState } from 'react';
import type { PostData } from '../types';

interface PostProps {
  post: PostData;
  isOp?: boolean;
}

const Post: React.FC<PostProps> = ({ post, isOp = false }) => {
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const formattedDate = new Date(post.timestamp).toLocaleString();

  const renderComment = (comment: string) => {
    const lines = comment.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('>>')) {
        return <a key={index} href={`#post-${line.slice(2)}`} className="text-cyan-400 hover:underline">{line}</a>
      }
      if (line.startsWith('>')) {
        return <span key={index} className="text-green-400">{line}</span>
      }
      return <span key={index}>{line}</span>;
    }).reduce((acc, elem, index) => acc.length === 0 ? [elem] : [...acc, <br key={`br-${index}`} />, elem], [] as React.ReactNode[]);
  }

  return (
    <article id={`post-${post.id}`} className="flex gap-4">
      {post.image && (
        <div className="flex-shrink-0">
          <p className="text-xs text-gray-500 mb-1">{post.image.filename}</p>
          <img
            src={post.image.url}
            alt={`Image for post ${post.id}`}
            className={`object-cover bg-gray-700 rounded ${isImageExpanded ? 'w-auto h-auto max-w-full' : 'w-24 h-24 md:w-32 md:h-32'} cursor-pointer transition-all`}
            onClick={() => setIsImageExpanded(!isImageExpanded)}
            loading="lazy"
          />
        </div>
      )}
      <div className="flex-grow">
        <div className="flex items-center gap-3 text-sm mb-1">
          <span className="font-bold text-green-400">{post.author}</span>
          <span className="text-gray-400">{formattedDate}</span>
          <a href={`#post-${post.id}`} className="text-gray-500 hover:text-gray-300">No. {post.id}</a>
        </div>
        <div className="text-gray-200 whitespace-pre-wrap break-words">
          {renderComment(post.comment)}
        </div>
      </div>
    </article>
  );
};

export default Post;
