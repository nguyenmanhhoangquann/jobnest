import React, { useState, useEffect, useMemo, memo } from 'react';

function getSunTimes(date) {
  const now = date || new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - startOfYear) / 86400000);
  const declination = -23.44 * (Math.PI / 180) * Math.cos((2 * Math.PI / 365) * (dayOfYear + 10));
  const latRad = 21.0285 * (Math.PI / 180);
  const cosH0 = (Math.sin(-0.833 * Math.PI / 180) - Math.sin(latRad) * Math.sin(declination)) / (Math.cos(latRad) * Math.cos(declination));
  const h0 = Math.acos(Math.max(-1, Math.min(1, cosH0))) * (180 / Math.PI);
  const solarNoonMinutes = 11 * 60 + 56;
  const halfDayMinutes = Math.round((h0 / 15) * 60);
  const rise = solarNoonMinutes - halfDayMinutes;
  const set = solarNoonMinutes + halfDayMinutes;
  const day = set - rise;
  const pad = (n) => String(n).padStart(2, '0');

  return {
    rise: `${pad(Math.floor(rise / 60))}:${pad(rise % 60)}`,
    set: `${pad(Math.floor(set / 60))}:${pad(set % 60)}`,
    duration: `${Math.floor(day / 60)}h ${pad(day % 60)}m`,
  };
}

function FuturisticHudClock() {
  const [time, setTime] = useState(() => new Date());
  const [is24h, setIs24h] = useState(true);

  useEffect(() => {
    let timer = null;
    const start = () => {
      if (!timer) timer = setInterval(() => setTime(new Date()), 1000);
    };
    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const handleVisibility = () => {
      if (document.hidden) stop();
      else {
        setTime(new Date());
        start();
      }
    };

    start();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const hours = is24h ? time.getHours() : (time.getHours() % 12 || 12);
  const hoursStr = String(hours).padStart(2, '0');
  const minutesStr = String(time.getMinutes()).padStart(2, '0');
  const secondsStr = String(time.getSeconds()).padStart(2, '0');
  const timeStr = `${hoursStr}:${minutesStr}:${secondsStr}`;

  const sun = useMemo(() => getSunTimes(time), [time.getDate()]);
  const weekday = time.toLocaleDateString('en-US', { weekday: 'long' });
  const month = time.toLocaleDateString('en-US', { month: 'short' });
  const day = time.getDate();
  const year = time.getFullYear();

  return (
    <div className="minimal-clock-card">
      <div className="minimal-clock-time">{timeStr}</div>

      <div className="minimal-clock-subinfo">
        <div className="minimal-clock-sun">
          {sun.rise} – {sun.set} ({sun.duration})
        </div>
        <div className="minimal-clock-date">
          {weekday}, {month} {day} {year}
        </div>
      </div>

      <div className="minimal-clock-footer">
        <div className="minimal-clock-toggle" role="group" aria-label="Format">
          <button
            type="button"
            className={`minimal-toggle-btn ${!is24h ? 'active' : ''}`}
            onClick={() => setIs24h(false)}
          >
            12h
          </button>
          <button
            type="button"
            className={`minimal-toggle-btn ${is24h ? 'active' : ''}`}
            onClick={() => setIs24h(true)}
          >
            24h
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(FuturisticHudClock);
