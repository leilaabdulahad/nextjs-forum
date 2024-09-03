export type Comment = {
  _id: string;
  threadId?: string;
  content: string;
  creationDate: string;
  username: string; 
  isAnswer?: boolean;
  parentCommentId?: string; // New field for nested comments
  replies?: Comment[]; // Add replies field
}


// types.ts or wherever your types are defined

export type Reply = {
  content: string;
  username: string;
  parentCommentId: string; // This is specific to the reply
  isAnswer?: boolean; // Optional, as you may not want to include this for all replies
};


export type ThreadCategory = "THREAD" | "QNA"

export type Thread = {
  _id: string;
  title: string;
  category: ThreadCategory;
  creationDate: string;
  description: string;
  comments: Comment[]; 
  username: string; 
  isLocked: boolean;
}

export type User = {
  _id: string;
  username: string;
  isModerator: boolean;
}
