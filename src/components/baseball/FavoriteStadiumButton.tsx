'use client';

import { useState } from 'react';
import { toggleStadium } from "../../service/baseball/apis"
import styles from '../../styles/baseball/stadium-info.module.css';

interface FavoriteStadiumButtonProps {
    stadiumIdx: number;
    stadiumName: string;
    toggle : boolean;
}

export default function FavoriteStadiumButton({ stadiumIdx, stadiumName, toggle }: FavoriteStadiumButtonProps) {
    const [isFavorite, setIsFavorite] = useState(toggle);

    const toggleFavorite = async () => {
        const toggleResult = await toggleStadium(stadiumIdx);

        setIsFavorite(toggleResult);
    };

    return (
        <button
            className={`${styles.favoriteButton} ${isFavorite ? styles.active : ''}`}
            onClick={toggleFavorite}
            title={isFavorite ? `${stadiumName} 즐겨찾기 해제` : `${stadiumName} 즐겨찾기 추가`}
            aria-label={isFavorite ? `${stadiumName} 즐겨찾기 해제` : `${stadiumName} 즐겨찾기 추가`}
        >
            ★
        </button>
    );
}