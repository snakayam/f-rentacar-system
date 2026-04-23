import React, { useState, useRef, useEffect, useCallback } from 'react';

// ============================================================
// Fレンタカー 業務管理システム - スマホUI改善版
// ============================================================

// ---------- 定数データ ----------
const STAFF = [
  { id: 1, name: '中山', role: 'manager' },
  { id: 2, name: '田中', role: 'staff' },
  { id: 3, name: '佐藤', role: 'staff' },
  { id: 4, name: '鈴木', role: 'manager' },
  { id: 5, name: '高橋', role: 'staff' },
  { id: 6, name: '伊藤', role: 'staff' },
  { id: 7, name: '渡辺', role: 'staff' },
  { id: 8, name: '山本', role: 'staff' },
];

const VEHICLE_TYPES = {
  sedan: { label: 'セダン', color: '#3B82F6' },
  minivan: { label: 'ミニバン', color: '#10B981' },
  van: { label: 'バン', color: '#F59E0B' },
  truck: { label: 'トラック', color: '#EF4444' },
};

const DAMAGE_TYPES = {
  dent: { label: 'ヘコミ', color: '#EF4444', symbol: 'H' },
  paint: { label: 'ペイント', color: '#3B82F6', symbol: 'P' },
  ekubo: { label: 'エクボ', color: '#F59E0B', symbol: 'E' },
};

const INSPECTION_CATEGORIES = [
  {
    name: 'エンジンルーム',
    icon: '⚙️',
    items: [
      { id: 'oil', label: 'エンジンオイル', types: ['sedan', 'minivan', 'van', 'truck'] },
      { id: 'coolant', label: '冷却水', types: ['sedan', 'minivan', 'van', 'truck'] },
      { id: 'battery', label: 'バッテリー', types: ['sedan', 'minivan', 'van', 'truck'] },
      { id: 'belt', label: 'ベルト類', types: ['sedan', 'minivan', 'van', 'truck'] },
      { id: 'washer', label: 'ウォッシャー液', types: ['sedan', 'minivan', 'van', 'truck'] },
    ],
  },
  {
    name: '運転席',
    icon: '🪑',
    items: [
      { id: 'brake', label: 'ブレーキペダル', types: ['sedan', 'minivan', 'van', 'truck'] },
      { id: 'parking', label: 'パーキングブレーキ', types: ['sedan', 'minivan', 'van', 'truck'] },
      { id: 'steering', label: 'ステアリング', types: ['sedan', 'minivan', 'van', 'truck'] },
      { id: 'meter', label: 'メーター表示', types: ['sedan', 'minivan', 'van', 'truck'] },
      { id: 'horn', label: 'ホーン', types: ['sedan', 'minivan', 'van', 'truck'] },
      { id: 'wiper', label: 'ワイパー', types: ['sedan', 'minivan', 'van', 'truck'] },
    ],
  },
  {
    name: '車両周り',
    icon: '🚗',
    items: [
      { id: 'tire_fl', label: '前左タイヤ', types: ['sedan', 'minivan', 'van', 'truck'] },
      { id: 'tire_fr', label: '前右タイヤ', types: ['sedan', 'minivan', 'van', 'truck'] },
      { id: 'tire_rl', label: '後左タイヤ', types: ['sedan', 'minivan', 'van', 'truck'] },
      { id: 'tire_rr', label: '後右タイヤ', types: ['sedan', 'minivan', 'van', 'truck'] },
      { id: 'headlight', label: 'ヘッドライト', types: ['sedan', 'minivan', 'van', 'truck'] },
      { id: 'taillight', label: 'テールランプ', types: ['sedan', 'minivan', 'van', 'truck'] },
      { id: 'turn_signal', label: 'ウインカー', types: ['sedan', 'minivan', 'van', 'truck'] },
    ],
  },
  {
    name: '装備品',
    icon: '📋',
    items: [
      { id: 'jack', label: 'ジャッキ', types: ['sedan', 'minivan', 'van', 'truck'] },
      { id: 'wrench', label: 'レンチ', types: ['sedan', 'minivan', 'van', 'truck'] },
      { id: 'triangle', label: '三角表示板', types: ['sedan', 'minivan', 'van', 'truck'] },
      { id: 'spare', label: 'スペアタイヤ', types: ['sedan', 'minivan', 'van', 'truck'] },
      { id: 'navi', label: 'ナビ', types: ['sedan', 'minivan', 'van'] },
      { id: 'etc', label: 'ETC', types: ['sedan', 'minivan', 'van'] },
      { id: 'dashcam', label: 'ドラレコ', types: ['sedan', 'minivan', 'van'] },
    ],
  },
  {
    name: '内装',
    icon: '✨',
    items: [
      { id: 'seat', label: 'シート状態', types: ['sedan', 'minivan', 'van', 'truck'] },
      { id: 'floor', label: 'フロアマット', types: ['sedan', 'minivan', 'van', 'truck'] },
      { id: 'aircon', label: 'エアコン', types: ['sedan', 'minivan', 'van', 'truck'] },
      { id: 'cigarette', label: '車内臭い', types: ['sedan', 'minivan', 'van', 'truck'] },
      { id: 'trunk', label: 'トランク内', types: ['sedan', 'minivan', 'van'] },
      { id: 'cargo', label: '荷台', types: ['truck'] },
    ],
  },
];

// ---------- 初期データ ----------
const createInitialVehicles = () => [
  { id: 1, plate: '横浜 500 あ 1234', type: 'sedan', name: 'カローラ', color: '白', inspected: false },
  { id: 2, plate: '横浜 500 い 2345', type: 'sedan', name: 'カローラ', color: '黒', inspected: true },
  { id: 3, plate: '横浜 500 う 3456', type: 'sedan', name: 'クラウン', color: '白', inspected: false },
  { id: 4, plate: '横浜 300 え 4567', type: 'minivan', name: 'ノア', color: '白', inspected: true },
  { id: 5, plate: '横浜 300 お 5678', type: 'minivan', name: 'ノア', color: '銀', inspected: false },
  { id: 6, plate: '横浜 300 か 6789', type: 'minivan', name: 'ヴォクシー', color: '黒', inspected: true },
  { id: 7, plate: '横浜 300 き 7890', type: 'minivan', name: 'アルファード', color: '白', inspected: false },
  { id: 8, plate: '横浜 300 く 8901', type: 'minivan', name: 'セレナ', color: '青', inspected: true },
  { id: 9, plate: '横浜 400 け 9012', type: 'van', name: 'ハイエース', color: '白', inspected: false },
  { id: 10, plate: '横浜 400 こ 0123', type: 'van', name: 'ハイエース', color: '白', inspected: true },
  { id: 11, plate: '横浜 400 さ 1235', type: 'van', name: 'キャラバン', color: '白', inspected: false },
  { id: 12, plate: '横浜 400 し 2346', type: 'van', name: 'キャラバン', color: '銀', inspected: true },
  { id: 13, plate: '横浜 400 す 3457', type: 'van', name: 'ハイエース', color: '黒', inspected: false },
  { id: 14, plate: '横浜 100 せ 4568', type: 'truck', name: 'ダイナ', color: '白', inspected: true },
  { id: 15, plate: '横浜 100 そ 5679', type: 'truck', name: 'ダイナ', color: '白', inspected: false },
  { id: 16, plate: '横浜 100 た 6780', type: 'truck', name: 'キャンター', color: '白', inspected: true },
  { id: 17, plate: '横浜 100 ち 7891', type: 'truck', name: 'キャンター', color: '青', inspected: false },
  { id: 18, plate: '横浜 500 つ 8902', type: 'sedan', name: 'プリウス', color: '白', inspected: true },
  { id: 19, plate: '横浜 300 て 9013', type: 'minivan', name: 'ステップワゴン', color: '白', inspected: false },
  { id: 20, plate: '横浜 400 と 0124', type: 'van', name: 'ハイエース', color: '白', inspected: true },
];

const createInitialDispatches = () => [
  { id: 1, vehicleId: 2, driverId: 2, type: 'deliver', time: '09:00', destination: '横浜駅西口', status: 'completed', returnMethod: 'train', customer: '山田様' },
  { id: 2, vehicleId: 4, driverId: 3, type: 'deliver', time: '10:30', destination: '新横浜駅', status: 'in_progress', returnMethod: 'bus', customer: '佐々木様' },
  { id: 3, vehicleId: 6, driverId: 5, type: 'collect', time: '11:00', destination: '関内駅前', status: 'pending', returnMethod: 'pickup', customer: '鈴木様' },
  { id: 4, vehicleId: 10, driverId: 6, type: 'deliver', time: '13:00', destination: '東戸塚駅', status: 'pending', returnMethod: 'train', customer: '田村様' },
  { id: 5, vehicleId: 14, driverId: 7, type: 'collect', time: '14:30', destination: '戸塚駅東口', status: 'pending', returnMethod: 'bus', customer: '高田様' },
];

const createInitialDamages = () => [
  { id: 1, vehicleId: 2, x: 150, y: 80, type: 'dent', note: '右フェンダー凹み', date: '2024-12-01', isNew: false },
  { id: 2, vehicleId: 4, x: 60, y: 120, type: 'paint', note: '左ドア擦り傷', date: '2024-12-15', isNew: false },
  { id: 3, vehicleId: 9, x: 200, y: 60, type: 'ekubo', note: 'ルーフ小凹み', date: '2025-01-05', isNew: false },
  { id: 4, vehicleId: 14, x: 240, y: 140, type: 'dent', note: 'リアバンパー凹み', date: '2025-01-10', isNew: false },
];

// ---------- SVG車両イラスト ----------
const VehicleSVG = ({ type, width = 300, height = 200 }) => {
  const svgs = {
    sedan: (
      <g>
        <ellipse cx="75" cy="155" rx="28" ry="28" fill="#444" />
        <ellipse cx="225" cy="155" rx="28" ry="28" fill="#444" />
        <ellipse cx="75" cy="155" rx="18" ry="18" fill="#888" />
        <ellipse cx="225" cy="155" rx="18" ry="18" fill="#888" />
        <path d="M30,140 L40,90 L90,60 L210,60 L250,90 L270,140 Z" fill="#C8D8E8" stroke="#6B7B8B" strokeWidth="2" />
        <path d="M40,140 L40,90 L90,65 L210,65 L250,90 L260,140 Z" fill="none" stroke="#6B7B8B" strokeWidth="1" />
        <rect x="20" y="135" width="260" height="30" rx="8" fill="#A0B0C0" stroke="#6B7B8B" strokeWidth="2" />
        <line x1="90" y1="65" x2="90" y2="90" stroke="#6B7B8B" strokeWidth="1.5" />
        <line x1="150" y1="62" x2="150" y2="90" stroke="#6B7B8B" strokeWidth="1.5" />
        <line x1="210" y1="65" x2="210" y2="90" stroke="#6B7B8B" strokeWidth="1.5" />
        <rect x="25" y="140" width="30" height="10" rx="3" fill="#FDE68A" />
        <rect x="245" y="140" width="30" height="10" rx="3" fill="#FCA5A5" />
      </g>
    ),
    minivan: (
      <g>
        <ellipse cx="70" cy="160" rx="28" ry="28" fill="#444" />
        <ellipse cx="230" cy="160" rx="28" ry="28" fill="#444" />
        <ellipse cx="70" cy="160" rx="18" ry="18" fill="#888" />
        <ellipse cx="230" cy="160" rx="18" ry="18" fill="#888" />
        <path d="M30,145 L35,70 L80,40 L240,40 L260,70 L270,145 Z" fill="#C8E8D8" stroke="#5B8B6B" strokeWidth="2" />
        <rect x="20" y="140" width="260" height="30" rx="8" fill="#90C0A0" stroke="#5B8B6B" strokeWidth="2" />
        <line x1="80" y1="42" x2="80" y2="70" stroke="#5B8B6B" strokeWidth="1.5" />
        <line x1="150" y1="40" x2="150" y2="70" stroke="#5B8B6B" strokeWidth="1.5" />
        <line x1="200" y1="40" x2="200" y2="70" stroke="#5B8B6B" strokeWidth="1.5" />
        <rect x="25" y="145" width="30" height="10" rx="3" fill="#FDE68A" />
        <rect x="245" y="145" width="30" height="10" rx="3" fill="#FCA5A5" />
      </g>
    ),
    van: (
      <g>
        <ellipse cx="70" cy="160" rx="28" ry="28" fill="#444" />
        <ellipse cx="230" cy="160" rx="28" ry="28" fill="#444" />
        <ellipse cx="70" cy="160" rx="18" ry="18" fill="#888" />
        <ellipse cx="230" cy="160" rx="18" ry="18" fill="#888" />
        <rect x="30" y="45" width="240" height="105" rx="10" fill="#E8E0C8" stroke="#8B8060" strokeWidth="2" />
        <line x1="80" y1="45" x2="80" y2="100" stroke="#8B8060" strokeWidth="1.5" />
        <line x1="180" y1="45" x2="180" y2="100" stroke="#8B8060" strokeWidth="1.5" />
        <path d="M30,80 L30,145 L50,145 L50,80 Z" fill="#D8D0B8" stroke="#8B8060" strokeWidth="1" />
        <rect x="20" y="140" width="260" height="30" rx="8" fill="#C8C0A8" stroke="#8B8060" strokeWidth="2" />
        <rect x="25" y="145" width="30" height="10" rx="3" fill="#FDE68A" />
        <rect x="245" y="145" width="30" height="10" rx="3" fill="#FCA5A5" />
      </g>
    ),
    truck: (
      <g>
        <ellipse cx="70" cy="160" rx="28" ry="28" fill="#444" />
        <ellipse cx="230" cy="160" rx="28" ry="28" fill="#444" />
        <ellipse cx="70" cy="160" rx="18" ry="18" fill="#888" />
        <ellipse cx="230" cy="160" rx="18" ry="18" fill="#888" />
        <rect x="120" y="50" width="160" height="100" rx="5" fill="#E8C8C8" stroke="#8B5050" strokeWidth="2" />
        <path d="M30,80 L120,80 L120,150 L30,150 Z" fill="#D8B8B8" stroke="#8B5050" strokeWidth="2" />
        <rect x="40" y="85" width="60" height="40" rx="4" fill="#A8D8E8" stroke="#6B8B9B" strokeWidth="1.5" />
        <rect x="20" y="140" width="270" height="30" rx="8" fill="#C8A8A8" stroke="#8B5050" strokeWidth="2" />
        <rect x="25" y="145" width="30" height="10" rx="3" fill="#FDE68A" />
        <rect x="255" y="145" width="30" height="10" rx="3" fill="#FCA5A5" />
      </g>
    ),
  };
  return (
    <svg viewBox="0 0 300 200" width={width} height={height} style={{ maxWidth: '100%' }}>
      {svgs[type] || svgs.sedan}
    </svg>
  );
};

// ---------- スタイル ----------
const styles = {
  app: {
    fontFamily: "'Noto Sans JP', -apple-system, BlinkMacSystemFont, sans-serif",
    background: '#F3F4F6',
    minHeight: '100vh',
    maxWidth: '100vw#,
    overflowX: 'hidden',
    fontSize: 14,
    color: '#1F2937',
    WebkitFontSmoothing: 'antialiased',
  },
  header: {
    background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
    color: '#fff',
    padding: '12px 16px',
    paddingTop: 'max(12px, env(safe-area-inset-top))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 700,
    letterSpacing: '0.5px',
  },
  headerSub: {
    fontSize: 12,
    opacity: 0.85,
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderTop: '1px solid #E5E7EB',
    display: 'flex',
    justifyContent: 'space-around',
    paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
    paddingTop: 8,
    zIndex: 100,
    boxShadow: '0 -1px 8px rgba(0,0,0,0.06)',
  },
  navItem: (active) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    padding: '4px 16px',
    fontSize: 10,
    fontWeight: active ? 700 : 400,
    color: active ? '#2563EB' : '#9CA3AF',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minWidth: 60,
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: 8,
  }),
  navIcon: {
    fontSize: 22,
  },
  page: {
    padding: '12px 16px',
    paddingBottom: 'calc(80px + env(safe-area-inset-bottom))',
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 12,
    color: '#111827',
  },
  badge: (bg, color) => ({
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    background: bg,
    color: color,
  }),
  btn: (bg, color, size = 'md') => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: size === 'lg' ? '14px 24px' : size === 'sm' ? '8px 14px' : '10px 18px',
    borderRadius: 12,
    border: 'none',
    background: bg,
    color: color,
    fontSize: size === 'lg' ? 16 : size === 'sm' ? 12 : 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    minHeight: 44,
    WebkitTapHighlightColor: 'transparent',
  }),
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 12,
    border: '2px solid #E5E7EB',
    fontSize: 15,
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    minHeight: 44,
  },
  select: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 12,
    border: '2px solid #E5E7EB',
    fontSize: 15,
    outline: 'none',
    appearance: 'none',
    background: '#fff url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath d=\'M2 4l4 4 4-4\' stroke=\'%236B7280\' stroke-width=\'2\' fill=\'none\'/%3E%3C/svg%3E") right 14px center no-repeat',
    minHeight: 48,
    boxSizing: 'border-box',
  },
  progressBar: (pct, color) => ({
    height: 10,
    borderRadius: 5,
    background: '#E5E7EB',
    overflow: 'hidden',
    position: 'relative',
  }),
  progressFill: (pct, color) => ({
    height: '100%',
    width: `${pct}%`,
    borderRadius: 5,
    background: `linear-gradient(90deg, ${color}, ${color}dd)`,
    transition: 'width 0.6s ease',
  }),
  toast: {
    position: 'fixed',
    top: 'max(16px, env(safe-area-inset-top))',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#1F2937',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 500,
    zIndex: 9999,
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    animation: 'slideDown 0.3s ease',
    maxWidth: 'calc(100vw - 40px)',
    textAlign: 'center',
  },
};

// ---------- トースト通知 ----------
const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return <div style={styles.toast}>{message}</div>;
};

// ---------- ログイン画面 ----------
const LoginScreen = ({ onLogin }) => {
  const [selectedStaff, setSelectedStaff] = useState('');

  const handleLogin = () => {
    const staff = STAFF.find((s) => s.id === Number(selectedStaff));
    if (staff) onLogin(staff);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 30%, #2563EB 70%, #3B82F6 100%)',
        padding: 24,
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 24,
          padding: 32,
          width: '100%',
          maxWidth: 360,
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🚗</div>
          <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: '1px' }}>
            Fレンタカー
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 6 }}>業務管理システム</p>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 8, display: 'block" }}>
            スタッフ選択
          </label>
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            style={{
              ...styles.select,
              background: 'rgba(255,255,255,0.95)',
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          >
            <option value="">選択してください</option>
            {STAFF.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} （{s.role === 'manager' ? '役職者' : 'スタッフ'}）
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleLogin}
          disabled={!selectedStaff}
          style={{
            ...styles.btn('#fff', '#1E40AF', 'lg'),
            width: '100%',
            opacity: selectedStaff ? 1 : 0.5,
            borderRadius: 14,
            fontWeight: 700,
            fontSize: 16,
            boxShadow: selectedStaff ? '0 4px 15px rgba(37,99,235,0.4)' : 'none',
          }}
        >
          ログイン
        </button>
      </div>
    </div>
  �XY����KKKKKKKKKH8��8�������������HKKKKKKKKKB��ۜ�\���\�H
��ZX�\�\�]�\�ۓ�]�Y�]K۔�[X��ZX�HJHO��ۜ��[H�ZX�\˛[���ۜ�[��X�YH�ZX�\˙�[\�
�HO���[��X�Y
K�[���ۜ��HX]���[�

[��X�Y��[
H
�L
N�ۜ���\]YH\�]�\˙�[\�

HO���]\�OOH	���\]Y	�K�[���ۜ�[���ܙ\��H\�]�\˙�[\�

HO���]\�OOH	�[����ܙ\���K�[���ۜ�[�[��H\�]�\˙�[\�

HO���]\�OOH	�[�[���K�[���ۜ�[�[��X�YH�ZX�\˙�[\�
�HO�]��[��X�Y
N��]\��
�]��[O^��[\˜Y�_O���ʈ9�y�':`,��e�
��B�]��[O^��[\˘�\�O��]��[O^��[\˘�\�]_O���.⹥�x�k��y�':`,��e��]���]��[O^��\�^N�	ٛ^	��\�Y�P�۝[��	��X�KX�]�Y[��X\��[����N�_O���[��[O^���۝�^�N�L���܎�	�͐�̎	�_O���[��X�YK���[yc�9k�9.�����[����[��[O^���۝�^�N�MK�۝�ZY��
���܎��OOHL�	��L�NI��	�̍M��P��_O����IB���[����]���]��[O^��[\˜��ܙ\�И\��	�̍M��P��_O��]���[O^�����[\˜��ܙ\�њ[
�	�̍M��P��K��X��ܛ�[��[�X\�YܘYY[�
LY��Ў����L�NJX�_B�ς��]����]�����ʈ:acz.��x������
��B�]��[O^��[\˘�\�O��]��[O^��[\˘�\�]_O�'��:acz.��x�������]���]��[O^��\�^N�	ٛ^	��\�_O����X�[�	�k�9.�����[����\]Y�Έ	��ѐ�M����܎�	��M��L�	��ܙ\��	�А���	�K��X�[�	����b�y.+I���[��[���ܙ\���Έ	���PQ�I���܎�	��QMQ���ܙ\��	�Б���I�K��X�[�	�o�y�g����[��[�[���Έ	�ёQ�������܎�	��L�I��ܙ\��	�ёM�I�K�K�X\

�HO�
�]���^O^�˛X�[B��[O^��^�K�^[Yێ�	��[�\���Y[�Έ	�M	���ܙ\��Y]\ΈM��X��ܛ�[��˘����ܙ\��\��Y	�˘�ܙ\�X�_B���]��[O^���۝�^�N����۝�ZY����܎�˘��܈_O��˘��[�O�]���]��[O^���۝�^�N�L���܎�˘��܋�۝�ZY��
�X\��[����_O��˛X�[O�]����]���
J_B��]����]�����ʈ9�*��y�':.�.(H
��B�]��[O^��[\˘�\�O��]��[O^��[\˘�\�]_O���;�#�9�*��y�':.�.(O�]����[�[��X�Y�[��OOH�
�]��[O^��^[Yێ�	��[�\��Y[�Έ���܎�	��L�NI��۝�ZY��
�_O��8�!H8�fx�nx�i��k�.�.(x�c9�y�'9�"8�o��i��fB��]���
H�
�]��[O^��\�^N�	ٛ^	��^\�X�[ێ�	���[[���\�_O���[�[��X�Y�X\

�HO�
�]���^O^݋�YB�ې�X��^�
HO�۔�[X��ZX�J��Y
Nۓ�]�Y�]J	ݙZX�Q]Z[	�N_B��[O^�\�^N�	ٛ^	��[Yے][\Έ	��[�\����\�Y�P�۝[��	��X�KX�]�Y[���Y[�Έ	�L�M	���ܙ\��Y]\ΈL���X��ܛ�[��	�ёQ�������ܙ\��	�\��YёP�P�I���\��܎�	��[�\���Z[�ZY��
�_B���]���]��[O^���۝�ZY��
��۝�^�N�M_O�݋��[Y_O�]���]��[O^���۝�^�N�L���܎�	�͐�̎	�X\��[����_O�݋�]_O�]����]���]��[O^��\�^N�	ٛ^	�[Yے][\Έ	��[�\���\�
�_O���[��[O^��[\˘�Y�J�RP�W�TT�݋�\WK���܋	�ٙ���_O��ՑRP�W�TT�݋�\WK�X�[B���[����[��[O^����܎�	��P�L�Q���۝�^�N�N_O��.���[����]����]���
J_B��]���
_B��]����]����;�@���������������Xދ��{J����������Ц6��7BF�7F6�vR���F�7F6�W2�6WDF�7F6�W2�fV��6�W2�W6W"�6��uF�7BҒ����6��7B�6��tf�&��6WE6��tf�&���W6U7FFR�f�6R���6��7B�f�&��6WDf�&���W6U7FFR���fV��6�T�C�rr��G&�fW$�C�rr��G�S�vFVƗfW"r��F��S�rr��FW7F��F���rr��&WGW&��WF��C�wG&��r��7W7F��W#�rr��ғ���6��7B7FGW46���'2���V�F��s��&s�r4dTc43rr�6���#�r3�#CRr��&Vâ~[�^j��r������&�w&W73��&s�r4D$TdRr�6���#�r3SCbr��&Vâ~z{�X�^K��r���6���WFVC��&s�r4D4d4Srr�6���#�r3ccS3Br��&Vâ~[��3���#���7���7�7G��S׷�f��E6��S�R�f��EvV�v�C�s�6���#�&�w&W72����r3#��r�r3#Sc4T"r����&�w&W77�P���7����F�c��F�b7G��S׷7G��W2�&�w&W74& �����҈���ɽ�ɕ�̰�����������(����������������(������������������屔���(�����������������������展̹�ɽ�ɕ�������ɽ�ɕ�̰����������(�����������������������ɽչ�聁�����ȵ�Ʌ����Р�����������ذ������ĥ��(������������������(����������������(������������𽑥��(����������𽑥��(��(��`=�X��[ܛH	��\�\����HOOH	�X[�Y�\��	��
�]��[O^������[\˘�\��ܙ\��	̜��YБ���I�_O��]��[O^���۝�^�N�MK�۝�ZY��
�X\��[����N�L�_O���:)��acz.��n�c,��]���]��[O^��\�^N�	ٛ^	��^\�X�[ێ�	���[[���\�L_O���[X���[YO^ٛܛK�\_B�ې�[��O^�JHO��]�ܛJ�����ܛK\N�K�\��]��[YHJ_B��[O^��[\˜�[X�B����[ۈ�[YOH�[]�\���!cz.���[ۏ���[ۈ�[YOH���X���f�.���[ۏ����[X����[X���[YO^ٛܛK��ZX�RYB�ې�[��O^�JHO��]�ܛJ�����ܛK�ZX�RY�K�\��]��[YHJ_B��[O^��[\˜�[X�B����[ۈ�[YOH���.�.(xऺ`n9�����[ۏ��ݙZX�\˛X\

�HO�
��[ۈ�^O^݋�YH�[YO^݋�YO��݋��[Y_H
݋�]_JB���[ۏ��
J_B���[X����[X���[YO^ٛܛK��]�\�YB�ې�[��O^�JHO��]�ܛJ�����ܛK�]�\�Y�K�\��]��[YHJ_B��[O^��[\˜�[X�B����[ۈ�[YOH�����x��x�8��8��8ऺ`n9�����[ۏ����Q���X\

�HO�
��[ۈ�^O^�˚YH�[YO^�˚YO���˛�[Y_B���[ۏ��
J_B���[X���[�]�\OH�[YH���[YO^ٛܛK�[Y_B�ې�[��O^�JHO��]�ܛJ�����ܛK[YN�K�\��]��[YHJ_B��[O^��[\˚[�]B�ς�[�]�X�Z�\�H�[O^������[\˘�\��ܙ\��	̜��YБ���I�_O��]��[O^���۝�^�N�MK�۝�ZY��
�X\��[����N�L�_O���:)��acz.��n�c,��]���]��[O^��\�^N�	ٛ^	��^\�X�[ێ�	���[[���\�L_O���[X���[YO^ٛܛK�\_B�ې�[��O^�JHO��]�ܛJ�����ܛK\N�K�\��]��[YHJ_B��[O^��[\˜�[X�B����[ۈ�[YOH�[]�\���acz.���[ۏ���[ۈ�[YOH���X���f�.���[ۏ����[X����[X���[YO^ٛܛK��ZX�RYB�ې�[��O^�JHO��]�ܛJ�����ܛK�ZX�RY�K�\��]��[YHJ_B��[O^��[\˜�[X�B����[ۈ�[YOH���.�.(xऺ`n9�����[ۏ��ݙZX�\˛X\

�HO�
��[ۈ�^O^݋�YH�[YO^݋�YO��݋��[Y_H
݋�]_JB���[ۏ��
J_B���[X����[X���[YO^ٛܛK��]�\�YB�ې�[��O^�JHO��]�ܛJ�����ܛK�]�\�Y�K�\��]��[YHJ_B��[O^��[\˜�[X�B����[ۈ�[YOH�����x��x�8��8��8ऺ`n9�����[ۏ����Q���X\

�HO�
��[ۈ�^O^�˚YH�[YO^�˚YO���˛�[Y_B���[ۏ��
J_B���[X���[�]�\OH�[YH���[YO^ٛܛK�[Y_B�ې�[��O^�JHO��]�ܛJ�����ܛK[YN�K�\��]��[YHJ_B��[O^��[\˚[�]B�ς�[�]�X�Z�\�H�(c8�cyab���[YO^ٛܛK�\�[�][۟B�ې�[��O^�JHO��]�ܛJ�����ܛK\�[�][ێ�K�\��]��[YHJ_B��[O^��[\˚[�]B�ς�[�]�X�Z�\�H��b�k����9d#H���[YO^ٛܛK��\��Y\�B�ې�[��O^�JHO��]�ܛJ�����ܛK�\��Y\��K�\��]��[YHJ_B��[O^��[\˚[�]B�ς��[X���[YO^ٛܛK��]\��Y]�B�ې�[��O^�JHO��]�ܛJ�����ܛK�]\��Y]��K�\��]��[YHJ_B��[O^��[\˜�[X�B����[ۈ�[YOH��Z[���'��:f��.���[ۏ���[ۈ�[YOH��\ȏ�'�8��8�O��[ۏ���[ۈ�[YOH�X��\��'��:/��b��[ۏ����[X����]ۈې�X��^�[�PYH�[O^������[\˘��	�̍M��P��	�ٙ���	���K�Y�	�L	I�_O��9�n�c,��fx�؝]ۏ���]����]���
_B���ʈ8���8��8��x�8���
��B�]��[O^��\�^N�	ٛ^	��^\�X�[ێ�	���[[���\�L_O����ܝY�X\


HO��ۜ��ZX�HH�ZX�\˙�[�

�HO���YOOH��ZX�RY
N�ۜ��]�\�H�Q����[�

�HO�˚YOOH��]�\�Y
N�ۜ���H�]\���ܜ����]\�N�]\��
�]��^O^��YH�[O^������[\˘�\�Y[�ΈMX\��[����N�_O��]��[O^��\�^N�	ٛ^	�[Yے][\Έ	��[�\���\�LX\��[����N�L_O��]���[O^��۝�^�N�M���۝�ZY�����܎�	�̍M��P���Z[��Y�
L�_B�����[Y_B��]����[���[O^�����[\˘�Y�J�\HOOH	�[]�\���	��Q�������	�ё���Q	��\HOOH	�[]�\���	��Q
Q	��	��̍L��K��ܙ\��\��Y	��\HOOH	�[]�\���	�Б���I��	�ёQ
�PI�X��۝�ZY��
��_B�����\HOOH	�[]�\���	�acz.���	�f�.��B���[����[��[O^������[\˘�Y�J�˘���˘��܊K�۝�ZY��
�_O���˛X�[O��[����]���]��[O^��X\��[�Y��X\��[����N�_O��]��[O^���۝�^�N�M�۝�ZY��
�_O��ݙZX�O˛�[Y_H8�����\�[�][۟B��]���]��[O^���۝�^�N�L���܎�	�͐�̎	�X\��[����_O����]�\�˛�[Y_H8������\��Y\�H8���ܙ]\��Y]�X�[����]\��Y]�_B��]����]������]\�OOH	���\]Y	�	��
��]ۂ�ې�X��^�
HO�[�T�]\��[��J�Y
_B��[O^�����[\˘�����]\�OOH	�[�[����	�̍M��P���	��L�NI��	�ٙ����	��I
K��Y�	�L	I��X\��[���
�_B������]\�OOH	�[�[����	�'��9a��n��fx����	��!H9k�9.���fx���B�؝]ۏ��
_B��]���
NJ_B��]����]���
NN���KKKKKKKKKH:.�.(y. :)��KKKKKKKKKB��ۜ��ZX�S\�Y�HH
��ZX�\�[XY�\�۔�[X��ZX�Kۓ�]�Y�]HJHO��ۜ�ٚ[\��]�[\�HH\�T�]J	�[	�N�ۜ���X\���]�X\��HH\�T�]J	��N��ۜ��[\�YH�ZX�\˙�[\�
�HO�Y�
�[\�OOH	�[	�	����\HOOH�[\�H�]\���[�NY�
�X\��	��]���[YK�[��Y\��X\��
H	��]��]K�[��Y\��X\��
JH�]\���[�N�]\���YNJN��]\��
�]��[O^��[\˜Y�_O��]��[O^���۝�^�N�N�۝�ZY��
�X\��[����N�L�_O�'��:.�.(y. :)���]�����ʈ9�'9�(�
��B�]��[O^��X\��[����N�L�_O��[�]�X�Z�\�H�'�#H:.�d#x����������8��8�i��'9�(����[YO^��X\��B�ې�[��O^�JHO��]�X\��
K�\��]��[YJ_B��[O^��[\˚[�]B�ς��]�����ʈ8��x�������
��B�]��[O^��\�^N�	ٛ^	��\�
�X\��[����N�M�^ܘ\�	�ܘ\	�_O���]ۂ�ې�X��^�
HO��]�[\�	�[	�_B��[O^�����[\˘���[\�OOH	�[	��	��Q��L����	�ьэ����[\�OOH	�[	��	�ٙ����	���MM���	��I�K��ܙ\��Y]\Έ��_B���8�fx�nx�i��؝]ۏ���ؚ�X��[��Y\��RP�W�TT�K�X\

��^K�[JHO�
��]ۂ��^O^��^_B�ې�X��^�
HO��]�[\��^J_B��[O^�����[\˘���[\�OOH�^H��[���܈�	�ьэ����[\�OOH�^H�	�ٙ����	���MM���	��I�K��ܙ\��Y]\Έ��_B���ݘ[�X�[B�؝]ۏ��
J_B��]�����ʈ:.�.(x���x��
��B�]��[O^��\�^N�	ٛ^	��^\�X�[ێ�	���[[���\�L_O��ٚ[\�Y�X\

�HO��ۜ�Y���[�H[XY�\˙�[\�

HO���ZX�RYOOH��Y
K�[���]\��
�]���^O^݋�YB�ې�X��^�
HO�۔�[X��ZX�J��Y
Nۓ�]�Y�]J	ݙZX�Q]Z[	�N_B��[O^�����[\˘�\��Y[�ΈM�X\��[����N���\��܎�	��[�\���\�^N�	ٛ^	��[Yے][\Έ	��[�\����\�Y�P�۝[��	��X�KX�]�Y[���_B���]��[O^���^�H_O��]��[O^��\�^N�	ٛ^	�[Yے][\Έ	��[�\���\�X\��[����N�
_O���[��[O^���۝�ZY��
��۝�^�N�MH_O�݋��[Y_O��[����[��[O^��[\˘�Y�J�RP�W�TT�݋�\WK���܋	�ٙ���_O��ՑR�W�TT�݋�\WK�X�[B���[����]���]��[O^���۝�^�N�L���܎�	�͐�̎	�_O�݋�]_O�]���]��[O^��\�^N�	ٛ^	��\�X\��[���
�_O���[���[O^��[\˘�Y�J���[��X�Y�	��ѐ�M���	�ёQ��������[��X�Y�	��M��L�	��	��NLP�P�
_B���݋�[��X�Y�	��!H9�y�'9�"	��	���;�#�9�*��y�'	�B���[����Y���[��	��
��[��[O^��[\˘�Y�J	�ёQ�����	��L�I�_O�`���Y���[�y.���[���
_B��]����]����[��[O^����܎�	��P�L�Q���۝�^�N���X\��[�Y��_O��.���[����]���
NJ_B��]����]���
NN���KKKKKKKKKH:.�.(z*l��,KKKKKKKKKB��ۜ��ZX�Q]Z[Y�HH
��ZX�RY�ZX�\�[XY�\�[��X�[ۜ�ۓ�]�Y�]K۔�\�[��X�[ۈJHO��ۜ��ZX�HH�ZX�\˙�[�

�HO���YOOH�ZX�RY
NY�
]�ZX�JH�]\��]��[O^��[\˜Y�_O�.�.(x�c:)���i8�b�ࢸ�o��f����]����ۜ��ZX�Q[XY�\�H[XY�\˙�[\�

HO���ZX�RYOOH�ZX�RY
N�ۜ��ZX�R[��X�[ۜ�H[��X�[ۜ˙�[\�
JHO�K��ZX�RYOOH�ZX�RY
N��]\��
�]��[O^��[\˜Y�_O���]ۂ�ې�X��^�
HO�ۓ�]�Y�]J	ݙZX�\��_B��[O^������[\˘��	�ьэ���	���MM���	��I�KX\��[����N�L�_B���8��:.�.(y. :)���j��.��؝]ۏ���]��[O^��[\˘�\�O��]��[O^��\�^N�	ٛ^	��\�Y�P�۝[��	��X�KX�]�Y[��[Yے][\Έ	��\�	�_O��]���]��[O^���۝�^�N���۝�ZY��_O�ݙZX�K��[Y_O�]���]��[O^���۝�^�N�L���܎�	�͐�̎	�X\��[����_O�ݙZX�K�]_O�]����]����[��[O^��[\˘�Y�J�RP�W�TT�ݙZX�K�\WK���܋	�ٙ���_O��ՑRP�W�TT�ݙZX�K�\WK�X�[B���[����]����]��[O^��\�^N�	ٛ^	��\�Y�P�۝[��	��[�\��X\��[��	�M�	��X��ܛ�[��	�юQ�Q����ܙ\��Y]\ΈL�Y[�ΈL�_O���ZX�TՑ�\O^ݙZX�K�\_Hς��]�����]ۂ�ې�X��^�
HO�۔�\�[��X�[ۊ�ZX�RY
_B��[O^������[\˘��	�̍M��P��	�ٙ���	���K�Y�	�L	I�_B���<'�#H9�y�'8ऺe��i���fx�؝]ۏ���]�����ʈ9`��liy�m
��B�]��[O^��[\˘�\�O��]��[O^��[\˘�\�]_O�'�)�9`��liy�m;�"ݙZX�Q[XY�\˛[��y.���"O�]���ݙZX�Q[XY�\˛[��OOH�
�]��[O^��^[Yێ�	��[�\��Y[�ΈM���܎�	��P�L�Q��_O�`���k�*&:c,��k��`�ࢸ�o��f����]ς�
H�
��ZX�Q[XY�\˛X\


HO�
�]���^O^��YB��[O^�\�^N�	ٛ^	��[Yے][\Έ	��[�\����\�L�Y[�Έ	�L	���ܙ\����N�	�\��Yьэ����_B����[���[O^��Y�̋�ZY��̋��ܙ\��Y]\Έ	�L	I���X��ܛ�[���\ә]��SPQ�W�TT���\WK���܈�	��P�L�Q�����܎�	�ٙ����\�^N�	ٛ^	��[Yے][\Έ	��[�\����\�Y�P�۝[��	��[�\����۝�ZY����۝�^�N�M��^��[�Έ�_B����SPQ�W�TT���\WK��[X��B���[���]��[O^���^�H_O��]��[O^���۝�ZY��
��۝�^�N�M_O���W7F�g�6��FV�C�v6V�FW"r��f��EvV�v�C����f��E6��S�B��f�W�6�&�波���Т��D�tU�E�U5�B�G�U��7��&��Т��7���F�b7G��S׷�f�W������F�b7G��S׷�f��EvV�v�C�c�f��E6��S�B��紀����ѥ��
��ѕ��耝���ѕȜ�(����������������������]����������(����������������������M����а(����������������������M�ɥ�����(������������������(���������������(�����������������5}QeAMm������t��嵉���(��������������������(���������������؁��屔��쁙����ā���(�����������������؁��屔��쁙���]���������������M����Ё���퐹��ѕ�𽑥��(�����������������؁��屔��쁙���M����Ȱ������耜��
������퐹��ѕ�𽑥��(��������������𽑥��(��������������퐹��9�܀�����������屔����展̹���������Ȝ�������؜���9\�������(������������𽑥��(������������(����������(������𽑥��((������켨��
皒s�Ɨ��Ѐ���(�������؁��屔����展̹��ɑ��(���������؁��屔����展̹��ɑQ�ѱ����~N,��
皒s�Ɨ���𽑥��(���������ٕ�����%�����ѥ��̹����Ѡ���������(�����������؁��屔���ѕ������耝���ѕȜ�����������ذ������耜��
�������
皒s��c�2ˎ���
+���o�
L𽑥��(����������耠(����������ٕ�����%�����ѥ��̹�������̰��������(��������������(���������������������(����������������屔���(�����������������������耜��������(������������������ɑ��	��ѽ�耜����ͽ�������؜�(����������������(�������������(���������������؁��屔��쁙���]���������������M����Ё���(�������������������̹��ѕ􀴁�MQ�������̤����̹�����􁥹̹�х��%���������(��������������𽑥��(���������������؁��屔��쁙���M����Ȱ������耜�����������ɝ��Q���ȁ���(������������������â�3��w�n�����̹���������������Zd����̹�Օ���(�������������������̹���9������������屔��쁍����耜����М����ɝ��1����������j���<�9���n���
(�������(��������������𽑥��(������������𽑥��(������������(����������(������𽑥��(����𽑥��(��<c�ad

// ---------- 点検フォーム ----------
const InspectionForm = ({ vehicleId, vehicles, user, onComplete, onNavigate, showToast, onOpenBodyCheck }) => {
  const vehicle = vehicles.find((v) => v.id === vehicleId);
  if (!vehicle) return null;

  const [results, setResults] = useState({});
  const [mileage, setMileage] = useState('');
  const [fuel, setFuel] = useState('');
  const [openCategory, setOpenCategory] = useState(0);

  const filteredCategories = INSPECTION_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) => item.types.includes(vehicle.type)),
  }));

  const totalItems = filteredCategories.reduce((s, c) => s + c.items.length, 0);
  const answeredItems = Object.keys(results).length;
  const progress = totalItems > 0 ? Math.round((answeredItems / totalItems) * 100) : 0;

  const handleSubmit = () => {
    if (answeredItems < totalItems) {
      showToast('乐記録ぁ すスん・',);
      return;
    }
    if (!mileage || !fuel) {
      showToast('走行距離と燃料を入力してください');
      return;
    }
    onComplete({
      vehicleId,
      staffId: user.id,
      date: new Date().toISOString().split('T')[0],
      mileage: Number(mileage),
      fuel: Number(fuel),
      results,
      hasNG: Object.values(results).includes('ng'),
    });
    showToast('点検を完了しました ✅');
  };

  return (
    <div style={styles.page}>
      <button
        onClick={() => onNavigate('vehicleDetail')}
        style={{ ...styles.btn('#F3F4F6', '#4B5563', 'sm'), marginBottom: 12 }}
      >
        ← 戻る
      </button>

      <div style={styles.card}>
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>
          🔍 {vehicle.name} の点検
        </div>
        <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 12 }}>{vehicle.plate}</div>

        {/* 進捗 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 13, color: '#6B7280' }}>
            {answeredItems}/{totalItems}項目
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: progress === 100 ? '#10B981' : '#2563EB' }}>
              justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                {DAMAGE_TYPES[d.type].symbol}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{d.note}</div>
                <div style={{ fontSize: 12, color: '#9CA3AF' }}>{d.date}</div>
              </div>
              {d.isNew && <span style={styles.badge('#FEE2E2', '#DC2626')}>NEW</span>}
            </div>
        )
      }
    </div>

    {/* 点検履歴: */}
    <div style={styles.card}>
      <div style={styles.cardTitle}>📋 点検履歴</div>
      {vehicleInspections.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 16, color: '#9CA3AF' }}>赠行距離ねあり
       ) : (
          vehicleInspections.map((ins, i) => (
            <div
              key={i}
              style={{
                padding: '10px 0',
                borderBottom: '1px solid #F3F4F6',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 14 }}>
                {ins.date} - {STAFF,�� /** fill details */
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )������(����)�)����ЁAɽ�ɕ��	�Ȁ���ɽ�ɕ�́�������(��ɕ��ɸ��(�����؁��屔���(������ݥ�Ѡ耜������(�������������а(�����������ɽչ�
����耜�����(��������ɑ��I������Ȱ(�������ٕə���耝��������(������(�����(��������(����������屔���(����������ݥ�Ѡ聀���ɽ�ɕ������(����������������耜������(���������������ɽչ�
����耜�����̜�(�����������Ʌ�ͥѥ��耝ݥ�Ѡ�����̜�(����������(�������𽑥��(����𽑥��(����)��(������������屔��쁙���M����а�����]������������������ɽ�ɕ�̀���������������Ĝ�耜����������(��������������ɽ�ɕ����(����������������(��������𽑥��(���������؁��屔����展̹�ɽ�ɕ��	�ȡ�ɽ�ɕ�̰�����������(�����������؁��屔��쀸����展̹�ɽ�ɕ�������ɽ�ɕ�̰����������������ɽչ�耝�����ȵ�Ʌ����Р�����������ذ������Ĥ�����(��������𽑥��(������𽑥��((������켨���â�3��w�n����Zd����(�������؁��屔����展̹��ɑ��(���������؁��屔��쁑������耝�����������������(�����������؁��屔��쁙����ā���(������������񱅉�����屔��쁙���M����̰�����]����������������耜������Ĝ���������耝����������ɝ��	��ѽ��؁���(����������������â�3��w�n������(������������𽱅����(����������������(�������������������յ��Ȉ(���������������������������,�������(��������������م�Ք����������(����������������
������졔�����͕�5���������хɝ�йم�Ք��(����������������屔����展̹������(��������������(����������𽑥��(�����������؁��屔��쁙����ā���(������������񱅉�����屔��쁙���M����̰�����]����������������耜������Ĝ���������耝����������ɝ��	��ѽ��؁���(����������������Zd����(������������𽱅����(����������������(�������������������յ��Ȉ(���������������������������,����(��������������م�Ք��Օ��(����������������
������졔�����͕�Օ����хɝ�йم�Ք��(����������������屔����展̹������(��������������������(����������������������(��������������(����������𽑥��(��������𽑥��(������𽑥��((������켨��
���
ӎ��"��
皒p����(������홥�ѕɕ�
�ѕ��ɥ�̹�������а���������(������������Ё��=��������
�ѕ������􁍤�(������������Ё�����ݕɕ��􁍅й�ѕ�̹���ѕȠ��ѕ������ɕ�ձ��m�ѕ����t������Ѡ�(��������ɕ��ɸ��(�����������؁����퍥���屔��쀸����展̹��ɐ��������������ٕə���耝�����������(��������������(����������������
�����젤����͕�=���
�ѕ���䡥�=�������Ā聍���(����������������屔���(�����������������������耝������(���������������������%ѕ��耝���ѕȜ�(�������������������ѥ��
��ѕ��耝���������ݕ����(�����������������������耜�����������(�������������������ͽ�耝����ѕȜ�(���������������������ɽչ�聥�=������������耜������(�������������������!��������(����������������(�������������(���������������؁��屔��쁑������耝������������%ѕ��耝���ѕȜ�����������(������������������������屔��쁙���M���������퍅й�����������(������������������������屔��쁙���]���������������M����ԁ���퍅й�����������(��������������𽑥��(���������������؁��屔��쁑������耝������������%ѕ��耝���ѕȜ�����������(������������������������屔��쁙���M����Ȱ������聍����ݕɕ����􁍅й�ѕ�̹����Ѡ���������Ĝ�耜��
������(������������������퍅���ݕɕ���퍅й�ѕ�̹����ѡ�(����������������������(������������������������屔����Ʌ�͙�ɴ聥�=�������ɽхє���������耝ɽхє����������Ʌ�ͥѥ��耝�Ʌ�͙�ɴ����̜�������耜��
������(��������������������(����������������������(��������������𽑥��(������������𽑥��(���������������=��������(���������������؁��屔����������耜����������������(����������������퍅й�ѕ�̹������ѕ�������(��������������������(��������������������������ѕ�����(����������������������屔���(�����������������������������耝������(���������������������������%ѕ��耝���ѕȜ�(�������������������������ѥ��
��ѕ��耝���������ݕ����(�����������������������������耜��������(������������������������ɑ��	��ѽ�耜����ͽ�������؜�(����������������������(�������������������(����������������������������屔��쁙���M����а�����]����������������ā�����ѕ��������������(���������������������؁��屔��쁑������耝�����������؁���(�������������������������ѽ�(��������������������������
�����젤����͕�I��ձ�̡쀸��ɕ�ձ�̰�m�ѕ����t耝�������(��������������������������屔���(�������������������������������展̹�Ѹ�(����������������������������ɕ�ձ��m�ѕ����t���􀝽�����������Ĝ�耜���؜�(����������������������������ɕ�ձ��m�ѕ����t���􀝽������������耜��������(�����������������������������ʹ�(����������������������������(�����������������������������]��Ѡ��а(�����������������������������!��������(������������������������������]����������(������������������������������M����԰(����������������������������ɑ��I���������(��������������������������(�����������������������(������������������������=,(�������������������������ѽ��(�������������������������ѽ�(��������������������������
�����젤����͕�I��ձ�̡쀸��ɕ�ձ�̰�m�ѕ����t耝�������(��������������������������屔���(�������������������������������展̹�Ѹ�(����������������������������ɕ�ձ��m�ѕ����t���􀝹����������М�耜���؜�(����������������������������ɕ�ձ��m�ѕ����t���􀝹������������耜��������(�����������������������������ʹ�(����������������������������(�����������������������������]��Ѡ��а(�����������������������������!��������(������������������������������]����������(������������������������������M����԰(����������������������������ɑ��I���������(��������������������������(�����������������������(������������������������9(�������������������������ѽ��(��������������������𽑥��(������������������𽑥��(�������������������(��������������𽑥��(��������������(����������𽑥��(����������(���������((������켨��s��
���
���
��s�
��̀���(���������ѽ�(����������
�����젤������=���	���
�����ٕ�����%���(����������屔���(���������������展̹�Ѹ�������Ĝ����������������(����������ݥ�Ѡ耜������(������������ɝ��	��ѽ���Ȱ(����������(�������(���������~j\��s��
���
���
��
K�Z/�<(���������ѽ��((������켨��
皒s��3���s�
��̀���(���������ѽ�(����������
������������MՉ����(����������屔���(���������������展̹�Ѹ��ɽ�ɕ�̀����������������������Օ����������Ĝ�耜��
������������������(����������ݥ�Ѡ耜������(����������(�������(���������r��
皒s�
K��3���g�
,(���������ѽ��(����𽑥��(��<�B�F�c����Р�������������89�88~8*>888*~88>8*����������Ц6��7B&�G�6�V6����fV��6�T�B�fV��6�W2�F�vW2�6WDF�vW2�W6W"���6��6R�6��uF�7BҒ����6��7BfV��6�R�fV��6�W2�f��B��b���b�B���fV��6�T�B���6��7B6�f5&Vb�W6U&Vb��V���6��7B�6V�V7FVEG�R�6WE6V�V7FVEG�U��W6U7FFR�vFV�Br���6��7B��&�2�6WD�&�5��W6U7FFR��ғ��6��7B���FR�6WD��FU��W6U7FFR�rr���6��7B���7F�'��6WD��7F�'���W6U7FFR��ғ���6��7BfV��6�TF�vW2�F�vW2�f��FW"��B���B�fV��6�T�B���fV��6�T�B����6��7BG&r�W6T6��&6��������6��7B6�f2�6�f5&Vb�7W'&V�C���b�6�f2�&WGW&㰢6��7B7G��6�f2�vWD6��FW�B�s&Br���6��7Br�6�f2�v�GF���6��7B��6�f2�V�v�C��7G��6�V%&V7B���r��������iz.ZَX+~�Ȏ8+8:�8;��Ȑ�fV��6�TF�vW2�f�$V6���B�����7G��&Vv��F�����7G��&2�B��B��B���F����"���7G��f���7G��R�w&v&�Sb�c2�sR��b�s��7G��f�����7G��7G&��U7G��R�r3�44bs��7G��Ɩ�Uv�GF��#��7G��7G&��R����7G��f���7G��R�r6ffbs��7G��f��B�v&��B'�6�2�6W&�bs��7G��FW�DƖv��v6V�FW"s��7G��FW�D&6VƖ�R�v֖FF�Rs��7G��f���FW�B�D�tU�E�U5�B�G�U��7��&���B��B璓��ғ�����ik�h�X+~�Ȏ8*�8:�8;��Ȑ��&�2�f�$V6���Ғ����7G��&Vv��F�����7G��&2�������B���F����"���7G��f���7G��R�DD�tU�E�U5���G�U��6���"�t42s��7G��f�����7G��7G&��U7G��R�D�tU�E�U5���G�U��6���#��7G��Ɩ�Uv�GF��"�S��7G��7G&��R����7G��f���7G��R�r6ffbs��7G��f��B�v&��B'�6�2�6W&�bs��7G��FW�DƖv��v6V�FW"s��7G��FW�D&6VƖ�R�v֖FF�Rs��7G��f���FW�B�D�tU�E�U5���G�U��7��&�������璓��ғ�����fV��6�TF�vW2��&�5ғ���W6TVffV7B�������G&r�������G&uғ���6��7B��F�T6�f5F��R�����6��7B6�f2�6�f5&Vb�7W'&V�C��6��7B&V7B�6�f2�vWD&�V�F��t6ƖV�E&V7B����6��7B66�U��6�f2�v�GF��&V7B�v�GF���6��7B66�U��6�f2�V�v�B�&V7B�V�v�C��6��7B���F��&�V�B��R�6ƖV�E��&V7B��VgB��66�U����6��7B���F��&�V�B��R�6ƖV�E��&V7B�F���66�U����6��7B�Wt�&�������G�S�6V�V7FVEG�RӰ�6WD��7F�'�����憗7F�'�������&�5�ғ��6WD�&�2������&�2��Wt�&�ғ��Ӱ��6��7B��F�UV�F���������b���7F�'���V�wF�����6WD�&�2���7F�'����7F�'���V�wF��ғ��6WD��7F�'����7F�'��6Ɩ6R�������ТӰ��6��7B��F�U6fR�������6��7B�WtF�vW2��&�2��������������C��F���������F�vW2����B���B�B�������fV��6�T�B��������������G�S���G�R����FS���FR��ik�h�G�D�tU�E�U5���G�U���&V����FFS��WrFFR���F��4�7G&��r���7ƗB�uBr������4�Ws�G'VR��Ғ���6WDF�vW2��&Wb�������&Wb�����WtF�vW5ғ��6��uF�7B�G��WtF�vW2��V�wF��K�n8�X+~8).�����.8~8�8~8������6��6R����Ӱ��6��7B��F�U&W�'B�������6��7B��vW'2�5Ddb�f��FW"��2���2�&��R���v��vW"r���6��uF�7B�K��X���ȂG���vW'2����2���2���R�����~8r���Ȟ8�ZY�8~8�8~8����Ӱ���b�fV��6�R�&WGW&��V�ð��&WGW&����F�`�7G��S׷���6�F���vf��VBr����6WC���&6�w&�V�C�r6ffbr�����FW��#��F�7���vf�W�r��f�W�F�&V7F���v6��V��r��FF��uF��v�����V�b�6fR�&V֖�6WB�F���r��FF��t&�GF�Ӣv�����V�b�6fR�&V֖�6WB�&�GF�Ғ�r���Т���89�88>888;���Т�F�`�7G��S׷��F�7���vf�W�r��Ɩv�FV�3�v6V�FW"r���W7F�g�6��FV�C�w76R�&WGvVV�r��FF��s�s'�g�r��&�&FW$&�GF�Ӣs�6�ƖB4STStT"r��&6�w&�V�C�r6ffbr���Т��'WGF����6Ɩ6�׶��6��6W�7G��S׷7G��W2�'F�r4c4cDcbr�r3D#SSc2r�w6�r���(ih��8(����'WGF����7�7G��S׷�f��EvV�v�C�s�f��E6��S�b���89�88~8*>888*~88>8*���7���'WGF����6Ɩ6�׶��F�UV�F��F�6&�VC׶��7F�'���V�wF�����7G��S׷����7G��W2�'F�r4c4cDcbr���7F�'���V�wF���r3D#SSc2r�r4CCTD"r�w6�r����(j�X�nkh����'WGF�����F�cࠢ��X+~8+�8*N89~��h����Т�F�b7G��S׷�F�7���vf�W�r�v�b�FF��s�s�g�r�&6�w&�V�C�r4c�dd"r�����&�V7B�V�G&�W2�D�tU�E�U2�������W��GEҒ�����'WGF���W�׶�W�Т��6Ɩ6�ײ����6WE6V�V7FVEG�R��W��Т7G��S׷��f�W����FF��s�s�r��&�&FW%&F�W3���&�&FW#�6V�V7FVEG�R����W��7�6�ƖBG�GB�6���'��s7�6�ƖBG&�7&V�Br��&6�w&�V�C�6V�V7FVEG�R����W��GB�6���"�s�r�r6ffbr��7W'6�#�w���FW"r��f��E6��S�2��f��EvV�v�C�s��6���#�GB�6���"��֖�V�v�C�C���F�7���vf�W�r��f�W�F�&V7F���v6��V��r��Ɩv�FV�3�v6V�FW"r��v�"���Т��7�7G��S׷�f��E6��S���f��EvV�v�C�����GB�7��&�����7���7�7G��S׷�f��E6��S����GB��&V����7����'WGF�����Т��F�cࠢ��6�f2�5dr��Т�F�`�7G��S׷��f�W����F�7���vf�W�r��Ɩv�FV�3�v6V�FW"r���W7F�g�6��FV�C�v6V�FW"r���6�F���w&V�F�fRr���fW&f��s�v��FFV�r��&6�w&�V�C�r4c�dd"r���&v��sg�r��&�&FW%&F�W3�"���Т��F�b7G��S׷��6�F���w&V�F�fRr�v�GF��sRr���v�GF��3c����fV��6�U5drG�S׷fV��6�R�G�W�v�GF�׳3c��V�v�C׳#C����6�f0�&Vc׶6�f5&VgТv�GF�׳3Т�V�v�C׳#Т��6Ɩ6�׶��F�T6�f5FТ7G��S׷���6�F���v'6��WFRr��F�����VgC�sSRr��G&�6f�&ӢwG&�6�FU���SR�r��v�GF��sRr���V�v�C�sRr��7W'6�#�v7&�76��"r���Т����F�c���F�cࠢ��8:8:.8;�89�8+�8;2��Т�F�b7G��S׷�FF��s�s'�g�r�&�&FW%F��s�6�ƖB4STStT"r�&6�w&�V�C�r6ffbr���Ɩ�W@��6V���FW#�.8:8:.8).XZ^X���ȎK��hH��Ȓ �f�VS׶��FWТ��6��vSײ�R���6WD��FR�R�F&vWB�f�VR�Т7G��S׷����7G��W2��WB��&v��&�GF�Ӣ�Т���F�b7G��S׷�F�7���vf�W�r�v������'WGF����6Ɩ6�׶��F�U&W�'G�7G��S׷����7G��W2�'F�r4cS�S"r�r6ffbr�v�Br��f�W�����	�:BK��X��8�ZY����'WGF����'WGF����6Ɩ6�׶��F�U6fWТF�6&�VC׶�&�2��V�wF����Т7G��S׷�����7G��W2�'F��&�2��V�wF���r3#��r�r4CCTD"r�r6ffbr�v�Br���f�W�����Т�	�+�K��Zَ8�8(����&�2��V�wF�Ґ���'WGF�����F�c���F�c���F�c����Ӱ��������������8:8*N8;4���������ЦW��'BFVfV�BgV�7F�������6��7B�W6W"�6WEW6W%��W6U7FFR��V���6��7B�vR�6WEvU��W6U7FFR�vF6�&�&Br���6��7B�fV��6�W2�6WEfV��6�W5��W6U7FFR�7&VFT��F��fV��6�W2���6��7B�F�7F6�W2�6WDF�7F6�W5��W6U7FFR�7&VFT��F��F�7F6�W2���6��7B�F�vW2�6WDF�vW5��W6U7FFR�7&VFT��F��F�vW2���6��7B���7V7F���2�6WD��7V7F���5��W6U7FFR��ғ��6��7B�6V�V7FVEfV��6�T�B�6WE6V�V7FVEfV��6�T�E��W6U7FFR��V���6��7B�6��t&�G�6�V6��6WE6��t&�G�6�V6���W6U7FFR�f�6R���6��7B�&�G�6�V6�fV��6�T�B�6WD&�G�6�V6�fV��6�T�E��W6U7FFR��V���6��7B�F�7D�6r�6WEF�7D�6u��W6U7FFR�rr����6��7B6��uF�7B�W6T6��&6����6r�����6WEF�7D�6r��6r������ғ����b�W6W"�&WGW&����v��67&VV�����v��׷6WEW6W'��㰠�6��7B��F�U7F'D��7V7F�����f�B�����6WE6V�V7FVEfV��6�T�B�f�B���6WEvR�v��7V7F���r���Ӱ��6��7B��F�T6���WFT��7V7F�����FF�����6WD��7V7F���2��&Wb�������&Wb�FFғ��6WEfV��6�W2��&Wb���&Wb����b����b�B���FF�fV��6�T�B�����b���7V7FVC�G'VR��b�����6WEvR�wfV��6�TFWF��r���Ӱ��6��7B��F�T�V�&�G�6�V6���f�B�����6WD&�G�6�V6�fV��6�T�B�f�B���6WE6��t&�G�6�V6��G'VR���Ӱ��6��7B�f�vFR�����6WEvR�����&WGW&����F�b7G��S׷7G��W2����7G��S� ��W�g&�W26ƖFTF�v���g&����6�G���G&�6f�&ӢG&�6�FR��SR��#���ТF���6�G���G&�6f�&ӢG&�6�FR��SR���ТТ��&���6����s�&�&FW"�&����&v���FF��s��Т��WC�f�7W2�6V�V7C�f�7W2�&�&FW"�6���#�34#�$cb���'F�C�Т'WGF��7F�fR��6�G���S�G&�6f�&Ӣ66�R�㓂��Т���7G��Sࠢ��89�88>888;���Т�F�b7G��S׷7G��W2�VFW'���F�c��F�b7G��S׷7G��W2�VFW%F�F�W��n8:�8;>8+�8*�8;���F�c��F�b7G��S׷7G��W2�VFW%7V'���vR���vF6�&�&Brbb~8888>8+~8:^89�8;�88�wТ�vR���vF�7F6�rbb~�Xދ��z�ybwТ�vR���wfV��6�W2rbb~���K�K��jrwТ�vR���wfV��6�TFWF��rbb~���K���>{KwТ�vR���v��7V7F���rbb~x+�jI�89^8*�8;�8:wТ��F�c���F�c��F�b7G��S׷�F�7���vf�W�r�Ɩv�FV�3�v6V�FW"r�v�����7�7G��S׷�f��E6��S�2��6�G�������W6W"���W׷W6W"�&��R���v��vW"r�~�Ȏ[۞�~�^�Ȓr�rwТ��7���'WGF����6Ɩ6�ײ����6WEW6W"��V�Т7G��S׷��&6�w&�V�C�w&v&�#SR�#SR�#SR��"�r��&�&FW#�v���Rr��&�&FW%&F�W3����FF��s�sg��r��6���#�r6ffbr��f��E6��S�"��7W'6�#�w���FW"r��֖�V�v�C�3"���Т�8:�8+8*.8*n88����'WGF�����F�c���F�cࠢ��89�8;�8+���Т�vR���vF6�&�&Brbb���F6�&�&@�fV��6�W3׷fV��6�W7ТF�7F6�W3׶F�7F6�W7Т���f�vFS׶�f�vFWТ��6V�V7EfV��6�S׷6WE6V�V7FVEfV��6�T�GТ���Т�vR���vF�7F6�rbb���F�7F6�vP�F�7F6�W3׶F�7F6�W7Т6WDF�7F6�W3׷6WDF�7F6�W7ТfV��6�W3׷fV��6�W7ТW6W#׷W6W'Т6��uF�7C׷6��uF�7GТ���Т�vR���wfV��6�W2rbb���fV��6�TƗ7EvP�fV��6�W3׷fV��6�W7ТF�vW3׶F�vW7Т��6V�V7EfV�[O^��]�[X�Y�ZX�RYB�ۓ�]�Y�]O^ۘ]�Y�]_B�ς�
_B��Y�HOOH	ݙZX�Q]Z[	�	��
��ZX�Q]Z[Y�B��ZX�RY^��[X�Y�ZX�RYB��ZX�\�^ݙZX�\�B�[XY�\�^�[XY�\�B�[��X�[ۜ�^�[��X�[ۜ�B�ۓ�]�Y�]O^ۘ]�Y�]_B�۔�\�[��X�[ۏ^�[�T�\�[��X�[۟B�ς�
_B��Y�HOOH	�[��X�[ۉ�	��
�[��X�[ۑ�ܛB��ZX�RY^��[X�Y�ZX�RYB��ZX�\�^ݙZX�\�B�\�\�^�\�\�B�ې��\]O^�[�P��\]R[��X�[۟B�ۓ�]�Y�]O^ۘ]�Y�]_B�����\�^�����\�B�ۓ�[���P�X��^�[�S�[���P�X��B�ς�
_B���ʈ8��8�������x�������
��B����Л�P�X��	��
���P�X��ZX�RY^؛�P�X�ՙZX�RYB��ZX�\�^ݙZX�\�B�[XY�\�^�[XY�\�B��][XY�\�^��][XY�\�B�\�\�^�\�\�B�ې���O^�
HO��]��Л�P�X���[�J_B�����\�^�����\�B�ς�
_B���ʈ8��8��8��8�����
��B�]��[O^��[\˘���S�]�O����Y�	�\���\�	�X�ێ�	�'��	�X�[�	������8��	�K��Y�	�\�]�	�X�ێ�	�'����X�[�	�acz.��K��Y�	ݙZX�\��X�ێ�	�'���X�[�	�.�.(I�K�K�X\

�]�HO�
�]���^O^ۘ]��YB�ې�X��^�
HO��]�Y�]J�]��Y
_B��[O^��[\˛�]�][JY�HOOH�]��Y
�]��YOOH	ݙZX�\��	��
Y�HOOH	ݙZX�Q]Z[	�Y�HOOH	�[��X�[ۉ�JJ_B����[��[O^��[\˛�]�X�۟O�ۘ]��X�۟O��[����[��ۘ]��X�[O��[����]���
J_B��]�����ʈ8��8��8�x��
��B���\�\��	���\�Y\��Y�O^��\�\��Hې���O^�
HO��]�\�\��	��_HϟB��]����d/div>
  );
}
