import React from 'react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';
import LandingHeader from '../components/LandingHeader';
import '../styles/legal.css';

const TermsOfUsePage = () => {
  return (
    <motion.div 
      className="landing-page legal-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <LandingHeader />

      <main className="legal-content">
        <div className="legal-header">
          <h1>Termos de Uso</h1>
          <p>Condições gerais de navegação, responsabilidades legais da Inteligência Artificial e Regras Open-Source.</p>
        </div>

        <section className="legal-document">
          <p className="legal-update-date">Última atualização: 7 de Abril de 2026</p>

          <h2>1. Aviso Legal (Disclaimer) Essencial sobre Saúde Mental ⚠️</h2>
          <p>O PsyMind.AI é fornecido <strong>exclusivamente para fins informativos e de apoio ao aprendizado/autodesenvolvimento</strong>. A inteligência artificial presente na plataforma pode fornecer reflexões emocionais, citações estoicas, rotinas de estudos e exercícios, mas <strong style={{color: 'var(--primary-color)'}}>NUNCA SUBSTITUI</strong> (e não tem a competência para) o tratamento, conselho profissional, ou diagnóstico em Saúde Mental e Psicológica.</p>
          <p>Se você estiver em crise ou lutando ativamente com questões psicológicas (ansiedade, depressão, pensamentos suicidas e afins), por favor, <strong>feche o sistema imediatamente e ligue para especialistas, centros médicos ou o CVV (Centro de Valorização da Vida) do seu país</strong>. O PsyMind não tem infraestrutura responsiva ou humana para atender crises extremas.</p>

          <h2>2. Responsabilidades pelas "Alucinações" (Erros da IA)</h2>
          <p>O cérebro do PsyMind.AI roda usando Modelos Avançados de Linguagem. Esses modelos criam texto através de estatística probabilística. Isso os conduz inerentemente ao risco das "alucinações da IA" (dar explicações incrivelmente plausíveis, porém tecnicamente ou factualmente incorretas).</p>
          <p>Diferentemente da Inteligência Humana, ela comete erros lógicos imprevisíveis. Nós, os desenvolvedores do PsyMind.AI <strong>isentamo-nos de qualquer responsabilidade sobre a exatidão, rigor educacional ou validade fática dos códigos gerados (Modo Juiz), dos Quiz de Simulado, e definições geradas em tutoria</strong>.</p>
          <p>Use tudo o que for construído sob avaliação da IA com um olhar aguçado. A ferramenta funciona perfeitamente bem como alavanca e auxiliar – não como autoridade onisciente inquestionável.</p>

          <h2>3. Direitos Autorais e Cultura Code Open-Source</h2>
          <p>Você é incrivelmente bem-vindo a auditar o PsyMind.AI, copiá-lo, dissecá-lo ou aprimorá-lo sob os devidos termos.</p>
          <ul>
            <li>O repositório PsyMind.AI está licenciado sob a licença de <strong>Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional (CC BY-SA 4.0)</strong>.</li>
            <li>Você é livre para compartilhar (copiar e redistribuir) e adaptar (remixar, transformar) o software, até mesmo para fins comerciais.</li>
            <li>A ÚNICA condição é: você deve manter a atribuição aos desenvolvedores originais e quaisquer modificações que fizerem precisam ser distribuídas obrigatoriamente <strong>sob essa mesma licença</strong> livre que estamos providenciando para você.</li>
          </ul>

          <h2>4. Uso da API Keys (Fornecedores de Nuvem)</h2>
          <p>O serviço pode depender que você provisione sua própria chave pessoal de provedores (ex: chave Google Gemini). Ao fazer isto, é vital que você compreenda as limitações orçamentárias e cotas grátis do provedor da API. <strong>O PsyMind não se responsabiliza nem garante reembolso e nem mediará qualquer infração feita à quota ou os eventuais termos atrelados da parceira (Google) sobre a chave que você fornecer à plataforma.</strong></p>

          <h2>5. Alteração nos Exames ou Currículo (Modos Educativos)</h2>
          <p>Nossos modos focados em exames (Simulados da OBA, OBI, OBMEP, ENEM, Provão Paulista) estão refletindo e mapeando editais que nós fornecemos à IA em um contexto específico, extraídos num momento específico do tempo. Nós não mantemos nenhum tipo de obrigação oficial atrelada a esses ministérios de regularidade educacional, os tópicos podem estar datados dependendo do seu ciclo/ano atual.</p>

          <h2>6. Aceitação dos Termos</h2>
          <p>Ao engajar com mensagens via chat no PsyMind.AI, realizar simulações no Juiz OBI ou usar o Rastreador de Diário Emocional, <strong>você automaticamente atesta sua concordância total e incondicional com todos os termos e regulamentos</strong> dispostos deste documento.</p>

        </section>
      </main>

      <Footer />
      <ScrollToTopButton />
    </motion.div>
  );
};

export default TermsOfUsePage;
