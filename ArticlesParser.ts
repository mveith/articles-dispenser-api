import { PocketArticle, PocketTag } from './PocketModel';

export interface Article {
    Id: string;
    Url: string;
    Title: string;
    Added: Date;
    Excerpt: string;
    WordCount: number;
    Tags: string[];
}

export function getList<T>(instance): T[] {
    if (instance === null || instance === undefined) {
        return [];
    }
    return Object.getOwnPropertyNames(instance).map(n => instance[n]);
}

export function convertArticle(original: PocketArticle): Article {
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
        Tags: getList<PocketTag>(original.tags).map(t => t.tag)
    };
}
