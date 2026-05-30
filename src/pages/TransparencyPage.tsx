import React from 'react'
import { m } from 'framer-motion'
import { useTranslation, Trans } from 'react-i18next'
import Footer from '@/components/layout/Footer'
import ScrollToTopButton from '@/components/ui/ScrollToTopButton'
import LandingHeader from '@/components/layout/LandingHeader'
import '../styles/legal.css'

const TransparencyPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <m.div 
      className="landing-page legal-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <LandingHeader />

      <main className="legal-content" style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 20px 80px', width: '100%', boxSizing: 'border-box' }}>
        <div className="legal-header">
          <h1>
            {t('transparency.header.title_prefix')} <span className="gradient-text">{t('transparency.header.title_highlight')}</span>
          </h1>
          <p>{t('transparency.header.subtitle')}</p>
        </div>

        <section className="legal-document">
          <h2>{t('transparency.sections.s1.title')}</h2>
          <p>{t('transparency.sections.s1.p1')}</p>
          <ul>
            <li><Trans i18nKey="transparency.sections.s1.li1"><strong>Métricas de Sessão:</strong> Quanto tempo você passou no app e quantos dias você retornou.</Trans></li>
            <li><Trans i18nKey="transparency.sections.s1.li2"><strong>Uso de Ferramentas:</strong> Quantas vezes você abriu ferramentas como o Pomodoro, Diário Emocional ou Chat.</Trans></li>
            <li><Trans i18nKey="transparency.sections.s1.li3"><strong>Erros do Aplicativo:</strong> Registros técnicos caso algo quebre na sua tela, para podermos consertar.</Trans></li>
            <li><Trans i18nKey="transparency.sections.s1.li4"><strong>Ganhos de Transformação:</strong> Uma pontuação abstrata gerada quando você conclui marcos positivos (como terminar trilhas de aprendizado).</Trans></li>
          </ul>
          <p><Trans i18nKey="transparency.sections.s1.important"><strong>Importante:</strong> Nós absolutamente <strong>NÃO</strong> coletamos nem enviamos para nenhum lugar o teor das suas conversas, seus desabafos no diário, ou as emoções específicas que você registra.</Trans></p>

          <h2>{t('transparency.sections.s2.title')}</h2>
          <p><Trans i18nKey="transparency.sections.s2.p1"><strong>Exclusivamente no seu dispositivo.</strong></Trans></p>
          <p><Trans i18nKey="transparency.sections.s2.p2">O PsyMind.AI é um aplicativo <em>100% Front-End (Client-Side)</em>. Isso significa que ele não possui um banco de dados centralizado em nossos servidores. Tudo o que você conversa com a IA, suas rotinas e histórico de humor ficam salvos no armazenamento local do seu próprio navegador (o <code>localStorage</code>).</Trans></p>
          <p>{t('transparency.sections.s2.p3')}</p>

          <h2>{t('transparency.sections.s3.title')}</h2>
          <p>{t('transparency.sections.s3.p1')}</p>
          <ul>
            <li><Trans i18nKey="transparency.sections.s3.li1"><strong>Comunicação Direta:</strong> Quando você envia uma mensagem, o seu aplicativo envia o seu texto — junto com instruções pedagógicas e as regras de segurança do PsyMind — diretamente para a API do Google. Nós não interceptamos essa mensagem no meio do caminho.</Trans></li>
            <li><Trans i18nKey="transparency.sections.s3.li2"><strong>Consciência de Contexto:</strong> Para parecer inteligente, o aplicativo "injeta" silenciosamente no pedido algumas métricas que estão no seu dispositivo. Por exemplo, ele envia "o usuário usou o pomodoro 3 vezes hoje" para que a IA possa te parabenizar. Mas a IA esquece isso assim que responde (não é treinado nos seus dados).</Trans></li>
            <li><Trans i18nKey="transparency.sections.s3.li3"><strong>Memória de Longo Prazo:</strong> A cada 5 mensagens que você envia, uma revisão assíncrona acontece. A IA resume seu padrão de estudo e humor e salva um pequeno arquivo de texto (JSON) <em>no seu dispositivo</em>. A partir disso, o Assistente se lembra que você tem "dificuldade em matemática", por exemplo, lendo esse arquivo salvo localmente antes de te responder.</Trans></li>
          </ul>

          <h2>{t('transparency.sections.s4.title')}</h2>
          <p><Trans i18nKey="transparency.sections.s4.p1">Você pode acessar a seção de <strong>Configurações</strong> a qualquer momento para:</Trans></p>
          <ul>
            <li>{t('transparency.sections.s4.li1')}</li>
            <li>{t('transparency.sections.s4.li2')}</li>
            <li>{t('transparency.sections.s4.li3')}</li>
          </ul>
        </section>
      </main>

      <Footer />
      <ScrollToTopButton />
    </m.div>
  )
}

export default TransparencyPage
