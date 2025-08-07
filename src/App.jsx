import React, { useState } from 'react'
import { MapPin, Calendar, Clock, Users, Compass, Star, Info, Navigation } from 'lucide-react'
import { interestCategories, transportationTips, generalTips } from './data/seoulAttractions'
import { generateItinerary, getDistrictRecommendations } from './utils/routePlanner'
import PlanningForm from './components/PlanningForm'
import ItineraryDisplay from './components/ItineraryDisplay'
import './App.css'

function App() {
  const [currentStep, setCurrentStep] = useState('planning') // 'planning', 'results'
  const [planData, setPlanData] = useState({
    days: 3,
    selectedInterests: [],
    pace: 'moderate'
  })
  const [generatedPlan, setGeneratedPlan] = useState(null)

  const handlePlanGeneration = (formData) => {
    const itineraryResult = generateItinerary(
      formData.days, 
      formData.selectedInterests, 
      formData.pace
    )
    
    setGeneratedPlan({
      ...itineraryResult,
      formData
    })
    setCurrentStep('results')
  }

  const handleBackToPlanning = () => {
    setCurrentStep('planning')
    setGeneratedPlan(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-seoul-blue rounded-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Seoul Travel Planner</h1>
                <p className="text-sm text-gray-500">Plan your perfect trip to South Korea</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <span className="text-2xl">🇰🇷</span>
                <span>서울특별시</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 'planning' ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Discover Seoul Like a Local
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get a personalized itinerary for your first visit to Seoul, South Korea. 
                Choose your interests and trip duration to receive expert recommendations.
              </p>
              <div className="flex items-center justify-center space-x-8 mt-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-seoul-blue" />
                  <span>1-14 Days</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-seoul-blue" />
                  <span>20+ Attractions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Navigation className="w-5 h-5 text-seoul-blue" />
                  <span>Smart Routes</span>
                </div>
              </div>
            </div>

            {/* Planning Form */}
            <PlanningForm
              planData={planData}
              setPlanData={setPlanData}
              onGenerate={handlePlanGeneration}
            />

            {/* Tips Section */}
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Navigation className="w-5 h-5 text-seoul-blue" />
                  <span>Transportation Tips</span>
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {transportationTips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 bg-seoul-blue rounded-full mt-2 flex-shrink-0"></span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Info className="w-5 h-5 text-seoul-blue" />
                  <span>General Tips</span>
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {generalTips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 bg-seoul-blue rounded-full mt-2 flex-shrink-0"></span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <ItineraryDisplay
            plan={generatedPlan}
            onBack={handleBackToPlanning}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>Made with ❤️ for first-time visitors to Seoul, South Korea</p>
            <p className="mt-2">Plan responsibly and respect local customs • 안전한 여행 되세요!</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App