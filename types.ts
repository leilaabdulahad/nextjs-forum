export type Comment = {
  _id: string;
  threadId?: string;
  content: string;
  creationDate: string;
  username: string; 
  isAnswer?: boolean;
}

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
