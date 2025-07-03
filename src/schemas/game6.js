// @ts-nocheck
export default {
  name: 'game6',
  title: 'Game 6: Only the Fastest Will Reach the Sky',
  type: 'document',
  fields: [
    {
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'optionA',
      title: 'Option A',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'optionB',
      title: 'Option B',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true
    }
  ],
  preview: {
    select: {
      title: 'question',
      subtitle: 'isActive'
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'No question',
        subtitle: subtitle ? 'Active' : 'Inactive'
      }
    }
  }
} 