import { useState, useEffect } from 'react';
import './App.css';

const DEFAULT_PRESETS = [25, 5, 25, 15];
const DEFAULT_NAMES = ['Pomodoro', 'Short Break', 'Pomodoro', 'Long Break'];

const playBeep = () => {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;
  const audioCtx = new AudioContextClass();

  for (let i = 0; i < 2; i++) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime + i * 0.4);

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime + i * 0.4);
    gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + i * 0.4 + 0.05);
    gainNode.gain.setValueAtTime(1, audioCtx.currentTime + i * 0.4 + 0.25);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + i * 0.4 + 0.3);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start(audioCtx.currentTime + i * 0.4);
    oscillator.stop(audioCtx.currentTime + i * 0.4 + 0.3);
  }
};

function App() {
  const [presets, setPresets] = useState<number[]>(() => {
    const saved = localStorage.getItem('pomodoro-presets');
    return saved ? JSON.parse(saved) : DEFAULT_PRESETS;
  });

  const [names, setNames] = useState<string[]>(() => {
    const saved = localStorage.getItem('pomodoro-names');
    return saved ? JSON.parse(saved) : DEFAULT_NAMES;
  });

  const [activeSlot, setActiveSlot] = useState<number>(() => {
    const saved = localStorage.getItem('pomodoro-active-slot');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const saved = localStorage.getItem('pomodoro-time-left');
    return saved ? parseInt(saved, 10) : presets[activeSlot] * 60;
  });

  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState("");

  // Persist state when it changes
  useEffect(() => {
    localStorage.setItem('pomodoro-presets', JSON.stringify(presets));
  }, [presets]);

  useEffect(() => {
    localStorage.setItem('pomodoro-names', JSON.stringify(names));
  }, [names]);

  useEffect(() => {
    localStorage.setItem('pomodoro-active-slot', activeSlot.toString());
  }, [activeSlot]);

  useEffect(() => {
    localStorage.setItem('pomodoro-time-left', timeLeft.toString());
  }, [timeLeft]);

  // Timer tick
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playBeep();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, activeSlot, presets]);

  const toggleTimer = () => {
    if (isEditing) saveEdit();
    setIsRunning(!isRunning);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    window.close();
  };

  const startEdit = () => {
    if (!isRunning) {
      setEditValue(Math.floor(timeLeft / 60).toString());
      setIsEditing(true);
    }
  };

  const saveEdit = () => {
    const min = parseInt(editValue);
    if (!isNaN(min) && min > 0) {
      const newPresets = [...presets];
      newPresets[activeSlot] = min;
      setPresets(newPresets);
      setTimeLeft(min * 60);
    }
    setIsEditing(false);
  };

  const startEditName = () => {
    setEditNameValue(names[activeSlot]);
    setIsEditingName(true);
  };

  const saveEditName = () => {
    if (editNameValue.trim()) {
      const newNames = [...names];
      newNames[activeSlot] = editNameValue.trim();
      setNames(newNames);
    }
    setIsEditingName(false);
  };

  const switchSlot = (index: number) => {
    if (index === activeSlot) return;
    setIsRunning(false);
    setActiveSlot(index);
    setTimeLeft(presets[index] * 60);
    if (isEditing) setIsEditing(false);
  };

  return (
    <div className="app-container">
      <div className="widget">
        <button className="close-btn" onClick={handleClose}>×</button>

        {isEditingName ? (
          <input
            type="text"
            className="title-input"
            value={editNameValue}
            onChange={(e) => setEditNameValue(e.target.value)}
            onBlur={saveEditName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEditName();
              if (e.key === 'Escape') setIsEditingName(false);
            }}
            autoFocus
          />
        ) : (
          <h2 className="title" onClick={startEditName} title="Click to edit name">
            {names[activeSlot]}
          </h2>
        )}

        {isEditing ? (
          <input
            type="number"
            className="timer-input"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit();
              if (e.key === 'Escape') setIsEditing(false);
            }}
            autoFocus
          />
        ) : (
          <div className="timer" onClick={startEdit} title="Click to edit minutes">
            {formatTime(timeLeft)}
          </div>
        )}

        <div className="dots">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`dot ${index === activeSlot ? 'active' : ''} ${index < activeSlot ? 'completed' : ''}`}
              onClick={() => switchSlot(index)}
              title={`Switch to slot ${index + 1}`}
            ></div>
          ))}
        </div>
        <div className="controls">
          <button className="play-btn" onClick={toggleTimer}>
            {isRunning ? (
              <div className="pause-icon">
                <div className="pause-bar"></div>
                <div className="pause-bar"></div>
              </div>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5V19L19 12L8 5Z" fill="#1b5e40" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
