export interface Channel {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    userCount: number;
    tags: string[];
    activeUsers?: string[]; // For tracking who's currently in the channel
}

export interface Post {
    username: string;
    content: string;
    timestamp: string;
    channelId: string;
}
