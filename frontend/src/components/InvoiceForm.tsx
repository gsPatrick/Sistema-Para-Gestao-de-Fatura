import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { CreateInvoiceDto, Invoice } from '../types/invoice';
import { useRouter } from 'next/router';

interface InvoiceFormProps {
  onClose: () => void;
  invoice?: Invoice;
  onInvoiceCreatedOrUpdated: (invoice: Invoice) => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  onClose,
  invoice,
  onInvoiceCreatedOrUpdated,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateInvoiceDto>({
    name: '',
    code: '',
    invoiceTypeId: 1, // Valor inicial alterado para 1 (MENSALIDADE)
    fullvalue: 0,
    discount: 0,
    amountPaid: 0,
    startBillingOn: new Date(),
  });

  // Array de invoiceTypeOptions
  const invoiceTypeOptions = [
    { id: 1, name: 'MENSALIDADE' },
    { id: 2, name: 'SERVICO' },
    { id: 3, name: 'PRODUTO' },
  ];

  useEffect(() => {
    if (invoice) {
      setFormData({
        name: invoice.name,
        code: invoice.code,
        invoiceTypeId: Number(invoice.invoiceTypeId),
        fullvalue: Number(invoice.fullvalue),
        discount: Number(invoice.discount),
        startBillingOn: invoice.startBillingOn
          ? new Date(invoice.startBillingOn)
          : new Date(),
      });
    }
  }, [invoice]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Função para lidar com a mudança do tipo de fatura
  const handleInvoiceTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedInvoiceTypeName = event.target.value;
    const selectedInvoiceType = invoiceTypeOptions.find(
      (type) => type.name === selectedInvoiceTypeName,
    );
    if (selectedInvoiceType) {
      setFormData((prevData) => ({
        ...prevData,
        invoiceTypeId: selectedInvoiceType.id,
      }));
    }
  };

  // Função para lidar com a mudança da data
  const handleDateChange = (date: Date) => {
    setFormData((prevData) => ({
      ...prevData,
      startBillingOn: date,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let response: Invoice;
      if (invoice) {
        response = await apiService.updateInvoice(invoice.id, formData);
      } else {
        response = await apiService.createInvoice(formData);
      }

      if (onInvoiceCreatedOrUpdated) {
        onInvoiceCreatedOrUpdated(response);
      }

      onClose();
      router.push('/invoice');
    } catch (error) {
      console.error('Erro ao criar/atualizar fatura:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Campo Nome */}
        <div className="sm:col-span-3">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nome:
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        {/* Campo Código */}
        <div className="sm:col-span-3">
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-700"
          >
            Código:
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        {/* Campo Tipo de Fatura (agora um dropdown) */}
        <div className="sm:col-span-3">
          <label
            htmlFor="invoiceTypeId"
            className="block text-sm font-medium text-gray-700"
          >
            Tipo de Fatura:
          </label>
          <div className="mt-1">
            <select
              id="invoiceTypeId"
              name="invoiceTypeId"
              value={
                invoiceTypeOptions.find(
                  (type) => type.id === formData.invoiceTypeId,
                )?.name
              }
              onChange={handleInvoiceTypeChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
            >
              {invoiceTypeOptions.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Campo Data Inicial da Fatura */}
        <div className="sm:col-span-3">
          <label
            htmlFor="startBillingOn"
            className="block text-sm font-medium text-gray-700"
          >
            Data da Fatura:
          </label>
          <div className="mt-1">
          <input
            type="date"
            id="startBillingOn"
            name="startBillingOn"
            value={
                formData.startBillingOn
                ? new Date(formData.startBillingOn).toISOString().slice(0, 10)
                : ''
            }
            onChange={(e) => handleDateChange(new Date(e.target.value))}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        {/* Campo Valor Total */}
        <div className="sm:col-span-3">
          <label
            htmlFor="fullvalue"
            className="block text-sm font-medium text-gray-700"
          >
            Valor Total:
          </label>
          <div className="mt-1">
            <input
              type="number"
              id="fullvalue"
              name="fullvalue"
              value={formData.fullvalue}
              onChange={handleChange}
              required
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        {/* Campo Desconto */}
        <div className="sm:col-span-3">
          <label
            htmlFor="discount"
            className="block text-sm font-medium text-gray-700"
          >
            Desconto:
          </label>
          <div className="mt-1">
            <input
              type="number"
              id="discount"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
            />
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
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
            {invoice ? 'Salvar Alterações' : 'Criar Fatura'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default InvoiceForm;