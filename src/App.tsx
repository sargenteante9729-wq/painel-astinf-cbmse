
import { useState } from 'react';

const setores = [
  'Desenvolvimento de Sistemas',
  'Infraestrutura e Redes',
  'Suporte Técnico',
  'Monitoramento e Indicadores',
  'Gestão de Contratos',
];

export default function App() {
  const [setorSelecionado, setSetorSelecionado] = useState(
    'Visão Geral'
  );

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-symbol">CB</div>
          <div>
            <strong>ASTINF | CBMSE</strong>
            <span>Assessoria de Tecnologia da Informação</span>
          </div>
        </div>
        <span className="status">PAINEL INSTITUCIONAL</span>
      </header>

      <main className="content">
        <section className="welcome">
          <span className="eyebrow">GESTÃO DE TECNOLOGIA</span>
          <h1>Painel ASTINF</h1>
          <p>
            Acompanhamento dos setores, atividades e serviços
            de Tecnologia da Informação do CBMSE.
          </p>
        </section>

        <section className="summary">
          <article className="metric">
            <span>Setores cadastrados</span>
            <strong>{setores.length}</strong>
            <small>Estrutura inicial</small>
          </article>
          <article className="metric">
            <span>Sistemas</span>
            <strong>—</strong>
            <small>Dados a cadastrar</small>
          </article>
          <article className="metric">
            <span>Contratos</span>
            <strong>—</strong>
            <small>Dados a cadastrar</small>
          </article>
        </section>

        <section className="departments">
          <div className="section-heading">
            <div>
              <h2>Setores e áreas de atuação</h2>
              <p>Selecione uma área para consultar.</p>
            </div>
          </div>

          <div className="sector-grid">
            {setores.map((setor, index) => (
              <button
                className={
                  setorSelecionado === setor
                    ? 'sector active'
                    : 'sector'
                }
                key={setor}
                onClick={() => setSetorSelecionado(setor)}
              >
                <span className="sector-number">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <strong>{setor}</strong>
                <span className="sector-action">
                  Consultar área →
                </span>
              </button>
            ))}
          </div>

          <div className="details">
            <span className="eyebrow">ÁREA SELECIONADA</span>
            <h2>{setorSelecionado}</h2>
            <p>
              Esta área está preparada para receber sua descrição,
              equipe, responsabilidades, sistemas e indicadores.
            </p>
          </div>
        </section>

        <footer>
          Corpo de Bombeiros Militar do Estado de Sergipe
          <span>ASTINF · Painel de Gestão</span>
        </footer>
      </main>
    </div>
  );
}
