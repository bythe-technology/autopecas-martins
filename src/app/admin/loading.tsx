export default function AdminLoading() {
  return <main className="admin-content" aria-live="polite" aria-label="Carregando painel"><div className="admin-loading-head" /><div className="admin-loading-grid">{[1,2,3].map((item) => <span key={item} />)}</div><div className="admin-loading-table" /></main>;
}
