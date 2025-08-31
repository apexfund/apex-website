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
      className="bg-[#F1EDEE] rounded-xl pt-10 !pb-8 px-6 flex flex-col items-center mx-auto transition-all duration-300 ease-in-out border-2 border-transparent cursor-pointer"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-24 h-24 rounded-full object-cover !mb-4 !mt-4 transition-transform duration-300"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-4xl text-gray-400 transition-transform duration-300">
          <span role="img" aria-label="Member Image">🧑‍💼</span>
        </div>
      )}
      <h2 className="!text-2xl !font-extrabold text-center mb-1 transition-colors duration-300">{name}</h2>
      <div className="text-sm text-gray-600 font-medium !mb-1 text-center transition-colors duration-300">{role}</div>
      {team && <div className="text-sm text-gray-400 mb-1 text-center transition-colors duration-300">{team}</div>}
      {bio && <p className="text-sm text-gray-500 mt-2 text-center pb-4 transition-colors duration-300">{bio}</p>}
    </div>
  );

  return linkedinUrl ? (
    <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="block">
      {cardContent}
    </a>
  ) : cardContent;
};

export default MemberCard;