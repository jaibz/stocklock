"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { getStockInsights } from '@/lib/api';
import { SendIcon, Loader2, PlusIcon, MessageSquare, Trash2Icon, EditIcon, ShareIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreHorizontal } from "lucide-react";

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
};

export default function ChatInterface() {
  const [chats, setChats] = useState<Chat[]>([{ id: '1', title: 'New Chat', messages: [] }]);
  const [currentChatId, setCurrentChatId] = useState('1');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    updateChat(currentChatId, userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getStockInsights(input);
      const assistantMessage: Message = { role: 'assistant', content: response };
      updateChat(currentChatId, assistantMessage);
      updateChatTitle(currentChatId, input);
    } catch (error) {
      console.error('Error fetching stock insights:', error);
      const errorMessage: Message = { role: 'assistant', content: 'Sorry, I encountered an error while fetching the information. Please try again.' };
      updateChat(currentChatId, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateChat = (chatId: string, message: Message) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId 
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      )
    );
  };

  const updateChatTitle = (chatId: string, input: string) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId && chat.title === 'New Chat'
          ? { ...chat, title: input.slice(0, 30) + (input.length > 30 ? '...' : '') }
          : chat
      )
    );
  };

  const startNewChat = () => {
    const newChatId = (chats.length + 1).toString();
    setChats(prevChats => [...prevChats, { id: newChatId, title: 'New Chat', messages: [] }]);
    setCurrentChatId(newChatId);
  };

  const switchChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const deleteChat = (chatId: string) => {
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(chats[0]?.id || '');
    }
  };

  const startRenameChat = (chatId: string, currentTitle: string) => {
    setEditingChatId(chatId);
    setEditingTitle(currentTitle);
  };

  const finishRenameChat = () => {
    if (editingChatId) {
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === editingChatId
            ? { ...chat, title: editingTitle }
            : chat
        )
      );
      setEditingChatId(null);
    }
  };

  const shareChat = (chatId: string) => {
    console.log(`Sharing chat ${chatId}`);
    alert('Sharing functionality to be implemented');
  };

  const currentChat = chats.find(chat => chat.id === currentChatId) || { id: '1', title: 'New Chat', messages: [] };

  return (
    <div className="flex h-full overflow-hidden border rounded-lg">
      {/* Chat History Sidebar */}
      <div className="w-64 bg-background border-r flex flex-col">
        <Button 
          onClick={startNewChat} 
          className="m-4 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <PlusIcon className="mr-2 h-4 w-4" /> New Chat
        </Button>
        <ScrollArea className="flex-grow px-2">
          {chats.map(chat => (
            <div key={chat.id} className="mb-2 relative">
              <Button
                onClick={() => switchChat(chat.id)}
                className={`w-full justify-start py-2 px-3 ${
                  chat.id === currentChatId ? 'bg-accent' : 'bg-transparent'
                } text-foreground hover:bg-accent/80 rounded-md`}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                {editingChatId === chat.id ? (
                  <Input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={finishRenameChat}
                    onKeyPress={(e) => e.key === 'Enter' && finishRenameChat()}
                    className="w-full"
                    autoFocus
                  />
                ) : (
                  <span className="truncate">{chat.title}</span>
                )}
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => startRenameChat(chat.id, chat.title)}>
                    <EditIcon className="mr-2 h-4 w-4" /> Rename
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => shareChat(chat.id)}>
                    <ShareIcon className="mr-2 h-4 w-4" /> Share
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-destructive" onClick={() => deleteChat(chat.id)}>
                    <Trash2Icon className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col bg-background">
        <ScrollArea className="flex-grow px-6 py-4 overflow-y-auto">
          {currentChat.messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <Card
                className={`inline-block p-3 max-w-[80%] rounded-xl ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
              </Card>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Input Area - Always in view */}
        <div className="p-4 bg-background border-t sticky bottom-0 z-10">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about stocks, market trends, or comparisons..."
                className="flex-grow rounded-full bg-secondary text-foreground"
              />
              <Button type="submit" disabled={isLoading} className="rounded-full px-6">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <SendIcon className="h-4 w-4" />
                )}
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}