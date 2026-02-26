import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSessionById } from '@/lib/db';
import { questions } from '@/data/questions';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileDown } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
import type { DbSession } from '@/lib/db';

const levelColors = {
  low: 'text-success',
  medium: 'text-warning',
  high: 'text-danger',
};

export default function HistoryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<DbSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getSessionById(Number(id)).then((s) => {
      setSession(s || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <AnimatedPage className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </AnimatedPage>
    );
  }

  if (!session) {
    return (
      <AnimatedPage className="flex min-h-screen flex-col items-center justify-center px-4 gap-4">
        <p className="text-lg text-muted-foreground">Triagem não encontrada</p>
        <Button onClick={() => navigate('/historico')} variant="outline" className="rounded-2xl">Voltar</Button>
      </AnimatedPage>
    );
  }

  const date = new Date(session.date);
  const color = levelColors[session.result.level as keyof typeof levelColors] || 'text-foreground';

  return (
    <AnimatedPage className="flex min-h-screen flex-col items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/historico')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-muted"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Detalhes da Triagem</h1>
            <p className="text-xs text-muted-foreground">
              {date.toLocaleDateString('pt-BR')} às {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Result summary */}
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-col items-center">
            <span className={`text-3xl font-bold ${color}`}>{session.result.percentage}%</span>
            <span className="text-xs text-muted-foreground">de risco</span>
          </div>
          <div className="flex-1">
            <p className={`text-lg font-bold ${color}`}>{session.result.title}</p>
            <p className="text-sm text-muted-foreground">{session.result.orientation}</p>
          </div>
        </div>

        {/* User data */}
        {session.userData && (session.userData.age || session.userData.gender || session.userData.city) && (
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <h2 className="text-sm font-bold text-foreground mb-2">Dados do Paciente</h2>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {session.userData.age && <span>Idade: {session.userData.age}</span>}
              {session.userData.gender && <span>Gênero: {session.userData.gender}</span>}
              {session.userData.city && <span>Cidade: {session.userData.city}</span>}
              {session.userData.state && <span>Estado: {session.userData.state}</span>}
            </div>
          </div>
        )}

        {/* Answers */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <h2 className="text-sm font-bold text-foreground mb-3">Respostas</h2>
          <div className="flex flex-col gap-2">
            {questions.map((q, i) => {
              const answer = session.answers.find(a => a.questionIndex === i);
              const answered = answer?.answer;
              return (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                  <span className="text-lg mt-0.5">{q.icon}</span>
                  <p className="flex-1 text-sm text-card-foreground">{q.text}</p>
                  <span className={`text-sm font-semibold ${answered ? 'text-success' : 'text-danger'}`}>
                    {answered ? 'Sim' : 'Não'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Export PDF */}
        <Button
          onClick={() => {
            import('@/lib/generatePDF').then(({ generateResultPDF }) => {
              generateResultPDF(session.result, session.answers, session.userData);
            });
          }}
          variant="outline"
          className="h-14 w-full rounded-2xl text-lg font-semibold"
        >
          <FileDown className="mr-2 h-5 w-5" /> 📄 Baixar PDF
        </Button>
      </div>
    </AnimatedPage>
  );
}
