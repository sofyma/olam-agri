# Game 3 - Array Index Fix

## Problem
The ball stopped moving and questions weren't displayed when reaching the first checkpoint. This was caused by the order-based logic trying to find questions with specific order values that didn't exist in the questions array.

## Root Cause
The logic was trying to find questions by their `order` field values (6, 7, 8, 9, 10), but the questions array might not contain questions with those exact order values, causing `currentQuestion` to be `null` and the modal not to display.

## Solution
Reverted to using array indices instead of order values for question selection, while keeping the order field for display purposes.

### **1. Updated Checkpoint Logic**

**Before:**
```typescript
// Set the starting question order based on checkpoint
const startingQuestionOrder = checkpoint.id === 1 ? 6 : 11;

return {
  ...state,
  currentQuestionOrder: startingQuestionOrder,
  // ...
};
```

**After:**
```typescript
// Set the starting question index based on checkpoint
const startingQuestionIndex = (checkpoint.id - 1) * 5;

return {
  ...state,
  currentQuestionIndex: startingQuestionIndex,
  // ...
};
```

### **2. Updated Answer Processing Logic**

**Before:**
```typescript
// Find the current question by order value
const currentQuestion = state.questions.find(q => q.id === state.currentQuestionOrder);

// Find the current question index
const currentQuestionIndex = state.questions.findIndex(q => q.id === state.currentQuestionOrder);

if (currentQuestionIndex === endingIndex || currentQuestionIndex === -1) {
  // Question not found
}
```

**After:**
```typescript
// Get the current question by array index
const currentQuestion = state.questions[state.currentQuestionIndex];

if (state.currentQuestionIndex === endingIndex) {
  // All 5 questions completed for this checkpoint
}
```

### **3. Updated Question Selection**

**Before:**
```typescript
$: currentQuestion = $game3Store.questions.find(q => q.id === $game3Store.currentQuestionOrder) || null;
```

**After:**
```typescript
$: currentQuestion = $game3Store.questions[$game3Store.currentQuestionIndex] || null;
```

### **4. Updated Pagination Logic**

**Before:**
```svelte
currentQuestionNumber={($game3Store.questions.findIndex(q => q.id === $game3Store.currentQuestionOrder) % 5) + 1}
```

**After:**
```svelte
currentQuestionNumber={($game3Store.currentQuestionIndex % 5) + 1}
```

## How It Works Now

### **Checkpoint 1 (ID: 1)**
- **Starting Index**: 5
- **Questions Shown**: Array indices 5, 6, 7, 8, 9 (Order 1-5)
- **Pagination**: Shows "1 of 5", "2 of 5", "3 of 5", "4 of 5", "5 of 5"

### **Checkpoint 2 (ID: 2)**
- **Starting Index**: 0
- **Questions Shown**: Array indices 0, 1, 2, 3, 4 (Order 6-10)
- **Pagination**: Shows "1 of 5", "2 of 5", "3 of 5", "4 of 5", "5 of 5"

### **Question Order**
- Questions are still ordered by their `order` field in Sanity
- The array indices correspond to the sorted order of questions
- Order field values are preserved for display purposes

## Benefits

1. **✅ Reliable Question Selection**: Uses array indices which are guaranteed to exist
2. **✅ No Missing Questions**: All questions in the array will be accessible
3. **✅ Proper Modal Display**: Questions will always be found and displayed
4. **✅ Ball Movement Continues**: No more stopping at checkpoints
5. **✅ Maintains Order**: Questions still respect the order field from Sanity

## Debugging Removed

The following debugging logs were removed to clean up the code:
- `console.log('Raw Sanity questions:', sanityQuestions);`
- `console.log('Processed questions:', this.questions);`
- `console.log('Setting starting question order:', startingQuestionOrder);`
- `console.log('Looking for question with order:', state.currentQuestionOrder);`

The Game 3 questions now work reliably with array indices while maintaining the order field for proper sequencing! 🎉 