// @ts-nocheck
export default {
  name: 'game4',
  title: 'Game 4: Choose a Side',
  type: 'document',
  fields: [
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
      title: 'isTrue',
      media: 'image',
      subtitle: 'isActive'
    },
    prepare({ title, media, subtitle }) {
      return {
        title: title ? 'True' : 'False',
        media: media,
        subtitle: subtitle ? 'Active' : 'Inactive'
      }
    }
  }
} 