import React, { useState } from 'react';
import { Stethoscope, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

interface Doctor {
    name: string;
    specialization: string;
    hospital: string;
    contact: string;
    email: string;
    location: string;
    mapLink: string;
}

interface DoctorRecommendationProps {
    predictedCondition: string;
}

const DoctorRecommendation: React.FC<DoctorRecommendationProps> = ({ predictedCondition }) => {
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

    // Sample doctor data - In a real application, this would come from a database
    const doctors: Record<string, Doctor[]> = {
        'Depression': [
            {
                name: "Dr. Lakshmi Vijayakumar",
                specialization: "Clinical Psychologist",
                hospital: "SNEHA Suicide Prevention Centre",
                contact: "+91 44 2464 0050",
                email: "help@snehaindia.org",
                location: "11, Park View Road, R.A. Puram, Chennai",
                mapLink: "https://maps.google.com/?q=11+Park+View+Road,+R.A.+Puram,+Chennai"
            }
        ],
        'Anxiety': [
            {
                name: "Dr. R. Sathianathan",
                specialization: "Psychiatrist",
                hospital: "Institute of Mental Health",
                contact: "+91 44 2641 1253",
                email: "imhchennai@gmail.com",
                location: "Institute of Mental Health, Medavakkam Tank Road, Kilpauk, Chennai",
                mapLink: "https://maps.google.com/?q=Institute+of+Mental+Health,+Kilpauk,+Chennai"
            }
        ],
        'Bipolar': [
            {
                name: "Dr. K. Harihara Subramanian",
                specialization: "Neuropsychiatrist",
                hospital: "VHS Hospital",
                contact: "+91 44 2254 1102",
                email: "info@vhschennai.org",
                location: "Rajiv Gandhi Salai, Taramani, Chennai",
                mapLink: "https://maps.google.com/?q=VHS+Hospital,+Taramani,+Chennai"
            }
        ],
        'PTSD': [
            {
                name: "Dr. Jayanthi Narayan",
                specialization: "Trauma Therapist",
                hospital: "SCARF (Schizophrenia Research Foundation)",
                contact: "+91 44 2628 7456",
                email: "scarf@vsnl.com",
                location: "R/7A, North Main Road, Anna Nagar West Extension, Chennai",
                mapLink: "https://maps.google.com/?q=SCARF,+Anna+Nagar,+Chennai"
            }
        ],
        'Insomnia': [
            {
                name: "Dr. N. Ramakrishnan",
                specialization: "Sleep Specialist",
                hospital: "Nithra Institute of Sleep Sciences",
                contact: "+91 44 2235 2235",
                email: "info@nithra.com",
                location: "No. 7, 1st Main Road, United India Colony, Kodambakkam, Chennai",
                mapLink: "https://maps.google.com/?q=Nithra+Institute+of+Sleep+Sciences,+Chennai"
            }
        ],
        'Stress': [
            {
                name: "Ms. Priya Sreedhar",
                specialization: "Counselor",
                hospital: "Vandrevala Foundation Helpline",
                contact: "9152987821",
                email: "info@vandrevalafoundation.com",
                location: "Chennai",
                mapLink: "https://www.vandrevalafoundation.com/"
            }
        ]
    };

    const availableDoctors = doctors[predictedCondition] || [];

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Recommended Specialists</h2>
                        <p className="text-gray-600 mt-1">Find the right professional for your needs</p>
                    </div>
                    <Stethoscope className="w-8 h-8 text-indigo-500" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Doctor List */}
                    <div className="space-y-4">
                        <div className="bg-indigo-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Available Specialists</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Select a specialist to view their details
                            </p>
                            <div className="grid grid-cols-1 gap-3">
                                {availableDoctors.map((doctor) => (
                                    <button
                                        key={doctor.name}
                                        onClick={() => setSelectedDoctor(doctor)}
                                        className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${selectedDoctor?.name === doctor.name
                                            ? 'bg-indigo-100 border-indigo-200'
                                            : 'bg-white border-gray-200 hover:bg-indigo-50'
                                            } border`}
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{doctor.name}</h4>
                                            <p className="text-sm text-gray-500">{doctor.specialization}</p>
                                        </div>
                                        <span className="text-xs font-medium text-indigo-500 bg-indigo-50 px-2 py-1 rounded">
                                            {doctor.hospital}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Doctor Details */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        {selectedDoctor ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">{selectedDoctor.name}</h3>
                                    <span className="text-sm font-medium text-indigo-500 bg-indigo-50 px-2 py-1 rounded">
                                        {selectedDoctor.specialization}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span>{selectedDoctor.hospital}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span>{selectedDoctor.location}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Phone className="w-4 h-4 mr-2" />
                                        <span>{selectedDoctor.contact}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Mail className="w-4 h-4 mr-2" />
                                        <span>{selectedDoctor.email}</span>
                                    </div>
                                </div>

                                <a
                                    href={selectedDoctor.mapLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                                >
                                    <MapPin className="w-4 h-4 mr-2" />
                                    View Location
                                    <ExternalLink className="w-4 h-4 ml-2" />
                                </a>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                <div className="text-center">
                                    <Stethoscope className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <p>Select a specialist to view their details</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorRecommendation; 