/**
 * Generate char code map
 */

const chars = '`\"\':;,.?()[]{}<>~!@#$%^&*-+=/\\|1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const codeMap = Object.create(null)

chars.split('').map(c => {
  codeMap[c.charCodeAt()] = c
})

// add space charcode
codeMap[32] = ' '

export default codeMap