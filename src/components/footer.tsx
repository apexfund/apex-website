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
      <div className="max-w-6xl mx-auto">
        <div className="!mx-4 md:mx-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            {/* Logo Section */}
            <div className="flex flex-col items-center md:items-start !m-5">
              <div className="w-16 h-16 bg-white rounded-full mb-4 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">AF</span>
              </div>
              <h3 className="text-white font-semibold text-lg">Apex Fund</h3>
            </div>

            {/* Contact Us */}
            <div className="m-5">
              <h4 className="text-white font-semibold text-lg mb-4">Contact Us</h4>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:contact@apexfund.com" className="text-blue-200 hover:text-white transition-colors text-sm">
                    Email
                  </a>
                </li>
                <li>
                  <a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                    TopLink
                  </a>
                </li>
              </ul>
            </div>

            {/* Get Involved */}
            <div className="m-5">
              <h4 className="text-white font-semibold text-lg mb-4">Get Involved</h4>
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
              <h4 className="text-white font-semibold text-lg mb-4">Our Team</h4>
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
          </div>

          {/* Learn More - Positioned as 5th column or moved to second row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="m-5">
              <h4 className="text-white font-semibold text-lg mb-4">Learn More</h4>
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

          {/* Bottom Section */}
          <div className="border-t border-blue-300 border-opacity-30 pt-8 m-5">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-blue-200 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} Apex Fund. All rights reserved.
              </p>
              <p className="text-blue-200 text-sm">
                EST. 2020
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer