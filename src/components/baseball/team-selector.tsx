import Link from "next/link";
import styles from "../../styles/baseball/team-selector.module.css"
import { teamNameByCode } from "../../types/baseball/team";

interface TeamSelectorProps {
    selectedTeam : string;
    selectedDate : string;
}

export default async function DateSelector({ selectedTeam, selectedDate }: TeamSelectorProps) {
    const teams = Array.from(teamNameByCode.entries());

    return <div className={styles.container}>        
            <ul>
                {teams.map(([teamCode, teamName]) => (
                    <li key={teamCode} >
                        <Link
                            key={teamCode} 
                            href={`${teamCode}?date=${selectedDate}`}         
                            className={
                                selectedTeam === teamCode ? styles.selected : styles.default
                            }
                        >{teamName}</Link>
                    </li>
                ))}
            </ul>
        </div>
}