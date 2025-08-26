'use client';

import { useState } from 'react';
import { togglePlayer } from "../../service/baseball/apis"
import styles from '../../styles/baseball/stadium-info.module.css';

interface FavoritePlayerButtonProps {
    playerIdx: number;
    plaeyrName: string;
    toggle : boolean;
}

export default function FavoritePlayerButton({ playerIdx, plaeyrName, toggle }: FavoritePlayerButtonProps) {
    const [isFavorite, setIsFavorite] = useState(toggle);

    const toggleFavorite = async () => {
        const toggleResult = await togglePlayer(playerIdx);

        setIsFavorite(toggleResult);
    };

    return (
        <button
            className={`${styles.favoriteButton} ${isFavorite ? styles.active : ''}`}
            onClick={toggleFavorite}
            title={isFavorite ? `${plaeyrName} 즐겨찾기 해제` : `${plaeyrName} 즐겨찾기 추가`}
            aria-label={isFavorite ? `${plaeyrName} 즐겨찾기 해제` : `${plaeyrName} 즐겨찾기 추가`}
        >
            ★
        </button>
    );
}