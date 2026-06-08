import type { ExamCategory, SubjectVisualConfig } from './types'

export const examCategories: ExamCategory[] = [
  {
    id: 'undergraduate_admissions',
    title: 'Undergraduate Admissions',
    icon: 'public',
    color: '#3b82f6',
    className: 'category-undergraduate-admissions',
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
        name: 'AP Exams',
        fullName: 'Advanced Placement',
        subjects: [
          'Calculus AB',
          'Calculus BC',
          'Statistics',
          'Physics 1',
          'Physics 2',
          'Physics C',
          'Chemistry',
          'Biology',
          'English Language',
          'English Literature',
          'World History',
          'US History',
          'Psychology',
          'Computer Science A',
        ],
      },
      {
        name: 'JEE Main',
        fullName: 'Joint Entrance Examination Main',
        subjects: ['Physics', 'Chemistry', 'Mathematics'],
      },
      {
        name: 'UCAT',
        fullName: 'University Clinical Aptitude Test',
        subjects: [
          'Verbal Reasoning',
          'Decision Making',
          'Quantitative Reasoning',
          'Abstract Reasoning',
          'Situational Judgement',
        ],
      },
      {
        name: 'BMAT',
        fullName: 'BioMedical Admissions Test',
        subjects: ['Thinking Skills', 'Scientific Knowledge and Applications', 'Writing Task'],
      },
      {
        name: 'LNAT',
        fullName: 'Law National Aptitude Test',
        subjects: ['Reading Comprehension', 'Argument Analysis', 'Essay Writing'],
      },
    ],
  },
  {
    id: 'language_proficiency',
    title: 'Language Proficiency',
    icon: 'translate',
    color: '#14b8a6',
    className: 'category-language-proficiency',
    exams: [
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
        name: 'Cambridge English',
        fullName: 'Cambridge English Qualifications',
        subjects: [
          'Key (KET)',
          'Preliminary (PET)',
          'First (FCE)',
          'Advanced (CAE)',
          'Proficiency (CPE)',
        ],
      },
      {
        name: 'DELF/DALF',
        fullName: "Diplôme d'Études en Langue Française",
        subjects: ['DELF A1', 'DELF A2', 'DELF B1', 'DELF B2', 'DALF C1', 'DALF C2'],
      },
      {
        name: 'TestDaF',
        fullName: 'Test Deutsch als Fremdsprache',
        subjects: ['Reading', 'Listening', 'Writing', 'Speaking'],
      },
      {
        name: 'HSK',
        fullName: 'Hanyu Shuiping Kaoshi (Chinese Proficiency Test)',
        subjects: ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'],
      },
      {
        name: 'JLPT',
        fullName: 'Japanese Language Proficiency Test',
        subjects: ['N5', 'N4', 'N3', 'N2', 'N1'],
      },
      {
        name: 'DELE',
        fullName: 'Diplomas de Español como Lengua Extranjera',
        subjects: ['DELE A1', 'DELE A2', 'DELE B1', 'DELE B2', 'DELE C1', 'DELE C2'],
      },
    ],
  },
  {
    id: 'international_curricula',
    title: 'International Curricula',
    icon: 'school',
    color: '#8b5cf6',
    className: 'category-international-curricula',
    exams: [
      {
        name: 'IB',
        fullName: 'International Baccalaureate',
        subjects: [
          'Studies in Language and Literature',
          'Language Acquisition',
          'Individuals and Societies',
          'Sciences',
          'Mathematics',
          'The Arts',
          'Theory of Knowledge',
          'Extended Essay',
        ],
      },
      {
        name: 'A-Levels',
        fullName: 'General Certificate of Education Advanced Level (UK)',
        subjects: [
          'Mathematics',
          'Further Mathematics',
          'Physics',
          'Chemistry',
          'Biology',
          'English Literature',
          'English Language',
          'History',
          'Geography',
          'Economics',
          'Psychology',
          'Sociology',
          'Computer Science',
          'French',
          'German',
          'Spanish',
        ],
      },
      {
        name: 'Abitur',
        fullName: 'Abitur (Germany)',
        subjects: [
          'Mathematics',
          'German',
          'English',
          'French',
          'Latin',
          'Ancient Greek',
          'History',
          'Geography',
          'Politics/Social Studies',
          'Philosophy',
          'Ethics',
          'Religion',
          'Physics',
          'Chemistry',
          'Biology',
          'Computer Science',
          'Music',
          'Art',
          'Sports',
        ],
      },
      {
        name: 'Baccalauréat',
        fullName: 'Baccalauréat (France)',
        subjects: [
          'French Literature',
          'Philosophy',
          'History-Geography',
          'Modern Languages',
          'Ancient Languages',
          'Mathematics',
          'Physics-Chemistry',
          'Life and Earth Sciences',
          'Engineering Sciences',
          'Economics and Social Sciences',
          'Arts',
          'Music',
          'Physical Education',
        ],
      },
      {
        name: 'Maturità',
        fullName: 'Esame di Stato (Italy)',
        subjects: [
          'Italian',
          'History',
          'Philosophy',
          'English',
          'French',
          'German',
          'Spanish',
          'Latin',
          'Greek',
          'Mathematics',
          'Physics',
          'Chemistry',
          'Biology',
          'Geography',
          'History of Art',
          'Physical Education',
          'Computer Science',
        ],
      },
      {
        name: 'ENEM',
        fullName: 'Exame Nacional do Ensino Médio',
        subjects: ['Languages and Writing', 'Human Sciences', 'Natural Sciences', 'Mathematics'],
      },
      {
        name: 'Gaokao',
        fullName: 'National College Entrance Examination (China)',
        subjects: [
          'Chinese',
          'Mathematics',
          'Foreign Language',
          'Physics',
          'Chemistry',
          'Biology',
          'History',
          'Geography',
          'Politics',
        ],
      },
    ],
  },
  {
    id: 'graduate_professional',
    title: 'Graduate & Professional',
    icon: 'workspace_premium',
    color: '#f59e0b',
    className: 'category-graduate-professional',
    exams: [
      {
        name: 'GRE',
        fullName: 'Graduate Record Examination',
        subjects: ['Verbal Reasoning', 'Quantitative Reasoning', 'Analytical Writing'],
      },
      {
        name: 'GMAT',
        fullName: 'Graduate Management Admission Test',
        subjects: [
          'Quantitative Reasoning',
          'Verbal Reasoning',
          'Integrated Reasoning',
          'Analytical Writing',
        ],
      },
      {
        name: 'LSAT',
        fullName: 'Law School Admission Test',
        subjects: [
          'Logical Reasoning',
          'Analytical Reasoning',
          'Reading Comprehension',
          'Writing Sample',
        ],
      },
      {
        name: 'MCAT',
        fullName: 'Medical College Admission Test',
        subjects: [
          'Chemical and Physical Foundations',
          'Critical Analysis and Reasoning',
          'Biological and Biochemical Foundations',
          'Psychological and Social Foundations',
        ],
      },
      {
        name: 'DAT',
        fullName: 'Dental Admission Test',
        subjects: [
          'Survey of Natural Sciences',
          'Perceptual Ability',
          'Reading Comprehension',
          'Quantitative Reasoning',
        ],
      },
      {
        name: 'OAT',
        fullName: 'Optometry Admission Test',
        subjects: [
          'Biology',
          'General Chemistry',
          'Organic Chemistry',
          'Physics',
          'Reading Comprehension',
          'Quantitative Reasoning',
        ],
      },
    ],
  },
  {
    id: 'exam_score_calculators',
    title: 'Exam Score Calculators',
    icon: 'calculate',
    color: '#8b5cf6',
    className: 'category-exam-score-calculators',
    exams: [
      {
        name: 'SAT Score Calculator',
        fullName: 'SAT total score calculator',
        isCalculator: true,
        calculatorType: 'sat',
        subjects: [],
      },
      {
        name: 'ACT Composite Calculator',
        fullName: 'ACT composite score calculator',
        isCalculator: true,
        calculatorType: 'act',
        subjects: [],
      },
      {
        name: 'ENEM Score Calculator',
        fullName: 'Brazilian ENEM / SiSU score simulator with TRI calculation',
        isCalculator: true,
        calculatorType: 'enem',
        subjects: [],
      },
      {
        name: 'JEE Main Raw Score Calculator',
        fullName: 'JEE Main raw score calculator with percentile estimation',
        isCalculator: true,
        calculatorType: 'jee_main',
        subjects: [],
      },
      {
        name: 'IB Diploma Points Calculator',
        fullName: 'International Baccalaureate diploma points calculator',
        isCalculator: true,
        calculatorType: 'ib',
        subjects: [],
      },
      {
        name: 'A-Levels UCAS Calculator',
        fullName: 'A-Level grades to UCAS Tariff points calculator',
        isCalculator: true,
        calculatorType: 'alevels',
        subjects: [],
      },
      {
        name: 'GMAT Score Estimator',
        fullName: 'GMAT total score estimator from section scores',
        isCalculator: true,
        calculatorType: 'gmat',
        subjects: [],
      },
      {
        name: 'GRE Score Converter',
        fullName: 'GRE score converter and percentile tracker',
        isCalculator: true,
        calculatorType: 'gre',
        subjects: [],
      },
      {
        name: 'TOEFL Score Calculator',
        fullName: 'TOEFL iBT total score calculator with section scaling',
        isCalculator: true,
        calculatorType: 'toefl',
        subjects: [],
      },
      {
        name: 'IELTS Band Calculator',
        fullName: 'IELTS band score calculator and overall band predictor',
        isCalculator: true,
        calculatorType: 'ielts',
        subjects: [],
      },
      {
        name: 'Abitur GPA Calculator',
        fullName: 'German Abitur GPA calculator with grade conversion',
        isCalculator: true,
        calculatorType: 'abitur',
        subjects: [],
      },
      {
        name: 'Gaokao Score Converter',
        fullName: 'Chinese Gaokao score converter and percentile calculator',
        isCalculator: true,
        calculatorType: 'gaokao',
        subjects: [],
      },
    ],
  },
  {
    id: 'olympiads',
    title: 'International Olympiads',
    icon: 'emoji_events',
    color: '#dc2626',
    className: 'category-olympiads',
    exams: [
      {
        name: 'IOI',
        fullName: 'International Olympiad in Informatics',
        subjects: [
          'Algorithms (Graphs, Trees, Flows)',
          'Data Structures (Segment Trees, Fenwick Trees, Tries)',
          'Dynamic Programming',
          'Graph Theory',
          'Computational Geometry',
          'Number Theory',
          'Competitive Programming Strategy',
        ],
      },
      {
        name: 'IMO',
        fullName: 'International Mathematical Olympiad',
        subjects: [
          'Algebra',
          'Combinatorics',
          'Geometry',
          'Number Theory',
          'Inequalities',
          'Functional Equations',
          'Proof Strategy',
        ],
      },
      {
        name: 'IPhO',
        fullName: 'International Physics Olympiad',
        subjects: [
          'Mechanics',
          'Electromagnetism',
          'Thermodynamics',
          'Optics',
          'Modern Physics',
          'Experimental Physics',
          'Integrated Problem Solving',
        ],
      },
      {
        name: 'IChO',
        fullName: 'International Chemistry Olympiad',
        subjects: [
          'Organic Chemistry',
          'Inorganic Chemistry',
          'Physical Chemistry',
          'Analytical Chemistry',
          'Experimental Chemistry',
          'Biochemistry',
          'Integrated Problem Solving',
        ],
      },
      {
        name: 'IBO',
        fullName: 'International Biology Olympiad',
        subjects: [
          'Cell Biology',
          'Genetics and Molecular Biology',
          'Human Physiology',
          'Ecology',
          'Evolution',
          'Microbiology',
          'Experimental Biology',
        ],
      },
      {
        name: 'IAAO',
        fullName: 'International Astronomy Olympiad',
        subjects: [
          'Astrophysics',
          'Celestial Mechanics',
          'Observational Astronomy',
          'Solar and Planetary Physics',
          'Astrochemistry',
          'Astronomical Data Analysis',
          'Integrated Problem Solving',
        ],
      },
      {
        name: 'OBMEP',
        fullName: 'Brazilian Mathematics Olympiad for Public Schools',
        subjects: ['OBMEP Nível 1', 'OBMEP Nível 2', 'OBMEP Nível 3', 'OBMEP Nível Júnior'],
      },
      {
        name: 'OBI',
        fullName: 'Brazilian Informatics Olympiad',
        subjects: [
          'OBI Iniciação',
          'OBI Programação Júnior',
          'OBI Programação 1',
          'OBI Programação 2',
        ],
      },
    ],
  },
]

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
  'OBA Nível 1': [
    'Dia e Noite',
    'O Sol e a Lua',
    'Fases da Lua',
    'Estações do Ano',
    'Os Planetas e o Sistema Solar Simplificado',
  ],
  'OBA Nível 2': [
    'Sistema Solar (Ordem, Tamanhos)',
    'Movimentos da Terra (Rotação, Translação)',
    'Constelações Visíveis',
    'História da Astronomia Inicial',
  ],
  'OBA Nível 3': [
    'Gravitação Universal e Órbitas',
    'Física do Sistema Solar',
    'Evolução Estelar (Nascimento e Morte das Estrelas)',
    'Astronáutica e Satélites Artificiais',
  ],
  'OBA Nível 4': [
    'Leis de Kepler e Gravitação de Newton',
    'Astrofísica (Luminosidade, Espectro, Temperatura)',
    'Cosmologia (Big Bang, Expansão do Universo)',
    'Buracos Negros e Galáxias',
    'Mecânica Orbital e Propulsão Espacial',
  ],
  'OBI Iniciação': [
    'Lógica de Programação Básica',
    'Raciocínio Analítico e Problemas',
    'Algoritmos Simples sem Código',
    'Reconhecimento de Padrões',
  ],
  'OBI Programação Júnior': [
    'Variáveis e Tipos de Dados',
    'Estruturas Condicionais (If, Else)',
    'Estruturas de Repetição (For, While)',
    'Vetores e Strings Básicos',
  ],
  'OBI Programação 1': [
    'Matrizes e Vetores Multidimensionais',
    'Busca e Ordenação (Busca Binária, Bubble Sort)',
    'Funções e Recursão',
    'Estruturas de Dados Básicas',
  ],
  'OBI Programação 2': [
    'Grafos (Busca em Profundidade/Largura)',
    'Programação Dinâmica',
    'Algoritmos Gulosos (Greedy)',
    'Estruturas de Dados Avançadas (Árvores, Fila de Prioridade, Segment Tree)',
  ],
  'OBF Nível 1': [
    'Conceitos Iniciais de Cinemática',
    'Grandezas Físicas e Medidas',
    'Calor e Temperatura',
    'Princípios de Eletricidade Básica',
  ],
  'OBF Nível 2': [
    'Mecânica Newtoniana Completa',
    'Termologia e Calorimetria',
    'Óptica Geométrica',
    'Ondulatória e Fenômenos Ondulatórios',
    'Eletrostática',
  ],
  'OBF Nível 3': [
    'Eletromagnetismo (Circuitos, Magnetismo, Indução)',
    'Mecânica dos Fluidos',
    'Termodinâmica Completa',
    'Física Moderna (Relatividade, Quântica)',
  ],
  'OBQjr OBQjr': [
    'Estados Físicos da Matéria e Mudanças',
    'Misturas e Substâncias (Separação de Misturas)',
    'Estrutura Atômica Simplificada',
    'Tabela Periódica Básica (Classificação)',
    'Reações Químicas Simples e Cotidianas',
  ],
  'OBQ Fase I': [
    'Modelos Atômicos e Estrutura Atômica',
    'Propriedades Periódicas',
    'Ligações Químicas',
    'Funções Inorgânicas',
    'Estequiometria Básica',
  ],
  'OBQ Fase II': [
    'Físico-Química (Soluções, Cinética Química, Termoquímica)',
    'Equilíbrio Químico',
    'Química Orgânica (Nomenclatura, Funções Orgânicas)',
    'Isomeria',
    'Reações Inorgânicas Avançadas',
  ],
  'OBQ Fase III': [
    'Eletroquímica (Pilhas, Eletrólise)',
    'Química Orgânica Avançada (Reações Orgânicas, Polímeros)',
    'Compostos de Coordenação',
    'Bioquímica',
    'Química Analítica Qualitativa',
    'Espectroscopia (Noções Básicas)',
  ],
  'ONC Nível A': [
    'Corpo Humano e Saúde Básica',
    'A Terra e a Vida',
    'Ecossistemas Brasileiros',
    'Ciclo da Água e Recursos Naturais',
  ],
  'ONC Nível B': [
    'Células (Estrutura e Funcionamento)',
    'Ecologia e Sustentabilidade',
    'Materiais e suas Transformações',
    'Fenômenos Térmicos e Ópticos no Cotidiano',
  ],
  'ONC Nível C': [
    'Fisiologia Humana Comparada',
    'Evolução Biológica e Genética Básica',
    'Química Ambiental',
    'Cinemática e Dinâmica Básicas',
  ],
  'ONC Nível D': [
    'Biologia Celular e Molecular',
    'Química Geral (Estrutura Atômica, Ligações, Tabela Periódica)',
    'Física Térmica e Óptica Geométrica',
    'Astronomia e Ciências do Espaço',
  ],
  'ONC Nível E': [
    'Física Moderna e Eletromagnetismo',
    'Físico-Química e Química Orgânica',
    'Ecologia de Populações e Dinâmica de Bio-Sistemas',
    'Geologia e Ciência do Clima',
    'Biotecnologia e Engenharia Genética',
  ],
  Matemática: [
    'Aritmética Básica (Frações, Decimais, Porcentagem)',
    'Funções (1º e 2º Grau, Exponencial, Logarítmica)',
    'Geometria Plana (Áreas, Perímetros, Ângulos)',
    'Geometria Espacial (Volumes, Prismas, Cilindros)',
    'Estatística (Média, Moda, Mediana, Desvio Padrão)',
    'Probabilidade e Análise Combinatória',
    'Trigonometria (Triângulo Retângulo, Ciclo Trigonométrico)',
    'Matemática Financeira (Juros Simples e Compostos)',
  ],
  Linguagens: [
    'Interpretação de Texto e Gêneros Textuais',
    'Variação Linguística e Funções da Linguagem',
    'Movimentos Literários (Romantismo, Modernismo, etc.)',
    'Gramática (Sintaxe, Morfologia, Semântica)',
    'Artes e Vanguardas Europeias',
    'Educação Física e Cultura Corporal',
    'Tecnologias da Informação e Comunicação',
  ],
  'Ciências Humanas': [
    'História do Brasil (Colônia, Império, República)',
    'História Geral (Antiguidade, Idade Média, Moderna, Contemporânea)',
    'Geografia Física (Clima, Relevo, Hidrografia)',
    'Geografia Humana (População, Urbanização, Agricultura)',
    'Geopolítica e Globalização',
    'Filosofia (Antiga, Moderna, Contemporânea, Ética)',
    'Sociologia (Cultura, Trabalho, Desigualdade, Instituições)',
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
    'Biologia: Fisiologia Humana e Botânica',
  ],
  Redação: [
    'Estrutura do Texto Dissertativo-Argumentativo',
    'Competência 1: Norma Culta',
    'Competência 2: Compreensão do Tema e Tipo Textual',
    'Competência 3: Seleção e Organização de Argumentos',
    'Competência 4: Coesão Textual',
    'Competência 5: Proposta de Intervenção',
    'Repertório Sociocultural',
    'Análise de Temas Anteriores',
  ],
  Física: [
    'Mecânica (Cinemática, Dinâmica, Estática, Hidrostática)',
    'Termologia (Termometria, Calorimetria, Termodinâmica)',
    'Óptica (Geométrica e Física)',
    'Ondulatória (MHS, Ondas, Acústica)',
    'Eletricidade (Eletrostática, Eletrodinâmica, Eletromagnetismo)',
    'Física Moderna (Relatividade, Quântica, Nuclear)',
  ],
  Química: [
    'Química Geral (Matéria, Átomo, Tabela Periódica, Ligações)',
    'Química Inorgânica (Ácidos, Bases, Sais, Óxidos, Reações)',
    'Físico-Química (Soluções, Termoquímica, Cinética, Equilíbrio, Eletroquímica)',
    'Química Orgânica (Cadeias, Funções, Isomeria, Reações)',
    'Química Ambiental e Bioquímica',
  ],
  Biologia: [
    'Citologia (Célula, Membrana, Citoplasma, Núcleo)',
    'Metabolismo Energético (Fotossíntese, Respiração, Fermentação)',
    'Histologia e Fisiologia Humana/Animal',
    'Genética e Biotecnologia',
    'Evolução e Origem da Vida',
    'Ecologia e Meio Ambiente',
    'Botânica e Zoologia (Reinos)',
  ],
  História: [
    'História Antiga (Grécia, Roma, Egito)',
    'Idade Média (Feudalismo, Igreja, Islã)',
    'Idade Moderna (Renascimento, Reformas, Absolutismo, Expansão Marítima)',
    'Idade Contemporânea (Revoluções, Guerras Mundiais, Guerra Fria)',
    'História do Brasil Colônia',
    'História do Brasil Império',
    'História do Brasil República',
  ],
  Geografia: [
    'Geografia Física (Cartografia, Geologia, Clima, Vegetação)',
    'Geografia Humana (Demografia, Urbanização, Migrações)',
    'Geografia Econômica (Indústria, Agropecuária, Energia, Transportes)',
    'Geopolítica Mundial e Conflitos',
    'Geografia do Brasil (Regionalização, Economia, Sociedade)',
  ],
  Inglês: [
    'Interpretação de Texto (Reading Comprehension)',
    'Vocabulário Contextual (Synonyms, Antonyms)',
    'Gramática Aplicada (Verb Tenses, Pronouns, Prepositions)',
    'Falsos Cognatos',
    'Expressões Idiomáticas',
  ],
  Espanhol: [
    'Interpretação de Texto',
    'Falsos Cognatos (Heterosemánticos)',
    'Gramática Aplicada (Verbos, Pronombres, Artículos)',
    'Vocabulário e Cultura Hispânica',
  ],
  'SAT Reading & Writing': [
    'Craft and Structure (Words in Context, Text Structure)',
    'Information and Ideas (Central Ideas, Evidence)',
    'Standard English Conventions (Grammar, Punctuation)',
    'Expression of Ideas (Transitions, Rhetorical Synthesis)',
  ],
  'SAT Math': [
    'Heart of Algebra (Linear Equations, Systems)',
    'Problem Solving and Data Analysis (Ratios, Percentages, Probability)',
    'Passport to Advanced Math (Quadratics, Polynomials, Functions)',
    'Additional Topics (Geometry, Trigonometry, Complex Numbers)',
  ],
  'ACT English': [
    'Production of Writing (Topic Development, Organization)',
    'Knowledge of Language (Style, Tone)',
    'Conventions of Standard English (Sentence Structure, Punctuation)',
  ],
  'ACT Math': [
    'Number & Quantity (Real/Complex Numbers)',
    'Algebra & Functions',
    'Geometry (Plane, Coordinate, Solid)',
    'Statistics & Probability',
  ],
  'ACT Reading': [
    'Key Ideas and Details',
    'Craft and Structure',
    'Integration of Knowledge and Ideas',
  ],
  'ACT Science': [
    'Data Representation (Graphs, Tables)',
    'Research Summaries (Experiments)',
    'Conflicting Viewpoints (Hypotheses)',
  ],
  'TOEFL Reading': [
    'Reading for Gist/Main Idea',
    'Reading for Detail',
    'Inference and Rhetorical Purpose',
    'Vocabulary in Context',
  ],
  'TOEFL Listening': [
    'Gist-Content and Gist-Purpose',
    'Detail Questions',
    'Function and Attitude',
    'Connecting Content',
  ],
  'TOEFL Speaking': ['Independent Speaking Task', 'Integrated Speaking Tasks (Read/Listen/Speak)'],
  'TOEFL Writing': ['Integrated Writing Task', 'Writing for an Academic Discussion'],
  'IELTS Listening': [
    'Social Context (Conversation/Monologue)',
    'Educational/Training Context (Conversation/Monologue)',
  ],
  'IELTS Reading': [
    'Gist, Main Ideas, and Details',
    'Skimming and Scanning',
    'Understanding Logical Argument',
  ],
  'IELTS Writing': ['Task 1: Graph/Table/Chart Description', 'Task 2: Essay Writing'],
  'IELTS Speaking': [
    'Part 1: Introduction and Interview',
    'Part 2: Long Turn (Cue Card)',
    'Part 3: Discussion',
  ],
  'IB Theory of Knowledge': [
    'Knowledge Questions',
    'Areas of Knowledge (History, Human Sciences, Natural Sciences, Arts, Math)',
    'Core Theme: Knowledge and the Knower',
    'Optional Themes (Technology, Language, Politics, Religion, Indigenous Societies)',
  ],
  'IB Extended Essay': [
    'Research Question Formulation',
    'Methodology and Investigation',
    'Critical Thinking and Analysis',
    'Academic Writing and Referencing',
  ],
  Português: [
    'Interpretação de Texto',
    'Gramática Normativa',
    'Morfologia e Sintaxe',
    'Semântica e Estilística',
    'Literatura Brasileira e Portuguesa',
    'Movimentos Literários',
    'Análise de Obras Obrigatórias',
  ],
  Literatura: [
    'Teoria Literária',
    'Escolas Literárias (Barroco, Arcadismo, etc.)',
    'Literatura Contemporânea',
    'Leitura de Obras Obrigatórias',
  ],
}

export const getTopicsForSubject = (subjectName: string, examName?: string): string[] => {
  const lower = subjectName.toLowerCase()
  const examLower = examName ? examName.toLowerCase() : ''

  if (examLower.includes('obmep')) {
    if (lower.includes('1')) return examTopics['OBMEP Nível 1']
    if (lower.includes('2')) return examTopics['OBMEP Nível 2']
    if (lower.includes('3')) return examTopics['OBMEP Nível 3']
    if (lower.includes('júnior') || lower.includes('junior'))
      return examTopics['OBMEP Nível Júnior']
  }
  if (examLower.includes('oba')) {
    if (lower.includes('1')) return examTopics['OBA Nível 1']
    if (lower.includes('2')) return examTopics['OBA Nível 2']
    if (lower.includes('3')) return examTopics['OBA Nível 3']
    if (lower.includes('4')) return examTopics['OBA Nível 4']
  }
  if (examLower.includes('obi')) {
    if (lower.includes('iniciação') || lower.includes('iniciacao'))
      return examTopics['OBI Iniciação']
    if (lower.includes('júnior') || lower.includes('junior'))
      return examTopics['OBI Programação Júnior']
    if (lower.includes('1')) return examTopics['OBI Programação 1']
    if (lower.includes('2')) return examTopics['OBI Programação 2']
  }
  if (examLower.includes('obf')) {
    if (lower.includes('1')) return examTopics['OBF Nível 1']
    if (lower.includes('2')) return examTopics['OBF Nível 2']
    if (lower.includes('3')) return examTopics['OBF Nível 3']
  }
  if (examLower.includes('obq')) {
    if (lower.includes('obqjr') || lower.includes('jr'))
      return examTopics['OBQjr OBQjr'] || examTopics['OBQ Fase I']
    if (lower.includes('i') && !lower.includes('ii') && !lower.includes('iii'))
      return examTopics['OBQ Fase I']
    if (lower.includes('ii') && !lower.includes('iii')) return examTopics['OBQ Fase II']
    if (lower.includes('iii')) return examTopics['OBQ Fase III']
  }
  if (examLower.includes('onc')) {
    if (lower.includes('a')) return examTopics['ONC Nível A']
    if (lower.includes('b')) return examTopics['ONC Nível B']
    if (lower.includes('c')) return examTopics['ONC Nível C']
    if (lower.includes('d')) return examTopics['ONC Nível D']
    if (lower.includes('e')) return examTopics['ONC Nível E']
  }
  if (examLower.includes('paulista')) {
    if (lower.includes('1')) return examTopics['Provão Paulista 1º Ano']
    if (lower.includes('2')) return examTopics['Provão Paulista 2º Ano']
    if (lower.includes('3')) return examTopics['Provão Paulista 3º Ano']
  }
  if (examLower.includes('sat')) {
    if (lower.includes('math')) return examTopics['SAT Math']
    if (lower.includes('reading') || lower.includes('writing'))
      return examTopics['SAT Reading & Writing']
  }
  if (examLower.includes('act')) {
    if (lower.includes('math')) return examTopics['ACT Math']
    if (lower.includes('english') || lower.includes('writing')) return examTopics['ACT English']
    if (lower.includes('reading')) return examTopics['ACT Reading']
    if (lower.includes('science')) return examTopics['ACT Science']
  }
  if (examLower.includes('toefl')) {
    if (lower.includes('reading')) return examTopics['TOEFL Reading']
    if (lower.includes('listening')) return examTopics['TOEFL Listening']
    if (lower.includes('speaking')) return examTopics['TOEFL Speaking']
    if (lower.includes('writing')) return examTopics['TOEFL Writing']
  }
  if (examLower.includes('ielts')) {
    if (lower.includes('reading')) return examTopics['IELTS Reading']
    if (lower.includes('listening')) return examTopics['IELTS Listening']
    if (lower.includes('speaking')) return examTopics['IELTS Speaking']
    if (lower.includes('writing')) return examTopics['IELTS Writing']
  }
  if (examLower.includes('ib') || examLower.includes('baccalaureate')) {
    if (lower.includes('theory of knowledge')) return examTopics['IB Theory of Knowledge']
    if (lower.includes('extended essay')) return examTopics['IB Extended Essay']
    if (lower.includes('math')) return examTopics['SAT Math']
    if (lower.includes('sciences')) return examTopics['Ciências da Natureza']
    if (lower.includes('individuals') || lower.includes('societies'))
      return examTopics['Ciências Humanas']
    if (lower.includes('literature') || lower.includes('language')) return examTopics.Linguagens
    if (lower.includes('arts')) return examTopics.Linguagens
  }

  if (lower === 'física' || lower === 'fisica') return examTopics.Física
  if (lower === 'química' || lower === 'quimica') return examTopics.Química
  if (lower === 'biologia') return examTopics.Biologia
  if (lower === 'história' || lower === 'historia') return examTopics.História
  if (lower === 'geografia') return examTopics.Geografia
  if (lower === 'português' || lower === 'portugues') return examTopics.Português
  if (lower === 'literatura') return examTopics.Literatura
  if (lower.includes('matemática')) return examTopics.Matemática
  if (lower.includes('linguagens') || lower.includes('português') || lower.includes('literatura'))
    return examTopics.Linguagens
  if (lower.includes('humanas')) return examTopics['Ciências Humanas']
  if (lower.includes('natureza')) return examTopics['Ciências da Natureza']
  if (lower.includes('redação')) return examTopics.Redação
  if (lower.includes('inglês') || lower.includes('english')) return examTopics.Inglês
  if (lower.includes('espanhol')) return examTopics.Espanhol

  return ['Conteúdo Programático Geral', 'Resolução de Questões', 'Revisão de Conceitos']
}

export const getSubjectConfig = (subjectName: string, examName?: string): SubjectVisualConfig => {
  const lowerName = subjectName.toLowerCase()
  const eLower = examName ? examName.toLowerCase() : ''

  if (eLower.includes('obmep')) return { icon: 'calculate', className: 'subject-math' }
  if (eLower.includes('oba')) return { icon: 'rocket_launch', className: 'subject-physics' }
  if (eLower.includes('obi')) return { icon: 'terminal', className: 'subject-computer-science' }
  if (eLower.includes('obf')) return { icon: 'bolt', className: 'subject-physics' }
  if (eLower.includes('obq')) return { icon: 'science', className: 'subject-chemistry' }
  if (eLower.includes('onc')) return { icon: 'biotech', className: 'subject-biology' }
  if (eLower.includes('paulista')) {
    if (lowerName.includes('1')) return { icon: 'looks_one', className: 'subject-math' }
    if (lowerName.includes('2')) return { icon: 'looks_two', className: 'subject-physics' }
    if (lowerName.includes('3')) return { icon: 'looks_3', className: 'subject-chemistry' }
  }
  if (lowerName.includes('acquisition'))
    return { icon: 'translate', className: 'subject-languages' }
  if (lowerName.includes('literature'))
    return { icon: 'auto_stories', className: 'subject-literature' }
  if (lowerName.includes('individuals') || lowerName.includes('societies'))
    return { icon: 'groups', className: 'subject-humanities' }
  if (lowerName.includes('no calculator'))
    return { icon: 'stylus', className: 'subject-math-nocalc' }
  if (lowerName.includes('calculator')) return { icon: 'calculate', className: 'subject-math-calc' }
  if (
    lowerName.includes('matemática') ||
    lowerName.includes('math') ||
    lowerName.includes('raciocínio')
  )
    return { icon: 'calculate', className: 'subject-math' }
  if (lowerName.includes('física') || lowerName.includes('physics'))
    return { icon: 'bolt', className: 'subject-physics' }
  if (lowerName.includes('química') || lowerName.includes('chemistry'))
    return { icon: 'science', className: 'subject-chemistry' }
  if (
    lowerName.includes('biologia') ||
    lowerName.includes('biology') ||
    lowerName.includes('natureza') ||
    lowerName.includes('science')
  )
    return { icon: 'biotech', className: 'subject-biology' }
  if (
    lowerName.includes('história') ||
    lowerName.includes('history') ||
    lowerName.includes('humanas') ||
    lowerName.includes('societies')
  )
    return { icon: 'history_edu', className: 'subject-history' }
  if (lowerName.includes('geografia') || lowerName.includes('geography'))
    return { icon: 'public', className: 'subject-geography' }
  if (lowerName.includes('listening')) return { icon: 'hearing', className: 'subject-listening' }
  if (lowerName.includes('speaking'))
    return { icon: 'record_voice_over', className: 'subject-speaking' }
  if (lowerName.includes('reading')) return { icon: 'auto_stories', className: 'subject-reading' }
  if (lowerName.includes('writing') || lowerName.includes('redação') || lowerName.includes('essay'))
    return { icon: 'edit_note', className: 'subject-essay' }
  if (
    lowerName.includes('português') ||
    lowerName.includes('linguagens') ||
    lowerName.includes('english') ||
    lowerName.includes('literature') ||
    lowerName.includes('language')
  )
    return { icon: 'translate', className: 'subject-languages' }
  if (lowerName.includes('art') || lowerName.includes('artes'))
    return { icon: 'palette', className: 'subject-arts' }

  return { icon: 'menu_book', className: 'subject-default' }
}

export const examSystems = {
  undergraduateAdmissions:
    examCategories.find((cat) => cat.id === 'undergraduate_admissions')?.exams || [],
  international: {
    aLevels: {
      subjects: [
        'Mathematics',
        'Further Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'English Literature',
        'History',
        'Geography',
        'Economics',
        'Psychology',
      ],
      weights: {
        Mathematics: 1.0,
        'Further Mathematics': 1.0,
        Physics: 1.0,
        Chemistry: 1.0,
        Biology: 1.0,
        'English Literature': 0.8,
        History: 0.8,
        Geography: 0.8,
        Economics: 0.8,
        Psychology: 0.8,
      },
      minScore: 40,
      maxScore: 90,
      gradeBoundaries: { A: 80, B: 70, C: 60, D: 50, E: 40 },
    },
    ibDiploma: {
      core: [
        'Theory of Knowledge (TOK)',
        'Extended Essay (EE)',
        'Creativity, Activity, Service (CAS)',
      ],
      subjects: [
        'Language A: Literature',
        'Language A: Language and Literature',
        'Language B',
        'Individuals and Societies',
        'Sciences',
        'Mathematics: Analysis and Approaches',
        'Mathematics: Applications and Interpretation',
        'The Arts',
      ],
      minPoints: 24,
      maxPoints: 45,
      gradeBoundaries: { '7': 85, '6': 75, '5': 65, '4': 55, '3': 45, '2': 35, '1': 25 },
    },
    abitur: {
      subjects: [
        'Deutsch',
        'Mathematik',
        'Englisch',
        'Physik',
        'Chemie',
        'Biologie',
        'Geschichte',
        'Geografie',
        'Sozialkunde',
        'Kunst',
        'Musik',
      ],
      weights: {
        Deutsch: 1.0,
        Matematik: 1.0,
        Englisch: 1.0,
        Physik: 0.8,
        Chemie: 0.8,
        Biologie: 0.8,
        Geschichte: 0.6,
        Geografie: 0.6,
        Sozialkunde: 0.6,
        Kunst: 0.4,
        Musik: 0.4,
      },
      minScore: 4.0,
      maxScore: 1.0,
      gradeBoundaries: { '1': 15, '2': 11, '3': 8, '4': 5 },
    },
    baccalaureat: {
      subjects: [
        'Français',
        'Mathématiques',
        'Histoire-Géographie',
        'Langue Vivante 1',
        'Langue Vivante 2',
        'Philosophie',
        'Sciences',
        'Littérature',
        'Arts',
      ],
      weights: {
        Français: 1.0,
        Mathématiques: 1.0,
        Philosophie: 1.0,
        'Histoire-Géographie': 0.8,
        'Langue Vivante 1': 0.8,
        Sciences: 0.7,
        Littérature: 0.6,
        'Langue Vivante 2': 0.5,
        Arts: 0.4,
      },
      minScore: 10,
      maxScore: 20,
      gradeBoundaries: { TB: 16, B: 14, AB: 12, Passable: 10 },
    },
    maturita: {
      subjects: [
        'Italiano',
        'Matematica',
        'Storia',
        'Geografia',
        'Scienze',
        'Lingua Straniera',
        'Filosofia',
        'Latino',
        'Greco',
        'Arte',
        'Musica',
      ],
      weights: {
        Italiano: 1.0,
        Matematica: 1.0,
        'Lingua Straniera': 1.0,
        Storia: 0.8,
        Scienze: 0.8,
        Filosofia: 0.7,
        Geografia: 0.6,
        Latino: 0.5,
        Greco: 0.5,
        Arte: 0.4,
        Musica: 0.4,
      },
      minScore: 60,
      maxScore: 100,
      gradeBoundaries: { A: 90, B: 80, C: 70, D: 60 },
    },
  },
} as const
