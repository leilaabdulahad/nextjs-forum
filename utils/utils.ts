import { CommentType } from '@/components/commentList'
import { censoredWords } from './censoredWords'

export function checkInappropriateWords(input: string | CommentType): [string, boolean] | CommentType {
    if (typeof input === 'string') {
        const words = input.split(' ')
        let isCensored = false;
        const newWords = words.map(word => {
            if (censoredWords.includes(word)) {
                isCensored = true;
                return '*'.repeat(word.length);
            }
            return word;
        })

        return [newWords.join(' '), isCensored]
    } else {
        const comment = input
        const words = comment.content.split(' ')
        let isCensored = false

        const newWords = words.map(word => {
            if (censoredWords.includes(word)) {
                isCensored = true;
                return '*'.repeat(word.length);
            }
            return word;
        })

        comment.content = newWords.join(' ')
        comment.isCensored = isCensored
        return comment
    }
}