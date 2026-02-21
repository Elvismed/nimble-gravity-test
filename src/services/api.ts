import axios from "axios";
import type{ Candidate } from "../interfaces/candidate";
import type{ Job } from "../interfaces/job";
import type { ApplyPayload } from "../interfaces/apply-payload";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
})
export async function getCandidateByEmail(email: string): Promise<Candidate> {
    try {
    const response = await api.get(`/api/candidate/get-by-email`, {
        params: {
            email
        }
    })
    return response.data
    } catch (error) {
        throw new Error("Error al obtener el candidato :" + error);
    }
}

export async  function getJobsList(): Promise<Job[]>{
    try {
        const response = await api.get(`/api/jobs/get-list`)
        return response.data
    } catch (error) {
        throw new Error("Error al obtener la lista de trabajos :" + error);
    }
}
export async function applyToJob(payload: ApplyPayload): Promise<{ ok: boolean }> {
    try {
        const response = await api.post(`/api/candidate/apply-to-job`, payload)
        return response.data
    } catch (error) {
        throw new Error("Error al aplicar al trabajo :" + error);
    }

}