import jsPDF from 'jspdf';
import { RiskResult, QuestionAnswer } from '@/types/leishcheck';
import { questions } from '@/data/questions';

export function generateResultPDF(result: RiskResult, answers: QuestionAnswer[], userData?: { age?: number; gender?: string; city?: string; state?: string }) {
  const doc = new jsPDF();
  const w = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('LeishCheck — Relatório de Triagem', w / 2, y, { align: 'center' });
  y += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, w / 2, y, { align: 'center' });
  y += 12;

  // Divider
  doc.setDrawColor(200);
  doc.line(20, y, w - 20, y);
  y += 10;

  // Result summary
  const colorMap = { low: [34, 139, 34], medium: [218, 165, 32], high: [220, 38, 38] };
  const color = colorMap[result.level] || colorMap.low;
  doc.setTextColor(color[0], color[1], color[2]);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(`${result.percentage}% — ${result.title}`, w / 2, y, { align: 'center' });
  y += 10;

  doc.setTextColor(0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(result.description, w / 2, y, { align: 'center', maxWidth: w - 40 });
  y += 10;
  doc.text(result.orientation, w / 2, y, { align: 'center', maxWidth: w - 40 });
  y += 15;

  // User data
  if (userData && (userData.age || userData.gender || userData.city)) {
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Dados do Paciente', 20, y);
    y += 7;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    if (userData.age) { doc.text(`Idade: ${userData.age}`, 20, y); y += 5; }
    if (userData.gender) { doc.text(`Gênero: ${userData.gender}`, 20, y); y += 5; }
    if (userData.city || userData.state) { doc.text(`Local: ${[userData.city, userData.state].filter(Boolean).join(' - ')}`, 20, y); y += 5; }
    y += 5;
  }

  // Answers
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Respostas do Questionário', 20, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  questions.forEach((q, i) => {
    if (y > 270) { doc.addPage(); y = 20; }
    const answer = answers.find(a => a.questionIndex === i);
    const resp = answer ? (answer.answer ? '✓ Sim' : '✗ Não') : '— Não respondida';
    doc.text(`${i + 1}. ${q.text}`, 20, y, { maxWidth: w - 70 });
    doc.text(resp, w - 25, y, { align: 'right' });
    y += 7;
  });

  y += 10;
  if (y > 270) { doc.addPage(); y = 20; }

  // Disclaimer
  doc.setDrawColor(200);
  doc.line(20, y, w - 20, y);
  y += 8;
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text('AVISO: Este relatório é gerado por uma ferramenta de triagem e NÃO constitui diagnóstico médico.', w / 2, y, { align: 'center', maxWidth: w - 40 });
  y += 5;
  doc.text('Procure uma Unidade Básica de Saúde (UBS) para avaliação profissional. Tratamento gratuito pelo SUS.', w / 2, y, { align: 'center', maxWidth: w - 40 });

  doc.save(`LeishCheck_Resultado_${new Date().toISOString().slice(0, 10)}.pdf`);
}
