import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { apiService } from '../services/api';

interface Invoice {
  id: number;
  name: string;
  paid_at: string | null;
  cancelled_at: string | null;
  enable: boolean;
  persons: {
    PersonInvoice: {
      invoiceId: number;
      personId: number;
      paid_at: string | null;
      cancelled_at: string | null;
      enable: boolean;
    }
  }[];
}

const AssociationForm: React.FC = () => {
  const router = useRouter();
  const { invoiceId } = router.query;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [paidAt, setPaidAt] = useState<string | null>('');
  const [cancelledAt, setCancelledAt] = useState<string | null>('');
  const [enable, setEnable] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [personId, setPersonId] = useState<number | null>(null); // Add personId state

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        if (typeof invoiceId === 'string') {
          const response = await apiService.getInvoice(parseInt(invoiceId));
          const fetchedInvoice = response;
          setInvoice(fetchedInvoice);

          const personInvoice = fetchedInvoice.persons.find((p: any) => p.PersonInvoice.invoiceId === fetchedInvoice.id);
          if (personInvoice) {
            setPaidAt(personInvoice.PersonInvoice.paid_at);
            setCancelledAt(personInvoice.PersonInvoice.cancelled_at);
            setEnable(personInvoice.PersonInvoice.enable);
            setPersonId(personInvoice.PersonInvoice.personId)
          }
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao buscar dados da fatura.');
      } finally {
        setLoading(false);
      }
    };

    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  const handlePaidAtChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaidAt(event.target.value);
  };

  const handleCancelledAtChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCancelledAt(event.target.value);
  };

  const handleEnableChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnable(event.target.checked);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (invoice && typeof invoiceId === 'string' && personId) {
        await apiService.updatePersonInvoice(parseInt(invoiceId), personId, {
          paid_at: paidAt,
          cancelled_at: cancelledAt,
          enable,
        });
        router.back(); // Next.js equivalent of navigate(-1)
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar a fatura.');
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  if (!invoice) {
    return <div>Fatura não encontrada.</div>;
  }

  return (
    <div>
      <h1>Editar Fatura: {invoice.name}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="paid_at">Pago em:</label>
          <input type="date" id="paid_at" value={paidAt || ''} onChange={handlePaidAtChange} />
        </div>
        <div>
          <label htmlFor="cancelled_at">Cancelado em:</label>
          <input type="date" id="cancelled_at" value={cancelledAt || ''} onChange={handleCancelledAtChange} />
        </div>
        <div>
          <label htmlFor="enable">Ativo:</label>
          <input type="checkbox" id="enable" checked={enable} onChange={handleEnableChange} />
        </div>
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default AssociationForm;