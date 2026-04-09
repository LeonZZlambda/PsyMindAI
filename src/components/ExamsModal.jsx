import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { useTranslation, Trans } from 'react-i18next';
import BaseModal from './BaseModal';
import JudgeModal from './JudgeModal';
import QuizModal from './QuizModal';

const EnemCalculator = ({ onClose }) => {
  const { sendMessage } = useChat();
  const { t } = useTranslation();
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
      const prompt = t('exams.calculator.prompts.simple', {
        linguagens: scores.linguagens,
        humanas: scores.humanas,
        natureza: scores.natureza,
        matematica: scores.matematica,
        redacao: scores.redacao,
        avg: avg,
        course: desiredCourse,
        category: category
      });
      
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
        const redacaoInfo = ignoreRedacao ? '⚠️ Redação: AINDA NÃO DIVULGADA (excluída do cálculo)' : '• Redação: ' + correctAnswers.redacao + ' pontos';
        const observacao = ignoreRedacao ? '\n💡 (Cálculo baseado apenas nas 4 áreas objetivas)' : '';
        const impactoRedacao = ignoreRedacao ? '   - Como a nota da redação pode impactar minhas chances?' : '';
        
        const prompt = t('exams.calculator.prompts.advanced', {
          linguagens: correctAnswers.linguagens,
          triLinguagensMin: triLinguagens.min,
          triLinguagensMax: triLinguagens.max,
          humanas: correctAnswers.humanas,
          triHumanasMin: triHumanas.min,
          triHumanasMax: triHumanas.max,
          natureza: correctAnswers.natureza,
          triNaturezaMin: triNatureza.min,
          triNaturezaMax: triNatureza.max,
          matematica: correctAnswers.matematica,
          triMatematicaMin: triMatematica.min,
          triMatematicaMax: triMatematica.max,
          redacaoInfo: redacaoInfo,
          totalMin: totalMin.toFixed(2),
          totalMax: totalMax.toFixed(2),
          totalAvg: totalAvg.toFixed(2),
          observacao: observacao,
          course: desiredCourse,
          category: category,
          impactoRedacao: impactoRedacao
        });
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
            <h4>{t('exams.calculator.mode_simple.title')}</h4>
            <p>{t('exams.calculator.mode_simple.desc')}</p>
          </div>
          <div className="calc-mode-card" onClick={() => setMode('advanced')}>
            <div className="calc-mode-icon">
              <span className="material-symbols-outlined">fact_check</span>
            </div>
            <h4>{t('exams.calculator.mode_advanced.title')}</h4>
            <p>{t('exams.calculator.mode_advanced.desc')}</p>
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
          <label htmlFor="desiredCourse">{t('exams.calculator.inputs.course')}</label>
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
          <label htmlFor="category">{t('exams.calculator.inputs.category')}</label>
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
              <label htmlFor="linguagens">{t('exams.calculator.subjects.linguagens')}</label>
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
              <label htmlFor="humanas">{t('exams.calculator.subjects.humanas')}</label>
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
              <label htmlFor="natureza">{t('exams.calculator.subjects.natureza')}</label>
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
              <label htmlFor="matematica">{t('exams.calculator.subjects.matematica')}</label>
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
              <label htmlFor="redacao">{t('exams.calculator.subjects.redacao')}</label>
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
              <label htmlFor="linguagens_correct">{t('exams.calculator.correct_labels.linguagens')}</label>
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
              <label htmlFor="humanas_correct">{t('exams.calculator.correct_labels.humanas')}</label>
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
              <label htmlFor="natureza_correct">{t('exams.calculator.correct_labels.natureza')}</label>
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
              <label htmlFor="matematica_correct">{t('exams.calculator.correct_labels.matematica')}</label>
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
              <label htmlFor="redacao_score">{t('exams.calculator.correct_labels.redacao')}</label>
            </div>
            
            <div className="checkbox-group full-width">
              <label className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={ignoreRedacao} 
                  onChange={(e) => setIgnoreRedacao(e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">{t('exams.calculator.ignore_redacao')}</span>
              </label>
            </div>
          </>
        )}
      </div>

      {result && (
        <div className="calc-result" ref={resultRef}>
          <span className="label">
            {mode === 'simple' ? t('exams.calculator.result.simple_label') : t('exams.calculator.result.advanced_label')}
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
              <span className="tri-avg-label">{t('exams.calculator.result.avg', { val: result.value })}</span>
            </div>
          )}
          
          {result.ignoredRedacao && (
            <div className="warning-box">
              <span className="material-symbols-outlined">warning</span>
              <p><Trans i18nKey="exams.calculator.result.warning">A nota da Redação <strong>NÃO</strong> foi incluída neste cálculo. Esta média considera apenas as 4 áreas objetivas.</Trans></p>
            </div>
          )}

          <p className="note">
            {mode === 'simple' 
              ? t('exams.calculator.result.note_simple')
              : t('exams.calculator.result.note_advanced')}
          </p>
        </div>
      )}

      <div className="calc-actions">
        <button className="calc-btn secondary" onClick={() => { setMode('select'); setResult(null); }}>
          {t('exams.calculator.buttons.switch')}
        </button>
        <button className="calc-btn primary" onClick={mode === 'simple' ? handleCalculateSimple : handleCalculateAdvanced}>
          {desiredCourse ? t('exams.calculator.buttons.calc_ai') : t('exams.calculator.buttons.calc')}
        </button>
      </div>
    </div>
  );
};

const examTopics = {
  'Provão Paulista 1º Ano': [
    'Matemática: Funções, Progressão Aritmética (PA) e Geométrica (PG), Geometria Plana',
    'Física: Cinemática, Leis de Newton, Energia e Trabalho',
    'Química: Estrutura Atômica, Tabela Periódica, Ligações Químicas, Funções Inorgânicas',
    'Biologia: Citologia, Bioquímica Celular, Histologia Biológica',
    'Português: Gêneros Textuais, Variação Linguística, Literatura (Trovadorismo ao Realismo)',
    'História: Antiguidade Clássica, Idade Média, Brasil Colônia',
    'Geografia: Cartografia, Geofísica e Relevo, Clima e Vegetação',
    'Filosofia/Sociologia: Introdução à Filosofia, Ética, Indivíduo e Sociedade',
    'Inglês/Espanhol: Compreensão de Texto, Vocabulário Básico e Estruturas Gramaticais'
  ],
  'Provão Paulista 2º Ano': [
    'Matemática: Trigonometria, Matrizes e Sistemas Lineares, Geometria Espacial',
    'Física: Termologia, Termodinâmica, Óptica Geométrica, Ondulatória',
    'Química: Soluções, Termoquímica, Cinética Química, Equilíbrio Químico',
    'Biologia: Botânica, Zoologia, Fisiologia Humana Comparada',
    'Português: Sintaxe, Modernismo (1ª e 2ª Geração), Interpretação Crítica',
    'História: Brasil Império, Revolução Industrial, Revoluções Burguesas (Francesa e Independências)',
    'Geografia: Demografia, Urbanização, Geopolítica Contemporânea',
    'Filosofia/Sociologia: Contratualistas, Sociologia Brasileira, Cultura e Ideologia',
    'Inglês/Espanhol: Leitura Crítica e Expressões Idiomáticas'
  ],
  'Provão Paulista 3º Ano': [
    'Matemática: Geometria Analítica, Números Complexos, Polinômios, Probabilidade e Estatística',
    'Física: Eletromagnetismo, Eletrodinâmica, Física Moderna (Introdução)',
    'Química: Química Orgânica, Eletroquímica, Reações Orgânicas',
    'Biologia: Genética, Evolução, Ecologia e Sustentabilidade',
    'Português e Redação: Dissertação-Argumentativa, Literatura Contemporânea',
    'História: Brasil República (Era Vargas até Contemporâneo), Guerras Mundiais e Guerra Fria',
    'Geografia: Globalização, Economia e Espaço Agrário, Meio Ambiente e Questões Climáticas',
    'Filosofia/Sociologia: Política Contemporânea, Pensamento Crítico e Atualidades'
  ],
  'OBMEP Nível 1': [
    'Aritmética Básica (Operações, Frações, Decimais)',
    'Geometria Plana (Áreas, Perímetros, Ângulos Intuitivos)',
    'Lógica e Raciocínio (Padrões, Sequências)',
    'Contagem Básica e Análise Combinatória Inicial'
  ],
  'OBMEP Nível 2': [
    'Álgebra (Equações do 1º Grau, Sistemas)',
    'Geometria Plana (Teorema de Pitágoras, Semelhança)',
    'Contagem e Princípio Multiplicativo',
    'Probabilidade Básica',
    'Aritmética (Mínimo Múltiplo Comum, Divisibilidade)'
  ],
  'OBMEP Nível 3': [
    'Álgebra Avançada (Funções, Equações do 2º Grau, Inequações)',
    'Geometria Plana Avançada (Círculos, Relações Métricas)',
    'Combinatória e Probabilidade Complexas',
    'Teoria dos Números (Congruências, Primos)',
    'Polinômios e Sequências'
  ],
  'OBMEP Nível Júnior': [
    'Operações Fundamentais (Soma, Subtração, Multiplicação, Divisão)',
    'Raciocínio Lógico Simples',
    'Identificação de Padrões',
    'Noções Espaciais Básicas'
  ],
  
  'OBA Nível 1': [
    'Dia e Noite',
    'O Sol e a Lua',
    'Fases da Lua',
    'Estações do Ano',
    'Os Planetas e o Sistema Solar Simplificado'
  ],
  'OBA Nível 2': [
    'Sistema Solar (Ordem, Tamanhos)',
    'Movimentos da Terra (Rotação, Translação)',
    'Constelações Visíveis',
    'História da Astronomia Inicial'
  ],
  'OBA Nível 3': [
    'Gravitação Universal e Órbitas',
    'Física do Sistema Solar',
    'Evolução Estelar (Nascimento e Morte das Estrelas)',
    'Astronáutica e Satélites Artificiais'
  ],
  'OBA Nível 4': [
    'Leis de Kepler e Gravitação de Newton',
    'Astrofísica (Luminosidade, Espectro, Temperatura)',
    'Cosmologia (Big Bang, Expansão do Universo)',
    'Buracos Negros e Galáxias',
    'Mecânica Orbital e Propulsão Espacial'
  ],

  'OBI Iniciação': [
    'Lógica de Programação Básica',
    'Raciocínio Analítico e Problemas',
    'Algoritmos Simples sem Código',
    'Reconhecimento de Padrões'
  ],
  'OBI Programação Júnior': [
    'Variáveis e Tipos de Dados',
    'Estruturas Condicionais (If, Else)',
    'Estruturas de Repetição (For, While)',
    'Vetores e Strings Básicos'
  ],
  'OBI Programação 1': [
    'Matrizes e Vetores Multidimensionais',
    'Busca e Ordenação (Busca Binária, Bubble Sort)',
    'Funções e Recursão',
    'Estruturas de Dados Básicas'
  ],
  'OBI Programação 2': [
    'Grafos (Busca em Profundidade/Largura)',
    'Programação Dinâmica',
    'Algoritmos Gulosos (Greedy)',
    'Estruturas de Dados Avançadas (Árvores, Fila de Prioridade, Segment Tree)'
  ],

  'OBF Nível 1': [
    'Conceitos Iniciais de Cinemática',
    'Grandezas Físicas e Medidas',
    'Calor e Temperatura',
    'Princípios de Eletricidade Básica'
  ],
  'OBF Nível 2': [
    'Mecânica Newtoniana Completa',
    'Termologia e Calorimetria',
    'Óptica Geométrica',
    'Ondulatória e Fenômenos Ondulatórios',
    'Eletrostática'
  ],
  'OBF Nível 3': [
    'Eletromagnetismo (Circuitos, Magnetismo, Indução)',
    'Mecânica dos Fluidos',
    'Termodinâmica Completa',
    'Física Moderna (Relatividade, Quântica)'
  ],

  'OBQjr OBQjr': [
    'Estados Físicos da Matéria e Mudanças',
    'Misturas e Substâncias (Separação de Misturas)',
    'Estrutura Atômica Simplificada',
    'Tabela Periódica Básica (Classificação)',
    'Reações Químicas Simples e Cotidianas'
  ],
  'OBQ Fase I': [
    'Modelos Atômicos e Estrutura Atômica',
    'Propriedades Periódicas',
    'Ligações Químicas',
    'Funções Inorgânicas',
    'Estequiometria Básica'
  ],
  'OBQ Fase II': [
    'Físico-Química (Soluções, Cinética Química, Termoquímica)',
    'Equilíbrio Químico',
    'Química Orgânica (Nomenclatura, Funções Orgânicas)',
    'Isomeria',
    'Reações Inorgânicas Avançadas'
  ],
  'OBQ Fase III': [
    'Eletroquímica (Pilhas, Eletrólise)',
    'Química Orgânica Avançada (Reações Orgânicas, Polímeros)',
    'Compostos de Coordenação',
    'Bioquímica',
    'Química Analítica Qualitativa',
    'Espectroscopia (Noções Básicas)'
  ],

  'ONC Nível A': [
    'Corpo Humano e Saúde Básica',
    'A Terra e a Vida',
    'Ecossistemas Brasileiros',
    'Ciclo da Água e Recursos Naturais'
  ],
  'ONC Nível B': [
    'Células (Estrutura e Funcionamento)',
    'Ecologia e Sustentabilidade',
    'Materiais e suas Transformações',
    'Fenômenos Térmicos e Ópticos no Cotidiano'
  ],
  'ONC Nível C': [
    'Fisiologia Humana Comparada',
    'Evolução Biológica e Genética Básica',
    'Química Ambiental',
    'Cinemática e Dinâmica Básicas'
  ],
  'ONC Nível D': [
    'Biologia Celular e Molecular',
    'Química Geral (Estrutura Atômica, Ligações, Tabela Periódica)',
    'Física Térmica e Óptica Geométrica',
    'Astronomia e Ciências do Espaço'
  ],
  'ONC Nível E': [
    'Física Moderna e Eletromagnetismo',
    'Físico-Química e Química Orgânica',
    'Ecologia de Populações e Dinâmica de Bio-Sistemas',
    'Geologia e Ciência do Clima',
    'Biotecnologia e Engenharia Genética'
  ],
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

  
  // Olympiads Logic
  if (examLower.includes('obmep')) {
    if (lower.includes('1')) return examTopics['OBMEP Nível 1'];
    if (lower.includes('2')) return examTopics['OBMEP Nível 2'];
    if (lower.includes('3')) return examTopics['OBMEP Nível 3'];
    if (lower.includes('júnior') || lower.includes('junior')) return examTopics['OBMEP Nível Júnior'];
  }
  if (examLower.includes('oba')) {
    if (lower.includes('1')) return examTopics['OBA Nível 1'];
    if (lower.includes('2')) return examTopics['OBA Nível 2'];
    if (lower.includes('3')) return examTopics['OBA Nível 3'];
    if (lower.includes('4')) return examTopics['OBA Nível 4'];
  }
  if (examLower.includes('obi')) {
    if (lower.includes('iniciação') || lower.includes('iniciacao')) return examTopics['OBI Iniciação'];
    if (lower.includes('júnior') || lower.includes('junior')) return examTopics['OBI Programação Júnior'];
    if (lower.includes('1')) return examTopics['OBI Programação 1'];
    if (lower.includes('2')) return examTopics['OBI Programação 2'];
  }
  if (examLower.includes('obf')) {
    if (lower.includes('1')) return examTopics['OBF Nível 1'];
    if (lower.includes('2')) return examTopics['OBF Nível 2'];
    if (lower.includes('3')) return examTopics['OBF Nível 3'];
  }
  if (examLower.includes('obq')) {
    if (lower.includes('obqjr') || lower.includes('jr')) return examTopics['OBQjr OBQjr'] || examTopics['OBQ Fase I'];
    if (lower.includes('i') && !lower.includes('ii') && !lower.includes('iii')) return examTopics['OBQ Fase I'];
    if (lower.includes('ii') && !lower.includes('iii')) return examTopics['OBQ Fase II'];
    if (lower.includes('iii')) return examTopics['OBQ Fase III'];
  }
  if (examLower.includes('onc')) {
    if (lower.includes('a')) return examTopics['ONC Nível A'];
    if (lower.includes('b')) return examTopics['ONC Nível B'];
    if (lower.includes('c')) return examTopics['ONC Nível C'];
    if (lower.includes('d')) return examTopics['ONC Nível D'];
    if (lower.includes('e')) return examTopics['ONC Nível E'];
  }

  
  // Provão Paulista Logic
  if (examLower.includes('paulista')) {
    if (lower.includes('1')) return examTopics['Provão Paulista 1º Ano'];
    if (lower.includes('2')) return examTopics['Provão Paulista 2º Ano'];
    if (lower.includes('3')) return examTopics['Provão Paulista 3º Ano'];
  }

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
  const { sendMessage } = useChat();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showJudge, setShowJudge] = useState(false);
  const [judgeConfig, setJudgeConfig] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizConfig, setQuizConfig] = useState(null);

  const handleClose = () => {
    onClose();
    setSelectedCategory(null);
    setSelectedExam(null);
    setSelectedSubject(null);
  };

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
      color: '#3b82f6', // Blue
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
      color: '#10b981', // Green
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
      color: '#f59e0b', // Amber
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
          subjects: ['1º Ano', '2º Ano', '3º Ano']
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
      color: '#8b5cf6', // Purple
      className: 'category-olympiads',
      exams: [
        { 
          name: 'OBMEP', 
          fullName: 'Matemática',
          subjects: ['Nível 1', 'Nível 2', 'Nível 3', 'Nível Júnior']
        },
        { 
          name: 'OBA', 
          fullName: 'Astronomia',
          subjects: ['Nível 1', 'Nível 2', 'Nível 3', 'Nível 4']
        },
        { 
          name: 'OBI', 
          fullName: 'Informática',
          subjects: ['Iniciação', 'Programação Júnior', 'Programação 1', 'Programação 2']
        },
        { 
          name: 'OBF', 
          fullName: 'Física',
          subjects: ['Nível 1', 'Nível 2', 'Nível 3']
        },
        { 
          name: 'OBQ', 
          fullName: 'Química',
          subjects: ['OBQjr', 'Fase I', 'Fase II', 'Fase III']
        },
        { 
          name: 'ONC', 
          fullName: 'Ciências',
          subjects: ['Nível A', 'Nível B', 'Nível C', 'Nível D', 'Nível E']
        }
      ]
    }
  ];

  
  const getSubjectConfig = (subjectName, examName) => {
    const lowerName = subjectName.toLowerCase();
    const eLower = examName ? examName.toLowerCase() : '';

    // Olympiads Icons
    if (eLower.includes('obmep')) {
      return { icon: 'calculate', className: 'subject-math' };
    }
    if (eLower.includes('oba')) {
      return { icon: 'rocket_launch', className: 'subject-physics' };
    }
    if (eLower.includes('obi')) {
      return { icon: 'terminal', className: 'subject-computer-science' };
    }
    if (eLower.includes('obf')) {
      return { icon: 'bolt', className: 'subject-physics' };
    }
    if (eLower.includes('obq')) {
      return { icon: 'science', className: 'subject-chemistry' };
    }
    if (eLower.includes('onc')) {
      return { icon: 'biotech', className: 'subject-biology' };
    }

    
    // Provão Paulista Icons
    if (eLower.includes('paulista')) {
      if (lowerName.includes('1')) return { icon: 'looks_one', className: 'subject-math' };
      if (lowerName.includes('2')) return { icon: 'looks_two', className: 'subject-physics' };
      if (lowerName.includes('3')) return { icon: 'looks_3', className: 'subject-chemistry' };
    }

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

  const handleExamClick = (exam) => {
    
    setSelectedExam(exam);
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('exams.title')}
    >
      <div className="exams-body">
          {!selectedCategory ? (
            <div className="exams-categories-grid">
              {categories.map((category) => (
                <button 
                  key={category.id}
                  className="exam-category-btn"
                  onClick={() => setSelectedCategory(category)}
                >
                  <span className="material-symbols-outlined" style={{ color: category.color, fontSize: '32px' }}>
                    {category.icon}
                  </span>
                  <span>{t(`exams.categories_title.${category.id}`)}</span>
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
                {t('exams.back')}
              </button>
              
              <div className="category-header-small">
                <span className="material-symbols-outlined" style={{ color: selectedCategory.color, fontSize: '28px' }}>
                  {selectedCategory.icon}
                </span>
                <h3>{t(`exams.categories_title.${selectedCategory.id}`)}</h3>
              </div>

              <div className="exams-list">
                {selectedCategory.exams.map((exam, index) => (
                  <button 
                    key={index} 
                    className="exam-item-modal"
                    onClick={() => handleExamClick(exam)}
                  >
                    <span className="material-symbols-outlined">school</span>
                    <div className="exam-info">
                      <span className="exam-name">{exam.name}</span>
                      <span className="exam-fullname">{exam.fullName}</span>
                    </div>
                    <span className="material-symbols-outlined arrow-icon">chevron_right</span>
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
                {t('exams.back')}
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
                    const { icon, className } = getSubjectConfig(subject, selectedExam?.name);
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
                {t('exams.back')}
              </button>

              <div className="exam-header-detail">
                <h3>{selectedSubject}</h3>
                <p>{t('exams.topics_header')}</p>
              </div>

              <div className="exam-ai-actions">
                <button 
                  className="ai-action-btn primary"
                  onClick={() => {
                    const topics = getTopicsForSubject(selectedSubject, selectedExam?.name);
                    const prompt = t('exams.prompts.plan', {
                      exam: selectedExam.name,
                      subject: selectedSubject,
                      topics: topics.map((top, i) => `${i + 1}. ${top}`).join('\n')
                    });
                    sendMessage(prompt);
                    onClose();
                  }}
                >
                  <span className="material-symbols-outlined">auto_awesome</span>
                  {t('exams.actions.ai_plan')}
                </button>
                
                <button 
                  className="ai-action-btn secondary"
                  onClick={() => {
                    const prompt = t('exams.prompts.strategy', {
                      exam: selectedExam.name,
                      subject: selectedSubject
                    });
                    sendMessage(prompt);
                    onClose();
                  }}
                >
                  <span className="material-symbols-outlined">psychology</span>
                  {t('exams.actions.ai_strategy')}
                </button>

                {selectedExam?.name === 'OBI' && (
                  <button 
                    className="ai-action-btn primary"
                    style={{ backgroundColor: 'var(--accent-color, #1a73e8)' }}
                    onClick={() => {
                      const topics = getTopicsForSubject(selectedSubject, selectedExam?.name);
                      setJudgeConfig({
                        subject: selectedSubject,
                        examName: selectedExam?.name,
                        topics: topics
                      });
                      setShowJudge(true);
                    }}
                  >
                    <span className="material-symbols-outlined">terminal</span>
                    {t('exams.actions.ai_judge')}
                  </button>
                )}
              </div>

              <div className="topics-list">
                {getTopicsForSubject(selectedSubject, selectedExam?.name).map((topic, index) => (
                  <div key={index} className="topic-item">
                    <span className="material-symbols-outlined topic-icon">check_circle</span>
                    <span className="topic-text">{topic}</span>
                    <div className="topic-actions">
                      <button 
                        className="topic-action-btn"
                        onClick={() => {
                          const prompt = t('exams.prompts.explain', {
                            exam: selectedExam.name,
                            subject: selectedSubject,
                            topic: topic
                          });
                          sendMessage(prompt);
                          onClose();
                        }}
                        title={t('exams.actions.explain_topic')}
                      >
                        <span className="material-symbols-outlined">school</span>
                      </button>
                      <button 
                        className="topic-action-btn"
                        onClick={() => {
                          setQuizConfig({
                            exam: selectedExam.name,
                            subject: selectedSubject,
                            topic: topic
                          });
                          setShowQuiz(true);
                        }}
                        title={t('exams.actions.generate_quiz')}
                      >
                        <span className="material-symbols-outlined">quiz</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      
      {showJudge && (
        <JudgeModal 
          isOpen={showJudge} 
          onClose={() => setShowJudge(false)} 
          config={judgeConfig} 
        />
      )}

      {showQuiz && (
        <QuizModal 
          isOpen={showQuiz} 
          onClose={() => setShowQuiz(false)} 
          config={quizConfig} 
        />
      )}
    </BaseModal>
  );
};

export default ExamsModal;
