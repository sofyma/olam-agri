import { createClient } from '@sanity/client';

// Initialize Sanity client
const client = createClient({
  projectId: 'your-project-id', // Replace with your actual project ID
  dataset: 'production', // or your dataset name
  apiVersion: '2024-01-01',
  token: 'your-token', // You'll need a token with write permissions
  useCdn: false
});

// Game 3 questions
const game3Questions = [
  {
    _type: 'game3',
    question: 'Which colour is NOT part of our brand palette?',
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-1234567890' // You'll need to replace this with actual image reference
      }
    },
    options: ['Orange (#FF7000)', 'Dark Gray (#2E2D2C)', 'Green (#00A865)', 'Purple (#8B5CF6)'],
    correctAnswer: 'Purple (#8B5CF6)'
  },
  {
    _type: 'game3',
    question: 'What is the primary brand colour used in our logo?',
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-1234567891'
      }
    },
    options: ['Blue (#3B82F6)', 'Orange (#FF7000)', 'Red (#EF4444)', 'Yellow (#F59E0B)'],
    correctAnswer: 'Orange (#FF7000)'
  },
  {
    _type: 'game3',
    question: 'Which colour represents success in our brand guidelines?',
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-1234567892'
      }
    },
    options: ['Red (#EF4444)', 'Green (#00A865)', 'Blue (#3B82F6)', 'Yellow (#F59E0B)'],
    correctAnswer: 'Green (#00A865)'
  },
  {
    _type: 'game3',
    question: 'What is the neutral background colour in our design system?',
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-1234567893'
      }
    },
    options: ['Light Gray (#F3F4F6)', 'Dark Gray (#2E2D2C)', 'White (#FFFFFF)', 'Black (#000000)'],
    correctAnswer: 'Dark Gray (#2E2D2C)'
  },
  {
    _type: 'game3',
    question: 'Which colour combination creates the best contrast for accessibility?',
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-1234567894'
      }
    },
    options: ['Orange on White', 'Orange on Dark Gray', 'Green on Orange', 'Purple on Green'],
    correctAnswer: 'Orange on Dark Gray'
  },
  {
    _type: 'game3',
    question: 'What colour represents error states in our interface?',
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-1234567895'
      }
    },
    options: ['Red (#EF4444)', 'Orange (#FF7000)', 'Yellow (#F59E0B)', 'Blue (#3B82F6)'],
    correctAnswer: 'Red (#EF4444)'
  },
  {
    _type: 'game3',
    question: 'Which colour is used for secondary actions in our buttons?',
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-1234567896'
      }
    },
    options: ['Dark Gray (#2E2D2C)', 'Light Gray (#F3F4F6)', 'Blue (#3B82F6)', 'Green (#00A865)'],
    correctAnswer: 'Dark Gray (#2E2D2C)'
  },
  {
    _type: 'game3',
    question: 'What colour represents warning states in our design system?',
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-1234567897'
      }
    },
    options: ['Yellow (#F59E0B)', 'Orange (#FF7000)', 'Red (#EF4444)', 'Blue (#3B82F6)'],
    correctAnswer: 'Yellow (#F59E0B)'
  },
  {
    _type: 'game3',
    question: 'Which colour is used for links in our brand guidelines?',
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-1234567898'
      }
    },
    options: ['Blue (#3B82F6)', 'Orange (#FF7000)', 'Green (#00A865)', 'Purple (#8B5CF6)'],
    correctAnswer: 'Blue (#3B82F6)'
  },
  {
    _type: 'game3',
    question: 'What is the accent colour used for highlights and emphasis?',
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-1234567899'
      }
    },
    options: ['Green (#00A865)', 'Orange (#FF7000)', 'Yellow (#F59E0B)', 'Red (#EF4444)'],
    correctAnswer: 'Green (#00A865)'
  }
];

// Function to add questions to Sanity
async function addGame3Questions() {
  try {
    console.log('Adding Game 3 questions to Sanity...');
    
    for (const question of game3Questions) {
      const result = await client.create(question);
      console.log(`Created question: ${result._id}`);
    }
    
    console.log('All Game 3 questions added successfully!');
  } catch (error) {
    console.error('Error adding questions:', error);
  }
}

// Run the function
addGame3Questions(); 