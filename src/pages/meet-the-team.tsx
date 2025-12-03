
import Header from '../components/header'
import Footer from '../components/footer'
import MemberCard from '../components/MemberCard';
import { PRIMARY_FONT_FAMILY } from '../utils/constants';
import Background from '../components/Background';

import vishesh_gupta from '../assets/members/vishesh_gupta.jpeg';
import aditya_dabeer from '../assets/members/aditya_dabeer.jpeg';
import nirav_koley from '../assets/members/nirav_koley.jpeg';
import caleb_chang from '../assets/members/caleb_chang.jpeg';
import daniel_wang from '../assets/members/daniel_wang.jpeg';
import edward_song from '../assets/members/edward_song.jpeg';
import krishi_cherukupalli from '../assets/members/krishi_cherukupalli.jpeg';
import kushal_kapoor from '../assets/members/kushal_kapoor.jpeg';
import narain_sriram from '../assets/members/narain_sriram.jpeg';
import pranav_bykampadi from '../assets/members/pranav_bykampadi.jpeg';
import shivam_amin from '../assets/members/shivam_amin.jpeg';
import eshan_khan from '../assets/members/eshan_khan.jpeg';
import varun_rao from '../assets/members/varun_rao.jpeg';
import viraj_urs from '../assets/members/viraj_urs.jpeg';
import mayank_barnwal from '../assets/members/mayank_barnwal.jpeg';
import joseph_asselta from '../assets/members/joseph_asselta.jpeg';
import cooper_dorf from '../assets/members/cooper_dorf.jpeg';
import alex_lavitz from '../assets/members/alex_lavitz.jpeg';
import ali_shah from '../assets/members/ali_shah.jpeg';
import emilio_gallo from '../assets/members/emilio_gallo.jpeg';
import gage_hamilton from '../assets/members/gage_hamilton.jpeg';
import isaac_kushnir from '../assets/members/isaac_kushnir.jpeg';
import kevin_bowles from '../assets/members/kevin_bowles.jpeg';
import leo_paradise from '../assets/members/leo_paradise.jpeg';
import martin_linsky from '../assets/members/martin_linsky.jpeg';
import matthew_vacek from '../assets/members/matthew_vacek.jpeg';
import michael_luterh from '../assets/members/michael_luterh.jpeg';
import patrick_eskildsen from '../assets/members/patrick_eskildsen.jpeg';
import reed_plotnick from '../assets/members/reed_plotnick.jpeg';
import saketh_ram_kannuoju from '../assets/members/saketh_ram_kannuoju.jpeg';
import tyson_nguyen from '../assets/members/tyson_nguyen.jpeg';
import boburkhan_djumanov from '../assets/members/boburkhan_djumanov.jpeg';

const MeetTheTeam = () => {
  const quantitativeMembers = [
    {
      name: "Vishesh Gupta",
      role: "Senior Analyst",
      team: "Quantitative Team",
      imageUrl: vishesh_gupta,
      linkedIn: 'https://www.linkedin.com/in/visheshng/'
    },
    {
      name: "Aditya Dabeer",
      role: "Senior Analyst",
      team: "Quantitative Team",
      imageUrl: aditya_dabeer,
      linkedIn: 'https://www.linkedin.com/in/adityadabeer/'
    },
    {
      name: "Nirav Koley",
      role: "Senior Analyst",
      team: "Quantitative Team",
      imageUrl: nirav_koley,
      linkedIn: 'https://www.linkedin.com/in/nirav-koley/'
    },
    {
      name: "Caleb Chang",
      role: "Analyst",
      team: "Quantitative Team",
      imageUrl: caleb_chang,
      linkedIn: 'https://www.linkedin.com/in/cchang22/'
    },
    {
      name: "Daniel Wang",
      role: "Analyst",
      team: "Quantitative Team",
      imageUrl: daniel_wang,
      linkedIn: 'https://www.linkedin.com/in/daniel-e-wang/'
    },
    {
      name: "Edward Song",
      role: "Analyst",
      team: "Quantitative Team",
      imageUrl: edward_song,
      linkedIn: 'https://www.linkedin.com/in/edwardrsong/'
    },
    {
      name: "Krishi Cherukupalli",
      role: "Junior Analyst",
      team: "Quantitative Team",
      imageUrl: krishi_cherukupalli,
      linkedIn: 'https://www.linkedin.com/in/krishi-cherukupalli/'
    },
    {
      name: "Kushal Kapoor",
      role: "Analyst",
      team: "Quantitative Team",
      imageUrl: kushal_kapoor,
      linkedIn: 'https://www.linkedin.com/in/kushalkapoor25/'
    },
    {
      name: "Narain Sriam",
      role: "Junior Analyst",
      team: "Quantitative Team",
      imageUrl: narain_sriram,
      linkedIn: 'https://www.linkedin.com/in/narainsriram/'
    },
    {
      name: "Pranav Bykampadi",
      role: "Junior Analyst",
      team: "Quantitative Team",
      imageUrl: pranav_bykampadi,
      linkedIn: 'https://www.linkedin.com/in/pranav-bykampadi-b89162262/'
    },
    {
      name: "Shivam Amin",
      role: "Junior Analyst",
      team: "Quantitative Team",
      imageUrl: shivam_amin,
      linkedIn: 'https://www.linkedin.com/in/shivamamin05/'
    },
    {
      name: "Eshan Khan",
      role: "Junior Analyst",
      team: "Quantitative Team",
      imageUrl: eshan_khan,
      linkedIn: 'https://www.linkedin.com/in/eshankhan05/'
    },
    {
      name: "Varun Rao",
      role: "Junior Analyst",
      team: "Quantitative Team",
      imageUrl: varun_rao,
      linkedIn: 'https://www.linkedin.com/in/varunvrao/'
    },
    {
      name: "Viraj Urs",
      role: "Junior Analyst",
      team: "Quantitative Team",
      imageUrl: viraj_urs,
      linkedIn: 'https://www.linkedin.com/in/viraj-urs/'
    }
  ];

  const fundamentalMembers = [
    {
      name: "Mayank Barnwal",
      role: "Portfolio Manager",
      team: "Fundamental Team",
      imageUrl: mayank_barnwal,
      linkedIn: 'https://www.linkedin.com/in/mayank-barnwal/'
    },
    {
      name: "Joseph Asselta",
      role: "Portfolio Manager",
      team: "Fundamental Team",
      imageUrl: joseph_asselta,
      linkedIn: 'https://www.linkedin.com/in/josephasselta/'
    },
    {
      name: "Cooper Dorf",
      role: "Portfolio Manager",
      team: "Fundamental Team",
      imageUrl: cooper_dorf,
      linkedIn: 'https://www.linkedin.com/in/cooper-dorf/'
    },
    {
      name: "Alex Lavitz",
      role: "Analyst",
      team: "Fundamental Team",
      imageUrl: alex_lavitz,
      linkedIn: 'https://www.linkedin.com/in/alexlavitz/'
    },
    {
      name: "Ali Shah",
      role: "Analyst",
      team: "Fundamental Team",
      imageUrl: ali_shah,
      linkedIn: 'https://www.linkedin.com/in/ali-hadi-shah/'
    },
    {
      name: "Emilio Gallo",
      role: "Analyst",
      team: "Fundamental Team",
      imageUrl: emilio_gallo,
      linkedIn: 'https://www.linkedin.com/in/emiliogallo/'
    },
    {
      name: "Gage Hamilton",
      role: "Analyst",
      team: "Fundamental Team",
      imageUrl: gage_hamilton,
      linkedIn: 'https://www.linkedin.com/in/gage-hamilton-aa8718284/'
    },
    {
      name: "Isaac Kushnir",
      role: "Analyst",
      team: "Fundamental Team",
      imageUrl: isaac_kushnir,
      linkedIn: 'https://www.linkedin.com/in/isaac-kushnir/'
    },
    {
      name: "Kevin Bowles",
      role: "Analyst",
      team: "Fundamental Team",
      imageUrl: kevin_bowles,
      linkedIn: 'https://www.linkedin.com/in/kevin-bowles-8239a9321/'
    },
    {
      name: "Leo Paradise",
      role: "Analyst",
      team: "Fundamental Team",
      imageUrl: leo_paradise,
      linkedIn: 'https://www.linkedin.com/in/leo-paradise-23b282328/'
    },
    {
      name: "Marty Linsky",
      role: "Analyst",
      team: "Fundamental Team",
      imageUrl: martin_linsky,
      linkedIn: 'https://www.linkedin.com/in/martin-linsky/'
    },
    {
      name: "Matthew Vacek",
      role: "Analyst",
      team: "Fundamental Team",
      imageUrl: matthew_vacek,
      linkedIn: 'https://www.linkedin.com/in/matthew-c-vacek/'
    },
    {
      name: "Michael Luther",
      role: "Analyst",
      team: "Fundamental Team",
      imageUrl: michael_luterh,
      linkedIn: 'https://www.linkedin.com/in/michael-a-luther/'
    },
    {
      name: "Patrick Eskildsen",
      role: "Analyst",
      team: "Fundamental Team",
      imageUrl: patrick_eskildsen,
      linkedIn: 'https://www.linkedin.com/in/patrick-eskildsen/'
    },
    {
      name: "Reed Plotnick",
      role: "Analyst",
      team: "Fundamental Team",
      imageUrl: reed_plotnick,
      linkedIn: 'https://www.linkedin.com/in/reedplotnick/'
    },
    {
      name: "Saketh Ram Kannoju",
      role: "Analyst",
      team: "Fundamental Team",
      imageUrl: saketh_ram_kannuoju,
      linkedIn: 'https://www.linkedin.com/in/sakethkannoju/'
    },
    {
      name: "Tyson Nguyen",
      role: "Analyst",
      team: "Fundamental Team",
      imageUrl: tyson_nguyen,
      linkedIn: 'https://www.linkedin.com/in/tyson-nguyen-b40920233/'
    },
    {
      name: "Boburkhan Djumanov",
      role: "Junior Analyst",
      team: "Fundamental Team",
      imageUrl: boburkhan_djumanov,
      linkedIn: 'https://www.linkedin.com/in/boburkhandjumanov/'
    }
  ];

  const allMembers = [...quantitativeMembers, ...fundamentalMembers];

  const executiveBoardNames = [
    "Vishesh Gupta",
    "Aditya Dabeer",
    "Nirav Koley",
    "Mayank Barnwal",
    "Joseph Asselta",
    "Cooper Dorf",
  ];

  const sortByLastName = (a: any, b: any) => {
    const roleOrder: { [key: string]: number } = {
      "Senior Analyst": 1,
      Analyst: 2,
      "Junior Analyst": 3,
      "Portfolio Manager": 0, // Assuming Portfolio Manager should come first in fundamental team
    };

    const roleA = roleOrder[a.role] !== undefined ? roleOrder[a.role] : 99; // Assign a high number for unknown roles
    const roleB = roleOrder[b.role] !== undefined ? roleOrder[b.role] : 99;

    if (roleA !== roleB) {
      return roleA - roleB;
    }

    const lastNameA = a.name.split(" ").pop();
    const lastNameB = b.name.split(" ").pop();
    return lastNameA.localeCompare(lastNameB);
  };

  const executiveBoardMembers = allMembers
    .filter((member) => executiveBoardNames.includes(member.name))
    .sort(sortByLastName);
  const otherMembers = allMembers
    .filter((member) => !executiveBoardNames.includes(member.name))
    .sort(sortByLastName);

  return (
    <div className="relative min-h-screen">
      <Background />
      <div className="relative z-10 flex flex-col min-h-screen bg-transparent">
        <Header />
        <main className="flex-grow flex flex-col justify-center items-center p-8">
          <h1
            className="!mb-2 text-center w-full !max-w-3xl !text-7xl mx-auto"
            style={{ fontFamily: PRIMARY_FONT_FAMILY }}
          >
            Meet The Team
          </h1>
          <p
            style={{
              fontFamily: "'Untitled-Sans', sans-serif",
              fontSize: 18,
              color: "#555",
              marginBottom: 30,
            }}
            className="text-center w-full max-w-3xl mx-auto"
          >
            Get to know the people behind Apex.
          </p>

          {/* Executive Board */}
          <h2
            id="executive-board"
            className="!mb-2 text-center w-full !max-w-3xl !text-5xl mx-auto !mt-10"
            style={{
              fontFamily: PRIMARY_FONT_FAMILY,
              scrollMarginTop: "130px",
            }}
          >
            Executive Board
          </h2>
          <div className="mt-8 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-8">
            {executiveBoardMembers.map((member, index) => (
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

          {/* Our Team */}
          <h2
            id="investment-team"
            className="!mb-2 text-center w-full !max-w-3xl !text-5xl mx-auto mt-10"
            style={{
              fontFamily: PRIMARY_FONT_FAMILY,
              scrollMarginTop: "130px",
            }}
          >
            Our Team
          </h2>
          <div className="mt-8 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-8">
            {otherMembers.map((member, index) => (
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
