import React, { useState, useEffect } from "react";
import { UserProfile, StudyTopic, Flashcard } from "./types";
import { INITIAL_TOPICS, DISCIPLINE_TOPICS } from "./data/initialTopics";
import { getSectorForDiscipline } from "./data/sectorsData";
import DashboardModule from "./components/DashboardModule";
import SyllabusModule from "./components/SyllabusModule";
import SimulatorModule from "./components/SimulatorModule";
import MentorChatModule from "./components/MentorChatModule";
import OnboardingModule from "./components/OnboardingModule";
import DnaModule from "./components/DnaModule";
import FlashcardsModal from "./components/FlashcardsModal";
import FlashcardsModule from "./components/FlashcardsModule";
import { 
  GraduationCap, 
  LayoutDashboard, 
  HelpCircle, 
  MessageSquare, 
  Settings, 
  Sparkles, 
  Flame, 
  ChevronRight,
  BookOpen,
  Info,
  Sliders,
  CheckCircle,
  Clock,
  Fingerprint,
  CheckSquare,
  ChevronDown,
  Calendar,
  Layers,
  Image,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { auth, googleAuthProvider } from "./lib/firebase.ts";

export default function App() {
  // Authentication & Cloud SQL Syncing States
  const [user, setUser] = useState<User | null>(null);
  const [syncLoading, setSyncLoading] = useState<boolean>(true);
  const [syncingStatus, setSyncingStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");

  // Application Onboarding State
  const [onboarded, setOnboarded] = useState<boolean>(() => {
    return localStorage.getItem("ia_aprova_onboarded") === "true";
  });

  // Flashcards state and handlers
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem("ia_aprova_flashcards_v1");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("ia_aprova_flashcards_v1", JSON.stringify(flashcards));
  }, [flashcards]);

  const handleSaveFlashcard = (flashcardData: Omit<Flashcard, "id" | "createdAt">) => {
    const newFlashcard: Flashcard = {
      ...flashcardData,
      id: `fc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    setFlashcards(prev => {
      if (prev.some(f => f.topic === flashcardData.topic && f.front === flashcardData.front)) {
        return prev;
      }
      return [newFlashcard, ...prev];
    });
  };

  const handleDeleteFlashcard = (id: string) => {
    setFlashcards(prev => prev.filter(f => f.id !== id));
  };

  // Application State
  const [activeModule, setActiveModule] = useState<string>("dashboard");
  const [topics, setTopics] = useState<StudyTopic[]>(() => {
    const saved = localStorage.getItem("ia_aprova_topics_v4");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_TOPICS;
  });

  const [currentTopic, setCurrentTopic] = useState<string>("Legislação Educacional Geral e Didática");
  const [confirmReset, setConfirmReset] = useState(false);

  const handleResetAllData = () => {
    localStorage.removeItem("ia_aprova_onboarded");
    localStorage.removeItem("ia_aprova_profile");
    localStorage.removeItem("ia_aprova_topics_v4");
    localStorage.removeItem("ia_aprova_flashcards_v1");
    localStorage.removeItem("ia_aprova_completed_days");
    localStorage.removeItem("ia_aprova_custom_schedule_v5");
    localStorage.removeItem("ia_aprova_has_customized_schedule");

    setFlashcards([]);
    setTopics(INITIAL_TOPICS);
    setBanca("FUNECE");
    setDiscipline("Matemática");
    setExamDate("2026-09-26");
    setSquareLogo("");
    setRectangularLogo("");
    setEditalText("Edital oficial SEDUC-CE de 2026. Prioriza LDB atualizada, Plano Nacional de Educação, Estatuto do Magistério do Ceará, Didática Geral, metodologias ativas e avaliação formativa.");
    
    const todayStr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
    setProfile({
      discipline: "Matemática",
      banca: "FUNECE",
      studyHours: 3,
      level: "intermediate",
      streak: 1,
      totalQuestions: 0,
      totalCorrect: 0,
      totalSeconds: 0,
      examDate: "2026-09-26",
      studyStartDate: todayStr,
      history: []
    });
    setConfirmReset(false);
    setOnboarded(false);
    setActiveModule("dashboard");
  };

  useEffect(() => {
    localStorage.setItem("ia_aprova_topics_v4", JSON.stringify(topics));
  }, [topics]);
  
  // Custom target variables (allows scaling / swapping edital instantly)
  const [concurso, setConcurso] = useState<string>("Professor - Rede Estadual do Ceará 2026");

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("ia_aprova_profile");
    const todayStr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.examDate && !parsed.studyStartDate) {
          // Default to current date
          parsed.studyStartDate = todayStr;
          localStorage.setItem("ia_aprova_profile", JSON.stringify(parsed));
        }
        if (!parsed.history || parsed.history.length === 0) {
          parsed.history = [
            { date: "07/07", score: 4, total: 6, topic: "Didática Geral" },
            { date: "08/07", score: 5, total: 7, topic: "LDB e LRF" },
            { date: "09/07", score: 6, total: 8, topic: "Estatuto do Magistério" },
            { date: "10/07", score: 7, total: 9, topic: "Metodologias Ativas" },
            { date: "11/07", score: 10, total: 12, topic: "Língua Portuguesa" }
          ];
        }
        return parsed;
      } catch (e) {}
    }
    return {
      discipline: "Matemática",
      banca: "FUNECE",
      studyHours: 3,
      level: "intermediate",
      streak: 3,
      totalQuestions: 14,
      totalCorrect: 10,
      totalSeconds: 2400,
      examDate: "2026-09-26",
      studyStartDate: todayStr,
      history: [
        { date: "07/07", score: 4, total: 6, topic: "Didática Geral" },
        { date: "08/07", score: 5, total: 7, topic: "LDB e LRF" },
        { date: "09/07", score: 6, total: 8, topic: "Estatuto do Magistério" },
        { date: "10/07", score: 7, total: 9, topic: "Metodologias Ativas" },
        { date: "11/07", score: 10, total: 12, topic: "Língua Portuguesa" }
      ]
    };
  });

  const [banca, setBanca] = useState<string>(() => {
    const saved = localStorage.getItem("ia_aprova_profile");
    if (saved) {
      try {
        return JSON.parse(saved).banca || "FUNECE";
      } catch (e) {}
    }
    return "FUNECE";
  });

  const [discipline, setDiscipline] = useState<string>(() => {
    const saved = localStorage.getItem("ia_aprova_profile");
    if (saved) {
      try {
        return JSON.parse(saved).discipline || "Matemática";
      } catch (e) {}
    }
    return "Matemática";
  });

  const [examDate, setExamDate] = useState<string>(() => {
    const saved = localStorage.getItem("ia_aprova_profile");
    if (saved) {
      try {
        return JSON.parse(saved).examDate || "2026-09-26";
      } catch (e) {}
    }
    return "2026-09-26";
  });

  const [studyStartDate, setStudyStartDate] = useState<string>(() => {
    const saved = localStorage.getItem("ia_aprova_profile");
    if (saved) {
      try {
        const todayStr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
        return JSON.parse(saved).studyStartDate || todayStr;
      } catch (e) {}
    }
    const todayStr = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
    return todayStr;
  });

  const [squareLogo, setSquareLogo] = useState<string>(() => {
    const saved = localStorage.getItem("ia_aprova_profile");
    if (saved) {
      try {
        return JSON.parse(saved).squareLogo || "";
      } catch (e) {}
    }
    return "";
  });

  const [rectangularLogo, setRectangularLogo] = useState<string>(() => {
    const saved = localStorage.getItem("ia_aprova_profile");
    if (saved) {
      try {
        return JSON.parse(saved).rectangularLogo || "";
      } catch (e) {}
    }
    return "";
  });

  const [editalText, setEditalText] = useState<string>(
    "Edital oficial SEDUC-CE de 2026. Prioriza LDB atualizada, Plano Nacional de Educação, Estatuto do Magistério do Ceará, Didática Geral, metodologias ativas e avaliação formativa."
  );

  // Lifted States for Single Source of Truth
  const [completedDays, setCompletedDays] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("ia_aprova_completed_days");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {}
    return {
      "Segunda": false,
      "Terça": false,
      "Quarta": false,
      "Quinta": false,
      "Sexta": false,
      "Sábado": false,
      "Domingo": false
    };
  });

  const [completedDates, setCompletedDates] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("ia_aprova_completed_dates_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {}
    return {};
  });

  const [genSubtopicStatus, setGenSubtopicStatus] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("aprova_prof_general_subtopics_status");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [specSubtopicStatus, setSpecSubtopicStatus] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("aprova_prof_specific_subtopics_status");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [ptStatus, setPtStatus] = useState<Record<string, { theory: boolean; practice: boolean; summary: boolean; review: boolean }>>(() => {
    try {
      const saved = localStorage.getItem("aprova_prof_pt_status");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persist profile and onboarding states
  useEffect(() => {
    localStorage.setItem("ia_aprova_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("ia_aprova_onboarded", String(onboarded));
  }, [onboarded]);

  useEffect(() => {
    localStorage.setItem("ia_aprova_completed_days", JSON.stringify(completedDays));
  }, [completedDays]);

  useEffect(() => {
    localStorage.setItem("ia_aprova_completed_dates_v1", JSON.stringify(completedDates));
  }, [completedDates]);

  useEffect(() => {
    localStorage.setItem("aprova_prof_general_subtopics_status", JSON.stringify(genSubtopicStatus));
  }, [genSubtopicStatus]);

  useEffect(() => {
    localStorage.setItem("aprova_prof_specific_subtopics_status", JSON.stringify(specSubtopicStatus));
  }, [specSubtopicStatus]);

  useEffect(() => {
    localStorage.setItem("aprova_prof_pt_status", JSON.stringify(ptStatus));
  }, [ptStatus]);

  // Sync profile when variables change
  useEffect(() => {
    setProfile(prev => ({
      ...prev,
      discipline,
      banca,
      examDate,
      studyStartDate,
      squareLogo,
      rectangularLogo
    }));

    // Generate discipline topics dynamically
    const baseTopics = INITIAL_TOPICS.filter(t => t.category !== "especifico");
    
    const sector = getSectorForDiscipline(discipline);
    let specificList: string[] = [];
    if (profile && profile.hasEdital && profile.editalTopics && profile.editalTopics.length > 0) {
      specificList = profile.editalTopics;
    } else if (sector) {
      specificList = sector.points.map(pt => `Ponto ${pt.num}: ${pt.title}`);
    } else {
      specificList = DISCIPLINE_TOPICS[discipline] || DISCIPLINE_TOPICS["Geral / Outros"];
    }
    
    const mappedSpecifics: StudyTopic[] = specificList.map((spec, index) => ({
      id: `specific-${index}`,
      name: spec,
      category: "especifico", // Map to especifico category for custom dashboard and simulator filtering
      completed: false,
      confidence: null,
      questionsAnswered: 0,
      questionsCorrect: 0
    }));

    const freshList = [...baseTopics, ...mappedSpecifics];

    // Merge with saved topics to preserve progress
    const saved = localStorage.getItem("ia_aprova_topics_v4");
    if (saved) {
      try {
        const parsed: StudyTopic[] = JSON.parse(saved);
        const merged = freshList.map(fresh => {
          const matchingSaved = parsed.find(p => p.name === fresh.name);
          if (matchingSaved) {
            return {
              ...fresh,
              questionsAnswered: matchingSaved.questionsAnswered,
              questionsCorrect: matchingSaved.questionsCorrect,
              completed: matchingSaved.completed,
              confidence: matchingSaved.confidence
            };
          }
          return fresh;
        });
        setTopics(merged);
        return;
      } catch (e) {}
    }

    setTopics(freshList);
  }, [discipline, banca, examDate, studyStartDate, squareLogo, rectangularLogo, profile?.hasEdital, profile?.editalTopics]);

  const loadCloudStates = async (firebaseUser: User) => {
    try {
      setSyncingStatus("syncing");
      const idToken = await firebaseUser.getIdToken();
      const response = await fetch("/api/user/states", {
        headers: {
          "Authorization": `Bearer ${idToken}`,
        },
      });
      if (response.ok) {
        const { states } = await response.json();
        if (states && Object.keys(states).length > 0) {
          // Load cloud states into localStorage
          Object.entries(states).forEach(([key, val]) => {
            localStorage.setItem(key, val as string);
          });

          // Trigger local React states to update from localStorage
          const savedOnboarded = localStorage.getItem("ia_aprova_onboarded") === "true";
          const savedFlashcards = localStorage.getItem("ia_aprova_flashcards_v1");
          const savedTopics = localStorage.getItem("ia_aprova_topics_v4");
          const savedProfile = localStorage.getItem("ia_aprova_profile");
          const savedCompletedDays = localStorage.getItem("ia_aprova_completed_days");
          const savedCompletedDates = localStorage.getItem("ia_aprova_completed_dates_v1");
          const savedGenSubtopicStatus = localStorage.getItem("aprova_prof_general_subtopics_status");
          const savedSpecSubtopicStatus = localStorage.getItem("aprova_prof_specific_subtopics_status");
          const savedPtStatus = localStorage.getItem("aprova_prof_pt_status");

          if (savedOnboarded) setOnboarded(savedOnboarded);
          if (savedFlashcards) {
            try { setFlashcards(JSON.parse(savedFlashcards)); } catch {}
          }
          if (savedTopics) {
            try { setTopics(JSON.parse(savedTopics)); } catch {}
          }
          if (savedCompletedDays) {
            try { setCompletedDays(JSON.parse(savedCompletedDays)); } catch {}
          }
          if (savedCompletedDates) {
            try { setCompletedDates(JSON.parse(savedCompletedDates)); } catch {}
          }
          if (savedGenSubtopicStatus) {
            try { setGenSubtopicStatus(JSON.parse(savedGenSubtopicStatus)); } catch {}
          }
          if (savedSpecSubtopicStatus) {
            try { setSpecSubtopicStatus(JSON.parse(savedSpecSubtopicStatus)); } catch {}
          }
          if (savedPtStatus) {
            try { setPtStatus(JSON.parse(savedPtStatus)); } catch {}
          }
          if (savedProfile) {
            try {
              const parsed = JSON.parse(savedProfile);
              setProfile(parsed);
              if (parsed.discipline) setDiscipline(parsed.discipline);
              if (parsed.banca) setBanca(parsed.banca);
              if (parsed.examDate) setExamDate(parsed.examDate);
              if (parsed.studyStartDate) setStudyStartDate(parsed.studyStartDate);
              if (parsed.squareLogo) setSquareLogo(parsed.squareLogo);
              if (parsed.rectangularLogo) setRectangularLogo(parsed.rectangularLogo);
            } catch {}
          }
          
          // Let subtopics reload
          window.dispatchEvent(new Event("storage"));
          setSyncingStatus("success");
          setTimeout(() => setSyncingStatus("idle"), 2500);
        } else {
          // Push existing local storage states to database (initial sync)
          await pushLocalToCloud(firebaseUser);
        }
      } else {
        setSyncingStatus("error");
      }
    } catch (err) {
      console.error("Load cloud states error:", err);
      setSyncingStatus("error");
    } finally {
      setSyncLoading(false);
    }
  };

  const pushLocalToCloud = async (firebaseUser: User) => {
    try {
      setSyncingStatus("syncing");
      const idToken = await firebaseUser.getIdToken();
      const statesToPush: { key: string; value: string }[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith("ia_aprova_") || key.startsWith("aprova_prof_") || key.startsWith("aprova_"))) {
          const value = localStorage.getItem(key);
          if (value) {
            statesToPush.push({ key, value });
          }
        }
      }

      if (statesToPush.length > 0) {
        const response = await fetch("/api/user/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`,
          },
          body: JSON.stringify({ states: statesToPush }),
        });
        if (response.ok) {
          setSyncingStatus("success");
          setTimeout(() => setSyncingStatus("idle"), 2500);
        } else {
          setSyncingStatus("error");
        }
      } else {
        setSyncingStatus("success");
        setTimeout(() => setSyncingStatus("idle"), 2500);
      }
    } catch (err) {
      console.error("Push local states error:", err);
      setSyncingStatus("error");
    }
  };

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${idToken}`,
            },
          });
          if (response.ok) {
            await loadCloudStates(firebaseUser);
          } else {
            console.error("Failed to register user on backend.");
          }
        } catch (err) {
          console.error("Auth sync register error:", err);
        }
      } else {
        setSyncLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Auto-sync trigger
  useEffect(() => {
    if (!user) return;

    const syncTimer = setTimeout(async () => {
      try {
        setSyncingStatus("syncing");
        const idToken = await user.getIdToken();
        const statesToPush: { key: string; value: string }[] = [];
        
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith("ia_aprova_") || key.startsWith("aprova_prof_") || key.startsWith("aprova_"))) {
            const value = localStorage.getItem(key);
            if (value) {
              statesToPush.push({ key, value });
            }
          }
        }

        if (statesToPush.length > 0) {
          const response = await fetch("/api/user/sync", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${idToken}`,
            },
            body: JSON.stringify({ states: statesToPush }),
          });
          if (response.ok) {
            setSyncingStatus("success");
            setTimeout(() => setSyncingStatus("idle"), 2000);
          } else {
            setSyncingStatus("error");
          }
        }
      } catch (err) {
        console.error("Auto sync update error:", err);
        setSyncingStatus("error");
      }
    }, 1500); // 1.5s debounce

    return () => clearTimeout(syncTimer);
  }, [user, profile, topics, flashcards, onboarded, activeModule, completedDays, completedDates, genSubtopicStatus, specSubtopicStatus, ptStatus]);

  const handleSquareLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSquareLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRectangularLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRectangularLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnswerRecorded = (category: string, isCorrect: boolean, timeSpent: number, topicName?: string) => {
    const targetTopicName = topicName || currentTopic;
    
    setProfile((prev) => {
      const todayStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      const currentHistory = prev.history ? [...prev.history] : [];
      const lastEntry = currentHistory[currentHistory.length - 1];
      
      if (lastEntry && lastEntry.date === todayStr) {
        currentHistory[currentHistory.length - 1] = {
          ...lastEntry,
          score: lastEntry.score + (isCorrect ? 1 : 0),
          total: lastEntry.total + 1,
          topic: targetTopicName || lastEntry.topic
        };
      } else {
        currentHistory.push({
          date: todayStr,
          score: (isCorrect ? 1 : 0),
          total: 1,
          topic: targetTopicName || "Geral"
        });
      }

      return {
        ...prev,
        totalQuestions: prev.totalQuestions + 1,
        totalCorrect: prev.totalCorrect + (isCorrect ? 1 : 0),
        totalSeconds: prev.totalSeconds + timeSpent,
        streak: isCorrect ? prev.streak + (prev.totalQuestions % 5 === 0 ? 1 : 0) : prev.streak,
        history: currentHistory
      };
    });

    // Update topic questions tally
    setTopics((prevTopics) => {
      const hasExactMatch = prevTopics.some((t) => t.name === targetTopicName);
      if (hasExactMatch) {
        return prevTopics.map((topic) => {
          if (topic.name === targetTopicName) {
            const answered = topic.questionsAnswered + 1;
            const correct = topic.questionsCorrect + (isCorrect ? 1 : 0);
            return {
              ...topic,
              questionsAnswered: answered,
              questionsCorrect: correct,
              completed: correct >= 1 // mark completed if scored at least 1 correct
            };
          }
          return topic;
        });
      } else {
        // Fallback: update the first topic of the given category so category-level charts always update
        let updated = false;
        return prevTopics.map((topic) => {
          if (topic.category === category && !updated) {
            updated = true;
            const answered = topic.questionsAnswered + 1;
            const correct = topic.questionsCorrect + (isCorrect ? 1 : 0);
            return {
              ...topic,
              questionsAnswered: answered,
              questionsCorrect: correct,
              completed: correct >= 1
            };
          }
          return topic;
        });
      }
    });
  };

  const handleUpdateTopicStats = (topicId: string, deltaAnswered: number, deltaCorrect: number, toggleCompleted?: boolean) => {
    setTopics((prevTopics) => {
      return prevTopics.map((topic) => {
        if (topic.id === topicId) {
          const answered = Math.max(0, topic.questionsAnswered + deltaAnswered);
          const correct = Math.max(0, Math.min(answered, topic.questionsCorrect + deltaCorrect));
          const completed = toggleCompleted !== undefined ? !topic.completed : (answered > 0 && correct >= 1);
          return {
            ...topic,
            questionsAnswered: answered,
            questionsCorrect: correct,
            completed
          };
        }
        return topic;
      });
    });

    if (deltaAnswered !== 0 || deltaCorrect !== 0) {
      setProfile((prev) => ({
        ...prev,
        totalQuestions: Math.max(0, prev.totalQuestions + deltaAnswered),
        totalCorrect: Math.max(0, prev.totalCorrect + deltaCorrect)
      }));
    }
  };

  // If not onboarded, show Onboarding pre-registration screen
  if (!onboarded) {
    return (
      <OnboardingModule
        onComplete={(data) => {
          const startDt = data.studyStartDate || (data.examDate ? new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0] : undefined);
          const newProfile: UserProfile = {
            name: data.name,
            gender: data.gender,
            age: data.age,
            isTeacher: data.isTeacher,
            discipline: data.discipline,
            banca: "FUNECE",
            studyHours: data.studyHours,
            level: "intermediate",
            streak: 1,
            totalQuestions: 0,
            totalCorrect: 0,
            totalSeconds: 0,
            examDate: data.examDate,
            studyStartDate: startDt,
            hasEdital: data.hasEdital,
            editalFileName: data.editalFileName,
            editalTopics: data.editalTopics,
            history: [
              { date: "07/07", score: 4, total: 6, topic: "Didática Geral" },
              { date: "08/07", score: 5, total: 7, topic: "LDB e LRF" },
              { date: "09/07", score: 6, total: 8, topic: "Estatuto do Magistério" },
              { date: "10/07", score: 7, total: 9, topic: "Metodologias Ativas" },
              { date: "11/07", score: 10, total: 12, topic: "Língua Portuguesa" }
            ]
          };
          setProfile(newProfile);
          setDiscipline(data.discipline);
          if (data.examDate) {
            setExamDate(data.examDate);
          }
          if (startDt) {
            setStudyStartDate(startDt);
          }
          setOnboarded(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans antialiased">
      {/* Upper Brand Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xxs print:hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-tr from-emerald-600 to-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-md shadow-emerald-600/10 shrink-0 overflow-hidden">
                {squareLogo ? (
                  <img src={squareLogo} alt="Logo Quadrada" className="w-full h-full object-cover" />
                ) : (
                  <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8" />
                )}
              </div>
              <div className="min-w-0 flex flex-col justify-center">
                <h1 className="font-display font-extrabold text-slate-950 text-sm sm:text-base md:text-xl tracking-tight leading-none bg-gradient-to-r from-slate-950 to-slate-800 bg-clip-text text-transparent truncate">
                  Aprova Professor
                </h1>
                <p className="text-emerald-700 text-[10px] sm:text-xs font-extrabold tracking-wider uppercase mt-1">
                  SEDUC CE 2026
                </p>
              </div>
            </div>

            {/* Config & Stat Header badges + Dropdown Selector */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              {/* Stat badges (visible on desktop) */}
              <div className="hidden lg:flex items-center gap-3">
                <div className="bg-slate-50 border border-slate-100/50 rounded-xl px-3.5 py-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-semibold text-slate-600">
                    Disciplina: <span className="text-emerald-600 font-bold">{discipline}</span>
                  </span>
                </div>
                <div className="bg-slate-50 border border-slate-100/50 rounded-xl px-3.5 py-1.5 flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">
                    Banca: <span className="text-emerald-600 font-bold">{banca}</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-1.5">
                  <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{profile.streak} dias</span>
                </div>
                {user ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 rounded-xl px-3.5 py-1.5 shadow-xxs">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                    <span>Nuvem Ativa</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0"></span>
                    <span>Nuvem Inativa</span>
                  </div>
                )}
              </div>

              {/* Redesigned Sleek Primary Dropdown View Switcher */}
              <div className="relative">
                <select
                  id="module-switcher"
                  value={activeModule}
                  onChange={(e) => setActiveModule(e.target.value)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] sm:text-xs px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border-none shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer transition-all appearance-none pr-8 sm:pr-10"
                >
                  <option value="dashboard" className="text-slate-800 bg-white font-semibold">📊 Painel</option>
                  <option value="schedule" className="text-slate-800 bg-white font-semibold">📅 Cronograma</option>
                  <option value="syllabus" className="text-slate-800 bg-white font-semibold">📖 Guia Edital</option>
                  <option value="simulator" className="text-slate-800 bg-white font-semibold">📝 Simulador</option>
                  <option value="flashcards" className="text-slate-800 bg-white font-semibold">⚡ Flashcards</option>
                  <option value="chat" className="text-slate-800 bg-white font-semibold">💬 Mentor</option>
                  <option value="dna" className="text-slate-800 bg-white font-semibold">🧬 DNA Banca</option>
                  <option value="config" className="text-slate-800 bg-white font-semibold">⚙️ Ajustes</option>
                </select>
                <div className="absolute inset-y-0 right-2 sm:right-3 flex items-center pointer-events-none text-white">
                  <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-85" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
 
       {/* Main Container - Single Column Workspace with Right Widget Panel */}
       <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
         <div className="flex flex-col lg:flex-row gap-8">
           
          {/* Left Navigation Sidebar (Desktop-only, clean, stylish) */}
          <nav className="hidden lg:flex flex-col w-64 shrink-0 space-y-1 bg-white border border-slate-100 rounded-3xl p-4.5 shadow-xxs h-fit sticky top-20">
            <div className="flex items-center gap-2 px-3 pb-3 mb-2 border-b border-slate-50">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Navegação</span>
            </div>
            
            <button
              onClick={() => setActiveModule("dashboard")}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeModule === "dashboard"
                  ? "bg-emerald-50/60 text-emerald-800 border border-emerald-100/30 font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50 border border-transparent"
              }`}
            >
              <LayoutDashboard className="w-4.5 h-4.5 text-emerald-600" />
              Painel de Controle
            </button>

            <button
              onClick={() => setActiveModule("schedule")}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeModule === "schedule"
                  ? "bg-emerald-50/60 text-emerald-800 border border-emerald-100/30 font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50 border border-transparent"
              }`}
            >
              <Calendar className="w-4.5 h-4.5 text-emerald-600" />
              Cronograma de Estudos
            </button>

            <button
              onClick={() => setActiveModule("syllabus")}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeModule === "syllabus"
                  ? "bg-emerald-50/60 text-emerald-800 border border-emerald-100/30 font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50 border border-transparent"
              }`}
            >
              <BookOpen className="w-4.5 h-4.5 text-emerald-600" />
              Guia do Edital
            </button>

            <button
              onClick={() => setActiveModule("simulator")}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeModule === "simulator"
                  ? "bg-emerald-50/60 text-emerald-800 border border-emerald-100/30 font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50 border border-transparent"
              }`}
            >
              <HelpCircle className="w-4.5 h-4.5 text-emerald-600" />
              Simulador de Provas
            </button>

            <button
              onClick={() => setActiveModule("flashcards")}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeModule === "flashcards"
                  ? "bg-emerald-50/60 text-emerald-800 border border-emerald-100/30 font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50 border border-transparent"
              }`}
            >
              <Layers className="w-4.5 h-4.5 text-emerald-600" />
              Estudar Flashcards
            </button>

            <button
              onClick={() => setActiveModule("chat")}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeModule === "chat"
                  ? "bg-emerald-50/60 text-emerald-800 border border-emerald-100/30 font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50 border border-transparent"
              }`}
            >
              <MessageSquare className="w-4.5 h-4.5 text-emerald-600" />
              Professor Mentor
            </button>

            <button
              onClick={() => setActiveModule("dna")}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeModule === "dna"
                  ? "bg-emerald-50/60 text-emerald-800 border border-emerald-100/30 font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50 border border-transparent"
              }`}
            >
              <Fingerprint className="w-4.5 h-4.5 text-emerald-600" />
              DNA da Banca
            </button>

            <button
              onClick={() => setActiveModule("config")}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeModule === "config"
                  ? "bg-emerald-50/60 text-emerald-800 border border-emerald-100/30 font-extrabold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/50 border border-transparent"
              }`}
            >
              <Settings className="w-4.5 h-4.5 text-emerald-600" />
              Ajustar Edital
            </button>

            {/* Auto Save Local Storage Widget */}
            <div className="mt-6 border-t border-slate-100 pt-5">
              <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-mono text-emerald-800 uppercase tracking-widest font-extrabold">Salvo Automaticamente</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                  Seus simulados, cronograma e edital são armazenados localmente no dispositivo. Acesso livre e sem necessidade de login.
                </p>
              </div>
            </div>
          </nav>

           {/* Main Content Column */}
           <main className="flex-1 min-w-0">
             <div className="min-h-[60vh]">
               <AnimatePresence mode="wait">
                {(activeModule === "dashboard" || activeModule === "schedule") && (
                  <motion.div
                    key="dashboard-group"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <DashboardModule
                      profile={profile}
                      topics={topics}
                      onChangeModule={setActiveModule}
                      onTopicClick={setCurrentTopic}
                      onUpdateTopicStats={handleUpdateTopicStats}
                      activeTab={activeModule === "schedule" ? "schedule" : "mapping"}
                      setActiveTab={(tab) => {
                        if (tab === "schedule") {
                          setActiveModule("schedule");
                        } else {
                          setActiveModule("dashboard");
                        }
                      }}
                      flashcards={flashcards}
                      onOpenFlashcards={() => setActiveModule("flashcards")}
                      completedDays={completedDays}
                      setCompletedDays={setCompletedDays}
                      completedDates={completedDates}
                      setCompletedDates={setCompletedDates}
                    />
                  </motion.div>
                )}

                {activeModule === "flashcards" && (
                  <motion.div
                    key="flashcards"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <FlashcardsModule
                      flashcards={flashcards}
                      onDeleteFlashcard={handleDeleteFlashcard}
                      topics={topics}
                      onPracticeTopic={(topicName) => {
                        setCurrentTopic(topicName);
                        setActiveModule("simulator");
                      }}
                    />
                  </motion.div>
                )}

                {activeModule === "syllabus" && (
                  <motion.div
                    key="syllabus"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <SyllabusModule 
                      profile={profile} 
                      onChangeModule={setActiveModule}
                      onTopicClick={setCurrentTopic}
                      genSubtopicStatus={genSubtopicStatus}
                      setGenSubtopicStatus={setGenSubtopicStatus}
                      specSubtopicStatus={specSubtopicStatus}
                      setSpecSubtopicStatus={setSpecSubtopicStatus}
                      ptStatus={ptStatus}
                      setPtStatus={setPtStatus}
                    />
                  </motion.div>
                )}

                {activeModule === "simulator" && (
                  <motion.div
                    key="simulator"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <SimulatorModule
                      profile={profile}
                      topics={topics}
                      onAnswerRecorded={handleAnswerRecorded}
                      currentTopic={currentTopic}
                      setCurrentTopic={setCurrentTopic}
                      flashcards={flashcards}
                      onSaveFlashcard={handleSaveFlashcard}
                      onOpenFlashcards={() => setActiveModule("flashcards")}
                    />
                  </motion.div>
                )}

                {activeModule === "chat" && (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <MentorChatModule
                      profile={profile}
                      currentTopic={currentTopic}
                      topics={topics}
                      completedDays={completedDays}
                      completedDates={completedDates}
                      genSubtopicStatus={genSubtopicStatus}
                      specSubtopicStatus={specSubtopicStatus}
                    />
                  </motion.div>
                )}

                {activeModule === "dna" && (
                  <motion.div
                    key="dna"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <DnaModule discipline={discipline} banca={banca} />
                  </motion.div>
                )}

                {activeModule === "config" && (
                  <motion.div
                    key="config"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-xs space-y-6"
                  >
                    <div className="border-b border-slate-50 pb-4">
                      <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Sliders className="w-5 h-5 text-emerald-600" />
                        Customização de Escala (White-Label)
                      </h3>
                      <p className="text-slate-400 text-xs mt-1">
                        Como sugerido, você pode modificar o escopo do edital e a disciplina do candidato para mudar dinamicamente as respostas do Professor Mentor e do gerador de simulados.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          Concurso Alvo / Campanha
                        </label>
                        <input
                          type="text"
                          value={concurso}
                          onChange={(e) => setConcurso(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 focus:border-emerald-500 rounded-xl p-3 text-sm text-slate-700 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Banca Organizadora
                          </label>
                          <select
                            value={banca}
                            onChange={(e) => setBanca(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 focus:border-emerald-500 rounded-xl p-3 text-sm text-slate-700 focus:outline-none"
                          >
                            <option value="FUNECE">FUNECE (Fundação UECE)</option>
                            <option value="IDECAN">IDECAN (Oficial Seduc-CE)</option>
                            <option value="CESPE / Cebraspe">CESPE / Cebraspe</option>
                            <option value="FGV">FGV</option>
                            <option value="FCC">FCC</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Disciplina do Candidato
                          </label>
                          <select
                            value={discipline}
                            onChange={(e) => setDiscipline(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 focus:border-emerald-500 rounded-xl p-3 text-sm text-slate-700 focus:outline-none"
                          >
                            <option value="Sociologia">Sociologia</option>
                            <option value="Matemática">Matemática</option>
                            <option value="História">História</option>
                            <option value="Língua Portuguesa">Língua Portuguesa</option>
                            <option value="Biologia">Biologia</option>
                            <option value="Geografia">Geografia</option>
                            <option value="Geral / Outros">Geral / Outros</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Data de Início dos Estudos
                          </label>
                          <input
                            type="date"
                            value={studyStartDate}
                            onChange={(e) => setStudyStartDate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 focus:border-emerald-500 rounded-xl p-3 text-sm text-slate-700 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Data Prevista da Prova (Edital não publicado)
                          </label>
                          <input
                            type="date"
                            value={examDate}
                            onChange={(e) => setExamDate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 focus:border-emerald-500 rounded-xl p-3 text-sm text-slate-700 focus:outline-none"
                          />
                        </div>
                      </div>
                      <p className="text-slate-400 text-[10px] mt-1.5 leading-normal">
                        Como o edital oficial ainda não foi publicado, você pode estimar ou ajustar a data prevista da prova e a data de início de estudos. O sistema irá redistribuir as metas do seu cronograma de forma inteligente, proporcional e dinâmica dentro desse período.
                      </p>

                      {/* Upload de Logos */}
                      <div className="border-t border-slate-100 pt-5 mt-5">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                          <Image className="w-3.5 h-3.5 text-emerald-600" />
                          Logotipo do Sistema (Aprova Professor)
                        </h4>
                        <p className="text-slate-400 text-[10.5px] mb-4 leading-normal">
                          Adicione seu logotipo personalizado (quadrado ou ícone) para substituir o símbolo padrão da boina no cabeçalho do painel e no documento de impressão.
                        </p>
                        
                        <div className="max-w-xs">
                          {/* Logo Quadrada */}
                          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex flex-col justify-between min-h-[140px]">
                            <div>
                              <span className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">Logo Quadrada (1:1)</span>
                              <span className="block text-[9px] text-slate-400 mb-2">Recomendado: 120x120px (PNG ou JPG)</span>
                            </div>
                            
                            <div className="flex flex-col items-center justify-center flex-1">
                              {squareLogo ? (
                                <div className="relative group w-12 h-12 border border-slate-200 rounded-lg overflow-hidden bg-white">
                                  <img src={squareLogo} alt="Logo Quadrada" className="w-full h-full object-cover" />
                                  <button
                                    onClick={(e) => { e.preventDefault(); setSquareLogo(""); }}
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                    title="Excluir"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <label className="cursor-pointer border border-dashed border-slate-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/20 rounded-xl p-3 flex flex-col items-center gap-1.5 transition-colors w-full">
                                  <Image className="w-4 h-4 text-slate-400" />
                                  <span className="text-[10px] font-bold text-slate-600 text-center">Selecionar Logo</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleSquareLogoUpload}
                                    className="hidden"
                                  />
                                </label>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          Instruções do Edital Vigente
                        </label>
                        <textarea
                          rows={4}
                          value={editalText}
                          onChange={(e) => setEditalText(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 focus:border-emerald-500 rounded-xl p-3 text-sm text-slate-700 focus:outline-none resize-none"
                        />
                      </div>

                      <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-xl p-4 flex gap-3">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold">Configurações Atualizadas!</h4>
                          <p className="mt-0.5 leading-normal">
                            O Professor Mentor agora está calibrado para simular o estilo de cobrança específico de <strong>{banca}</strong> com foco pedagógico em <strong>{discipline}</strong>.
                          </p>
                        </div>
                      </div>

                      {/* Área de Perigo / Redefinição Geral */}
                      <div className="border-t border-rose-100 pt-5 mt-5">
                        <h4 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          Área de Perigo: Começar do Zero
                        </h4>
                        <p className="text-slate-400 text-[10.5px] mb-3 leading-normal">
                          Se você deseja apagar todo o seu progresso, histórico de simulados, flashcards, conversas com o mentor e gerar um <strong>novo cronograma personalizado</strong> com outras datas ou disciplinas, clique no botão abaixo para reiniciar o onboarding.
                        </p>
                        
                        {!confirmReset ? (
                          <button
                            type="button"
                            onClick={() => setConfirmReset(true)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Apagar tudo e Começar do Zero
                          </button>
                        ) : (
                          <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 space-y-3">
                            <p className="text-rose-800 text-[11px] font-medium leading-normal">
                              ⚠️ <strong>Atenção:</strong> Esta ação é irreversível. Todas as suas estatísticas de estudo e o calendário atual serão excluídos para iniciar a tela de onboarding novamente.
                            </p>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={handleResetAllData}
                                className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-3 rounded-lg text-xs transition-all cursor-pointer animate-pulse"
                              >
                                Sim, apagar tudo e reiniciar
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmReset(false)}
                                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 px-3 rounded-lg text-xs transition-all cursor-pointer"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => setActiveModule("dashboard")}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all text-center block"
                      >
                        Voltar ao Painel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>

      <FlashcardsModal
        isOpen={isFlashcardModalOpen}
        onClose={() => setIsFlashcardModalOpen(false)}
        flashcards={flashcards}
        onDeleteFlashcard={handleDeleteFlashcard}
        topics={topics}
        onPracticeTopic={(topicName) => {
          setCurrentTopic(topicName);
          setActiveModule("simulator");
        }}
      />

      {/* Aesthetic Footer */}
      <footer className="border-t border-slate-100 bg-white mt-12 py-8 text-center text-slate-400 text-xs">
        <p className="font-display font-medium text-slate-500">Aprova Professor • Rede Estadual do Ceará 2026</p>
        <p className="text-xxs mt-1 text-slate-400">Desenvolvido com diretrizes de Neurociência Cognitiva e Metodologias de Aprendizagem Ativa.</p>
      </footer>
    </div>
  );
}
