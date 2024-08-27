export interface Post {
    id: string;
    title: string;
    subreddit?: string;
    author?: string;
    content: string;
    upvotes: number;
    downvotes: number;
    createdAt: string;
}
  
export interface Subreddit {
    id: string;
    name: string;
    description: string;
    bannerUrl?: string;
    iconUrl?: string;
    posts: Post[];
    isSubscribed: boolean;
}

export interface UserProfile {
    id: string;
    username: string;
    avatarUrl?: string;
    description: string;
    posts: Post[];
}
  