import React, { useState } from 'react'
import { Calendar, Clock, Users, Compass, ArrowRight, Check } from 'lucide-react'
import { interestCategories } from '../data/seoulAttractions'
import { clsx } from 'clsx'

function PlanningForm({ planData, setPlanData, onGenerate }) {
  const [currentSection, setCurrentSection] = useState(0)
  const sections = ['duration', 'interests', 'pace', 'review']

  const updatePlanData = (field, value) => {
    setPlanData(prev => ({ ...prev, [field]: value }))
  }

  const toggleInterest = (interestId) => {
    const isSelected = planData.selectedInterests.includes(interestId)
    const newInterests = isSelected
      ? planData.selectedInterests.filter(id => id !== interestId)
      : [...planData.selectedInterests, interestId]
    
    updatePlanData('selectedInterests', newInterests)
  }

  const canProceed = () => {
    switch (currentSection) {
      case 0: return planData.days >= 1 && planData.days <= 14
      case 1: return planData.selectedInterests.length > 0
      case 2: return planData.pace !== ''
      case 3: return true
      default: return false
    }
  }

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const renderDurationSection = () => (
    <div className="space-y-6 fade-in">
      <div className="text-center">
        <Calendar className="w-12 h-12 text-seoul-blue mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">How long is your stay?</h3>
        <p className="text-gray-600">Choose the number of days you'll be in Seoul</p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <label className="text-sm font-medium text-gray-700 min-w-0">Days:</label>
          <div className="flex-1">
            <input
              type="range"
              min="1"
              max="14"
              value={planData.days}
              onChange={(e) => updatePlanData('days', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <div className="min-w-0">
            <span className="text-2xl font-bold text-seoul-blue">{planData.days}</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(day => (
            <button
              key={day}
              onClick={() => updatePlanData('days', day)}
              className={clsx(
                'h-10 rounded-lg text-sm font-medium transition-all duration-200',
                planData.days === day
                  ? 'bg-seoul-blue text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          {planData.days === 1 && "Perfect for a quick taste of Seoul"}
          {planData.days >= 2 && planData.days <= 4 && "Great for seeing the highlights"}
          {planData.days >= 5 && planData.days <= 7 && "Ideal for a comprehensive experience"}
          {planData.days >= 8 && "Excellent for deep exploration"}
        </div>
      </div>
    </div>
  )

  const renderInterestsSection = () => (
    <div className="space-y-6 fade-in">
      <div className="text-center">
        <Compass className="w-12 h-12 text-seoul-blue mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">What interests you?</h3>
        <p className="text-gray-600">Select all categories that appeal to you</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {interestCategories.map(category => (
          <button
            key={category.id}
            onClick={() => toggleInterest(category.id)}
            className={clsx(
              'card p-6 text-left transition-all duration-300 hover-lift',
              planData.selectedInterests.includes(category.id)
                ? 'ring-2 ring-seoul-blue bg-blue-50 border-seoul-blue'
                : 'hover:shadow-lg'
            )}
          >
            <div className="flex items-start space-x-3">
              <span className="text-3xl">{category.icon}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{category.name}</h4>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
              {planData.selectedInterests.includes(category.id) && (
                <Check className="w-5 h-5 text-seoul-blue flex-shrink-0" />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500">
        Selected: {planData.selectedInterests.length} categories
      </div>
    </div>
  )

  const renderPaceSection = () => (
    <div className="space-y-6 fade-in">
      <div className="text-center">
        <Clock className="w-12 h-12 text-seoul-blue mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">What's your travel pace?</h3>
        <p className="text-gray-600">Choose how intensive you want your itinerary to be</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {[
          {
            id: 'relaxed',
            name: 'Relaxed',
            description: '6 hours/day • 3 attractions max • Plenty of rest time',
            icon: '🌸'
          },
          {
            id: 'moderate',
            name: 'Moderate',
            description: '8 hours/day • 4 attractions max • Balanced schedule',
            icon: '🚶'
          },
          {
            id: 'intensive',
            name: 'Intensive',
            description: '10 hours/day • 5 attractions max • Action-packed',
            icon: '🏃'
          }
        ].map(pace => (
          <button
            key={pace.id}
            onClick={() => updatePlanData('pace', pace.id)}
            className={clsx(
              'card w-full p-6 text-left transition-all duration-300 hover-lift',
              planData.pace === pace.id
                ? 'ring-2 ring-seoul-blue bg-blue-50 border-seoul-blue'
                : 'hover:shadow-lg'
            )}
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{pace.icon}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{pace.name}</h4>
                <p className="text-sm text-gray-600">{pace.description}</p>
              </div>
              {planData.pace === pace.id && (
                <Check className="w-6 h-6 text-seoul-blue" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  const renderReviewSection = () => (
    <div className="space-y-6 fade-in">
      <div className="text-center">
        <Users className="w-12 h-12 text-seoul-blue mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to explore Seoul?</h3>
        <p className="text-gray-600">Review your preferences and generate your personalized itinerary</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <div className="card p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Your Travel Plan</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Duration</span>
              <span className="font-medium">{planData.days} days</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pace</span>
              <span className="font-medium capitalize">{planData.pace}</span>
            </div>
            
            <div>
              <span className="text-gray-600">Interests</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {planData.selectedInterests.map(interestId => {
                  const category = interestCategories.find(cat => cat.id === interestId)
                  return (
                    <span
                      key={interestId}
                      className="interest-tag interest-tag-selected"
                    >
                      {category?.icon} {category?.name}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => onGenerate(planData)}
          className="w-full btn-seoul text-white py-4 rounded-lg font-semibold text-lg flex items-center justify-center space-x-2 hover-lift"
        >
          <span>Generate My Seoul Itinerary</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )

  const renderSection = () => {
    switch (currentSection) {
      case 0: return renderDurationSection()
      case 1: return renderInterestsSection()
      case 2: return renderPaceSection()
      case 3: return renderReviewSection()
      default: return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {sections.map((section, index) => (
            <div
              key={section}
              className={clsx(
                'flex items-center space-x-2 text-sm font-medium',
                index <= currentSection ? 'text-seoul-blue' : 'text-gray-400'
              )}
            >
              <div
                className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
                  index < currentSection
                    ? 'bg-seoul-blue text-white'
                    : index === currentSection
                    ? 'bg-seoul-blue text-white'
                    : 'bg-gray-200 text-gray-500'
                )}
              >
                {index < currentSection ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className="capitalize hidden sm:inline">{section}</span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-seoul-blue h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Current Section */}
      <div className="min-h-96">
        {renderSection()}
      </div>

      {/* Navigation */}
      {currentSection < 3 && (
        <div className="flex justify-between mt-8">
          <button
            onClick={prevSection}
            disabled={currentSection === 0}
            className={clsx(
              'px-6 py-3 rounded-lg font-medium transition-colors duration-200',
              currentSection === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'btn-secondary hover:bg-gray-300'
            )}
          >
            Previous
          </button>

          <button
            onClick={nextSection}
            disabled={!canProceed()}
            className={clsx(
              'px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2',
              canProceed()
                ? 'btn-primary hover:bg-blue-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            )}
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

export default PlanningForm