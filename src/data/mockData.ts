// Mock data for Student Dashboard (migliorato: testi, descrizioni, badge, posizioni mappe)
export interface StudentData {
  studentName: string;
  studentId: string;
  semester: string;
  upcomingClasses: {
    subject: string;
    time: string;
    location: string;
  }[];
  overallAttendance: number;
  facultyInfo: {
    name: string;
    department: string;
    email: string;
  }[];
  workSchedule?: WorkScheduleEntry[];
}

export interface WorkScheduleEntry {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  type: 'lavoro' | 'impegno' | 'altro';
}

export interface ConceptMapNode {
  id: string;
  label: string;
  x: number;
  y: number;
  connections: string[];
  title?: string;
  description?: string;
  attachments?: { id: string; name: string; url?: string }[];
  badges?: string[];
}

export interface ConceptMap {
  nodes: ConceptMapNode[];
  isAIGenerated: boolean;
  lastModified: string;
}

export interface TopicResources {
  lectureSlide: string;
  studentNotes: string;
  audio_lezione: string;
}

export interface Topic {
  id: string;
  title: string;
  resources: TopicResources;
  lessonDate: string;
  estimatedStudyHours: number;
  conceptMap: ConceptMap;
  attended: boolean;
}

export interface SubjectResources {
  youtubeVideos: string[];
  articles: string[];
  assignments: string[];
  quizzes: string[];
}

export interface Module {
  id: string;
  title: string;
  topics: Topic[];
}

export interface ExamSession {
  date: string;
  time: string;
  location: string;
  type: 'scritto' | 'orale' | 'pratico';
}

export interface Subject {
  id: string;
  title: string;
  code: string;
  instructor: string;
  color: string;
  nextClass: string;
  attendance: number;
  totalClasses: number;
  modules: Module[];
  additionalResources: SubjectResources;
  examSessions: ExamSession[];
  courseConceptMap: ConceptMap;
}

/*
  NOTE: miglioramenti principali
  - testi e descrizioni più leggibili e realistici
  - coordinate (x/y) valorizzate per le mappe (non più 0,0)
  - badge e allegati realistici
  - lastModified aggiornati
  - workSchedule demo per lo StudyCalendar
*/

export const mockStudentData: StudentData = {
  studentName: "Matteo De Donno",
  studentId: "MAT234567",
  semester: "2° Semestre",
  upcomingClasses: [
    { subject: "Psicologia Generale", time: "Oggi, 10:00", location: "Aula A101" },
    { subject: "Interazione uomo-macchina", time: "Domani, 14:00", location: "Lab Informatica 2" },
    { subject: "Semiotica della Rappresentazione Visiva", time: "Mer, 11:00", location: "Aula B205" }
  ],
  overallAttendance: 78,
  facultyInfo: [
    { name: "Prof. Massimiliano Zampini", department: "Interfacce e Tecnologie della Comunicazione", email: "massimiliano.zampini@unitn.it" },
    { name: "Prof. Daniele Agostini", department: "Interfacce e Tecnologie della Comunicazione", email: "daniele.agostini@unitn.it" },
    { name: "Prof. Erik Gadotti", department: "Interfacce e Tecnologie della Comunicazione", email: "erik.gadotti@unitn.it" },
    { name: "Prof. Mario Lauria", department: "Interfacce e Tecnologie della Comunicazione", email: "mario.lauria@unitn.it" }
  ],
  // Demo work schedule: alcuni impegni settimanali
  workSchedule: [
    { id: 'w-1', day: 'Lunedì', startTime: '09:00', endTime: '13:00', type: 'lavoro' },
    { id: 'w-2', day: 'Mercoledì', startTime: '14:00', endTime: '18:00', type: 'lavoro' },
    { id: 'w-3', day: 'Venerdì', startTime: '10:00', endTime: '12:00', type: 'impegno' }
  ]
};

export const mockSubjects: Subject[] = [
  {
    id: "psic101",
    title: "Psicologia Generale",
    code: "PSI301",
    instructor: "Prof. Massimiliano Zampini",
    color: "bg-blue-500",
    nextClass: "Oggi, 10:00",
    attendance: 23,
    totalClasses: 28,
    modules: [
      {
        id: "mod1",
        title: "Fondamenti di Psicologia",
        topics: [
          {
            id: "topic1",
            title: "Processi Cognitivi e Percezione",
            resources: {
              lectureSlide: "Processi_Cognitivi_Slides.pdf",
              studentNotes: "Processi_Cognitivi_Appunti.pdf",
              audio_lezione: "Comprensione dei Processi Cognitivi"
            },
            lessonDate: "2023-10-01",
            estimatedStudyHours: 3,
            conceptMap: {
              nodes: [
                { id: "p1", label: "Processi Cognitivi", x: 360, y: 220, connections: ["p2","p3"], title: "Processi Cognitivi", description: "Percezione, attenzione e memoria come processi interconnessi.", badges: ["core"], attachments: [] },
                { id: "p2", label: "Percezione", x: 500, y: 220, connections: ["p1"], title: "Percezione", description: "Come il cervello interpreta input sensoriali.", badges: ["concetto"], attachments: [] },
                { id: "p3", label: "Attenzione", x: 220, y: 320, connections: ["p1"], title: "Attenzione", description: "Meccanismi di selezione e filtro degli stimoli.", badges: ["concetto"], attachments: [] }
              ],
              isAIGenerated: false,
              lastModified: "2025-11-10"
            },
            attended: false
          },
          {
            id: "topic2",
            title: "Memoria e Apprendimento",
            resources: {
              lectureSlide: "Memoria_Apprendimento_Slides.pdf",
              studentNotes: "Memoria_Apprendimento_Appunti.pdf",
              audio_lezione: "La Scienza della Memoria"
            },
            lessonDate: "2023-10-08",
            estimatedStudyHours: 4,
            conceptMap: {
              nodes: [
                { id: "m1", label: "Memoria a Breve Termine", x: 280, y: 200, connections: ["m2"], title: "MBT", description: "Capacità limitata, codifica e mantenimento.", badges: ["memoria"], attachments: [] },
                { id: "m2", label: "Memoria a Lungo Termine", x: 460, y: 200, connections: ["m1","m3"], title: "MLT", description: "Strutture di immagazzinamento, consolidamento.", badges: ["memoria"], attachments: [] },
                { id: "m3", label: "Apprendimento", x: 370, y: 340, connections: ["m2"], title: "Apprendimento", description: "Processi che portano al cambiamento duraturo.", badges: ["processo"], attachments: [] }
              ],
              isAIGenerated: true,
              lastModified: "2025-10-08"
            },
            attended: false
          },
          {
            id: "topic3",
            title: "Attenzione e Coscienza",
            resources: {
              lectureSlide: "Attenzione_Coscienza_Slides.pdf",
              studentNotes: "Attenzione_Coscienza_Appunti.pdf",
              audio_lezione: "Meccanismi dell'Attenzione"
            },
            lessonDate: "2023-10-15",
            estimatedStudyHours: 3,
            conceptMap: {
              nodes: [
                { id: "a1", label: "Attenzione Selettiva", x: 340, y: 230, connections: ["a2"], title: "Selettiva", description: "Focalizzazione su uno stimolo a discapito di altri.", badges: ["tecnica"], attachments: [] },
                { id: "a2", label: "Stati di Coscienza", x: 520, y: 260, connections: ["a1"], title: "Coscienza", description: "Diverse modalità di esperienza soggettiva.", badges: ["teoria"], attachments: [] }
              ],
              isAIGenerated: false,
              lastModified: "2025-09-30"
            },
            attended: true
          }
        ]
      },
      {
        id: "mod2",
        title: "Psicologia dello Sviluppo",
        topics: [
          {
            id: "topic4",
            title: "Sviluppo Cognitivo",
            resources: {
              lectureSlide: "Sviluppo_Cognitivo_Slides.pdf",
              studentNotes: "Sviluppo_Cognitivo_Appunti.pdf",
              audio_lezione: "Teorie dello Sviluppo"
            },
            lessonDate: "2023-10-22",
            estimatedStudyHours: 4,
            conceptMap: {
              nodes: [
                { id: "s1", label: "Stadi dello Sviluppo", x: 320, y: 250, connections: ["s2"], title: "Stadi", description: "Teorie principali: Piaget, Vygotsky.", badges: ["modulo"], attachments: [] },
                { id: "s2", label: "Plasticità", x: 480, y: 260, connections: ["s1"], title: "Plasticità", description: "Capacità di cambiamento del sistema nervoso.", badges: ["concetto"], attachments: [] }
              ],
              isAIGenerated: true,
              lastModified: "2025-08-12"
            },
            attended: true
          },
          {
            id: "topic5",
            title: "Sviluppo Emotivo e Sociale",
            resources: {
              lectureSlide: "Sviluppo_Emotivo_Slides.pdf",
              studentNotes: "Sviluppo_Emotivo_Appunti.pdf",
              audio_lezione: "Psicologia Sociale"
            },
            lessonDate: "2023-10-29",
            estimatedStudyHours: 3,
            conceptMap: {
              nodes: [
                { id: "se1", label: "Attaccamento", x: 320, y: 210, connections: ["se2"], title: "Attaccamento", description: "Legami primari e sviluppo emotivo.", badges: ["teoria"], attachments: [] },
                { id: "se2", label: "Interazioni Sociali", x: 470, y: 320, connections: ["se1"], title: "Interazioni", description: "Sviluppo delle competenze sociali.", badges: ["pratica"], attachments: [] }
              ],
              isAIGenerated: false,
              lastModified: "2025-07-01"
            },
            attended: false
          }
        ]
      },
      {
        id: "mod3",
        title: "Neuroscienze Cognitive",
        topics: [
          {
            id: "topic6",
            title: "Basi Neurali della Cognizione",
            resources: {
              lectureSlide: "Neuroscienze_Slides.pdf",
              studentNotes: "Neuroscienze_Appunti.pdf",
              audio_lezione: "Il Cervello e la Mente"
            },
            lessonDate: "2023-11-05",
            estimatedStudyHours: 4,
            conceptMap: {
              nodes: [
                { id: "n1", label: "Circuiti Neurali", x: 360, y: 260, connections: ["n2"], title: "Circuiti", description: "Organizzazione funzionale delle reti neurali.", badges: ["avanzato"], attachments: [] },
                { id: "n2", label: "Neurotrasmettitori", x: 520, y: 260, connections: ["n1"], title: "Neurotrasmettitori", description: "Ruolo in apprendimento e memoria.", badges: ["chimica"], attachments: [] }
              ],
              isAIGenerated: true,
              lastModified: "2025-11-05"
            },
            attended: false
          }
        ]
      }
    ],
    additionalResources: {
      youtubeVideos: [
        "Introduzione alla Psicologia Cognitiva – Prof. Zampini",
        "Neuroscienze per Principianti (playlist)",
        "Psicologia della Percezione – Lezione registrata",
        "Teorie dell'Apprendimento: esempi pratici"
      ],
      articles: [
        "La Memoria di Lavoro - Ricerca Moderna (rev. 2024)",
        "Meccanismi dell'Attenzione Visiva – review",
        "Neuroplasticità e Apprendimento – sintesi",
        "Psicologia della Percezione Visiva – studi recenti"
      ],
      assignments: [
        "Compito 1: Analisi dei Processi Cognitivi (deadline 2025-11-20)",
        "Compito 2: Studio sulla Memoria (deadline 2025-12-01)",
        "Compito 3: Esperimento sulla Percezione (deadline 2025-12-10)"
      ],
      quizzes: [
        "Quiz 1: Processi Cognitivi",
        "Quiz 2: Memoria e Attenzione",
        "Quiz 3: Neuroscienze Cognitive"
      ]
    },
    examSessions: [
      { date: "2023-12-15", time: "10:00", location: "Aula A101", type: "scritto" }
    ],
    courseConceptMap: {
      nodes: [
        {
          id: "1",
          label: "Psicologia Generale",
          title: "Psicologia Generale",
          description: "Nodo centrale che connette i moduli principali del corso.",
          x: 400,
          y: 260,
          connections: ["2", "3", "4"],
          badges: ["corso","centrale"],
          attachments: [{ id: "psic-syl-1", name: "Syllabus_Psicologia.pdf", url: "/assets/psicologia_syllabus.pdf" }]
        },
        { id: "2", label: "Fondamenti", title: "Fondamenti di Psicologia", description: "Basi teoriche e concetti introduttivi.", x: 180, y: 260, connections: ["1"], badges: ["modulo"], attachments: [] },
        { id: "3", label: "Sviluppo", title: "Psicologia dello Sviluppo", description: "Temi sullo sviluppo cognitivo e sociale.", x: 620, y: 180, connections: ["1"], badges: ["modulo"], attachments: [] },
        { id: "4", label: "Neuroscienze", title: "Neuroscienze Cognitive", description: "Basi neurali e metodi sperimentali.", x: 620, y: 340, connections: ["1"], badges: ["modulo"], attachments: [] }
      ],
      isAIGenerated: true,
      lastModified: "2025-12-01"
    }
  },

  // HCI e altri soggetti (semplificati ma coerenti)
  {
    id: "hci102",
    title: "Interazione uomo-macchina",
    code: "HCI302",
    instructor: "Prof. Daniele Agostini",
    color: "bg-green-500",
    nextClass: "Domani, 14:00",
    attendance: 26,
    totalClasses: 30,
    modules: [
      {
        id: "mod4",
        title: "Fondamenti di HCI",
        topics: [
          {
            id: "topic7",
            title: "Principi di Usabilità",
            resources: {
              lectureSlide: "Usabilita_Slides.pdf",
              studentNotes: "Usabilita_Appunti.pdf",
              audio_lezione: "Fondamenti di Usabilità"
            },
            lessonDate: "2023-10-02",
            estimatedStudyHours: 3,
            conceptMap: {
              nodes: [
                { id: "h1", label: "Usabilità", x: 380, y: 240, connections: ["h2","h3"], title: "Usabilità", description: "Metriche, accessibilità, e test.", badges: ["core"], attachments: [] },
                { id: "h2", label: "Euristiche", x: 520, y: 200, connections: ["h1"], title: "Euristiche di Nielsen", description: "Linee guida pratiche per l'interazione.", badges: ["metodo"], attachments: [] },
                { id: "h3", label: "Testing", x: 240, y: 320, connections: ["h1"], title: "Test di Usabilità", description: "Metodi per valutare l'usabilità.", badges: ["metodo"], attachments: [] }
              ],
              isAIGenerated: true,
              lastModified: "2025-11-20"
            },
            attended: false
          },
          {
            id: "topic8",
            title: "Design Centrato sull'Utente",
            resources: {
              lectureSlide: "UCD_Slides.pdf",
              studentNotes: "UCD_Appunti.pdf",
              audio_lezione: "Progettazione UX"
            },
            lessonDate: "2023-10-09",
            estimatedStudyHours: 4,
            conceptMap: {
              nodes: [
                { id: "uc1", label: "Persona", x: 300, y: 240, connections: ["uc2"], title: "Persona", description: "Costruzione dei profili utente.", badges: ["ux"], attachments: [] },
                { id: "uc2", label: "User Journey", x: 480, y: 240, connections: ["uc1"], title: "Journey", description: "Mappe dei percorsi utente.", badges: ["ux"], attachments: [] }
              ],
              isAIGenerated: false,
              lastModified: "2025-10-09"
            },
            attended: true
          }
        ]
      }
    ],
    additionalResources: {
      youtubeVideos: [
        "Introduzione a UX Design – Mini corso",
        "Principi di Usabilità Web – Playlist",
        "Design Thinking Tutorial – Esempi"
      ],
      articles: [
        "Le 10 Euristiche di Nielsen – guida rapida",
        "User Research Best Practices – note",
        "Design System Moderni – sintesi"
      ],
      assignments: [
        "Compito 1: Analisi Euristica (2025-11-18)",
        "Compito 2: Prototipazione Interface (2025-11-30)"
      ],
      quizzes: [
        "Quiz 1: Principi di Usabilità",
        "Quiz 2: Metodi di Valutazione"
      ]
    },
    examSessions: [
      { date: "2023-12-16", time: "14:00", location: "Lab Informatica 2", type: "scritto" }
    ],
    courseConceptMap: {
      nodes: [
        { id: "1", label: "HCI", title: "Interazione uomo-macchina", description: "Concetti chiave: usabilità, design, valutazione.", x: 420, y: 260, connections: ["2","3","4"], badges: ["corso"], attachments: [{ id: "hci-syl-1", name: "Syllabus_HCI.pdf", url: "/assets/hci_syllabus.pdf" }] },
        { id: "2", label: "Fondamenti", title: "Fondamenti di HCI", description: "Principi, modelli mentali e affordance.", x: 220, y: 220, connections: ["1"], badges: ["modulo"], attachments: [] },
        { id: "3", label: "Valutazione", title: "Metodi di Valutazione", description: "Testing, euristiche e analisi.", x: 600, y: 200, connections: ["1"], badges: ["modulo"], attachments: [] },
        { id: "4", label: "Interfacce Avanzate", title: "Interfacce Avanzate", description: "Gestuali, vocali e sistemi tangibili.", x: 600, y: 320, connections: ["1"], badges: ["modulo"], attachments: [] }
      ],
      isAIGenerated: true,
      lastModified: "2025-12-02"
    }
  },

  {
    id: "sem103",
    title: "Semiotica della Rappresentazione Visiva",
    code: "SEM303",
    instructor: "Prof. Erik Gadotti",
    color: "bg-purple-500",
    nextClass: "Mer, 11:00",
    attendance: 21,
    totalClasses: 27,
    modules: [
      {
        id: "mod7",
        title: "Fondamenti di Semiotica",
        topics: [
          {
            id: "topic13",
            title: "Segni e Significati",
            resources: {
              lectureSlide: "Segni_Significati_Slides.pdf",
              studentNotes: "Segni_Significati_Appunti.pdf",
              audio_lezione: "Introduzione alla Semiotica"
            },
            lessonDate: "2023-10-03",
            estimatedStudyHours: 3,
            conceptMap: {
              nodes: [
                { id: "sg1", label: "Segno", x: 360, y: 240, connections: ["sg2","sg3"], title: "Segno", description: "Relazione tra significante e significato.", badges: ["core"], attachments: [] },
                { id: "sg2", label: "Denotazione", x: 520, y: 200, connections: ["sg1"], title: "Denotazione", description: "Significato esplicito e letterale.", badges: ["concetto"], attachments: [] },
                { id: "sg3", label: "Connotazione", x: 200, y: 300, connections: ["sg1"], title: "Connotazione", description: "Significato culturale e implicito.", badges: ["concetto"], attachments: [] }
              ],
              isAIGenerated: true,
              lastModified: "2025-11-25"
            },
            attended: false
          }
        ]
      }
    ],
    additionalResources: {
      youtubeVideos: [
        "Introduzione alla Semiotica Visiva – lecture",
        "Roland Barthes e l'Immagine – analisi"
      ],
      articles: [
        "La Retorica dell'Immagine - Barthes",
        "Semiotica e Design Visivo"
      ],
      assignments: [
        "Compito 1: Analisi Semiotica Pubblicità",
        "Compito 2: Studio Iconografico"
      ],
      quizzes: [
        "Quiz 1: Fondamenti di Semiotica",
        "Quiz 2: Teoria dei Segni"
      ]
    },
    examSessions: [
      { date: "2023-12-17", time: "11:00", location: "Aula B205", type: "scritto" }
    ],
    courseConceptMap: {
      nodes: [
        { id: "1", label: "Semiotica Visiva", title: "Nodo centrale", description: "Teoria dei segni applicata all'immagine.", x: 420, y: 260, connections: ["2","3","4"], badges: ["corso"], attachments: [{ id: "sem-syl-1", name: "Syllabus_Semiotica.pdf", url: "/assets/semiotica_syllabus.pdf" }] },
        { id: "2", label: "Fondamenti", title: "Fondamenti di Semiotica", description: "Concetti base: Peirce, Saussure.", x: 180, y: 260, connections: ["1"], badges: ["modulo"], attachments: [] },
        { id: "3", label: "Analisi Testo Visivo", title: "Analisi", description: "Tecniche per leggere immagini complesse.", x: 600, y: 220, connections: ["1"], badges: ["modulo"], attachments: [] },
        { id: "4", label: "Cultura Visiva", title: "Cultura Visiva Contemporanea", description: "Iconografia e iconologia moderne.", x: 600, y: 320, connections: ["1"], badges: ["modulo"], attachments: [] }
      ],
      isAIGenerated: true,
      lastModified: "2025-12-03"
    }
  },

  // Matematica (semplificato, ma con mappe valorizzate)
  {
    id: "mat104",
    title: "Analisi e complementi di matematica",
    code: "MAT304",
    instructor: "Prof. Mario Lauria",
    color: "bg-orange-500",
    nextClass: "Gio, 9:00",
    attendance: 24,
    totalClasses: 29,
    modules: [
      {
        id: "mod10",
        title: "Analisi Matematica",
        topics: [
          {
            id: "topic19",
            title: "Limiti e Continuità",
            resources: {
              lectureSlide: "Limiti_Continuita_Slides.pdf",
              studentNotes: "Limiti_Continuita_Appunti.pdf",
              audio_lezione: "Fondamenti di Analisi"
            },
            lessonDate: "2023-10-04",
            estimatedStudyHours: 3,
            conceptMap: {
              nodes: [
                { id: "lm1", label: "Limite", x: 360, y: 240, connections: ["lm2"], title: "Limite", description: "Concetto di limite e comportamento locale.", badges: ["math"], attachments: [] },
                { id: "lm2", label: "Continuità", x: 520, y: 240, connections: ["lm1"], title: "Continuità", description: "Definizione formale e proprietà.", badges: ["math"], attachments: [] }
              ],
              isAIGenerated: true,
              lastModified: "2025-10-04"
            },
            attended: false
          }
        ]
      }
    ],
    additionalResources: {
      youtubeVideos: ["Analisi Matematica 1 - lezioni", "Calcolo Differenziale - esercizi"],
      articles: ["Teoremi Fondamentali dell'Analisi", "Applicazioni dell'Algebra Lineare"],
      assignments: ["Compito 1: Esercizi su Limiti", "Compito 2: Problemi di Derivazione"],
      quizzes: ["Quiz 1: Limiti e Continuità"]
    },
    examSessions: [
      { date: "2023-12-18", time: "9:00", location: "Aula A101", type: "scritto" }
    ],
    courseConceptMap: {
      nodes: [
        { id: "1", label: "Analisi", title: "Analisi Matematica", description: "Nucleo del corso: limiti, derivate, integrali.", x: 420, y: 260, connections: ["2","3","4"], badges: ["corso"], attachments: [{ id: "mat-syl-1", name: "Syllabus_Matematica.pdf", url: "/assets/matematica_syllabus.pdf" }] },
        { id: "2", label: "Limiti", title: "Limiti e Continuità", description: "Concetti fondamentali di limite.", x: 220, y: 220, connections: ["1"], badges: ["modulo"], attachments: [] },
        { id: "3", label: "Derivate", title: "Derivate e Applicazioni", description: "Tecniche e applicazioni ai problemi reali.", x: 600, y: 200, connections: ["1"], badges: ["modulo"], attachments: [] },
        { id: "4", label: "Integrali", title: "Integrali", description: "Calcolo integrale e applicazioni.", x: 600, y: 320, connections: ["1"], badges: ["modulo"], attachments: [] }
      ],
      isAIGenerated: true,
      lastModified: "2025-12-04"
    }
  }
];