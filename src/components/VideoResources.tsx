import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Play,
  Youtube,
  BookOpen,
  FileText,
  ExternalLink,
  Clock,
  ThumbsUp,
  Search,
  Filter,
  Sparkles,
  Download,
  Star,
  TrendingUp,
  Users,
  Link2
} from "lucide-react";
import { motion } from "motion/react";

interface VideoResource {
  id: string;
  title: string;
  channel: string;
  duration: string;
  views: string;
  thumbnail: string;
  url: string;
  tags: string[];
  relevance: number; // 1-5
  aiRecommended: boolean;
}

interface Article {
  id: string;
  title: string;
  author: string;
  readTime: string;
  summary: string;
  url: string;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
}

interface VideoResourcesProps {
  subjectTitle: string;
  subjectColor: string;
  existingVideos?: string[];
  existingArticles?: string[];
}

export function VideoResources({ 
  subjectTitle, 
  subjectColor,
  existingVideos = [],
  existingArticles = []
}: VideoResourcesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Mock data - in produzione da YouTube API + AI recommendations
  const videos: VideoResource[] = [
    {
      id: "v1",
      title: "Introduzione completa a UX/UI Design - Tutorial 2024",
      channel: "DesignCourse",
      duration: "45:32",
      views: "2.3M",
      thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop",
      url: "https://youtube.com",
      tags: ["UX", "UI", "Design", "Fundamentals"],
      relevance: 5,
      aiRecommended: true
    },
    {
      id: "v2",
      title: "Le 10 Euristiche di Nielsen spiegate con esempi pratici",
      channel: "NNGroup",
      duration: "28:15",
      views: "890K",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop",
      url: "https://youtube.com",
      tags: ["Usability", "Nielsen", "Heuristics"],
      relevance: 5,
      aiRecommended: true
    },
    {
      id: "v3",
      title: "Principi di Gestalt applicati al Web Design",
      channel: "Web Design Mastery",
      duration: "19:47",
      views: "456K",
      thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&h=225&fit=crop",
      url: "https://youtube.com",
      tags: ["Gestalt", "Visual Design", "Psychology"],
      relevance: 4,
      aiRecommended: false
    },
    {
      id: "v4",
      title: "User Research: come condurre interviste efficaci",
      channel: "UX Collective",
      duration: "35:20",
      views: "312K",
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop",
      url: "https://youtube.com",
      tags: ["Research", "User Testing", "Methodology"],
      relevance: 4,
      aiRecommended: true
    },
    {
      id: "v5",
      title: "Design Systems: creare componenti riutilizzabili",
      channel: "Figma",
      duration: "52:08",
      views: "1.1M",
      thumbnail: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=400&h=225&fit=crop",
      url: "https://youtube.com",
      tags: ["Design Systems", "Components", "Figma"],
      relevance: 3,
      aiRecommended: false
    },
    {
      id: "v6",
      title: "Accessibilità Web (WCAG): guida completa",
      channel: "A11y Talks",
      duration: "41:15",
      views: "678K",
      thumbnail: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=225&fit=crop",
      url: "https://youtube.com",
      tags: ["Accessibility", "WCAG", "Inclusive Design"],
      relevance: 4,
      aiRecommended: true
    }
  ];

  const articles: Article[] = [
    {
      id: "a1",
      title: "Le 10 Euristiche di Usabilità di Jakob Nielsen",
      author: "Nielsen Norman Group",
      readTime: "8 min",
      summary: "Una guida completa alle euristiche fondamentali per valutare l'usabilità delle interfacce utente, con esempi pratici e checklist.",
      url: "https://nngroup.com",
      tags: ["Usability", "Heuristics", "Evaluation"],
      difficulty: "beginner"
    },
    {
      id: "a2",
      title: "Cognitive Load Theory applicata al Design",
      author: "UX Magazine",
      readTime: "12 min",
      summary: "Approfondimento su come ridurre il carico cognitivo nelle interfacce attraverso principi di design basati sulla psicologia cognitiva.",
      url: "https://uxmag.com",
      tags: ["Psychology", "Cognitive Load", "Theory"],
      difficulty: "intermediate"
    },
    {
      id: "a3",
      title: "Gestalt Principles in Modern UI Design",
      author: "Smashing Magazine",
      readTime: "10 min",
      summary: "Come i principi della Gestalt influenzano la percezione visiva e possono essere applicati per creare interfacce più intuitive.",
      url: "https://smashingmagazine.com",
      tags: ["Gestalt", "Visual Design", "Perception"],
      difficulty: "intermediate"
    },
    {
      id: "a4",
      title: "User Research Best Practices nel 2024",
      author: "UX Collective",
      readTime: "15 min",
      summary: "Metodologie aggiornate per condurre ricerche utente efficaci: interviste, test di usabilità, surveys e analisi dei dati.",
      url: "https://uxdesign.cc",
      tags: ["Research", "Methodology", "Best Practices"],
      difficulty: "intermediate"
    },
    {
      id: "a5",
      title: "Accessibility: Beyond Compliance",
      author: "A11y Project",
      readTime: "11 min",
      summary: "L'accessibilità non è solo conformità agli standard, ma creazione di esperienze inclusive che funzionano per tutti gli utenti.",
      url: "https://a11yproject.com",
      tags: ["Accessibility", "Inclusive Design", "WCAG"],
      difficulty: "advanced"
    },
    {
      id: "a6",
      title: "Design Systems: Architecture and Implementation",
      author: "Brad Frost",
      readTime: "18 min",
      summary: "Come strutturare e implementare un design system scalabile: atomic design, documentazione e governance.",
      url: "https://bradfrost.com",
      tags: ["Design Systems", "Architecture", "Atomic Design"],
      difficulty: "advanced"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "beginner": return "bg-green-100 text-green-700";
      case "intermediate": return "bg-yellow-100 text-yellow-700";
      case "advanced": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <Youtube className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-medium">Video</p>
                <p className="font-bold text-gray-900">{videos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-medium">Articoli</p>
                <p className="font-bold text-gray-900">{articles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-medium">AI Suggeriti</p>
                <p className="font-bold text-gray-900">
                  {videos.filter(v => v.aiRecommended).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-medium">Completati</p>
                <p className="font-bold text-gray-900">12/{videos.length + articles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Cerca video, articoli o argomenti..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtri
              </Button>
              <Button variant="outline" size="sm">
                <Star className="w-4 h-4 mr-2" />
                Salvati
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="videos">
            <Youtube className="w-4 h-4 mr-2" />
            Video
          </TabsTrigger>
          <TabsTrigger value="articles">
            <FileText className="w-4 h-4 mr-2" />
            Articoli
          </TabsTrigger>
          <TabsTrigger value="playlists">
            <BookOpen className="w-4 h-4 mr-2" />
            Playlist
          </TabsTrigger>
        </TabsList>

        {/* Videos Tab */}
        <TabsContent value="videos" className="mt-6 space-y-4">
          {/* AI Recommended Section */}
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Consigliati dall'AI per te
              </CardTitle>
              <CardDescription>
                Basati sul tuo progresso e argomenti di studio recenti
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {filteredVideos.filter(v => v.aiRecommended).slice(0, 2).map((video) => (
                  <motion.div
                    key={video.id}
                    whileHover={{ y: -4 }}
                    className="group"
                  >
                    <Card className="overflow-hidden border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer">
                      <div className="relative">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
                            <Play className="w-8 h-8 text-white ml-1" fill="white" />
                          </div>
                        </div>
                        <Badge className="absolute top-2 right-2 bg-purple-500 text-white">
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI Pick
                        </Badge>
                        <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
                          {video.duration}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                          {video.title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <Users className="w-4 h-4" />
                          <span>{video.channel}</span>
                          <span>•</span>
                          <span>{video.views} views</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {video.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* All Videos */}
          <Card>
            <CardHeader>
              <CardTitle>Tutti i Video</CardTitle>
              <CardDescription>
                Raccolta curata di risorse video per {subjectTitle}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {filteredVideos.map((video) => (
                  <motion.div
                    key={video.id}
                    whileHover={{ y: -4 }}
                    className="group"
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                      <div className="relative">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-36 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                            <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                          </div>
                        </div>
                        {video.aiRecommended && (
                          <Badge className="absolute top-2 left-2 bg-purple-500 text-white text-xs">
                            AI
                          </Badge>
                        )}
                        <Badge className="absolute bottom-2 right-2 bg-black/70 text-white text-xs">
                          {video.duration}
                        </Badge>
                      </div>
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">
                          {video.title}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">{video.channel}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{video.relevance}/5</span>
                          </div>
                          <span>•</span>
                          <span>{video.views}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Articles Tab */}
        <TabsContent value="articles" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Articoli e Letture Consigliate</CardTitle>
              <CardDescription>
                Approfondimenti teorici e guide pratiche
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <motion.div
                    key={article.id}
                    whileHover={{ x: 4 }}
                  >
                    <Card className="hover:shadow-md transition-all cursor-pointer border-l-4 border-l-blue-500">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getDifficultyColor(article.difficulty)}>
                                {article.difficulty}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {article.readTime}
                              </Badge>
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                              {article.title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {article.summary}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                              <FileText className="w-4 h-4" />
                              <span>{article.author}</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {article.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button size="sm" variant="outline">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Leggi
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="w-4 h-4 mr-2" />
                              Salva
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Playlists Tab */}
        <TabsContent value="playlists" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Playlist Curate</CardTitle>
              <CardDescription>
                Percorsi di apprendimento strutturati per argomento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "UX Fundamentals - Percorso Completo",
                    videos: 12,
                    duration: "4h 35m",
                    description: "Dai principi base fino alle tecniche avanzate di UX design",
                    color: "blue"
                  },
                  {
                    title: "User Research & Testing",
                    videos: 8,
                    duration: "2h 50m",
                    description: "Metodologie per condurre ricerche utente efficaci",
                    color: "green"
                  },
                  {
                    title: "Design Systems & Components",
                    videos: 15,
                    duration: "5h 20m",
                    description: "Creare e gestire design system scalabili",
                    color: "purple"
                  }
                ].map((playlist, index) => (
                  <Card key={index} className="hover:shadow-md transition-all cursor-pointer">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 rounded-lg bg-${playlist.color}-100 flex items-center justify-center flex-shrink-0`}>
                          <Play className={`w-8 h-8 text-${playlist.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{playlist.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{playlist.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Play className="w-4 h-4" />
                              <span>{playlist.videos} video</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{playlist.duration}</span>
                            </div>
                          </div>
                        </div>
                        <Button>
                          <Play className="w-4 h-4 mr-2" />
                          Inizia
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Suggestions Card */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                Scopri Nuove Risorse con l'AI
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                L'intelligenza artificiale analizza i tuoi progressi e interessi per suggerirti 
                video, articoli e risorse personalizzate. Ricevi notifiche quando vengono pubblicati 
                nuovi contenuti rilevanti per il tuo percorso di studi.
              </p>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                <Sparkles className="w-4 h-4 mr-2" />
                Trova Risorse Personalizzate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
