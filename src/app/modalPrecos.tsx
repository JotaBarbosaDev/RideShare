import React, { useEffect, useState } from 'react';

interface ModalPrecosProps {
    eventsArr: any[];
}


type Person = {
    id: string;
    name: string;
    pricetopay: number;
    despesas: number;
};

function createLinkForBackend() {
    const our_url = window.location.href;
    //change the port to 9000
    const url = new URL(our_url);
    url.port = '9000';
    return url.origin;
}

const ModalPrecos: React.FC<ModalPrecosProps> = ({ eventsArr }) => {
    const [show, setShow] = useState(false);
    const [pessoasArr, setPessoasArr] = useState<Person[]>([]);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // Add state for selected person and amount
    const [selectedPerson, setSelectedPerson] = useState('');
    const [amount, setAmount] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    async function payPessoa(person_id: string, amount: string) {
        if (!person_id || !amount) {
            return;
        }
        const response = await fetch(createLinkForBackend() + '/payPessoa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                ID: person_id,
                dindin: amount,
            }),
        });

        if (response.ok) {
            console.log('Request successful');
        } else {
            console.error('Request failed');
        }
    }

    // Function to handle payment
    const handlePayment = async () => {
        if (!selectedPerson || !amount) {
            return;
        }
        await payPessoa(selectedPerson, amount);
        window.location.reload();
    };


    async function getDespesas(person_id: string) {
        try {
            const response = await fetch(createLinkForBackend() + `/debtPessoa/${person_id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching despesas:', error);
        }
    }

    async function getPessoas() {
        try {
            const response = await fetch(createLinkForBackend() + '/getPersons', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });
            const data = await response.json();
            for (let i = 0; i < data.length; i++) {
                data[i].despesas = await getDespesas(data[i].id);
            }
            setPessoasArr(data);
        } catch (error) {
            console.error('Error fetching persons:', error);
        }
    }

    useEffect(() => {
        getPessoas();
    }, []);

    return (
        <>
            <button
                className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 px-6 rounded-full shadow-lg hover:from-green-500 hover:to-blue-600 transition duration-300 transform hover:scale-105 flex items-center"
                onClick={handleShow}
            >
                <span className="mr-2">💰</span> Despesas
            </button>

            {show && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen text-center">
                        <div className="fixed inset-0 bg-black opacity-50"></div>
                        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg w-full z-50">
                            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-4">
                                <h3 className="text-3xl font-bold text-white flex items-center">
                                    <span className="mr-2">📊</span> Despesas
                                </h3>
                            </div>
                            <div className="px-6 py-4">
                                <div className="mb-4">
                                    <select
                                        value={selectedPerson}
                                        onChange={(e) => setSelectedPerson(e.target.value)}
                                        className="border rounded py-2 px-3 w-full"
                                    >
                                        <option value="">Select a person</option>
                                        {pessoasArr.map((person) => (
                                            <option key={person.id} value={person.id}>
                                                {person.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="Enter amount"
                                        className="border rounded py-2 px-3 w-full"
                                    />
                                </div>
                                <button
                                    onClick={() => setShowConfirmation(true)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Pagar
                                </button>
                            </div>
                            {showConfirmation && (
                                <div className="fixed z-20 inset-0 flex items-center justify-center overflow-y-auto">
                                    <div className="flex items-center justify-center min-h-screen">
                                        <div className="fixed inset-0 bg-black opacity-50"></div>
                                        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-sm w-full z-50">
                                            <div className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-4">
                                                <h3 className="text-2xl font-bold text-white">Confirmar Pagamento</h3>
                                            </div>
                                            <div className="px-6 py-4">
                                                <p>Tem certeza que deseja realizar este pagamento?</p>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-3 flex justify-center">
                                                <button
                                                    className="mr-4 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none"
                                                    onClick={() => setShowConfirmation(false)}
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-600 focus:outline-none"
                                                    onClick={async () => {
                                                        await handlePayment();
                                                        setShowConfirmation(false);
                                                    }}
                                                >
                                                    Pagar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="overflow-y-auto max-h-64 px-6 py-4">
                                <div className="px-6 py-4">
                                    {pessoasArr.map((person) => {
                                        const difference = person.despesas - person.pricetopay;
                                        return (
                                            <div key={person.id} className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
                                                <p className="text-xl font-semibold flex items-center">
                                                    <span className="mr-2">👤</span> {person.name}
                                                </p>
                                                <p className="flex items-center">
                                                    <span className="mr-2">💵</span> Pago: {person.pricetopay}€
                                                </p>
                                                <p className="flex items-center">
                                                    <span className="mr-2">💰</span> Total Despesas: {person.despesas}€
                                                </p>
                                                <p className={`flex items-center ${difference >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                    <span className="mr-2">🧮</span> Diferença: {difference}€
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 flex justify-end">
                                <button
                                    className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    onClick={handleClose}
                                >
                                    Fechar ✖️
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ModalPrecos;
