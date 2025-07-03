// @ts-nocheck
export default {
  name: 'gameSchedule',
  title: 'Game Schedule',
  type: 'document',
  fields: [
    {
      name: 'gameId',
      title: 'Game ID',
      type: 'string',
      options: {
        list: [
          { title: 'Game 1: The Superpower of Branding', value: 'game1' },
          { title: 'Game 2: Under Attack!', value: 'game2' },
          { title: 'Game 3: Brain Over Brawn', value: 'game3' },
          { title: 'Game 4: Choose a Side', value: 'game4' },
          { title: 'Game 6: Only the Fastest Will Reach the Sky', value: 'game6' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'isActive',
      title: 'Game Active',
      type: 'boolean',
      description: 'Enable/disable the game regardless of dates',
      initialValue: true
    },
    {
      name: 'availableFrom',
      title: 'Available From',
      type: 'datetime',
      description: 'Game will be unlocked after this date',
      validation: Rule => Rule.required()
    },
    {
      name: 'availableUntil',
      title: 'Available Until',
      type: 'datetime',
      description: 'Game will be locked after this date (optional)'
    }
  ],
  preview: {
    select: {
      title: 'gameId',
      subtitle: 'availableFrom',
      media: 'isActive'
    },
    prepare({ title, subtitle, media }) {
      const gameTitles = {
        'game1': 'Game 1: The Superpower of Branding',
        'game2': 'Game 2: Under Attack!',
        'game3': 'Game 3: Brain Over Brawn',
        'game4': 'Game 4: Choose a Side',
        'game6': 'Game 6: Only the Fastest Will Reach the Sky'
      };
      
      return {
        title: gameTitles[title] || title || 'Unknown Game',
        subtitle: subtitle ? `Available from: ${new Date(subtitle).toLocaleDateString()}` : 'No date set',
        media: media ? 'Active' : 'Inactive'
      }
    }
  }
} 