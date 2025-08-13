// @ts-nocheck
export default {
  name: 'game6',
  title: 'Game 6: The Mind Reader - Branching Questions',
  type: 'document',
  fields: [
    {
      name: 'questionId',
      title: 'Question ID (for reference)',
      type: 'string',
      description: 'Unique identifier like Q1, Q2, etc.',
      validation: Rule => Rule.required()
    },
    {
      name: 'questionText',
      title: 'Question Text',
      type: 'text',
      description: 'The actual question to display',
      validation: Rule => Rule.required()
    },
    {
      name: 'answers',
      title: 'Answers',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'answerText',
              title: 'Answer Text',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'nextQuestion',
              title: 'Next Question',
              type: 'reference',
              to: [{ type: 'game6' }],
              description: 'Which question this answer leads to (leave empty for end of game)'
            },
            {
              name: 'isEndGame',
              title: 'Ends the Game',
              type: 'boolean',
              description: 'Check if this answer ends the game',
              initialValue: false
            },
            {
              name: 'endGameMessage',
              title: 'End Game Message',
              type: 'text',
              description: 'Message to show when game ends (only if isEndGame is true)',
              hidden: ({ parent }) => !parent?.isEndGame
            }
          ],
          preview: {
            select: {
              title: 'answerText',
              subtitle: 'nextQuestion.questionId'
            },
            prepare({ title, subtitle }) {
              return {
                title: title || 'No answer text',
                subtitle: subtitle ? `→ ${subtitle}` : 'End of game'
              }
            }
          }
        }
      ]
    },
    {
      name: 'isStartQuestion',
      title: 'Is Start Question',
      type: 'boolean',
      description: 'Check if this is the first question of the game',
      initialValue: false
    },
    {
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Whether this question is active in the game',
      initialValue: true
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which questions should appear (for reference)',
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'questionId',
      subtitle: 'questionText'
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'No question ID',
        subtitle: subtitle ? (subtitle.length > 50 ? subtitle.substring(0, 50) + '...' : subtitle) : 'No question text'
      }
    }
  },
  orderings: [
    {
      title: 'Question Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }]
    }
  ]
} 