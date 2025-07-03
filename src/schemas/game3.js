export default {
  name: 'game3',
  title: 'Game 3: Brain Over Brawn',
  type: 'document',
  fields: [
    {
      name: 'question',
      title: 'Question Text',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'image',
      title: 'Question Image',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'options',
      title: 'Answer Options',
      type: 'array',
      of: [{ type: 'string' }],
      validation: Rule => Rule.required().min(2).max(4)
    },
    {
      name: 'correctAnswer',
      title: 'Correct Answer',
      type: 'string',
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'question',
      subtitle: 'correctAnswer',
      media: 'image'
    }
  }
} 