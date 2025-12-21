import React, { useState, useRef, useEffect } from 'react';

const styles = `
  .datetime-picker-container {
    position: relative;
    width: 100%;
  }

  .datetime-input {
    width: 100%;
    padding: 12px 16px;
    fontSize: 16px;
    border: 1px solid #ccc;
    borderRadius: 4px;
    cursor: pointer;
    background: white;
    outline: none;
    transition: border-color 0.2s;
  }

  .datetime-input:hover {
    border-color: #1976d2;
  }

  .datetime-input:focus {
    border-color: #1976d2;
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
  }

  .datetime-picker-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    width: 280px;
    background: white;
    border-radius: 2px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    overflow: hidden;
    z-index: 1000;
  }

  .header {
    background: #1976d2;
    color: white;
    padding: 20px 24px 16px;
  }

  .header-label {
    font-size: 12px;
    letter-spacing: 1px;
    opacity: 0.7;
    margin-bottom: 20px;
    font-weight: 400;
  }

  .header-year {
    font-size: 16px;
    opacity: 0.7;
    margin-bottom: 8px;
    font-weight: 400;
  }

  .header-date {
    font-size: 36px;
    font-weight: 400;
    line-height: 1;
    margin-bottom: 8px;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .header-date:hover {
    opacity: 0.9;
  }

  .header-time {
    font-size: 36px;
    font-weight: 400;
    line-height: 1;
    cursor: pointer;
    transition: opacity 0.2s;
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .header-time:hover {
    opacity: 0.9;
  }

  .header-period {
    font-size: 18px;
    margin-left: 4px;
  }

  .tab-buttons {
    display: flex;
    border-bottom: 1px solid #e0e0e0;
    background: white;
  }

  .tab-btn {
    flex: 1;
    padding: 16px;
    border: none;
    background: white;
    color: #757575;
    cursor: pointer;
    transition: all 0.2s;
    border-bottom: 2px solid transparent;
    font-size: 20px;
  }

  .tab-btn.active {
    color: #1976d2;
    border-bottom: 2px solid #1976d2;
  }

  .tab-btn:hover {
    background: #f5f5f5;
  }

  .content-area {
    height: 300px;
    overflow: hidden;
  }

  .time-picker {
    padding: 8px;
    height: 100%;
  }

  .time-columns {
    display: flex;
    gap: 4px;
    justify-content: center;
    height: 100%;
  }

  .time-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .time-scroll {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #ccc #f5f5f5;
  }

  .time-scroll::-webkit-scrollbar {
    width: 4px;
  }

  .time-scroll::-webkit-scrollbar-track {
    background: transparent;
  }

  .time-scroll::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 2px;
  }

  .time-item {
    padding: 10px 8px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
    color: #424242;
  }

  .time-item:hover {
    background: #e3f2fd;
  }

  .time-item.selected {
    background: #1976d2;
    color: white;
    font-weight: 500;
  }

  .calendar-picker {
    padding: 8px 16px 16px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 8px 0;
  }

  .calendar-month {
    font-size: 14px;
    font-weight: 500;
    color: #424242;
  }

  .calendar-nav {
    display: flex;
    gap: 4px;
  }

  .nav-btn {
    border: none;
    background: transparent;
    color: #424242;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 2px;
    font-size: 20px;
    line-height: 1;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-btn:hover {
    background: #e3f2fd;
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0;
    flex: 1;
  }

  .calendar-day-name {
    text-align: center;
    color: #757575;
    font-size: 11px;
    padding: 8px 0;
    font-weight: 500;
  }

  .calendar-day {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    font-size: 12px;
    color: #424242;
    transition: all 0.2s;
    margin: 1px;
  }

  .calendar-day:hover:not(.other-month) {
    background: #e3f2fd;
  }

  .calendar-day.selected {
    background: #1976d2;
    color: white;
    font-weight: 500;
  }

  .calendar-day.other-month {
    color: #bdbdbd;
  }

  .calendar-day.today {
    font-weight: 600;
  }

  .action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 8px 16px;
    border-top: 1px solid #e0e0e0;
  }

  .btn-cancel, .btn-ok {
    border: none;
    background: transparent;
    color: #1976d2;
    font-weight: 600;
    font-size: 13px;
    padding: 8px 16px;
    cursor: pointer;
    letter-spacing: 0.5px;
    transition: background 0.2s;
    border-radius: 2px;
    text-transform: uppercase;
  }

  .btn-cancel:hover, .btn-ok:hover {
    background: #e3f2fd;
  }
`;

const DateTimePicker: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 11, 20));
  const [selectedHour, setSelectedHour] = useState<number>(12);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [viewDate, setViewDate] = useState<Date>(new Date(2025, 11, 10));
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatDate = (date: Date): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}`;
  };

  const formatMonth = (date: Date): string => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: Date[] = [];
    
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, prevMonthLastDay - i));
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setViewDate(date);
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const isOtherMonth = (date: Date): boolean => {
    return date.getMonth() !== viewDate.getMonth();
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleOk = () => {
    if (showCalendar) {
      setShowCalendar(false);
    } else {
      setIsOpen(false);
    }
  };

  const formattedTime = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div className="datetime-picker-wrapper">
      <div className="datetime-picker-container" ref={containerRef}>
        <input
          ref={inputRef}
          type="text"
          className="datetime-input"
          value={`${formatDate(selectedDate)} ${formattedTime} ${selectedPeriod}`}
          onClick={() => setIsOpen(!isOpen)}
          readOnly
          placeholder="Select date & time"
        />

        {isOpen && (
          <div className="datetime-picker-dropdown">
            <div className="header">
              <div className="header-label">SELECT DATE & TIME</div>
              <div className="header-year">{selectedDate.getFullYear()}</div>
              <div 
                className="header-date"
                onClick={() => setShowCalendar(true)}
              >
                {formatDate(selectedDate)}
              </div>
              <div 
                className="header-time"
                onClick={() => setShowCalendar(false)}
              >
                {formattedTime}
                <span className="header-period">{selectedPeriod}</span>
              </div>
            </div>

            <div className="tab-buttons">
              <button
                className={`tab-btn ${showCalendar ? 'active' : ''}`}
                onClick={() => setShowCalendar(true)}
              >
                📅
              </button>
              <button
                className={`tab-btn ${!showCalendar ? 'active' : ''}`}
                onClick={() => setShowCalendar(false)}
              >
                🕐
              </button>
            </div>

            <div className="content-area">
              {showCalendar ? (
                <div className="calendar-picker">
                  <div className="calendar-header">
                    <div className="calendar-month">{formatMonth(viewDate)}</div>
                    <div className="calendar-nav">
                      <button className="nav-btn" onClick={handlePrevMonth}>‹</button>
                      <button className="nav-btn" onClick={handleNextMonth}>›</button>
                    </div>
                  </div>
                  <div className="calendar-grid">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                      <div key={i} className="calendar-day-name">{day}</div>
                    ))}
                    {getDaysInMonth(viewDate).map((date, i) => (
                      <div
                        key={i}
                        className={`calendar-day ${
                          isSameDay(date, selectedDate) ? 'selected' : ''
                        } ${isOtherMonth(date) ? 'other-month' : ''} ${
                          isSameDay(date, new Date()) ? 'today' : ''
                        }`}
                        onClick={() => handleDateSelect(date)}
                      >
                        {date.getDate()}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="time-picker">
                  <div className="time-columns">
                    <div className="time-column">
                      <div className="time-scroll">
                        {hours.map((hour) => (
                          <div
                            key={hour}
                            className={`time-item ${parseInt(hour) === selectedHour ? 'selected' : ''}`}
                            onClick={() => setSelectedHour(parseInt(hour))}
                          >
                            {hour}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="time-column">
                      <div className="time-scroll">
                        {minutes.map((minute) => (
                          <div
                            key={minute}
                            className={`time-item ${parseInt(minute) === selectedMinute ? 'selected' : ''}`}
                            onClick={() => setSelectedMinute(parseInt(minute))}
                          >
                            {minute}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="time-column">
                      <div className="time-scroll">
                        <div
                          className={`time-item ${selectedPeriod === 'AM' ? 'selected' : ''}`}
                          onClick={() => setSelectedPeriod('AM')}
                        >
                          AM
                        </div>
                        <div
                          className={`time-item ${selectedPeriod === 'PM' ? 'selected' : ''}`}
                          onClick={() => setSelectedPeriod('PM')}
                        >
                          PM
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="action-buttons">
              <button className="btn-cancel" onClick={handleCancel}>CANCEL</button>
              <button className="btn-ok" onClick={handleOk}>
                {showCalendar ? 'NEXT' : 'OK'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateTimePicker;