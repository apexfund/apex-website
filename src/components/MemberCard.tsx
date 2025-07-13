import React from 'react';

interface MemberCardProps {
  name: string;
  role: string;
  team?: string;
  bio?: string;
  imageUrl?: string;
  linkedinUrl?: string;
}

const MemberCard: React.FC<MemberCardProps> = ({ name, role, team, bio, imageUrl, linkedinUrl }) => {
  const cardContent = (
    <div
      className="bg-white rounded-xl shadow-md pt-10 !pb-8 px-6 flex flex-col items-center w-64 mx-auto transition-all duration-300 ease-in-out border-2 border-transparent hover:border-[#97C3D4] hover:shadow-lg hover:scale-105 cursor-pointer group"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-24 h-24 rounded-full object-cover !mb-4 !mt-4 transition-transform duration-300 group-hover:scale-110"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-4xl text-gray-400 transition-transform duration-300 group-hover:scale-110">
          <span role="img" aria-label="Member Image">🧑‍💼</span>
        </div>
      )}
      <h2 className="!text-2xl !font-extrabold text-center mb-1 transition-colors duration-300 group-hover:text-[#97C3D4]">{name}</h2>
      <div className="text-sm text-gray-600 font-medium !mb-1 text-center transition-colors duration-300 group-hover:text-[#6B9CB0]">{role}</div>
      {team && <div className="text-sm text-gray-400 mb-1 text-center transition-colors duration-300 group-hover:text-[#8BB5C6]">{team}</div>}
      {bio && <p className="text-sm text-gray-500 mt-2 text-center pb-4 transition-colors duration-300 group-hover:text-gray-600">{bio}</p>}
    </div>
  );

  return linkedinUrl ? (
    <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="block">
      {cardContent}
    </a>
  ) : cardContent;
};

export default MemberCard;