import React from 'react'
import Header from '../components/header'
import Footer from '../components/footer'
import heroImg from '../assets/nyse.jpg'
import workImg from '../assets/work.png'

const updates = [
  { id: '01', title: 'Quant Spring 2025 Recruiting.', desc: 'Applications for Spring 2025 recruiting cycle are out.' },
  { id: '02', title: 'Bootcamps Spring 2025.', desc: 'Dates and topics for our quantitative finance bootcamps are live.' },
  { id: '03', title: 'QuantConnect Competition.', desc: "Apex joined QuantConnect's CI competition." },
  { id: '04', title: 'Congrats Division.', desc: 'Division has hit internal milestone. Congrats!' },
]

const Landing = () => (
  <div className="bg-[#F1EDEE] text-[#121212]">
    {/* Header/NavBar */}
    <Header />

    {/* Hero Section */}
    <section className="flex flex-col md:flex-row items-start justify-between gap-10 px-4 md:px-20 py-12">
      {/* Images Column */}
      <div className="flex flex-col items-start gap-4 flex-shrink-0 md:w-1/2">
        <img src={heroImg} alt="NYSE" className="rounded-lg object-cover w-.7 m-30" />
        {/* <img src={workImg} alt="Work" className="rounded-lg object-cover w-full h-auto" /> */}
      </div>

      {/* Text Column */}
      <div className="max-w-xl mt-8 md:mt-0">
        <h1 className="text-6xl font-extrabold mb-6 leading-tight tracking-tight text-left">Real Assets,<br />Managed by Students</h1>
        <p className="text-2xl text-left font-light">
          Led by students at the University of Maryland, College Park &mdash; Apex Fund manages
          <strong className="text-[#96BFCF] font-bold"> $15,000</strong> in assets through
          <strong className="text-[#96BFCF] font-bold"> quantitative trading</strong> and
          <strong className="text-[#96BFCF] font-bold"> fundamental analysis</strong>.
        </p>
      </div>
    </section>

    {/* Updates Scrollable Carousel */}
    <section className="px-4 md:px-12 pt-10 pb-12">
      <h2 className="text-2xl font-bold mb-6 text-left border-b-2 border-black pb-2 inline-block">See what we've been working on...</h2>
      <div className="flex overflow-x-auto gap-6 scrollbar-hide pb-2">
        {updates.map(update => (
          <div
            key={update.id}
            className="flex-shrink-0 min-w-[220px] w-[220px] bg-white rounded-lg shadow-sm border-t-4 border-black pt-4 px-4 pb-6 flex flex-col"
          >
            <p className="text-2xl font-bold mb-2">{update.id}</p>
            <h3 className="font-bold text-lg mb-1">{update.title}</h3>
            <p className="text-sm text-[#333] mb-2">{update.desc}</p>
            <a href="#" className="text-sm text-[#96BFCF] font-semibold mt-auto">Learn more &gt;</a>
          </div>
        ))}
      </div>
    </section>

    {/* Footer */}
    <Footer />
  </div>
)

export default Landing