import { censoredWords } from './censoredWords'

export function checkInappropriateWords(input: string | CommentType, comment?: CommentType): string {
    let words: string[];
    if (typeof input === 'string') {
        words = input.split(' ')
    } else {
        comment = input
        words = comment.content.split(' ')
    }

    let isCensored = false;
    const newWords = words.map(word => {
        if (censoredWords.includes(word)) {
            isCensored = true
            return '*'.repeat(word.length)
        }
        return word;
    })

    if (comment) {
        comment.isCensored = isCensored
    }

    return newWords.join(' ')
}