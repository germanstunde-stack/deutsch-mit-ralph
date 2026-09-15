import { Mascot } from "./Mascot";
import { useInstallPrompt } from "../lib/pwaInstall";
import { usePlayer } from "../auth/AuthProvider";

export function Welcome({ onContinue }: { onContinue: () => void }) {
  const { profile } = usePlayer();
  const { canInstall, promptInstall, isIOS, isStandalone } = useInstallPrompt();

  return (
    <div className="login-wrap">
      <div className="login cadastro welcome">
        <Mascot className="mascot" />
        <h1><span className="hallo plush">Bem-vindo{profile?.display_name ? `, ${profile.display_name}` : ""}!</span></h1>
        <p style={{ marginBottom: 4 }}>O <b>SwissStunde</b> é pra falantes de português aprenderem do zero o alemão <b>da Suíça</b> — desde a alfabetização.</p>
        <p className="desc" style={{ marginTop: 6 }}>Aqui se escreve <b>Strasse</b>, não <i>Straße</i>; <b>Velo</b>, não <i>Fahrrad</i>; <b>Billett</b>, não <i>Fahrkarte</i>. É o alemão que vale em contrato, escola e formulário na Suíça. E o dialeto que você ouve na rua (<b>Grüezi</b>, <b>Merci vilmal</b>) aparece marcado nos cards, pra reconhecer de ouvido.</p>

        <div className="welcome-section">
          <div className="subhead" style={{ marginTop: 0 }}>💛 De graça, de propósito</div>
          <p className="desc">O objetivo aqui é o oposto de monetização: espalhar conhecimento de forma orgânica. Feito por alguém que também está aprendendo alemão, e o app cresce no ritmo desse aprendizado — módulo a módulo, ainda em construção.</p>
        </div>

        <div className="welcome-section">
          <div className="subhead">📱 Instalar no celular</div>
          {isStandalone ? (
            <p className="desc">Você já está usando o app instalado. 🎉</p>
          ) : canInstall ? (
            <>
              <p className="desc">Instale como um app de verdade, com ícone na tela inicial.</p>
              <button className="btn primary" onClick={promptInstall}>⬇️ Instalar SwissStunde</button>
            </>
          ) : isIOS ? (
            <p className="desc">No iPhone: toque em <b>Compartilhar</b> (o ícone com a seta) e depois em <b>Adicionar à Tela de Início</b>.</p>
          ) : (
            <p className="desc">No menu do navegador, procure por <b>Instalar app</b> ou <b>Adicionar à tela inicial</b>.</p>
          )}
        </div>

        <div className="welcome-section">
          <div className="subhead">🏆 Ranking</div>
          <p className="desc">Tem um placar entre todos os alunos, em 3 categorias: <b>Exercícios</b>, <b>Provas com consulta</b> e <b>Provas sem consulta</b>. Só aparecem <b>apelido</b> e <b>idade</b> — seu e-mail nunca é mostrado a ninguém.</p>
        </div>

        <div className="welcome-section">
          <div className="subhead">📐 Como funciona a progressão</div>
          <ul className="welcome-rules">
            <li>Só avança pro próximo módulo tirando <b>96% ou mais</b> na Prova do módulo atual.</li>
            <li>Pode <b>descer</b> de nível à vontade, quando quiser revisar.</li>
            <li>Quem já alcançou 96% num módulo fica liberado — não precisa refazer pra manter o acesso.</li>
          </ul>
        </div>

        <div className="welcome-section">
          <div className="subhead">🎯 Um aviso honesto</div>
          <p className="desc">O app não garante nem promete fluência — ele só ajuda a entender o alemão de um jeito didático e interativo. Pra virar proficiência de verdade, o segredo é <b>praticar</b>: repita o mesmo módulo quantas vezes quiser, pra treino intensivo.</p>
        </div>

        <p className="desc" style={{ marginTop: 14 }}>Um abraço a todos! 🤗</p>

        <button className="btn primary" style={{ marginTop: 10 }} onClick={onContinue}>Vamos começar! →</button>
      </div>
    </div>
  );
}
