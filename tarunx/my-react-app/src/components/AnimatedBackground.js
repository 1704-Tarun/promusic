import React from 'react';
import { useTheme } from '@mui/material/styles';

function AnimatedBackground() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  // Colors for dark/light
  const color1 = isDark ? '#23272f' : '#e0ffe0';
  const color2 = isDark ? '#1ed760' : '#1ed760';
  const color3 = isDark ? '#181a20' : '#f5f5f5';

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        transition: 'background 0.5s',
      }}
      viewBox="0 0 1440 900"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="bgwave" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color1} />
          <stop offset="100%" stopColor={color2} />
        </linearGradient>
      </defs>
      <g>
        <path>
          <animate attributeName="d" dur="8s" repeatCount="indefinite"
            values="M0,600 Q360,500 720,600 T1440,600 V900 H0Z;
                    M0,600 Q360,700 720,600 T1440,600 V900 H0Z;
                    M0,600 Q360,500 720,600 T1440,600 V900 H0Z" />
        </path>
        <path
          d="M0,600 Q360,500 720,600 T1440,600 V900 H0Z"
          fill="url(#bgwave)"
          opacity="0.7"
        />
        <ellipse cx="1200" cy="200" rx="300" ry="80" fill={color2} opacity="0.08">
          <animate attributeName="cy" values="200;300;200" dur="6s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="400" cy="100" rx="200" ry="60" fill={color2} opacity="0.06">
          <animate attributeName="cy" values="100;180;100" dur="7s" repeatCount="indefinite" />
        </ellipse>
      </g>
      <rect x="0" y="0" width="1440" height="900" fill={color3} opacity="0.5" />
    </svg>
  );
}

export default AnimatedBackground; 