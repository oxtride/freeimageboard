
import type { ThreadData, PostData } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export const getThreads = async (): Promise<ThreadData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/threads`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const threads = await response.json();
    return threads;
  } catch (error) {
    console.error('Error fetching threads:', error);
    throw new Error('Failed to load threads');
  }
};

export const createThread = async (
  subject: string,
  comment: string,
  author: string,
  image: { url: string; filename: string }
): Promise<ThreadData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/threads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject,
        comment,
        author,
        image,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const newThread = await response.json();
    return newThread;
  } catch (error) {
    console.error('Error creating thread:', error);
    throw error;
  }
};

export const createReply = async (
  threadId: number,
  comment: string,
  author: string,
  image: { url: string; filename: string } | null
): Promise<PostData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        threadId,
        comment,
        author,
        image,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const newReply = await response.json();
    return newReply;
  } catch (error) {
    console.error('Error creating reply:', error);
    throw error;
  }
};
