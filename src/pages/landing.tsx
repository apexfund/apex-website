import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/header'
import Footer from '../components/footer'
import PlacementsImg from '../assets/companies.png'
import NyseImg from '../assets/nyse.jpg'


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

  const SLIDE_DURATION = 5000 // 5 seconds per slide

  const goToSlide = (index: number) => {
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
    const duration = 5000 // 5 seconds
    const targetNumber = 15780
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
        {/* Hero Section with Side-by-Side Layout */}
        <section className="relative px-6 sm:px-8 py-12 max-w-7xl mx-auto">
          <div className="ml-0 md:!ml-20 flex flex-col lg:flex-row lg:items-start lg:gap-12 xl:gap-16 !lg:ml-32 !xl:ml-48">
            {/* Hero Text - Left Side */}
            <div className="flex-1 lg:max-w-2xl">
              <h1 className="!text-7xl !mb-8 !leading-tight !tracking-tight !text-left"
                style={{ fontFamily: "'PP-Neue-World', serif" }}
              >
                Real Assets,<br />Managed by Students
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-left font-light leading-relaxed max-w-3xl">
                Led by students at the University of Maryland, College Park — Apex Fund manages
                <strong className="text-[#96BFCF] font-bold"> ${animatedNumber.toLocaleString()}</strong> in assets through
                <strong className="text-[#96BFCF] font-bold"> quantitative trading</strong> and
                <strong className="text-[#96BFCF] font-bold"> fundamental analysis</strong>.
              </p>
            </div>

            {/* Carousel - Right Side on Desktop, Below on Mobile */}
            <div className="w-full lg:w-96 xl:w-[400px] flex-shrink-0 mt-12 lg:mt-0">
              <h2 className="!mb-5 !text-2xl !font-bold !text-left">
                <span className="border-b-2 border-black pb-2 inline-block font-bold sm:!pt-10">See what we've been working on...</span>
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
                        <a href="#" className="text-sm font-semibold hover:underline text-gray-800 hover:!text-[#96BFCF]">
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
                    className={`w-3 h-3 rounded-full transition-colors ${currentSlide === index ? 'bg-[#96BFCF]' : 'bg-gray-300'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission Statement Section */}
        <section className="px-6 sm:px-8 !pt-32 pb-24 max-w-7xl mx-auto">
          <div className="ml-0 md:!ml-20 !lg:ml-32 !xl:ml-48">
            <div className="flex flex-col md:flex-row-reverse md:items-center">
              {/* Right Column on Desktop: Title */}
              <div className="flex-shrink-0 md:w-1/3">
                <h2 
                  className="!text-6xl !leading-tight !tracking-tight text-left md:text-right text-[#96BFCF]"
                  style={{ fontFamily: "'PP-Neue-World', serif" }}
                >
                  Our
                  <br />
                  Mission.
                </h2>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-1 bg-gray-300 self-stretch mx-12"></div>

              {/* Left Column on Desktop: Statement */}
              <div className="flex-1 mt-6 md:mt-0">
                <p className="!text-2xl lg:!text-3xl font-light leading-relaxed text-gray-800">
                  To provide <strong className="font-semibold text-black">real-world financial experience</strong> to students by managing a <strong className="font-semibold text-black">diversified portfolio</strong>, fostering crucial <strong className="font-semibold text-black">analytical skills</strong>, and building a community of <strong className="font-semibold text-black">future financial leaders</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Member Placements Section */}
        <section className="px-6 sm:px-8 pt-32 pb-20 max-w-7xl mx-auto">
          <div className="ml-0 md:!ml-20 !lg:ml-32 !xl:ml-48">
            <h2 
              className="!text-6xl !mt-12 !mb-6 !leading-tight !tracking-tight text-left"
              style={{ fontFamily: "'PP-Neue-World', serif" }}
            >
              Member Placements
            </h2>
            <p className="text-base sm:text-lg font-light leading-relaxed max-w-4xl mb-12 text-left">
              Our members have secured positions at some of the top firms in the industry, a testament to the skills and experience gained through Apex.
            </p>
            <div className="flex items-center px-4">
              <img src={PlacementsImg} alt="Company Logos of member placements" className="max-w-full h-auto" />
            </div>
          </div>
        </section>

        <div className="relative h-16 ml-0 md:!ml-20 !lg:ml-32 !xl:ml-48">
            <div className="absolute top-0 left-0 h-0.5 bg-gray-300 w-1/3"></div>
            <div className="absolute top-0 left-0 w-0.5 bg-gray-300 h-1/3"></div>
        </div>

        {/* Call to Action Grid Section */}
        <section className="px-6 sm:px-8 py-24 max-w-7xl mx-auto">
          <div className="ml-0 md:!ml-20 !lg:ml-32 !xl:ml-48">
            <div className="flex flex-col md:grid md:grid-cols-2 md:gap-4 md:h-[600px] border border-gray-300 rounded-lg p-4">
              {/* Top-Left: Image */}
              <div className="col-span-1 row-span-1 mb-4 md:mb-0 order-4 md:order-none">
                <img src={NyseImg} alt="New York Stock Exchange" className="w-full h-48 md:h-full object-cover rounded-lg" />
              </div>

              {/* Top-Right: Meet Our Team */}
              <Link to="/meet-the-team" className="col-span-1 row-span-1 bg-gray-200 rounded-lg flex items-center justify-center text-center !p-8 hover:bg-gray-300 transition-colors duration-300 my-4 md:my-0 order-1 md:order-none">
                <div>
                  <h3 className="!text-4xl font-bold" style={{ fontFamily: "'PP-Neue-World', serif" }}>Meet Our Team</h3>
                  <p className="mt-2 text-lg">Explore the talent behind Apex.</p>
                </div>
              </Link>

              {/* Bottom-Left: View Our Work */}
              <Link to="/our-work" className="col-span-1 row-span-1 bg-gray-200 rounded-lg flex items-center justify-center text-center !p-8 hover:bg-gray-300 transition-colors duration-300 my-4 md:my-0 order-3 md:order-none">
                <div>
                  <h3 className="!text-4xl font-bold" style={{ fontFamily: "'PP-Neue-World', serif" }}>View Our Work</h3>
                  <p className="mt-2 text-lg">See our strategies and results.</p>
                </div>
              </Link>

              {/* Bottom-Right: Image */}
              <div className="col-span-1 row-span-1 order-2 md:order-none">
                <img src={PlacementsImg} alt="Team working" className="w-full h-48 md:h-full object-cover rounded-lg" />
              </div>
            </div>
          </div>
        </section>

        <div className="relative h-16 ml-0 md:!ml-20 !lg:ml-32 !xl:ml-48">
            <div className="absolute bottom-0 right-0 h-0.5 bg-gray-300 w-1/3"></div>
            <div className="absolute bottom-0 right-0 w-0.5 bg-gray-300 h-1/3"></div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Landing