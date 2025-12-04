import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export type UserLevel = "Script Kiddie" | "Hacker" | "Pro Hacker" | "Elite Hacker" | "Guru" | "Omniscient";

export interface UserProfileStats {
  solvedCount: number;
  wishlistCount: number;
  totalMachines: number;
  level: UserLevel;
  progressToNextLevel: number;
  nextLevel: UserLevel | "Max";
  machinesToNextLevel: number;
}

export interface CertProgress {
  id: number;
  name: string;
  totalMachines: number;
  completedMachines: number;
  percentage: number;
}

const LEVELS: { name: UserLevel; threshold: number }[] = [
  { name: "Script Kiddie", threshold: 0 },
  { name: "Hacker", threshold: 10 },
  { name: "Pro Hacker", threshold: 50 },
  { name: "Elite Hacker", threshold: 100 },
  { name: "Guru", threshold: 200 },
  { name: "Omniscient", threshold: 999999 }, // Special case: requires 100% completion
];

export function useProfile() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");

      // Fetch counts
      const { count: solvedCount } = await supabase
        .from("user_progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      const { count: wishlistCount } = await supabase
        .from("user_wishlist")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      const { count: totalMachines } = await supabase
        .from("htb_machines")
        .select("*", { count: "exact", head: true });

      const currentSolved = solvedCount || 0;
      const total = totalMachines || 1; // Avoid division by zero

      // Calculate Level
      let currentLevelIndex = 0;
      
      // Check for Omniscient (100% completion)
      if (currentSolved >= total) {
        currentLevelIndex = LEVELS.length - 1;
      } else {
        // Find standard level based on solved count
        for (let i = LEVELS.length - 2; i >= 0; i--) {
          if (currentSolved >= LEVELS[i].threshold) {
            currentLevelIndex = i;
            break;
          }
        }
      }

      const currentLevel = LEVELS[currentLevelIndex];
      const nextLevel = LEVELS[currentLevelIndex + 1];

      let progressToNextLevel = 0;
      let machinesToNextLevel = 0;

      if (currentLevel.name === "Omniscient") {
        progressToNextLevel = 100;
        machinesToNextLevel = 0;
      } else if (nextLevel) {
        if (nextLevel.name === "Omniscient") {
           // Progress to Omniscient is based on total machines
           machinesToNextLevel = total - currentSolved;
           progressToNextLevel = (currentSolved / total) * 100;
        } else {
           const range = nextLevel.threshold - currentLevel.threshold;
           const progress = currentSolved - currentLevel.threshold;
           progressToNextLevel = (progress / range) * 100;
           machinesToNextLevel = nextLevel.threshold - currentSolved;
        }
      }

      return {
        solvedCount: currentSolved,
        wishlistCount: wishlistCount || 0,
        totalMachines: total,
        level: currentLevel.name,
        progressToNextLevel: Math.min(100, Math.max(0, progressToNextLevel)),
        nextLevel: nextLevel ? nextLevel.name : "Max",
        machinesToNextLevel
      } as UserProfileStats;
    },
    enabled: !!user,
  });

  const { data: certProgress, isLoading: certsLoading } = useQuery({
    queryKey: ["certProgress", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");

      // Get all certs
      const { data: certs } = await supabase
        .from("certifications")
        .select("id, name");

      if (!certs) return [];

      // For each cert, calculate progress
      const progressData = await Promise.all(
        certs.map(async (cert) => {
          // Get weeks for this cert
          const { data: weeks } = await supabase
            .from("roadmap_weeks")
            .select("id")
            .eq("certification_id", cert.id);
            
          const weekIds = weeks?.map(w => w.id) || [];
          
          if (weekIds.length === 0) {
              return {
                  id: cert.id,
                  name: cert.name,
                  totalMachines: 0,
                  completedMachines: 0,
                  percentage: 0
              };
          }

          // Get machines for these weeks
          const { data: machines } = await supabase
            .from("roadmap_week_machines")
            .select("machine_id")
            .in("week_id", weekIds);
            
          const machineIds = machines?.map(m => m.machine_id) || [];
          const totalCertMachines = machineIds.length;

          if (totalCertMachines === 0) {
             return {
                  id: cert.id,
                  name: cert.name,
                  totalMachines: 0,
                  completedMachines: 0,
                  percentage: 0
              };
          }

          // Get completed machines for this cert
          // Use a count query with 'in' filter
          const { count: completedCount } = await supabase
            .from("user_progress")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .in("machine_id", machineIds);

          const completed = completedCount || 0;

          return {
            id: cert.id,
            name: cert.name,
            totalMachines: totalCertMachines,
            completedMachines: completed,
            percentage: Math.round((completed / totalCertMachines) * 100)
          };
        })
      );

      return progressData as CertProgress[];
    },
    enabled: !!user,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: userMachines, isLoading: machinesLoading } = useQuery({
    queryKey: ["userMachines", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data } = await supabase
        .from("user_progress")
        .select(`
          completed_at,
          htb_machines (
            id,
            name,
            os,
            difficulty_text,
            avatar,
            points,
            stars
          )
        `)
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });

      return data?.map((item: any) => ({
        ...item.htb_machines,
        completed_at: item.completed_at
      })) || [];
    },
    enabled: !!user,
  });

  const { data: wishlist, isLoading: wishlistLoading } = useQuery({
    queryKey: ["userWishlist", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data } = await supabase
        .from("user_wishlist")
        .select(`
          added_at,
          htb_machines (
            id,
            name,
            os,
            difficulty_text,
            avatar,
            points,
            stars
          )
        `)
        .eq("user_id", user.id)
        .order("added_at", { ascending: false });

      return data?.map((item: any) => ({
        ...item.htb_machines,
        added_at: item.added_at
      })) || [];
    },
    enabled: !!user,
  });

  return {
    stats,
    certProgress,
    userMachines,
    wishlist,
    loading: statsLoading || certsLoading || machinesLoading || wishlistLoading
  };
}
