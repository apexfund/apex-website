import React from 'react'
import Header from '../components/header'
import Footer from '../components/footer'

const Landing = () => (
    <div className="snap-y snap-mandatory">
        <div className="flex flex-col h-screen overflow-y-scroll snap-y snap-mandatory">
            <section className="snap-start flex-shrink-0 h-screen flex flex-col">
                <Header />
                <div className="flex-grow flex flex-col justify-center items-center p-8 text-2xl bg-gray-100">
                    <h1 className="text-4xl font-bold mb-4">About Us</h1>
                    <p>Welcome to Apex! We are dedicated to excellence and innovation.</p>
                </div>
            </section>

            <section className="snap-start flex-shrink-0 h-screen flex justify-center items-center p-8 text-2xl bg-indigo-100">
                <div>
                    <h1 className="text-4xl font-bold mb-4">Placements</h1>
                    <p>Our students achieve top placements in leading companies worldwide.</p>
                </div>
            </section>

            <section className="snap-start flex-shrink-0 h-screen flex justify-center items-center p-8 text-2xl bg-red-100">
                <div>
                    <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                    <p>Get in touch: contact@apex.com</p>
                </div>
            </section>

            <section className="snap-end bg-yellow-100">
                <Footer />
            </section>

        </div>
    </div>
)

export default Landing