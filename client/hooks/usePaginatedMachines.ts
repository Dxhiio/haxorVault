import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Machine } from "./useMachines";

interface UsePaginatedMachinesProps {
    page: number;
    pageSize: number;
    searchQuery: string;
    filters: {
        difficulty: string;
        os: string;
        status: string;
    };
}

export function usePaginatedMachines({ page, pageSize, searchQuery, filters }: UsePaginatedMachinesProps) {
    const { data, isLoading: loading, error } = useQuery({
        queryKey: ['machines', 'paginated', page, pageSize, searchQuery, filters.difficulty, filters.os, filters.status],
        queryFn: async () => {
            let query = supabase
                .from('htb_machines')
                .select('*', { count: 'exact' });

            // Apply filters
            if (searchQuery) {
                query = query.ilike('name', `%${searchQuery}%`);
            }

            if (filters.difficulty !== 'All') {
                query = query.eq('difficulty_text', filters.difficulty);
            }

            if (filters.os !== 'All') {
                query = query.eq('os', filters.os);
            }

            if (filters.status !== 'All') {
                query = query.eq('status', filters.status.toLowerCase());
            }

            // Pagination
            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;

            query = query
                .order('release_date', { ascending: false })
                .range(from, to);

            const { data, error, count } = await query;

            if (error) throw error;

            return {
                machines: data as Machine[] || [],
                totalCount: count || 0
            };
        },
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return {
        machines: data?.machines || [],
        totalCount: data?.totalCount || 0,
        loading,
        error: error ? (error as Error).message : null
    };
}
