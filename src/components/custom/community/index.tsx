"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaStar,
  FaPlus,
  FaReply,
  FaThumbsUp,
  FaThumbsDown,
  FaBell,
  FaLink,
  FaImage,
  FaFilePdf,
  FaThumbtack,
  FaPoll,
} from "react-icons/fa";
import { useForumStore } from "@/store/forumStore";

interface Forum {
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
    authorId: string;
    timestamp: Date;
    replies: Array<{
      id: string;
      content: string;
      author: string;
      authorId: string;
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
    authorId: string;
    timestamp: Date;
    replies: Array<{
      id: string;
      content: string;
      author: string;
      authorId: string;
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

interface Attachment {
  id: string;
  type: "image" | "pdf" | "link";
  url: string;
  name: string;
  size?: number;
}

interface Notification {
  id: string;
  userId: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  relatedItemId: string;
  relatedItemType: "discussion" | "note" | "reply";
}

export default function CommunitySection() {
  const {
    forums,
    addForum,
    addReplyToDiscussion,
    addReplyToNote,
    addDiscussion,
    updateForum, // Changed from updateForumContent to match store
  } = useForumStore();

  const [selectedForum, setSelectedForum] = useState<Forum | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isCreatingForum, setIsCreatingForum] = useState(false);
  const [newForumData, setNewForumData] = useState({
    name: "",
    description: "",
    tags: [] as string[],
  });

  const [replyingTo, setReplyingTo] = useState<{
    type: "discussion" | "note";
    id: string;
    replyText: string;
  } | null>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isCreatingPoll, setIsCreatingPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>([""]);
  const [pollQuestion, setPollQuestion] = useState("");
  const [currentUserName] = useState("Current User");
  const [currentUserId] = useState("user123");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync selectedForum with store
  useEffect(() => {
    if (selectedForum) {
      const updatedForum = forums.find((f) => f.id === selectedForum.id);
      if (updatedForum && JSON.stringify(updatedForum) !== JSON.stringify(selectedForum)) {
        console.log("Syncing selectedForum with store:", updatedForum);
        setSelectedForum(updatedForum);
      }
    }
  }, [forums, selectedForum]);

  // Count unread notifications
  useEffect(() => {
    const unread = notifications.filter((n) => !n.isRead && n.userId === currentUserId).length;
    setUnreadNotifications(unread);
  }, [notifications]);

  // Create a new forum
  const handleCreateForum = () => {
    if (!newForumData.name || !newForumData.description || newForumData.tags.length === 0) {
      alert("Please fill all fields");
      return;
    }

    addForum({
      name: newForumData.name,
      description: newForumData.description,
      tags: newForumData.tags,
    });

    setIsCreatingForum(false);
    setNewForumData({ name: "", description: "", tags: [] });
  };

  // Add a new discussion
  const handleSendMessage = () => {
    if (!newMessage.trim() && attachments.length === 0 && !isCreatingPoll) return;
    if (!selectedForum) return;

    let newDiscussion: Partial<Forum["discussions"][0]> = {
      content: newMessage,
      author: currentUserName,
      authorId: currentUserId,
      timestamp: new Date(),
      attachments: [...attachments],
      likes: 0,
      dislikes: 0,
      isPinned: false,
    };

    if (isCreatingPoll) {
      const validOptions = pollOptions.filter((option) => option.trim() !== "");
      if (validOptions.length < 2) {
        alert("Please add at least 2 poll options");
        return;
      }

      newDiscussion.isPoll = true;
      newDiscussion.pollOptions = validOptions.map((option) => ({
        id: Math.random().toString(36).substring(2, 15),
        text: option,
        votes: 0,
        voters: [],
      }));
      newDiscussion.content = pollQuestion;
    }

    addDiscussion(selectedForum.id, newDiscussion);
    setNewMessage("");
    setAttachments([]);
    setIsCreatingPoll(false);
    setPollOptions([""]);
    setPollQuestion("");
  };

  // Handle reply to discussion or note
  const handleReply = () => {
    if (!replyingTo || !replyingTo.replyText.trim() || !selectedForum) return;

    const newReply = {
      content: replyingTo.replyText,
      author: currentUserName,
      authorId: currentUserId,
      likes: 0,
      dislikes: 0,
      attachments: [...attachments],
    };

    if (replyingTo.type === "discussion") {
      addReplyToDiscussion(selectedForum.id, replyingTo.id, newReply);
      const discussion = selectedForum.discussions.find((d) => d.id === replyingTo.id);
      if (discussion && discussion.authorId !== currentUserId) {
        addNotification(
          discussion.authorId,
          `${currentUserName} replied to your discussion`,
          replyingTo.id,
          "discussion"
        );
      }
    } else {
      addReplyToNote(selectedForum.id, replyingTo.id, newReply);
      const note = selectedForum.notes.find((n) => n.id === replyingTo.id);
      if (note && note.authorId !== currentUserId) {
        addNotification(
          note.authorId,
          `${currentUserName} replied to your note`,
          replyingTo.id,
          "note"
        );
      }
    }

    setReplyingTo(null);
    setAttachments([]);
  };

  // Handle forum rating
  const handleRating = (forumId: string, rating: number) => {
    const updatedForum = forums.find((forum) => forum.id === forumId);
    if (updatedForum) {
      const newRating = (updatedForum.rating + rating) / 2;
      updateForum(forumId, { rating: newRating });
    }
  };

  // Handle vote (like/dislike)
  const handleVote = (type: "discussion" | "note" | "reply", id: string, voteType: "like" | "dislike") => {
    if (!selectedForum) return;

    const updatedForum = { ...selectedForum };

    if (type === "discussion") {
      updatedForum.discussions = updatedForum.discussions.map((discussion) => {
        if (discussion.id === id) {
          console.log(`Voting on discussion ${id}: ${voteType}`);
          return {
            ...discussion,
            likes: voteType === "like" ? discussion.likes + 1 : discussion.likes,
            dislikes: voteType === "dislike" ? discussion.dislikes + 1 : discussion.dislikes,
          };
        }
        return discussion;
      });
    } else if (type === "note") {
      updatedForum.notes = updatedForum.notes.map((note) => {
        if (note.id === id) {
          console.log(`Voting on note ${id}: ${voteType}`);
          return {
            ...note,
            likes: voteType === "like" ? note.likes + 1 : note.likes,
            dislikes: voteType === "dislike" ? note.dislikes + 1 : note.dislikes,
          };
        }
        return note;
      });
    } else if (type === "reply") {
      let found = false;
      updatedForum.discussions = updatedForum.discussions.map((discussion) => {
        const updatedReplies = discussion.replies.map((reply) => {
          if (reply.id === id) {
            found = true;
            console.log(`Voting on reply ${id} in discussion: ${voteType}`);
            return {
              ...reply,
              likes: voteType === "like" ? reply.likes + 1 : reply.likes,
              dislikes: voteType === "dislike" ? reply.dislikes + 1 : reply.dislikes,
            };
          }
          return reply;
        });
        return { ...discussion, replies: updatedReplies };
      });

      if (!found) {
        updatedForum.notes = updatedForum.notes.map((note) => {
          const updatedReplies = note.replies.map((reply) => {
            if (reply.id === id) {
              console.log(`Voting on reply ${id} in note: ${voteType}`);
              return {
                ...reply,
                likes: voteType === "like" ? reply.likes + 1 : reply.likes,
                dislikes: voteType === "dislike" ? reply.dislikes + 1 : reply.dislikes,
              };
            }
            return reply;
          });
          return { ...note, replies: updatedReplies };
        });
      }
    }

    console.log("Updating forum with vote:", updatedForum);
    updateForum(selectedForum.id, updatedForum);
    // No need to setSelectedForum here; useEffect will sync it
  };

  // Handle pin/unpin post
  const handlePinPost = (type: "discussion" | "note", id: string) => {
    if (!selectedForum) return;

    const updatedForum = { ...selectedForum };

    if (type === "discussion") {
      updatedForum.discussions = updatedForum.discussions.map((discussion) => {
        if (discussion.id === id) {
          console.log(`Toggling pin on discussion ${id}: ${!discussion.isPinned}`);
          return { ...discussion, isPinned: !discussion.isPinned };
        }
        return discussion;
      });
    } else {
      updatedForum.notes = updatedForum.notes.map((note) => {
        if (note.id === id) {
          console.log(`Toggling pin on note ${id}: ${!note.isPinned}`);
          return { ...note, isPinned: !note.isPinned };
        }
        return note;
      });
    }

    console.log("Updating forum with pin:", updatedForum);
    updateForum(selectedForum.id, updatedForum);
    // No need to setSelectedForum here; useEffect will sync it
  };

  // Add notification
  const addNotification = (
    userId: string,
    message: string,
    relatedItemId: string,
    relatedItemType: "discussion" | "note" | "reply"
  ) => {
    console.log("Adding notification for:", userId, message);
    const newNotification: Notification = {
      id: Math.random().toString(36).substring(2, 15),
      userId,
      message,
      timestamp: new Date(),
      isRead: false,
      relatedItemId,
      relatedItemType,
    };
    setNotifications([...notifications, newNotification]);
  };

  // Mark notification as read
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setNotifications(
      notifications.map((notification) =>
        notification.userId === currentUserId ? { ...notification, isRead: true } : notification
      )
    );
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      let type: "image" | "pdf" | "link" = "image";
      if (file.type === "application/pdf") {
        type = "pdf";
      } else if (!file.type.startsWith("image/")) {
        alert(`File type not supported: ${file.type}`);
        return;
      }

      const url = URL.createObjectURL(file);
      const newAttachment: Attachment = {
        id: Math.random().toString(36).substring(2, 15),
        type,
        url,
        name: file.name,
        size: file.size,
      };
      setAttachments([...attachments, newAttachment]);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Add a link attachment
  const handleAddLink = () => {
    const url = prompt("Enter the URL:");
    if (!url) return;

    try {
      new URL(url);
      const name = url.split("/").pop() || url;
      const newAttachment: Attachment = {
        id: Math.random().toString(36).substring(2, 15),
        type: "link",
        url,
        name,
      };
      setAttachments([...attachments, newAttachment]);
    } catch (e) {
      alert("Please enter a valid URL");
    }
  };

  // Remove an attachment
  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  // Handle vote on a poll option
  const handlePollVote = (discussionId: string, optionId: string) => {
    if (!selectedForum) return;
    const updatedForum = { ...selectedForum };

    updatedForum.discussions = updatedForum.discussions.map((discussion) => {
      if (discussion.id === discussionId && discussion.isPoll && discussion.pollOptions) {
        const hasVoted = discussion.pollOptions.some((option) =>
          option.voters.includes(currentUserId)
        );

        if (hasVoted) {
          const updatedOptions = discussion.pollOptions.map((option) => {
            if (option.voters.includes(currentUserId)) {
              return {
                ...option,
                votes: option.votes - 1,
                voters: option.voters.filter((id) => id !== currentUserId),
              };
            }
            return option;
          });
          return {
            ...discussion,
            pollOptions: updatedOptions.map((option) => {
              if (option.id === optionId) {
                return {
                  ...option,
                  votes: option.votes + 1,
                  voters: [...option.voters, currentUserId],
                };
              }
              return option;
            }),
          };
        } else {
          return {
            ...discussion,
            pollOptions: discussion.pollOptions.map((option) => {
              if (option.id === optionId) {
                return {
                  ...option,
                  votes: option.votes + 1,
                  voters: [...option.voters, currentUserId],
                };
              }
              return option;
            }),
          };
        }
      }
      return discussion;
    });

    updateForum(selectedForum.id, updatedForum);
  };

  // Add poll option field
  const handleAddPollOption = () => {
    setPollOptions([...pollOptions, ""]);
  };

  // Update poll option text
  const handlePollOptionChange = (index: number, value: string) => {
    const updatedOptions = [...pollOptions];
    updatedOptions[index] = value;
    setPollOptions(updatedOptions);
  };

  // Remove poll option
  const handleRemovePollOption = (index: number) => {
    if (!pollOptions || pollOptions.length <= 2) {  // Safe check
      alert("A poll must have at least 2 options");
      return;
    }
  
    const updatedOptions = [...pollOptions];
    updatedOptions.splice(index, 1);
    setPollOptions(updatedOptions);
  };
  

  // Calculate total votes for a poll
  const getTotalVotes = (pollOptions?: Forum["discussions"][0]["pollOptions"]) => {
    if (!pollOptions) return 0;
    return pollOptions.reduce((sum, option) => sum + option.votes, 0);
  };

  // Render attachment list
  const renderAttachments = (attachments?: Attachment[]) => {
    if (!attachments || attachments.length === 0) return null;  

    return (
      <div className="mt-3 space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Attachments:</h4>
        <div className="flex flex-wrap gap-2">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="group relative">
              {attachment.type === "image" ? (
                <a
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-16 h-16 border rounded-md overflow-hidden"
                >
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="w-full h-full object-cover"
                  />
                </a>
              ) : attachment.type === "pdf" ? (
                <a
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-16 h-16 bg-red-50 border rounded-md"
                >
                  <FaFilePdf className="text-red-500 text-xl" />
                </a>
              ) : (
                <a
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-16 h-16 bg-blue-50 border rounded-md"
                >
                  <FaLink className="text-blue-500 text-lg" />
                </a>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs truncate px-1">
                {attachment.name.slice(0, 10)}
                {attachment.name.length > 10 ? "..." : ""}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render poll
  const renderPoll = (discussion: Forum["discussions"][0]) => {
    if (!discussion.isPoll || !discussion.pollOptions) return null;

    const totalVotes = getTotalVotes(discussion.pollOptions);
    const hasVoted = discussion.pollOptions.some((option) =>
      option.voters.includes(currentUserId)
    );

    return (
      <div className="mt-3 border rounded-lg p-3 bg-gray-50">
        <h4 className="font-medium mb-2">Poll: {discussion.content}</h4>
        <div className="space-y-2">
          {discussion.pollOptions.map((option) => {
            const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
            return (
              <div key={option.id} className="relative">
                <div
                  className="flex items-center justify-between p-2 bg-white border rounded cursor-pointer hover:bg-blue-50"
                  onClick={() => handlePollVote(discussion.id, option.id)}
                >
                  <span>{option.text}</span>
                  {hasVoted && (
                    <span className="text-sm text-gray-500">
                      {option.votes} ({percentage}%)
                    </span>
                  )}
                </div>
                {hasVoted && (
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-100 rounded pointer-events-none"
                    style={{ width: `${percentage}%`, zIndex: -1 }}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-2 text-sm text-gray-500 text-right">
          {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
        </div>
      </div>
    );
  };

  // Render note
  const renderNote = (note: Forum["notes"][0]) => (
    <div
      key={note.id}
      className={`bg-white rounded-xl shadow-lg p-4 ${note.isPinned ? "border-2 border-yellow-300" : ""}`}
    >
      {note.isPinned && (
        <div className="flex items-center text-yellow-600 mb-2">
          <FaThumbtack className="mr-2" />
          <span className="text-sm font-medium">Pinned Note</span>
        </div>
      )}
      <h3 className="font-bold text-lg mb-2">{note.title}</h3>
      <div dangerouslySetInnerHTML={{ __html: note.content }} />
      {renderAttachments(note.attachments)}

      {note.replies.length > 0 && (
        <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-2">
          {note.replies.map((reply) => (
            <div key={reply.id} className="text-sm">
              <p className="text-gray-800">{reply.content}</p>
              {renderAttachments(reply.attachments)}
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <span>{reply.author}</span>
                  <span>{new Date(reply.timestamp).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVote("reply", reply.id, "like")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    <FaThumbsUp size={12} />
                    <span>{reply.likes}</span>
                  </button>
                  <button
                    onClick={() => handleVote("reply", reply.id, "dislike")}
                    className="flex items-center gap-1 hover:text-red-600"
                  >
                    <FaThumbsDown size={12} />
                    <span>{reply.dislikes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {replyingTo?.id === note.id ? (
        <div className="mt-3 space-y-2">
          <input
            type="text"
            value={replyingTo.replyText}
            onChange={(e) => setReplyingTo({ ...replyingTo, replyText: e.target.value })}
            placeholder="Write a reply..."
            className="w-full px-3 py-1 text-sm border rounded-lg"
          />
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {attachments.map((attachment) => (
                <div key={attachment.id} className="relative group border rounded p-1">
                  <div className="flex items-center gap-1">
                    {attachment.type === "image" ? (
                      <FaImage className="text-blue-500" />
                    ) : attachment.type === "pdf" ? (
                      <FaFilePdf className="text-red-500" />
                    ) : (
                      <FaLink className="text-green-500" />
                    )}
                    <span className="text-xs truncate max-w-32">
                      {attachment.name.length > 15 ? attachment.name.substring(0, 15) + "..." : attachment.name}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveAttachment(attachment.id)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-500 hover:text-blue-600"
              >
                <FaImage size={16} />
              </button>
              <button onClick={handleAddLink} className="text-gray-500 hover:text-blue-600">
                <FaLink size={16} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,application/pdf"
                className="hidden"
                multiple
              />
            </div>
            <button
              onClick={handleReply}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm"
            >
              Reply
            </button>
            <button
              onClick={() => {
                setReplyingTo(null);
                setAttachments([]);
              }}
              className="px-3 py-1 text-gray-600 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setReplyingTo({ type: "note", id: note.id, replyText: "" })}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <FaReply size={12} />
              <span className="text-sm">Reply</span>
            </button>
            <button
              onClick={() => handleVote("note", note.id, "like")}
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
            >
              <FaThumbsUp size={14} />
              <span className="text-sm">{note.likes}</span>
            </button>
            <button
              onClick={() => handleVote("note", note.id, "dislike")}
              className="flex items-center gap-1 text-gray-600 hover:text-red-600"
            >
              <FaThumbsDown size={14} />
              <span className="text-sm">{note.dislikes}</span>
            </button>
            <button
              onClick={() => handlePinPost("note", note.id)}
              className={`flex items-center gap-1 ${
                note.isPinned ? "text-yellow-600" : "text-gray-400 hover:text-yellow-600"
              }`}
            >
              <FaThumbtack size={14} />
            </button>
          </div>
          <span className="text-sm text-gray-500">
            By {note.author} • {new Date(note.timestamp).toLocaleDateString()}
          </span>
        </div>
      )}
    </div>
  );

  // Render discussion
  const renderDiscussion = (discussion: Forum["discussions"][0]) => (
    <div
      key={discussion.id}
      className={`bg-white rounded-xl shadow-lg p-4 ${
        discussion.isPinned ? "border-2 border-yellow-300" : ""
      }`}
    >
      {discussion.isPinned && (
        <div className="flex items-center text-yellow-600 mb-2">
          <FaThumbtack className="mr-2" />
          <span className="text-sm font-medium">Pinned Discussion</span>
        </div>
      )}

      {discussion.isPoll ? (
        <>{renderPoll(discussion)}</>
      ) : (
        <>
          <p className="text-gray-800">{discussion.content}</p>
          {renderAttachments(discussion.attachments)}
        </>
      )}

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{discussion.author}</span>
          <span className="text-sm text-gray-500">
            {new Date(discussion.timestamp).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleVote("discussion", discussion.id, "like")}
            className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
          >
            <FaThumbsUp size={14} />
            <span className="text-sm">{discussion.likes}</span>
          </button>
          <button
            onClick={() => handleVote("discussion", discussion.id, "dislike")}
            className="flex items-center gap-1 text-gray-600 hover:text-red-600"
          >
            <FaThumbsDown size={14} />
            <span className="text-sm">{discussion.dislikes}</span>
          </button>
          <button
            onClick={() => handlePinPost("discussion", discussion.id)}
            className={`flex items-center gap-1 ${
              discussion.isPinned ? "text-yellow-600" : "text-gray-400 hover:text-yellow-600"
            }`}
          >
            <FaThumbtack size={14} />
          </button>
        </div>
      </div>

      {discussion.replies.length > 0 && (
        <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-2">
          {discussion.replies.map((reply) => (
            <div key={reply.id} className="text-sm">
              <p className="text-gray-800">{reply.content}</p>
              {renderAttachments(reply.attachments)}
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <span>{reply.author}</span>
                  <span>{new Date(reply.timestamp).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVote("reply", reply.id, "like")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    <FaThumbsUp size={12} />
                    <span>{reply.likes}</span>
                  </button>
                  <button
                    onClick={() => handleVote("reply", reply.id, "dislike")}
                    className="flex items-center gap-1 hover:text-red-600"
                  >
                    <FaThumbsDown size={12} />
                    <span>{reply.dislikes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {replyingTo?.id === discussion.id ? (
        <div className="mt-3 space-y-2">
          <input
            type="text"
            value={replyingTo.replyText}
            onChange={(e) => setReplyingTo({ ...replyingTo, replyText: e.target.value })}
            placeholder="Write a reply..."
            className="w-full px-3 py-1 text-sm border rounded-lg"
          />
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {attachments.map((attachment) => (
                <div key={attachment.id} className="relative group border rounded p-1">
                  <div className="flex items-center gap-1">
                    {attachment.type === "image" ? (
                      <FaImage className="text-blue-500" />
                    ) : attachment.type === "pdf" ? (
                      <FaFilePdf className="text-red-500" />
                    ) : (
                      <FaLink className="text-green-500" />
                    )}
                    <span className="text-xs truncate max-w-32">
                      {attachment.name.length > 15 ? attachment.name.substring(0, 15) + "..." : attachment.name}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveAttachment(attachment.id)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-500 hover:text-blue-600"
              >
                <FaImage size={16} />
              </button>
              <button onClick={handleAddLink} className="text-gray-500 hover:text-blue-600">
                <FaLink size={16} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,application/pdf"
                className="hidden"
                multiple
              />
            </div>
            <button
              onClick={handleReply}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm"
            >
              Reply
            </button>
            <button
              onClick={() => {
                setReplyingTo(null);
                setAttachments([]);
              }}
              className="px-3 py-1 text-gray-600 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setReplyingTo({ type: "discussion", id: discussion.id, replyText: "" })}
          className="mt-2 text-blue-600 text-sm flex items-center gap-1"
        >
          <FaReply size={12} />
          Reply
        </button>
      )}
    </div>
  );

  const sortedDiscussions = selectedForum?.discussions
    .slice()
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  const sortedNotes = selectedForum?.notes
    .slice()
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  return (
    <div className="grid grid-cols-12 h-screen max-h-screen bg-gray-100 p-4 gap-4">
      <div className="col-span-3 bg-white rounded-xl shadow-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Forums</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
            >
              <FaBell />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsCreatingForum(true)}
              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
            >
              <FaPlus />
            </button>
          </div>
        </div>

        {showNotifications && (
          <div className="mb-4 bg-white border rounded-lg shadow-lg p-2 max-h-64 overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-2 mb-2">
              <h3 className="font-medium">Notifications</h3>
              <button
                onClick={markAllNotificationsAsRead}
                className="text-xs text-blue-600 hover:underline"
              >
                Mark all as read
              </button>
            </div>
            {notifications.filter((n) => n.userId === currentUserId).length > 0 ? (
              <div className="space-y-2">
                {notifications
                  .filter((n) => n.userId === currentUserId)
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-2 text-sm rounded ${
                        notification.isRead ? "bg-gray-50" : "bg-blue-50"
                      }`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <p>{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-center text-sm text-gray-500 py-2">No notifications</p>
            )}
          </div>
        )}

        <div className="space-y-3">
          {forums.map((forum) => (
            <div
              key={forum.id}
              onClick={() => setSelectedForum(forum)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedForum?.id === forum.id
                  ? "bg-blue-50 border-2 border-blue-200"
                  : "hover:bg-gray-50 border-2 border-transparent"
              }`}
            >
              <h3 className="font-semibold">{forum.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`w-4 h-4 ${
                        star <= forum.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRating(forum.id, star);
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">{forum.rating.toFixed(1)}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {forum.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-9 space-y-4 overflow-y-auto max-h-screen pb-4">
        {selectedForum ? (
          <>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{selectedForum.name}</h1>
              <p className="text-gray-600 mb-4">{selectedForum.description}</p>
              <div className="flex flex-wrap gap-2">
                {selectedForum.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4">
              {isCreatingPoll ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    placeholder="Enter your poll question..."
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="space-y-2">
                    {pollOptions.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handlePollOptionChange(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleRemovePollOption(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAddPollOption}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm flex items-center gap-1"
                    >
                      <FaPlus size={12} />
                      Add Option
                    </button>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => setIsCreatingPoll(false)}
                      className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendMessage}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                      disabled={!pollQuestion.trim() || pollOptions.filter((o) => o.trim() !== "").length < 2}
                    >
                      Create Poll
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Start a discussion..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 bg-gray-50 shadow-sm transition-all duration-300"
                      rows={3}
                    />
                    {attachments.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-4">
                        {attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="relative group border rounded-lg p-2 bg-white shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
                          >
                            <div className="flex items-center gap-3">
                              {attachment.type === "image" ? (
                                <FaImage className="text-blue-600 w-5 h-5" />
                              ) : attachment.type === "pdf" ? (
                                <FaFilePdf className="text-red-600 w-5 h-5" />
                              ) : (
                                <FaLink className="text-green-600 w-5 h-5" />
                              )}
                              <span className="text-sm text-gray-800 truncate max-w-[150px]">
                                {attachment.name.length > 15
                                  ? attachment.name.substring(0, 15) + "..."
                                  : attachment.name}
                              </span>
                            </div>
                            <button
                              onClick={() => handleRemoveAttachment(attachment.id)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-all duration-200 hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="p-3 text-gray-600 hover:bg-indigo-100 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                          aria-label="Attach Image"
                        >
                          <FaImage className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleAddLink}
                          className="p-3 text-gray-600 hover:bg-indigo-100 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                          aria-label="Attach Link"
                        >
                          <FaLink className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setIsCreatingPoll(true)}
                          className="p-3 text-gray-600 hover:bg-indigo-100 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                          aria-label="Create Poll"
                        >
                          <FaPoll className="w-5 h-5" />
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept="image/*,application/pdf"
                          className="hidden"
                          multiple
                        />
                      </div>
                      <button
                        onClick={handleSendMessage}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                        disabled={!newMessage.trim() && attachments.length === 0}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4">
              {sortedNotes && sortedNotes.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-gray-800">Notes</h2>
                  {sortedNotes.map(renderNote)}
                </div>
              )}

              {sortedDiscussions && sortedDiscussions.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-gray-800">Discussions</h2>
                  {sortedDiscussions.map(renderDiscussion)}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Welcome to Community
              </h2>
              <p className="text-gray-600 mb-6">
                Select a forum from the left to join discussions or create a new forum to start your own community.
              </p>
              <button
                onClick={() => setIsCreatingForum(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center mx-auto gap-2"
              >
                <FaPlus />
                Create New Forum
              </button>
            </div>
          </div>
        )}
      </div>

      {isCreatingForum && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 shadow-2xl max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Forum</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Forum Name
                </label>
                <input
                  type="text"
                  value={newForumData.name}
                  onChange={(e) => setNewForumData({ ...newForumData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newForumData.description}
                  onChange={(e) =>
                    setNewForumData({ ...newForumData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. technology, help, questions"
                  onChange={(e) =>
                    setNewForumData({
                      ...newForumData,
                      tags: e.target.value.split(",").map((tag) => tag.trim()),
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsCreatingForum(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateForum}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Create Forum
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}