import { seoulAttractions } from '../data/seoulAttractions.js';

export function generateItinerary(days, selectedInterests, pace = 'moderate') {
  // Get all attractions for selected interests
  const relevantAttractions = [];
  
  selectedInterests.forEach(interest => {
    if (seoulAttractions[interest]) {
      relevantAttractions.push(...seoulAttractions[interest]);
    }
  });

  // Sort by priority and filter based on days available
  const prioritizedAttractions = relevantAttractions.sort((a, b) => {
    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  // Calculate daily time budget based on pace
  const paceSettings = {
    relaxed: { hoursPerDay: 6, maxAttractionsPerDay: 3 },
    moderate: { hoursPerDay: 8, maxAttractionsPerDay: 4 },
    intensive: { hoursPerDay: 10, maxAttractionsPerDay: 5 }
  };

  const { hoursPerDay, maxAttractionsPerDay } = paceSettings[pace];
  
  // Generate daily itineraries
  const itinerary = [];
  let remainingAttractions = [...prioritizedAttractions];
  
  for (let day = 1; day <= days; day++) {
    const dayPlan = {
      day,
      attractions: [],
      totalDuration: 0,
      districts: new Set()
    };

    // Try to group attractions by district for efficiency
    let currentHours = 0;
    let attractionsAdded = 0;

    while (
      currentHours < hoursPerDay && 
      attractionsAdded < maxAttractionsPerDay && 
      remainingAttractions.length > 0
    ) {
      // Find next best attraction that fits time budget
      let bestAttractionIndex = -1;
      
      // Prefer attractions in same district as already planned ones
      if (dayPlan.districts.size > 0) {
        const sameDistrictIndex = remainingAttractions.findIndex(attraction => 
          dayPlan.districts.has(attraction.district) && 
          currentHours + attraction.duration <= hoursPerDay
        );
        if (sameDistrictIndex !== -1) {
          bestAttractionIndex = sameDistrictIndex;
        }
      }
      
      // If no same district attraction found, pick the first one that fits
      if (bestAttractionIndex === -1) {
        bestAttractionIndex = remainingAttractions.findIndex(attraction => 
          currentHours + attraction.duration <= hoursPerDay
        );
      }
      
      // If no attraction fits, try to fit a shorter one
      if (bestAttractionIndex === -1) {
        bestAttractionIndex = remainingAttractions.findIndex(attraction => 
          attraction.duration <= 2
        );
      }

      if (bestAttractionIndex === -1) break;

      const selectedAttraction = remainingAttractions[bestAttractionIndex];
      dayPlan.attractions.push(selectedAttraction);
      dayPlan.totalDuration += selectedAttraction.duration;
      dayPlan.districts.add(selectedAttraction.district);
      
      currentHours += selectedAttraction.duration;
      attractionsAdded++;
      
      remainingAttractions.splice(bestAttractionIndex, 1);
    }

    // Convert districts Set to Array for JSON serialization
    dayPlan.districts = Array.from(dayPlan.districts);
    
    if (dayPlan.attractions.length > 0) {
      itinerary.push(dayPlan);
    }
  }

  return {
    itinerary,
    totalAttractions: itinerary.reduce((sum, day) => sum + day.attractions.length, 0),
    averageHoursPerDay: itinerary.reduce((sum, day) => sum + day.totalDuration, 0) / days,
    unvisitedAttractions: remainingAttractions.length
  };
}

export function getDistrictRecommendations(districts) {
  const districtInfo = {
    'Jongno-gu': {
      name: 'Jongno District',
      description: 'Historic heart of Seoul with palaces and traditional areas',
      transportation: 'Lines 1, 3, 5 subway access',
      foodRec: 'Traditional Korean cuisine in Insadong'
    },
    'Jung-gu': {
      name: 'Jung District', 
      description: 'Central Seoul with shopping and modern attractions',
      transportation: 'Lines 2, 4 subway access',
      foodRec: 'Street food in Myeongdong'
    },
    'Mapo-gu': {
      name: 'Mapo District',
      description: 'Youthful area with nightlife and university culture',
      transportation: 'Lines 2, 5, 6 subway access',
      foodRec: 'Korean BBQ and craft beer'
    },
    'Gangnam-gu': {
      name: 'Gangnam District',
      description: 'Upscale modern district south of Han River',
      transportation: 'Lines 2, 3, 7, 9 subway access',
      foodRec: 'High-end restaurants and cafes'
    },
    'Songpa-gu': {
      name: 'Songpa District',
      description: 'Modern area with entertainment complexes',
      transportation: 'Lines 2, 8 subway access',
      foodRec: 'International cuisine in Lotte World Mall'
    }
  };

  return districts.map(district => districtInfo[district] || {
    name: district,
    description: 'Explore this unique area of Seoul',
    transportation: 'Check subway map for best routes',
    foodRec: 'Try local restaurants and street food'
  });
}

export function optimizeRouteOrder(attractions) {
  // Simple optimization: group by district and time of day
  const grouped = attractions.reduce((acc, attraction) => {
    const district = attraction.district;
    if (!acc[district]) acc[district] = [];
    acc[district].push(attraction);
    return acc;
  }, {});

  // Sort within each district by best time
  Object.keys(grouped).forEach(district => {
    grouped[district].sort((a, b) => {
      const timeOrder = { 'Morning': 1, 'Afternoon': 2, 'Evening': 3, 'Night': 4 };
      const aTime = timeOrder[a.bestTime?.split(' ')[0]] || 2;
      const bTime = timeOrder[b.bestTime?.split(' ')[0]] || 2;
      return aTime - bTime;
    });
  });

  return grouped;
}