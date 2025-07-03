export default {
  name: 'gameAttempt',
  title: 'Game Attempt',
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
      name: 'gameId',
      title: 'Game ID',
      type: 'number',
      validation: Rule => Rule.required()
    },
    {
      name: 'startTime',
      title: 'Start Time',
      type: 'datetime',
      validation: Rule => Rule.required()
    },
    {
      name: 'endTime',
      title: 'End Time',
      type: 'datetime',
      validation: Rule => Rule.required()
    },
    {
      name: 'game1',
      title: 'Game 1 Data',
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
      name: 'isFirstAttempt',
      title: 'Is First Attempt',
      type: 'boolean',
      validation: Rule => Rule.required()
    }
  ]
}