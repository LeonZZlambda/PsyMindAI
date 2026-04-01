import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const StudyStatsModal = ({ isOpen, onClose }) => {
  // Estado real dos estudos
  const [studyLogs, setStudyLogs] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLogTopic, setNewLogTopic] = useState('');
  const [newLogMinutes, setNewLogMinutes] = useState('30');

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('psymind_study_logs');
      if (stored) {
        try {
          setStudyLogs(JSON.parse(stored));
        } catch (e) {
          console.error("Error parsing study logs", e);
        }
      } else {
        // Dados de exemplo se for primeiro acesso
        const today = new Date();
        const yDay = new Date(today); yDay.setDate(today.getDate() - 1);
        const yyDay = new Date(today); yyDay.setDate(today.getDate() - 2);
        
        const initialLogs = [
          { date: yyDay.toISOString(), minutes: 120, topic: 'Matemática Financeira' },
          { date: yDay.toISOString(), minutes: 180, topic: 'História do Brasil' },
          { date: today.toISOString(), minutes: 240, topic: 'Matemática Financeira' },
          { date: today.toISOString(), minutes: 60, topic: 'Redação' }
        ];
        setStudyLogs(initialLogs);
        localStorage.setItem('psymind_study_logs', JSON.stringify(initialLogs));
      }
    }
  }, [isOpen]);

  const handleAddLog = () => {
    if (!newLogTopic.trim() || !newLogMinutes) return;
    
    const log = {
      date: new Date().toISOString(),
      minutes: parseInt(newLogMinutes, 10),
      topic: newLogTopic.trim()
    };
    
    const updated = [...studyLogs, log];
    setStudyLogs(updated);
    localStorage.setItem('psymind_study_logs', JSON.stringify(updated));
    setNewLogTopic('');
    setShowAddForm(false);
  };

  // Cálculos dinâmicos
  const computedStats = useMemo(() => {
    if (!studyLogs.length) return {
      avgFocus: '0m', retention: '0%', streakWeeks: 0,
      weeklyData: [
        { day: 'Seg', percent: 0, value: '0h', active: false },
        { day: 'Ter', percent: 0, value: '0h', active: false },
        { day: 'Qua', percent: 0, value: '0h', active: false },
        { day: 'Qui', percent: 0, value: '0h', active: false },
        { day: 'Sex', percent: 0, value: '0h', active: false },
        { day: 'Sáb', percent: 0, value: '0h', active: false },
        { day: 'Dom', percent: 0, value: '0h', active: false }
      ],
      disciplines: [],
      aiTip: "Você ainda não tem registros de estudo. Comece a registrar para receber insights!"
    };

    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday...
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    startOfWeek.setHours(0,0,0,0);

    const msInDay = 24 * 60 * 60 * 1000;
    const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

    // Dias da Semana (Ritmo)
    const baseWeekly = weekDays.map((name, index) => {
      const dayStart = new Date(startOfWeek.getTime() + index * msInDay);
      const dayEnd = new Date(dayStart.getTime() + msInDay);
      
      const dayMins = studyLogs
        .filter(l => {
          const d = new Date(l.date);
          return d >= dayStart && d < dayEnd;
        })
        .reduce((acc, l) => acc + l.minutes, 0);
        
      const isToday = index === (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
      return {
        day: name,
        minutes: dayMins,
        value: dayMins >= 60 ? `${Math.floor(dayMins/60)}h${dayMins%60>0 ? ` ${dayMins%60}m`:''}` : `${dayMins}m`,
        active: isToday
      };
    });

    const maxMins = Math.max(...baseWeekly.map(d => d.minutes), 60);
    const weeklyData = baseWeekly.map(d => ({
      ...d,
      percent: Math.min((d.minutes / maxMins) * 100, 100)
    }));

    // Disciplinas
    const discMap = {};
    let totalMins = 0;
    studyLogs.forEach(l => {
      discMap[l.topic] = (discMap[l.topic] || 0) + l.minutes;
      totalMins += l.minutes;
    });

    const defaultColors = ['#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#F44336'];
    const disciplines = Object.entries(discMap).map(([topic, mins], i) => ({
      topic,
      minutes: mins,
      percent: Math.round((mins / totalMins) * 100),
      color: defaultColors[i % defaultColors.length]
    })).sort((a,b) => b.percent - a.percent);

    const avgFocusValue = Math.round(totalMins / studyLogs.length);
    const avgFocusStr = avgFocusValue >= 60 ? `${Math.floor(avgFocusValue/60)}h${avgFocusValue%60>0 ? ` ${avgFocusValue%60}m`:''}` : `${avgFocusValue}m`;

    return {
      avgFocus: avgFocusStr,
      retention: '85%', // Simulado (precisaria de dados de quiz/testes)
      streakWeeks: 2,   // Simulado (precisaria calcular de semanas ativas pra trás)
      weeklyData,
      disciplines,
      aiTip: disciplines.length > 0 
        ? `Sua dedicação em ${disciplines[0].topic} está ótima (${disciplines[0].percent}%)! Se sentir cansaço, alterne com outras matérias.`
        : "Comece a revisar os tópicos pendentes para construir seu histórico."
    };
  }, [studyLogs]);

  if (!isOpen) return null;

  const { weeklyData, disciplines } = computedStats;

  const chartWidth = 500;
  const chartHeight = 160;
  const paddingX = 30;
  const paddingTop = 30;
  const paddingBottom = 40;

  const points = weeklyData.map((d, i) => {
    const x = paddingX + (i * ((chartWidth - paddingX * 2) / (weeklyData.length - 1)));
    const y = chartHeight - paddingBottom - (d.percent / 100) * (chartHeight - paddingTop - paddingBottom);
    return { x, y, ...d };
  });

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');
  const polygonPoints = `${Math.min(...points.map(p=>p.x))},${chartHeight - paddingBottom} ${polylinePoints} ${Math.max(...points.map(p=>p.x))},${chartHeight - paddingBottom}`;

  return (
    <motion.div 
      className="modal-overlay" 
      onClick={onClose} 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--card-background)' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-color)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary-color)' }}>school</span>
            Dashboard de Estudos
          </h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              style={{ background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
              Sessão
            </button>
            <button className="close-btn" onClick={onClose} aria-label="Fechar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-color)', display: 'flex', alignItems: 'center' }}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--bg-color)' }}>
          {showAddForm && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ padding: '16px', background: 'var(--card-background)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-color)' }}>Registrar Estudo (Dia Atual)</h3>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <input 
                    type="text" 
                    placeholder="Matéria / Tópico" 
                    value={newLogTopic}
                    onChange={(e) => setNewLogTopic(e.target.value)}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }}
                  />
                  <select 
                    value={newLogMinutes}
                    onChange={(e) => setNewLogMinutes(e.target.value)}
                    style={{ width: '120px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)' }}
                  >
                    <option value="15">15 min</option>
                    <option value="30">30 min</option>
                    <option value="45">45 min</option>
                    <option value="60">1 hora</option>
                    <option value="90">1h 30m</option>
                    <option value="120">2 horas</option>
                  </select>
                  <button 
                    onClick={handleAddLog}
                    style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: 'var(--primary-color)', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
                    Salvar
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Métricas Principais */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'var(--card-hover)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#4CAF50', marginBottom: '8px' }}>psychology</span>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--text-light)' }}>Foco Médio</h3>
              <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-color)' }}>{computedStats.avgFocus}</p>
            </div>
            
            <div style={{ background: 'var(--card-hover)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#2196F3', marginBottom: '8px' }}>task_alt</span>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--text-light)' }}>Retenção</h3>
              <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-color)' }}>{computedStats.retention}</p>
            </div>
            
            <div style={{ background: 'var(--card-hover)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#FF9800', marginBottom: '8px' }}>local_fire_department</span>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--text-light)' }}>Ofensiva (Semanas)</h3>
              <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-color)' }}>{computedStats.streakWeeks}</p>
            </div>
          </div>

          {/* Gráfico de Horas de Estudo */}
          <div style={{ background: 'var(--card-hover)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: 'var(--text-color)' }}>Ritmo Semanal</h3>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', overflowX: 'auto', paddingBottom: '8px' }}>
              <div style={{ minWidth: '400px', width: '100%', position: 'relative' }}>
                <svg width="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary-color)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="var(--primary-color)" stopOpacity="0.01" />
                    </linearGradient>
                  </defs>
                  
                  {/* Linhas de grade sutis (horizontal) */}
                  {[0, 25, 50, 75, 100].map(percent => {
                    const y = chartHeight - paddingBottom - (percent / 100) * (chartHeight - paddingTop - paddingBottom);
                    return (
                      <line key={percent} x1={paddingX} y1={y} x2={chartWidth - paddingX} y2={y} stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" />
                    );
                  })}

                  {/* Preenchimento de Gradiente */}
                  <motion.polygon 
                    points={polygonPoints} 
                    fill="url(#chartGradient)"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  />

                  {/* Linha principal */}
                  <motion.polyline 
                    points={polylinePoints} 
                    fill="none" 
                    stroke="var(--primary-color)" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />

                  {/* Pontos de dados */}
                  {points.map((p, i) => (
                    <g key={i}>
                      {/* Círculo do ponto */}
                      <motion.circle 
                        cx={p.x} cy={p.y} r={p.active ? 6 : 4} 
                        fill={p.active ? "var(--bg-color)" : "var(--primary-color)"} 
                        stroke="var(--primary-color)" 
                        strokeWidth={p.active ? 3 : 0}
                        style={{ zIndex: 10 }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                      />

                      {/* Rótulo de valor em cima */}
                      <motion.text 
                        x={p.x} y={p.y - 12} 
                        textAnchor="middle" 
                        fontSize="11" 
                        fill={p.active ? "var(--text-color)" : "var(--text-light)"}
                        fontWeight={p.active ? "bold" : "normal"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.6 + i * 0.05 }}
                      >
                        {p.value}
                      </motion.text>

                      {/* Rótulo do dia da semana embaixo */}
                      <text 
                        x={p.x} y={chartHeight - paddingBottom + 24} 
                        textAnchor="middle" 
                        fontSize="12" 
                        fill={p.active ? "var(--primary-color)" : "var(--text-light)"}
                        fontWeight={p.active ? "bold" : "normal"}
                      >
                        {p.day}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </div>

          {/* Tópicos Mais Estudados e Insights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-color)' }}>Foco por Disciplina</h3>
            
            <div style={{ background: 'var(--card-hover)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {disciplines.map((item, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-color)', fontWeight: '500' }}>{item.topic}</span>
                      <span style={{ color: 'var(--text-light)' }}>{item.percent}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${item.percent}%`, height: '100%', background: item.color, borderRadius: '4px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{ marginTop: '20px', padding: '12px', background: 'var(--user-msg-bg)', borderRadius: '8px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary-color)', fontSize: '20px' }}>lightbulb</span>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-color)', lineHeight: '1.4' }}>
                  <strong>Dica da IA:</strong> {computedStats.aiTip}
                </p>
              </div>

            </div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
};

export default StudyStatsModal;