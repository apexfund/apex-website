import React from 'react'
import footerBg from '../assets/footer.svg'

const Footer = () => (
  <footer className="relative text-white">
    {/* SVG Wave Background Section */}
    <div
      className="w-full h-64 bg-cover bg-top bg-no-repeat"
      style={{
        backgroundImage: `url(${footerBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat'
      }}
    />

    {/* Content Section with solid background */}
    <div
      className="px-8 py-16"
      style={{ backgroundColor: '#5B7E9A' }}
    >
      <div className="mx-auto max-w-11/12">
        <div className="!mx-4 md:mx-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-15 mb-12">

            {/* Logo Section */}
            <div className="flex flex-col items-center md:items-start !m-5">
              <div className="w-30 h-30 bg-white rounded-full mb-4 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">AF</span>
              </div>
            </div>

            {/* Contact Us */}
            <div className="m-5">
              <span className="text-white font-semibold text-xl mb-2">Contact Us</span>
              <div className="w-full h-0.5 bg-white mb-4"></div>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:contact@apexfund.com" className="text-blue-200 hover:text-white transition-colors text-sm">
                    Email
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                    TerpLink
                  </a>
                </li>
              </ul>
            </div>

            {/* Get Involved */}
            <div className="m-5">
              <span className="text-white font-semibold text-lg mb-2">Get Involved</span>
              <div className="w-full h-0.5 bg-white mb-4"></div>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                    Training
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                    Apply
                  </a>
                </li>
              </ul>
            </div>

            {/* Our Team */}
            <div className="m-5">
              <span className="text-white font-semibold text-lg mb-2">Our Team</span>
              <div className="w-full h-0.5 bg-white mb-4"></div>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                    Executive Team
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                    Investment Team
                  </a>
                </li>
              </ul>
            </div>

            {/* Learn More */}
            <div className="m-5">
              <span className="text-white font-semibold text-lg mb-2">Learn More</span>
              <div className="w-full h-0.5 bg-white mb-4"></div>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                    Placements
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Empty row to add height */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            <div className="m-5 h-5"></div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-blue-300 border-opacity-30 pt-4 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <span className="text-white font-bold text-xl mb-4 md:mb-0">
                Apex Fund
              </span>
              <span className="text-white font-bold text-xl">
                EST. 2020
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            <div className="m-5 h-10"></div>
          </div>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer