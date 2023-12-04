import React from 'react';

const PersonCard = ({ name, email, photoUrl, description }) => {
    return (
        <div className="max-w-xs p-4 bg-gray-800 rounded-md shadow-md hover:shadow-lg mt-6">
            <img src={photoUrl} alt={name} className="w-full h-80 object-cover mb-4 rounded-md" />
            <h2 className="text-lg font-semibold mb-2 text-white">Name : {name}</h2>
            <h2 className="text-lg font-semibold mb-2 text-white">Email : {email}</h2>
            <p className="text-sm text-white">{description}</p>
        </div>
    );
};

export default PersonCard;