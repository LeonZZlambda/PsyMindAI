import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation, Trans } from 'react-i18next'
import Footer from '../components/Footer'
import ScrollToTopButton from '../components/ScrollToTopButton'
import LandingHeader from '../components/LandingHeader'
import '../styles/legal.css'

const TermsOfUsePage: React.FC = () => {
  const { t } = useTranslation()

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
          <h1>{t('terms.title')}</h1>
          <p>{t('terms.subtitle')}</p>
        </div>

        <section className="legal-document">
          <p className="legal-update-date">{t('terms.last_update')}</p>

          <h2>{t('terms.sections.s1.title')}</h2>
          <p><Trans i18nKey="terms.sections.s1.p1">O PsyMind.AI é fornecido <strong>exclusivamente para fins informativos e de apoio ao aprendizado/autodesenvolvimento</strong>. A inteligência artificial presente na plataforma pode fornecer reflexões emocionais, citações estoicas, rotinas de estudos e exercícios, mas <strong style={{color: 'var(--primary-color)'}}>NUNCA SUBSTITUI</strong> (e não tem a competência para) o tratamento, conselho profissional, ou diagnóstico em Saúde Mental e Psicológica.</Trans></p>

          <h2>{t('terms.sections.s2.title')}</h2>
          <p>{t('terms.sections.s2.p1')}</p>

          <h2>{t('terms.sections.s3.title')}</h2>
          <p><Trans i18nKey="terms.sections.s3.p1">O repositório PsyMind.AI está licenciado sob a licença de <strong>Creative Commons Atribuição-CompartilhaIgual 4.0 Internacional (CC BY-SA 4.0)</strong>.</Trans></p>

          <h2>{t('terms.sections.s4.title')}</h2>
          <p><Trans i18nKey="terms.sections.s4.p1">O serviço pode depender que você provisione sua própria chave pessoal de provedores (ex: chave Google Gemini). Ao fazer isto, é vital que você compreenda as limitações orçamentárias e cotas grátis do provedor da API. <strong>O PsyMind não se responsabiliza nem garante reembolso e nem mediará qualquer infração feita à quota ou os eventuais termos atrelados da parceira (Google) sobre a chave que você fornecer à plataforma.</strong></Trans></p>

        </section>
      </main>

      <Footer />
      <ScrollToTopButton />
    </motion.div>
  )
}

export default TermsOfUsePage
