import styles from "../../../(home)/home.module.css"
import TeamSelector from "../../../../components/baseball/team-selector";
import Match from "../../../../components/baseball/schedule";
import { getTeam } from "../../../../service/baseball/apis";

interface IParams {
    params : {
        name:string
    }
}

export async function generateMetadata({params : {name}} : IParams) {
    const team = await getTeam(name);
    return {
        title: "all" == name ? "team" : team.result.name
    }
}

export default async function BaseBallMatchSchedule({params : {name}} : IParams) {    
    return <div className={styles.container}>
        <div>
            <TeamSelector selectedTeam={name} />
        </div>
        <Match 
            team="all" 
        ></Match>
    </div>;
}