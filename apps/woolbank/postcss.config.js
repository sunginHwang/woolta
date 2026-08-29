//@ts-check
const createPostcssConfig = require('../../tools/stylex/postcssStylex');

module.exports = createPostcssConfig(__dirname, ['app', 'components', 'domains']);
