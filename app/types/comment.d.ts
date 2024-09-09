type CommentType = {
  _id: string
  threadId: string
  parentCommentId: string
  content: string
  username: string
  creationDate: string
  isAnswer: boolean
  replies: CommentType[]
  isCensored: boolean
}

type Reply = {
  content: string
  username: string
  parentCommentId: string
  isAnswer?: boolean
}