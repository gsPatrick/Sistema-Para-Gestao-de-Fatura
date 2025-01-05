import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import Link from 'next/link';
import Modal from 'react-modal';
import InvoiceForm from '../../components/InvoiceForm';
import withAuth from '../../components/withAuth';
import { Invoice } from '../../types/invoice';
import { Person } from '../../types/person';
import '../../styles/global.css';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    boxShadow:
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    borderRadius: '0.5rem',
    padding: '2rem',
    maxWidth: '80%',
    width: '600px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000,
  },
};

Modal.setAppElement('#__next');

const InvoiceList: NextPage = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [persons, setPersons] = useState<Person[]>([]);
  const [selectedPersons, setSelectedPersons] = useState<number[]>([]);

  // Função para formatar a data
  const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) return 'N/A'; // Se a data for nula, retorna 'N/A'

    // Tratar string ou Date
    const dataDate = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dataDate.getTime())) return 'N/A';
    return dataDate.toLocaleDateString('pt-BR'); // Formato DD/MM/YYYY
  };

  // Array de invoiceTypeOptions
  const invoiceTypeOptions = [
    { id: 1, name: 'MENSALIDADE' },
    { id: 2, name: 'SERVICO' },
    { id: 3, name: 'PRODUTO' },
  ];

  // Função para obter o nome e a cor do tipo de fatura a partir do ID
  const getInvoiceTypeTag = (invoiceTypeId: number | string): { name: string; colorClass: string } => {
    const type = invoiceTypeOptions.find((t) => t.id === Number(invoiceTypeId));
    let colorClass = 'bg-gray-100 text-gray-800'; // Cor padrão (cinza)

    switch (Number(invoiceTypeId)) { // Converter para número para comparação
      case 1: // MENSALIDADE
        colorClass = 'bg-blue-100 text-blue-800'; // Ex: Azul
        break;
      case 2: // SERVICO
        colorClass = 'bg-green-100 text-green-800'; // Ex: Verde
        break;
      case 3: // PRODUTO
        colorClass = 'bg-yellow-100 text-yellow-800'; // Ex: Amarelo
        break;
      default:
        colorClass = 'bg-gray-100 text-gray-800';
        break;
    }

    return { name: type ? type.name : 'Desconhecido', colorClass };
  };

  const fetchInvoices = async () => {
    try {
      const data = await apiService.getInvoices();
      setInvoices(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Erro ao carregar as faturas.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleEdit = async (invoice: Invoice) => {
    try {
      // Busca os dados atualizados da fatura antes de abrir o modal de edição
      const updatedInvoice = await apiService.getInvoice(invoice.id);
      setSelectedInvoice(updatedInvoice);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Erro ao buscar fatura para edição:', error);
      setError('Erro ao carregar dados da fatura para edição.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta fatura?')) {
      try {
        await apiService.deleteInvoice(id);
        setInvoices(invoices.filter((invoice) => invoice.id !== id));
      } catch (error) {
        console.error('Erro ao deletar fatura:', error);
        setError(
          error instanceof Error
            ? 'Erro ao deletar fatura: ' + error.message
            : 'Erro ao deletar fatura.',
        );
      }
    }
  };

  const handleViewDetails = async (id: number) => {
    try {
      const invoice = await apiService.getInvoice(id);
      setSelectedInvoice(invoice);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes da fatura:', error);
      setError('Erro ao carregar detalhes da fatura.');
    }
  };

  const handleAssociate = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsAssociateModalOpen(true);
  };

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedInvoice(null);
  };
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedInvoice(null);
  };
  const closeAssociateModal = () => {
    setIsAssociateModalOpen(false);
    setSelectedInvoice(null);
    setSelectedPersons([]);
  };

  const handleAssociateSubmit = async () => {
    if (!selectedInvoice) return;

    try {
      const currentInvoice = await apiService.getInvoice(selectedInvoice.id);
      const currentPersonIds =
        currentInvoice.persons?.map((p: Person) => p.id) ?? [];

      const newPersonIds = selectedPersons.filter(
        (id: number) => !currentPersonIds.includes(id),
      );
      if (newPersonIds.length > 0) {
        await Promise.all(
          newPersonIds.map((personId: number) =>
            apiService.addInvoiceToMultiplePersons(
              selectedInvoice.id,
              [personId],
            ),
          ),
        );
      }

      const removedPersonIds = currentPersonIds.filter(
        (id: number) => !selectedPersons.includes(id),
      );
      if (removedPersonIds.length > 0) {
        await apiService.removeInvoiceFromMultiplePersons(
          selectedInvoice.id,
          removedPersonIds,
        );
      }

      closeAssociateModal();
      await fetchInvoices();
    } catch (error) {
      console.error(
        'Erro ao associar/desassociar pessoas à fatura:',
        error,
      );
      setError('Erro ao associar/desassociar pessoas à fatura.');
    }
  };

  const togglePersonSelection = (personId: number) => {
    setSelectedPersons((prevSelected) =>
      prevSelected.includes(personId)
        ? prevSelected.filter((id) => id !== personId)
        : [...prevSelected, personId],
    );
  };

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const data = await apiService.getPersons();
        // Filtra as pessoas para mostrar apenas as ativas (enable = true)
        setPersons(data.filter((person: { enable: any; }) => person.enable));
      } catch (error) {
        console.error('Erro ao buscar pessoas:', error);
        setError('Erro ao carregar a lista de pessoas.');
      }
    };
  
    if (isAssociateModalOpen) {
      fetchPersons();
    }
  }, [isAssociateModalOpen]);
  
  useEffect(() => {
    if (selectedInvoice) {
      const fetchSelectedPersons = async () => {
        try {
          const invoice = await apiService.getInvoice(selectedInvoice.id);
          if (invoice && invoice.persons) {
            setSelectedPersons(
              invoice.persons.map((person: Person) => person.id),
            );
          } else {
            setSelectedPersons([]);
          }
        } catch (error) {
          console.error(
            'Erro ao buscar pessoas associadas à fatura:',
            error,
          );
          setError('Erro ao carregar pessoas associadas à fatura.');
        }
      };

      fetchSelectedPersons();
    }
  }, [selectedInvoice]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Listagem de Faturas:
          </h1>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 flex items-center"
          >
            <span className="mr-2">+</span> Criar Fatura
          </button>
        </div>

        {/* Modal de Criação */}
        <Modal
          isOpen={isCreateModalOpen}
          onRequestClose={closeCreateModal}
          style={customStyles}
        >
          <div className="bg-white p-6 rounded-lg">
            <InvoiceForm
              onClose={closeCreateModal}
              onInvoiceCreatedOrUpdated={fetchInvoices}
            />
          </div>
        </Modal>

        {/* Modal de Edição */}
        <Modal
          isOpen={isEditModalOpen}
          onRequestClose={closeEditModal}
          style={customStyles}
        >
          {selectedInvoice && (
            <div className="bg-white p-6 rounded-lg max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Editar {selectedInvoice.name}
                </h2>
                <button
                  onClick={closeEditModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
              <style jsx>{`
                input[type='text'],
                input[type='email'],
                input[type='tel'],
                input[type='number'],
                select,
                textarea {
                  @apply bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5;
                }

                .form-group {
                  @apply mb-4;
                }

                label {
                  @apply block mb-2 text-sm font-medium text-gray-900;
                }
              `}</style>
              <InvoiceForm
                onClose={closeEditModal}
                invoice={selectedInvoice}
                onInvoiceCreatedOrUpdated={fetchInvoices}
              />
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={closeEditModal}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal de Detalhes */}
        <Modal
          isOpen={isDetailModalOpen}
          onRequestClose={closeDetailModal}
          style={customStyles}
        >
          {selectedInvoice && (
            <div className="bg-white p-6 rounded-lg max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Fatura: {selectedInvoice.name}
                </h2>
                <button
                  onClick={closeDetailModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-gray-700">
                  <span className="font-semibold">Código:</span>{' '}
                  {selectedInvoice.code}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Tipo de Fatura:</span>{' '}
                  {getInvoiceTypeTag(Number(selectedInvoice.invoiceTypeId)).name}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Valor Total:</span> R${' '}
                  {selectedInvoice.fullvalue !== null && selectedInvoice.fullvalue !== undefined
                    ? Number(selectedInvoice.fullvalue).toFixed(2)
                    : 'N/A'}
                </p>
                <p className="text-gray-700">
                    <span className="font-semibold">Desconto:</span>{' '}
                    {selectedInvoice.discount !== null && selectedInvoice.discount !== undefined
                      ? `R$ ${Number(selectedInvoice.discount).toFixed(2)}`
                      : 'N/A'}
                  </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Data de Início:</span>{' '}
                  {formatDate(selectedInvoice.startBillingOn)}
                </p>
              </div>
              <button
                onClick={closeDetailModal}
                className="mt-8 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Fechar
              </button>
            </div>
          )}
        </Modal>

        {/* Modal de Associação */}
        <Modal
          isOpen={isAssociateModalOpen}
          onRequestClose={closeAssociateModal}
          style={customStyles}
        >
          <div className="bg-white p-6 rounded-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {selectedInvoice
                ? `Associar Pessoas à Fatura ${selectedInvoice.name}`
                : 'Associar Pessoas'}
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Pessoas Associadas:
                </h3>
                <div className="space-y-2">
                  {persons
                    .filter((person) => selectedPersons.includes(person.id))
                    .map((person) => (
                      <div
                        key={person.id}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                      >
                        <input
                          type="checkbox"
                          id={`person-associated-${person.id}`}
                          checked={true}
                          onChange={() => togglePersonSelection(person.id)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300"
                        />
                        <label
                          htmlFor={`person-associated-${person.id}`}
                          className="text-gray-700"
                        >
                          {person.fullname}
                        </label>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Pessoas Não Associadas:
                </h3>
                <div className="space-y-2">
                  {persons
                    .filter((person) => !selectedPersons.includes(person.id))
                    .map((person) => (
                      <div
                        key={person.id}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                      >
                        <input
                          type="checkbox"
                          id={`person-not-associated-${person.id}`}
                          checked={false}
                          onChange={() => togglePersonSelection(person.id)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300"
                        />
                        <label
                          htmlFor={`person-not-associated-${person.id}`}
                          className="text-gray-700"
                        >
                          {person.fullname}
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex space-x-4">
              <button
                onClick={handleAssociateSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Confirmar Associação
              </button>
              <button
                onClick={closeAssociateModal}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </Modal>

        {/* Tabela de Faturas */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden mt-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo de Fatura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Desconto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Fatura
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getInvoiceTypeTag(invoice.invoiceTypeId).colorClass}`}>
                      {getInvoiceTypeTag(invoice.invoiceTypeId).name}
                    </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        R${' '}
                        {invoice.fullvalue !== null && invoice.fullvalue !== undefined
                        ? Number(invoice.fullvalue).toFixed(2)
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.discount !== null && invoice.discount !== undefined
                        ? `R$ ${Number(invoice.discount).toFixed(2)}`
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(invoice.startBillingOn)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewDetails(invoice.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Ver Mais
                      </button>
                      <button
                        onClick={() => handleEdit(invoice)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(invoice.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Apagar
                      </button>
                      <button
                        onClick={() => handleAssociate(invoice)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Associar Pessoa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Link para voltar à página de pessoas */}
        <div className="mt-8">
          <Link legacyBehavior href="/person">
            <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
              Voltar para Pessoas
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default withAuth(InvoiceList, ['admin']);