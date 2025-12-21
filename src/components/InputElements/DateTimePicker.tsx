import React, { useState, useRef, useEffect } from 'react';

const BasicDateTimePicker: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [tempHours, setTempHours] = useState(12);
  const [tempMinutes, setTempMinutes] = useState(0);
  const [tempPeriod, setTempPeriod] = useState<'AM' | 'PM'>('AM');
  const [tempDate, setTempDate] = useState<number | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${month}/${day}/${year} ${String(hours).padStart(2, '0')}:${minutes} ${period}`;
  };

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateSelect = (day: number) => {
    setTempDate(day);
  };

  const handleOK = () => {
    if (tempDate) {
      let hours24 = tempHours;
      if (tempPeriod === 'PM' && tempHours !== 12) hours24 += 12;
      if (tempPeriod === 'AM' && tempHours === 12) hours24 = 0;
      
      const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), tempDate, hours24, tempMinutes);
      setSelectedDate(newDate);
      setShowPicker(false);
    }
  };

  const handleCancel = () => {
    setShowPicker(false);
    setTempDate(null);
  };

  const changeMonth = (delta: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(viewDate);
    const firstDay = getFirstDayOfMonth(viewDate);
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];

    const today = new Date();
    const isToday = (day: number | null) => {
      if (!day) return false;
      return day === today.getDate() && 
             viewDate.getMonth() === today.getMonth() && 
             viewDate.getFullYear() === today.getFullYear();
    };

    return (
      <div style={styles.calendar}>
        <div style={styles.calendarHeader}>
          <div style={styles.monthYearDropdown}>
            {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()} <span style={styles.dropdownIcon}>▼</span>
          </div>
          <div style={styles.navButtons}>
            <button style={styles.navButton} onClick={() => changeMonth(-1)}>‹</button>
            <button style={styles.navButton} onClick={() => changeMonth(1)}>›</button>
          </div>
        </div>
        <div style={styles.weekDays}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
            <div key={idx} style={styles.weekDay}>{day}</div>
          ))}
        </div>
        <div style={styles.daysGrid}>
          {days.map((day, idx) => (
            <div
              key={idx}
              style={{
                ...styles.dayCell,
                ...(day === null ? styles.emptyDay : {}),
                ...(isToday(day) ? styles.todayDay : {}),
                ...(day === tempDate ? styles.selectedDay : {})
              }}
              onClick={() => day && handleDateSelect(day)}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTimePicker = () => {
    const hours12 = Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i));
    const minutes = Array.from({ length: 12 }, (_, i) => i * 5);
    const periods = ['AM', 'PM'];

    return (
      <div style={styles.timePicker}>
        <div style={styles.timeColumns}>
          <div style={styles.timeColumn}>
            <div style={styles.timeScroll}>
              {hours12.map(h => (
                <div
                  key={h}
                  style={{
                    ...styles.timeOption,
                    ...(tempHours === h ? styles.selectedTimeOption : {})
                  }}
                  onClick={() => setTempHours(h)}
                  onMouseEnter={(e) => {
                    if (tempHours !== h) {
                      e.currentTarget.style.backgroundColor = '#f5f5f5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (tempHours !== h) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {String(h).padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>

          <div style={styles.timeColumn}>
            <div style={styles.timeScroll}>
              {minutes.map(m => (
                <div
                  key={m}
                  style={{
                    ...styles.timeOption,
                    ...(tempMinutes === m ? styles.selectedTimeOption : {})
                  }}
                  onClick={() => setTempMinutes(m)}
                  onMouseEnter={(e) => {
                    if (tempMinutes !== m) {
                      e.currentTarget.style.backgroundColor = '#f5f5f5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (tempMinutes !== m) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {String(m).padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>

          <div style={styles.timeColumn}>
            <div style={styles.timeScroll}>
              {periods.map(p => (
                <div
                  key={p}
                  style={{
                    ...styles.timeOption,
                    ...(tempPeriod === p ? styles.selectedTimeOption : {})
                  }}
                  onClick={() => setTempPeriod(p as 'AM' | 'PM')}
                  onMouseEnter={(e) => {
                    if (tempPeriod !== p) {
                      e.currentTarget.style.backgroundColor = '#f5f5f5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (tempPeriod !== p) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    
        <div style={styles.formGroup}>
          <label style={styles.label}>Basic date time picker</label>
          <div ref={pickerRef} style={styles.inputWrapper}>
            <input
              type="text"
              style={styles.input}
              value={selectedDate ? formatDate(selectedDate) : ''}
              placeholder="MM/DD/YYYY hh:mm AM/PM"
              onClick={() => setShowPicker(!showPicker)}
              readOnly
            />
            {showPicker && (
              <div style={styles.pickerDropdown}>
                <div style={styles.pickerContent}>
                  {renderCalendar()}
                  {renderTimePicker()}
                </div>
                <div style={styles.pickerFooter}>
                  <button style={styles.cancelButton} onClick={handleCancel}>
                    CANCEL
                  </button>
                  <button style={styles.okButton} onClick={handleOK}>
                    OK
                  </button>
                </div>
              </div>
            )}
          </div>
          {selectedDate && (
            <small style={styles.helperText}>
              Selected: {formatDate(selectedDate)}
            </small>
          )}
        </div>
    
  );
};

const styles: { [key: string]: React.CSSProperties } = {

  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    color: 'rgba(0, 0, 0, 0.6)',
    fontSize: '0.875rem',
    fontWeight: 400,
    marginBottom: '8px',
    display: 'block',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
    color: '#212529',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  pickerDropdown: {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    backgroundColor: 'white',
    borderRadius: '4px',
    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    overflow: 'hidden',
  },
  pickerContent: {
    display: 'flex',
  },
  calendar: {
    padding: '20px 24px',
    width: '340px',
  },
  calendarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  monthYearDropdown: {
    fontWeight: 400,
    color: '#1a1a1a',
    fontSize: '1.125rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  dropdownIcon: {
    fontSize: '0.75rem',
    color: '#666',
  },
  navButtons: {
    display: 'flex',
    gap: '4px',
  },
  navButton: {
    background: 'none',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    padding: '0 8px',
    color: '#666',
    lineHeight: 1,
    fontWeight: 300,
  },
  weekDays: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    marginBottom: '12px',
  },
  weekDay: {
    textAlign: 'center',
    fontSize: '0.875rem',
    fontWeight: 400,
    color: '#9e9e9e',
    padding: '8px 0',
  },
  daysGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    rowGap: '4px',
  },
  dayCell: {
    textAlign: 'center',
    padding: '8px',
    cursor: 'pointer',
    borderRadius: '50%',
    fontSize: '0.9375rem',
    color: '#1a1a1a',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    transition: 'background-color 0.2s',
  },
  emptyDay: {
    cursor: 'default',
    visibility: 'hidden',
  },
  todayDay: {
    border: '1px solid #1976d2',
    color: '#1976d2',
  },
  selectedDay: {
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
  },
  timePicker: {
    padding: '20px 16px',
    borderLeft: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column',
  },
  timeColumns: {
    display: 'flex',
    gap: '8px',
  },
  timeColumn: {
    flex: 1,
    minWidth: '56px',
  },
  timeScroll: {
    maxHeight: '300px',
    overflowY: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  timeOption: {
    padding: '12px 8px',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '0.9375rem',
    color: '#1a1a1a',
    transition: 'background-color 0.15s',
    userSelect: 'none',
  },
  selectedTimeOption: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    fontWeight: 500,
  },
  pickerFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '24px',
    padding: '12px 20px',
    borderTop: '1px solid #e0e0e0',
  },
  cancelButton: {
    background: 'none',
    border: 'none',
    color: '#1976d2',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    padding: '8px 12px',
    letterSpacing: '0.4px',
  },
  okButton: {
    background: 'none',
    border: 'none',
    color: '#1976d2',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    padding: '8px 12px',
    letterSpacing: '0.4px',
  },
  helperText: {
    color: 'rgba(0, 0, 0, 0.6)',
    fontSize: '0.75rem',
    marginTop: '8px',
    display: 'block',
  },
};

export default BasicDateTimePicker;