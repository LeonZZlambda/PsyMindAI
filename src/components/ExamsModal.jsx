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
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const modes = ['select', 'simple', 'advanced'];
        const currentIndex = modes.indexOf(mode);
        const nextIndex = (currentIndex + 1) % modes.length;
        setMode(modes[nextIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

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

const examTopics = {
  'Matemática': [
    'Aritmética Básica (Frações, Decimais, Porcentagem)',
    'Funções (1º e 2º Grau, Exponencial, Logarítmica)',
    'Geometria Plana (Áreas, Perímetros, Ângulos)',
    'Geometria Espacial (Volumes, Prismas, Cilindros)',
    'Estatística (Média, Moda, Mediana, Desvio Padrão)',
    'Probabilidade e Análise Combinatória',
    'Trigonometria (Triângulo Retângulo, Ciclo Trigonométrico)',
    'Matemática Financeira (Juros Simples e Compostos)'
  ],
  'Linguagens': [
    'Interpretação de Texto e Gêneros Textuais',
    'Variação Linguística e Funções da Linguagem',
    'Movimentos Literários (Romantismo, Modernismo, etc.)',
    'Gramática (Sintaxe, Morfologia, Semântica)',
    'Artes e Vanguardas Europeias',
    'Educação Física e Cultura Corporal',
    'Tecnologias da Informação e Comunicação'
  ],
  'Ciências Humanas': [
    'História do Brasil (Colônia, Império, República)',
    'História Geral (Antiguidade, Idade Média, Moderna, Contemporânea)',
    'Geografia Física (Clima, Relevo, Hidrografia)',
    'Geografia Humana (População, Urbanização, Agricultura)',
    'Geopolítica e Globalização',
    'Filosofia (Antiga, Moderna, Contemporânea, Ética)',
    'Sociologia (Cultura, Trabalho, Desigualdade, Instituições)'
  ],
  'Ciências da Natureza': [
    'Física: Mecânica (Cinemática, Dinâmica, Energia)',
    'Física: Eletricidade e Magnetismo',
    'Física: Termologia e Óptica',
    'Física: Ondulatória',
    'Química: Geral e Inorgânica (Atomística, Ligações, Funções)',
    'Química: Físico-Química (Soluções, Termoquímica, Cinética)',
    'Química: Orgânica (Cadeias, Funções, Reações)',
    'Biologia: Citologia e Metabolismo Energético',
    'Biologia: Genética e Evolução',
    'Biologia: Ecologia e Meio Ambiente',
    'Biologia: Fisiologia Humana e Botânica'
  ],
  'Redação': [
    'Estrutura do Texto Dissertativo-Argumentativo',
    'Competência 1: Norma Culta',
    'Competência 2: Compreensão do Tema e Tipo Textual',
    'Competência 3: Seleção e Organização de Argumentos',
    'Competência 4: Coesão Textual',
    'Competência 5: Proposta de Intervenção',
    'Repertório Sociocultural',
    'Análise de Temas Anteriores'
  ],
  'Física': [
    'Mecânica (Cinemática, Dinâmica, Estática, Hidrostática)',
    'Termologia (Termometria, Calorimetria, Termodinâmica)',
    'Óptica (Geométrica e Física)',
    'Ondulatória (MHS, Ondas, Acústica)',
    'Eletricidade (Eletrostática, Eletrodinâmica, Eletromagnetismo)',
    'Física Moderna (Relatividade, Quântica, Nuclear)'
  ],
  'Química': [
    'Química Geral (Matéria, Átomo, Tabela Periódica, Ligações)',
    'Química Inorgânica (Ácidos, Bases, Sais, Óxidos, Reações)',
    'Físico-Química (Soluções, Termoquímica, Cinética, Equilíbrio, Eletroquímica)',
    'Química Orgânica (Cadeias, Funções, Isomeria, Reações)',
    'Química Ambiental e Bioquímica'
  ],
  'Biologia': [
    'Citologia (Célula, Membrana, Citoplasma, Núcleo)',
    'Metabolismo Energético (Fotossíntese, Respiração, Fermentação)',
    'Histologia e Fisiologia Humana/Animal',
    'Genética e Biotecnologia',
    'Evolução e Origem da Vida',
    'Ecologia e Meio Ambiente',
    'Botânica e Zoologia (Reinos)'
  ],
  'História': [
    'História Antiga (Grécia, Roma, Egito)',
    'Idade Média (Feudalismo, Igreja, Islã)',
    'Idade Moderna (Renascimento, Reformas, Absolutismo, Expansão Marítima)',
    'Idade Contemporânea (Revoluções, Guerras Mundiais, Guerra Fria)',
    'História do Brasil Colônia',
    'História do Brasil Império',
    'História do Brasil República'
  ],
  'Geografia': [
    'Geografia Física (Cartografia, Geologia, Clima, Vegetação)',
    'Geografia Humana (Demografia, Urbanização, Migrações)',
    'Geografia Econômica (Indústria, Agropecuária, Energia, Transportes)',
    'Geopolítica Mundial e Conflitos',
    'Geografia do Brasil (Regionalização, Economia, Sociedade)'
  ],
  'Inglês': [
    'Interpretação de Texto (Reading Comprehension)',
    'Vocabulário Contextual (Synonyms, Antonyms)',
    'Gramática Aplicada (Verb Tenses, Pronouns, Prepositions)',
    'Falsos Cognatos',
    'Expressões Idiomáticas'
  ],
  'Espanhol': [
    'Interpretação de Texto',
    'Falsos Cognatos (Heterosemánticos)',
    'Gramática Aplicada (Verbos, Pronombres, Artículos)',
    'Vocabulário e Cultura Hispânica'
  ],
  'SAT Reading & Writing': [
    'Craft and Structure (Words in Context, Text Structure)',
    'Information and Ideas (Central Ideas, Evidence)',
    'Standard English Conventions (Grammar, Punctuation)',
    'Expression of Ideas (Transitions, Rhetorical Synthesis)'
  ],
  'SAT Math': [
    'Heart of Algebra (Linear Equations, Systems)',
    'Problem Solving and Data Analysis (Ratios, Percentages, Probability)',
    'Passport to Advanced Math (Quadratics, Polynomials, Functions)',
    'Additional Topics (Geometry, Trigonometry, Complex Numbers)'
  ],
  'ACT English': [
    'Production of Writing (Topic Development, Organization)',
    'Knowledge of Language (Style, Tone)',
    'Conventions of Standard English (Sentence Structure, Punctuation)'
  ],
  'ACT Math': [
    'Number & Quantity (Real/Complex Numbers)',
    'Algebra & Functions',
    'Geometry (Plane, Coordinate, Solid)',
    'Statistics & Probability'
  ],
  'ACT Reading': [
    'Key Ideas and Details',
    'Craft and Structure',
    'Integration of Knowledge and Ideas'
  ],
  'ACT Science': [
    'Data Representation (Graphs, Tables)',
    'Research Summaries (Experiments)',
    'Conflicting Viewpoints (Hypotheses)'
  ],
  'TOEFL Reading': [
    'Reading for Gist/Main Idea',
    'Reading for Detail',
    'Inference and Rhetorical Purpose',
    'Vocabulary in Context'
  ],
  'TOEFL Listening': [
    'Gist-Content and Gist-Purpose',
    'Detail Questions',
    'Function and Attitude',
    'Connecting Content'
  ],
  'TOEFL Speaking': [
    'Independent Speaking Task',
    'Integrated Speaking Tasks (Read/Listen/Speak)'
  ],
  'TOEFL Writing': [
    'Integrated Writing Task',
    'Writing for an Academic Discussion'
  ],
  'IELTS Listening': [
    'Social Context (Conversation/Monologue)',
    'Educational/Training Context (Conversation/Monologue)'
  ],
  'IELTS Reading': [
    'Gist, Main Ideas, and Details',
    'Skimming and Scanning',
    'Understanding Logical Argument'
  ],
  'IELTS Writing': [
    'Task 1: Graph/Table/Chart Description',
    'Task 2: Essay Writing'
  ],
  'IELTS Speaking': [
    'Part 1: Introduction and Interview',
    'Part 2: Long Turn (Cue Card)',
    'Part 3: Discussion'
  ],
  'IB Theory of Knowledge': [
    'Knowledge Questions',
    'Areas of Knowledge (History, Human Sciences, Natural Sciences, Arts, Math)',
    'Core Theme: Knowledge and the Knower',
    'Optional Themes (Technology, Language, Politics, Religion, Indigenous Societies)'
  ],
  'IB Extended Essay': [
    'Research Question Formulation',
    'Methodology and Investigation',
    'Critical Thinking and Analysis',
    'Academic Writing and Referencing'
  ],
  'Português': [
    'Interpretação de Texto',
    'Gramática Normativa',
    'Morfologia e Sintaxe',
    'Semântica e Estilística',
    'Literatura Brasileira e Portuguesa',
    'Movimentos Literários',
    'Análise de Obras Obrigatórias'
  ],
  'Literatura': [
    'Teoria Literária',
    'Escolas Literárias (Barroco, Arcadismo, etc.)',
    'Literatura Contemporânea',
    'Leitura de Obras Obrigatórias'
  ]
};

const getTopicsForSubject = (subjectName, examName) => {
  const lower = subjectName.toLowerCase();
  const examLower = examName ? examName.toLowerCase() : '';

  // International Exams Logic
  if (examLower.includes('sat')) {
    if (lower.includes('math')) return examTopics['SAT Math'];
    if (lower.includes('reading') || lower.includes('writing')) return examTopics['SAT Reading & Writing'];
  }
  if (examLower.includes('act')) {
    if (lower.includes('math')) return examTopics['ACT Math'];
    if (lower.includes('english') || lower.includes('writing')) return examTopics['ACT English'];
    if (lower.includes('reading')) return examTopics['ACT Reading'];
    if (lower.includes('science')) return examTopics['ACT Science'];
  }
  if (examLower.includes('toefl')) {
    if (lower.includes('reading')) return examTopics['TOEFL Reading'];
    if (lower.includes('listening')) return examTopics['TOEFL Listening'];
    if (lower.includes('speaking')) return examTopics['TOEFL Speaking'];
    if (lower.includes('writing')) return examTopics['TOEFL Writing'];
  }
  if (examLower.includes('ielts')) {
    if (lower.includes('reading')) return examTopics['IELTS Reading'];
    if (lower.includes('listening')) return examTopics['IELTS Listening'];
    if (lower.includes('speaking')) return examTopics['IELTS Speaking'];
    if (lower.includes('writing')) return examTopics['IELTS Writing'];
  }
  if (examLower.includes('ib') || examLower.includes('baccalaureate')) {
    if (lower.includes('theory of knowledge')) return examTopics['IB Theory of Knowledge'];
    if (lower.includes('extended essay')) return examTopics['IB Extended Essay'];
    // Fallback for standard subjects in IB
    if (lower.includes('math')) return examTopics['SAT Math']; // Similar enough for general topics
    if (lower.includes('sciences')) return examTopics['Ciências da Natureza']; // Or specific
    if (lower.includes('individuals') || lower.includes('societies')) return examTopics['Ciências Humanas'];
    if (lower.includes('literature') || lower.includes('language')) return examTopics['Linguagens'];
    if (lower.includes('arts')) return examTopics['Linguagens'];
  }

  // Specific Subjects (Priority)
  if (lower === 'física' || lower === 'fisica') return examTopics['Física'];
  if (lower === 'química' || lower === 'quimica') return examTopics['Química'];
  if (lower === 'biologia') return examTopics['Biologia'];
  if (lower === 'história' || lower === 'historia') return examTopics['História'];
  if (lower === 'geografia') return examTopics['Geografia'];
  if (lower === 'português' || lower === 'portugues') return examTopics['Português'];
  if (lower === 'literatura') return examTopics['Literatura'];
  
  // Broad Categories
  if (lower.includes('matemática')) return examTopics['Matemática'];
  if (lower.includes('linguagens') || lower.includes('português') || lower.includes('literatura')) return examTopics['Linguagens'];
  if (lower.includes('humanas')) return examTopics['Ciências Humanas'];
  if (lower.includes('natureza')) return examTopics['Ciências da Natureza'];
  if (lower.includes('redação')) return examTopics['Redação'];
  
  // Languages
  if (lower.includes('inglês') || lower.includes('english')) return examTopics['Inglês'];
  if (lower.includes('espanhol')) return examTopics['Espanhol'];
  
  return ['Conteúdo Programático Geral', 'Resolução de Questões', 'Revisão de Conceitos'];
};

const ExamsModal = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

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
    
    // IB Specific
    if (lowerName.includes('acquisition')) {
      return { icon: 'translate', className: 'subject-languages' };
    }
    if (lowerName.includes('literature')) {
      return { icon: 'auto_stories', className: 'subject-literature' };
    }
    if (lowerName.includes('individuals') || lowerName.includes('societies')) {
      return { icon: 'groups', className: 'subject-humanities' };
    }
    
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
      setSelectedSubject(null);
    }, 300);
  };

  const handleExamClick = (exam) => {
    if (selectedCategory.id === 'olympiads') return;
    setSelectedExam(exam);
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
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
          ) : !selectedSubject ? (
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
                      <div 
                        key={index} 
                        className={`subject-card ${className}`}
                        onClick={() => handleSubjectClick(subject)}
                        style={{ cursor: 'pointer' }}
                      >
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
          ) : (
            <div className="exams-topics-view">
              <button 
                className="back-btn"
                onClick={() => setSelectedSubject(null)}
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Voltar
              </button>

              <div className="exam-header-detail">
                <h3>{selectedSubject}</h3>
                <p>Matriz de Referência e Conteúdos</p>
              </div>

              <div className="topics-list">
                {getTopicsForSubject(selectedSubject, selectedExam?.name).map((topic, index) => (
                  <div key={index} className="topic-item">
                    <span className="material-symbols-outlined topic-icon">check_circle</span>
                    <span className="topic-text">{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamsModal;
