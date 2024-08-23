import api from "../ApiClient"

export const dynamic = 'force-dynamic';
export async function getTeam(name : string) {
    const response = await api.get(`/baseball/team/${name.toUpperCase()}`)
    return response.data;
}

export default async function getMatchSchedule(team : string) {
    const response = await api.get(`/baseball/schedule/${team.toUpperCase()}`)
    return response.data;
}