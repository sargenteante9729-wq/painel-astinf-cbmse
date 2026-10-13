
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
  const [selecionado, setSelecionado] = useState('ADM');
  const [busca, setBusca] = useState('');
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

  const setorAtual =
    setores.find((setor) => setor.nome === selecionado) ?? setores[0];

  const setoresFiltrados = setores.filter((setor) =>
    `${setor.nome} ${setor.descricao}`
      .toLowerCase()
      .includes(busca.toLowerCase())
  );

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
            <span className="intro-kicker">CORPO DE BOMBEIROS MILITAR</span>
            <h1>ASTINF <span>| CBMSE</span></h1>
            <p>Assessoria de Tecnologia da Informação</p>
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
        <div className="brand">
          <img className="brand-logo" src={`${import.meta.env.BASE_URL}1.png`} alt="Logo ASTINF CBMSE" />
          <div className="brand-mission">TECNOLOGIA A SERVIÇO DA MISSÃO FIM</div>
        </div>
        <span className="topbar-label">PAINEL DE GESTÃO</span>
      </header>

      <main className="main-content">
        <section className="stats">
          <article className="stat">
            <span className="stat-icon">⌘</span>
            <div><strong>05</strong><small>Setores integrados</small></div>
          </article>
          <article className="stat">
            <span className="stat-icon">♙</span>
            <div><strong>10</strong><small>Registros de equipe</small></div>
          </article>
          <article className="stat">
            <span className="stat-icon">☷</span>
            <div><strong>15</strong><small>Atribuições documentadas</small></div>
          </article>
          <div className="video-preview">
            <video
              src={`${import.meta.env.BASE_URL}videos/intro.mp4`}
              muted
              playsInline
              preload="metadata"
            />
            <button onClick={() => setAbertura(true)}>
              ▶ Rever abertura
            </button>
          </div>
        </section>

        <section className="sector-section">
          <div className="section-title">
            <div>
              <h2>▦ &nbsp; Painel de setores</h2>
              <p>Selecione um setor para consultar suas informações.</p>
            </div>
            <input
              type="search"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="⌕  Buscar setor..."
              aria-label="Buscar setor"
            />
          </div>

          <div className="sector-grid">
            {setoresFiltrados.map((setor, index) => (
              <button
                key={setor.nome}
                className={`sector-card ${selecionado === setor.nome ? 'selected' : ''}`}
                style={{ '--sector-color': setor.cor } as CSSProperties}
                onClick={() => setSelecionado(setor.nome)}
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
        </section>

        <section className="sector-details">
          <div className="detail-heading">
            <div>
              <span className="detail-symbol" style={{ color: setorAtual.cor }}>◈</span>
              <div>
                <h2>{setorAtual.nome}</h2>
                <p>{setorAtual.descricao}</p>
              </div>
            </div>
            <span className="sector-tag">Setor da ASTINF</span>
          </div>

          <div className="detail-tabs">
            <span className="active-tab">Visão geral</span>
            <span>Atribuições <b>{setorAtual.atribuicoes}</b></span>
          </div>

          <div className="detail-columns">
            <section>
              <h3>♙ &nbsp; EQUIPE E RESPONSÁVEIS</h3>
              <div className="empty-panel">
                Os nomes e responsáveis serão cadastrados após a
                validação da estrutura oficial do setor.
              </div>
            </section>
            <section>
              <h3>☷ &nbsp; ATRIBUIÇÕES DO SETOR</h3>
              <div className="assignment-list">
                {setorAtual.detalhes.map((item, index) => (
                  <div className="assignment" key={item}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>

        <footer className="footer">
          Corpo de Bombeiros Militar do Estado de Sergipe
          <span>ASTINF · Painel de Gestão</span>
        </footer>
      </main>
    </div>
  );
}
