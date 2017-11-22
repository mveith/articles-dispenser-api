
export interface RequestResponseData {
    code: string;
}

export interface PocketArticle {
    item_id: string;
    given_url: string;
    given_title: string;
    time_added: number;
    resolved_title: string;
    resolved_url: string;
    excerpt: string;
    word_count: number;
    tags: any;
    resolved_id: number;
}

export interface PocketTag {
    item_id: string;
    tag: string;
}
