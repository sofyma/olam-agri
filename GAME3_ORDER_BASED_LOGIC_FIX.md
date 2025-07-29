# Game 3 - Order-Based Logic Fix

## Problem
The Game 3 questions were still using array indices instead of the actual `order` field values. When you set the order field to 1, 2, 3, etc. in Sanity, the questions should appear in that exact order, but they were starting with question order 6 instead of 1.

## Root Cause
The logic was still using array-based indexing (`currentQuestionIndex`) instead of order-based logic (`currentQuestionOrder`).

## Solution

### **1. Added Order-Based State Tracking**

**Updated `Game3State` interface:**
```typescript
interface Game3State {
  questions: Question[];
  currentQuestionIndex: number;
  currentQuestionOrder: number; // Track the order value of current question
  // ... other fields
}
```

### **2. Updated Checkpoint Collision Logic**

**Before:**
```typescript
// Set the starting question index based on checkpoint
// Checkpoint 1: questions 0-4 (first 5 questions)
// Checkpoint 2: questions 5-9 (next 5 questions)
const startingQuestionIndex = (checkpoint.id - 1) * 5;

return {
  ...state,
  currentQuestionIndex: startingQuestionIndex,
  // ...
};
```

**After:**
```typescript
// Set the starting question order based on checkpoint
// Checkpoint 1: questions with order 1-5
// Checkpoint 2: questions with order 6-10
const startingQuestionOrder = (checkpoint.id - 1) * 5 + 1;

return {
  ...state,
  currentQuestionOrder: startingQuestionOrder,
  // ...
};
```

### **3. Updated Question Selection Logic**

**Before:**
```typescript
const currentQuestion = state.questions[state.currentQuestionIndex];
```

**After:**
```typescript
const currentQuestion = state.questions.find(q => q.id === state.currentQuestionOrder);
```

### **4. Updated Answer Processing Logic**

**Before:**
```typescript
// Check if we've completed all 5 questions for the current checkpoint
const questionsPerCheckpoint = 5;
const startingIndex = state.currentCheckpoint ? (state.currentCheckpoint - 1) * questionsPerCheckpoint : 0;
const endingIndex = startingIndex + questionsPerCheckpoint - 1;

if (state.currentQuestionIndex === endingIndex) {
  // All 5 questions completed for this checkpoint
  // ...
} else {
  newState.currentQuestionIndex++;
}
```

**After:**
```typescript
// Check if we've completed all 5 questions for the current checkpoint
const questionsPerCheckpoint = 5;
const startingOrder = state.currentCheckpoint ? (state.currentCheckpoint - 1) * questionsPerCheckpoint + 1 : 1;
const endingOrder = startingOrder + questionsPerCheckpoint - 1;

if (state.currentQuestionOrder === endingOrder) {
  // All 5 questions completed for this checkpoint
  // ...
} else {
  newState.currentQuestionOrder++;
}
```

### **5. Updated Pagination Logic**

**Before:**
```svelte
currentQuestionNumber={($game3Store.currentQuestionIndex % 5) + 1}
```

**After:**
```svelte
currentQuestionNumber={($game3Store.currentQuestionOrder % 5) || 5}
```

### **6. Updated Current Question Selection**

**Before:**
```typescript
$: currentQuestion = $game3Store.questions[$game3Store.currentQuestionIndex];
```

**After:**
```typescript
$: currentQuestion = $game3Store.questions.find(q => q.id === $game3Store.currentQuestionOrder) || null;
```

## How It Works Now

### **Question Selection by Order:**
- **Checkpoint 1**: Starts with `currentQuestionOrder = 1`, then 2, 3, 4, 5
- **Checkpoint 2**: Starts with `currentQuestionOrder = 6`, then 7, 8, 9, 10

### **Pagination Logic:**
- **Checkpoint 1**: Order 1, 2, 3, 4, 5 → Shows "1 of 5", "2 of 5", "3 of 5", "4 of 5", "5 of 5"
- **Checkpoint 2**: Order 6, 7, 8, 9, 10 → Shows "1 of 5", "2 of 5", "3 of 5", "4 of 5", "5 of 5"

### **Formula:**
```typescript
// For any checkpoint, the relative question number is:
currentQuestionNumber = (order % 5) || 5

// Examples:
// Order 1 → (1 % 5) = 1
// Order 2 → (2 % 5) = 2
// Order 5 → (5 % 5) = 0 → 5 (using || 5)
// Order 6 → (6 % 5) = 1
// Order 7 → (7 % 5) = 2
```

## Benefits

1. **✅ Exact Order Control**: Questions appear in the exact order specified in Sanity
2. **✅ Correct Starting Point**: First checkpoint now starts with order 1, not 6
3. **✅ Proper Pagination**: Always shows "1 of 5" to "5 of 5" for each checkpoint
4. **✅ Order-Based Logic**: Uses actual order field values instead of array positions
5. **✅ Predictable Behavior**: Questions follow the exact order set in Sanity CMS

## Requirements for Content Managers

### **Sanity CMS Setup:**
1. **Set Order Field**: Each Game 3 question must have an `order` field
2. **Sequential Ordering**: Set order numbers as 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, etc.
3. **Checkpoint 1**: Questions with order 1-5 will appear at first checkpoint
4. **Checkpoint 2**: Questions with order 6-10 will appear at second checkpoint

### **Example Setup:**
| Order | Question | Checkpoint |
|-------|----------|------------|
| 1 | "What is the capital of France?" | 1 |
| 2 | "Which planet is closest to the Sun?" | 1 |
| 3 | "What is 2 + 2?" | 1 |
| 4 | "Who wrote Romeo and Juliet?" | 1 |
| 5 | "What is the largest ocean?" | 1 |
| 6 | "What year did World War II end?" | 2 |
| 7 | "What is the chemical symbol for gold?" | 2 |
| 8 | "Who painted the Mona Lisa?" | 2 |
| 9 | "What is the square root of 16?" | 2 |
| 10 | "What is the largest mammal?" | 2 |

The Game 3 questions now display in the exact order specified in the Sanity CMS! 🎉 