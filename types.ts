
export interface PostData {
  id: number;
  author: string;
  comment: string;
  image?: {
    url: string; // base64 data URL
    filename: string;
  };
  timestamp: number;
}

export interface ThreadData {
  id: number;
  op: PostData;
  replies: PostData[];
  subject: string;
}
