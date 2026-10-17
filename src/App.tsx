
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { supabase } from './lib/supabase';

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

type SectorRecord = { id: string; name: string; description: string; purpose: string; display_order: number; is_active: boolean };
type ActivityRecord = { id: string; sector_id: string; title: string; description: string; status: 'active' | 'inactive'; display_order: number };
type SystemRecord = { id: string; name: string; description: string; is_active: boolean };
type TeamRecord = { id: string; sector_id: string; display_name: string; role_title: string; is_active: boolean };

export default function App() {
  const [abertura, setAbertura] = useState(true);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [abaDetalhes, setAbaDetalhes] = useState<'informacoes' | 'equipe' | 'atribuicoes' | 'sistemas' | null>(null);
  const [loginAberto, setLoginAberto] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loginErro, setLoginErro] = useState('');
  const [loginCarregando, setLoginCarregando] = useState(false);
  const [usuarioAdmin, setUsuarioAdmin] = useState(false);
  const [setoresBanco, setSetoresBanco] = useState<SectorRecord[]>([]);
  const [atividadesBanco, setAtividadesBanco] = useState<ActivityRecord[]>([]);
  const [sistemasBanco, setSistemasBanco] = useState<SystemRecord[]>([]);
  const [equipeBanco, setEquipeBanco] = useState<TeamRecord[]>([]);
  const [sistemaNome, setSistemaNome] = useState('');
  const [sistemaDescricao, setSistemaDescricao] = useState('');
  const [membroSetor, setMembroSetor] = useState('');
  const [membroNome, setMembroNome] = useState('');
  const [membroFuncao, setMembroFuncao] = useState('');
  const [statusConexao, setStatusConexao] = useState('Verificando conexão com o banco…');
  const [adminSecao, setAdminSecao] = useState<'setores' | 'atividades' | 'sistemas' | 'equipe' | 'chefe' | 'subchefe'>('setores');
  const [setorEditando, setSetorEditando] = useState<string | null>(null);
  const [setorNome, setSetorNome] = useState('');
  const [setorDescricao, setSetorDescricao] = useState('');
  const [setorFinalidade, setSetorFinalidade] = useState('');
  const [setorOrdem, setSetorOrdem] = useState('0');
  const [atividadeSetor, setAtividadeSetor] = useState('');
  const [atividadeTitulo, setAtividadeTitulo] = useState('');
  const [atividadeDescricao, setAtividadeDescricao] = useState('');
  const [atividadeEditando, setAtividadeEditando] = useState<string | null>(null);
  const [sistemaEditando, setSistemaEditando] = useState<string | null>(null);
  const [membroEditando, setMembroEditando] = useState<string | null>(null);
  const [mensagemAdmin, setMensagemAdmin] = useState('');
  const [salvandoItem, setSalvandoItem] = useState(false);
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

  useEffect(() => {
    if (!supabase) { setStatusConexao('Conexão Supabase não configurada.'); return; }
    let ativo = true;
    supabase.from('sectors').select('id,name,description,purpose,display_order,is_active').eq('is_active', true).order('display_order').then(({ data, error }) => {
      if (!ativo) return;
      if (error) setStatusConexao('Falha na leitura de sectors: ' + error.message);
      else { setSetoresBanco((data || []) as SectorRecord[]); setStatusConexao('Conexão ativa · ' + (data?.length || 0) + ' setores lidos do Supabase.'); }
    });
    supabase.from('activities').select('id,sector_id,title,description,status,display_order').eq('status', 'active').order('display_order').then(({ data, error }) => { if (ativo && !error && data) setAtividadesBanco(data as ActivityRecord[]); });
    supabase.from('systems').select('id,name,description,is_active').eq('is_active', true).order('name').then(({ data, error }) => { if (ativo && !error && data) setSistemasBanco(data as SystemRecord[]); });
    supabase.from('team_members').select('id,sector_id,display_name,role_title,is_active').eq('is_active', true).order('display_name').then(({ data, error }) => { if (ativo && !error && data) setEquipeBanco(data as TeamRecord[]); });
    supabase.auth.getSession().then(async ({ data }) => {
      if (!ativo || !data.session?.user) return;
      const { data: papel } = await supabase!.from('user_roles').select('role').eq('user_id', data.session.user.id).maybeSingle();
      if (ativo && papel?.role === 'admin') setUsuarioAdmin(true);
    });
    return () => { ativo = false; };
  }, []);

  const setoresExibidos = setoresBanco.filter((registro) => !/^chefia astinf$/i.test(registro.name.trim())).length ? setoresBanco.filter((registro) => !/^chefia astinf$/i.test(registro.name.trim())).map((registro) => {
    const local = setores.find((item) => item.nome.toLowerCase() === registro.name.toLowerCase());
    const atividadesSetor = atividadesBanco.filter((atividade) => atividade.sector_id === registro.id);
    return { nome: registro.name, descricao: registro.description || local?.descricao || '', imagem: local?.imagem || setores[0].imagem, cor: local?.cor || '#58a6ff', atribuicoes: atividadesBanco.length ? atividadesSetor.length : (local?.atribuicoes || 0), detalhes: atividadesBanco.length ? atividadesSetor.map((atividade) => atividade.title) : (local?.detalhes || []), atividadesSetor, id: registro.id };
  }) : setores;
  const setorAtual = setoresExibidos.find((setor) => setor.nome === selecionado);

  async function entrarAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoginErro('');
    if (!supabase) { setLoginErro('A conexão ainda não está configurada.'); return; }
    setLoginCarregando(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha });
    if (error || !data.user) { setLoginErro('Não foi possível entrar. Confira o e-mail e a senha.'); setLoginCarregando(false); return; }
    const { data: papel, error: erroPapel } = await supabase.from('user_roles').select('role').eq('user_id', data.user.id).maybeSingle();
    if (erroPapel || papel?.role !== 'admin') { await supabase.auth.signOut(); setLoginErro('Este usuário não possui autorização administrativa.'); setLoginCarregando(false); return; }
    setUsuarioAdmin(true); setLoginAberto(false); setSenha(''); setLoginCarregando(false);
  }
  async function sairAdmin() { await supabase?.auth.signOut(); setUsuarioAdmin(false); }

  function editarAtividade(atividade: ActivityRecord) {
    setAdminSecao('atividades'); setAtividadeEditando(atividade.id); setAtividadeSetor(atividade.sector_id); setAtividadeTitulo(atividade.title); setAtividadeDescricao(atividade.description || ''); setMensagemAdmin('Editando atividade: ' + atividade.title);
  }

  function editarSetor(setor: SectorRecord) {
    setAdminSecao('setores'); setSetorEditando(setor.id); setSetorNome(setor.name); setSetorDescricao(setor.description || ''); setSetorFinalidade(setor.purpose || ''); setSetorOrdem(String(setor.display_order)); setMensagemAdmin('Editando card visual: ' + setor.name);
  }
  async function salvarSetor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!supabase || !usuarioAdmin || !setorEditando) return;
    setSalvandoItem(true); setMensagemAdmin('');
    const { error } = await supabase.from('sectors').update({ name: setorNome.trim(), description: setorDescricao.trim(), purpose: setorFinalidade.trim(), display_order: Number(setorOrdem) || 0 }).eq('id', setorEditando);
    if (error) setMensagemAdmin('Não foi possível alterar o card: ' + error.message);
    else { setMensagemAdmin('Card do setor alterado com sucesso.'); setSetorEditando(null); setSetorNome(''); setSetorDescricao(''); setSetorFinalidade(''); setSetorOrdem('0'); const { data } = await supabase.from('sectors').select('id,name,description,purpose,display_order,is_active').eq('is_active', true).order('display_order'); if (data) setSetoresBanco(data as SectorRecord[]); }
    setSalvandoItem(false);
  }
  async function excluirSetor(setor: SectorRecord) {
    if (!supabase || !usuarioAdmin || !window.confirm('Excluir o card do setor "' + setor.name + '"? O banco impedirá a exclusão se houver atividades ou integrantes vinculados.')) return;
    setSalvandoItem(true); setMensagemAdmin('');
    const { error } = await supabase.from('sectors').delete().eq('id', setor.id);
    if (error) setMensagemAdmin('Não foi possível excluir o setor. Verifique se existem atividades ou integrantes vinculados. Detalhe: ' + error.message);
    else { setMensagemAdmin('Card do setor excluído.'); setSetoresBanco((items) => items.filter((item) => item.id !== setor.id)); if (selecionado === setor.name) setSelecionado(null); }
    setSalvandoItem(false);
  }

  async function excluirAtividade(atividade: ActivityRecord) {
    if (!supabase || !usuarioAdmin) return;
    const confirmar = window.confirm('Deseja realmente excluir a atividade "' + atividade.title + '"? Esta ação não pode ser desfeita.');
    if (!confirmar) return;
    setMensagemAdmin('');
    setSalvandoItem(true);
    const { error } = await supabase.from('activities').delete().eq('id', atividade.id);
    if (error) {
      setMensagemAdmin('Não foi possível excluir a atividade: ' + error.message);
    } else {
      setAtividadesBanco((atuais) => atuais.filter((item) => item.id !== atividade.id));
      setMensagemAdmin('Atividade excluída com sucesso.');
    }
    setSalvandoItem(false);
  }

  async function recarregarSistemas() {
    if (!supabase) return;
    const { data, error } = await supabase.from('systems').select('id,name,description,is_active').eq('is_active', true).order('name');
    if (!error && data) setSistemasBanco(data as SystemRecord[]);
  }
  function editarSistema(sistema: SystemRecord) {
    setAdminSecao('sistemas'); setSistemaEditando(sistema.id); setSistemaNome(sistema.name); setSistemaDescricao(sistema.description || ''); setMensagemAdmin('Editando sistema: ' + sistema.name);
  }
  async function cadastrarSistema(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!supabase || !usuarioAdmin) return;
    setSalvandoItem(true); setMensagemAdmin('');
    const dados = { name: sistemaNome.trim(), description: sistemaDescricao.trim(), is_active: true };
    const { error } = sistemaEditando ? await supabase.from('systems').update(dados).eq('id', sistemaEditando) : await supabase.from('systems').insert(dados);
    if (error) setMensagemAdmin('Não foi possível salvar o sistema: ' + error.message);
    else { setMensagemAdmin(sistemaEditando ? 'Sistema alterado com sucesso.' : 'Sistema cadastrado com sucesso.'); setSistemaNome(''); setSistemaDescricao(''); setSistemaEditando(null); await recarregarSistemas(); }
    setSalvandoItem(false);
  }
  async function excluirSistema(sistema: SystemRecord) {
    if (!supabase || !usuarioAdmin || !window.confirm('Excluir o sistema ' + sistema.name + '?')) return;
    setSalvandoItem(true); setMensagemAdmin('');
    const { error } = await supabase.from('systems').delete().eq('id', sistema.id);
    if (error) setMensagemAdmin('Não foi possível excluir o sistema: ' + error.message); else { setMensagemAdmin('Sistema excluído.'); await recarregarSistemas(); }
    setSalvandoItem(false);
  }
  async function recarregarEquipe() {
    if (!supabase) return;
    const { data, error } = await supabase.from('team_members').select('id,sector_id,display_name,role_title,is_active').eq('is_active', true).order('display_name');
    if (!error && data) setEquipeBanco(data as TeamRecord[]);
  }
  function editarMembro(membro: TeamRecord) {
    setAdminSecao('equipe'); setMembroEditando(membro.id); setMembroSetor(membro.sector_id); setMembroNome(membro.display_name); setMembroFuncao(membro.role_title || ''); setMensagemAdmin('Editando integrante: ' + membro.display_name);
  }
  function editarLideranca(tipo: 'chefe' | 'subchefe') {
    const funcaoEsperada = tipo === 'chefe' ? 'Chefe da ASTINF' : 'Subchefe da ASTINF';
    const membro = equipeBanco.find((item) => {
      const nomeSetor = setoresBanco.find((setor) => setor.id === item.sector_id)?.name || '';
      return /^chefia astinf$/i.test(nomeSetor.trim()) &&
        (item.role_title || '').trim().toLowerCase() === funcaoEsperada.toLowerCase();
    });
    setAdminSecao(tipo);
    if (membro) {
      setMembroEditando(membro.id); setMembroSetor(membro.sector_id); setMembroNome(membro.display_name); setMembroFuncao(tipo === 'chefe' ? 'Chefe da ASTINF' : 'Subchefe da ASTINF');
      setMensagemAdmin('Editando ' + (tipo === 'chefe' ? 'Chefe' : 'Subchefe') + ' da ASTINF.');
    } else {
      setMembroEditando(null); setMembroSetor(''); setMembroNome(''); setMembroFuncao(tipo === 'chefe' ? 'Chefe da ASTINF' : 'Subchefe da ASTINF');
      setMensagemAdmin('Cadastre o nome para ' + (tipo === 'chefe' ? 'Chefe' : 'Subchefe') + ' da ASTINF e salve.');
    }
    document.querySelector('.admin-manager')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  async function limparRegistrosAnteriores() {
    if (!supabase || !usuarioAdmin) return;
    const confirmar = window.confirm('Excluir TODOS os registros atuais da tabela de equipe, incluindo os registros de Chefe e Subchefe? Esta ação não pode ser desfeita. Os cadastros poderão ser refeitos depois.');
    if (!confirmar) return;
    setSalvandoItem(true); setMensagemAdmin('');
    const { error } = await supabase.from('team_members').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) setMensagemAdmin('Não foi possível excluir os registros anteriores: ' + error.message);
    else { setEquipeBanco([]); setMembroEditando(null); setMembroSetor(''); setMembroNome(''); setMembroFuncao(''); setMensagemAdmin('Registros anteriores de equipe e chefia excluídos.'); }
    setSalvandoItem(false);
  }

  async function cadastrarMembro(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!supabase || !usuarioAdmin) return;
    setSalvandoItem(true); setMensagemAdmin('');
    let setorDestino = membroSetor;
    const funcaoChefia = /^(chefe da astinf|subchefe da astinf)$/i.test(membroFuncao.trim());
    if (funcaoChefia) {
      let { data: setorChefia } = await supabase.from('sectors').select('id').eq('name', 'CHEFIA ASTINF').maybeSingle();
      if (!setorChefia) {
        const { data: novoSetor, error: erroSetor } = await supabase.from('sectors').insert({
          name: 'CHEFIA ASTINF',
          description: 'Funções independentes da chefia da Assessoria',
          purpose: 'Cadastro administrativo interno da chefia da ASTINF',
          display_order: 999,
          is_active: true
        }).select('id').single();
        if (erroSetor || !novoSetor) {
          setMensagemAdmin('Não foi possível criar o cadastro independente da chefia: ' + (erroSetor?.message || 'erro desconhecido'));
          setSalvandoItem(false);
          return;
        }
        setorChefia = novoSetor;
        const { data: setoresAtualizados } = await supabase.from('sectors').select('id,name,description,purpose,display_order,is_active').eq('is_active', true).order('display_order');
        if (setoresAtualizados) setSetoresBanco(setoresAtualizados as SectorRecord[]);
      }
      setorDestino = setorChefia.id;
    }
    const dados = { sector_id: setorDestino, display_name: membroNome.trim(), role_title: membroFuncao.trim(), is_active: true };
    const { error } = membroEditando ? await supabase.from('team_members').update(dados).eq('id', membroEditando) : await supabase.from('team_members').insert(dados);
    if (error) setMensagemAdmin('Não foi possível salvar o integrante: ' + error.message);
    else { setMensagemAdmin(membroEditando ? 'Integrante alterado com sucesso.' : 'Integrante cadastrado com sucesso.'); setMembroNome(''); setMembroFuncao(''); setMembroSetor(''); setMembroEditando(null); await recarregarEquipe(); }
    setSalvandoItem(false);
  }
  async function excluirMembro(membro: TeamRecord) {
    if (!supabase || !usuarioAdmin || !window.confirm('Excluir ' + membro.display_name + ' da equipe?')) return;
    setSalvandoItem(true); setMensagemAdmin('');
    const { error } = await supabase.from('team_members').delete().eq('id', membro.id);
    if (error) setMensagemAdmin('Não foi possível excluir o integrante: ' + error.message); else { setMensagemAdmin('Integrante excluído.'); await recarregarEquipe(); }
    setSalvandoItem(false);
  }

  async function cadastrarAtividade(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMensagemAdmin('');
    if (!supabase || !usuarioAdmin) return;
    setSalvandoItem(true);
    const dados = { sector_id: atividadeSetor, title: atividadeTitulo.trim(), description: atividadeDescricao.trim(), status: 'active' as const, display_order: 0 };
    const { error } = atividadeEditando ? await supabase.from('activities').update(dados).eq('id', atividadeEditando) : await supabase.from('activities').insert(dados);
    if (error) setMensagemAdmin('Não foi possível cadastrar: ' + error.message);
    else {
      setMensagemAdmin(atividadeEditando ? 'Atividade alterada com sucesso.' : 'Atividade cadastrada com sucesso. Ela já foi adicionada ao painel.');
      const { data: atualizadas } = await supabase.from('activities').select('id,sector_id,title,description,status,display_order').eq('status', 'active').order('display_order');
      if (atualizadas) setAtividadesBanco(atualizadas as ActivityRecord[]);
      setAtividadeTitulo('');
      setAtividadeDescricao('');
      setAtividadeSetor('');
      setAtividadeEditando(null);
    }
    setSalvandoItem(false);
  }


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
        {!usuarioAdmin && <button
          type="button"
          className="header-admin-hotspot"
          aria-label="Acessar a área administrativa pelo botão Painel de Gestão"
          title="Painel de Gestão"
          onClick={() => { setLoginErro(''); setLoginAberto(true); }}
        />}
      </header>

      <main className="main-content">
        <section className="sector-section">
          <div className="section-title">
            <div><h2>▦ &nbsp; ORGANOGRAMA DO SETOR</h2></div>
            <div className="admin-actions">
              {usuarioAdmin && <><span className="admin-connected">Administrador conectado</span><button className="admin-entry" type="button" onClick={sairAdmin}>Sair</button></>}
            </div>
          </div>
          <p className="connection-note" role="status">{statusConexao}</p>
          {usuarioAdmin && <section className="admin-manager" aria-label="Gerenciar conteúdo do painel">
            <div className="admin-manager-heading"><div><span className="admin-modal-kicker">PAINEL DE CONTROLE</span><h3>Gerenciar conteúdo</h3><p>Cadastre informações que serão armazenadas no Supabase.</p></div></div>
            <div className="admin-manager-tabs">
              <button type="button" className={adminSecao === 'setores' ? 'active' : ''} onClick={() => setAdminSecao('setores')}>Cards / setores</button>
              <button type="button" className={adminSecao === 'atividades' ? 'active' : ''} onClick={() => setAdminSecao('atividades')}>Atribuições / atividades</button>
              <button type="button" className={adminSecao === 'sistemas' ? 'active' : ''} onClick={() => setAdminSecao('sistemas')}>Sistemas</button>
              <button type="button" className={adminSecao === 'equipe' ? 'active' : ''} onClick={() => setAdminSecao('equipe')}>Equipe</button>
              <button type="button" className={adminSecao === 'chefe' ? 'active' : ''} onClick={() => { setAdminSecao('chefe'); setMensagemAdmin(''); }}>Chefe da ASTINF</button>
              <button type="button" className={adminSecao === 'subchefe' ? 'active' : ''} onClick={() => { setAdminSecao('subchefe'); setMensagemAdmin(''); }}>Subchefe da ASTINF</button>
            </div>
            {adminSecao === 'setores' && <>
              <p className="connection-note">Edite os dados e a ordem de exibição dos cards dos setores. Para cadastrar ou alterar o Chefe e o Subchefe da ASTINF, utilize as abas específicas acima.</p>
              <div className="admin-record-list">
                <article className="admin-record"><div><strong>Limpeza de registros anteriores</strong><p>Remove os registros antigos de equipe e chefia do banco. A operação exige confirmação.</p></div><div className="admin-record-actions"><button type="button" className="activity-delete-button" disabled={salvandoItem} onClick={limparRegistrosAnteriores}>Excluir registros anteriores</button></div></article>
              </div>
              {setorEditando && <form className="admin-content-form" onSubmit={salvarSetor}>
                <label>Nome do setor<input value={setorNome} onChange={(event) => setSetorNome(event.target.value)} required maxLength={100} /></label>
                <label>Texto exibido no card<input value={setorDescricao} onChange={(event) => setSetorDescricao(event.target.value)} required maxLength={200} /></label>
                <label>Finalidade do setor<textarea value={setorFinalidade} onChange={(event) => setSetorFinalidade(event.target.value)} rows={2} /></label>
                <label>Ordem de exibição<input type="number" value={setorOrdem} onChange={(event) => setSetorOrdem(event.target.value)} /></label>
                {mensagemAdmin && <p className={mensagemAdmin.includes('sucesso') ? 'admin-success' : 'admin-login-error'} role="status">{mensagemAdmin}</p>}
                <div className="admin-form-actions"><button type="submit" disabled={salvandoItem}>{salvandoItem ? 'Salvando…' : 'Salvar alterações do card'}</button><button type="button" className="admin-cancel-edit" onClick={() => { setSetorEditando(null); setMensagemAdmin('Edição cancelada.'); }}>Cancelar</button></div>
              </form>}
              <div className="admin-record-list">{setoresBanco.map((setor) => <article className="admin-record" key={setor.id}><div><strong>{setor.name}</strong><p>{setor.description || 'Sem descrição.'} · Ordem {setor.display_order}</p></div><div className="admin-record-actions"><button type="button" className="admin-edit-button" disabled={salvandoItem} onClick={() => editarSetor(setor)}>Editar card</button><button type="button" className="activity-delete-button" disabled={salvandoItem} onClick={() => excluirSetor(setor)}>Excluir card</button></div></article>)}</div>
            </>}
            {adminSecao === 'atividades' && <form className="admin-content-form" onSubmit={cadastrarAtividade}>
              <label>Setor<select value={atividadeSetor} onChange={(event) => setAtividadeSetor(event.target.value)} required><option value="">Selecione o setor</option>{setoresBanco.map((setor) => <option key={setor.id} value={setor.id}>{setor.name}</option>)}</select></label>
              <label>Nome da atividade<input value={atividadeTitulo} onChange={(event) => setAtividadeTitulo(event.target.value)} required maxLength={160} placeholder="Ex.: Fiscalização de contratos" /></label>
              <label>Descrição<textarea value={atividadeDescricao} onChange={(event) => setAtividadeDescricao(event.target.value)} rows={3} placeholder="Descreva a atribuição ou atividade" /></label>
              {mensagemAdmin && <p className={mensagemAdmin.includes('sucesso') ? 'admin-success' : 'admin-login-error'} role="status">{mensagemAdmin}</p>}
              <div className="admin-form-actions"><button type="submit" disabled={salvandoItem || setoresBanco.length === 0}>{salvandoItem ? 'Salvando…' : atividadeEditando ? 'Salvar alterações' : 'Cadastrar atividade'}</button>{atividadeEditando && <button type="button" className="admin-cancel-edit" onClick={() => { setAtividadeEditando(null); setAtividadeSetor(''); setAtividadeTitulo(''); setAtividadeDescricao(''); setMensagemAdmin('Edição cancelada.'); }}>Cancelar edição</button>}</div>
            </form>}
            {adminSecao === 'sistemas' && <>
              <form className="admin-content-form" onSubmit={cadastrarSistema}>
                <label>Nome do sistema<input value={sistemaNome} onChange={(event) => setSistemaNome(event.target.value)} required maxLength={120} placeholder="Ex.: Sistema de Boletins" /></label>
                <label>Descrição<input value={sistemaDescricao} onChange={(event) => setSistemaDescricao(event.target.value)} placeholder="Finalidade do sistema" /></label>
                {mensagemAdmin && <p className={mensagemAdmin.includes('sucesso') || mensagemAdmin.includes('excluído') ? 'admin-success' : 'admin-login-error'} role="status">{mensagemAdmin}</p>}
                <div className="admin-form-actions"><button type="submit" disabled={salvandoItem}>{salvandoItem ? 'Salvando…' : sistemaEditando ? 'Salvar alterações' : 'Cadastrar sistema'}</button>{sistemaEditando && <button type="button" className="admin-cancel-edit" onClick={() => { setSistemaEditando(null); setSistemaNome(''); setSistemaDescricao(''); setMensagemAdmin('Edição cancelada.'); }}>Cancelar edição</button>}</div>
              </form>
              <div className="admin-record-list">{sistemasBanco.map((sistema) => <article className="admin-record" key={sistema.id}><div><strong>{sistema.name}</strong><p>{sistema.description || 'Sem descrição.'}</p></div><div className="admin-record-actions"><button type="button" className="admin-edit-button" disabled={salvandoItem} onClick={() => editarSistema(sistema)}>Editar</button><button type="button" className="activity-delete-button" disabled={salvandoItem} onClick={() => excluirSistema(sistema)}>Excluir</button></div></article>)}{sistemasBanco.length === 0 && <p className="connection-note">Nenhum sistema cadastrado.</p>}</div>
            </>}
            {(adminSecao === 'chefe' || adminSecao === 'subchefe') && <>
              {(() => {
                const tipo = adminSecao;
                const funcao = tipo === 'chefe' ? 'Chefe da ASTINF' : 'Subchefe da ASTINF';
                const membro = equipeBanco.find((m) => (m.role_title || '').trim().toLowerCase() === funcao.toLowerCase() && /^chefia astinf$/i.test(setoresBanco.find((s) => s.id === m.sector_id)?.name || ''));
                return <>
                  <p className="connection-note">Cadastre ou altere o responsável pela função selecionada. Este registro é independente da equipe dos setores.</p>
                  <article className="admin-record"><div><strong>{funcao}</strong><p>{membro?.display_name || 'Nome não cadastrado'}</p></div><div className="admin-record-actions"><button type="button" className="admin-edit-button" disabled={salvandoItem} onClick={() => editarLideranca(tipo)}>Cadastrar / alterar</button></div></article>
                  {(mensagemAdmin.startsWith('Editando Chefe') || mensagemAdmin.startsWith('Editando Subchefe') || mensagemAdmin.startsWith('Cadastre o nome')) && <form className="admin-content-form" onSubmit={cadastrarMembro}>
                    <h4>{membroEditando ? 'Alterar responsável' : 'Cadastrar responsável'}</h4>
                    <label>Nome completo<input value={membroNome} onChange={(event) => setMembroNome(event.target.value)} required maxLength={140} placeholder="Nome completo" /></label>
                    {mensagemAdmin && <p className={mensagemAdmin.includes('sucesso') ? 'admin-success' : 'admin-login-error'} role="status">{mensagemAdmin}</p>}
                    <div className="admin-form-actions"><button type="submit" disabled={salvandoItem || !membroNome.trim()}>{salvandoItem ? 'Salvando…' : 'Salvar responsável'}</button><button type="button" className="admin-cancel-edit" onClick={() => { setMembroEditando(null); setMembroSetor(''); setMembroNome(''); setMembroFuncao(''); setMensagemAdmin('Edição cancelada.'); }}>Cancelar</button></div>
                  </form>}
                </>;
              })()}
            </>}
            {adminSecao === 'equipe' && <>
              <form className="admin-content-form" onSubmit={cadastrarMembro}>
                <label>Setor<select value={membroSetor} onChange={(event) => setMembroSetor(event.target.value)} required><option value="">Selecione o setor</option>{setoresBanco.map((setor) => <option key={setor.id} value={setor.id}>{setor.name}</option>)}</select></label>
                <label>Nome do integrante<input value={membroNome} onChange={(event) => setMembroNome(event.target.value)} required maxLength={140} placeholder="Nome completo" /></label>
                <label>Função / cargo<input value={membroFuncao} onChange={(event) => setMembroFuncao(event.target.value)} maxLength={140} placeholder="Ex.: Chefe do setor" /></label>
                {mensagemAdmin && <p className={mensagemAdmin.includes('sucesso') || mensagemAdmin.includes('excluído') ? 'admin-success' : 'admin-login-error'} role="status">{mensagemAdmin}</p>}
                <div className="admin-form-actions"><button type="submit" disabled={salvandoItem || setoresBanco.length === 0}>{salvandoItem ? 'Salvando…' : membroEditando ? 'Salvar alterações' : 'Cadastrar integrante'}</button>{membroEditando && <button type="button" className="admin-cancel-edit" onClick={() => { setMembroEditando(null); setMembroSetor(''); setMembroNome(''); setMembroFuncao(''); setMensagemAdmin('Edição cancelada.'); }}>Cancelar edição</button>}</div>
              </form>
              <div className="admin-record-list">{equipeBanco.filter((membro) => !/^chefia astinf$/i.test(setoresBanco.find((setor) => setor.id === membro.sector_id)?.name || '')).map((membro) => <article className="admin-record" key={membro.id}><div><strong>{membro.display_name}</strong><p>{membro.role_title || 'Sem função informada'} · {/chefe|subchefe|sub-chefe|adjunto/i.test(membro.role_title || '') ? 'Chefia da ASTINF (função independente dos setores)' : setoresBanco.find((setor) => setor.id === membro.sector_id)?.name || 'Setor'}</p></div><div className="admin-record-actions"><button type="button" className="admin-edit-button" disabled={salvandoItem} onClick={() => editarMembro(membro)}>Editar</button><button type="button" className="activity-delete-button" disabled={salvandoItem} onClick={() => excluirMembro(membro)}>Excluir</button></div></article>)}{equipeBanco.length === 0 && <p className="connection-note">Nenhum integrante cadastrado.</p>}</div>
            </>}
          </section>}

          {!selecionado && (
          <div className="org-chart">
            <div className="org-leadership" aria-label="Comando da ASTINF">
              <article className="org-leader-card org-chief">
                <img className="org-leader-image" src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=700&q=80" alt="" />
                <div className="org-leader-label">CHEFE</div>
                <p>{equipeBanco.find((membro) => /^chefia astinf$/i.test(setoresBanco.find((setor) => setor.id === membro.sector_id)?.name || '') && /^chefe da astinf$/i.test((membro.role_title || '').trim()))?.display_name || 'Nome não cadastrado'}</p>
                <small>{equipeBanco.find((membro) => /^chefia astinf$/i.test(setoresBanco.find((setor) => setor.id === membro.sector_id)?.name || '') && /^chefe da astinf$/i.test((membro.role_title || '').trim()))?.role_title || 'Responsável pela Assessoria'}</small>
                {usuarioAdmin && <button type="button" className="org-edit-button" onClick={() => editarLideranca('chefe')}>Editar Chefe</button>}
              </article>
              <article className="org-leader-card org-deputy">
                <img className="org-leader-image" src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=700&q=80" alt="" />
                <div className="org-leader-label">SUBCHEFE</div>
                <p>{equipeBanco.find((membro) => /^chefia astinf$/i.test(setoresBanco.find((setor) => setor.id === membro.sector_id)?.name || '') && /^subchefe da astinf$/i.test((membro.role_title || '').trim()))?.display_name || 'Nome não cadastrado'}</p>
                <small>{equipeBanco.find((membro) => /^chefia astinf$/i.test(setoresBanco.find((setor) => setor.id === membro.sector_id)?.name || '') && /^subchefe da astinf$/i.test((membro.role_title || '').trim()))?.role_title || 'Apoio à chefia e coordenação'}</small>
                {usuarioAdmin && <button type="button" className="org-edit-button" onClick={() => editarLideranca('subchefe')}>Editar Subchefe</button>}
              </article>
            </div>
            <div className="org-connector" aria-hidden="true"><span>ESTRUTURA ORGANIZACIONAL</span></div>
            <div className="sector-grid">

            {setoresExibidos.map((setor, index) => (
              <button
                key={setor.nome}
                className={`sector-card ${selecionado === setor.nome ? 'selected' : ''}`}
                style={{ '--sector-color': setor.cor } as CSSProperties}
                onClick={() => {
                  setSelecionado(setor.nome);
                  setAbaDetalhes(null);
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

          <div className="detail-option-cards" role="group" aria-label="Conteúdo do setor">
            <button type="button" className={`detail-option-card ${abaDetalhes === 'informacoes' ? 'active' : ''}`} aria-pressed={abaDetalhes === 'informacoes'} onClick={() => setAbaDetalhes(abaDetalhes === 'informacoes' ? null : 'informacoes')}>
              <img className="detail-option-image" src={setoresExibidos.find((item) => item.nome === setorAtual.nome)?.imagem || setores[0].imagem} alt="" />
              <span className="detail-option-content"><span className="option-kicker">SETOR / ASTINF</span><span className="option-copy"><strong>Informações do setor</strong><small>Descrição e finalidade do setor</small></span><span className="option-footer"><span>{abaDetalhes === 'informacoes' ? 'Ocultar informações' : 'Ver informações'}</span><span>→</span></span></span>
            </button>
            <button type="button" className={`detail-option-card ${abaDetalhes === 'equipe' ? 'active' : ''}`} aria-pressed={abaDetalhes === 'equipe'} onClick={() => setAbaDetalhes(abaDetalhes === 'equipe' ? null : 'equipe')}>
              <img className="detail-option-image" src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=700&q=80" alt="" />
              <span className="detail-option-content"><span className="option-kicker">EQUIPE</span><span className="option-copy"><strong>Responsáveis e equipe</strong><small>Integrantes e funções vinculados ao setor</small></span><span className="option-footer"><span>{abaDetalhes === 'equipe' ? 'Ocultar equipe' : 'Ver equipe'}</span><span>→</span></span></span>
            </button>
            <button type="button" className={`detail-option-card ${abaDetalhes === 'atribuicoes' ? 'active' : ''}`} aria-pressed={abaDetalhes === 'atribuicoes'} onClick={() => setAbaDetalhes(abaDetalhes === 'atribuicoes' ? null : 'atribuicoes')}>
              <img className="detail-option-image" src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=700&q=80" alt="" />
              <span className="detail-option-content"><span className="option-kicker">ROTINAS E RESPONSABILIDADES</span><span className="option-copy"><strong>Atribuições</strong><small>{setorAtual.detalhes.length} itens cadastrados para este setor</small></span><span className="option-footer"><span>{abaDetalhes === 'atribuicoes' ? 'Ocultar atribuições' : 'Ver atribuições'}</span><span>→</span></span></span>
            </button>
            {setorAtual.nome.toLowerCase() === 'desenvolvimento' && <button type="button" className={`detail-option-card ${abaDetalhes === 'sistemas' ? 'active' : ''}`} aria-pressed={abaDetalhes === 'sistemas'} onClick={() => setAbaDetalhes(abaDetalhes === 'sistemas' ? null : 'sistemas')}>
              <img className="detail-option-image" src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=700&q=80" alt="" />
              <span className="detail-option-content"><span className="option-kicker">CATÁLOGO DE TI</span><span className="option-copy"><strong>Sistemas</strong><small>Sistemas de desenvolvimento e sustentação</small></span><span className="option-footer"><span>{abaDetalhes === 'sistemas' ? 'Ocultar sistemas' : 'Ver sistemas'}</span><span>→</span></span></span>
            </button>}
          </div>

          {abaDetalhes && <div className="detail-subcards">
            {abaDetalhes === 'informacoes' && <article className="detail-subcard overview-info-card">
              <img className="overview-card-image" src={setoresExibidos.find((item) => item.nome === setorAtual.nome)?.imagem || setores[0].imagem} alt="" />
              <div className="overview-card-content"><span className="subcard-kicker">SETOR / ASTINF</span><h3>Sobre o setor</h3><p>{setorAtual.descricao}. Esta área reúne as informações e atividades relacionadas a {setorAtual.nome}.</p><span className="overview-card-footer">Finalidade e informações do setor <span>→</span></span></div>
            </article>}
            {abaDetalhes === 'equipe' && <article className="detail-subcard overview-info-card">
              <img className="overview-card-image" src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=700&q=80" alt="" />
              <div className="overview-card-content"><span className="subcard-kicker">EQUIPE</span><h3>Responsáveis e equipe</h3>{equipeBanco.filter((membro) => membro.sector_id === (setorAtual as typeof setorAtual & { id?: string }).id && !/^chefe da astinf$|^chefe da assessoria$|^subchefe da astinf$|^subchefe da assessoria$/i.test((membro.role_title || '').trim())).length ? <ul className="team-member-list">{equipeBanco.filter((membro) => membro.sector_id === (setorAtual as typeof setorAtual & { id?: string }).id && !/^chefe da astinf$|^chefe da assessoria$|^subchefe da astinf$|^subchefe da assessoria$/i.test((membro.role_title || '').trim())).map((membro) => <li key={membro.id}><strong>{membro.display_name}</strong>{membro.role_title && <span>{membro.role_title}</span>}</li>)}</ul> : <p>Não há integrantes cadastrados para este setor.</p>}</div>
            </article>}
            {abaDetalhes === 'atribuicoes' && (setorAtual as typeof setorAtual & { atividadesSetor?: ActivityRecord[] }).atividadesSetor?.length ? (setorAtual as typeof setorAtual & { atividadesSetor?: ActivityRecord[] }).atividadesSetor!.map((atividade, index) => <article className="detail-subcard assignment-subcard" key={atividade.id}><span className="subcard-kicker">ATRIBUIÇÃO {String(index + 1).padStart(2, '0')}</span><h3>{atividade.title}</h3><p>{atividade.description || 'Atividade vinculada ao setor de ' + setorAtual.nome + '.'}</p>{usuarioAdmin && <div className="admin-record-actions"><button type="button" className="admin-edit-button" disabled={salvandoItem} onClick={() => editarAtividade(atividade)}>Editar</button><button type="button" className="activity-delete-button" disabled={salvandoItem} onClick={() => excluirAtividade(atividade)}>Excluir atividade</button></div>}</article>) : abaDetalhes === 'atribuicoes' ? <p className="connection-note">Nenhuma atribuição cadastrada para este setor.</p> : null}
            {abaDetalhes === 'sistemas' && <article className="detail-subcard development-systems-subcard"><span className="subcard-kicker">CATÁLOGO DE TI</span><h3>Sistemas</h3><p>Sistemas cadastrados para desenvolvimento e sustentação pela ASTINF.</p>{sistemasBanco.length > 0 ? <ul className="development-systems-list">{sistemasBanco.map((sistema) => <li key={sistema.id}><strong>{sistema.name}</strong>{sistema.description && <span>{sistema.description}</span>}</li>)}</ul> : <p className="connection-note">Nenhum sistema cadastrado.</p>}</article>}
          </div>}
        </section>
        )}

        {loginAberto && <div className="admin-modal-backdrop" role="presentation" onClick={() => setLoginAberto(false)}>
          <section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-login-title" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="admin-modal-close" aria-label="Fechar" onClick={() => setLoginAberto(false)}>×</button>
            <span className="admin-modal-kicker">ASTINF · ACESSO RESTRITO</span><h2 id="admin-login-title">Área administrativa</h2>
            <p>Entre com o e-mail e a senha cadastrados no Supabase.</p>
            <form onSubmit={entrarAdmin} className="admin-login-form">
              <label>E-mail<input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
              <label>Senha<input type="password" autoComplete="current-password" value={senha} onChange={(event) => setSenha(event.target.value)} required /></label>
              {loginErro && <p className="admin-login-error" role="alert">{loginErro}</p>}
              <button type="submit" disabled={loginCarregando}>{loginCarregando ? "Verificando acesso…" : "Entrar"}</button>
            </form>
          </section>
        </div>}

        <footer className="footer">
          Corpo de Bombeiros Militar do Estado de Sergipe
          <span>ASTINF · Painel de Gestão</span>
        </footer>
      </main>
    </div>
  );
}
