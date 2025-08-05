// @ts-nocheck
export default {
  name: 'game4',
  title: 'Game 4: Choose a Side',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Question Title',
      type: 'string',
      description: 'The title/question text to display above the image (e.g., "This layout is...")',
      validation: Rule => Rule.required()
    },
    {
      name: 'image',
      title: 'Statement Image',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'isTrue',
      title: 'Is True Statement',
      type: 'boolean',
      validation: Rule => Rule.required()
    },
    {
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
      description: 'Set to false to disable this statement'
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      subtitle: 'isTrue'
    },
    prepare({ title, media, subtitle }) {
      return {
        title: title || 'Untitled',
        media: media,
        subtitle: subtitle ? 'True' : 'False'
      }
    }
  }
} 