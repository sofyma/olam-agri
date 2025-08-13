# Game 6: Branching Questionnaire System

## Overview
Game 6 has been transformed from a simple Q&A system to a sophisticated branching questionnaire that creates a "choose-your-own-adventure" experience. Each answer can lead to different questions, creating multiple paths through the game.

## New Schema: `game6Question`

### Structure
- **questionId**: Unique identifier (Q1, Q2, Q3, etc.)
- **questionText**: The actual question to display
- **answers**: Array of possible answers (2-4 answers per question)
- **nextQuestion**: Reference to the next question (creates branching)
- **isEndGame**: Boolean flag for answers that end the game
- **endGameMessage**: Custom message shown when game ends
- **isStartQuestion**: Marks the first question of the game
- **order**: Display order for reference
- **isActive**: Whether the question is active

### Answer Structure
Each answer contains:
- **answerText**: The text displayed to the user
- **nextQuestion**: Reference to the next question document
- **isEndGame**: Whether this answer ends the game
- **endGameMessage**: Message shown when game ends (if applicable)

## How to Set Up in Sanity Studio

### Step 1: Create Questions in Order
1. Start with Q1 (mark as `isStartQuestion: true`)
2. Create Q2, Q3, Q4, etc. in sequence
3. Each question can reference questions created before it

### Step 2: Set Up References
- Use the `nextQuestion` field to create the branching logic
- Leave `nextQuestion` empty for answers that end the game
- Set `isEndGame: true` for final answers

### Step 3: Configure End Game
- For the final question (Q16), set one answer with `isEndGame: true`
- Add an `endGameMessage` for that answer

## Example Branching Logic

```
Q1 → Both answers lead to Q2
Q2 → Answer A leads to Q3, Answer B leads to Q4
Q3 → Both answers lead to Q5
Q4 → Both answers lead to Q6
Q5 & Q6 → Both lead to Q7 & Q8 respectively
...and so on...
```

## Benefits of This System

1. **Dynamic Paths**: Users can take different routes through the game
2. **Personalized Experience**: Questions adapt based on previous answers
3. **Flexible Content**: Easy to modify, add, or remove questions
4. **Scalable**: Can handle complex branching scenarios
5. **Maintainable**: Clear structure in Sanity CMS

## Frontend Implementation Notes

The frontend will need to:
1. Start with the question marked as `isStartQuestion: true`
2. Display the question text and all possible answers
3. When an answer is selected, fetch the referenced `nextQuestion`
4. Continue until reaching an answer with `isEndGame: true`
5. Display the `endGameMessage` and end the game

## Migration from Old System

- The old `game6` schema remains for backward compatibility
- New questions use the `game6Question` schema
- Frontend can be updated gradually to use the new system

## Testing the Branching Logic

1. Create a few test questions first
2. Verify references work correctly
3. Test different paths through the game
4. Ensure end-game scenarios work properly

## Future Enhancements

- Add scoring based on answer paths
- Include conditional logic for answer visibility
- Add analytics tracking for user paths
- Support for multimedia content in questions
