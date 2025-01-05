import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { apiService } from '../../../services/api';
import '../../../styles/global.css';


interface Invoice {
  id: number;
  name: string;
  paid_at: string | null;
  cancelled_at: string | null;
  enable: boolean;
  fullvalue: number | null;
  persons: {
    PersonInvoice: {
      invoiceId: number;
      personId: number;
      paid_at: string | null;
      cancelled_at: string | null;
      enable: boolean;
    };
  }[];
}

const EditInvoice: React.FC = () => {
  const router = useRouter();
  const { invoiceId } = router.query;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [paidAt, setPaidAt] = useState<string | null>(null);
  const [cancelledAt, setCancelledAt] = useState<string | null>(null);
  const [enable, setEnable] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [personId, setPersonId] = useState<number | null>(null);
  const [amountPaidInput, setAmountPaidInput] = useState<string>('');

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        if (typeof invoiceId === 'string') {
          const response = await apiService.getInvoice(parseInt(invoiceId));
          const fetchedInvoice = response;
          setInvoice(fetchedInvoice);

          const personInvoice = fetchedInvoice.persons.find(
            (p: any) => p.PersonInvoice.invoiceId === fetchedInvoice.id
          );
          if (personInvoice) {
            setPaidAt(personInvoice.PersonInvoice.paid_at ? new Date(personInvoice.PersonInvoice.paid_at).toISOString().split('T')[0] : null);
            setCancelledAt(personInvoice.PersonInvoice.cancelled_at ? new Date(personInvoice.PersonInvoice.cancelled_at).toISOString().split('T')[0] : null);
            setEnable(personInvoice.PersonInvoice.enable);
            setPersonId(personInvoice.PersonInvoice.personId);
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

  const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) {
      return 'R$ 0,00';
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleAmountPaidInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value.replace(/[^0-9,]/g, '');
    const formattedValue = rawValue.replace(/,(\d{3,})$/, '.$1');
    setAmountPaidInput(formattedValue);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!invoice) return;

    const amountPaid = parseFloat(amountPaidInput.replace('.', '').replace(',', '.'));

    // Verifica se há data de pagamento e valor pago é insuficiente
    if (paidAt && amountPaid < (invoice.fullvalue || 0)) {
        alert('O valor pago deve ser maior ou igual ao valor total da fatura para definir a data de pagamento.');
        return;
    }

    // Verifica se há data de pagamento e data de cancelamento ao mesmo tempo
    if (paidAt && cancelledAt) {
        alert('Não é possível definir uma data de cancelamento se já existe uma data de pagamento.');
        return;
    }

    try {
        if (typeof invoiceId === 'string' && personId) {
            await apiService.updatePersonInvoice(parseInt(invoiceId), personId, {
                paid_at: paidAt,
                cancelled_at: cancelledAt,
                enable,
            });
            router.back();
        }
    } catch (err: any) {
        setError(err.message || 'Erro ao atualizar a fatura.');
    }
};

  const clearPaidAt = () => {
    setPaidAt(null);
  };

  const clearCancelledAt = () => {
    setCancelledAt(null);
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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Editar Fatura: {invoice.name}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="mb-2 font-bold">
            Valor Total: {formatCurrency(invoice.fullvalue)}
          </label>
        </div>
        <div className="flex flex-col">
          <label htmlFor="amount_paid" className="mb-2 font-bold">
            Valor Pago:
          </label>
          <input
            type="text"
            id="amount_paid"
            value={amountPaidInput}
            onChange={handleAmountPaidInputChange}
            className="border border-gray-300 p-2 rounded"
            placeholder="R$"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="paid_at" className="mb-2 font-bold">
            Pago em:
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              id="paid_at"
              value={paidAt || ''}
              onChange={handlePaidAtChange}
              className="border border-gray-300 p-2 rounded"
              disabled={!!cancelledAt}
            />
            <button
              type="button"
              onClick={clearPaidAt}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded"
            >
              Limpar
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="cancelled_at" className="mb-2 font-bold">
            Cancelado em:
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              id="cancelled_at"
              value={cancelledAt || ''}
              onChange={handleCancelledAtChange}
              className="border border-gray-300 p-2 rounded"
              disabled={!!paidAt}
            />
            <button
              type="button"
              onClick={clearCancelledAt}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded"
            >
              Limpar
            </button>
          </div>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="enable"
            checked={enable}
            onChange={handleEnableChange}
            className="mr-2"
          />
          <label htmlFor="enable">Ativo:</label>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Salvar
        </button>
      </form>
    </div>
  );
};

export default EditInvoice;