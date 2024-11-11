import { useEffect, useState } from 'react';
import { checkAuth } from '../util/checkAuth'
import { NotebookPen, Trash2 } from 'lucide-react';
import { EditFixedPaymentModal } from '../../Components/Modal/paymentModal';

export const ListFixedsPayments = () => {
    checkAuth();

    const [listPayments, setListPayments] = useState([]);

    const [total, setTotal] = useState(0);

    useEffect(() => {
        const getAllFixedsPayments = async () => {
            const response = await fetch(`${import.meta.env.VITE_PROD_API_URL}/fixeds-payments`, {
                method: 'GET',
                credentials: 'include'
            })
            const data = await response.json();
            if (response.status === 200) {
                setListPayments(data)
            } else {
                console.error(data.message);
            }
        }
        getAllFixedsPayments();
    }, [])

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    }

    const formatValue = (value) => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }
        )
    }

    const deletePayment = async (id, description) => {
        const confirDelete = confirm(`Deseja realmente deletar ${description} ?`);
        if (confirDelete) {
            const response = await fetch(`${import.meta.env.VITE_PROD_API_URL}/fixed-payment/delete/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            if (response.status === 200) {
                window.alert('Pagamento deletado com sucesso');
                location.reload();
            } else {
                window.alert('Cancelado')
            }
        } else {
            return false
        }
    };

    const editPayment = async (id, updatedData) => {
        const response = fetch(`${import.meta.env.VITE_PROD_API_URL}/edit/${id}`, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(updatedData),
            credentials: 'include'
        });
        const data = await response.json();
        if (response.status === 200) {
            window.alert('Pagamento atualizado com sucesso!');
        } else {
            window.alert(data.message);
        }
    }

    useEffect(() => {
        const sum = listPayments.reduce((acc, p) => acc + p.value, 0);
        setTotal(sum);
    }, [listPayments]);

    return (
        <div>
            <div className='flex flex-col p-10 h-full  items-center'>
                <span className='text-3xl font-semibold'>Despesas fixas</span>
                <div className='w-full flex justify-end p-2'>
                    {/* <button className='border border-gray-800 font-semibol p-1 mb-2 rounded-md bg-gradient-to-r  from-gray-800 to-gray-600 hover:scale-110 shadow-md hover:shadow-emerald-300/100'>Imprimir</button> */}
                </div>
                {listPayments &&
                    <table className='border w-full text-base border-gray-950 rounded-md'>
                        <thead>
                            < tr className="bg-gradient-to-bl w-max from-gray-950 to-slate-500 " >
                                <th className="p-2">Data de vencimento</th>
                                <th className="p-2">Favorecido</th>
                                <th className="p-2">Descrição</th>
                                <th className="p-2">Valor</th>
                                <th className="pl-4"><NotebookPen /></th>
                                <th className="pl-6"><Trash2 /></th>
                            </tr >
                        </thead>
                        <tbody>
                            {listPayments.map((p, index) => (
                                <tr key={index} className="bg-gradient-to-r from-gray-800 to-gray-600 cursor-pointer  hover:bg-emerald-300/100 transition group hover:text-emerald-950 hover:font-semibold text-center">
                                    <td className='border w-max border-gray-700 p-2 group-hover:bg-emerald-300/100'>{formatDate(p.dueDate)}</td>
                                    <td className='border border-gray-700 p-2 group-hover:bg-emerald-300/100'>{p.favored}</td>
                                    <td className='border border-gray-700 p-2 group-hover:bg-emerald-300/100'>{p.description}</td>
                                    <td className='border border-gray-700 p-2 group-hover:bg-emerald-300/100'>{formatValue(p.value)}</td>
                                    <td className='border border-gray-700 p-2 bg-gradient-to-bl from-sky-900 to-sky-600 hover:scale-110 hover:text-slate-50 transition duration-200'><EditFixedPaymentModal id={p.id} payment={p} /></td>
                                    <td className='border bg-gradient-to-bl from-red-700 to-red-500 border-gray-700 p-2 hover:scale-110 hover:text-slate-50 transition duration-200'><button onClick={() => deletePayment(p.id, p.description)}>Deletar</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table >
                }
                <div className='bg-gradient-to-bl rounded-b-md w-full from-gray-950 to-slate-500'>
                    <div className=' rounded-b-md hover:bg-emerald-300/100  hover:text-emerald-950 hover:scale-105  transition duration-200 cursor-pointer font-semibold  border-gray-700 text-lg pl-6 pr-6 border-b border-l border-r  flex justify-between p-4'>
                        <span>Total:</span>
                        <span>{formatValue(total)}</span>
                    </div>
                </div>
            </div >
        </div>
    )
}