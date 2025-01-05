// import React, { useState, useEffect } from 'react';
// import { apiService } from '../services/api';
// import { PersonInvoiceWithInvoice } from '../types/person-invoice';
// import { Invoice } from '../types/invoice';

// interface PersonInvoiceFormProps {
//   personId: number;
//   invoice: Invoice;
//   personInvoice: PersonInvoiceWithInvoice;
//   onClose: () => void;
//   onUpdate: () => void;
// }

// const PersonInvoiceForm: React.FC<PersonInvoiceFormProps> = ({
//   personId,
//   invoice,
//   personInvoice,
//   onClose,
//   onUpdate,
// }) => {
//   const [formData, setFormData] = useState<{
//     paid_at: string | null;
//     cancelled_at: string | null;
//     enable: boolean;
//   }>({
//     paid_at: null,
//     cancelled_at: null,
//     enable: true,
//   });

//   useEffect(() => {
//     // Usa os dados de personInvoice para preencher o formulário
//     setFormData({
//       paid_at: personInvoice.paid_at,
//       cancelled_at: personInvoice.cancelled_at,
//       enable: personInvoice.enable,
//     });
//   }, [personInvoice]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     const { name, value } = e.target;

//     if (e.target instanceof HTMLInputElement) {
//       const checked = e.target.checked;
//       setFormData((prev) => ({
//         ...prev,
//         [name]: e.target.type === 'checkbox' ? checked : value,
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       await apiService.updatePersonInvoice(invoice.id, personId, formData);
//       onUpdate();
//       onClose();
//     } catch (error) {
//       console.error(
//         'Erro ao atualizar informações da fatura na pessoa:',
//         error,
//       );
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="space-y-4">
//         {/* Campo paid_at */}
//         <div className="sm:col-span-3">
//           <label
//             htmlFor="paid_at"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Pago em:
//           </label>
//           <div className="mt-1">
//             <input
//               type="date"
//               id="paid_at"
//               name="paid_at"
//               value={formData.paid_at || ''}
//               onChange={handleChange}
//               className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
//             />
//           </div>
//         </div>

//         {/* Campo cancelled_at */}
//         <div className="sm:col-span-3">
//           <label
//             htmlFor="cancelled_at"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Cancelado em:
//           </label>
//           <div className="mt-1">
//             <input
//               type="date"
//               id="cancelled_at"
//               name="cancelled_at"
//               value={formData.cancelled_at || ''}
//               onChange={handleChange}
//               className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
//             />
//           </div>
//         </div>

//         {/* Campo enable */}
//         <div className="flex items-center">
//           <input
//             id="enable"
//             name="enable"
//             type="checkbox"
//             checked={formData.enable}
//             onChange={handleChange}
//             className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//           />
//           <label
//             htmlFor="enable"
//             className="ml-2 block text-sm text-gray-900"
//           >
//             Ativo
//           </label>
//         </div>
//       </div>

//       {/* Botões de Ação */}
//       <div className="mt-8 pt-5">
//         <div className="flex justify-end">
//           <button
//             type="button"
//             onClick={onClose}
//             className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             Cancelar
//           </button>
//           <button
//             type="submit"
//             className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             Salvar Alterações
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default PersonInvoiceForm;