import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ShoppingBag, Scissors, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// ── Flores SVG realistas ─────────────────────────────────────────────────────

const Daisy = ({ size = 120 }) => (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i / 14) * 360;
            const rad = (angle * Math.PI) / 180;
            const px = 60 + Math.cos(rad) * 32;
            const py = 60 + Math.sin(rad) * 32;
            return (
                <ellipse key={i} cx={px} cy={py} rx="7" ry="19"
                    fill="white" opacity="0.96"
                    transform={`rotate(${angle + 90} ${px} ${py})`}
                    style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.18))' }}
                />
            );
        })}
        <circle cx="60" cy="60" r="15" fill="#f59e0b" />
        <circle cx="60" cy="60" r="11" fill="#d97706" />
        {Array.from({ length: 9 }).map((_, i) => {
            const a = (i / 9) * 360;
            const r = (a * Math.PI) / 180;
            return <circle key={i} cx={60 + Math.cos(r) * 6.5} cy={60 + Math.sin(r) * 6.5} r="1.8" fill="#92400e" opacity="0.55" />;
        })}
    </svg>
);

const Rose = ({ size = 120, color = '#f43f5e' }) => {
    const dark = color === '#f43f5e' ? '#be123c' : color === '#fb923c' ? '#c2410c' : '#7e22ce';
    const light = color === '#f43f5e' ? '#fda4af' : color === '#fb923c' ? '#fdba74' : '#d8b4fe';
    return (
        <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
            {[0, 51, 102, 153, 204, 255, 306].map((angle, i) => (
                <ellipse key={i} cx="60" cy="60" rx="22" ry="30"
                    fill={color} opacity={0.5 - i * 0.04}
                    transform={`rotate(${angle} 60 60) translate(0 -12)`} />
            ))}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <ellipse key={i} cx="60" cy="60" rx="16" ry="22"
                    fill={color} opacity={0.72}
                    transform={`rotate(${angle} 60 60) translate(0 -7)`} />
            ))}
            <circle cx="60" cy="60" r="16" fill={color} opacity="0.9" />
            <circle cx="60" cy="60" r="10" fill={dark} opacity="0.85" />
            <circle cx="60" cy="60" r="5" fill={dark} />
            <ellipse cx="55" cy="55" rx="4" ry="6" fill={light} opacity="0.35" transform="rotate(-30 55 55)" />
        </svg>
    );
};

const Wildflower = ({ size = 90, color = '#a855f7' }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * 360;
            const rad = (angle * Math.PI) / 180;
            const px = 50 + Math.cos(rad) * 26;
            const py = 50 + Math.sin(rad) * 26;
            return (
                <ellipse key={i} cx={px} cy={py} rx="8" ry="15"
                    fill={color} opacity="0.88"
                    transform={`rotate(${angle + 90} ${px} ${py})`} />
            );
        })}
        <circle cx="50" cy="50" r="10" fill="#fef9c3" />
        <circle cx="50" cy="50" r="6" fill="#fde047" />
    </svg>
);

const Anemone = ({ size = 100 }) => (
    <svg width={size} height={size} viewBox="0 0 110 110" fill="none">
        {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * 360;
            const rad = (angle * Math.PI) / 180;
            const px = 55 + Math.cos(rad) * 28;
            const py = 55 + Math.sin(rad) * 28;
            return (
                <ellipse key={i} cx={px} cy={py} rx="9" ry="20"
                    fill="#fce7f3" opacity="0.92"
                    transform={`rotate(${angle + 90} ${px} ${py})`} />
            );
        })}
        <circle cx="55" cy="55" r="14" fill="#1e1b4b" />
        {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * 360;
            const r = (a * Math.PI) / 180;
            return <circle key={i} cx={55 + Math.cos(r) * 8} cy={55 + Math.sin(r) * 8} r="2" fill="#a5b4fc" opacity="0.9" />;
        })}
        <circle cx="55" cy="55" r="4" fill="#c7d2fe" />
    </svg>
);

const Ranunculus = ({ size = 110, color = '#fb7185' }) => (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        {[28, 22, 17, 13, 9].map((r, layer) => (
            Array.from({ length: 8 - layer }).map((_, i) => {
                const angle = (i / (8 - layer)) * 360 + layer * 15;
                const rad = (angle * Math.PI) / 180;
                const dist = r * 0.7;
                return (
                    <ellipse key={`${layer}-${i}`}
                        cx={60 + Math.cos(rad) * dist}
                        cy={60 + Math.sin(rad) * dist}
                        rx={6 - layer * 0.5} ry={r - layer * 2}
                        fill={color} opacity={0.5 + layer * 0.1}
                        transform={`rotate(${angle + 90} ${60 + Math.cos(rad) * dist} ${60 + Math.sin(rad) * dist})`} />
                );
            })
        ))}
        <circle cx="60" cy="60" r="7" fill={color} opacity="0.95" />
    </svg>
);

// ── 96 flores cubriendo toda la pantalla ────────────────────────────────────
const FLOWERS = [
    { id: 1, type: 'daisy', x: 3, y: -2, s: 1.1, rot: 12, tx: -180, ty: -200, delay: 0 },
    { id: 2, type: 'rose', x: 12, y: -1, s: 0.9, rot: -8, tx: -80, ty: -220, delay: 0.08, color: '#f43f5e' },
    { id: 3, type: 'daisy', x: 22, y: -3, s: 1.0, rot: 25, tx: 20, ty: -200, delay: 0.04 },
    { id: 4, type: 'wildflower', x: 32, y: 0, s: 0.85, rot: -15, tx: 60, ty: -180, delay: 0.12, color: '#a855f7' },
    { id: 5, type: 'daisy', x: 42, y: -2, s: 1.2, rot: 5, tx: 100, ty: -210, delay: 0.02 },
    { id: 6, type: 'rose', x: 54, y: -1, s: 0.95, rot: -20, tx: 140, ty: -190, delay: 0.10, color: '#fb923c' },
    { id: 7, type: 'daisy', x: 65, y: -3, s: 1.05, rot: 18, tx: 180, ty: -215, delay: 0.06 },
    { id: 8, type: 'anemone', x: 75, y: 0, s: 0.9, rot: -5, tx: 220, ty: -180, delay: 0.14 },
    { id: 9, type: 'daisy', x: 85, y: -2, s: 1.1, rot: 30, tx: 260, ty: -200, delay: 0.03 },
    { id: 10, type: 'ranunculus', x: 94, y: -1, s: 0.88, rot: -12, tx: 300, ty: -190, delay: 0.09, color: '#e879f9' },
    { id: 11, type: 'daisy', x: 0, y: 10, s: 1.15, rot: -8, tx: -220, ty: -80, delay: 0.05 },
    { id: 12, type: 'rose', x: 9, y: 12, s: 1.0, rot: 15, tx: -140, ty: -60, delay: 0.13, color: '#f43f5e' },
    { id: 13, type: 'daisy', x: 19, y: 9, s: 0.9, rot: -22, tx: -60, ty: -90, delay: 0.07 },
    { id: 14, type: 'daisy', x: 30, y: 13, s: 1.2, rot: 8, tx: 40, ty: -70, delay: 0.01 },
    { id: 15, type: 'wildflower', x: 40, y: 10, s: 0.85, rot: -18, tx: 80, ty: -100, delay: 0.11, color: '#6366f1' },
    { id: 16, type: 'daisy', x: 50, y: 12, s: 1.0, rot: 28, tx: 120, ty: -80, delay: 0.03 },
    { id: 17, type: 'rose', x: 60, y: 9, s: 1.1, rot: -10, tx: 170, ty: -90, delay: 0.15, color: '#fb923c' },
    { id: 18, type: 'daisy', x: 70, y: 11, s: 0.95, rot: 20, tx: 210, ty: -70, delay: 0.09 },
    { id: 19, type: 'anemone', x: 80, y: 10, s: 0.9, rot: -5, tx: 250, ty: -85, delay: 0.04 },
    { id: 20, type: 'daisy', x: 90, y: 13, s: 1.05, rot: 15, tx: 290, ty: -65, delay: 0.12 },
    { id: 21, type: 'rose', x: 4, y: 22, s: 1.0, rot: -18, tx: -200, ty: 20, delay: 0.06, color: '#f43f5e' },
    { id: 22, type: 'daisy', x: 14, y: 20, s: 1.15, rot: 10, tx: -120, ty: 10, delay: 0.14 },
    { id: 23, type: 'daisy', x: 25, y: 23, s: 0.9, rot: -5, tx: -30, ty: 30, delay: 0.02 },
    { id: 24, type: 'ranunculus', x: 36, y: 20, s: 1.05, rot: 22, tx: 50, ty: 15, delay: 0.10, color: '#f43f5e' },
    { id: 25, type: 'daisy', x: 47, y: 22, s: 1.2, rot: -12, tx: 100, ty: 25, delay: 0.05 },
    { id: 26, type: 'daisy', x: 57, y: 20, s: 0.85, rot: 30, tx: 150, ty: 10, delay: 0.13 },
    { id: 27, type: 'wildflower', x: 67, y: 23, s: 1.0, rot: -8, tx: 190, ty: 30, delay: 0.07, color: '#a855f7' },
    { id: 28, type: 'daisy', x: 77, y: 21, s: 1.1, rot: 16, tx: 240, ty: 15, delay: 0.01 },
    { id: 29, type: 'rose', x: 88, y: 22, s: 0.95, rot: -25, tx: 280, ty: 20, delay: 0.09, color: '#e879f9' },
    { id: 30, type: 'daisy', x: 1, y: 33, s: 1.1, rot: 8, tx: -230, ty: 100, delay: 0.04 },
    { id: 31, type: 'anemone', x: 11, y: 31, s: 0.9, rot: -15, tx: -150, ty: 90, delay: 0.12 },
    { id: 32, type: 'daisy', x: 21, y: 34, s: 1.05, rot: 20, tx: -60, ty: 110, delay: 0.06 },
    { id: 33, type: 'daisy', x: 32, y: 32, s: 1.2, rot: -6, tx: 30, ty: 95, delay: 0.14 },
    { id: 34, type: 'rose', x: 43, y: 33, s: 0.9, rot: 28, tx: 90, ty: 105, delay: 0.02, color: '#fb923c' },
    { id: 35, type: 'daisy', x: 53, y: 31, s: 1.0, rot: -18, tx: 140, ty: 88, delay: 0.10 },
    { id: 36, type: 'daisy', x: 63, y: 34, s: 1.15, rot: 12, tx: 190, ty: 100, delay: 0.05 },
    { id: 37, type: 'ranunculus', x: 73, y: 32, s: 0.88, rot: -22, tx: 240, ty: 92, delay: 0.13, color: '#f43f5e' },
    { id: 38, type: 'daisy', x: 83, y: 33, s: 1.05, rot: 5, tx: 285, ty: 105, delay: 0.07 },
    { id: 39, type: 'wildflower', x: 93, y: 31, s: 0.95, rot: -10, tx: 320, ty: 90, delay: 0.01, color: '#6366f1' },
    { id: 40, type: 'daisy', x: 5, y: 44, s: 1.0, rot: -20, tx: -210, ty: 180, delay: 0.09 },
    { id: 41, type: 'rose', x: 16, y: 42, s: 1.1, rot: 14, tx: -130, ty: 170, delay: 0.03, color: '#f43f5e' },
    { id: 42, type: 'daisy', x: 27, y: 45, s: 0.9, rot: -8, tx: -40, ty: 190, delay: 0.11 },
    { id: 43, type: 'daisy', x: 38, y: 43, s: 1.2, rot: 25, tx: 60, ty: 175, delay: 0.05 },
    { id: 44, type: 'anemone', x: 49, y: 44, s: 0.95, rot: -15, tx: 110, ty: 185, delay: 0.13 },
    { id: 45, type: 'daisy', x: 59, y: 42, s: 1.05, rot: 10, tx: 160, ty: 170, delay: 0.07 },
    { id: 46, type: 'daisy', x: 69, y: 45, s: 1.15, rot: -28, tx: 210, ty: 185, delay: 0.01 },
    { id: 47, type: 'rose', x: 79, y: 43, s: 0.88, rot: 18, tx: 255, ty: 175, delay: 0.15, color: '#e879f9' },
    { id: 48, type: 'daisy', x: 89, y: 44, s: 1.0, rot: -5, tx: 300, ty: 180, delay: 0.08 },
    { id: 49, type: 'daisy', x: 2, y: 55, s: 1.1, rot: 22, tx: -220, ty: 260, delay: 0.06 },
    { id: 50, type: 'wildflower', x: 13, y: 53, s: 0.9, rot: -12, tx: -140, ty: 250, delay: 0.14, color: '#a855f7' },
    { id: 51, type: 'daisy', x: 24, y: 56, s: 1.05, rot: 8, tx: -50, ty: 270, delay: 0.04 },
    { id: 52, type: 'rose', x: 35, y: 54, s: 1.2, rot: -22, tx: 50, ty: 255, delay: 0.12, color: '#f43f5e' },
    { id: 53, type: 'daisy', x: 46, y: 55, s: 0.88, rot: 15, tx: 100, ty: 265, delay: 0.02 },
    { id: 54, type: 'daisy', x: 56, y: 53, s: 1.0, rot: -5, tx: 150, ty: 250, delay: 0.10 },
    { id: 55, type: 'ranunculus', x: 66, y: 56, s: 1.1, rot: 28, tx: 200, ty: 260, delay: 0.05, color: '#fb923c' },
    { id: 56, type: 'daisy', x: 76, y: 54, s: 0.95, rot: -18, tx: 248, ty: 252, delay: 0.13 },
    { id: 57, type: 'anemone', x: 86, y: 55, s: 1.05, rot: 10, tx: 292, ty: 262, delay: 0.07 },
    { id: 58, type: 'daisy', x: 95, y: 53, s: 0.9, rot: -25, tx: 330, ty: 250, delay: 0.01 },
    { id: 59, type: 'daisy', x: 7, y: 65, s: 1.0, rot: -10, tx: -200, ty: 330, delay: 0.09 },
    { id: 60, type: 'rose', x: 18, y: 64, s: 1.15, rot: 20, tx: -120, ty: 320, delay: 0.03, color: '#fb923c' },
    { id: 61, type: 'daisy', x: 29, y: 66, s: 0.9, rot: -5, tx: -30, ty: 340, delay: 0.11 },
    { id: 62, type: 'daisy', x: 40, y: 64, s: 1.2, rot: 15, tx: 70, ty: 325, delay: 0.05 },
    { id: 63, type: 'wildflower', x: 51, y: 65, s: 0.88, rot: -28, tx: 120, ty: 335, delay: 0.13, color: '#6366f1' },
    { id: 64, type: 'daisy', x: 61, y: 63, s: 1.05, rot: 8, tx: 170, ty: 320, delay: 0.07 },
    { id: 65, type: 'daisy', x: 71, y: 66, s: 1.1, rot: -18, tx: 220, ty: 335, delay: 0.01 },
    { id: 66, type: 'rose', x: 81, y: 64, s: 0.95, rot: 25, tx: 268, ty: 322, delay: 0.15, color: '#f43f5e' },
    { id: 67, type: 'daisy', x: 91, y: 65, s: 1.0, rot: -8, tx: 312, ty: 330, delay: 0.08 },
    { id: 68, type: 'daisy', x: 3, y: 76, s: 1.1, rot: 18, tx: -215, ty: 400, delay: 0.04 },
    { id: 69, type: 'anemone', x: 14, y: 75, s: 0.88, rot: -12, tx: -135, ty: 395, delay: 0.12 },
    { id: 70, type: 'daisy', x: 25, y: 77, s: 1.0, rot: 5, tx: -45, ty: 410, delay: 0.06 },
    { id: 71, type: 'ranunculus', x: 36, y: 75, s: 1.15, rot: -25, tx: 55, ty: 398, delay: 0.14, color: '#e879f9' },
    { id: 72, type: 'daisy', x: 47, y: 76, s: 0.9, rot: 12, tx: 105, ty: 408, delay: 0.02 },
    { id: 73, type: 'daisy', x: 57, y: 74, s: 1.2, rot: -20, tx: 158, ty: 395, delay: 0.10 },
    { id: 74, type: 'rose', x: 67, y: 77, s: 0.95, rot: 28, tx: 208, ty: 408, delay: 0.05, color: '#f43f5e' },
    { id: 75, type: 'daisy', x: 77, y: 75, s: 1.05, rot: -8, tx: 255, ty: 396, delay: 0.13 },
    { id: 76, type: 'wildflower', x: 87, y: 76, s: 1.0, rot: 15, tx: 300, ty: 406, delay: 0.07, color: '#a855f7' },
    { id: 77, type: 'daisy', x: 96, y: 74, s: 1.1, rot: -5, tx: 340, ty: 394, delay: 0.01 },
    { id: 78, type: 'daisy', x: 8, y: 86, s: 0.9, rot: -15, tx: -205, ty: 470, delay: 0.09 },
    { id: 79, type: 'rose', x: 19, y: 85, s: 1.1, rot: 22, tx: -125, ty: 465, delay: 0.03, color: '#fb923c' },
    { id: 80, type: 'daisy', x: 30, y: 87, s: 1.05, rot: -8, tx: -35, ty: 478, delay: 0.11 },
    { id: 81, type: 'daisy', x: 41, y: 85, s: 1.2, rot: 18, tx: 65, ty: 466, delay: 0.05 },
    { id: 82, type: 'anemone', x: 52, y: 86, s: 0.88, rot: -28, tx: 116, ty: 474, delay: 0.13 },
    { id: 83, type: 'daisy', x: 62, y: 84, s: 1.0, rot: 10, tx: 166, ty: 464, delay: 0.07 },
    { id: 84, type: 'daisy', x: 72, y: 87, s: 1.15, rot: -20, tx: 216, ty: 476, delay: 0.01 },
    { id: 85, type: 'ranunculus', x: 82, y: 85, s: 0.95, rot: 5, tx: 262, ty: 466, delay: 0.15, color: '#f43f5e' },
    { id: 86, type: 'daisy', x: 92, y: 86, s: 1.0, rot: -15, tx: 306, ty: 474, delay: 0.08 },
    { id: 87, type: 'daisy', x: 4, y: 95, s: 1.05, rot: 20, tx: -218, ty: 540, delay: 0.06 },
    { id: 88, type: 'wildflower', x: 15, y: 96, s: 0.9, rot: -10, tx: -140, ty: 548, delay: 0.14, color: '#6366f1' },
    { id: 89, type: 'daisy', x: 26, y: 94, s: 1.1, rot: 8, tx: -50, ty: 538, delay: 0.04 },
    { id: 90, type: 'rose', x: 37, y: 96, s: 1.0, rot: -22, tx: 50, ty: 546, delay: 0.12, color: '#f43f5e' },
    { id: 91, type: 'daisy', x: 48, y: 95, s: 1.2, rot: 15, tx: 102, ty: 540, delay: 0.02 },
    { id: 92, type: 'daisy', x: 58, y: 93, s: 0.88, rot: -5, tx: 152, ty: 532, delay: 0.10 },
    { id: 93, type: 'rose', x: 68, y: 96, s: 1.05, rot: 28, tx: 202, ty: 545, delay: 0.05, color: '#e879f9' },
    { id: 94, type: 'daisy', x: 78, y: 94, s: 1.1, rot: -18, tx: 250, ty: 536, delay: 0.13 },
    { id: 95, type: 'anemone', x: 88, y: 95, s: 0.95, rot: 10, tx: 296, ty: 544, delay: 0.07 },
    { id: 96, type: 'daisy', x: 97, y: 93, s: 1.0, rot: -25, tx: 338, ty: 534, delay: 0.01 },
];

const RENDER = {
    daisy: (size, color) => <Daisy size={size} />,
    rose: (size, color) => <Rose size={size} color={color || '#f43f5e'} />,
    wildflower: (size, color) => <Wildflower size={size} color={color || '#a855f7'} />,
    anemone: (size, color) => <Anemone size={size} />,
    ranunculus: (size, color) => <Ranunculus size={size} color={color || '#fb7185'} />,
};

function FlowerIntro({ onComplete }) {
    const [scatter, setScatter] = useState(false);
    const [done, setDone] = useState(false);

    useEffect(() => {
        const t1 = setTimeout(() => setScatter(true), 950);
        const t2 = setTimeout(() => { setDone(true); onComplete(); }, 2900);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    if (done) return null;

    return (
        <div className="fixed inset-0 z-[100] overflow-hidden" style={{ background: '#fdf2f899', pointerEvents: 'none' }}>
            {FLOWERS.map((f) => {
                const baseSize = 110 * f.s;
                return (
                    <div
                        key={f.id}
                        style={{
                            position: 'absolute',
                            left: `${f.x}%`,
                            top: `${f.y}%`,
                            width: baseSize,
                            height: baseSize,
                            transform: scatter
                                ? `translate(calc(-50% + ${f.tx}px), calc(-50% + ${f.ty}px)) scale(${f.s * 0.25}) rotate(${f.rot + (f.id % 2 === 0 ? 45 : -45)}deg)`
                                : `translate(-50%, -50%) scale(${f.s}) rotate(${f.rot}deg)`,
                            opacity: scatter ? 0 : 1,
                            transition: scatter
                                ? `transform 1.5s cubic-bezier(0.55, 0, 1, 1) ${f.delay}s, opacity 0.75s ease-in ${f.delay + 0.18}s`
                                : 'none',
                            willChange: 'transform, opacity',
                        }}
                    >
                        {RENDER[f.type](baseSize, f.color)}
                    </div>
                );
            })}
        </div>
    );
}

export default function Home() {
    const [introDone, setIntroDone] = useState(false);

    return (
        <div className="min-h-screen bg-rose-50/20 font-sans">
            <FlowerIntro onComplete={() => setIntroDone(true)} />

            <div style={{ opacity: introDone ? 1 : 0, transition: 'opacity 0.7s ease' }}>
                <Navbar />
            </div>

            {/* Hero */}
            <div className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/salon-hero.jpg"
                        alt="Salon Background"
                        className="w-full h-full object-cover object-top opacity-80"
                        style={{ objectPosition: 'center 35%' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto" style={{
                    opacity: introDone ? 1 : 0,
                    transform: introDone ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s',
                }}>
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-rose-200 text-xs font-bold uppercase tracking-widest mb-6 border border-white/20 shadow-lg">
                        <Star size={12} className="text-amber-400 fill-current" /> Estilo & Bienestar
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-black text-white mb-6 tracking-tight drop-shadow-lg leading-tight">
                        Tu mejor versión <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-amber-200">empieza aquí.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto font-light leading-relaxed mb-10 drop-shadow-md">
                        Expertos en color, corte y cuidado capilar.<br className="hidden md:block" />
                        Reservá tu turno online y disfrutá de una experiencia única.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/turnos" className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 px-10 rounded-full transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3 text-lg">
                            <Calendar size={22} /> Reservar Turno
                        </Link>
                        <Link to="/tienda" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold py-4 px-10 rounded-full transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg group">
                            <ShoppingBag size={22} className="group-hover:rotate-12 transition-transform" /> Ver Tienda
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="py-20 bg-white" style={{ opacity: introDone ? 1 : 0, transition: 'opacity 0.8s ease 0.3s' }}>
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="p-6">
                        <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-500 shadow-sm rotate-3 hover:rotate-6 transition-transform">
                            <Scissors size={32} />
                        </div>
                        <h3 className="text-xl font-serif font-bold text-zinc-900 mb-3">Profesionales</h3>
                        <p className="text-zinc-500 leading-relaxed">Nuestro equipo se capacita constantemente para traerte las últimas tendencias.</p>
                    </div>
                    <div className="p-6">
                        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-500 shadow-sm -rotate-3 hover:-rotate-6 transition-transform">
                            <Star size={32} />
                        </div>
                        <h3 className="text-xl font-serif font-bold text-zinc-900 mb-3">Productos Premium</h3>
                        <p className="text-zinc-500 leading-relaxed">Usamos marcas internacionales para garantizar la salud de tu cabello.</p>
                    </div>
                    <div className="p-6">
                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-500 shadow-sm rotate-3 hover:rotate-6 transition-transform">
                            <Calendar size={32} />
                        </div>
                        <h3 className="text-xl font-serif font-bold text-zinc-900 mb-3">Turnos Online</h3>
                        <p className="text-zinc-500 leading-relaxed">Olvídate de llamar. Elegí tu horario y servicio desde tu celular en segundos.</p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}