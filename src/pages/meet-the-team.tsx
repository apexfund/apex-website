import React from 'react'
import Header from '../components/header'
import Footer from '../components/footer'

const MeetTheTeam = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow flex flex-col justify-center items-center p-8">
      <h1 className="text-4xl font-bold mb-4">Meet The Team</h1>
      <p className="text-lg">Get to know the people behind Apex.</p>
    </main>
    <Footer />
  </div>
)

export default MeetTheTeam
