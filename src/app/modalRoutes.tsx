import { get } from 'http';
import React, { useState, useEffect } from 'react';

type Route = {
    id: string;
    name: string;
    price: number;
    startName: string;
    endName: string;
    distance: number;
};

function createLinkForBackend() {
    const our_url = window.location.href;
    //change the port to 9000
    const url = new URL(our_url);
    url.port = '9000';
    return url.origin;
}

interface ModalRoutesProps { }

const ModalRoutes: React.FC<ModalRoutesProps> = () => {
    const [routes, setRoutes] = useState<string[]>([]);
    const [routesArr, setRoutesArr] = useState<Route[]>([]);
    const [inputNameValue, setInputNameValue] = useState<string>('');
    const [inputPriceValue, setInputPriceValue] = useState<string>('');
    const [inputStartValue, setInputStartValue] = useState<string>('');
    const [inputEndValue, setInputEndValue] = useState<string>('');
    const [inputDistanceValue, setInputDistanceValue] = useState<string>('');
    const [isOpen, setIsOpen] = useState(false);

    function getRoutes() {
        fetch(createLinkForBackend() + '/getRoutes', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                setRoutesArr(data);
            })
            .catch(error => console.error('Error fetching routes:', error));
    }
    useEffect(() => {
        getRoutes();
    }, []);

    const handleCreateRoutes = async () => {
        const response = await fetch(createLinkForBackend() + '/createRoute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                Name: inputNameValue,
                Price: inputPriceValue,
                Start: inputStartValue,
                End: inputEndValue,
                Distance: inputDistanceValue
            }),
        });

        if (response.ok) {
            console.log('Request successful');
        } else {
            console.error('Request failed');
        }
        window.location.reload();
    };

    const handleRemoveRout = async (id: string) => {
        const response = await fetch(`http://localhost:9000/deleteRoute?ID=${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log('Request successful');
        } else {
            console.error('Request failed');
        }
        window.location.reload();
    }


    return (
        <div>
            <button onClick={() => setIsOpen(true)} className="bg-gradient-to-r from-purple-500 to-purple-700 text-white py-3 px-6 rounded-full shadow-lg hover:from-purple-600 hover:to-purple-800 transition duration-300 transform hover:scale-105">
                + Gerir Rotas
            </button>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 overflow-y-auto">
                    <div className="bg-white p-8 rounded-lg w-full max-w-2xl">
                        <h2 className="text-2xl font-bold mb-4">Gerir Rotas</h2>

                        <input
                            type="text"
                            value={inputNameValue}
                            onChange={(e) => setInputNameValue(e.target.value)}
                            placeholder="Nome"
                            className="w-full p-2 border border-gray-300 rounded mb-2 text-black flex-grow"
                        />
                        <input
                            type="number"
                            value={inputPriceValue}
                            onChange={(e) => setInputPriceValue(e.target.value)}
                            placeholder="Preço"
                            className="w-full p-2 border border-gray-300 rounded mb-2 text-black flex-grow"
                        />
                        <input
                            type="text"
                            value={inputStartValue}
                            onChange={(e) => setInputStartValue(e.target.value)}
                            placeholder="Ponto de Inicio"
                            className="w-full p-2 border border-gray-300 rounded mb-2 text-black flex-grow"
                        />
                        <input
                            type="text"
                            value={inputEndValue}
                            onChange={(e) => setInputEndValue(e.target.value)}
                            placeholder="Ponto de Fim"
                            className="w-full p-2 border border-gray-300 rounded mb-2 text-black flex-grow"
                        />
                        <input
                            type="number"
                            value={inputDistanceValue}
                            onChange={(e) => setInputDistanceValue(e.target.value)}
                            placeholder="Distancia"
                            className="w-full p-2 border border-gray-300 rounded mb-2 text-black flex-grow"
                        />
                        <button onClick={handleCreateRoutes} className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-2 rounded w-full hover:from-purple-600 hover:to-purple-800 transition duration-300 transform">
                            Adicionar
                        </button>

                        <div className="max-h-64 mt-7 overflow-y-auto">
                            <ul>
                                {routesArr && routesArr.map((route, index) => (
                                    <li
                                        key={index}
                                        className="bg-white shadow rounded-lg p-4 mb-4 border border-gray-300 hover:bg-gray-100"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-xl font-semibold">{route.name}</h3>
                                                <p className="text-gray-500">
                                                    {route.startName} ➡️ {route.endName}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveRout(route.id)}
                                                className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition duration-300"
                                            >
                                                Apagar
                                            </button>
                                        </div>
                                        <div className="mt-2 flex items-center text-gray-700">
                                            <div className="flex items-center mr-4">
                                                <span className="text-lg">💵</span>
                                                <span className="ml-1">{route.price}€</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-lg">📏</span>
                                                <span className="ml-1">{route.distance} Km</span>
                                            </div>
                                        </div>
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

export default ModalRoutes;
