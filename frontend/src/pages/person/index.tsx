import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import Link from 'next/link';
import Modal from 'react-modal';
import PersonForm from '../../components/PersonForm';
import withAuth from '../../components/withAuth';
import { Person } from '../../types/person';
import { Invoice } from '../../types/invoice';
import { PersonInvoiceWithInvoice } from '../../types/person-invoice';
import '../../styles/global.css';

// Defina os estilos do modal aqui, fora do componente
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

const PersonList: NextPage = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false);
  const [associatedPersons, setAssociatedPersons] = useState<number[]>([]);
  const [selectedPersons, setSelectedPersons] = useState<number[]>([]);
  const [isPersonInvoiceFormOpen, setIsPersonInvoiceFormOpen] = useState(false);
  const [selectedPersonInvoice, setSelectedPersonInvoice] = useState<PersonInvoiceWithInvoice | null>(null);

  // Array de statusOptions
  const statusOptions = [
    { id: 1, name: 'Ativo' },
    { id: 2, name: 'Inativo' },
    { id: 3, name: 'Pendente' },
    { id: 4, name: 'Bloqueado' },
  ];

  // Array de classificationOptions
  const classificationOptions = [
    { id: 1, name: 'VIP' },
    { id: 2, name: 'REGULAR' },
    { id: 3, name: 'OBS' },
    { id: 4, name: 'DEVEDOR' },
  ];

  // Função para buscar a lista de pessoas
  const fetchPersons = async () => {
    try {
      const data = await apiService.getPersons();
      setPersons(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ocorreu um erro desconhecido');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  const handleEdit = async (id: number) => {
    try {
      const person = await apiService.getPerson(id);
      setSelectedPerson(person);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Erro ao buscar pessoa para edição:', error);
      setError('Erro ao carregar dados da pessoa para edição.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta pessoa?')) {
      try {
        await apiService.deletePerson(id);
        setPersons(persons.filter((person) => person.id !== id));
      } catch (error) {
        console.error('Erro ao deletar pessoa:', error);
        setError(
          error instanceof Error
            ? 'Erro ao deletar pessoa: ' + error.message
            : 'Erro ao deletar pessoa.',
        );
      }
    }
  };

  const handleAssociateInvoice = (person: Person) => {
    setSelectedPerson(person); // Define a pessoa selecionada
    setIsAssociateModalOpen(true); // Abre o modal de associação
  };

  const handleAssociateSubmit = async () => {
    if (!selectedInvoice) return;

    try {
      const currentInvoice = await apiService.getInvoice(selectedInvoice.id);
      const currentPersonIds =
        currentInvoice.persons?.map((p: Person) => p.id) ?? [];

      const newPersonIds = selectedPersons.filter(
        (id) => !currentPersonIds.includes(id),
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
      ); // Tipagem explícita do id
      if (removedPersonIds.length > 0) {
        await apiService.removeInvoiceFromMultiplePersons(
          selectedInvoice.id,
          removedPersonIds,
        ); // Chamada do método correto
      }

      closeAssociateModal();
    } catch (error) {
      console.error('Erro ao associar/desassociar pessoas à fatura:', error);
      setError('Erro ao associar/desassociar pessoas à fatura.');
    }
  };

  const handleViewDetails = async (id: number) => {
    try {
      const person = await apiService.getPerson(id);
      setSelectedPerson(person);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes da pessoa:', error);
      setError('Erro ao carregar detalhes da pessoa.');
    }
  };

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedPerson(null); // Limpa a pessoa selecionada ao fechar o modal de edição
  };
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedPerson(null);
  };

  const closeAssociateModal = () => {
    setIsAssociateModalOpen(false);
    setSelectedInvoice(null);
    setSelectedPersons([]);
  };

  const togglePersonSelection = (personId: number) => {
    setAssociatedPersons((prevSelected) =>
      prevSelected.includes(personId)
        ? prevSelected.filter((id) => id !== personId)
        : [...prevSelected, personId],
    );
  };

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const data = await apiService.getPersons();
        setPersons(data);
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
      // Carrega as pessoas associadas à fatura selecionada
      const fetchSelectedPersons = async () => {
        try {
          const invoice = await apiService.getInvoice(selectedInvoice.id);
          if (invoice && invoice.persons) {
            setSelectedPersons(
              invoice.persons.map((person: { id: number; name: string }) => person.id),
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

  // Função para obter o nome e a cor do status a partir do ID usando statusOptions
  const getStatusTag = (
    statusTypeId: number,
  ): { name: string; colorClass: string } => {
    const status = statusOptions.find((option) => option.id === statusTypeId);
    let colorClass = 'bg-gray-100 text-gray-800'; // Cor padrão (cinza)

    switch (statusTypeId) {
      case 1: // Ativo
        colorClass = 'bg-green-100 text-green-800';
        break;
      case 2: // Inativo
        colorClass = 'bg-red-100 text-red-800';
        break;
      case 3: // Pendente
        colorClass = 'bg-yellow-100 text-yellow-800';
        break;
      case 4: // Bloqueado
        colorClass = 'bg-red-500 text-white';
        break;
      default:
        colorClass = 'bg-gray-100 text-gray-800';
        break;
    }

    return { name: status ? status.name : 'Desconhecido', colorClass };
  };

  // Função para obter o nome da classificação a partir do ID usando classificationOptions
  const getClassificationName = (classificationId: number): string => {
    const classification = classificationOptions.find(
      (option) => option.id === classificationId,
    );
    return classification ? classification.name : 'Desconhecido';
  };

  const handleOpenPersonInvoiceForm = (invoice: Invoice, personInvoice: PersonInvoiceWithInvoice) => {
    setSelectedInvoice(invoice);
    setSelectedPersonInvoice(personInvoice);
    setIsPersonInvoiceFormOpen(true);
};

const closePersonInvoiceForm = () => {
  setIsPersonInvoiceFormOpen(false);
  setSelectedInvoice(null);
  setSelectedPersonInvoice(null);
};

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Lista de Pessoas</h1>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 flex items-center"
          >
            <span className="mr-2">+</span> Criar Pessoa
          </button>
        </div>

        <Modal isOpen={isCreateModalOpen} onRequestClose={closeCreateModal}>
          <div className="bg-white p-6 rounded-lg">
            <PersonForm
              onClose={closeCreateModal}
              onPersonCreatedOrUpdated={fetchPersons}
            />
          </div>
        </Modal>

        <Modal isOpen={isEditModalOpen} onRequestClose={closeEditModal}>
          {selectedPerson && (
            <div className="bg-white p-6 rounded-lg max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Editar {selectedPerson.fullname}
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <PersonForm
                  onClose={closeEditModal}
                  person={selectedPerson}
                  onPersonCreatedOrUpdated={fetchPersons}
                />
              </div>
              <div className="flex space-x-4">
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

        {/* Modal de Detalhes (isDetailModalOpen) - Exibindo todos os dados */}
        <Modal isOpen={isDetailModalOpen} onRequestClose={closeDetailModal}>
          {selectedPerson && (
            <div className="bg-white p-6 rounded-lg max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Detalhes de {selectedPerson.fullname}
                </h2>
                <button
                  onClick={closeDetailModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
              <div className="space-y-4">
                {/* Exibindo todos os dados aqui */}
                <p className="text-gray-700">
                  <span className="font-semibold">Nome Completo:</span>{' '}
                  {selectedPerson.fullname}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Apelido:</span>{' '}
                  {selectedPerson.nickname}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Status:</span>{' '}
                  {selectedPerson.statusType?.name}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Celular:</span>{' '}
                  {selectedPerson.cellphone}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Instagram:</span>{' '}
                  {selectedPerson.instagram}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Ativo:</span>{' '}
                  {selectedPerson.enable ? 'Sim' : 'Não'}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Criado em:</span>{' '}
                  {selectedPerson.createdAt}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Atualizado em:</span>{' '}
                  {selectedPerson.updatedAt}
                </p>
                {/* Exemplo de exibição de endereços */}
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Endereços:
                  </h3>
                  <div className="grid gap-4">
                    {selectedPerson.addresses.map((address) => (
                      <div key={address.id} className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">
                          <span className="font-semibold">Nome:</span>{' '}
                          {address.name}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">CEP:</span>{' '}
                          {address.zipcode}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Rua:</span>{' '}
                          {address.street}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Número:</span>{' '}
                          {address.number}
                        </p>
                        {address.complement && (
                          <p className="text-gray-700">
                            <span className="font-semibold">Complemento:</span>{' '}
                            {address.complement}
                          </p>
                        )}
                        <p className="text-gray-700">
                          <span className="font-semibold">Ativo:</span>{' '}
                          {address.enable ? 'Sim' : 'Não'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Exibição de classificações usando getClassificationName */}
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Classificações:
                  </h3>
                  <div className="grid gap-2">
                    {selectedPerson.personClassifications.map((classification) => (
                      <div
                        key={classification.classificationId}
                        className="bg-gray-50 p-2 rounded"
                      >
                        <p className="text-gray-700">
                          <span className="font-semibold">
                            {/* Usando getClassificationName para exibir o nome */}
                            {getClassificationName(
                              classification.classificationId,
                            )}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Exemplo de exibição de faturas */}
                <div className="mt-6">
                  {selectedPerson.invoices.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {selectedPerson.invoices.map((invoice) =>
                        invoice.invoice ? (
                          <li
                            key={invoice.invoice.id}
                            className="py-3 flex items-center justify-between"
                          >
                            <span className="text-gray-700">
                              {invoice.invoice.name}
                            </span>
                            <span className="text-gray-500 text-sm">
                              {invoice.invoice.code}
                            </span>
                            <button
                              onClick={() =>
                                handleOpenPersonInvoiceForm(
                                  invoice.invoice,
                                  invoice,
                                )
                              }
                              className="text-blue-600 hover:text-blue-900 ml-4"
                            >
                              Editar
                            </button>
                          </li>
                        ) : null,
                      )}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">
                      Nenhuma fatura associada.
                    </p>
                  )}
                </div>
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

        <Modal
          isOpen={isAssociateModalOpen}
          onRequestClose={closeAssociateModal}
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

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome Completo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Apelido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Celular
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instagram
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {persons.map((person) => (
                  <tr key={person.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {person.fullname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {person.nickname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusTag(person.statusTypeId).colorClass}`}>
                      {getStatusTag(person.statusTypeId).name}
                     </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {person.cellphone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {person.instagram}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewDetails(person.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Ver Mais
                      </button>
                      <button
                        onClick={() => handleEdit(person.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(person.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Apagar
                      </button>
                      <Link href={`/person/${person.id}/invoices`} legacyBehavior>
                        <a className="text-green-600 hover:text-green-900">
                          Gerenciar Associação
                        </a>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8">
        <Link
          href="/invoice"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Ir para Faturas
        </Link>
      </div>

      </div>
    </div>
  );
};

export default withAuth(PersonList, ['admin']);