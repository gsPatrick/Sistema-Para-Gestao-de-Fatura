import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { CreatePersonDto, Person } from '../types/person';
import { CreateAddressDto } from '../types/address';
import { CreatePersonClassificationDto } from '../types/person-classification';
import { useRouter } from 'next/router';

interface PersonFormProps {
  onClose: () => void;
  person?: Person;
  onPersonCreatedOrUpdated: () => void;
}

const PersonForm: React.FC<PersonFormProps> = ({
  onClose,
  person,
  onPersonCreatedOrUpdated,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<CreatePersonDto>({
    fullname: '',
    nickname: '',
    statusTypeId: 1,
    cellphone: '',
    instagram: '',
    enable: true,
    role: 'user',
    addresses: [],
    personClassifications: [], // Inicializa como um array vazio
  });

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

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleStatusChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedStatusName = event.target.value;
    const selectedStatus = statusOptions.find(
      (status) => status.name === selectedStatusName,
    );
    if (selectedStatus) {
      setFormData((prevData) => ({
        ...prevData,
        statusTypeId: selectedStatus.id,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (person) {
        await apiService.updatePerson(person.id, formData);
      } else {
        await apiService.createPerson(formData);
      }

      onClose();
      onPersonCreatedOrUpdated(); // Chama a função para atualizar a lista
      router.push('/person');
    } catch (error) {
      console.error('Erro ao criar/atualizar pessoa:', error);
    }
  };

  const handleAddAddress = () => {
    setFormData((prevData) => ({
      ...prevData,
      addresses: [...(prevData.addresses ?? []), {} as CreateAddressDto],
    }));
  };

  const handleRemoveAddress = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      addresses: (prevData.addresses ?? []).filter((_, i) => i !== index),
    }));
  };

  const handleAddressChange = (
    index: number,
    field: keyof CreateAddressDto,
    value: any,
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      addresses: (prevData.addresses ?? []).map((address, i) =>
        i === index ? { ...address, [field]: value } : address,
      ),
    }));
  };

  // Funções para adicionar, remover e atualizar classificações
  const handleAddClassification = () => {
    setFormData((prevData) => ({
      ...prevData,
      personClassifications: [
        ...(prevData.personClassifications ?? []),
        { classificationId: 0 } as CreatePersonClassificationDto, // Adiciona um objeto com classificationId inicial 0 (ou outro valor padrão)
      ],
    }));
  };

  const handleRemoveClassification = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      personClassifications: (prevData.personClassifications ?? []).filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const handleClassificationChange = (
    index: number,
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedClassificationName = event.target.value;
    const selectedClassification = classificationOptions.find(
      (classification) => classification.name === selectedClassificationName,
    );

    if (selectedClassification) {
      setFormData((prevData) => ({
        ...prevData,
        personClassifications: (prevData.personClassifications ?? []).map(
          (classification, i) =>
            i === index
              ? { classificationId: selectedClassification.id }
              : classification,
        ),
      }));
    }
  };

  useEffect(() => {
    if (person) {
      setFormData({
        fullname: person.fullname,
        nickname: person.nickname,
        statusTypeId: person.statusTypeId,
        cellphone: person.cellphone || '',
        instagram: person.instagram || '',
        enable: person.enable,
        role: person.role,
        addresses: person.addresses as CreateAddressDto[],
        personClassifications: person.personClassifications.length > 0
          ? person.personClassifications.map(c => ({ classificationId: c.classificationId }))
          : [], // Inicializa como um array vazio se não houver classificações
      });
    }
  }, [person]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Campo Nome Completo */}
        <div className="sm:col-span-3">
          <label
            htmlFor="fullname"
            className="block text-sm font-medium text-gray-700"
          >
            Nome Completo:
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        {/* Campo Apelido */}
        <div className="sm:col-span-3">
          <label
            htmlFor="nickname"
            className="block text-sm font-medium text-gray-700"
          >
            Apelido:
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              required
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        {/* Campo Status Type ID (agora um dropdown) */}
        <div className="sm:col-span-3">
          <label
            htmlFor="statusTypeId"
            className="block text-sm font-medium text-gray-700"
          >
            Status:
          </label>
          <div className="mt-1">
            <select
              id="statusTypeId"
              name="statusTypeId"
              value={
                statusOptions.find(
                  (status) => status.id === formData.statusTypeId,
                )?.name
              }
              onChange={handleStatusChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
            >
              {statusOptions.map((status) => (
                <option key={status.id} value={status.name}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Campo Celular */}
        <div className="sm:col-span-3">
          <label
            htmlFor="cellphone"
            className="block text-sm font-medium text-gray-700"
          >
            Celular:
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="cellphone"
              name="cellphone"
              value={formData.cellphone}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        {/* Campo Instagram */}
        <div className="sm:col-span-3">
          <label
            htmlFor="instagram"
            className="block text-sm font-medium text-gray-700"
          >
            Instagram:
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="instagram"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        {/* Campo Enable */}
        <div className="flex items-center">
          <input
            id="enable"
            name="enable"
            type="checkbox"
            checked={formData.enable}
            onChange={(e) =>
              setFormData({ ...formData, enable: e.target.checked })
            }
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="enable" className="ml-2 block text-sm text-gray-900">
            Ativo
          </label>
        </div>
      </div>

      {/* Campos para addresses */}
      <div className="mt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Endereços
        </h3>
        {(formData.addresses ?? []).map((address, index) => (
          <div
            key={index}
            className="mt-4 space-y-4 p-4 bg-gray-100 rounded-lg"
          >
            <h4 className="font-medium">Endereço {index + 1}</h4>
            <div className="grid grid-cols-6 gap-3">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor={`addresses[${index}].name`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Nome:
                </label>
                <input
                  type="text"
                  placeholder="Nome"
                  name={`addresses[${index}].name`}
                  value={address.name}
                  onChange={(e) =>
                    handleAddressChange(index, 'name', e.target.value)
                  }
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor={`addresses[${index}].zipcode`}
                  className="block text-sm font-medium text-gray-700"
                >
                  CEP:
                </label>
                <input
                  type="text"
                  placeholder="CEP"
                  name={`addresses[${index}].zipcode`}
                  value={address.zipcode}
                  onChange={(e) =>
                    handleAddressChange(index, 'zipcode', e.target.value)
                  }
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
                />
              </div>

              <div className="col-span-6">
                <label
                  htmlFor={`addresses[${index}].street`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Rua:
                </label>
                <input
                  type="text"
                  placeholder="Rua"
                  name={`addresses[${index}].street`}
                  value={address.street}
                  onChange={(e) =>
                    handleAddressChange(index, 'street', e.target.value)
                  }
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor={`addresses[${index}].number`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Número:
                </label>
                <input
                  type="number"
                  placeholder="Número"
                  name={`addresses[${index}].number`}
                  value={address.number}
                  onChange={(e) =>
                    handleAddressChange(index, 'number', parseInt(e.target.value))
                  }
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor={`addresses[${index}].complement`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Complemento:
                </label>
                <input
                  type="text"
                  placeholder="Complemento"
                  name={`addresses[${index}].complement`}
                  value={address.complement}
                  onChange={(e) =>
                    handleAddressChange(index, 'complement', e.target.value)
                  }
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
                />
              </div>

              <div className="col-span-6 flex items-center">
                <input
                  type="checkbox"
                  name={`addresses[${index}].enable`}
                  checked={address.enable}
                  onChange={(e) =>
                    handleAddressChange(index, 'enable', e.target.checked)
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`addresses[${index}].enable`}
                  className="ml-2 text-sm text-gray-900"
                >
                  Ativo
                </label>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveAddress(index)}
              className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Remover Endereço
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddAddress}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Adicionar Endereço
        </button>
      </div>

      {/* Campo para personClassification */}
      <div className="mt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Classificações
        </h3>
        {(formData.personClassifications ?? []).map(
          (classification, index) => (
            <div
              key={index}
              className="mt-4 space-y-4 p-4 bg-gray-100 rounded-lg"
            >
              <h4 className="font-medium">Classificação {index + 1}</h4>
              <div className="grid grid-cols-6 gap-3">
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor={`classificationId-${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Classificação:
                  </label>
                  <select
                    id={`classificationId-${index}`}
                    name={`classificationId-${index}`}
                    value={
                      classificationOptions.find(
                        (c) => c.id === classification.classificationId,
                      )?.name || ''
                    }
                    onChange={(e) => handleClassificationChange(index, e)}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
                  >
                    <option value="">Selecione uma classificação</option>
                    {/* Adicionar opção vazia */}
                    {classificationOptions.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  {/* Botão para remover a classificação atual */}
                  <button
                    type="button"
                    onClick={() => handleRemoveClassification(index)}
                    className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Remover Classificação
                  </button>
                </div>
              </div>
            </div>
          ),
        )}
        {/* Botão para adicionar uma nova classificação */}
        <button
          type="button"
          onClick={handleAddClassification}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Adicionar Classificação
        </button>
      </div>

      {/* Botões de ação */}
      <div className="mt-8 pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {person ? 'Salvar Alterações' : 'Criar Pessoa'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PersonForm;