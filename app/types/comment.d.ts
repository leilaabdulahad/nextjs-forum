type CommentType = {
  _id: string
  threadId: string
  parentCommentId: string
  content: string 
  username: string
  creationDate: string
  isAnswer: boolean
  replies: Reply[] // Use the Reply type here
  isCensored: boolean
}

type Reply = {
  _id: string // Add this line
  threadId: string // Add this line
  parentCommentId: string
  content: string
  username: string
  creationDate: string // Add this line
  isAnswer?: boolean
  isCensored: boolean // Add this line
}