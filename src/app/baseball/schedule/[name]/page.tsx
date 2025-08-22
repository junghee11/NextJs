import styles from "../../../(home)/home.module.css"
import TeamSelector from "../../../../components/baseball/team-selector";
import Schedule from "../../../../components/baseball/MatchSchedule";
import { getTeam } from "../../../../service/baseball/apis";

interface IParams {
    params : {name:string}
    searchParams : {date?:string}
}

export async function generateMetadata({params : {name}} : IParams) {
    const team = await getTeam(name);
    return {
        title: "all" == name ? "team" : team.result.name
    }
}

export default async function BaseBallMatchSchedule({params : {name}, searchParams : {date}} : IParams) {    
    return <div className={styles.container}>
        <div>
            <TeamSelector selectedTeam={name} selectedDate={date} />
        </div>
        <Schedule 
            team={name} 
            paramDate={new Date(date)}
        />
    </div>;
}