import type { ExamCategory, SubjectVisualConfig } from './types';

export const examCategories: ExamCategory[] = [
  {
    id: 'international',
    title: 'Internacionais',
    icon: 'public',
    color: '#3b82f6',
    className: 'category-international',
    exams: [
      {
        name: 'SAT',
        fullName: 'Scholastic Assessment Test',
        subjects: ['Reading', 'Writing & Language', 'Math (No Calculator)', 'Math (Calculator)'],
      },
      {
        name: 'ACT',
        fullName: 'American College Testing',
        subjects: ['English', 'Math', 'Reading', 'Science', 'Writing (Optional)'],
      },
      {
        name: 'TOEFL',
        fullName: 'Test of English as a Foreign Language',
        subjects: ['Reading', 'Listening', 'Speaking', 'Writing'],
      },
      {
        name: 'IELTS',
        fullName: 'International English Language Testing System',
        subjects: ['Listening', 'Reading', 'Writing', 'Speaking'],
      },
      {
        name: 'IB',
        fullName: 'International Baccalaureate',
        subjects: ['Studies in Language and Literature', 'Language Acquisition', 'Individuals and Societies', 'Sciences', 'Mathematics', 'The Arts'],
      },
    ],
  },
  {
    id: 'national',
    title: 'Nacionais',
    icon: 'flag',
    color: '#10b981',
    className: 'category-national',
    exams: [
      {
        name: 'ENEM',
        fullName: 'Exame Nacional do Ensino Médio',
        subjects: ['Linguagens, Códigos e suas Tecnologias', 'Ciências Humanas e suas Tecnologias', 'Ciências da Natureza e suas Tecnologias', 'Matemática e suas Tecnologias', 'Redação'],
      },
      {
        name: 'SAEB',
        fullName: 'Sistema de Avaliação da Educação Básica',
        subjects: ['Língua Portuguesa', 'Matemática'],
      },
      {
        name: 'Encceja',
        fullName: 'Certificação de Competências',
        subjects: ['Ciências da Natureza', 'Matemática', 'Linguagens e Códigos', 'Ciências Humanas'],
      },
      {
        name: 'Calculadora ENEM',
        fullName: 'Simulador SiSU/ProUni',
        isCalculator: true,
        subjects: [],
      },
    ],
  },
  {
    id: 'regional',
    title: 'Regionais',
    icon: 'location_on',
    color: '#f59e0b',
    className: 'category-regional',
    exams: [
      {
        name: 'FUVEST',
        fullName: 'USP',
        subjects: ['Português', 'Matemática', 'História', 'Geografia', 'Física', 'Química', 'Biologia', 'Inglês', 'Interdisciplinares'],
      },
      {
        name: 'COMVEST',
        fullName: 'Unicamp',
        subjects: ['Português e Literaturas', 'Matemática', 'História', 'Geografia', 'Física', 'Química', 'Biologia', 'Inglês'],
      },
      {
        name: 'VUNESP',
        fullName: 'Unesp',
        subjects: ['Linguagens e Códigos', 'Ciências Humanas', 'Ciências da Natureza', 'Matemática'],
      },
      {
        name: 'Provão Paulista',
        fullName: 'Avaliação Seriada',
        subjects: ['1º Ano', '2º Ano', '3º Ano'],
      },
      {
        name: 'UERJ',
        fullName: 'Universidade do Estado do Rio de Janeiro',
        subjects: ['Linguagens', 'Matemática', 'Ciências da Natureza', 'Ciências Humanas', 'Redação'],
      },
      {
        name: 'UFRGS',
        fullName: 'Universidade Federal do Rio Grande do Sul',
        subjects: ['Física', 'Literatura', 'Língua Estrangeira', 'Português', 'Redação', 'Biologia', 'Química', 'Geografia', 'História', 'Matemática'],
      },
    ],
  },
  {
    id: 'olympiads',
    title: 'Olimpíadas',
    icon: 'emoji_events',
    color: '#8b5cf6',
    className: 'category-olympiads',
    exams: [
      { name: 'OBMEP', fullName: 'Matemática', subjects: ['Nível 1', 'Nível 2', 'Nível 3', 'Nível Júnior'] },
      { name: 'OBA', fullName: 'Astronomia', subjects: ['Nível 1', 'Nível 2', 'Nível 3', 'Nível 4'] },
      { name: 'OBI', fullName: 'Informática', subjects: ['Iniciação', 'Programação Júnior', 'Programação 1', 'Programação 2'] },
      { name: 'OBF', fullName: 'Física', subjects: ['Nível 1', 'Nível 2', 'Nível 3'] },
      { name: 'OBQ', fullName: 'Química', subjects: ['OBQjr', 'Fase I', 'Fase II', 'Fase III'] },
      { name: 'ONC', fullName: 'Ciências', subjects: ['Nível A', 'Nível B', 'Nível C', 'Nível D', 'Nível E'] },
    ],
  },
];

const examTopics: Record<string, string[]> = {
  'Provão Paulista 1º Ano': [
    'Matemática: Funções, Progressão Aritmética (PA) e Geométrica (PG), Geometria Plana',
    'Física: Cinemática, Leis de Newton, Energia e Trabalho',
    'Química: Estrutura Atômica, Tabela Periódica, Ligações Químicas, Funções Inorgânicas',
    'Biologia: Citologia, Bioquímica Celular, Histologia Biológica',
    'Português: Gêneros Textuais, Variação Linguística, Literatura (Trovadorismo ao Realismo)',
    'História: Antiguidade Clássica, Idade Média, Brasil Colônia',
    'Geografia: Cartografia, Geofísica e Relevo, Clima e Vegetação',
    'Filosofia/Sociologia: Introdução à Filosofia, Ética, Indivíduo e Sociedade',
    'Inglês/Espanhol: Compreensão de Texto, Vocabulário Básico e Estruturas Gramaticais',
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
    'Inglês/Espanhol: Leitura Crítica e Expressões Idiomáticas',
  ],
  'Provão Paulista 3º Ano': [
    'Matemática: Geometria Analítica, Números Complexos, Polinômios, Probabilidade e Estatística',
    'Física: Eletromagnetismo, Eletrodinâmica, Física Moderna (Introdução)',
    'Química: Química Orgânica, Eletroquímica, Reações Orgânicas',
    'Biologia: Genética, Evolução, Ecologia e Sustentabilidade',
    'Português e Redação: Dissertação-Argumentativa, Literatura Contemporânea',
    'História: Brasil República (Era Vargas até Contemporâneo), Guerras Mundiais e Guerra Fria',
    'Geografia: Globalização, Economia e Espaço Agrário, Meio Ambiente e Questões Climáticas',
    'Filosofia/Sociologia: Política Contemporânea, Pensamento Crítico e Atualidades',
  ],
  'OBMEP Nível 1': [
    'Aritmética Básica (Operações, Frações, Decimais)',
    'Geometria Plana (Áreas, Perímetros, Ângulos Intuitivos)',
    'Lógica e Raciocínio (Padrões, Sequências)',
    'Contagem Básica e Análise Combinatória Inicial',
  ],
  'OBMEP Nível 2': [
    'Álgebra (Equações do 1º Grau, Sistemas)',
    'Geometria Plana (Teorema de Pitágoras, Semelhança)',
    'Contagem e Princípio Multiplicativo',
    'Probabilidade Básica',
    'Aritmética (Mínimo Múltiplo Comum, Divisibilidade)',
  ],
  'OBMEP Nível 3': [
    'Álgebra Avançada (Funções, Equações do 2º Grau, Inequações)',
    'Geometria Plana Avançada (Círculos, Relações Métricas)',
    'Combinatória e Probabilidade Complexas',
    'Teoria dos Números (Congruências, Primos)',
    'Polinômios e Sequências',
  ],
  'OBMEP Nível Júnior': [
    'Operações Fundamentais (Soma, Subtração, Multiplicação, Divisão)',
    'Raciocínio Lógico Simples',
    'Identificação de Padrões',
    'Noções Espaciais Básicas',
  ],
  'OBA Nível 1': ['Dia e Noite', 'O Sol e a Lua', 'Fases da Lua', 'Estações do Ano', 'Os Planetas e o Sistema Solar Simplificado'],
  'OBA Nível 2': ['Sistema Solar (Ordem, Tamanhos)', 'Movimentos da Terra (Rotação, Translação)', 'Constelações Visíveis', 'História da Astronomia Inicial'],
  'OBA Nível 3': ['Gravitação Universal e Órbitas', 'Física do Sistema Solar', 'Evolução Estelar (Nascimento e Morte das Estrelas)', 'Astronáutica e Satélites Artificiais'],
  'OBA Nível 4': ['Leis de Kepler e Gravitação de Newton', 'Astrofísica (Luminosidade, Espectro, Temperatura)', 'Cosmologia (Big Bang, Expansão do Universo)', 'Buracos Negros e Galáxias', 'Mecânica Orbital e Propulsão Espacial'],
  'OBI Iniciação': ['Lógica de Programação Básica', 'Raciocínio Analítico e Problemas', 'Algoritmos Simples sem Código', 'Reconhecimento de Padrões'],
  'OBI Programação Júnior': ['Variáveis e Tipos de Dados', 'Estruturas Condicionais (If, Else)', 'Estruturas de Repetição (For, While)', 'Vetores e Strings Básicos'],
  'OBI Programação 1': ['Matrizes e Vetores Multidimensionais', 'Busca e Ordenação (Busca Binária, Bubble Sort)', 'Funções e Recursão', 'Estruturas de Dados Básicas'],
  'OBI Programação 2': ['Grafos (Busca em Profundidade/Largura)', 'Programação Dinâmica', 'Algoritmos Gulosos (Greedy)', 'Estruturas de Dados Avançadas (Árvores, Fila de Prioridade, Segment Tree)'],
  'OBF Nível 1': ['Conceitos Iniciais de Cinemática', 'Grandezas Físicas e Medidas', 'Calor e Temperatura', 'Princípios de Eletricidade Básica'],
  'OBF Nível 2': ['Mecânica Newtoniana Completa', 'Termologia e Calorimetria', 'Óptica Geométrica', 'Ondulatória e Fenômenos Ondulatórios', 'Eletrostática'],
  'OBF Nível 3': ['Eletromagnetismo (Circuitos, Magnetismo, Indução)', 'Mecânica dos Fluidos', 'Termodinâmica Completa', 'Física Moderna (Relatividade, Quântica)'],
  'OBQjr OBQjr': ['Estados Físicos da Matéria e Mudanças', 'Misturas e Substâncias (Separação de Misturas)', 'Estrutura Atômica Simplificada', 'Tabela Periódica Básica (Classificação)', 'Reações Químicas Simples e Cotidianas'],
  'OBQ Fase I': ['Modelos Atômicos e Estrutura Atômica', 'Propriedades Periódicas', 'Ligações Químicas', 'Funções Inorgânicas', 'Estequiometria Básica'],
  'OBQ Fase II': ['Físico-Química (Soluções, Cinética Química, Termoquímica)', 'Equilíbrio Químico', 'Química Orgânica (Nomenclatura, Funções Orgânicas)', 'Isomeria', 'Reações Inorgânicas Avançadas'],
  'OBQ Fase III': ['Eletroquímica (Pilhas, Eletrólise)', 'Química Orgânica Avançada (Reações Orgânicas, Polímeros)', 'Compostos de Coordenação', 'Bioquímica', 'Química Analítica Qualitativa', 'Espectroscopia (Noções Básicas)'],
  'ONC Nível A': ['Corpo Humano e Saúde Básica', 'A Terra e a Vida', 'Ecossistemas Brasileiros', 'Ciclo da Água e Recursos Naturais'],
  'ONC Nível B': ['Células (Estrutura e Funcionamento)', 'Ecologia e Sustentabilidade', 'Materiais e suas Transformações', 'Fenômenos Térmicos e Ópticos no Cotidiano'],
  'ONC Nível C': ['Fisiologia Humana Comparada', 'Evolução Biológica e Genética Básica', 'Química Ambiental', 'Cinemática e Dinâmica Básicas'],
  'ONC Nível D': ['Biologia Celular e Molecular', 'Química Geral (Estrutura Atômica, Ligações, Tabela Periódica)', 'Física Térmica e Óptica Geométrica', 'Astronomia e Ciências do Espaço'],
  'ONC Nível E': ['Física Moderna e Eletromagnetismo', 'Físico-Química e Química Orgânica', 'Ecologia de Populações e Dinâmica de Bio-Sistemas', 'Geologia e Ciência do Clima', 'Biotecnologia e Engenharia Genética'],
  Matemática: ['Aritmética Básica (Frações, Decimais, Porcentagem)', 'Funções (1º e 2º Grau, Exponencial, Logarítmica)', 'Geometria Plana (Áreas, Perímetros, Ângulos)', 'Geometria Espacial (Volumes, Prismas, Cilindros)', 'Estatística (Média, Moda, Mediana, Desvio Padrão)', 'Probabilidade e Análise Combinatória', 'Trigonometria (Triângulo Retângulo, Ciclo Trigonométrico)', 'Matemática Financeira (Juros Simples e Compostos)'],
  Linguagens: ['Interpretação de Texto e Gêneros Textuais', 'Variação Linguística e Funções da Linguagem', 'Movimentos Literários (Romantismo, Modernismo, etc.)', 'Gramática (Sintaxe, Morfologia, Semântica)', 'Artes e Vanguardas Europeias', 'Educação Física e Cultura Corporal', 'Tecnologias da Informação e Comunicação'],
  'Ciências Humanas': ['História do Brasil (Colônia, Império, República)', 'História Geral (Antiguidade, Idade Média, Moderna, Contemporânea)', 'Geografia Física (Clima, Relevo, Hidrografia)', 'Geografia Humana (População, Urbanização, Agricultura)', 'Geopolítica e Globalização', 'Filosofia (Antiga, Moderna, Contemporânea, Ética)', 'Sociologia (Cultura, Trabalho, Desigualdade, Instituições)'],
  'Ciências da Natureza': ['Física: Mecânica (Cinemática, Dinâmica, Energia)', 'Física: Eletricidade e Magnetismo', 'Física: Termologia e Óptica', 'Física: Ondulatória', 'Química: Geral e Inorgânica (Atomística, Ligações, Funções)', 'Química: Físico-Química (Soluções, Termoquímica, Cinética)', 'Química: Orgânica (Cadeias, Funções, Reações)', 'Biologia: Citologia e Metabolismo Energético', 'Biologia: Genética e Evolução', 'Biologia: Ecologia e Meio Ambiente', 'Biologia: Fisiologia Humana e Botânica'],
  Redação: ['Estrutura do Texto Dissertativo-Argumentativo', 'Competência 1: Norma Culta', 'Competência 2: Compreensão do Tema e Tipo Textual', 'Competência 3: Seleção e Organização de Argumentos', 'Competência 4: Coesão Textual', 'Competência 5: Proposta de Intervenção', 'Repertório Sociocultural', 'Análise de Temas Anteriores'],
  Física: ['Mecânica (Cinemática, Dinâmica, Estática, Hidrostática)', 'Termologia (Termometria, Calorimetria, Termodinâmica)', 'Óptica (Geométrica e Física)', 'Ondulatória (MHS, Ondas, Acústica)', 'Eletricidade (Eletrostática, Eletrodinâmica, Eletromagnetismo)', 'Física Moderna (Relatividade, Quântica, Nuclear)'],
  Química: ['Química Geral (Matéria, Átomo, Tabela Periódica, Ligações)', 'Química Inorgânica (Ácidos, Bases, Sais, Óxidos, Reações)', 'Físico-Química (Soluções, Termoquímica, Cinética, Equilíbrio, Eletroquímica)', 'Química Orgânica (Cadeias, Funções, Isomeria, Reações)', 'Química Ambiental e Bioquímica'],
  Biologia: ['Citologia (Célula, Membrana, Citoplasma, Núcleo)', 'Metabolismo Energético (Fotossíntese, Respiração, Fermentação)', 'Histologia e Fisiologia Humana/Animal', 'Genética e Biotecnologia', 'Evolução e Origem da Vida', 'Ecologia e Meio Ambiente', 'Botânica e Zoologia (Reinos)'],
  História: ['História Antiga (Grécia, Roma, Egito)', 'Idade Média (Feudalismo, Igreja, Islã)', 'Idade Moderna (Renascimento, Reformas, Absolutismo, Expansão Marítima)', 'Idade Contemporânea (Revoluções, Guerras Mundiais, Guerra Fria)', 'História do Brasil Colônia', 'História do Brasil Império', 'História do Brasil República'],
  Geografia: ['Geografia Física (Cartografia, Geologia, Clima, Vegetação)', 'Geografia Humana (Demografia, Urbanização, Migrações)', 'Geografia Econômica (Indústria, Agropecuária, Energia, Transportes)', 'Geopolítica Mundial e Conflitos', 'Geografia do Brasil (Regionalização, Economia, Sociedade)'],
  Inglês: ['Interpretação de Texto (Reading Comprehension)', 'Vocabulário Contextual (Synonyms, Antonyms)', 'Gramática Aplicada (Verb Tenses, Pronouns, Prepositions)', 'Falsos Cognatos', 'Expressões Idiomáticas'],
  Espanhol: ['Interpretação de Texto', 'Falsos Cognatos (Heterosemánticos)', 'Gramática Aplicada (Verbos, Pronombres, Artículos)', 'Vocabulário e Cultura Hispânica'],
  'SAT Reading & Writing': ['Craft and Structure (Words in Context, Text Structure)', 'Information and Ideas (Central Ideas, Evidence)', 'Standard English Conventions (Grammar, Punctuation)', 'Expression of Ideas (Transitions, Rhetorical Synthesis)'],
  'SAT Math': ['Heart of Algebra (Linear Equations, Systems)', 'Problem Solving and Data Analysis (Ratios, Percentages, Probability)', 'Passport to Advanced Math (Quadratics, Polynomials, Functions)', 'Additional Topics (Geometry, Trigonometry, Complex Numbers)'],
  'ACT English': ['Production of Writing (Topic Development, Organization)', 'Knowledge of Language (Style, Tone)', 'Conventions of Standard English (Sentence Structure, Punctuation)'],
  'ACT Math': ['Number & Quantity (Real/Complex Numbers)', 'Algebra & Functions', 'Geometry (Plane, Coordinate, Solid)', 'Statistics & Probability'],
  'ACT Reading': ['Key Ideas and Details', 'Craft and Structure', 'Integration of Knowledge and Ideas'],
  'ACT Science': ['Data Representation (Graphs, Tables)', 'Research Summaries (Experiments)', 'Conflicting Viewpoints (Hypotheses)'],
  'TOEFL Reading': ['Reading for Gist/Main Idea', 'Reading for Detail', 'Inference and Rhetorical Purpose', 'Vocabulary in Context'],
  'TOEFL Listening': ['Gist-Content and Gist-Purpose', 'Detail Questions', 'Function and Attitude', 'Connecting Content'],
  'TOEFL Speaking': ['Independent Speaking Task', 'Integrated Speaking Tasks (Read/Listen/Speak)'],
  'TOEFL Writing': ['Integrated Writing Task', 'Writing for an Academic Discussion'],
  'IELTS Listening': ['Social Context (Conversation/Monologue)', 'Educational/Training Context (Conversation/Monologue)'],
  'IELTS Reading': ['Gist, Main Ideas, and Details', 'Skimming and Scanning', 'Understanding Logical Argument'],
  'IELTS Writing': ['Task 1: Graph/Table/Chart Description', 'Task 2: Essay Writing'],
  'IELTS Speaking': ['Part 1: Introduction and Interview', 'Part 2: Long Turn (Cue Card)', 'Part 3: Discussion'],
  'IB Theory of Knowledge': ['Knowledge Questions', 'Areas of Knowledge (History, Human Sciences, Natural Sciences, Arts, Math)', 'Core Theme: Knowledge and the Knower', 'Optional Themes (Technology, Language, Politics, Religion, Indigenous Societies)'],
  'IB Extended Essay': ['Research Question Formulation', 'Methodology and Investigation', 'Critical Thinking and Analysis', 'Academic Writing and Referencing'],
  Português: ['Interpretação de Texto', 'Gramática Normativa', 'Morfologia e Sintaxe', 'Semântica e Estilística', 'Literatura Brasileira e Portuguesa', 'Movimentos Literários', 'Análise de Obras Obrigatórias'],
  Literatura: ['Teoria Literária', 'Escolas Literárias (Barroco, Arcadismo, etc.)', 'Literatura Contemporânea', 'Leitura de Obras Obrigatórias'],
};

export const getTopicsForSubject = (subjectName: string, examName?: string): string[] => {
  const lower = subjectName.toLowerCase();
  const examLower = examName ? examName.toLowerCase() : '';

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
  if (examLower.includes('paulista')) {
    if (lower.includes('1')) return examTopics['Provão Paulista 1º Ano'];
    if (lower.includes('2')) return examTopics['Provão Paulista 2º Ano'];
    if (lower.includes('3')) return examTopics['Provão Paulista 3º Ano'];
  }
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
    if (lower.includes('math')) return examTopics['SAT Math'];
    if (lower.includes('sciences')) return examTopics['Ciências da Natureza'];
    if (lower.includes('individuals') || lower.includes('societies')) return examTopics['Ciências Humanas'];
    if (lower.includes('literature') || lower.includes('language')) return examTopics.Linguagens;
    if (lower.includes('arts')) return examTopics.Linguagens;
  }

  if (lower === 'física' || lower === 'fisica') return examTopics.Física;
  if (lower === 'química' || lower === 'quimica') return examTopics.Química;
  if (lower === 'biologia') return examTopics.Biologia;
  if (lower === 'história' || lower === 'historia') return examTopics.História;
  if (lower === 'geografia') return examTopics.Geografia;
  if (lower === 'português' || lower === 'portugues') return examTopics.Português;
  if (lower === 'literatura') return examTopics.Literatura;
  if (lower.includes('matemática')) return examTopics.Matemática;
  if (lower.includes('linguagens') || lower.includes('português') || lower.includes('literatura')) return examTopics.Linguagens;
  if (lower.includes('humanas')) return examTopics['Ciências Humanas'];
  if (lower.includes('natureza')) return examTopics['Ciências da Natureza'];
  if (lower.includes('redação')) return examTopics.Redação;
  if (lower.includes('inglês') || lower.includes('english')) return examTopics.Inglês;
  if (lower.includes('espanhol')) return examTopics.Espanhol;

  return ['Conteúdo Programático Geral', 'Resolução de Questões', 'Revisão de Conceitos'];
};

export const getSubjectConfig = (subjectName: string, examName?: string): SubjectVisualConfig => {
  const lowerName = subjectName.toLowerCase();
  const eLower = examName ? examName.toLowerCase() : '';

  if (eLower.includes('obmep')) return { icon: 'calculate', className: 'subject-math' };
  if (eLower.includes('oba')) return { icon: 'rocket_launch', className: 'subject-physics' };
  if (eLower.includes('obi')) return { icon: 'terminal', className: 'subject-computer-science' };
  if (eLower.includes('obf')) return { icon: 'bolt', className: 'subject-physics' };
  if (eLower.includes('obq')) return { icon: 'science', className: 'subject-chemistry' };
  if (eLower.includes('onc')) return { icon: 'biotech', className: 'subject-biology' };
  if (eLower.includes('paulista')) {
    if (lowerName.includes('1')) return { icon: 'looks_one', className: 'subject-math' };
    if (lowerName.includes('2')) return { icon: 'looks_two', className: 'subject-physics' };
    if (lowerName.includes('3')) return { icon: 'looks_3', className: 'subject-chemistry' };
  }
  if (lowerName.includes('acquisition')) return { icon: 'translate', className: 'subject-languages' };
  if (lowerName.includes('literature')) return { icon: 'auto_stories', className: 'subject-literature' };
  if (lowerName.includes('individuals') || lowerName.includes('societies')) return { icon: 'groups', className: 'subject-humanities' };
  if (lowerName.includes('no calculator')) return { icon: 'stylus', className: 'subject-math-nocalc' };
  if (lowerName.includes('calculator')) return { icon: 'calculate', className: 'subject-math-calc' };
  if (lowerName.includes('matemática') || lowerName.includes('math') || lowerName.includes('raciocínio')) return { icon: 'calculate', className: 'subject-math' };
  if (lowerName.includes('física') || lowerName.includes('physics')) return { icon: 'bolt', className: 'subject-physics' };
  if (lowerName.includes('química') || lowerName.includes('chemistry')) return { icon: 'science', className: 'subject-chemistry' };
  if (lowerName.includes('biologia') || lowerName.includes('biology') || lowerName.includes('natureza') || lowerName.includes('science')) return { icon: 'biotech', className: 'subject-biology' };
  if (lowerName.includes('história') || lowerName.includes('history') || lowerName.includes('humanas') || lowerName.includes('societies')) return { icon: 'history_edu', className: 'subject-history' };
  if (lowerName.includes('geografia') || lowerName.includes('geography')) return { icon: 'public', className: 'subject-geography' };
  if (lowerName.includes('listening')) return { icon: 'hearing', className: 'subject-listening' };
  if (lowerName.includes('speaking')) return { icon: 'record_voice_over', className: 'subject-speaking' };
  if (lowerName.includes('reading')) return { icon: 'auto_stories', className: 'subject-reading' };
  if (lowerName.includes('writing') || lowerName.includes('redação') || lowerName.includes('essay')) return { icon: 'edit_note', className: 'subject-essay' };
  if (lowerName.includes('português') || lowerName.includes('linguagens') || lowerName.includes('english') || lowerName.includes('literature') || lowerName.includes('language')) return { icon: 'translate', className: 'subject-languages' };
  if (lowerName.includes('art') || lowerName.includes('artes')) return { icon: 'palette', className: 'subject-arts' };

  return { icon: 'menu_book', className: 'subject-default' };
};
