export default {
  name: 'game5',
  title: 'Game 5: Only the Fastest Will Reach the Sky',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Game Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Game Description',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'correctAnswer',
      title: 'Correct Answer',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'points',
      title: 'Points Awarded',
      type: 'number',
      validation: Rule => Rule.required().min(1)
    },
    {
      name: 'instructions',
      title: 'Game Instructions',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'brandHubLink',
      title: 'Brand Hub Link',
      type: 'url',
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description'
    }
  }
} 