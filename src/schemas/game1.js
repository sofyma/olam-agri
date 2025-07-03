export default {
  name: 'game1',
  title: 'Game 1: The Superpower of Branding',
  type: 'document',
  fields: [
    {
      name: 'type',
      title: 'Question Type',
      type: 'string',
      options: {
        list: [
          { title: 'Brand', value: 'brand' },
          { title: 'Place', value: 'place' }
        ]
      },
      validation: Rule => Rule.required()
    },
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
      subtitle: 'type',
      media: 'image'
    }
  }
} 