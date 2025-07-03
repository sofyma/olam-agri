import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

// Initialize Sanity client with your project details
const client = createClient({
  projectId: 'pvjzqmr4',
  dataset: 'production',
  apiVersion: '2024-03-13',
  token: process.env.SANITY_TOKEN, // Make sure to set this environment variable
  useCdn: false
});

// Game 3 questions with placeholder images (you can replace these with actual images later)
const game3Questions = [
  {
    _type: 'game3',
    question: 'Which colour is NOT part of our brand palette?',
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg' // Using existing placeholder
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
        _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg'
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
        _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg'
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
        _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg'
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
        _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg'
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
        _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg'
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
        _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg'
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
        _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg'
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
        _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg'
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
        _ref: 'image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg'
      }
    },
    options: ['Green (#00A865)', 'Orange (#FF7000)', 'Yellow (#F59E0B)', 'Red (#EF4444)'],
    correctAnswer: 'Green (#00A865)'
  }
];

// Function to add questions to Sanity
async function importGame3Questions() {
  try {
    console.log('🚀 Starting Game 3 questions import...');
    
    // Check if questions already exist
    const existingQuestions = await client.fetch(`*[_type == "game3"]`);
    if (existingQuestions.length > 0) {
      console.log(`⚠️  Found ${existingQuestions.length} existing Game 3 questions. Skipping import.`);
      console.log('If you want to reimport, please delete existing questions first.');
      return;
    }
    
    console.log(`📝 Importing ${game3Questions.length} Game 3 questions...`);
    
    const results = [];
    for (let i = 0; i < game3Questions.length; i++) {
      const question = game3Questions[i];
      console.log(`📋 Creating question ${i + 1}/${game3Questions.length}: "${question.question}"`);
      
      try {
        const result = await client.create(question);
        results.push(result);
        console.log(`✅ Created question: ${result._id}`);
      } catch (error) {
        console.error(`❌ Error creating question ${i + 1}:`, error.message);
      }
    }
    
    console.log(`🎉 Successfully imported ${results.length} Game 3 questions!`);
    console.log('📊 Summary:');
    console.log(`   - Total questions: ${game3Questions.length}`);
    console.log(`   - Successfully created: ${results.length}`);
    console.log(`   - Failed: ${game3Questions.length - results.length}`);
    
    if (results.length > 0) {
      console.log('\n📋 Created question IDs:');
      results.forEach((result, index) => {
        console.log(`   ${index + 1}. ${result._id}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error during import:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Function to delete all Game 3 questions (use with caution!)
async function deleteGame3Questions() {
  try {
    console.log('🗑️  Deleting all Game 3 questions...');
    
    const questions = await client.fetch(`*[_type == "game3"]`);
    console.log(`Found ${questions.length} questions to delete`);
    
    for (const question of questions) {
      await client.delete(question._id);
      console.log(`Deleted: ${question._id}`);
    }
    
    console.log('✅ All Game 3 questions deleted successfully!');
  } catch (error) {
    console.error('❌ Error deleting questions:', error);
  }
}

// Check command line arguments
const command = process.argv[2];

if (command === 'delete') {
  deleteGame3Questions();
} else {
  importGame3Questions();
} 