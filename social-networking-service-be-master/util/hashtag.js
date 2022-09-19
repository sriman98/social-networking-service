const extract = require('mention-hashtag');

exports.getHashtagsArray = (text) => {

    const content = text.replace(/[\n|\t]/g, " ").trim();
    const hashtags = extract(content, { unique: true, symbol: false, type: '#' });
    console.log(hashtags);
    return hashtags;
}

exports.splitIntoNonIntersectionArrays = (apiArray, dbArray) => {

    const apiExtraArray = new Set();
    const dbExtraArray = new Set(dbArray);

    apiArray.forEach(element => {
        if (dbExtraArray.has(element)) {
            dbExtraArray.delete(element);
        } else {
            apiExtraArray.add(element);
        }
    });

    return {
        apiExtraArray: [...apiExtraArray],
        dbExtraArray: [...dbExtraArray]
    }
}