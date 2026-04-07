const fs = require('fs');
const file = 'src/components/ExamsModal.jsx';
let content = fs.readFileSync(file, 'utf8');

const newTopics = `,
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
  ]`;

content = content.replace("const examTopics = {", "const examTopics = {" + newTopics);

const paulistaTopicsLogic = `
  // Provão Paulista Logic
  if (examLower.includes('paulista')) {
    if (lower.includes('1')) return examTopics['Provão Paulista 1º Ano'];
    if (lower.includes('2')) return examTopics['Provão Paulista 2º Ano'];
    if (lower.includes('3')) return examTopics['Provão Paulista 3º Ano'];
  }
`;

content = content.replace("// International Exams Logic", paulistaTopicsLogic + "\n  // International Exams Logic");

const getSubjectConfigModify = `
    // Provão Paulista Icons
    if (eLower.includes('paulista')) {
      if (lowerName.includes('1')) return { icon: 'looks_one', className: 'subject-math' };
      if (lowerName.includes('2')) return { icon: 'looks_two', className: 'subject-physics' };
      if (lowerName.includes('3')) return { icon: 'looks_3', className: 'subject-chemistry' };
    }

    // IB Specific`;

content = content.replace("// IB Specific", getSubjectConfigModify);

fs.writeFileSync(file, content);
console.log("Updated ExamsModal.jsx for Provão Paulista successfully.");
