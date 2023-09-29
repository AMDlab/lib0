import crypto from './crypto'

export const subtle = crypto.subtle
export const getRandomValues = crypto.getRandomValues.bind(crypto)
