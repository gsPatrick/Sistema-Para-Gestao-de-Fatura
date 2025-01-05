import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { apiService } from '../../../services/api';
import '../../../styles/global.css';

interface Invoice {
  id: number;
  name: string;
  paid_at: string | null;
  cancelled_at: string | null;
  enable: boolean;
  persons: {
    id: number;
    PersonInvoice: {
      paid_at: string | null;
      cancelled_at: string | null;
      enable: boolean;
    };
  }[];
}

interface Person {
  id: number;
  fullname: string;
  invoices: Invoice[];
}

const PersonInvoices: React.FC = () => {
  const router = useRouter();
  const { personId } = router.query;
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para formatar a data para exibição (DD/MM/YYYY)
  const formatDate = (date: string | null | undefined): string => {
    if (!date) return 'N/A'; // Se a data for nula, retorna 'N/A'

    // Tratar string ou Date
    const dataDate = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dataDate.getTime())) return 'N/A';
    return dataDate.toLocaleDateString('pt-BR'); // Formato DD/MM/YYYY
  };

  useEffect(() => {
    const fetchPersonAndInvoices = async () => {
      try {
        if (typeof personId === 'string') {
          const personData = await apiService.getPerson(parseInt(personId));
          const invoicesData = await apiService.getInvoices();

          const personInvoices: Invoice[] = invoicesData
            .filter((invoice: Invoice) =>
              invoice.persons.some(
                (person) => person.id === parseInt(personId)
              )
            )
            .map((invoice: Invoice) => {
              const personInvoice = invoice.persons.find(
                (p) => p.id === parseInt(personId)
              )?.PersonInvoice;
              return {
                ...invoice,
                paid_at: personInvoice ? personInvoice.paid_at : null,
                cancelled_at: personInvoice
                  ? personInvoice.cancelled_at
                  : null,
                enable: personInvoice ? personInvoice.enable : true,
              };
            });

          setPerson({
            ...personData,
            invoices: personInvoices,
          });
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao buscar dados.');
      } finally {
        setLoading(false);
      }
    };

    if (personId) {
      fetchPersonAndInvoices();
    }
  }, [personId]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  if (!person) {
    return <div>Pessoa não encontrada.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Faturas de {person.fullname}</h1>
      <ul className="space-y-4">
        {person.invoices.map((invoice) => {
          const personInvoice = invoice.persons.find(
            (p) => p.id === person.id
          )?.PersonInvoice;
          return (
            <li key={invoice.id} className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
              <Link href={`/invoice/${invoice.id}/edit`} className="text-blue-600 hover:text-blue-800 font-medium">
                {invoice.name} - Status:
                {personInvoice && personInvoice.paid_at
                  ? `Pago em: ${formatDate(personInvoice.paid_at)}`
                  : personInvoice && personInvoice.cancelled_at
                  ? `Cancelado em: ${formatDate(personInvoice.cancelled_at)}`
                  : personInvoice && personInvoice.enable
                  ? 'Ativo'
                  : 'Inativo'}
              </Link>
              {/* Mostra informações adicionais */}
              <div className="mt-2 text-gray-600">
                {personInvoice && personInvoice.paid_at && (
                  <p>Data de Pagamento: {formatDate(personInvoice.paid_at)}</p>
                )}
                {personInvoice && personInvoice.cancelled_at && (
                  <p>Data de Cancelamento: {formatDate(personInvoice.cancelled_at)}</p>
                )}
                <p>Ativo: {personInvoice && personInvoice.enable ? 'Sim' : 'Não'}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PersonInvoices;