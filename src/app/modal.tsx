import React, { useState, useEffect, use } from 'react';

type Person = {
    id: string;
    name: string;
    pricetopay: number;
};

type Route = {
    id: string;
    name: string;
    price: number;
    startName: string;
    endName: string;
    distance: number;
};

function createLinkForBackend() {
    return "http://localhost:9000"
}

const Modal: React.FC<{ onEventsChange: (events: any[]) => void }> = ({ onEventsChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [eventsArr] = useState<any[]>([]);
    const [selectedPerson, setSelectedPerson] = useState<string[]>([]);
    const [people, setPeople] = useState<Person[]>([]);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

    function getPessoas() {
        fetch(createLinkForBackend() + '/getPersons', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                setPeople(data);
            })
            .catch(error => console.error('Error fetching persons:', error));
    }

    useEffect(() => {
        onEventsChange(eventsArr);
        setSelectedPerson([]);
    }, [eventsArr, onEventsChange]);




    function getRoutes() {
        fetch(createLinkForBackend() + '/getRoutes', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                setRoutes(data);
            })
            .catch(error => console.error('Error fetching routes:', error));
    }
    useEffect(() => {
        if (typeof window !== 'undefined')
        {
            //call ao backend /getRoutes
            getRoutes();
            getPessoas();
            setSelectedPerson([]);
        }
    }, [])

    const callBackEndAddEvento = async (title: string, start: string, end: string, desc: string, person_id: string, selectedRoute: string) => {
        const response = await fetch(createLinkForBackend() + '/createEvent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Start: start,
                End: end,
                Description: desc,
                Title: title,
                personsID: person_id,
                RouteID: selectedRoute,
            }),
        });

        if (response.ok)
        {
            console.log('Request successful');
            console.log(start, end, desc, title, person_id, selectedRoute);
        } else
        {
            console.error('Request failed');
        }
    };

    const handleAddEvent = async () => {
        const eventDate = (document.getElementById('eventDate') as HTMLInputElement).value;
        const eventDateEnd = (document.getElementById('eventDateEnd') as HTMLInputElement).value;

        if (!selectedRoute)
        {
            console.log('Route selection is required');
            return;
        }

        if (selectedPerson && selectedPerson.length > 0)
        {
            let title = '';
            let personsID = '';
            selectedPerson.forEach(person => {
                console.log(person);
                title += person.split("//&&//")[0] + ' & ';
                personsID += person.split("//&&//")[1] + '//';
            });
            title = title.slice(0, -3);
            personsID = personsID.slice(0, -2);

            console.log(title);
            console.log(personsID);
            await callBackEndAddEvento(title, eventDate, eventDateEnd === '' ? eventDate : eventDateEnd, "Não pago", personsID, selectedRoute);
        } else
        {
            console.log('Person selection is required');
        }
        window.location.reload();
    };

    async function deleteFOdase(id: string) {
        const response = await fetch(createLinkForBackend() + '/deleteEvent?ID=' + id, {
            method: 'DELETE',
        });

        if (response.ok)
        {
            console.log('Request successful');
            getPessoas();
        } else
        {
            console.error('Request failed');
        }
    }

    const handleDeleteEvent = () => {
        const eventDate = (document.getElementById('eventDate') as HTMLInputElement).value;
        let eventDateEnd = (document.getElementById('eventDateEnd') as HTMLInputElement).value;

        eventDateEnd = (eventDateEnd === '') ? eventDate : eventDateEnd;

        selectedPerson.forEach(person => {
            let personManhosa = person.split("//&&//");
            let pessoaNameToDelete = personManhosa[0];
            fetch(createLinkForBackend() + '/getEvents', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    for (let i = 0; i < data.length; i++)
                    {
                        if (data[i].start == eventDate && data[i].end == eventDateEnd && data[i].title == pessoaNameToDelete)
                        {
                            deleteFOdase(data[i].id);
                        }
                    }
                })
                .catch(error => console.error('Error fetching persons:', error));
        });
    };

    function handleOpenModal() {
        setIsOpen(true);
        setSelectedPerson([]);
    }

    return (
        <div>
            <button onClick={handleOpenModal} className="bg-gradient-to-r from-purple-500 to-purple-700 text-white py-3 px-6 rounded-full shadow-lg hover:from-purple-600 hover:to-purple-800 transition duration-300 transform hover:scale-105">
                + Gerir Eventos
            </button>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Gerir Eventos</h2>
                        <div className="mb-6">
                            <label htmlFor="personSelect" className="block text-sm font-medium text-gray-700 mb-2">Selecione pessoas</label>
                            <div id="personSelect" className="mb-4">
                                {people && people.map(person => (
                                    <div key={person.id} className="flex items-center mb-2">
                                        <input
                                            type="checkbox"
                                            id={`person-${person.id}`}
                                            value={`${person.name}//&&//${person.id}`}
                                            onChange={(e) => {
                                                const selected = [...selectedPerson] as string[];
                                                if (e.target.checked)
                                                {
                                                    selected.push(e.target.value);
                                                } else
                                                {
                                                    const index = selected.indexOf(e.target.value);
                                                    if (index > -1)
                                                    {
                                                        selected.splice(index, 1);
                                                    }
                                                }
                                                setSelectedPerson(selected);
                                                console.log(selected);
                                            }}
                                            className="mr-2"
                                        />
                                        <label htmlFor={`person-${person.id}`} className="text-gray-700">{person.name}</label>
                                    </div>
                                ))}
                            </div>
                            <label htmlFor="routeSelect" className="block text-sm font-medium text-gray-700 mb-2">Selecione uma rota</label>
                            <select
                                id="routeSelect"
                                className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setSelectedRoute(e.target.value)}
                            >
                                <option value="">Selecione uma rota</option>
                                {routes && routes.map(route => (
                                    <option key={route.id} value={route.id}>{route.name}</option>
                                ))}
                            </select>

                            <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-2">Data início</label>
                            <input
                                type="date"
                                id="eventDate"
                                className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <label htmlFor="eventDateEnd" className="block text-sm font-medium text-gray-700 mb-2">Data fim</label>
                            <input
                                type="date"
                                id="eventDateEnd"
                                className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button onClick={handleAddEvent} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                Adicionar
                            </button>
                            <button onClick={handleDeleteEvent} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                                Apagar
                            </button>
                            <button onClick={() => setIsOpen(false)} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Modal;
