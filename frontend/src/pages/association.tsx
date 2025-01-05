import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiService } from '../services/api'; // Ajuste o caminho conforme necessário

interface Person {
  id: number;
  fullname: string;
  invoices: Invoice[];
}

interface Invoice {
  id: number;
  name: string;
  paid_at: string | null;
  cancelled_at: string | null;
  enable: boolean;
}

const AssociationPage: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await apiService.getPersons(); // Usando o método do seu apiService
        setPeople(response);
      } catch (err: any) {
        setError(err.message || 'Erro ao buscar dados.');
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div>
      <h1>Gerenciamento de Faturas por Pessoa</h1>
      <ul>
        {people.map((person) => (
          <li key={person.id}>
            <Link href={`/person/${person.id}/invoices`}>
              {person.fullname}
            </Link>
            <ul>
              {person.invoices.map((invoice) => (
                <li key={invoice.id}>
                  <Link href={`/invoice/${invoice.id}/edit`}>
                    {invoice.name} - Status: {invoice.paid_at ? 'Pago' : invoice.cancelled_at ? 'Cancelado' : invoice.enable ? 'Ativo' : 'Inativo'}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssociationPage;