import React from 'react'
import Header from '../components/header'
import Footer from '../components/footer'
import MemberCard from '../components/MemberCard';

const MeetTheTeam = () => (
  <div className="flex flex-col min-h-screen bg-[#F1EDEE]">
    <Header />
    <main className="flex-grow flex flex-col justify-center items-center p-8">
      <h1
        className="!mb-2 text-center w-full !max-w-3xl !text-7xl mx-auto"
        style={{ fontFamily: "'PP-Neue-World', serif" }}
      >
        Meet The Team
      </h1>
      <p
        style={{ fontFamily: "'Untitled-Sans', sans-serif", fontSize: 18, color: '#555', marginBottom: 30 }}
        className="text-center w-full max-w-3xl mx-auto"
      >
        Get to know the people behind Apex.
      </p>
      <div className="mt-8 w-full max-w-5xl flex flex-wrap gap-8 justify-center mx-auto">
        <MemberCard
          name="Vishesh Gupta"
          role="Senior Quant Analyst"
          team="Quantitative Team"
          imageUrl='https://media.licdn.com/dms/image/v2/D4E03AQG-i2rm5VjOZA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1728014942451?e=1758153600&v=beta&t=vZDQCmY51KGmtlzF7gx7_GIRuiWVU-sWimXj75yk5bA'
        />
        <MemberCard
          name="Aditya Dabeer"
          role="Senior Quant Analyst"
          team="Quantitative Team"
          imageUrl='https://media.licdn.com/dms/image/v2/C4E03AQGoJ00tBzreOQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1625952151426?e=1758153600&v=beta&t=yuwq1hXIKNuyVwV6BaSQTYUmRxAaLcX7AwVg5UBU3TA'
        />
        <MemberCard
          name="Nirav Koley"
          role="Senior Quant Analyst"
          team="Quantitative Team"
          imageUrl='https://media.licdn.com/dms/image/v2/D4E03AQHr7L_2iuz9IA/profile-displayphoto-shrink_200_200/B4EZdQ6mNxHgAc-/0/1749409228037?e=1758153600&v=beta&t=H2IO35STDXu4XgomrQY4E3dhKhdSNetleawDGtatv1Y'
        />
        <MemberCard
          name="Caleb Chang"
          role="Quant Analyst"
          team="Quantitative Team"
          imageUrl='https://media.licdn.com/dms/image/v2/D4E03AQEWadqsi6uAuw/profile-displayphoto-shrink_200_200/B4EZc4RcsMHYAY-/0/1748995793117?e=1758153600&v=beta&t=5lGaIQx2YarpyavRrMxY-kXsaBWWGp4T-DPMpWIJXv0'
        />
        <MemberCard
          name="Daniel Wang"
          role="Quant Analyst"
          team="Quantitative Team"
          imageUrl='https://media.licdn.com/dms/image/v2/D5603AQENILk5AeYIdA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1692668795534?e=1758153600&v=beta&t=wXBzxb9EtKiEQodPUgKTbRFwK2dP4F6OdRiHWpqVJuw'
        />
        <MemberCard
          name="Edward Song"
          role="Quant Analyst"
          team="Quantitative Team"
          imageUrl='https://media.licdn.com/dms/image/v2/D4E03AQGer1ICctlSag/profile-displayphoto-shrink_200_200/B4EZVx807xHgAY-/0/1741373526346?e=1758153600&v=beta&t=uoHczB7oA9pfmeTfA5MydhkAarm_3Zgab1iDjsOqSrs'
        />
        <MemberCard
          name="Krishi Cherukupalli"
          role="Junior Quant Analyst"
          team="Quantitative Team"
          imageUrl='https://media.licdn.com/dms/image/v2/D4E03AQF-jBjapTB3MA/profile-displayphoto-shrink_200_200/B4EZVLAkyUHUAY-/0/1740720197078?e=1758153600&v=beta&t=BT4q6_9jxDopI2txV4QkIF-ir6RnBaGgFlOd3JqaAXU'
        />
        <MemberCard
          name="Narain Sriam"
          role="Junior Quant Analyst"
          team="Quantitative Team"
          imageUrl='https://media.licdn.com/dms/image/v2/D4E03AQF-jBjapTB3MA/profile-displayphoto-shrink_200_200/B4EZVLAkyUHUAY-/0/1740720197078?e=1758153600&v=beta&t=BT4q6_9jxDopI2txV4QkIF-ir6RnBaGgFlOd3JqaAXU'
        />
        <MemberCard
          name="Pranav Bykampadi"
          role="Junior Quant Analyst"
          team="Quantitative Team"
          imageUrl='https://media.licdn.com/dms/image/v2/D5603AQELYR4NQfgTWA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1730678756654?e=1758153600&v=beta&t=1JbT2p4pDOrdfE2TELKZVO5R9jLAPJo5Fiug7WAPa40'
        />
        <MemberCard
          name="Sachin Satish Kumar"
          role="Junior Quant Analyst"
          team="Quantitative Team"
          imageUrl='https://media.licdn.com/dms/image/v2/D4E03AQFd_OqaaiB-_w/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1664753014858?e=1758153600&v=beta&t=3Kd5VhZA2Hx8_wl0_JNmB-WPFlSYBZaFoFVWCYKhcq4'
        />
        <MemberCard
          name="Shivam Amin"
          role="Junior Quant Analyst"
          team="Quantitative Team"
          imageUrl='https://media.licdn.com/dms/image/v2/D4E03AQFkHvDcCMLfFA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1696305311664?e=1758153600&v=beta&t=c24HwVtmdWSmCJmZcACBODkfsysfB1N84hgUFqUhaoc'
        />
        <MemberCard
          name="Eshan Khan"
          role="Junior Quant Analyst"
          team="Quantitative Team"
          imageUrl='https://media.licdn.com/dms/image/v2/D4E03AQGLZ3hNzF0bxw/profile-displayphoto-shrink_200_200/B4EZRx3pzpG0Ac-/0/1737077202463?e=1758153600&v=beta&t=77FMGgJDU92fCxGzpm0lcbH5YdO7E8FVdEK9TocNNq4'
        />
        <MemberCard
          name="Varun Rao"
          role="Junior Quant Analyst"
          team="Quantitative Team"
          imageUrl='https://media.licdn.com/dms/image/v2/C4E03AQEmzB7FxqZstA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1638240266203?e=1758153600&v=beta&t=eLHV_ue-lzlUxB3pKaPeDYCJyUnf6Osiy96MeJfRg3k'
        />
        <MemberCard
          name="Viraj Urs"
          role="Junior Quant Analyst"
          team="Quantitative Team"
          imageUrl='https://media.licdn.com/dms/image/v2/D4E03AQG_HmeU_2pbng/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1722256276435?e=1758153600&v=beta&t=mIU0rQTy1YcEbiDbrTvClwvwzcxADl_R8f4xN0l1kRk'
        />
      </div>
    </main>
    <Footer />
  </div>
)

export default MeetTheTeam
