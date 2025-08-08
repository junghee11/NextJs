import styles from "../../../../styles/mypage/mypage.module.css"
import { getMyPlayerListServer } from "../../../../service/mypage/serverApis";
import Category from "../../../../components/mypage/category";

export default async function MyPlayerList() {
    const playerList = await getMyPlayerListServer();

    if (playerList.result.length == 0) {
        return <div className = {styles.container}>
            <Category></Category>
            <div>
                <p>응원중인 선수가 없습니다</p>
            </div>
        </div>
    }

    return <div className = {styles.container}>
        <Category></Category>
        <div className = {styles.content}>
            {playerList.result.map(player => <div key={player.idx}>
                <img src={player.imgUrl} alt="" />
                <div>
                    <p>{player.num} {player.name}</p>
                    <p>{player.birth}</p>
                    <p>{player.body}</p>
                    <p>{player.team}</p>
                    <p>{player.awards}</p>
                    <p>{player.song}</p>
                    <table>
                        <thead>
                            <tr>
                                <td>안타</td>
                                <td>홈런</td>
                                <td>도루</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{player.hit}</td>
                                <td>{player.homeRun}</td>
                                <td>{player.run}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>)}
        </div>
    </div>;
}