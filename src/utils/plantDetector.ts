// Common plants that might be discussed in the chat
const PLANT_KEYWORDS = [
  'lettuce', 'butterhead', 'pak choi', 'kangkung', 'spinach',
  'basil', 'mint', 'coriander', 'spring onion', 'green onion',
  'cherry tomato', 'tomato', 'chili', 'pepper', 'chilli',
  'arugula', 'rocket', 'kale', 'chard', 'watercress',
  'parsley', 'cilantro', 'dill', 'thyme', 'oregano',
  'bok choy', 'mustard green', 'collard', 'cabbage',
  'salad', 'herb', 'microgreen'
];

/**
 * Detects plant names in a text message
 * Returns the first detected plant name or null
 */
export const detectPlantInMessage = (message: string): string | null => {
  const lowerMessage = message.toLowerCase();
  
  // Check for plant keywords
  for (const plant of PLANT_KEYWORDS) {
    if (lowerMessage.includes(plant)) {
      // Return capitalized version
      return plant.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  }
  
  return null;
};

/**
 * Extracts plant name from AI response that might contain plant recommendations
 * Looks for patterns like "grow [plant]" or "[plant] is a great choice"
 */
export const extractPlantFromResponse = (response: string): string | null => {
  const patterns = [
    /(?:grow|growing|plant|try)\s+([a-z\s]+?)(?:\s+is|\s+would|\s+can|\.|!|\?|,)/i,
    /([a-z\s]+?)\s+(?:is a great|would be|is perfect|works well)/i,
    /recommend\s+([a-z\s]+?)(?:\s+for|\s+because|\.|!)/i,
  ];

  for (const pattern of patterns) {
    const match = response.match(pattern);
    if (match && match[1]) {
      const plantName = match[1].trim();
      // Verify it's a known plant
      if (PLANT_KEYWORDS.some(keyword => plantName.toLowerCase().includes(keyword))) {
        return plantName.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    }
  }

  // Fallback to simple detection
  return detectPlantInMessage(response);
};
