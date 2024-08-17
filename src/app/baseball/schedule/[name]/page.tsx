import styles from "../../../(home)/home.module.css"
import Match from "../../../../components/baseball/schedule";
import { getTeam } from "../../../../service/baseball/apis";

interface IParams {
    params : {name:string}
}

export async function generateMetadata({params : {name}} : IParams) {
    const team = await getTeam(name);
    return {
        title: "all" == name ? "team" : team.result.name
    }
}

export default async function BaseBallMatchSchedule() {
    // const params = useSearchParams();
    return <div className={styles.container}>
        <Match 
            team="all" 
        ></Match>
    </div>;
}