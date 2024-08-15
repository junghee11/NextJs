const apiUrl = process.env.NEXT_DEV_API_URL;

export const dynamic = 'force-dynamic';
export async function getTeam(name : string) {
    const response = await fetch(`${apiUrl}/baseball/team/${name.toUpperCase()}`)
    return response.json();
}

export default async function getMatchSchedule(team : string) {
    const response = await fetch(`${apiUrl}/baseball/schedule/${team.toUpperCase()}`)
    return response.json();
    return <div className={styles.container}>
        <img src={movie.poster_path} 
        alt={movie.title} 
        className={styles.poster}/>
        <div className={styles.info}>
            <h1 className={styles.title}>{movie.title}</h1>
            <h3>⭐ {movie.vote_average.toFixed(1)}</h3>
            <p>{movie.overview}</p>
            <a href={movie.homepage}
            target={"_blank"}>HomePage &rarr;</a>
        </div>
    </div>
}

// export default async function getMatchSchedule({team} : {team:string}) {
// }