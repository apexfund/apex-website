import { useState } from 'react';
import Header from '../components/header'
import Footer from '../components/footer'
import { PRIMARY_FONT_FAMILY } from '../utils/constants';
import Background from '../components/Background';

const Application = () => {

  return (
    <div className="relative !h-screen">
      <Background />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex flex-col">
          <div className="!m-10">
            <div className="w-full max-w-7xl mx-auto">
            <div className="ml-0 md:!ml-20 !lg:ml-32 !xl:ml-48">
              <h1
                className="!mb-2 text-left w-full !max-w-3xl !text-7xl mx-auto px-4"
                style={{ fontFamily: PRIMARY_FONT_FAMILY }}
              >
                Application
              </h1>
              <p
                style={{ fontFamily: "'Untitled-Sans', sans-serif", fontSize: 18, color: '#555', marginBottom: 30 }}
                className="text-left w-full max-w-3xl mx-auto px-4"
              >
                Apply to join Apex or learn more about our application process.
              </p>
            </div>
            <div className="ml-0 md:!ml-20 !lg:ml-32 !xl:ml-48">
              <div className="flex flex-col w-full mt-10 max-w-5xl mx-auto">
                {/* Quantitative Section */}
                <div className="border border-gray-300 rounded-lg !mb-4">
                  <a
                    href="https://example.com/quantitative-application"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full flex items-center justify-between p-4 bg-transparent hover:bg-transparent focus:outline-none !border !border-transparent hover:!border-[#96BFCF] !rounded"
                  >
                    <h2 className="!text-4xl !leading-tight !tracking-tight text-left" style={{ fontFamily: PRIMARY_FONT_FAMILY }}>Quantitative <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span></h2>
                    <span className="flex items-center !p-2 transition-all duration-300 !border !border-transparent hover:!border-[#96BFCF] !rounded">
                      <div className="!p-2 !mt-1">
                        <span className="text-xl mr-4 text-gray-500">Learn more</span>
                      </div>
                    </span>
                  </a>
                </div>

                <p className="text-left text-base text-gray-700 !mb-4">
                  Develop quantitative strategies involving systematic trading and data analysis using sophisticated mathematical models and computational techniques. Ideal for CS, Mathematics, Engineering, and other data-oriented majors.
                </p>

                {/* Fundamental Section */}
                <div className="border border-gray-300 rounded-lg !mb-4">
                  <a
                    href="https://example.com/fundamental-application"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full flex items-center justify-between p-4 bg-transparent hover:bg-transparent focus:outline-none !border !border-transparent hover:!border-[#96BFCF] !rounded"
                  >
                    <h2 className="!text-4xl !leading-tight !tracking-tight text-left" style={{ fontFamily: PRIMARY_FONT_FAMILY }}>Fundamental <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span></h2>
                    <span className="flex items-center !p-2 transition-all duration-300 !border !border-transparent hover:!border-[#96BFCF] !rounded">
                      <div className="!p-2 !mt-1">
                        <span className="text-xl mr-4 text-gray-500">Learn more</span>
                      </div>
                    </span>
                  </a>
                </div>

                <p className="text-left text-base text-gray-700 !mb-4">
                  Explore core financial principles and leverage fundamental analysis to drive investment strategies and long-term value creation. Well suited for students in financial and business related majors.
                </p>

              </div>
            </div>
          </div>
        </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Application;
