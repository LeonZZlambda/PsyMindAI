import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';

const EnemCalculator = ({ onClose }) => {
  const { sendMessage } = useChat();
  const [mode, setMode] = useState('select'); // 'select', 'simple', 'advanced'
  
  const [scores, setScores] = useState({
    linguagens: '',
    humanas: '',
    natureza: '',
    matematica: '',
    redacao: ''
  });

  const [correctAnswers, setCorrectAnswers] = useState({
    linguagens: '',
    humanas: '',
    natureza: '',
    matematica: '',
    redacao: '' // Redação is score
  });

  const [desiredCourse, setDesiredCourse] = useState('');
  const [category, setCategory] = useState('Ampla Concorrência');
  const [result, setResult] = useState(null);
  const [ignoreRedacao, setIgnoreRedacao] = useState(false);
  const resultRef = useRef(null);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [result]);

  const categories = [
    'Ampla Concorrência',
    'Escola Pública (EP)',
    'Preto, Pardo ou Indígena (PPI)',
    'Pessoas com Deficiência (PcD)',
    'Baixa Renda'
  ];

  const handleCalculateSimple = () => {
    const values = Object.values(scores).map(val => parseFloat(val) || 0);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = (sum / 5).toFixed(2);
    setResult({ type: 'simple', value: avg });

    if (desiredCourse) {
      const prompt = `Realize uma análise de viabilidade para o SiSU/ProUni com os seguintes dados:
    
Notas do ENEM:
- Linguagens: ${scores.linguagens}
- Ciências Humanas: ${scores.humanas}
- Ciências da Natureza: ${scores.natureza}
- Matemática: ${scores.matematica}
- Redação: ${scores.redacao}

Média Simples Calculada: ${avg}

Curso Almejado: ${desiredCourse}
Modalidade de Concorrência: ${category}

Com base nas notas de corte recentes (2023/2024), liste quais universidades (Federais/Estaduais) eu teria chance de passar e quais seriam "arriscadas". Se possível, mencione os pesos comuns para este curso.`;
      
      sendMessage(prompt);
      onClose();
    }
  };

  const handleCalculateAdvanced = () => {
    // TRI Estimation Logic with Ranges
    const calculateTRIRange = (correct, maxScore, minScore = 300) => {
        const c = parseFloat(correct) || 0;
        if (c === 0) return { min: 0, max: 0, avg: 0 };
        if (c === 45) return { min: maxScore, max: maxScore, avg: maxScore };

        const ratio = c / 45;
        const baseScore = minScore + ratio * (maxScore - minScore);
        // TRI variation (higher in the middle)
        const volatility = 50 * Math.sin(ratio * Math.PI); 
        
        return {
            min: Math.floor(baseScore - volatility),
            max: Math.ceil(baseScore + volatility),
            avg: Math.round(baseScore)
        };
    };

    const triLinguagens = calculateTRIRange(correctAnswers.linguagens, 820, 280);
    const triHumanas = calculateTRIRange(correctAnswers.humanas, 860, 300);
    const triNatureza = calculateTRIRange(correctAnswers.natureza, 880, 300);
    const triMatematica = calculateTRIRange(correctAnswers.matematica, 980, 320);
    
    const redacaoVal = ignoreRedacao ? 0 : (parseFloat(correctAnswers.redacao) || 0);
    const divisor = ignoreRedacao ? 4 : 5;

    const totalMin = (triLinguagens.min + triHumanas.min + triNatureza.min + triMatematica.min + redacaoVal) / divisor;
    const totalMax = (triLinguagens.max + triHumanas.max + triNatureza.max + triMatematica.max + redacaoVal) / divisor;
    const totalAvg = (triLinguagens.avg + triHumanas.avg + triNatureza.avg + triMatematica.avg + redacaoVal) / divisor;

    setResult({ 
      type: 'advanced', 
      value: totalAvg.toFixed(2), // Keep for compatibility
      range: { min: totalMin.toFixed(2), max: totalMax.toFixed(2) },
      details: { 
        linguagens: triLinguagens, 
        humanas: triHumanas, 
        natureza: triNatureza, 
        matematica: triMatematica 
      },
      ignoredRedacao: ignoreRedacao
    });

    if (desiredCourse) {
        const prompt = `Realize uma análise de viabilidade para o SiSU/ProUni com base na quantidade de acertos (TRI Estimado):

Acertos e Estimativas TRI:
- Linguagens: ${correctAnswers.linguagens}/45 (Est: ${triLinguagens.min}-${triLinguagens.max})
- Humanas: ${correctAnswers.humanas}/45 (Est: ${triHumanas.min}-${triHumanas.max})
- Natureza: ${correctAnswers.natureza}/45 (Est: ${triNatureza.min}-${triNatureza.max})
- Matemática: ${correctAnswers.matematica}/45 (Est: ${triMatematica.min}-${triMatematica.max})
${ignoreRedacao ? '- Nota Redação: NÃO INFORMADA (Ignorada no cálculo)' : `- Nota Redação: ${correctAnswers.redacao}`}

Média Estimada (Intervalo): ${totalMin.toFixed(2)} a ${totalMax.toFixed(2)}
${ignoreRedacao ? '(Considerando apenas as 4 áreas objetivas)' : ''}

Curso Almejado: ${desiredCourse}
Modalidade: ${category}

Por favor, analise as chances de aprovação considerando esse intervalo de notas (pessimista e otimista). ${ignoreRedacao ? 'Considere que a nota da redação ainda não saiu.' : ''}`;
        sendMessage(prompt);
        onClose();
    }
  };

  const handleScoreChange = (e) => {
    const { name, value } = e.target;
    if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 1000)) {
      setScores(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCorrectChange = (e) => {
    const { name, value } = e.target;
    const max = name === 'redacao' ? 1000 : 45;
    if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= max)) {
      setCorrectAnswers(prev => ({ ...prev, [name]: value }));
    }
  };

  if (mode === 'select') {
    return (
      <div className="enem-calculator">
        <div className="calc-mode-selection">
          <div className="calc-mode-card" onClick={() => setMode('simple')}>
            <div className="calc-mode-icon">
              <span className="material-symbols-outlined">calculate</span>
            </div>
            <h4>Média Simples</h4>
            <p>Já tenho minhas notas finais e quero calcular a média.</p>
          </div>
          <div className="calc-mode-card" onClick={() => setMode('advanced')}>
            <div className="calc-mode-icon">
              <span className="material-symbols-outlined">fact_check</span>
            </div>
            <h4>Por Acertos</h4>
            <p>Tenho apenas o gabarito e quero estimar minha nota.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="enem-calculator">
      <div className="calc-extra-inputs">
        <div className="md-input-group full-width has-icon">
          <span className="material-symbols-outlined field-icon">school</span>
          <input 
            type="text" 
            value={desiredCourse} 
            onChange={(e) => setDesiredCourse(e.target.value)}
            placeholder=" "
            id="desiredCourse"
          />
          <label htmlFor="desiredCourse">Curso Almejado (ex: Medicina)</label>
        </div>
        <div className="md-input-group full-width has-icon">
          <span className="material-symbols-outlined field-icon">category</span>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            id="category"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <label htmlFor="category">Categoria de Concorrência</label>
        </div>
      </div>

      <div className="calc-inputs">
        {mode === 'simple' ? (
          <>
            <div className="md-input-group has-icon">
              <span className="material-symbols-outlined field-icon">translate</span>
              <input 
                type="number" 
                name="linguagens" 
                value={scores.linguagens} 
                onChange={handleScoreChange}
                placeholder=" "
                id="linguagens"
              />
              <label htmlFor="linguagens">Linguagens</label>
            </div>
            <div className="md-input-group has-icon">
              <span className="material-symbols-outlined field-icon">history_edu</span>
              <input 
                type="number" 
                name="humanas" 
                value={scores.humanas} 
                onChange={handleScoreChange}
                placeholder=" "
                id="humanas"
              />
              <label htmlFor="humanas">Ciências Humanas</label>
            </div>
            <div className="md-input-group has-icon">
              <span className="material-symbols-outlined field-icon">biotech</span>
              <input 
                type="number" 
                name="natureza" 
                value={scores.natureza} 
                onChange={handleScoreChange}
                placeholder=" "
                id="natureza"
              />
              <label htmlFor="natureza">Ciências da Natureza</label>
            </div>
            <div className="md-input-group has-icon">
              <span className="material-symbols-outlined field-icon">calculate</span>
              <input 
                type="number" 
                name="matematica" 
                value={scores.matematica} 
                onChange={handleScoreChange}
                placeholder=" "
                id="matematica"
              />
              <label htmlFor="matematica">Matemática</label>
            </div>
            <div className="md-input-group has-icon">
              <span className="material-symbols-outlined field-icon">edit_note</span>
              <input 
                type="number" 
                name="redacao" 
                value={scores.redacao} 
                onChange={handleScoreChange}
                placeholder=" "
                id="redacao"
              />
              <label htmlFor="redacao">Redação</label>
            </div>
          </>
        ) : (
          <>
            <div className="md-input-group has-icon">
              <span className="material-symbols-outlined field-icon">translate</span>
              <input 
                type="number" 
                name="linguagens" 
                value={correctAnswers.linguagens} 
                onChange={handleCorrectChange}
                placeholder=" "
                id="linguagens_correct"
              />
              <label htmlFor="linguagens_correct">Acertos Linguagens (0-45)</label>
            </div>
            <div className="md-input-group has-icon">
              <span className="material-symbols-outlined field-icon">history_edu</span>
              <input 
                type="number" 
                name="humanas" 
                value={correctAnswers.humanas} 
                onChange={handleCorrectChange}
                placeholder=" "
                id="humanas_correct"
              />
              <label htmlFor="humanas_correct">Acertos Humanas (0-45)</label>
            </div>
            <div className="md-input-group has-icon">
              <span className="material-symbols-outlined field-icon">biotech</span>
              <input 
                type="number" 
                name="natureza" 
                value={correctAnswers.natureza} 
                onChange={handleCorrectChange}
                placeholder=" "
                id="natureza_correct"
              />
              <label htmlFor="natureza_correct">Acertos Natureza (0-45)</label>
            </div>
            <div className="md-input-group has-icon">
              <span className="material-symbols-outlined field-icon">calculate</span>
              <input 
                type="number" 
                name="matematica" 
                value={correctAnswers.matematica} 
                onChange={handleCorrectChange}
                placeholder=" "
                id="matematica_correct"
              />
              <label htmlFor="matematica_correct">Acertos Matemática (0-45)</label>
            </div>
            <div className={`md-input-group has-icon ${ignoreRedacao ? 'disabled' : ''}`}>
              <span className="material-symbols-outlined field-icon">edit_note</span>
              <input 
                type="number" 
                name="redacao" 
                value={correctAnswers.redacao} 
                onChange={handleCorrectChange}
                placeholder=" "
                id="redacao_score"
                disabled={ignoreRedacao}
              />
              <label htmlFor="redacao_score">Nota Redação (0-1000)</label>
            </div>
            
            <div className="checkbox-group full-width">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={ignoreRedacao} 
                  onChange={(e) => setIgnoreRedacao(e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">Ainda não tenho a nota da redação</span>
              </label>
            </div>
          </>
        )}
      </div>

      {result && (
        <div className="calc-result" ref={resultRef}>
          <span className="label">
            {mode === 'simple' ? 'Sua Média Simples:' : 'Média Estimada (Intervalo TRI):'}
          </span>
          
          {mode === 'simple' ? (
            <span className="value">{result.value}</span>
          ) : (
            <div className="tri-result-container">
              <div className="tri-range-display">
                <span className="range-val min">{result.range.min}</span>
                <span className="range-sep">a</span>
                <span className="range-val max">{result.range.max}</span>
              </div>
              <span className="tri-avg-label">Média provável: ~{result.value}</span>
            </div>
          )}
          
          {result.ignoredRedacao && (
            <div className="warning-box">
              <span className="material-symbols-outlined">warning</span>
              <p>A nota da Redação <strong>NÃO</strong> foi incluída neste cálculo. Esta média considera apenas as 4 áreas objetivas.</p>
            </div>
          )}

          <p className="note">
            {mode === 'simple' 
              ? '*Esta é uma média simples. O SiSU e ProUni podem usar pesos diferentes dependendo do curso e universidade.'
              : '*Esta é uma estimativa baseada em padrões anteriores. A nota real depende do TRI (Teoria de Resposta ao Item) e da dificuldade das questões.'}
          </p>
        </div>
      )}

      <div className="calc-actions">
        <button className="calc-btn secondary" onClick={() => { setMode('select'); setResult(null); }}>
          Trocar Modo
        </button>
        <button className="calc-btn primary" onClick={mode === 'simple' ? handleCalculateSimple : handleCalculateAdvanced}>
          {desiredCourse ? 'Calcular e Analisar com IA' : 'Calcular Média'}
        </button>
      </div>
    </div>
  );
};

const ExamsModal = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);

  const categories = [
    {
      id: 'international',
      title: 'Internacionais',
      icon: 'public',
      className: 'category-international',
      exams: [
        {
          name: 'SAT',
          fullName: 'Scholastic Assessment Test',
          subjects: ['Reading', 'Writing & Language', 'Math (No Calculator)', 'Math (Calculator)']
        },
        {
          name: 'ACT',
          fullName: 'American College Testing',
          subjects: ['English', 'Math', 'Reading', 'Science', 'Writing (Optional)']
        },
        {
          name: 'TOEFL',
          fullName: 'Test of English as a Foreign Language',
          subjects: ['Reading', 'Listening', 'Speaking', 'Writing']
        },
        {
          name: 'IELTS',
          fullName: 'International English Language Testing System',
          subjects: ['Listening', 'Reading', 'Writing', 'Speaking']
        },
        {
          name: 'IB',
          fullName: 'International Baccalaureate',
          subjects: ['Studies in Language and Literature', 'Language Acquisition', 'Individuals and Societies', 'Sciences', 'Mathematics', 'The Arts']
        }
      ]
    },
    {
      id: 'national',
      title: 'Nacionais',
      icon: 'flag',
      className: 'category-national',
      exams: [
        {
          name: 'ENEM',
          fullName: 'Exame Nacional do Ensino Médio',
          subjects: ['Linguagens, Códigos e suas Tecnologias', 'Ciências Humanas e suas Tecnologias', 'Ciências da Natureza e suas Tecnologias', 'Matemática e suas Tecnologias', 'Redação']
        },
        {
          name: 'SAEB',
          fullName: 'Sistema de Avaliação da Educação Básica',
          subjects: ['Língua Portuguesa', 'Matemática']
        },
        {
          name: 'Encceja',
          fullName: 'Certificação de Competências',
          subjects: ['Ciências da Natureza', 'Matemática', 'Linguagens e Códigos', 'Ciências Humanas']
        },
        {
          name: 'Calculadora ENEM',
          fullName: 'Simulador SiSU/ProUni',
          isCalculator: true,
          subjects: []
        }
      ]
    },
    {
      id: 'regional',
      title: 'Regionais',
      icon: 'location_on',
      className: 'category-regional',
      exams: [
        {
          name: 'FUVEST',
          fullName: 'USP',
          subjects: ['Português', 'Matemática', 'História', 'Geografia', 'Física', 'Química', 'Biologia', 'Inglês', 'Interdisciplinares']
        },
        {
          name: 'COMVEST',
          fullName: 'Unicamp',
          subjects: ['Português e Literaturas', 'Matemática', 'História', 'Geografia', 'Física', 'Química', 'Biologia', 'Inglês']
        },
        {
          name: 'VUNESP',
          fullName: 'Unesp',
          subjects: ['Linguagens e Códigos', 'Ciências Humanas', 'Ciências da Natureza', 'Matemática']
        },
        {
          name: 'Provão Paulista',
          fullName: 'Avaliação Seriada',
          subjects: ['Linguagens', 'Matemática', 'Ciências da Natureza', 'Ciências Humanas']
        },
        {
          name: 'UERJ',
          fullName: 'Universidade do Estado do Rio de Janeiro',
          subjects: ['Linguagens', 'Matemática', 'Ciências da Natureza', 'Ciências Humanas', 'Redação']
        },
        {
          name: 'UFRGS',
          fullName: 'Universidade Federal do Rio Grande do Sul',
          subjects: ['Física', 'Literatura', 'Língua Estrangeira', 'Português', 'Redação', 'Biologia', 'Química', 'Geografia', 'História', 'Matemática']
        }
      ]
    },
    {
      id: 'olympiads',
      title: 'Olimpíadas',
      icon: 'emoji_events',
      className: 'category-olympiads',
      exams: [
        { name: 'OBMEP', fullName: 'Matemática' },
        { name: 'OBA', fullName: 'Astronomia' },
        { name: 'OBI', fullName: 'Informática' },
        { name: 'OBF', fullName: 'Física' },
        { name: 'OBQ', fullName: 'Química' },
        { name: 'ONC', fullName: 'Ciências' }
      ]
    }
  ];

  const getSubjectConfig = (subjectName) => {
    const lowerName = subjectName.toLowerCase();
    
    // Specific Math Types (SAT)
    if (lowerName.includes('no calculator')) {
      return { icon: 'stylus', className: 'subject-math-nocalc' };
    }
    if (lowerName.includes('calculator')) {
      return { icon: 'calculate', className: 'subject-math-calc' };
    }

    if (lowerName.includes('matemática') || lowerName.includes('math') || lowerName.includes('raciocínio')) {
      return { icon: 'calculate', className: 'subject-math' };
    }
    if (lowerName.includes('física') || lowerName.includes('physics')) {
      return { icon: 'bolt', className: 'subject-physics' };
    }
    if (lowerName.includes('química') || lowerName.includes('chemistry')) {
      return { icon: 'science', className: 'subject-chemistry' };
    }
    if (lowerName.includes('biologia') || lowerName.includes('biology') || lowerName.includes('natureza') || lowerName.includes('science')) {
      return { icon: 'biotech', className: 'subject-biology' };
    }
    if (lowerName.includes('história') || lowerName.includes('history') || lowerName.includes('humanas') || lowerName.includes('societies')) {
      return { icon: 'history_edu', className: 'subject-history' };
    }
    if (lowerName.includes('geografia') || lowerName.includes('geography')) {
      return { icon: 'public', className: 'subject-geography' };
    }

    // Specific Language Skills (IELTS, TOEFL, SAT, ACT)
    if (lowerName.includes('listening')) {
      return { icon: 'hearing', className: 'subject-listening' };
    }
    if (lowerName.includes('speaking')) {
      return { icon: 'record_voice_over', className: 'subject-speaking' };
    }
    if (lowerName.includes('reading')) {
      return { icon: 'auto_stories', className: 'subject-reading' };
    }
    if (lowerName.includes('writing') || lowerName.includes('redação') || lowerName.includes('essay')) {
      return { icon: 'edit_note', className: 'subject-essay' };
    }

    if (lowerName.includes('português') || lowerName.includes('linguagens') || lowerName.includes('english') || lowerName.includes('literature') || lowerName.includes('language')) {
      return { icon: 'translate', className: 'subject-languages' };
    }
    if (lowerName.includes('art') || lowerName.includes('artes')) {
      return { icon: 'palette', className: 'subject-arts' };
    }
    
    return { icon: 'menu_book', className: 'subject-default' };
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setSelectedCategory(null);
      setSelectedExam(null);
    }, 300);
  };

  const handleExamClick = (exam) => {
    if (selectedCategory.id === 'olympiads') return;
    setSelectedExam(exam);
  };

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`}>
      <div className="exams-modal">
        <div className="modal-header">
          <h2>Preparatório</h2>
          <button className="close-btn" onClick={handleClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="exams-body">
          {!selectedCategory ? (
            <div className="exams-categories-grid">
              {categories.map((category) => (
                <button 
                  key={category.id}
                  className={`exam-category-btn ${category.className}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <div className="category-icon">
                    <span className="material-symbols-outlined">{category.icon}</span>
                  </div>
                  <span>{category.title}</span>
                </button>
              ))}
            </div>
          ) : !selectedExam ? (
            <div className="exams-list-view">
              <button 
                className="back-btn"
                onClick={() => setSelectedCategory(null)}
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Voltar
              </button>
              
              <div className={`category-header-small ${selectedCategory.className}`}>
                <span className="material-symbols-outlined">{selectedCategory.icon}</span>
                <h3>{selectedCategory.title}</h3>
              </div>

              <div className="exams-list">
                {selectedCategory.exams.map((exam, index) => (
                  <button 
                    key={index} 
                    className={`exam-item-modal ${selectedCategory.id === 'olympiads' ? 'no-hover' : ''}`}
                    onClick={() => handleExamClick(exam)}
                    style={{ cursor: selectedCategory.id === 'olympiads' ? 'default' : 'pointer' }}
                  >
                    <span className="material-symbols-outlined">school</span>
                    <div className="exam-info">
                      <span className="exam-name">{exam.name}</span>
                      <span className="exam-fullname">{exam.fullName}</span>
                    </div>
                    {selectedCategory.id !== 'olympiads' && (
                      <span className="material-symbols-outlined arrow-icon">chevron_right</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="exams-subjects-view">
              <button 
                className="back-btn"
                onClick={() => setSelectedExam(null)}
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Voltar
              </button>

              <div className="exam-header-detail">
                <h3>{selectedExam.name}</h3>
                <p>{selectedExam.fullName}</p>
              </div>

              {selectedExam.isCalculator ? (
                <EnemCalculator onClose={onClose} />
              ) : (
                <div className="subjects-grid">
                  {selectedExam.subjects.map((subject, index) => {
                    const { icon, className } = getSubjectConfig(subject);
                    return (
                      <div key={index} className={`subject-card ${className}`}>
                        <div className="subject-icon-wrapper">
                          <span className="material-symbols-outlined">{icon}</span>
                        </div>
                        <span>{subject}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamsModal;
