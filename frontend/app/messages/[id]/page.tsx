'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Message, Conversation } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
            return;
        }
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated, authLoading, id]);

    useEffect(() => {
        // Poll for new messages every 5 seconds
        if (!isAuthenticated) return;
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [isAuthenticated, id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchData = async () => {
        try {
            const [convRes, msgRes] = await Promise.all([
                api.get(`/api/messages/conversations/${id}`),
                api.get(`/api/messages/conversations/${id}/messages`)
            ]);
            setConversation(convRes.data);
            setMessages(msgRes.data);
        } catch (err) {
            console.error('Failed to fetch chat data', err);
            router.push('/messages');
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async () => {
        try {
            const res = await api.get(`/api/messages/conversations/${id}/messages`);
            setMessages(res.data);
        } catch (err) {
            console.error('Failed to fetch messages', err);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const res = await api.post(`/api/messages/conversations/${id}/messages`, {
                content: newMessage.trim()
            });
            setMessages(prev => [...prev, res.data]);
            setNewMessage('');
            inputRef.current?.focus();
        } catch (err) {
            console.error('Failed to send message', err);
        } finally {
            setSending(false);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Group messages by date
    const groupedMessages: { date: string; messages: Message[] }[] = [];
    messages.forEach(msg => {
        const dateStr = new Date(msg.sentAt).toDateString();
        const lastGroup = groupedMessages[groupedMessages.length - 1];
        if (lastGroup && new Date(lastGroup.messages[0].sentAt).toDateString() === dateStr) {
            lastGroup.messages.push(msg);
        } else {
            groupedMessages.push({ date: dateStr, messages: [msg] });
        }
    });

    if (authLoading || loading) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="animate-pulse space-y-4">
                    <div className="h-16 bg-slate-800 rounded-xl"></div>
                    <div className="h-96 bg-slate-800 rounded-xl"></div>
                    <div className="h-14 bg-slate-800 rounded-xl"></div>
                </div>
            </div>
        );
    }

    if (!conversation) return null;

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 animate-fade-in flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
            {/* Header */}
            <div className="bg-slate-800/50 border border-gray-700/50 rounded-xl p-4 mb-4 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Link
                        href="/messages"
                        className="text-gray-400 hover:text-white transition-colors p-1"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>

                    {/* Listing thumbnail */}
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-700">
                        {conversation.listingImage ? (
                            <img
                                src={`${API_URL}/uploads/${conversation.listingImage}`}
                                alt={conversation.listingTitle}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-semibold">
                                    {conversation.otherUsername.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <h2 className="text-white font-medium truncate">{conversation.otherUsername}</h2>
                        </div>
                        <Link
                            href={`/listings/${conversation.listingId}`}
                            className="text-purple-400 hover:text-purple-300 text-sm truncate block transition-colors"
                        >
                            {conversation.listingTitle}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-slate-900/30 border border-gray-700/50 rounded-xl p-4 mb-4 chat-scrollbar">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <svg className="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <p>No messages yet. Say hello!</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {groupedMessages.map((group, gi) => (
                            <div key={gi}>
                                <div className="flex items-center justify-center mb-4">
                                    <span className="text-xs text-gray-500 bg-slate-800 px-3 py-1 rounded-full">
                                        {formatDate(group.messages[0].sentAt)}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {group.messages.map(msg => {
                                        const isMine = msg.senderId === user?.userId;
                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${isMine
                                                            ? 'chat-bubble-sent text-white'
                                                            : 'chat-bubble-received text-gray-100'
                                                        }`}
                                                >
                                                    <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                                                    <p className={`text-[10px] mt-1 ${isMine ? 'text-purple-200' : 'text-gray-500'}`}>
                                                        {formatTime(msg.sentAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="flex gap-3 flex-shrink-0">
                <input
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 input-dark rounded-xl px-5 py-3.5 text-sm"
                    maxLength={2000}
                    autoFocus
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="btn-primary px-6 py-3.5 rounded-xl flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {sending ? (
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    )}
                    <span className="hidden sm:inline">Send</span>
                </button>
            </form>
        </div>
    );
}
