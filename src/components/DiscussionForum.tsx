import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  MessageSquare, 
  Send, 
  Heart, 
  ThumbsUp, 
  Bookmark, 
  MoreVertical,
  Pin,
  AlertCircle,
  Lightbulb,
  Megaphone,
  Users,
  AtSign,
  Hash,
  Smile,
  Paperclip,
  Reply,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { Subject } from '../data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface Message {
  id: string;
  author: {
    name: string;
    role: 'professor' | 'tutor' | 'student';
    avatar: string;
  };
  content: string;
  timestamp: string;
  category: 'announcement' | 'question' | 'discussion' | 'resource';
  mentions: Mention[];
  reactions: Reaction[];
  replies: Reply[];
  isPinned: boolean;
  isResolved?: boolean;
}

interface Mention {
  type: 'student' | 'module' | 'topic' | 'resource';
  id: string;
  name: string;
}

interface Reaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

interface Reply {
  id: string;
  author: {
    name: string;
    role: 'professor' | 'tutor' | 'student';
    avatar: string;
  };
  content: string;
  timestamp: string;
  reactions: Reaction[];
}

interface DiscussionForumProps {
  subject: Subject;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    author: {
      name: 'Massimiliano Zampini',
      role: 'professor',
      avatar: 'MZ',
    },
    content: 'Benvenuti al corso! 🎉 Questa settimana inizieremo con @Percezione e Attenzione. Assicuratevi di rivedere le #slide-01 prima della prossima lezione. Per domande, scrivete pure qui!',
    timestamp: '2024-01-15T10:30:00',
    category: 'announcement',
    mentions: [
      { type: 'topic', id: 'topic1', name: 'Percezione e Attenzione' },
      { type: 'resource', id: 'res1', name: 'slide-01' }
    ],
    reactions: [
      { emoji: '👍', count: 24, userReacted: true },
      { emoji: '❤️', count: 12, userReacted: false },
      { emoji: '🎓', count: 8, userReacted: false }
    ],
    replies: [
      {
        id: 'r1',
        author: {
          name: 'Matteo De Donno',
          role: 'student',
          avatar: 'MD',
        },
        content: 'Grazie professore! Non vedo l\'ora di iniziare 🚀',
        timestamp: '2024-01-15T11:00:00',
        reactions: [{ emoji: '👍', count: 3, userReacted: false }]
      }
    ],
    isPinned: true
  },
  {
    id: '2',
    author: {
      name: 'Sofia Rossi',
      role: 'student',
      avatar: 'SR',
    },
    content: 'Qualcuno ha degli appunti extra sul modulo @Memoria e Apprendimento? Vorrei approfondire prima dell\'esame 📚',
    timestamp: '2024-01-14T14:20:00',
    category: 'question',
    mentions: [
      { type: 'module', id: 'mod2', name: 'Memoria e Apprendimento' }
    ],
    reactions: [
      { emoji: '👀', count: 5, userReacted: false }
    ],
    replies: [
      {
        id: 'r2',
        author: {
          name: 'Marco Bianchi',
          role: 'tutor',
          avatar: 'MB',
        },
        content: 'Ciao @Sofia! Ho caricato degli appunti integrativi nella sezione risorse. Dai un\'occhiata! 📝',
        timestamp: '2024-01-14T15:30:00',
        reactions: [{ emoji: '❤️', count: 6, userReacted: true }]
      },
      {
        id: 'r3',
        author: {
          name: 'Sofia Rossi',
          role: 'student',
          avatar: 'SR',
        },
        content: 'Perfetto, grazie mille! 🙏',
        timestamp: '2024-01-14T16:00:00',
        reactions: []
      }
    ],
    isPinned: false,
    isResolved: true
  },
  {
    id: '3',
    author: {
      name: 'Luca Verdi',
      role: 'student',
      avatar: 'LV',
    },
    content: 'Qualcuno vuole creare un gruppo di studio per @Cognizione e Intelligenza? Sarebbe utile discutere insieme gli argomenti più complessi 🧠💡',
    timestamp: '2024-01-13T09:15:00',
    category: 'discussion',
    mentions: [
      { type: 'module', id: 'mod3', name: 'Cognizione e Intelligenza' }
    ],
    reactions: [
      { emoji: '🙋', count: 18, userReacted: true },
      { emoji: '💡', count: 10, userReacted: false }
    ],
    replies: [
      {
        id: 'r4',
        author: {
          name: 'Anna Ferrari',
          role: 'student',
          avatar: 'AF',
        },
        content: 'Io ci sono! Che ne dite di incontrarci mercoledì pomeriggio?',
        timestamp: '2024-01-13T10:00:00',
        reactions: [{ emoji: '👍', count: 8, userReacted: false }]
      }
    ],
    isPinned: false
  }
];

const AVAILABLE_STUDENTS = [
  'Matteo De Donno', 'Sofia Rossi', 'Luca Verdi', 'Anna Ferrari', 
  'Marco Bianchi', 'Giulia Romano', 'Alessandro Costa'
];

export function DiscussionForum({ subject }: DiscussionForumProps) {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'announcement' | 'question' | 'discussion'>('all');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleReaction = (messageId: string, emoji: string, isReply: boolean = false, replyId?: string) => {
    setMessages(prevMessages => 
      prevMessages.map(msg => {
        if (msg.id === messageId) {
          if (isReply && replyId) {
            return {
              ...msg,
              replies: msg.replies.map(reply => {
                if (reply.id === replyId) {
                  const existingReaction = reply.reactions.find(r => r.emoji === emoji);
                  if (existingReaction) {
                    return {
                      ...reply,
                      reactions: reply.reactions.map(r =>
                        r.emoji === emoji
                          ? { ...r, count: r.userReacted ? r.count - 1 : r.count + 1, userReacted: !r.userReacted }
                          : r
                      )
                    };
                  } else {
                    return {
                      ...reply,
                      reactions: [...reply.reactions, { emoji, count: 1, userReacted: true }]
                    };
                  }
                }
                return reply;
              })
            };
          } else {
            const existingReaction = msg.reactions.find(r => r.emoji === emoji);
            if (existingReaction) {
              return {
                ...msg,
                reactions: msg.reactions.map(r =>
                  r.emoji === emoji
                    ? { ...r, count: r.userReacted ? r.count - 1 : r.count + 1, userReacted: !r.userReacted }
                    : r
                )
              };
            } else {
              return {
                ...msg,
                reactions: [...msg.reactions, { emoji, count: 1, userReacted: true }]
              };
            }
          }
        }
        return msg;
      })
    );
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      author: {
        name: 'Matteo De Donno',
        role: 'student',
        avatar: 'MD',
      },
      content: newMessage,
      timestamp: new Date().toISOString(),
      category: 'discussion',
      mentions: extractMentions(newMessage),
      reactions: [],
      replies: [],
      isPinned: false
    };

    setMessages([newMsg, ...messages]);
    setNewMessage('');
  };

  const handleSendReply = (messageId: string) => {
    if (!replyContent.trim()) return;

    const newReply: Reply = {
      id: Date.now().toString(),
      author: {
        name: 'Matteo De Donno',
        role: 'student',
        avatar: 'MD',
      },
      content: replyContent,
      timestamp: new Date().toISOString(),
      reactions: []
    };

    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === messageId
          ? { ...msg, replies: [...msg.replies, newReply] }
          : msg
      )
    );

    setReplyContent('');
    setReplyingTo(null);
  };

  const extractMentions = (text: string): Mention[] => {
    const mentions: Mention[] = [];
    const mentionRegex = /@(\w+)/g;
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push({
        type: 'student',
        id: match[1],
        name: match[1]
      });
    }

    return mentions;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    setNewMessage(value);
    setCursorPosition(cursorPos);

    // Check if typing @ for mentions
    const lastAtSymbol = value.lastIndexOf('@', cursorPos);
    if (lastAtSymbol !== -1 && cursorPos - lastAtSymbol <= 20) {
      const searchTerm = value.substring(lastAtSymbol + 1, cursorPos);
      setMentionSearch(searchTerm);
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (name: string) => {
    const lastAtSymbol = newMessage.lastIndexOf('@', cursorPosition);
    const beforeMention = newMessage.substring(0, lastAtSymbol);
    const afterMention = newMessage.substring(cursorPosition);
    
    setNewMessage(`${beforeMention}@${name} ${afterMention}`);
    setShowMentions(false);
    setMentionSearch('');
  };

  const filteredMessages = selectedCategory === 'all' 
    ? messages 
    : messages.filter(msg => msg.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'announcement':
        return <Megaphone className="w-4 h-4" />;
      case 'question':
        return <AlertCircle className="w-4 h-4" />;
      case 'discussion':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'announcement':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'question':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'discussion':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'professor':
        return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
      case 'tutor':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Adesso';
    if (diffMins < 60) return `${diffMins}m fa`;
    if (diffHours < 24) return `${diffHours}h fa`;
    if (diffDays < 7) return `${diffDays}g fa`;
    
    return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-6">
      {/* Header removed - now inside tab */}
      
      {/* New Message Input */}
      <div className="relative">
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Avatar className="w-10 h-10 border-2 border-white shadow-md">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  MD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-sm">Matteo De Donno</p>
                <p className="text-xs text-gray-500">Studente</p>
              </div>
            </div>
            
            <div className="relative">
              <Textarea
                ref={textareaRef}
                placeholder="Condividi una domanda, discussione o risorsa... Usa @ per menzionare studenti o # per argomenti"
                value={newMessage}
                onChange={handleInputChange}
                className="min-h-[100px] bg-white border-2 border-gray-200 focus:border-blue-400 resize-none"
              />
              
              {showMentions && (
                <Card className="absolute z-10 mt-2 w-full max-h-48 overflow-y-auto shadow-lg">
                  <CardContent className="p-2">
                    {AVAILABLE_STUDENTS
                      .filter(name => 
                        name.toLowerCase().includes(mentionSearch.toLowerCase())
                      )
                      .map((name, idx) => (
                        <button
                          key={idx}
                          onClick={() => insertMention(name)}
                          className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded flex items-center gap-2 transition-colors"
                        >
                          <AtSign className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium">{name}</span>
                        </button>
                      ))}
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-gray-600">
                  <Paperclip className="w-4 h-4 mr-1" />
                  Allega
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600">
                  <Smile className="w-4 h-4 mr-1" />
                  Emoji
                </Button>
              </div>
              <Button 
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Send className="w-4 h-4 mr-2" />
                Pubblica
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <Tabs value={selectedCategory} onValueChange={(v: any) => setSelectedCategory(v)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Tutte
          </TabsTrigger>
          <TabsTrigger value="announcement" className="flex items-center gap-2">
            <Megaphone className="w-4 h-4" />
            Annunci
          </TabsTrigger>
          <TabsTrigger value="question" className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Domande
          </TabsTrigger>
          <TabsTrigger value="discussion" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Discussioni
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <MessageCard
            key={message.id}
            message={message}
            onReaction={handleReaction}
            onReply={() => setReplyingTo(message.id)}
            replyingTo={replyingTo === message.id}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
            onSendReply={() => handleSendReply(message.id)}
            onCancelReply={() => setReplyingTo(null)}
            getCategoryIcon={getCategoryIcon}
            getCategoryColor={getCategoryColor}
            getRoleBadgeColor={getRoleBadgeColor}
            formatTimestamp={formatTimestamp}
          />
        ))}
      </div>
    </div>
  );
}

function MessageCard({
  message,
  onReaction,
  onReply,
  replyingTo,
  replyContent,
  setReplyContent,
  onSendReply,
  onCancelReply,
  getCategoryIcon,
  getCategoryColor,
  getRoleBadgeColor,
  formatTimestamp
}: any) {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <Card className={`transition-all hover:shadow-md ${message.isPinned ? 'border-2 border-yellow-400 bg-yellow-50/30' : ''}`}>
      <CardContent className="p-5 space-y-4">
        {/* Message Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="w-12 h-12 border-2 border-white shadow-md">
              <AvatarFallback className={getRoleBadgeColor(message.author.role)}>
                {message.author.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-900">{message.author.name}</span>
                <Badge className={`${getRoleBadgeColor(message.author.role)} text-xs`}>
                  {message.author.role === 'professor' ? '👨‍🏫 Professore' : 
                   message.author.role === 'tutor' ? '🎓 Tutor' : '👤 Studente'}
                </Badge>
                <span className="text-xs text-gray-500">• {formatTimestamp(message.timestamp)}</span>
                {message.isPinned && (
                  <Badge variant="outline" className="text-xs flex items-center gap-1 border-yellow-500 text-yellow-700">
                    <Pin className="w-3 h-3" />
                    Fissato
                  </Badge>
                )}
                {message.isResolved && (
                  <Badge variant="outline" className="text-xs flex items-center gap-1 border-green-500 text-green-700">
                    ✓ Risolto
                  </Badge>
                )}
              </div>
              <Badge className={`mt-2 text-xs border ${getCategoryColor(message.category)} flex items-center gap-1 w-fit`}>
                {getCategoryIcon(message.category)}
                {message.category === 'announcement' ? 'Annuncio' :
                 message.category === 'question' ? 'Domanda' :
                 message.category === 'discussion' ? 'Discussione' : 'Risorsa'}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Pin className="w-4 h-4 mr-2" />
                {message.isPinned ? 'Rimuovi pin' : 'Fissa messaggio'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bookmark className="w-4 h-4 mr-2" />
                Salva
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Message Content */}
        <div className="pl-15">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {message.content.split(/(@\w+|#[\w-]+)/g).map((part: string, idx: number) => {
              if (part.startsWith('@')) {
                return (
                  <span key={idx} className="text-blue-600 font-medium hover:underline cursor-pointer">
                    {part}
                  </span>
                );
              } else if (part.startsWith('#')) {
                return (
                  <span key={idx} className="text-purple-600 font-medium hover:underline cursor-pointer">
                    {part}
                  </span>
                );
              }
              return part;
            })}
          </p>

          {/* Reactions */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {message.reactions.map((reaction: any, idx: number) => (
              <button
                key={idx}
                onClick={() => onReaction(message.id, reaction.emoji)}
                className={`px-3 py-1 rounded-full border-2 transition-all hover:scale-110 ${
                  reaction.userReacted 
                    ? 'bg-blue-100 border-blue-400' 
                    : 'bg-gray-100 border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-sm">
                  {reaction.emoji} {reaction.count}
                </span>
              </button>
            ))}
            <button
              onClick={() => onReaction(message.id, '👍')}
              className="px-3 py-1 rounded-full border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-all text-sm"
            >
              + React
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onReply}
              className="text-gray-600 hover:text-blue-600"
            >
              <Reply className="w-4 h-4 mr-1" />
              Rispondi ({message.replies.length})
            </Button>
            {message.replies.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplies(!showReplies)}
                className="text-gray-600"
              >
                {showReplies ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Nascondi risposte
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Mostra {message.replies.length} risposte
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Reply Input */}
          {replyingTo && (
            <div className="mt-4 space-y-2 bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Reply className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Rispondi a {message.author.name}</span>
              </div>
              <Textarea
                placeholder="Scrivi la tua risposta..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[80px] bg-white"
              />
              <div className="flex items-center gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={onCancelReply}>
                  Annulla
                </Button>
                <Button size="sm" onClick={onSendReply}>
                  <Send className="w-4 h-4 mr-2" />
                  Invia Risposta
                </Button>
              </div>
            </div>
          )}

          {/* Replies */}
          {showReplies && message.replies.length > 0 && (
            <div className="mt-4 space-y-3 pl-4 border-l-4 border-blue-200">
              {message.replies.map((reply: Reply) => (
                <div key={reply.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                      <AvatarFallback className={getRoleBadgeColor(reply.author.role)}>
                        {reply.author.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="font-medium text-sm text-gray-900">{reply.author.name}</span>
                        <Badge className={`${getRoleBadgeColor(reply.author.role)} text-xs`}>
                          {reply.author.role === 'professor' ? '👨‍🏫 Prof' : 
                           reply.author.role === 'tutor' ? '🎓 Tutor' : '👤'}
                        </Badge>
                        <span className="text-xs text-gray-500">• {formatTimestamp(reply.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {reply.content.split(/(@\w+)/g).map((part: string, idx: number) => {
                          if (part.startsWith('@')) {
                            return (
                              <span key={idx} className="text-blue-600 font-medium hover:underline cursor-pointer">
                                {part}
                              </span>
                            );
                          }
                          return part;
                        })}
                      </p>
                      {reply.reactions.length > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          {reply.reactions.map((reaction: any, idx: number) => (
                            <button
                              key={idx}
                              onClick={() => onReaction(message.id, reaction.emoji, true, reply.id)}
                              className={`px-2 py-1 rounded-full border transition-all text-xs ${
                                reaction.userReacted 
                                  ? 'bg-blue-100 border-blue-300' 
                                  : 'bg-white border-gray-200'
                              }`}
                            >
                              {reaction.emoji} {reaction.count}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}