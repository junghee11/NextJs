'use client';

import { useState, useRef } from 'react';
import styles from '../../styles/baseball/DatePagination.module.css';
import { dateToString } from '../../utils/stringFormat/date'

interface DatePaginationProps {
  type : string;
  baseDate : Date;
  onDateChange?: (date: Date) => void;
}

export default function DatePagination({ type, baseDate, onDateChange }: DatePaginationProps) {
  const [centerDate, setCenterDate] = useState(baseDate);
  const [selectedDate, setSelectedDate] = useState(dateToString('yyyy-MM-DD', baseDate));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleDateClick = (date: Date) => {
    setSelectedDate(dateToString('yyyy-MM-DD', date));
    setCenterDate(date);
    onDateChange?.(date);
  };

  const handleCalendarClick = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDateString = e.target.value;
    const selectedDateObj = new Date(selectedDateString);
    setSelectedDate(selectedDateString);
    setCenterDate(selectedDateObj);
    setShowDatePicker(false);
    onDateChange?.(selectedDateObj);
  };

  const prevDate = new Date(centerDate);
  const nextDate = new Date(centerDate);

  if (type == "team") {
    prevDate.setMonth(centerDate.getMonth() - 1);
    nextDate.setMonth(centerDate.getMonth() + 1);
  } else {
    prevDate.setDate(prevDate.getDate() - 1);
    nextDate.setDate(nextDate.getDate() + 1);
  }  

  return (
    <div className={styles.pagination}>
      <button 
        className={`${styles.dateButton}`}
        onClick={() => handleDateClick(prevDate)}
      >
        {type == "team" ? dateToString('yyyy년 MM월', prevDate) : dateToString('yyyy-MM-DD', prevDate)}
      </button>
      <button 
        className={`${styles.dateButton} ${styles.active}`}
        onClick={() => handleDateClick(centerDate)}
      >
        {type == "team" ? dateToString('yyyy년 MM월', centerDate) : dateToString('yyyy-MM-DD', centerDate)}
      </button>
      <button 
        className={`${styles.dateButton}`}
        onClick={() => handleDateClick(nextDate)}
      >
        {type == "team" ? dateToString('yyyy년 MM월', nextDate) : dateToString('yyyy-MM-DD', nextDate)}
      </button>
      {type == "team" ? '' : 
        <button 
        className={styles.calendarButton}
        onClick={handleCalendarClick}
        title="날짜 선택"
      >
        📅
        {showDatePicker && (
          <div 
            className={styles.datePickerContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              ref={dateInputRef}
              type="date"
              className={styles.datePickerInput}
              value={selectedDate}
              onChange={handleDateInputChange}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </button>
      }
      
    </div>
  );
}