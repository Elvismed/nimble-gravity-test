import { useEffect, useState } from "react";
import type { Candidate } from "../interfaces/candidate";
import { getCandidateByEmail } from "../services/api";

export const useCandidate = () => {
 const [candidate, setCandidate] = useState<Candidate | null>(null);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);
 
    useEffect(() => {
        const fetchCandidate = async () => {
            setLoading(true);
            try {
                const candidate = await getCandidateByEmail(import.meta.env.VITE_CANDIDATE_EMAIL)
                setCandidate(candidate);
            } catch (error) {
                setError(error as string);
            } finally {
                setLoading(false);
            }
        }
        fetchCandidate();
    }, []);
    
    return { candidate, loading, error };
}