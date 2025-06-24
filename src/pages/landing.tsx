import React, { useState, useRef, useEffect } from 'react'
import Header from '../components/header'
import Footer from '../components/footer'
import heroImg from '../assets/nyse.jpg'
import workImg from '../assets/work.png'

const updates = [
  { id: '01', title: 'Fall 2025 Recruiting.', desc: 'Applications for Fall 2025 recruiting cycle are out for Quant and Fundamental.' },
  { id: '02', title: 'Bootcamps Spring 2025.', desc: 'Dates and topics for our quantitative finance bootcamps have been released here.' },
  { id: '03', title: 'IMC Prosperity Placement.', desc: 'Members Aditya Dabeer and Nirav Koley placed 7th internationally in IMC Prosperity. Congrats!' },
  { id: '04', title: 'QuantConnect Competition.', desc: "Apex's Quantitative Division has joined QuantConnect's Q1 competition. Track their progress here." },
]

const Landing = () => {
  const [animatedNumber, setAnimatedNumber] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slideProgress, setSlideProgress] = useState(0)
  
  const SLIDE_DURATION = 5000 // 4 seconds per slide

  const goToSlide = (index) => {
    setCurrentSlide(index)
    setSlideProgress(0)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % updates.length)
    setSlideProgress(0)
  }

  // Auto-slide functionality
  useEffect(() => {
    const slideInterval = setInterval(() => {
      nextSlide()
    }, SLIDE_DURATION)

    return () => clearInterval(slideInterval)
  }, [])

  // Progress bar animation
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setSlideProgress((prev) => {
        if (prev >= 100) {
          return 0
        }
        return prev + (100 / (SLIDE_DURATION / 100))
      })
    }, 100)

    return () => clearInterval(progressInterval)
  }, [currentSlide])

  // Slot machine animation for the number
  useEffect(() => {
    const duration = 5000 // 3.5 seconds (slower)
    const targetNumber = 15000
    const startTime = Date.now()
    
    const animateNumber = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Smoother easing function
      const easeOut = 1 - Math.pow(1 - progress, 6)
      
      // Much gentler randomness for smoother effect
      const randomFactor = progress < 0.7 ? (Math.random() - 0.5) * 0.05 : 0
      const currentValue = Math.floor((targetNumber * easeOut) + (targetNumber * randomFactor))
      
      setAnimatedNumber(Math.max(0, Math.min(currentValue, targetNumber)))
      
      if (progress < 1) {
        requestAnimationFrame(animateNumber)
      } else {
        setAnimatedNumber(targetNumber)
      }
    }
    
    // Start animation after a small delay
    const timeout = setTimeout(() => {
      requestAnimationFrame(animateNumber)
    }, 800)
    
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="bg-[#F1EDEE] text-[#121212] min-h-screen">
      <Header />
      
      <div className="!m-10">
        {/* Hero Section - Pushed Much More to the Right */}
        <section className="relative px-6 sm:px-8 py-12 max-w-7xl mx-auto">
          <div className="!ml-20 flex flex-col lg:flex-row items-start gap-8 !lg:ml-32 !xl:ml-48">
            {/* NYSE Image - Left of Text on Large Screens, Below on Small */}
            <div className="flex-shrink-0 mr-0 lg:mr-16 order-2 lg:order-1">
              <img 
                src={heroImg} 
                alt="NYSE Building" 
                className="w-80 h-64 lg:w-96 lg:h-80 xl:w-[28rem] xl:h-96 rounded-lg object-cover shadow-lg" 
              />
            </div>

            {/* Hero Text - Much Larger and More to the Right */}
            <div className="flex-1 lg:max-w-2xl order-1 lg:order-2">
              <h1 className="!text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black !mb-8 !leading-tight !tracking-tight !text-left">
                Real Assets,<br />Managed by Students
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-left font-light leading-relaxed max-w-3xl">
                Led by students at the University of Maryland, College Park — Apex Fund manages
                <strong className="text-[#96BFCF] font-bold"> ${animatedNumber.toLocaleString()}</strong> in assets through
                <strong className="text-[#96BFCF] font-bold"> quantitative trading</strong> and
                <strong className="text-[#96BFCF] font-bold"> fundamental analysis</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Second Image and Horizontal Carousel Section */}
        <section className="px-6 sm:px-8 pt-8 pb-12 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Second Image - Positioned More to the Right to Match Figma */}
            <div className="flex-shrink-0 lg:ml-48 xl:ml-64">
              <img 
                src={workImg} 
                alt="Wall Street Trading Floor" 
                className="w-72 h-56 lg:w-80 lg:h-64 xl:w-96 xl:h-72 rounded-lg object-cover shadow-lg" 
              />
            </div>

            {/* Auto-Playing News Slideshow */}
            <div className="flex-1 lg:ml-8 !mt-5 !ml-5">
              <h2 className="!mb-5 !text-2xl !font-bold !text-left">
                <span className="border-b-2 border-black pb-2 inline-block font-bold">See what we've been working on...</span>
              </h2>
              
              <div className="relative overflow-hidden rounded-lg">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {updates.map(update => (
                    <div key={update.id} className="w-full flex-shrink-0">
                      <div className="bg-[#F1EDEE] p-4 flex flex-col min-h-[160px]">
                        <div className="w-full h-1 bg-black mb-4"></div>
                        <div className="mb-3">
                          <span className="!text-3xl font-bold text-black block mb-2">{update.id}</span>
                          <h3 className="font-bold !text-2xl mb-2 leading-tight">{update.title}</h3>
                        </div>
                        <p className="text-xl text-gray-600 mb-3 flex-grow leading-relaxed">{update.desc}</p>
                        <a href="#" className="text-sm font-semibold hover:underline text-gray-800">
                          Learn more &gt;
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 bg-gray-300 h-1 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#96BFCF] transition-all duration-100 ease-linear"
                  style={{ width: `${((slideProgress) % 100)}%` }}
                ></div>
              </div>

              {/* Slide Indicators */}
              <div className="flex justify-center mt-4 gap-2">
                {updates.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      currentSlide === index ? 'bg-[#96BFCF]' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}

export default Landing