"use client";

import * as React from "react";
import { AIRDROP_PROJECTS } from "@/data/airdrops";
import { AirdropProject } from "@/types/airdrop";

interface CustomTask {
  id: string;
  projectId: string;
  title: string;
  txHash?: string;
  completed: boolean;
  createdAt: string;
}

interface UserWallet {
  id: string;
  label: string;
  address: string;
}

export interface LiveMarketData {
  prices: {
    btc: number;
    eth: number;
    sol: number;
  };
  tvlMap: Record<string, number>;
  updatedAt: string;
}

interface AirdropContextType {
  projects: AirdropProject[];
  trackedProjectIds: string[];
  toggleTrackProject: (projectId: string) => void;
  isProjectTracked: (projectId: string) => boolean;
  
  // Custom Project Management (Add / Edit / Delete)
  customProjects: AirdropProject[];
  addProject: (project: Omit<AirdropProject, "id" | "isUserCustom">) => void;
  updateProject: (project: AirdropProject) => void;
  deleteProject: (projectId: string) => void;

  // Live Market Data (DeFiLlama)
  liveData: LiveMarketData | null;
  isLiveLoading: boolean;
  refreshLiveData: () => Promise<void>;
  
  // Milestone Task completions
  completedMilestones: Record<string, string[]>;
  toggleMilestoneTask: (projectId: string, taskId: string) => void;
  isMilestoneCompleted: (projectId: string, taskId: string) => boolean;
  
  // Daily Task completions (stored by current UTC date YYYY-MM-DD)
  completedDailyTasks: Record<string, boolean>;
  toggleDailyTask: (taskId: string) => void;
  isDailyTaskCompleted: (taskId: string) => boolean;
  getDailyCompletionRate: () => { completed: number; total: number; percentage: number };
  
  // Custom user tasks & tx notes
  customTasks: CustomTask[];
  addCustomTask: (projectId: string, title: string, txHash?: string) => void;
  toggleCustomTask: (taskId: string) => void;
  deleteCustomTask: (taskId: string) => void;

  // Wallet Management
  wallets: UserWallet[];
  addWallet: (label: string, address: string) => void;
  deleteWallet: (walletId: string) => void;

  // Backup & Restore
  exportBackupJson: () => string;
  importBackupJson: (jsonData: string) => boolean;
  resetToDefaults: () => void;
}

const STORAGE_KEY = "airdrop_viewer_user_state_v1";

const AirdropContext = React.createContext<AirdropContextType | undefined>(undefined);

function getUtcDateKey(): string {
  const now = new Date();
  return now.toISOString().split("T")[0]; // YYYY-MM-DD in UTC
}

export const AirdropProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [baseProjects] = React.useState<AirdropProject[]>(AIRDROP_PROJECTS);
  const [customProjects, setCustomProjects] = React.useState<AirdropProject[]>([]);
  
  // Live market data
  const [liveData, setLiveData] = React.useState<LiveMarketData | null>(null);
  const [isLiveLoading, setIsLiveLoading] = React.useState(false);

  // Default tracked projects for first run: Monad, Berachain, Story Protocol
  const [trackedProjectIds, setTrackedProjectIds] = React.useState<string[]>([
    "monad",
    "berachain",
    "story-protocol",
  ]);
  const [completedMilestones, setCompletedMilestones] = React.useState<Record<string, string[]>>({
    monad: ["monad-rpc", "monad-faucet"],
    berachain: ["bera-faucet"],
  });
  const [completedDailyTasks, setCompletedDailyTasks] = React.useState<Record<string, boolean>>({});
  const [customTasks, setCustomTasks] = React.useState<CustomTask[]>([]);
  const [wallets, setWallets] = React.useState<UserWallet[]>([
    { id: "w-1", label: "Main Farming EVM", address: "0x71C...49b2" },
  ]);

  // Fetch live market data from /api/live-data
  const fetchLiveData = React.useCallback(async () => {
    setIsLiveLoading(true);
    try {
      const allSlugs = new Set(
        [...baseProjects, ...customProjects]
          .map((p) => p.defiLlamaSlug)
          .filter(Boolean) as string[]
      );
      const query = allSlugs.size > 0 ? `?slugs=${Array.from(allSlugs).join(",")}` : "";
      const res = await fetch(`/api/live-data${query}`);
      if (res.ok) {
        const data = await res.json();
        setLiveData(data);
      }
    } catch (e) {
      console.warn("Could not fetch live market data:", e);
    } finally {
      setIsLiveLoading(false);
    }
  }, [baseProjects, customProjects]);

  // Fetch live market data on initial load
  React.useEffect(() => {
    fetchLiveData();
  }, [fetchLiveData]);

  // Load state from localStorage on initial client mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.customProjects) setCustomProjects(parsed.customProjects);
        if (parsed.trackedProjectIds) setTrackedProjectIds(parsed.trackedProjectIds);
        if (parsed.completedMilestones) setCompletedMilestones(parsed.completedMilestones);
        if (parsed.completedDailyTasks) setCompletedDailyTasks(parsed.completedDailyTasks);
        if (parsed.customTasks) setCustomTasks(parsed.customTasks);
        if (parsed.wallets) setWallets(parsed.wallets);
      }
    } catch (e) {
      console.warn("Failed to read user state from localStorage:", e);
    }
  }, []);

  // Sync state to localStorage
  const saveState = React.useCallback(
    (
      newCustomProjects: AirdropProject[],
      newTracked: string[],
      newMilestones: Record<string, string[]>,
      newDaily: Record<string, boolean>,
      newCustom: CustomTask[],
      newWallets: UserWallet[]
    ) => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            customProjects: newCustomProjects,
            trackedProjectIds: newTracked,
            completedMilestones: newMilestones,
            completedDailyTasks: newDaily,
            customTasks: newCustom,
            wallets: newWallets,
            updatedAt: new Date().toISOString(),
          })
        );
      } catch (e) {
        console.error("Failed to persist user state:", e);
      }
    },
    []
  );

  // Merged projects with live TVL injected
  const projects = React.useMemo(() => {
    // Map of custom projects to override base projects with same ID if any
    const customMap = new Map(customProjects.map((p) => [p.id, p]));
    const list: AirdropProject[] = [];

    // Add base projects (overridden if custom exists)
    baseProjects.forEach((bp) => {
      if (customMap.has(bp.id)) {
        list.push(customMap.get(bp.id)!);
        customMap.delete(bp.id);
      } else {
        list.push(bp);
      }
    });

    // Add remaining custom projects
    customMap.forEach((cp) => list.push(cp));

    // Inject live TVL from liveData if available
    return list.map((project) => {
      if (project.defiLlamaSlug && liveData?.tvlMap[project.defiLlamaSlug]) {
        return {
          ...project,
          liveTvlUsd: liveData.tvlMap[project.defiLlamaSlug],
        };
      }
      return project;
    });
  }, [baseProjects, customProjects, liveData]);

  // Add new custom project
  const addProject = (projectData: Omit<AirdropProject, "id" | "isUserCustom">) => {
    const slug = projectData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const id = "custom-" + Date.now();
    const newProject: AirdropProject = {
      ...projectData,
      id,
      slug,
      isUserCustom: true,
    };
    setCustomProjects((prev) => {
      const next = [newProject, ...prev];
      saveState(next, trackedProjectIds, completedMilestones, completedDailyTasks, customTasks, wallets);
      return next;
    });
  };

  // Update existing project
  const updateProject = (updated: AirdropProject) => {
    setCustomProjects((prev) => {
      const exists = prev.some((p) => p.id === updated.id);
      const next = exists
        ? prev.map((p) => (p.id === updated.id ? { ...updated, isUserCustom: true } : p))
        : [{ ...updated, isUserCustom: true }, ...prev];
      saveState(next, trackedProjectIds, completedMilestones, completedDailyTasks, customTasks, wallets);
      return next;
    });
  };

  // Delete project
  const deleteProject = (projectId: string) => {
    setCustomProjects((prev) => {
      const next = prev.filter((p) => p.id !== projectId);
      // Also remove from tracked if applicable
      const nextTracked = trackedProjectIds.filter((id) => id !== projectId);
      saveState(next, nextTracked, completedMilestones, completedDailyTasks, customTasks, wallets);
      return next;
    });
    setTrackedProjectIds((prev) => prev.filter((id) => id !== projectId));
  };

  const toggleTrackProject = (projectId: string) => {
    setTrackedProjectIds((prev) => {
      const next = prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId];
      saveState(customProjects, next, completedMilestones, completedDailyTasks, customTasks, wallets);
      return next;
    });
  };

  const isProjectTracked = (projectId: string) => trackedProjectIds.includes(projectId);

  const toggleMilestoneTask = (projectId: string, taskId: string) => {
    setCompletedMilestones((prev) => {
      const current = prev[projectId] || [];
      const updated = current.includes(taskId)
        ? current.filter((id) => id !== taskId)
        : [...current, taskId];
      const next = { ...prev, [projectId]: updated };
      saveState(customProjects, trackedProjectIds, next, completedDailyTasks, customTasks, wallets);
      return next;
    });
  };

  const isMilestoneCompleted = (projectId: string, taskId: string) => {
    const list = completedMilestones[projectId] || [];
    return list.includes(taskId);
  };

  const toggleDailyTask = (taskId: string) => {
    const today = getUtcDateKey();
    const key = `${today}_${taskId}`;
    setCompletedDailyTasks((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveState(customProjects, trackedProjectIds, completedMilestones, next, customTasks, wallets);
      return next;
    });
  };

  const isDailyTaskCompleted = (taskId: string) => {
    const today = getUtcDateKey();
    const key = `${today}_${taskId}`;
    return !!completedDailyTasks[key];
  };

  const getDailyCompletionRate = () => {
    const trackedProjects = projects.filter((p) => trackedProjectIds.includes(p.id));
    const allDailyTasks = trackedProjects.flatMap((p) => p.dailyTasks);
    if (allDailyTasks.length === 0) return { completed: 0, total: 0, percentage: 0 };
    const today = getUtcDateKey();
    let completed = 0;
    allDailyTasks.forEach((t) => {
      if (completedDailyTasks[`${today}_${t.id}`]) completed++;
    });
    return {
      completed,
      total: allDailyTasks.length,
      percentage: Math.round((completed / allDailyTasks.length) * 100),
    };
  };

  const addCustomTask = (projectId: string, title: string, txHash?: string) => {
    const newTask: CustomTask = {
      id: "task-" + Date.now(),
      projectId,
      title,
      txHash,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setCustomTasks((prev) => {
      const next = [newTask, ...prev];
      saveState(customProjects, trackedProjectIds, completedMilestones, completedDailyTasks, next, wallets);
      return next;
    });
  };

  const toggleCustomTask = (taskId: string) => {
    setCustomTasks((prev) => {
      const next = prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
      saveState(customProjects, trackedProjectIds, completedMilestones, completedDailyTasks, next, wallets);
      return next;
    });
  };

  const deleteCustomTask = (taskId: string) => {
    setCustomTasks((prev) => {
      const next = prev.filter((t) => t.id !== taskId);
      saveState(customProjects, trackedProjectIds, completedMilestones, completedDailyTasks, next, wallets);
      return next;
    });
  };

  const addWallet = (label: string, address: string) => {
    const newWallet: UserWallet = {
      id: "wallet-" + Date.now(),
      label,
      address,
    };
    setWallets((prev) => {
      const next = [...prev, newWallet];
      saveState(customProjects, trackedProjectIds, completedMilestones, completedDailyTasks, customTasks, next);
      return next;
    });
  };

  const deleteWallet = (walletId: string) => {
    setWallets((prev) => {
      const next = prev.filter((w) => w.id !== walletId);
      saveState(customProjects, trackedProjectIds, completedMilestones, completedDailyTasks, customTasks, next);
      return next;
    });
  };

  const exportBackupJson = () => {
    return JSON.stringify(
      {
        version: 1,
        exportedAt: new Date().toISOString(),
        customProjects,
        trackedProjectIds,
        completedMilestones,
        completedDailyTasks,
        customTasks,
        wallets,
      },
      null,
      2
    );
  };

  const importBackupJson = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed.trackedProjectIds)) {
        if (Array.isArray(parsed.customProjects)) setCustomProjects(parsed.customProjects);
        setTrackedProjectIds(parsed.trackedProjectIds);
        setCompletedMilestones(parsed.completedMilestones || {});
        setCompletedDailyTasks(parsed.completedDailyTasks || {});
        setCustomTasks(parsed.customTasks || []);
        setWallets(parsed.wallets || []);
        saveState(
          parsed.customProjects || [],
          parsed.trackedProjectIds,
          parsed.completedMilestones || {},
          parsed.completedDailyTasks || {},
          parsed.customTasks || [],
          parsed.wallets || []
        );
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const resetToDefaults = () => {
    const defaultTracked = ["monad", "berachain", "story-protocol"];
    const defaultMilestones = { monad: ["monad-rpc", "monad-faucet"] };
    setCustomProjects([]);
    setTrackedProjectIds(defaultTracked);
    setCompletedMilestones(defaultMilestones);
    setCompletedDailyTasks({});
    setCustomTasks([]);
    setWallets([{ id: "w-1", label: "Main Farming EVM", address: "0x71C...49b2" }]);
    saveState([], defaultTracked, defaultMilestones, {}, [], [{ id: "w-1", label: "Main Farming EVM", address: "0x71C...49b2" }]);
  };

  return (
    <AirdropContext.Provider
      value={{
        projects,
        trackedProjectIds,
        toggleTrackProject,
        isProjectTracked,
        customProjects,
        addProject,
        updateProject,
        deleteProject,
        liveData,
        isLiveLoading,
        refreshLiveData: fetchLiveData,
        completedMilestones,
        toggleMilestoneTask,
        isMilestoneCompleted,
        completedDailyTasks,
        toggleDailyTask,
        isDailyTaskCompleted,
        getDailyCompletionRate,
        customTasks,
        addCustomTask,
        toggleCustomTask,
        deleteCustomTask,
        wallets,
        addWallet,
        deleteWallet,
        exportBackupJson,
        importBackupJson,
        resetToDefaults,
      }}
    >
      {children}
    </AirdropContext.Provider>
  );
};

export const useAirdrops = () => {
  const context = React.useContext(AirdropContext);
  if (!context) {
    throw new Error("useAirdrops must be used within an AirdropProvider");
  }
  return context;
};
