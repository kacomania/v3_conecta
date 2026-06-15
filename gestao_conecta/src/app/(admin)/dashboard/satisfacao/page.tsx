import { getCsatMetrics, getLatestFeedbacks } from '@/actions/csat'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import SentimentDonut from './SentimentDonut'
import { PageHeader } from '@/components/page-header'

export default async function SatisfacaoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null;

  const { data: userRole } = await supabase
    .from('user_roles')
    .select('prefeitura_id, roles(access_level)')
    .eq('user_id', user.id)
    .single()
    
  if (!userRole?.prefeitura_id) return <div className="p-8 text-red-600">Erro: Prefeitura não encontrada.</div>;

  const prefeituraId = userRole.prefeitura_id;

  const metrics = await getCsatMetrics(prefeituraId)
  const feedbacks = await getLatestFeedbacks(prefeituraId, 50)

  const globalAvg = metrics.global_average ? Number(metrics.global_average).toFixed(1) : '0.0';
  const totalReviews = metrics.total_reviews || 0;
  const sentimentCounts = metrics.sentiment_counts || { positive: 0, neutral: 0, negative: 0 };

  return (
    <div className="space-y-8 font-inter text-[#1b1c1c]">
      <div className="mb-8">
        <PageHeader title="Satisfação (CSAT)" />
        <p className="text-[#434750] mt-1">Visão geral das avaliações e feedback dos cidadãos.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col rounded-lg border border-[#e4e2e1] bg-white p-6 shadow-sm">
          <span className="text-sm font-medium text-[#8e8b8a]">Nota Média</span>
          <span className="mt-2 text-3xl font-bold text-[#00254d]">
            {totalReviews > 0 ? `${globalAvg} / 5.0` : 'Sem avaliações'}
          </span>
        </div>
        <div className="flex flex-col rounded-lg border border-[#e4e2e1] bg-white p-6 shadow-sm">
          <span className="text-sm font-medium text-[#8e8b8a]">Total de Avaliações</span>
          <span className="mt-2 text-3xl font-bold text-[#00254d]">{totalReviews}</span>
        </div>
        <div className="flex flex-col rounded-lg border border-[#e4e2e1] bg-white p-6 shadow-sm">
          <span className="text-sm font-medium text-[#8e8b8a]">Humor da População</span>
          <div className="mt-2 flex-1">
            <SentimentDonut 
              positive={sentimentCounts.positive} 
              neutral={sentimentCounts.neutral} 
              negative={sentimentCounts.negative} 
            />
          </div>
        </div>
      </div>

      {/* Feedbacks */}
      <div className="flex flex-col rounded-lg border border-[#e4e2e1] bg-white shadow-sm overflow-hidden">
        <div className="border-b border-[#e4e2e1] px-6 py-4 bg-[#fbf9f8]">
          <h2 className="text-lg font-semibold text-[#00254d]">Últimos Comentários</h2>
        </div>
        
        {feedbacks.length === 0 ? (
          <div className="p-8 text-center text-[#8e8b8a]">
            Nenhum comentário recebido ainda.
          </div>
        ) : (
          <div className="divide-y divide-[#e4e2e1]">
            {feedbacks.map(fb => (
              <div key={fb.id} className="p-6 hover:bg-[#fbf9f8] transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[#00254d]">
                      {fb.departments?.name || 'Sem Departamento'}
                    </span>
                    <span className="text-xs text-[#8e8b8a]">
                      {new Date(fb.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>{i < fb.rating ? '⭐' : '☆'}</span>
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-sm text-[#434750] whitespace-pre-wrap">
                  {fb.sentiment === 'POSITIVE' && '😊 '}
                  {fb.sentiment === 'NEUTRAL' && '😐 '}
                  {fb.sentiment === 'NEGATIVE' && '😡 '}
                  {fb.feedback_notes}
                </p>
                <div className="mt-4">
                  <Link 
                    href={`/dashboard/chamado/${fb.id}`}
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Ver Chamado →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
