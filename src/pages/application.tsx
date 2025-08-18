import Header from '../components/header'
import Footer from '../components/footer'

const Application = () => (
  <div className="flex flex-col min-h-screen bg-[#F1EDEE]">
    <Header />
    <main className="flex-grow flex flex-col justify-center items-center p-8">
      <h1
        className="!mb-2 text-center w-full !max-w-3xl !text-7xl mx-auto px-4"
        style={{ fontFamily: "'PP-Neue-World', serif" }}
      >
        Application
      </h1>
      <p
        style={{ fontFamily: "'Untitled-Sans', sans-serif", fontSize: 18, color: '#555', marginBottom: 30 }}
        className="text-center w-full max-w-3xl mx-auto px-4"
      >
        Apply to join Apex or learn more about our application process.
      </p>
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-stretch mt-12 gap-0">
        {/* Fundamental Section */}
        <div className="flex-1 !p-8 flex flex-col items-center justify-start">
          <h2 className="!text-5xl text-center underline underline-offset-4 !mb-8" style={{ fontFamily: "'PP-Neue-World', serif" }}>Fundamental</h2>
          <p className="text-base text-gray-700 mb-8 text-center max-w-md">
            <span className="font-semibold">Click the following link to apply for this team:</span><br />
            <a href="https://example.com/fundamental-application" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-bold hover:!text-[#96BFCF]">Apply for Fundamental</a>
          </p>
          <h3 className="text-xl font-bold underline underline-offset-4 mb-3 mt-2">How to Prepare</h3>
          <ul className="list-disc list-inside text-gray-600 mb-8 text-left max-w-md space-y-2">
            <li><span className="font-medium">Brush up</span> on financial statement analysis and valuation techniques.</li>
            <li><span className="font-medium">Be ready</span> to discuss recent market news and your investment ideas.</li>
            <li><span className="font-medium">Practice</span> communicating complex ideas clearly and concisely.</li>
          </ul>
          <h3 className="text-xl font-bold underline underline-offset-4 mb-3">Interview Pipeline</h3>
          <ol className="list-decimal list-inside text-gray-600 text-left max-w-md space-y-4 mb-2">
            <li>
              <span className="font-medium">Initial application review</span> and resume screen.
              <ul className="list-disc list-inside ml-6 text-gray-500 text-sm mt-1">
                <li>We review your application and resume for relevant experience and interest.</li>
              </ul>
            </li>
            <li>
              <span className="font-medium">First round:</span> Case study and behavioral interview (in-person or virtual).
              <ul className="list-disc list-inside ml-6 text-gray-500 text-sm mt-1">
                <li>You'll analyze a company or scenario and answer behavioral questions.</li>
              </ul>
            </li>
            <li>
              <span className="font-medium">Final round:</span> Group discussion and stock pitch presentation.
              <ul className="list-disc list-inside ml-6 text-gray-500 text-sm mt-1">
                <li>Present your investment thesis and participate in a collaborative discussion.</li>
              </ul>
            </li>
          </ol>
        </div>
        {/* Vertical Divider */}
        <div className="hidden md:block w-px bg-gray-300 mx-0" />
        {/* Quantitative Section */}
        <div className="flex-1 !p-8 flex flex-col items-center justify-start">
          <h2 className="!text-5xl text-center underline underline-offset-4 !mb-8" style={{ fontFamily: "'PP-Neue-World', serif" }}>Quantitative</h2>
          <p className="text-base text-gray-700 mb-8 text-center max-w-md">
            <span className="font-semibold">Click the following link to apply for this team:</span><br />
            <a href="https://example.com/quantitative-application" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-bold hover:!text-[#96BFCF]">Apply for Quantitative</a>
          </p>
          <h3 className="text-xl font-bold underline underline-offset-4 mb-3 mt-2">How to Prepare</h3>
          <ul className="list-disc list-inside text-gray-600 mb-8 text-left max-w-md space-y-2">
            <li><span className="font-medium">Review</span> probability, statistics, and basic programming concepts.</li>
            <li><span className="font-medium">Practice</span> solving quantitative brainteasers and logic puzzles.</li>
            <li><span className="font-medium">Be ready</span> to discuss your experience with coding or data analysis.</li>
          </ul>
          <h3 className="text-xl font-bold underline underline-offset-4 mb-3">Interview Pipeline</h3>
          <ol className="list-decimal list-inside text-gray-600 text-left max-w-md space-y-4 mb-2">
            <li>
              <span className="font-medium">Online assessment</span> (math, logic, and programming questions).
              <ul className="list-disc list-inside ml-6 text-gray-500 text-sm mt-1">
                <li>You'll receive a timed online test covering quantitative and coding skills.</li>
              </ul>
            </li>
            <li>
              <span className="font-medium">First round:</span> In-person technical and behavioral interview.
              <ul className="list-disc list-inside ml-6 text-gray-500 text-sm mt-1">
                <li>Expect technical questions, problem-solving, and a discussion of your experience.</li>
              </ul>
            </li>
            <li>
              <span className="font-medium">Final round:</span> Advanced technical interview and group problem-solving session.
              <ul className="list-disc list-inside ml-6 text-gray-500 text-sm mt-1">
                <li>Work with other candidates on a challenging quantitative case or project.</li>
              </ul>
            </li>
          </ol>
        </div>
      </div>
    </main>
    <Footer />
  </div>
)

export default Application