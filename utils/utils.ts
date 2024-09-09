import { CommentType } from './CommentList'
import { censoredWords } from './censoredWords'

export function checkInappropriateWords(comment: CommentType) {
    const words = comment.content.split(' ')
    let isCensored = false

    const newWords = words.map(word => {
        if (censoredWords.includes(word)) {
            isCensored = true
            return '*'.repeat(word.length)
        }
        return word
    })

    comment.content = newWords.join(' ')
    comment.isCensored = isCensored
}