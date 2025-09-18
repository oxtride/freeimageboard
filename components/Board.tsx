
import React, { useState, useEffect, useCallback } from 'react';
import type { ThreadData } from '../types';
import { getThreads } from '../services/databaseService';
import Thread from './Thread';
import PostForm from './PostForm';
import { PlusCircleIcon } from './icons';

const Board: React.FC = () => {
  const [threads, setThreads] = useState<ThreadData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const fetchThreads = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getThreads();
      setThreads(data);
    } catch (e) {
      setError("Failed to load threads.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handlePostSuccess = () => {
    setIsFormVisible(false);
    fetchThreads();
  }

  return (
    <div>
      <div className="bg-gray-800 p-4 rounded-lg mb-6 shadow-md border border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-200">Start a New Thread</h2>
          <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            aria-expanded={isFormVisible}
          >
            <PlusCircleIcon />
            {isFormVisible ? 'Cancel' : 'Create Thread'}
          </button>
        </div>
        {isFormVisible && (
          <div className="mt-4">
            <PostForm onPostSuccess={handlePostSuccess} />
          </div>
        )}
      </div>

      {isLoading && <p className="text-center text-gray-400 mt-8">Loading threads...</p>}
      {error && <p className="text-center text-red-400 mt-8">{error}</p>}
      
      {!isLoading && !error && (
        <div className="space-y-5">
          {threads.map((thread) => (
            <Thread key={thread.id} thread={thread} onReplySuccess={fetchThreads} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Board;
