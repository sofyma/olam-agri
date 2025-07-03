export default {
  name: 'company',
  title: 'Company',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Company Name',
      type: 'string',
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'name'
    }
  }
} 