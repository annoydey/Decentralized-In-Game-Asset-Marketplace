import React from 'react';
import Navbar from '../Navbar/Navbar';
import PersonCard from './PersonCard';

const About = ({contract, account, gameBitBalance}) => {
  const people = [
    {
      name: 'Jordan McEntee',
      email:'jtmcente@buffalo.edu',
      photoUrl: 'https://cdn.pixabay.com/photo/2014/04/02/10/54/person-304893_1280.png',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      name: 'Annoy Dey',
      email: 'annoydey@buffalo.edu',
      photoUrl: 'https://cdn.pixabay.com/photo/2014/04/02/10/54/person-304893_1280.png',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
  ];

  return (
    <div className="bg-blue-500 min-h-screen flex flex-col">
        <Navbar account={account} gameBitBalance={gameBitBalance}/>
        <div className="bg-black p-4 rounded-md shadow-md hover:shadow-lg mt-6 mr-6 mb-6 ml-6">
            <h1 className="text-xl font-bold text-center text-white">About Us</h1>
        </div>

        <div className="lg:space-x-8 flex flex-col lg:flex-row justify-center items-center">
            {people.map((person, index) => (
            <PersonCard
                key={index}
                name={person.name}
                email={person.email}
                photoUrl={person.photoUrl}
                description={person.description}
            />
            ))}
        </div>
    </div>
  );
};

export default About;