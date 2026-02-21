import { useEffect, useState } from "react";
import type { Job } from "../interfaces/job";
import { getJobsList } from "../services/api";

export const useJobs = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const jobs = await getJobsList()
                setJobs(jobs);
            } catch (error) {
                setError(error as string);
            } finally {
                setLoading(false);
            }
        }
        fetchJobs();
    }, []);

    return { jobs, loading, error };
}