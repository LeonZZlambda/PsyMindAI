import React from 'react'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import ScrollToTopButton from '../components/ScrollToTopButton'
import LandingHeader from '../components/LandingHeader'
import '../styles/legal.css'

const TermsOfUsePage: React.FC = () => {
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

          <h2>2. Responsabilidades pelas "Alucinações" (Erros da IA)</h2>
          <p>O cérebro do PsyMind.AI roda usando Modelos Avançados de Linguagem. Esses modelos criam texto através de estatística probabilística. Isso os conduz inerentemente ao risco das "alucinações da IA" (dar explicações incrivelmente plausíveis, porém tecnicamente ou factualmente incorretas).</p>

          <h2>3. Direitos Autorais e Cultura Code Open-Source</h2>
          <p>O repositório PsyMind.AI está licenciado sob a licença de <strong>Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional (CC BY-SA 4.0)</strong>.</p>

          <h2>4. Uso da API Keys (Fornecedores de Nuvem)</h2>
          <p>O serviço pode depender que você provisione sua própria chave pessoal de provedores (ex: chave Google Gemini). Ao fazer isto, é vital que você compreenda as limitações orçamentárias e cotas grátis do provedor da API. <strong>O PsyMind não se responsabiliza nem garante reembolso e nem mediará qualquer infração feita à quota ou os eventuais termos atrelados da parceira (Google) sobre a chave que você fornecer à plataforma.</strong></p>

        </section>
      </main>

      <Footer />
      <ScrollToTopButton />
    </motion.div>
  )
}

export default TermsOfUsePage
