import React, { useState } from 'react'
import { 
  ArrowLeft, Calendar, Clock, MapPin, Navigation, 
  Download, Share2, Star, Info, Train, Utensils 
} from 'lucide-react'
import { getDistrictRecommendations } from '../utils/routePlanner'
import { clsx } from 'clsx'

function ItineraryDisplay({ plan, onBack }) {
  const [selectedDay, setSelectedDay] = useState(0)
  const [showExportOptions, setShowExportOptions] = useState(false)

  if (!plan || !plan.itinerary) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No itinerary generated yet.</p>
      </div>
    )
  }

  const { itinerary, totalAttractions, averageHoursPerDay, unvisitedAttractions, formData } = plan

  const exportAsText = () => {
    const text = itinerary.map(day => {
      const attractions = day.attractions.map(attraction => 
        `• ${attraction.name} (${attraction.nameKorean}) - ${attraction.duration}h\n  ${attraction.description}\n  📍 ${attraction.nearbySubway}\n  💡 ${attraction.tips}`
      ).join('\n\n')
      
      return `DAY ${day.day} (${day.totalDuration.toFixed(1)} hours)\n${'-'.repeat(40)}\n${attractions}`
    }).join('\n\n\n')

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `seoul-itinerary-${formData.days}days.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const shareItinerary = async () => {
    const shareText = `My ${formData.days}-day Seoul itinerary with ${totalAttractions} attractions! 🇰🇷\n\nGenerated with Seoul Travel Planner`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Seoul Travel Itinerary',
          text: shareText,
          url: window.location.href
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      navigator.clipboard.writeText(shareText)
      alert('Itinerary summary copied to clipboard!')
    }
  }

  const currentDay = itinerary[selectedDay]
  const allDistricts = [...new Set(itinerary.flatMap(day => day.districts))]
  const districtRecommendations = getDistrictRecommendations(allDistricts)

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Planning</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={shareItinerary}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="flex items-center space-x-2 btn-primary"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            
            {showExportOptions && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={exportAsText}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg"
                >
                  Download as Text
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Your {formData.days}-Day Seoul Adventure
        </h2>
        
        <div className="grid md:grid-cols-4 gap-4 text-center">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-seoul-blue">{totalAttractions}</div>
            <div className="text-sm text-gray-600">Total Attractions</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-seoul-blue">{averageHoursPerDay.toFixed(1)}h</div>
            <div className="text-sm text-gray-600">Avg Hours/Day</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-seoul-blue">{allDistricts.length}</div>
            <div className="text-sm text-gray-600">Districts</div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-seoul-blue capitalize">{formData.pace}</div>
            <div className="text-sm text-gray-600">Pace</div>
          </div>
        </div>

        {unvisitedAttractions > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              💡 <strong>{unvisitedAttractions} more attractions</strong> match your interests but didn't fit in your schedule. 
              Consider extending your trip or adjusting your pace!
            </p>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Day Navigation */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-8">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Daily Schedule</span>
            </h3>
            
            <div className="space-y-2">
              {itinerary.map((day, index) => (
                <button
                  key={day.day}
                  onClick={() => setSelectedDay(index)}
                  className={clsx(
                    'w-full text-left p-3 rounded-lg transition-all duration-200',
                    selectedDay === index
                      ? 'bg-seoul-blue text-white shadow-md'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Day {day.day}</span>
                    <span className="text-sm opacity-75">{day.totalDuration.toFixed(1)}h</span>
                  </div>
                  <div className="text-sm opacity-75 mt-1">
                    {day.attractions.length} attractions
                  </div>
                </button>
              ))}
            </div>

            {/* District Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Districts You'll Visit</h4>
              <div className="space-y-2">
                {districtRecommendations.slice(0, 3).map((district, index) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium text-gray-900">{district.name}</div>
                    <div className="text-gray-600 text-xs">{district.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Day Details */}
        <div className="lg:col-span-2">
          {currentDay && (
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Day {currentDay.day} - {currentDay.totalDuration.toFixed(1)} hours
                </h3>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentDay.districts.map(district => (
                    <span
                      key={district}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      📍 {district}
                    </span>
                  ))}
                </div>

                <div className="space-y-6">
                  {currentDay.attractions.map((attraction, index) => (
                    <div key={attraction.id} className="relative">
                      {/* Timeline connector */}
                      {index < currentDay.attractions.length - 1 && (
                        <div className="absolute left-6 top-16 w-0.5 h-16 bg-gray-200"></div>
                      )}
                      
                      <div className="flex space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-seoul-blue text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                        </div>
                        
                        <div className="flex-1 card p-4 hover-lift">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{attraction.name}</h4>
                              <p className="text-sm text-gray-500">{attraction.nameKorean}</p>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span>{attraction.duration}h</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-3">{attraction.description}</p>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start space-x-2">
                              <Train className="w-4 h-4 text-seoul-blue mt-0.5" />
                              <span className="text-gray-600">{attraction.nearbySubway}</span>
                            </div>
                            
                            <div className="flex items-start space-x-2">
                              <Clock className="w-4 h-4 text-seoul-blue mt-0.5" />
                              <span className="text-gray-600">Best time: {attraction.bestTime}</span>
                            </div>
                            
                            <div className="flex items-start space-x-2">
                              <Info className="w-4 h-4 text-seoul-blue mt-0.5" />
                              <span className="text-gray-600">{attraction.tips}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                Priority: {attraction.priority}
                              </span>
                              <div className="flex items-center space-x-1">
                                {[...Array(3)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={clsx(
                                      'w-3 h-3',
                                      attraction.priority === 'high' && i < 3 ? 'text-yellow-400 fill-current' :
                                      attraction.priority === 'medium' && i < 2 ? 'text-yellow-400 fill-current' :
                                      attraction.priority === 'low' && i < 1 ? 'text-yellow-400 fill-current' :
                                      'text-gray-300'
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Day Recommendations */}
              <div className="card p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Utensils className="w-5 h-5 text-seoul-blue" />
                  <span>Day {currentDay.day} Recommendations</span>
                </h4>
                
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Food & Dining</h5>
                    <ul className="space-y-1 text-gray-600">
                      {currentDay.districts.map(district => {
                        const districtInfo = districtRecommendations.find(d => d.name.includes(district.split('-')[0]))
                        return districtInfo ? (
                          <li key={district}>• {districtInfo.foodRec}</li>
                        ) : null
                      })}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Transportation</h5>
                    <ul className="space-y-1 text-gray-600">
                      {currentDay.districts.map(district => {
                        const districtInfo = districtRecommendations.find(d => d.name.includes(district.split('-')[0]))
                        return districtInfo ? (
                          <li key={district}>• {districtInfo.transportation}</li>
                        ) : null
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ItineraryDisplay