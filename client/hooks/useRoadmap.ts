
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Machine } from './useMachines';

export interface Certification {
  id: number;
  name: string;
  summary?: string;
  tips?: string[];
  weeks: RoadmapWeek[];
}

export interface RoadmapWeek {
  id: number;
  week_number: number;
  title: string;
  description: string;
  machines: Machine[];
  techniques: Technique[];
}

export interface Technique {
  id: number;
  name: string;
  category: string;
}

export function useRoadmap() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchRoadmap() {
      try {
        setLoading(true);
        
        // Fetch Certifications
        const { data: certsData, error: certsError } = await supabase
          .from('certifications')
          .select('*')
          .order('id');

        if (certsError) throw certsError;

        const certsWithWeeks = await Promise.all(certsData.map(async (cert) => {
          // Fetch Weeks for this Cert
          const { data: weeksData, error: weeksError } = await supabase
            .from('roadmap_weeks')
            .select(`
              *,
              roadmap_week_machines (
                htb_machines (*)
              ),
              roadmap_week_techniques (
                techniques (*)
              )
            `)
            .eq('certification_id', cert.id)
            .order('week_number');

          if (weeksError) throw weeksError;

          const weeks = weeksData.map(week => ({
            ...week,
            machines: week.roadmap_week_machines.map((wm: any) => wm.htb_machines),
            techniques: week.roadmap_week_techniques.map((wt: any) => wt.techniques)
          }));

          return {
            ...cert,
            weeks
          };
        }));

        setCertifications(certsWithWeeks);
      } catch (err) {
        console.error('Error fetching roadmap:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchRoadmap();
  }, []);

  return { certifications, loading, error };
}
