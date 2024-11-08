import { get } from 'http';
import React, { useState, useEffect } from 'react';

interface Event {
    id: string;
    name: string;
}

type Person = {
    id: string;
    name: string;
    pricetopay: number;
};

function createLinkForBackend() {
    const our_url = window.location.href;
    //change the port to 9000
    const url = new URL(our_url);
    url.port = '9000';
    return url.origin;
}

interface ModalPessoasProps {}

const ModalPessoas: React.FC<ModalPessoasProps> = () => {
    const [pessoasArr, setPessoasArr] = useState<Person[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [isOpen, setIsOpen] = useState(false);
    
    function getPessoas() {
        fetch(createLinkForBackend() + '/getPersons', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            setPessoasArr(data);
        })
        .catch(error => console.error('Error fetching persons:', error));
    }
    useEffect(() => {
        getPessoas();
    }, []);

    const handleCreatePerson = async () => {
        const response = await fetch(createLinkForBackend() + '/createPerson', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                Name: inputValue,
                pricetopay: '0',
            }),
        });

        if (response.ok) {
            console.log('Request successful');
            getPessoas();
        } else {
            console.error('Request failed');
        }
    };

    const handleRemovePessoa = async (id: string) => { //deletePerson?ID=4
        const response = await fetch(`http://localhost:9000/deletePerson?ID=${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log('Request successful');
            getPessoas();
        } else {
            console.error('Request failed');
        }
    }


    return (
        <div>
            <button onClick={() => setIsOpen(true)} className="bg-gradient-to-r from-purple-500 to-purple-700 text-white py-3 px-6 rounded-full shadow-lg hover:from-purple-600 hover:to-purple-800 transition duration-300 transform hover:scale-105">
                + Gerir Pessoas
            </button>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg w-full max-w-lg shadow-lg">
                        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Gerir Pessoas</h2>
                        <div className="input-group mb-6 flex">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Adicionar pessoa"
                                className="w-full p-3 border border-gray-300 rounded-l-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button onClick={handleCreatePerson} className="bg-purple-600 text-white p-3 rounded-r-lg hover:bg-purple-700 transition duration-300">
                                Adicionar
                            </button>
                        </div>
                        <div className="max-h-64 overflow-y-auto mb-6">
                            <ul className="divide-y divide-gray-200">
                               {pessoasArr && pessoasArr.map((person, index) => (
                                    <li key={index} className="flex justify-between items-center py-2 px-4 hover:bg-gray-100 transition duration-300">
                                        <span className="text-gray-800">{person.name}</span>
                                        <button onClick={() => handleRemovePessoa(person.id)} className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition duration-300">
                                            Apagar
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="bg-gray-300 text-gray-700 p-2 rounded mt-4 shadow-lg hover:bg-gray-400 transition duration-300 transform">
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModalPessoas;
