import React from 'react'
import Header from '../components/header'
import Footer from '../components/footer'

const Application = () => (
  <div className="flex flex-col min-h-screen bg-[#F1EDEE]">
    <Header />
    <main className="flex-grow flex flex-col justify-center items-center p-8">
      <h1 className="text-4xl font-bold mb-4">Application</h1>
      <p className="text-lg">Apply to join Apex or learn more about our application process.</p>
    </main>
    <Footer />
  </div>
)

export default Application