"use client"

import { selectMyTeam } from "../../service/mypage/apis";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TeamCode } from "../../types/baseball/team";
import styles from "../../styles/mypage/mypage.module.css"

interface SelectTeamProps {
    myTeam : TeamCode;
}

export default function selectMyTeamButton({ myTeam }: SelectTeamProps) {
    const router = useRouter();
    const [team, setTeam] = useState(null);

    async function clickSelectButton (event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        if (team == null || team == "") {
            alert("응원하실 팀을 선택해주세요ㅎㅎ")
            return;
        } 

        try { 
            const response = await selectMyTeam(team);
            if (typeof response === 'object' && response !== null && 'message' in response) {
                alert((response as any).message);
            } 
            
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('응원팀 등록에 실패했습니다.');
        }
    }

    return <div className={styles.teamSelector}>
            <div className={styles.teamSelectorTitle}>
                응원팀 변경
            </div>
            <div className={styles.teamSelectGroup}>
                <div style={{ flex: 1 }}>
                    <label htmlFor="teamSelect" className={styles.teamSelectLabel}>
                        새로운 응원팀을 선택해주세요
                    </label>
                    <select 
                        id="teamSelect" 
                        name="teamSelect"
                        className={styles.teamSelect}
                        onChange={(e) => setTeam(e.target.value)}
                        defaultValue={myTeam != null ? myTeam : ""}
                    >
                        <option value="">팀을 선택하세요</option>
                        <option value="SAMSUNG">삼성 라이온즈</option>
                        <option value="SSG">SSG 랜더스</option>
                        <option value="KT">KT wiz</option>
                        <option value="LG">LG 트윈스</option>
                        <option value="NC">NC 디아노스</option>
                        <option value="DOOSAN">두산 베어스</option>
                        <option value="KIWOOM">키움 히어로즈</option>
                        <option value="KIA">KIA 타이거즈</option>
                        <option value="HANHWA">한화 이글스</option>
                        <option value="LOTTE">롯데 자이언츠</option>
                    </select>
                </div>
                <button type="submit" className={styles.teamSelectButton} onClick={clickSelectButton}>
                    변경하기
                </button>
            </div>
        </div>;
}