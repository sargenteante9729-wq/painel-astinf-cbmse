
import { useEffect, useRef, useState, type CSSProperties } from 'react';

const setores = [
  {
    nome: 'ADM',
    descricao: 'Administração',
    imagem: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=80',
    cor: '#43d9a3',
    atribuicoes: 5,
    detalhes: ['Rotinas administrativas', 'Organização de documentos', 'Acompanhamento das atividades'],
  },
  {
    nome: 'Contratos',
    descricao: 'Gestão de contratos',
    imagem: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=700&q=80',
    cor: '#58a6ff',
    atribuicoes: 4,
    detalhes: ['Acompanhamento contratual', 'Fiscalização de contratos', 'Controle de vigência'],
  },
  {
    nome: 'Logística',
    descricao: 'Compras e processos',
    imagem: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=700&q=80',
    cor: '#e9b44c',
    atribuicoes: 4,
    detalhes: ['Acompanhamento de aquisições', 'Controle de materiais', 'Apoio aos processos'],
  },
  {
    nome: 'Desenvolvimento',
    descricao: 'Sistemas e soluções',
    imagem: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=700&q=80',
    cor: '#b69cff',
    atribuicoes: 1,
    detalhes: ['Desenvolvimento e manutenção de sistemas'],
  },
  {
    nome: 'Suporte',
    descricao: 'Suporte técnico de TI',
    imagem: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=700&q=80',
    cor: '#51d6ed',
    atribuicoes: 1,
    detalhes: ['Atendimento e suporte técnico'],
  },
];

export default function App() {
  const [abertura, setAbertura] = useState(true);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [abaDetalhes, setAbaDetalhes] = useState<'visao' | 'atribuicoes'>('visao');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (abertura && videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        // O botão de entrada continua disponível se o navegador
        // bloquear a reprodução automática.
      });
    }
  }, [abertura]);

  const setorAtual = setores.find((setor) => setor.nome === selecionado);

  return (
    <div className="dashboard">
      {abertura && (
        <section className="intro-screen">
          <video
            ref={videoRef}
            className="intro-video"
            src={`${import.meta.env.BASE_URL}videos/intro.mp4`}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-label="Vídeo institucional de abertura do CBMSE"
          />

          <div className="intro-shade" />

          <div className="intro-content">
            <button
              className="enter-button"
              onClick={() => setAbertura(false)}
            >
              ENTRAR NO PAINEL <span>→</span>
            </button>
            <small>Clique para acessar o painel institucional</small>
          </div>
        </section>
      )}

      <header className="topbar">
        <img
          className="header-banner"
          src={`${import.meta.env.BASE_URL}cabeçalho.png`}
          alt="ASTINF CBMSE — Tecnologia a serviço da missão fim — Painel de gestão"
        />
      </header>

      <main className="main-content">
        <section className="sector-section">
          <div className="section-title">
            <div>
              <h2>▦ &nbsp; ORGANOGRAMA DO SETOR</h2>
            </div>
          </div>

          {!selecionado && (
          <div className="sector-grid">
            {setores.map((setor, index) => (
              <button
                key={setor.nome}
                className={`sector-card ${selecionado === setor.nome ? 'selected' : ''}`}
                style={{ '--sector-color': setor.cor } as CSSProperties}
                onClick={() => {
                  setSelecionado(setor.nome);
                  setAbaDetalhes('visao');
                }}
              >
                <img src={setor.imagem} alt="" />
                <div className="sector-card-content">
                  <small>{String(index + 1).padStart(2, '0')} / ASTINF</small>
                  <h3>{setor.nome}</h3>
                  <p>{setor.descricao}</p>
                  <div className="card-footer">
                    <span>{setor.atribuicoes} atribuições</span>
                    <span>→</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          )}
        </section>

        {setorAtual && (
        <section className="sector-details">
          <div className="detail-heading">
            <button
              type="button"
              className="back-to-sectors"
              onClick={() => setSelecionado(null)}
            >
              ← Voltar cards
            </button>
            <div className="detail-sector-identity">
              <span className="detail-symbol" style={{ color: setorAtual.cor }}>◈</span>
              <div>
                <h2>{setorAtual.nome}</h2>
                <p>{setorAtual.descricao}</p>
              </div>
            </div>
          </div>

          <div className="detail-option-cards" role="tablist" aria-label="Informações do setor">
            <button
              type="button"
              role="tab"
              aria-selected={abaDetalhes === 'visao'}
              className={`detail-option-card ${abaDetalhes === 'visao' ? 'active' : ''}`}
              onClick={() => setAbaDetalhes('visao')}
            >
              <span className="option-icon">◉</span>
              <span className="option-copy">
                <strong>Visão geral</strong>
                <small>Resumo, finalidade e responsáveis do setor</small>
              </span>
              <span className="option-arrow">→</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={abaDetalhes === 'atribuicoes'}
              className={`detail-option-card ${abaDetalhes === 'atribuicoes' ? 'active' : ''}`}
              onClick={() => setAbaDetalhes('atribuicoes')}
            >
              <span className="option-icon">☷</span>
              <span className="option-copy">
                <strong>Atribuições</strong>
                <small>{setorAtual.detalhes.length} itens cadastrados para este setor</small>
              </span>
              <span className="option-count">{setorAtual.detalhes.length}</span>
              <span className="option-arrow">→</span>
            </button>
          </div>

          <div className="detail-subcards">
            {abaDetalhes === 'visao' && (
              <>
                <article className="detail-subcard">
                  <span className="subcard-kicker">SETOR / ASTINF</span>
                  <h3>Sobre o setor</h3>
                  <p>{setorAtual.descricao}. Esta área reúne as informações e atividades relacionadas a {setorAtual.nome}.</p>
                </article>
                <article className="detail-subcard">
                  <span className="subcard-kicker">EQUIPE</span>
                  <h3>Responsáveis e equipe</h3>
                  <p>Os nomes dos responsáveis e integrantes serão incluídos após a validação da estrutura oficial do setor.</p>
                </article>
                <article className="detail-subcard">
                  <span className="subcard-kicker">ATRIBUIÇÕES</span>
                  <h3>Atividades cadastradas</h3>
                  <p>{setorAtual.detalhes.length} atividades descritas para este setor.</p>
                  <button type="button" className="subcard-action" onClick={() => setAbaDetalhes('atribuicoes')}>Ver atribuições →</button>
                </article>
              </>
            )}
            {abaDetalhes === 'atribuicoes' && setorAtual.detalhes.map((item, index) => (
              <article className="detail-subcard assignment-subcard" key={item}>
                <span className="subcard-kicker">ATRIBUIÇÃO {String(index + 1).padStart(2, '0')}</span>
                <h3>{item}</h3>
                <p>Atividade vinculada ao setor de {setorAtual.nome}.</p>
              </article>
            ))}
          </div>
        </section>
        )}

        <footer className="footer">
          Corpo de Bombeiros Militar do Estado de Sergipe
          <span>ASTINF · Painel de Gestão</span>
        </footer>
      </main>
    </div>
  );
}
