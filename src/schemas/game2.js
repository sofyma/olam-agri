// @ts-nocheck
export default {
  name: 'game2',
  title: 'Game 2: Truth or Lie',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Statement Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'image',
      title: 'Bubble Image',
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
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'isTrue'
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'No statement title',
        subtitle: subtitle ? 'True' : 'False'
      }
    }
  }
} 