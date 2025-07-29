# Game 3 - Order Field and Pagination Fix

## Problem
1. **Question Order**: Questions were ordered by creation date instead of a specific order field
2. **Pagination Issue**: Showing "6 of 5" instead of "1 of 5" for the second checkpoint

## Root Cause
1. **Sanity Query**: Was using `order(_createdAt asc)` instead of an `order` field
2. **Pagination Logic**: Was using global question index instead of checkpoint-relative index

## Solution

### **1. Added Order Field to Sanity Schema**

**Updated `src/schemas/game3.js`:**
```javascript
{
  name: 'order',
  title: 'Question Order',
  type: 'number',
  validation: Rule => Rule.required().integer().positive(),
  description: 'The order in which this question should appear (1, 2, 3, etc.)'
}
```

### **2. Updated Sanity Query**

**Before:**
```typescript
const query = `*[_type == "game3"] {
  _id,
  question,
  "imageAsset": image.asset->{
    _id,
    _type,
    url
  },
  options,
  correctAnswer
} | order(_createdAt asc)`;
```

**After:**
```typescript
const query = `*[_type == "game3"] {
  _id,
  order,
  question,
  "imageAsset": image.asset->{
    _id,
    _type,
    url
  },
  options,
  correctAnswer
} | order(order asc)`;
```

### **3. Updated Question ID Logic**

**Before:**
```typescript
id: parseInt(q._id.replace(/^[^0-9]*/, '')),
```

**After:**
```typescript
id: q.order, // Use the order field as the ID
```

### **4. Fixed Pagination Logic**

**Before:**
```svelte
currentQuestionNumber={$game3Store.currentQuestionIndex + 1}
```

**After:**
```svelte
currentQuestionNumber={($game3Store.currentQuestionIndex % 5) + 1}
```

## How It Works Now

### **Question Ordering:**
- Questions are now ordered by the `order` field in Sanity
- Admin can set specific order numbers (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, etc.)
- Questions will appear in the exact order specified

### **Pagination Logic:**
- **Checkpoint 1**: Questions 0-4 → Shows "1 of 5", "2 of 5", "3 of 5", "4 of 5", "5 of 5"
- **Checkpoint 2**: Questions 5-9 → Shows "1 of 5", "2 of 5", "3 of 5", "4 of 5", "5 of 5"

### **Formula:**
```typescript
// For any checkpoint, the relative question number is:
currentQuestionNumber = (globalIndex % 5) + 1

// Examples:
// Global index 0 → (0 % 5) + 1 = 1
// Global index 1 → (1 % 5) + 1 = 2
// Global index 5 → (5 % 5) + 1 = 1
// Global index 6 → (6 % 5) + 1 = 2
```

## Benefits

1. **✅ Controlled Ordering**: Questions appear in exact order specified in Sanity
2. **✅ Correct Pagination**: Always shows "X of 5" for each checkpoint
3. **✅ Admin Control**: Content managers can set specific question order
4. **✅ Predictable Behavior**: Questions always appear in the intended sequence
5. **✅ No More "6 of 5"**: Pagination now correctly shows 1-5 for each checkpoint

## Requirements for Content Managers

### **Sanity CMS Setup:**
1. **Add Order Field**: Each Game 3 question must have an `order` field
2. **Sequential Ordering**: Set order numbers as 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, etc.
3. **Checkpoint 1**: Questions with order 1-5 will appear at first checkpoint
4. **Checkpoint 2**: Questions with order 6-10 will appear at second checkpoint

### **Example Order Setup:**
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

The Game 3 questions now display in the correct order with proper pagination! 🎉 