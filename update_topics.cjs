const fs = require('fs');
const file = 'src/components/ExamsModal.jsx';
let content = fs.readFileSync(file, 'utf8');

const newTopics = `,
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
  ]`;

content = content.replace("const examTopics = {", "const examTopics = {" + newTopics);

const getTopicsOlympiadLogic = `
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
`;

content = content.replace("// International Exams Logic", getTopicsOlympiadLogic + "\n  // International Exams Logic");

const getSubjectConfigModify = `
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

    // IB Specific`;

content = content.replace("const getSubjectConfig = (subjectName) => {\n    const lowerName = subjectName.toLowerCase();\n    \n    // IB Specific", getSubjectConfigModify);
content = content.replace("const { icon, className } = getSubjectConfig(subject);", "const { icon, className } = getSubjectConfig(subject, selectedExam?.name);");

fs.writeFileSync(file, content);
console.log("Updated ExamsModal.jsx successfully.");
