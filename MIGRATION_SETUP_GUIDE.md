# Game 6 Migration Setup Guide

## Overview
This guide will help you run the migration script to import all 16 Game 6 branching questions into your Sanity CMS.

## Prerequisites
1. **Node.js** installed on your system
2. **Sanity project** set up and running
3. **Write token** from Sanity (for creating content)

## Step 1: Get Your Sanity Credentials

### Find Your Project ID
1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project
3. Copy the Project ID from the project overview

### Get Your Write Token
1. In your Sanity project, go to **API** tab
2. Click **Add API token**
3. Give it a name (e.g., "Game 6 Migration")
4. Select **Editor** permissions
5. Copy the token

## Step 2: Install Dependencies

```bash
npm install @sanity/client
```

## Step 3: Configure the Migration Script

Edit `migrate-game6-questions.js` and update these values:

```javascript
const client = createClient({
  projectId: 'your-project-id',        // ← Replace with your project ID
  dataset: 'production',               // ← Use 'development' if testing
  apiVersion: '2024-01-01',           // ← Use current date
  token: 'your-sanity-token',          // ← Replace with your write token
  useCdn: false
});
```

## Step 4: Run the Migration

```bash
node migrate-game6-questions.js
```

## What the Script Does

1. **Creates all 16 questions** with their text and answers
2. **Sets up the branching logic** by creating references between questions
3. **Marks Q1 as the start question**
4. **Marks Q16 as the end question** with a completion message

## Expected Output

```
🚀 Starting Game 6 questions migration...
Creating question: Q1
✅ Created Q1 with ID: [sanity-id]
Creating question: Q2
✅ Created Q2 with ID: [sanity-id]
...

🔄 Now updating questions with nextQuestion references...
✅ Updated Q1 with nextQuestion references
✅ Updated Q2 with nextQuestion references
...

🎉 Migration completed successfully!
Created 16 questions with branching logic.
🎯 Game 6 branching questionnaire is ready!
```

## Branching Logic

The script creates this flow:
- **Q1** → Both answers lead to **Q2**
- **Q2** → Answer A leads to **Q3**, Answer B leads to **Q4**
- **Q3** → Both answers lead to **Q5**
- **Q4** → Both answers lead to **Q6**
- **Q5** → Both answers lead to **Q7**
- **Q6** → Both answers lead to **Q8**
- **Q7** → Both answers lead to **Q9**
- **Q8** → Both answers lead to **Q10**
- **Q9** → Both answers lead to **Q11**
- **Q10** → All three answers lead to **Q11**
- **Q11** → All three answers lead to **Q12**
- **Q12** → All three answers lead to **Q13**
- **Q13** → All three answers lead to **Q14**
- **Q14** → All three answers lead to **Q15**
- **Q15** → All three answers lead to **Q16**
- **Q16** → Ends the game with feedback message

## Verification

After running the script:

1. **Go to Sanity Studio**
2. **Check Game 6 documents** - you should see 16 questions
3. **Verify Q1** is marked as `isStartQuestion: true`
4. **Check Q16** has an answer with `isEndGame: true`
5. **Verify references** are properly set between questions

## Troubleshooting

### Common Issues

**"Project not found"**
- Check your project ID is correct
- Ensure you're using the right dataset name

**"Token not valid"**
- Verify your token has write permissions
- Check the token hasn't expired

**"Schema validation failed"**
- Ensure your Game 6 schema is deployed
- Check all required fields are present

### Cleanup (if needed)

If you need to start over, uncomment this line in the script:

```javascript
await cleanupExistingQuestions();
```

This will delete all existing Game 6 questions before creating new ones.

## Next Steps

After successful migration:

1. **Test the frontend** - Game 6 should now work with branching logic
2. **Verify user flow** - Users should be able to navigate through different paths
3. **Check end game** - Users should see the completion message after Q16

## Support

If you encounter issues:
1. Check the console output for error messages
2. Verify your Sanity credentials
3. Ensure your schema is properly deployed
4. Check that all required fields are present in your schema

---

**Happy migrating! 🚀**
