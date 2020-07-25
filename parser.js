function getList(instance) {
    if (instance === null || instance === undefined) {
        return [];
    }
    return Object.getOwnPropertyNames(instance).map(n => instance[n]);
}

function convertArticle(original) {
    let isResolved = original.resolved_id > 0;
    let addedDate = new Date(1970, 0, 1, 0, 0, 0);
    addedDate.setUTCSeconds(original.time_added);
    return {
        Title: isResolved ? original.resolved_title : original.given_title,
        Id: original.item_id,
        Excerpt: isResolved ? original.excerpt : "",
        WordCount: original.word_count,
        Url: isResolved ? original.resolved_url : original.given_url,
        Added: addedDate,
        Tags: getList(original.tags).map(t => t.tag),
        IsArticle: original.is_article === "1"
    };
}

exports.convertArticles = function convertArticles(list) {
    return getList(list).map(convertArticle);
}
