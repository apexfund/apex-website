import React from 'react'
import footerBg from '../assets/footer.svg'

const Footer = () => (
  <footer className="relative text-white">
    {/* SVG Wave Background Section */}
    <div 
      className="w-full h-60 bg-cover bg-top bg-no-repeat"
      style={{
        backgroundImage: `url(${footerBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat'
      }}
    />
    
    {/* Content Section with solid background */}
    <div 
      className="w-full"
      style={{ backgroundColor: '#5B7E9A' }}
    >
      <div className="!container !mx-auto !px-6 sm:!px-12 !py-16">
        {/* Main Content Layout */}
        <div className="!flex !flex-col lg:!flex-row lg:!justify-between lg:!items-start !gap-12 lg:!gap-16">
          
          {/* Left Side - Logo and Company Name */}
          <div className="!flex !flex-col !items-start lg:!items-start">
            <div className="!w-20 !h-20 !bg-gray-200 !rounded-full !mb-4"></div>
            <h3 className="!text-xl !font-medium">Apex Fund</h3>
          </div>
          
          {/* Right Side - Footer Links */}
          <div className="!flex-1">
            <div className="!grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-4 !gap-8 lg:!gap-12">
              
              {/* Contact Us */}
              <div>
                <h4 className="!font-bold !text-lg !mb-3 !pb-2 !border-b !border-white !border-solid">Contact Us</h4>
                <ul className="!space-y-2 !mt-4">
                  <li>
                    <a href="mailto:contact@apexfund.com" className="!text-gray-200 hover:!text-white !transition-colors">
                      Email
                    </a>
                  </li>
                  <li>
                    <a href="https://terplink.umd.edu/organization/apexfund" target="_blank" rel="noopener noreferrer" className="!text-gray-200 hover:!text-white !transition-colors">
                      TerpLink
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Get Involved */}
              <div>
                <h4 className="!font-bold !text-lg !mb-3 !pb-2 !border-b !border-white !border-solid">Get Involved</h4>
                <ul className="!space-y-2 !mt-4">
                  <li>
                    <a href="/application" className="!text-gray-200 hover:!text-white !transition-colors">
                      Training
                    </a>
                  </li>
                  <li>
                    <a href="/application" className="!text-gray-200 hover:!text-white !transition-colors">
                      Apply
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Our Team */}
              <div>
                <h4 className="!font-bold !text-lg !mb-3 !pb-2 !border-b !border-white !border-solid">Our Team</h4>
                <ul className="!space-y-2 !mt-4">
                  <li>
                    <a href="/meet-the-team" className="!text-gray-200 hover:!text-white !transition-colors">
                      Executive Team
                    </a>
                  </li>
                  <li>
                    <a href="/meet-the-team" className="!text-gray-200 hover:!text-white !transition-colors">
                      Investment Team
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Learn More */}
              <div>
                <h4 className="!font-bold !text-lg !mb-3 !pb-2 !border-b !border-white !border-solid">Learn More</h4>
                <ul className="!space-y-2 !mt-4">
                  <li>
                    <a href="/about" className="!text-gray-200 hover:!text-white !transition-colors">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="/blog" className="!text-gray-200 hover:!text-white !transition-colors">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="!text-gray-200 hover:!text-white !transition-colors">
                      Placement
                    </a>
                  </li>
                </ul>
              </div>
              
            </div>
          </div>
          
        </div>
        
        {/* Bottom Section - EST. 2020 */}
        <div className="!mt-16 !flex !justify-center lg:!justify-end">
          <span className="!text-lg !font-semibold !text-gray-200">EST. 2020</span>
        </div>
        
      </div>
    </div>
  </footer>
)

export default Footer