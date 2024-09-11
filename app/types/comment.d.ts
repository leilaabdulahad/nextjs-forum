type CommentType = {
  _id: string
  threadId: string
  parentCommentId: string
  content: string 
  username: string
  creationDate: string
  isAnswer: boolean
  replies: Reply[] 
  isCensored: boolean
}

type Reply = {
  _id: string
  threadId: string 
  parentCommentId: string
  content: string
  username: string
  creationDate: string 
  isAnswer?: boolean
  isCensored: boolean 
}