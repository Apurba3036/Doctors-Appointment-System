import React, { useEffect, useState } from "react";

const PrescriptionList = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const response = await fetch("http://localhost:8000/get_prescriptions");
                const data = await response.json();
                setPrescriptions(data.data);
            } catch (error) {
                console.error("Error fetching prescriptions:", error);
            }
        };

        fetchPrescriptions();
    }, []);

    // Open modal and set selected prescription
    const openModal = (prescription) => {
        setSelectedPrescription(prescription);
        setIsModalOpen(true);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen mt-60">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">Prescription List</h2>
            <div className="overflow-x-auto">
                <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">Timestamp</th>
                            <th className="py-3 px-4 text-left">Doctor Notes</th>
                            <th className="py-3 px-4 text-left">Audio</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prescriptions.map((pres, index) => (
                            <tr key={index} className="border-b hover:bg-gray-200 transition">
                                <td className="py-3 px-4">{pres.timestamp}</td>
                                <td className="py-3 px-4 truncate max-w-xs">{pres.doctor_notes}</td>
                                <td className="py-3 px-4">
                                    {pres.audio_file_id ? (
                                        <a
                                            href={`http://localhost:8000/audio/${pres.audio_file_id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 font-semibold hover:underline"
                                        >
                                            Listen
                                        </a>
                                    ) : (
                                        <span className="text-gray-500">No Audio</span>
                                    )}
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <button
                                        onClick={() => openModal(pres)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                                    >
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && selectedPrescription && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
                        <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">Prescription Details</h3>
                        <pre className="bg-gray-100 p-4 rounded-lg text-gray-700 whitespace-pre-wrap">{selectedPrescription.structured_prescription}</pre>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg w-full transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrescriptionList;
