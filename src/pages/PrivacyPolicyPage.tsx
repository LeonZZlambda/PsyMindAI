import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation, Trans } from 'react-i18next'
import Footer from '@/components/layout/Footer'
import ScrollToTopButton from '@/components/ui/ScrollToTopButton'
import LandingHeader from '@/components/layout/LandingHeader'
import '../styles/legal.css'

const PrivacyPolicyPage: React.FC = () => {
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
          <h1>{t('privacy.title')}</h1>
          <p>{t('privacy.subtitle')}</p>
        </div>

        <section className="legal-document">
          <p className="legal-update-date">{t('privacy.last_update')}</p>

          <h2>{t('privacy.sections.s1.title')}</h2>
          <p><Trans i18nKey="privacy.sections.s1.p1">O PsyMind.AI é fundamentado na privacidade *by design*. Somos uma aplicação exclusivamente executada no lado do cliente (Vite + React). <strong>Não possuímos servidores de banco de dados próprios</strong> que interceptam, leem ou armazenam seus desabafos, conversas ou dados de perfil centralizadamente.</Trans></p>
          <p><Trans i18nKey="privacy.sections.s1.p2">Todas as informações pessoais, incluindo seu Histórico de Conversas, Temas, Planejamentos do Pomodoro e Diário Emocional, são salvas <strong>exclusivamente no cache do seu próprio navegador (localStorage)</strong>.</Trans></p>

          <h2>{t('privacy.sections.s2.title')}</h2>
          <p>{t('privacy.sections.s2.p1')}</p>
          <ul>
            <li>{t('privacy.sections.s2.li1')}</li>
            <li>{t('privacy.sections.s2.li2')}</li>
            <li>{t('privacy.sections.s2.li3')}</li>
          </ul>

          <h2>{t('privacy.sections.s3.title')}</h2>
          <p><Trans i18nKey="privacy.sections.s3.p1">Para garantir máxima privacidade em desabafos pontuais, disponibilizamos o <strong>Modo Anônimo</strong>. Ao engajar com a IA neste modo, a conversa <strong>não</strong> é gravada em momento algum no seu localStorage, desaparecendo permanentemente de qualquer registro na máquina assim que a aba for recarregada ou o chat for fechado.</Trans></p>

          <h2>{t('privacy.sections.s4.title')}</h2>
          <p>{t('privacy.sections.s4.p1')}</p>
          <ul>
            <li>{t('privacy.sections.s4.li1')}</li>
            <li>{t('privacy.sections.s4.li2')}</li>
            <li>{t('privacy.sections.s4.li3')}</li>
            <li>{t('privacy.sections.s4.li4')}</li>
          </ul>

          <h2>{t('privacy.sections.s5.title')}</h2>
          <p>{t('privacy.sections.s5.p1')}</p>

          <h2>{t('privacy.sections.s6.title')}</h2>
          <p>{t('privacy.sections.s6.p1')}</p>

          <h2>{t('privacy.sections.s7.title')}</h2>
          <p>{t('privacy.sections.s7.p1')}</p>
        </section>
      </main>

      <Footer />
      <ScrollToTopButton />
    </motion.div>
  )
}

export default PrivacyPolicyPage
