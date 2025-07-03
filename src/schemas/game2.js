// @ts-nocheck
export default {
  name: 'game2',
  title: 'Game 2: Truth or Lie',
  type: 'document',
  fields: [
    {
      name: 'text',
      title: 'Statement Text',
      type: 'string',
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
      title: 'text',
      subtitle: 'isTrue'
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'No statement text',
        subtitle: subtitle ? 'True' : 'False'
      }
    }
  }
} 