# Game 3 Questions - Sequential Display Fix

## Problem
The Game 3 questions were being displayed randomly instead of sequentially. The logic was showing the same first 5 questions for both checkpoints instead of showing:
- **Checkpoint 1**: Questions 1-5 (first 5 questions from Sanity)
- **Checkpoint 2**: Questions 6-10 (next 5 questions from Sanity)

## Root Cause
The issue was in the `game3Store.ts` logic:

1. **Checkpoint Collision**: When a checkpoint was reached, it didn't set the correct starting question index
2. **Question Completion**: After completing 5 questions, it reset `currentQuestionIndex` to 0, causing the same questions to be shown again

## Solution

### **1. Fixed Checkpoint Collision Logic**
**Before:**
```typescript
if (checkpoint) {
  return {
    ...state,
    ballPosition: { x: nextX, y: nextY },
    showQuestionModal: true,
    currentCheckpoint: checkpoint.id,
    checkpointsReached: state.checkpointsReached + 1
  };
}
```

**After:**
```typescript
if (checkpoint) {
  // Set the starting question index based on checkpoint
  // Checkpoint 1: questions 0-4 (first 5 questions)
  // Checkpoint 2: questions 5-9 (next 5 questions)
  const startingQuestionIndex = (checkpoint.id - 1) * 5;
  
  return {
    ...state,
    ballPosition: { x: nextX, y: nextY },
    showQuestionModal: true,
    currentCheckpoint: checkpoint.id,
    currentQuestionIndex: startingQuestionIndex,
    checkpointsReached: state.checkpointsReached + 1
  };
}
```

### **2. Fixed Question Completion Logic**
**Before:**
```typescript
// Move to next question or close modal
if (state.currentQuestionIndex === 4) {
  // All 5 questions completed
  newState.showQuestionModal = false;
  newState.currentQuestionIndex = 0; // Reset for next checkpoint
  // ...
}
```

**After:**
```typescript
// Move to next question or close modal
// Check if we've completed all 5 questions for the current checkpoint
const questionsPerCheckpoint = 5;
const startingIndex = state.currentCheckpoint ? (state.currentCheckpoint - 1) * questionsPerCheckpoint : 0;
const endingIndex = startingIndex + questionsPerCheckpoint - 1;

if (state.currentQuestionIndex === endingIndex) {
  // All 5 questions completed for this checkpoint
  newState.showQuestionModal = false;
  // ...
}
```

## How It Works Now

### **Checkpoint 1 (ID: 1)**
- **Starting Index**: `(1 - 1) * 5 = 0`
- **Questions Shown**: 0, 1, 2, 3, 4 (first 5 questions from Sanity)
- **Ending Index**: `0 + 5 - 1 = 4`

### **Checkpoint 2 (ID: 2)**
- **Starting Index**: `(2 - 1) * 5 = 5`
- **Questions Shown**: 5, 6, 7, 8, 9 (next 5 questions from Sanity)
- **Ending Index**: `5 + 5 - 1 = 9`

## Benefits

1. **✅ Sequential Display**: Questions are now shown in order from Sanity
2. **✅ No Repetition**: Each checkpoint shows different questions
3. **✅ Predictable Behavior**: First checkpoint shows first 5 questions, second shows next 5
4. **✅ Scalable**: Easy to add more checkpoints with more questions
5. **✅ Maintains Order**: Respects the `order(_createdAt asc)` from Sanity query

## Requirements

- **Sanity CMS**: Must have at least 10 questions total (5 for each checkpoint)
- **Question Order**: Questions are ordered by creation date in Sanity
- **Checkpoint IDs**: Must be sequential (1, 2, 3, etc.) for proper calculation

The Game 3 questions now display sequentially as intended! 🎉 