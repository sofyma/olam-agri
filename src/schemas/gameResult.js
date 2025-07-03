// @ts-nocheck
export default {
  name: 'gameResult',
  title: 'Game Result',
  type: 'document',
  fields: [
    {
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'game1',
      title: 'Game 1 Result',
      type: 'object',
      fields: [
        {
          name: 'brandScore',
          title: 'Brand Score',
          type: 'number',
          validation: Rule => Rule.required()
        },
        {
          name: 'placeScore',
          title: 'Place Score',
          type: 'number',
          validation: Rule => Rule.required()
        },
        {
          name: 'score',
          title: 'Total Score',
          type: 'number',
          validation: Rule => Rule.required()
        },
        {
          name: 'gameId',
          title: 'Game ID',
          type: 'number',
          validation: Rule => Rule.required()
        },
        {
          name: 'startedAt',
          title: 'Started At',
          type: 'datetime',
          validation: Rule => Rule.required()
        },
        {
          name: 'completedAt',
          title: 'Completed At',
          type: 'datetime',
          validation: Rule => Rule.required()
        },
        {
          name: 'brandAnswers',
          title: 'Brand Answers',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'questionId', title: 'Question ID', type: 'string' },
              { name: 'question', title: 'Question Text', type: 'string' },
              { name: 'image', title: 'Question Image URL', type: 'string' },
              { name: 'correctAnswer', title: 'Correct Answer', type: 'string' },
              { name: 'userAnswer', title: 'User Answer', type: 'string' },
              { name: 'isCorrect', title: 'Is Correct', type: 'boolean' },
              { name: 'answerTime', title: 'Answer Time', type: 'datetime' }
            ]
          }]
        },
        {
          name: 'placeAnswers',
          title: 'Place Answers',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'questionId', title: 'Question ID', type: 'string' },
              { name: 'question', title: 'Question Text', type: 'string' },
              { name: 'image', title: 'Question Image URL', type: 'string' },
              { name: 'correctAnswer', title: 'Correct Answer', type: 'string' },
              { name: 'userAnswer', title: 'User Answer', type: 'string' },
              { name: 'isCorrect', title: 'Is Correct', type: 'boolean' },
              { name: 'answerTime', title: 'Answer Time', type: 'datetime' }
            ]
          }]
        }
      ]
    },
    {
      name: 'game2',
      title: 'Game 2 Result',
      type: 'object',
      fields: [
        {
          name: 'score',
          title: 'Score',
          type: 'number',
          validation: Rule => Rule.required()
        },
        {
          name: 'gameId',
          title: 'Game ID',
          type: 'number',
          validation: Rule => Rule.required()
        },
        {
          name: 'startedAt',
          title: 'Started At',
          type: 'datetime',
          validation: Rule => Rule.required()
        },
        {
          name: 'completedAt',
          title: 'Completed At',
          type: 'datetime',
          validation: Rule => Rule.required()
        },
        {
          name: 'destroyedLies',
          title: 'Destroyed Lies',
          type: 'number',
          validation: Rule => Rule.required()
        },
        {
          name: 'destroyedTruths',
          title: 'Destroyed Truths',
          type: 'number',
          validation: Rule => Rule.required()
        },
        {
          name: 'answers',
          title: 'Answers',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'statementId', title: 'Statement ID', type: 'string' },
              { name: 'statement', title: 'Statement Text', type: 'string' },
              { name: 'isTrue', title: 'Is True', type: 'boolean' },
              { name: 'userClicked', title: 'User Clicked', type: 'boolean' },
              { name: 'isCorrect', title: 'Is Correct', type: 'boolean' },
              { name: 'answerTime', title: 'Answer Time', type: 'datetime' }
            ]
          }]
        }
      ]
    },
    {
      name: 'game3',
      title: 'Game 3 Result',
      type: 'object',
      fields: [
        {
          name: 'score',
          title: 'Score',
          type: 'number',
          validation: Rule => Rule.required()
        },
        {
          name: 'gameId',
          title: 'Game ID',
          type: 'number',
          validation: Rule => Rule.required()
        },
        {
          name: 'startedAt',
          title: 'Started At',
          type: 'datetime',
          validation: Rule => Rule.required()
        },
        {
          name: 'completedAt',
          title: 'Completed At',
          type: 'datetime',
          validation: Rule => Rule.required()
        },
        {
          name: 'checkpointsReached',
          title: 'Checkpoints Reached',
          type: 'number',
          validation: Rule => Rule.required()
        },
        {
          name: 'answers',
          title: 'Answers',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'questionId', title: 'Question ID', type: 'string' },
              { name: 'question', title: 'Question Text', type: 'string' },
              { name: 'image', title: 'Question Image URL', type: 'string' },
              { name: 'correctAnswer', title: 'Correct Answer', type: 'string' },
              { name: 'userAnswer', title: 'User Answer', type: 'string' },
              { name: 'isCorrect', title: 'Is Correct', type: 'boolean' },
              { name: 'questionNumber', title: 'Question Number', type: 'number' },
              { name: 'answerTime', title: 'Answer Time', type: 'datetime' }
            ]
          }]
        }
      ]
    },
    {
      name: 'game4',
      title: 'Game 4 Result',
      type: 'object',
      fields: [
        {
          name: 'score',
          title: 'Score',
          type: 'number',
          validation: Rule => Rule.required()
        },
        {
          name: 'gameId',
          title: 'Game ID',
          type: 'number',
          validation: Rule => Rule.required()
        },
        {
          name: 'startedAt',
          title: 'Started At',
          type: 'datetime',
          validation: Rule => Rule.required()
        },
        {
          name: 'completedAt',
          title: 'Completed At',
          type: 'datetime',
          validation: Rule => Rule.required()
        },
        {
          name: 'correctSwipes',
          title: 'Correct Swipes',
          type: 'number',
          validation: Rule => Rule.required()
        },
        {
          name: 'incorrectSwipes',
          title: 'Incorrect Swipes',
          type: 'number',
          validation: Rule => Rule.required()
        },
        {
          name: 'answers',
          title: 'Answers',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'statementId', title: 'Statement ID', type: 'string' },
              { name: 'image', title: 'Statement Image URL', type: 'string' },
              { name: 'isTrue', title: 'Is True', type: 'boolean' },
              { name: 'swipedDirection', title: 'Swiped Direction', type: 'string' },
              { name: 'isCorrect', title: 'Is Correct', type: 'boolean' },
              { name: 'answerTime', title: 'Answer Time', type: 'datetime' }
            ]
          }]
        }
      ]
    },
    {
      name: 'game6',
      title: 'Game 6 Result',
      type: 'object',
      fields: [
        {
          name: 'score',
          title: 'Score',
          type: 'number',
          validation: Rule => Rule.required()
        },
        {
          name: 'gameId',
          title: 'Game ID',
          type: 'number',
          validation: Rule => Rule.required()
        },
        {
          name: 'startedAt',
          title: 'Started At',
          type: 'datetime',
          validation: Rule => Rule.required()
        },
        {
          name: 'completedAt',
          title: 'Completed At',
          type: 'datetime',
          validation: Rule => Rule.required()
        },
        {
          name: 'totalQuestions',
          title: 'Total Questions',
          type: 'number',
          validation: Rule => Rule.required()
        },
        {
          name: 'answers',
          title: 'Answers',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'questionId', title: 'Question ID', type: 'string' },
              { name: 'question', title: 'Question Text', type: 'string' },
              { name: 'optionA', title: 'Option A', type: 'string' },
              { name: 'optionB', title: 'Option B', type: 'string' },
              { name: 'selectedOption', title: 'Selected Option', type: 'string' },
              { name: 'answerTime', title: 'Answer Time', type: 'datetime' }
            ]
          }]
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'user.displayName',
      subtitle: 'score',
      date: 'completedAt'
    },
    prepare({ title, subtitle, date }) {
      return {
        title: title || 'Unknown User',
        subtitle: `Score: ${subtitle} (${new Date(date).toLocaleDateString()})`
      }
    }
  }
} 