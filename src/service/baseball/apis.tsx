const apiUrl = process.env.NEXT_DEV_API_URL;

export const dynamic = 'force-dynamic';
export async function getTeam(name : string) {
    const response = await fetch(`${apiUrl}/baseball/team/${name.toUpperCase()}`)
    return response.json();
}

export default async function getMatchSchedule(team : string) {
    const response = await fetch(`${apiUrl}/baseball/schedule/${team.toUpperCase()}`)
    return response.json();
}