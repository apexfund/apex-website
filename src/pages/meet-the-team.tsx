import { useState } from 'react';
import Header from '../components/header'
import Footer from '../components/footer'
import MemberCard from '../components/MemberCard';
import { PRIMARY_FONT_FAMILY } from '../utils/constants';
import Background from '../components/Background';

const MeetTheTeam = () => {
  

  const quantitativeMembers = [
    {
      name: "Vishesh Gupta",
      role: "Senior Quant Analyst",
      team: "Quantitative Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQG-i2rm5VjOZA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1728014942451?e=1758153600&v=beta&t=vZDQCmY51KGmtlzF7gx7_GIRuiWVU-sWimXj75yk5bA',
      linkedIn: 'https://www.linkedin.com/in/visheshng/'
    },
    {
      name: "Aditya Dabeer",
      role: "Senior Quant Analyst",
      team: "Quantitative Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/C4E03AQGoJ00tBzreOQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1625952151426?e=1758153600&v=beta&t=yuwq1hXIKNuyVwV6BaSQTYUmRxAaLcX7AwVg5UBU3TA',
      linkedIn: 'https://www.linkedin.com/in/adityadabeer/'
    },
    {
      name: "Nirav Koley",
      role: "Senior Quant Analyst",
      team: "Quantitative Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQHr7L_2iuz9IA/profile-displayphoto-shrink_200_200/B4EZdQ6mNxHgAc-/0/1749409228037?e=1758153600&v=beta&t=H2IO35STDXu4XgomrQY4E3dhKhdSNetleawDGtatv1Y',
      linkedIn: 'https://www.linkedin.com/in/nirav-koley/'
    },
    {
      name: "Caleb Chang",
      role: "Quant Analyst",
      team: "Quantitative Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQEWadqsi6uAuw/profile-displayphoto-shrink_200_200/B4EZc4RcsMHYAY-/0/1748995793117?e=1758153600&v=beta&t=5lGaIQx2YarpyavRrMxY-kXsaBWWGp4T-DPMpWIJXv0',
      linkedIn: 'https://www.linkedin.com/in/cchang22/'
    },
    {
      name: "Daniel Wang",
      role: "Quant Analyst",
      team: "Quantitative Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D5603AQENILk5AeYIdA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1692668795534?e=1758153600&v=beta&t=wXBzxb9EtKiEQodPUgKTbRFwK2dP4F6OdRiHWpqVJuw',
      linkedIn: 'https://www.linkedin.com/in/daniel-e-wang/'
    },
    {
      name: "Edward Song",
      role: "Quant Analyst",
      team: "Quantitative Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQGer1ICctlSag/profile-displayphoto-shrink_200_200/B4EZVx807xHgAY-/0/1741373526346?e=1758153600&v=beta&t=uoHczB7oA9pfmeTfA5MydhkAarm_3Zgab1iDjsOqSrs',
      linkedIn: 'https://www.linkedin.com/in/edwardrsong/'
    },
    {
      name: "Krishi Cherukupalli",
      role: "Junior Quant Analyst",
      team: "Quantitative Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQF-jBjapTB3MA/profile-displayphoto-shrink_200_200/B4EZVLAkyUHUAY-/0/1740720197078?e=1758153600&v=beta&t=BT4q6_9jxDopI2txV4QkIF-ir6RnBaGgFlOd3JqaAXU',
      linkedIn: 'https://www.linkedin.com/in/krishi-cherukupalli/'
    },
    {
      name: "Narain Sriam",
      role: "Junior Quant Analyst",
      team: "Quantitative Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQHdDBbTtnMzdQ/profile-displayphoto-shrink_800_800/B4EZbKw_PxGQAg-/0/1747158562165?e=1758153600&v=beta&t=Kto5RO5Ivjeg1jUpjREwM-AHO13Z2-CrBTYauIuaNGg',
      linkedIn: 'https://www.linkedin.com/in/narainsriram/'
    },
    {
      name: "Pranav Bykampadi",
      role: "Junior Quant Analyst",
      team: "Quantitative Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D5603AQELYR4NQfgTWA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1730678756654?e=1758153600&v=beta&t=1JbT2p4pDOrdfE2TELKZVO5R9jLAPJo5Fiug7WAPa40',
      linkedIn: 'https://www.linkedin.com/in/pranav-bykampadi-b89162262/'
    },
    {
      name: "Sachin Satish Kumar",
      role: "Junior Quant Analyst",
      team: "Quantitative Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQFd_OqaaiB-_w/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1664753014858?e=1758153600&v=beta&t=3Kd5VhZA2Hx8_wl0_JNmB-WPFlSYBZaFoFVWCYKhcq4',
      linkedIn: 'https://www.linkedin.com/in/sachin-satishkumar/'
    },
    {
      name: "Shivam Amin",
      role: "Junior Quant Analyst",
      team: "Quantitative Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQFkHvDcCMLfFA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1696305311664?e=1758153600&v=beta&t=c24HwVtmdWSmCJmZcACBODkfsysfB1N84hgUFqUhaoc',
      linkedIn: 'https://www.linkedin.com/in/shivamamin05/'
    },
    {
      name: "Eshan Khan",
      role: "Junior Quant Analyst",
      team: "Quantitative Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQGLZ3hNzF0bxw/profile-displayphoto-shrink_200_200/B4EZRx3pzpG0Ac-/0/1737077202463?e=1758153600&v=beta&t=77FMGgJDU92fCxGzpm0lcbH5YdO7E8FVdEK9TocNNq4',
      linkedIn: 'https://www.linkedin.com/in/eshankhan05/'
    },
    {
      name: "Varun Rao",
      role: "Junior Quant Analyst",
      team: "Quantitative Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/C4E03AQEmzB7FxqZstA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1638240266203?e=1758153600&v=beta&t=eLHV_ue-lzlUxB3pKaPeDYCJyUnf6Osiy96MeJfRg3k',
      linkedIn: 'https://www.linkedin.com/in/varunvrao/'
    },
    {
      name: "Viraj Urs",
      role: "Junior Quant Analyst",
      team: "Quantitative Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQG_HmeU_2pbng/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1722256276435?e=1758153600&v=beta&t=mIU0rQTy1YcEbiDbrTvClwvwzcxADl_R8f4xN0l1kRk',
      linkedIn: 'https://www.linkedin.com/in/viraj-urs/'
    }
  ];

  const fundamentalMembers = [
    // Add your fundamental division members here
    {
      name: "Peerce Nozeika",
      role: "Portfolio Manager",
      team: "Fundamental Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQFPu56OYu85zw/profile-displayphoto-shrink_800_800/B4EZawJUi2HcAk-/0/1746711956605?e=1758153600&v=beta&t=otgVIs1oaChW4ZtDZqHD3a80IrfRsk_cBtTNWKhsl6U',
      linkedIn: 'https://www.linkedin.com/in/peercenozeika/'
    },
    {
      name: "Ryan Middlestat",
      role: "Portfolio Manager",
      team: "Fundamental Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQHEs4ig1isV0Q/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1711564639360?e=1758153600&v=beta&t=qlROGDxotEGdSUtDucg5MNUoUZRQactqFjZOgAUQeLE',
      linkedIn: 'https://www.linkedin.com/in/ryan-middlestadt/'
    },
    {
      name: "Mayank Barnwal",
      role: "Analyst",
      team: "Fundamental Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4D03AQGNzBhJjrd6wQ/profile-displayphoto-shrink_800_800/B4DZdrJdkjHMAc-/0/1749849334105?e=1758153600&v=beta&t=AthufCCixO_Uw0OKBuMZpAjJV_z4aOVftX7LtMN3s6k',
      linkedIn: 'https://www.linkedin.com/in/mayank-barnwal/'
    },
    {
      name: "Martin Linsky",
      role: "Analyst",
      team: "Fundamental Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQEtGnhut3POeg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1694811454522?e=1758153600&v=beta&t=CGDNvnsqnfK2PQ9jJFXzVsiQtiv9oj6AMM9fVRv-XBI',
      linkedIn: 'https://www.linkedin.com/in/martin-linsky/'
    },
    {
      name: "Patrick Eskildsen",
      role: "Analyst",
      team: "Fundamental Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQGrbfVBRENSIQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1678385028497?e=1758153600&v=beta&t=quLmFEnpCiTP0fdtHi1I1i5DuZGoHxTsdDtT4SHQh0E',
      linkedIn: 'https://www.linkedin.com/in/patrick-eskildsen/'
    },
    {
      name: "Tyson Nguyen",
      role: "Analyst",
      team: "Fundamental Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQH_LlBK68Uy3g/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1687455108942?e=1758153600&v=beta&t=34pnQ5PsjBn_BY90FauhdN9cjwv7P_PtKxlNUFAJijg',
      linkedIn: 'https://www.linkedin.com/in/tyson-nguyen-b40920233/'
    },
    {
      name: "Cooper Dorf",
      role: "Analyst",
      team: "Fundamental Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQEtGnhut3POeg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1694811454522?e=1758153600&v=beta&t=CGDNvnsqnfK2PQ9jJFXzVsiQtiv9oj6AMM9fVRv-XBI',
      linkedIn: 'https://www.linkedin.com/in/cooper-dorf/'
    },
    {
      name: "Emilio Gallo",
      role: "Analyst",
      team: "Fundamental Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQEFgHHkpff7XQ/profile-displayphoto-shrink_800_800/B4EZadNCbSHoAw-/0/1746394163537?e=1758153600&v=beta&t=l2yK_Np1y_dr_lVaLDonh38FOJzAeIs5WqujqwVYXzg',
      linkedIn: 'https://www.linkedin.com/in/emiliogallo/'
    },
    {
      name: "Gage Hamilton",
      role: "Junior Analyst",
      team: "Fundamental Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQG1YK4k2WjXXQ/profile-displayphoto-shrink_800_800/B4EZSovth5GgAc-/0/1737997867921?e=1758153600&v=beta&t=hixRzUFBPzJzDCKfnPMceajVrJVHk8X87HZvSXkYfYM',
      linkedIn: 'https://www.linkedin.com/in/gage-hamilton-aa8718284/'
    },
    {
      name: "Kevin Bowles",
      role: "Junior Analyst",
      team: "Fundamental Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4D03AQEi8L8RWOBoRQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1726710758853?e=1758153600&v=beta&t=xE8A7iaq-s92QAa6P7XUYjwf1vcp7c-E5xxLGWlWR4Y',
      linkedIn: 'https://www.linkedin.com/in/kevin-bowles-8239a9321/'
    },
    {
      name: "Leo Paradise",
      role: "Junior Analyst",
      team: "Fundamental Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4D03AQFU2TDw38JtnA/profile-displayphoto-shrink_800_800/B4DZU.j02lHkAc-/0/1740511334202?e=1758153600&v=beta&t=mQ6mIPErYds3By0tW3QnMtrQCwarhXe_Zx-mkZ9fHU0',
      linkedIn: 'https://www.linkedin.com/in/leo-paradise-23b282328/'
    },
    {
      name: "Matthew Vacek",
      role: "Junior Analyst",
      team: "Fundamental Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQHOQyqzF1mi_g/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1730470214354?e=1758153600&v=beta&t=RUiGgPd_ZVLHBou3EVUKIjE7TnaIEzsYoFjI8Dv03Ks',
      linkedIn: 'https://www.linkedin.com/in/matthew-c-vacek/'
    },
    {
      name: "Reed Plotnick",
      role: "Junior Analyst",
      team: "Fundamental Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQFgeeiIJv3Iig/profile-displayphoto-shrink_800_800/B4EZaNtJaJHMAc-/0/1746134146930?e=1758153600&v=beta&t=BD-xUKUPxgkqzqZYo0ZimOSPPWZkNL0hWztUZddjCJM',
      linkedIn: 'https://www.linkedin.com/in/reedplotnick/'
    },
    {
      name: "Tristan Wolf",
      role: "Junior Analyst",
      team: "Fundamental Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4D03AQFNDBrlyDoqQQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1730338824853?e=1758153600&v=beta&t=V-V6L021AAVyDvAcuqEA1HXuPiDip9XWTnW1mKlAhIA',
      linkedIn: 'https://www.linkedin.com/in/tristan-wolf-93293b333/'
    },
    {
      name: "Joseph Asselta",
      role: "Junior Analyst",
      team: "Fundamental Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQEDq-NPAHiIZw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1693441629038?e=1758153600&v=beta&t=BsLkY4Bwnbfn_BWO89V14ptLrTxMGJ5gR-o2IHuIlYU',
      linkedIn: 'https://www.linkedin.com/in/josephasselta/'
    },
    {
      name: "Michael Luther",
      role: "Junior Analyst",
      team: "Fundamental Team",
      imageUrl: '',
      linkedIn: 'https://www.linkedin.com/in/michael-a-luther/'
    },
    {
      name: "Isaac Kushnir",
      role: "Junior Analyst",
      team: "Fundamental Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D5603AQFvTlOxYic3_w/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1724858335338?e=1758153600&v=beta&t=sfACIo1CZsjk9uZBUs9RBGneOg7SAGw09EUP3lwE8YE',
      linkedIn: 'https://www.linkedin.com/in/isaac-kushnir/'
    },
    {
      name: "Royal Eze",
      role: "Junior Analyst",
      team: "Fundamental Team",
      imageUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQG9o-EL9XNzAQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1707718604479?e=1758153600&v=beta&t=E6fdZvdm7u7UhoPQUYo9QgEuZv8chkDI5ZD62vKfOnM',
      linkedIn: 'https://www.linkedin.com/in/royal-eze/'
    },
  ];

  const allMembers = [...quantitativeMembers, ...fundamentalMembers];

  return (
    <div className="relative min-h-screen">
      <Background />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex flex-col justify-center items-center p-8">
          <h1
            className="!mb-2 text-center w-full !max-w-3xl !text-7xl mx-auto"
            style={{ fontFamily: PRIMARY_FONT_FAMILY }}
          >
            Meet The Team
          </h1>
          <p
            style={{ fontFamily: "'Untitled-Sans', sans-serif", fontSize: 18, color: '#555', marginBottom: 30 }}
            className="text-center w-full max-w-3xl mx-auto"
          >
            Get to know the people behind Apex.
          </p>

          

          {/* Members Grid */}
          <div className="mt-8 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-8">
            {allMembers.map((member, index) => (
              <MemberCard
                key={index}
                name={member.name}
                role={member.role}
                team={member.team}
                imageUrl={member.imageUrl}
                linkedinUrl={member.linkedIn}
              />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MeetTheTeam;
