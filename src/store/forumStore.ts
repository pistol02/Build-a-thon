import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the full Forum interface matching your CommunitySection
export interface Forum {
  id: string;
  name: string;
  description: string;
  tags: string[];
  rating: number;
  notes: Array<{
    id: string;
    title: string;
    content: string;
    author: string;
    authorId: string; // Added for consistency with notifications
    timestamp: Date;
    replies: Array<{
      id: string;
      content: string;
      author: string;
      authorId: string; // Added for consistency
      timestamp: Date;
      likes: number;
      dislikes: number;
      attachments: Array<{
        id: string;
        type: "image" | "pdf" | "link";
        url: string;
        name: string;
        size?: number;
      }>;
    }>;
    likes: number;
    dislikes: number;
    attachments: Array<{
      id: string;
      type: "image" | "pdf" | "link";
      url: string;
      name: string;
      size?: number;
    }>;
    isPinned: boolean;
  }>;
  discussions: Array<{
    id: string;
    content: string;
    author: string;
    authorId: string; // Added for consistency
    timestamp: Date;
    replies: Array<{
      id: string;
      content: string;
      author: string;
      authorId: string; // Added for consistency
      timestamp: Date;
      likes: number;
      dislikes: number;
      attachments: Array<{
        id: string;
        type: "image" | "pdf" | "link";
        url: string;
        name: string;
        size?: number;
      }>;
    }>;
    likes: number;
    dislikes: number;
    attachments: Array<{
      id: string;
      type: "image" | "pdf" | "link";
      url: string;
      name: string;
      size?: number;
    }>;
    isPinned: boolean;
    isPoll?: boolean;
    pollOptions?: Array<{
      id: string;
      text: string;
      votes: number;
      voters: string[];
    }>;
  }>;
}

interface ForumStore {
  forums: Forum[];
  addForum: (forum: Omit<Forum, 'id' | 'notes' | 'discussions' | 'rating'>) => void;
  addNoteToForum: (forumId: string, note: Omit<Forum['notes'][0], 'id' | 'timestamp' | 'replies' | 'likes'>) => void;
  getForum: (id: string) => Forum | undefined;
  updateForum: (forumId: string, updates: Partial<Forum>) => void;
  addDiscussion: (forumId: string, discussion: Omit<Forum['discussions'][0], 'id' | 'replies'>) => void;
  addReplyToDiscussion: (forumId: string, discussionId: string, reply: Omit<Forum['discussions'][0]['replies'][0], 'id' | 'timestamp'>) => void;
  addReplyToNote: (forumId: string, noteId: string, reply: Omit<Forum['notes'][0]['replies'][0], 'id' | 'timestamp'>) => void;
}

export const useForumStore = create<ForumStore>()(
  persist(
    (set, get) => ({
      forums: [
        {
          id: "1",
          name: "Web Development",
          description: "Discuss modern web development practices and technologies",
          tags: ["React", "NextJS", "Frontend"],
          rating: 4.5,
          notes: [],
          discussions: [],
        },
        {
          id: "2",
          name: "Machine Learning",
          description: "Share ML/AI knowledge and resources",
          tags: ["AI", "Python", "Data Science"],
          rating: 4.8,
          notes: [],
          discussions: [],
        },
      ],
      addForum: (forum) =>
        set((state) => ({
          forums: [
            ...state.forums,
            {
              ...forum,
              id: Date.now().toString(),
              rating: 0,
              notes: [],
              discussions: [],
            },
          ],
        })),
      addNoteToForum: (forumId, note) =>
        set((state) => ({
          forums: state.forums.map((forum) =>
            forum.id === forumId
              ? {
                  ...forum,
                  notes: [
                    ...forum.notes,
                    {
                      ...note,
                      id: Date.now().toString(),
                      timestamp: new Date(),
                      replies: [],
                      likes: 0,
                      dislikes: 0, // Added
                      attachments: [], // Added
                      isPinned: false, // Added
                    },
                  ],
                }
              : forum
          ),
        })),
      getForum: (id) => get().forums.find((forum) => forum.id === id),
      updateForum: (forumId, updates) =>
        set((state) => ({
          forums: state.forums.map((forum) =>
            forum.id === forumId ? { ...forum, ...updates } : forum
          ),
        })),
      addDiscussion: (forumId, discussion) =>
        set((state) => ({
          forums: state.forums.map((forum) =>
            forum.id === forumId
              ? {
                  ...forum,
                  discussions: [
                    {
                      ...discussion,
                      id: Date.now().toString(),
                      timestamp: new Date(),
                      replies: [],
                      likes: 0, // Added
                      dislikes: 0, // Added
                      attachments: discussion.attachments || [], // Ensure attachments persist
                      isPinned: false, // Added
                      isPoll: discussion.isPoll || false, // Added
                      pollOptions: discussion.pollOptions || undefined, // Added
                    },
                    ...forum.discussions,
                  ],
                }
              : forum
          ),
        })),
      addReplyToDiscussion: (forumId, discussionId, reply) =>
        set((state) => ({
          forums: state.forums.map((forum) =>
            forum.id === forumId
              ? {
                  ...forum,
                  discussions: forum.discussions.map((disc) =>
                    disc.id === discussionId
                      ? {
                          ...disc,
                          replies: [
                            ...disc.replies,
                            {
                              ...reply,
                              id: Date.now().toString(),
                              timestamp: new Date(),
                              likes: 0, // Added
                              dislikes: 0, // Added
                              attachments: reply.attachments || [], // Ensure attachments persist
                            },
                          ],
                        }
                      : disc
                  ),
                }
              : forum
          ),
        })),
      addReplyToNote: (forumId, noteId, reply) =>
        set((state) => ({
          forums: state.forums.map((forum) =>
            forum.id === forumId
              ? {
                  ...forum,
                  notes: forum.notes.map((note) =>
                    note.id === noteId
                      ? {
                          ...note,
                          replies: [
                            ...note.replies,
                            {
                              ...reply,
                              id: Date.now().toString(),
                              timestamp: new Date(),
                              likes: 0, // Added
                              dislikes: 0, // Added
                              attachments: reply.attachments || [], // Ensure attachments persist
                            },
                          ],
                        }
                      : note
                  ),
                }
              : forum
          ),
        })),
    }),
    {
      name: 'forum-storage',
    }
  )
);