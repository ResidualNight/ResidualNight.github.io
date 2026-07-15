"use client";

import { useEffect, useRef, useState } from "react";

const tracks = [
  {
    title: "Lost in thought",
    artist: "reflex4",
    src: "/music/lost-in-thought.m4a",
    cover: "/music/lost-in-thought-cover.jpg",
    duration: 147.297,
  },
] as const;

function formatTime(value: number) {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState<number>(tracks[0].duration);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.72);
  const track = tracks[trackIndex];

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const changeTrack = (step: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const shouldResume = !audio.paused;
    const nextIndex = (trackIndex + step + tracks.length) % tracks.length;

    setTrackIndex(nextIndex);
    setDuration(tracks[nextIndex].duration);
    setCurrentTime(0);
    audio.currentTime = 0;

    if (shouldResume) {
      window.setTimeout(() => {
        audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      }, 0);
    }
  };

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={track.src}
        preload="metadata"
        onLoadedMetadata={(event) => {
          const value = event.currentTarget.duration;
          if (Number.isFinite(value) && value > 0) setDuration(value);
        }}
        onDurationChange={(event) => {
          const value = event.currentTarget.duration;
          if (Number.isFinite(value) && value > 0) setDuration(value);
        }}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setCurrentTime(0);
        }}
      />

      <img className="track-cover" src={track.cover} alt={`${track.title} 专辑封面`} />

      <div className="track-copy">
        <span>Now playing / Original</span>
        <strong>{track.title}</strong>
        <p>{track.artist}</p>
      </div>

      <div className="transport" aria-label="音乐播放控制">
        <button type="button" onClick={() => changeTrack(-1)} aria-label="上一首">
          ←
        </button>
        <button
          className="play-toggle"
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "暂停" : "播放"}
        >
          {playing ? "Ⅱ" : "▶"}
        </button>
        <button type="button" onClick={() => changeTrack(1)} aria-label="下一首">
          →
        </button>
      </div>

      <div className="track-progress">
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration}
          step="0.1"
          value={Math.min(currentTime, duration)}
          onChange={(event) => {
            const value = Number(event.target.value);
            if (audioRef.current) audioRef.current.currentTime = value;
            setCurrentTime(value);
          }}
          aria-label="播放进度"
        />
        <span>{formatTime(duration)}</span>
      </div>

      <label className="volume-control">
        <span>VOL</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(event) => {
            const value = Number(event.target.value);
            setVolume(value);
            if (audioRef.current) audioRef.current.volume = value;
          }}
          aria-label="音量"
        />
      </label>
    </div>
  );
}
