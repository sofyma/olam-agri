export default {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'displayName',
      title: 'Display Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'emailAddress',
      title: 'Email Address',
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'country',
      title: 'Country',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'region',
      title: 'Region',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'lastLoginAt',
      title: 'Last Login',
      type: 'datetime'
    },
    {
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true
    },
    // Optional fields from Azure AD
    {
      name: 'upn',
      title: 'UPN',
      type: 'string'
    },
    {
      name: 'og',
      title: 'OG',
      type: 'string'
    },
    {
      name: 'mailNickName',
      title: 'Mail Nick Name',
      type: 'string'
    },
    {
      name: 'mailboxType',
      title: 'Mailbox Type',
      type: 'string'
    },
    {
      name: 'department',
      title: 'Department',
      type: 'string'
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string'
    }
  ],
  preview: {
    select: {
      title: 'displayName',
      subtitle: 'emailAddress',
      country: 'country'
    },
    prepare({ title, subtitle, country }) {
      return {
        title,
        subtitle: `${subtitle} (${country || 'No Country'})`
      }
    }
  }
}
