
import React, { useState } from 'react';
import { createThread, createReply } from '../services/databaseService';
import { UploadIcon } from './icons';

interface PostFormProps {
  threadId?: number;
  onPostSuccess: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ threadId, onPostSuccess }) => {
  const isReply = threadId !== undefined;
  
  const [author, setAuthor] = useState('');
  const [subject, setSubject] = useState('');
  const [comment, setComment] = useState('');
  const [image, setImage] = useState<{ file: File, previewUrl: string } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if(file.size > 4 * 1024 * 1024) {
          setError("File size cannot exceed 4MB.");
          return;
      }
      setImage({ file, previewUrl: URL.createObjectURL(file) });
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) {
      setError("Comment is required.");
      return;
    }
    if (!isReply && !image) {
      setError("An image is required for a new thread.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let imageData: { url: string; filename: string } | null = null;
      if (image) {
        const url = await fileToBase64(image.file);
        imageData = { url, filename: image.file.name };
      }

      if (isReply) {
        await createReply(threadId, comment, author, imageData);
      } else {
        if (!subject) {
            setError("Subject is required for a new thread.");
            setIsSubmitting(false);
            return;
        }
        if (!imageData) { // Should be caught earlier, but as a safeguard
            setError("An image is required for a new thread.");
            setIsSubmitting(false);
            return;
        }
        await createThread(subject, comment, author, imageData);
      }
      onPostSuccess();
    } catch (e: any) {
      setError(e.message || "Failed to submit post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const imagePreview = image?.previewUrl || null;

  return (
    <form onSubmit={handleSubmit} className="bg-gray-700/50 p-4 rounded-lg space-y-4 border border-gray-600/50">
      {error && <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-2 rounded-md text-sm">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="Name (Optional, default: Anonymous)" value={author} onChange={e => setAuthor(e.target.value)} className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        {!isReply && <input type="text" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-500" required />}
      </div>
      <textarea placeholder="Comment" value={comment} onChange={e => setComment(e.target.value)} className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 w-full h-28 resize-y focus:outline-none focus:ring-2 focus:ring-cyan-500" required></textarea>

      <div className="flex flex-wrap items-center gap-4">
        <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md transition duration-300">
            <UploadIcon />
            <span>Upload Image</span>
        </label>
        <input id="file-upload" type="file" accept="image/png, image/jpeg, image/gif" onChange={handleFileChange} className="hidden" />
      </div>

      {imagePreview && (
          <div className="mt-2">
              <img src={imagePreview} alt="Preview" className="max-h-40 rounded-md border border-gray-600" />
          </div>
      )}

      <div className="text-right">
        <button type="submit" disabled={isSubmitting} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 disabled:bg-cyan-800 disabled:cursor-not-allowed">
            {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
