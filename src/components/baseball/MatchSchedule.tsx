'use client';

import { useState, useEffect } from 'react';
import { getMatchSchedule } from "../../service/baseball/apis";
import styles from "../../styles/baseball/schedule.module.css";
import Link from "next/link";
import DatePagination from './DatePagination';
import { dateToString } from '../../utils/stringFormat/date';

interface IMatchProps {
    team: string;
    paramDate: Date
}

export default function ScheduleWithPagination({ team, paramDate }: IMatchProps) {
    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date>(paramDate);

    const fetchSchedules = async (date?: string) => {
        try {
            setLoading(true);
            const response = await getMatchSchedule(team.toUpperCase(), date);
            setSchedules(response.result || []);
        } catch (error) {
            console.error('Failed to fetch schedules:', error);
            setSchedules([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setSelectedDate(paramDate);
        fetchSchedules(dateToString("yyyy-MM-DD", paramDate));
    }, [team]);

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
        fetchSchedules(dateToString("yyyy-MM-DD", date));
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    return (
        <div>
            <DatePagination 
                type={team == "all" ? team : "team"} 
                baseDate={selectedDate} 
                onDateChange={handleDateChange} />
            {schedules.length === 0 ? (
                <div>
                    <div><p>선택한 날짜에는 경기가 없습니다.</p></div>
                </div>
            ) : (
                <div className={styles.container}>
                    {schedules.map(schedule => 
                        <div key={schedule.idx}>
                            <p>{schedule.matchDate}</p>
                            <p>{schedule.matchTime}</p>
                            <p className={styles.match}>
                                <img src={schedule.homeImgUrl} alt={schedule.homeTeam} />
                                <span>{schedule.homeTeam}</span>
                                <span>{schedule.homeScore}</span>
                                <span> : </span>
                                <span> {schedule.awayScore} </span>
                                <img src={schedule.awayImgUrl} alt={schedule.awayTeam} />
                                <span>{schedule.awayTeam}</span>
                            </p>
                            <p>{schedule.stadium}</p>
                            <p><Link prefetch href={`../match/${schedule.idx}`}>{schedule.matchResult}</Link></p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}