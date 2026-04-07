import React from 'react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/ScrollToTopButton';
import LandingHeader from '../components/LandingHeader';
import '../styles/legal.css';

const TransparencyPage = () => {
  return (
    <motion.div 
      className="landing-page legal-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <LandingHeader />

      <main className="legal-content" style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 20px 80px', width: '100%', boxSizing: 'border-box' }}>
        <div className="legal-header">
          <h1>Centro de <span className="gradient-text">Transparência</span></h1>
          <p>Entenda exatamente como o PsyMind.AI funciona sob o capô, onde seus dados vivem e como a inteligência artificial toma decisões.</p>
        </div>

        <section className="legal-document">
          <h2>1. Quais dados são coletados?</h2>
          <p>O PsyMind.AI foi construído para respeitar ao máximo a sua privacidade. Nós coletamos passivamente apenas métricas de uso anônimas (caso o usuário aceite fornecer) para melhorar a ferramenta, que incluem:</p>
          <ul>
            <li><strong>Métricas de Sessão:</strong> Quanto tempo você passou no app e quantos dias você retornou.</li>
            <li><strong>Uso de Ferramentas:</strong> Quantas vezes você abriu ferramentas como o Pomodoro, Diário Emocional ou Chat.</li>
            <li><strong>Erros do Aplicativo:</strong> Registros técnicos caso algo quebre na sua tela, para podermos consertar.</li>
            <li><strong>Ganhos de Transformação:</strong> Uma pontuação abstrata gerada quando você conclui marcos positivos (como terminar trilhas de aprendizado).</li>
          </ul>
          <p><strong>Importante:</strong> Nós absolutamente <strong>NÃO</strong> coletamos nem enviamos para nenhum lugar o teor das suas conversas, seus desabafos no diário, ou as emoções específicas que você registra.</p>

          <h2>2. Onde meus dados são armazenados?</h2>
          <p><strong>Exclusivamente no seu dispositivo.</strong></p>
          <p>O PsyMind.AI é um aplicativo <em>100% Front-End (Client-Side)</em>. Isso significa que ele não possui um banco de dados centralizado em nossos servidores. Tudo o que você conversa com a IA, suas rotinas e histórico de humor ficam salvos no armazenamento local do seu próprio navegador (o <code>localStorage</code>).</p>
          <p>Se você abrir o aplicativo em outro computador ou limpar os dados do seu navegador, seu histórico não estará lá. Você é o único dono e portador de suas informações pessoais.</p>

          <h2>3. Como a IA funciona? (Resumido)</h2>
          <p>A "mágica" por trás do assistente é impulsionada pela conexão do seu aplicativo com modelos de linguagem (LLMs), como o Google Gemini.</p>
          <ul>
            <li><strong>Comunicação Direta:</strong> Quando você envia uma mensagem, o seu aplicativo envia o seu texto — junto com instruções pedagógicas e as regras de segurança do PsyMind — diretamente para a API do Google. Nós não interceptamos essa mensagem no meio do caminho.</li>
            <li><strong>Consciência de Contexto:</strong> Para parecer inteligente, o aplicativo "injeta" silenciosamente no pedido algumas métricas que estão no seu dispositivo. Por exemplo, ele envia "o usuário usou o pomodoro 3 vezes hoje" para que a IA possa te parabenizar. Mas a IA esquece isso assim que responde (não é treinado nos seus dados).</li>
            <li><strong>Memória de Longo Prazo:</strong> A cada 5 mensagens que você envia, uma revisão assíncrona acontece. A IA resume seu padrão de estudo e humor e salva um pequeno arquivo de texto (JSON) <em>no seu dispositivo</em>. A partir disso, o Assistente se lembra que você tem "dificuldade em matemática", por exemplo, lendo esse arquivo salvo localmente antes de te responder.</li>
          </ul>

          <h2>4. Segurança e Seu Controle</h2>
          <p>Você pode acessar a seção de <strong>Configurações</strong> a qualquer momento para:</p>
          <ul>
            <li>Desativar completamente a Telemetria Anônima.</li>
            <li>Apagar totalmente o Histórico Mestre da IA e memórias de longo prazo.</li>
            <li>Engajar com o Modo Anônimo (logo na página de chat), que processa a conversa temporariamente e apaga do seu navegador assim que a janela é fechada.</li>
          </ul>
        </section>
      </main>

      <Footer />
      <ScrollToTopButton />
    </motion.div>
  );
};

export default TransparencyPage;