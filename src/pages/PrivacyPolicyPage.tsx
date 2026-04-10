import React from 'react'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import ScrollToTopButton from '../components/ScrollToTopButton'
import LandingHeader from '../components/LandingHeader'
import '../styles/legal.css'

const PrivacyPolicyPage: React.FC = () => {
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
          <h1>Política de Privacidade</h1>
          <p>Transparência total sobre como seus dados são (e principalmente, como NÃO são) utilizados no PsyMind.AI.</p>
        </div>

        <section className="legal-document">
          <p className="legal-update-date">Última atualização: 7 de Abril de 2026</p>

          <h2>1. Arquitetura Local (Client-Side)</h2>
          <p>O PsyMind.AI é fundamentado na privacidade *by design*. Somos uma aplicação exclusivamente executada no lado do cliente (Vite + React). <strong>Não possuímos servidores de banco de dados próprios</strong> que interceptam, leem ou armazenam seus desabafos, conversas ou dados de perfil centralizadamente.</p>
          <p>Todas as informações pessoais, incluindo seu Histórico de Conversas, Temas, Planejamentos do Pomodoro e Diário Emocional, são salvas <strong>exclusivamente no cache do seu próprio navegador (localStorage)</strong>.</p>

          <h2>2. Processamento das Inteligências Artificiais</h2>
          <p>Para fornecer respostas inteligentes, o aplicativo estabelece uma ponte direta do seu navegador com fornecedores de IA (como o Google Gemini API). Ao enviar uma mensagem:</p>
          <ul>
            <li>O seu texto (e contexto do chat atual) passa por uma camada técnica diretamente para os servidores da IA selecionada.</li>
            <li>A chave de API que você fornece fica armazenada criptografada apenas na memória local do seu dispositivo.</li>
            <li>Recomendamos revisar as políticas de privacidade da Google (fornecedora do Gemini) sobre como eles gerenciam prompts de API.</li>
          </ul>

          <h2>3. O Modo Anônimo</h2>
          <p>Para garantir máxima privacidade em desabafos pontuais, disponibilizamos o <strong>Modo Anônimo</strong>. Ao engajar com a IA neste modo, a conversa <strong>não</strong> é gravada em momento algum no seu localStorage, desaparecendo permanentemente de qualquer registro na máquina assim que a aba for recarregada ou o chat for fechado.</p>

          <h2>4. Cookies e Armazenamento em Cache</h2>
          <p>Utilizamos apenas cookies essenciais e a tecnologia de Web Storage local necessários para o funcionamento básico e a personalização da interface, tais como:</p>
          <ul>
            <li>Lembrar sua preferência de Modo Escuro ou Modo Claro.</li>
            <li>Configurações de Fontes (aumentadas/reduzidas).</li>
            <li>Configurações de Acessibilidade ou Redução de Movimento.</li>
            <li>Estatísticas de foco locais (relatório de pomodoros diários).</li>
          </ul>

          <h2>5. Segurança e Compartilhamento de Dados</h2>
          <p>Como não coletamos dados para nosso servidor, é tecnicamente impossível para o PsyMind.AI vender, repassar, ou compartilhar suas mensagens em massa para agências terceiras de publicidade ou marketing. Ponto final.</p>

          <h2>6. Exclusão de Dados</h2>
          <p>Como você tem controle integral, você pode excluir qualquer dado a qualquer instante. Para apagar completamente tudo que o aplicativo sabe sobre você, basta clicar em "Limpar Histórico" ou usar o recurso do navegador de limpar o cache (Local Storage). Não haverá recuperação possível (uma vez que não há servidores de nuvem envolvidos).</p>

          <h2>7. Alterações nesta Política</h2>
          <p>O PsyMind.AI é Open Source. Se no futuro um recurso estritamente dependente de nuvem se tornar necessário e decidirmos integrar algo como um Banco de Dados Oficial, esta Política será atualizada via repositório, com um grande aviso exposto de forma antecipada para todos os usuários da plataforma.</p>
        </section>
      </main>

      <Footer />
      <ScrollToTopButton />
    </motion.div>
  )
}

export default PrivacyPolicyPage
