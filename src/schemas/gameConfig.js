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
          { title: 'Game 5: Only the Fastest Will Reach the Sky', value: 'game5' },
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
      name: 'lockedUntil',
      title: 'Locked Until',
      type: 'datetime',
      description: 'Game will be locked until this date (optional)'
    }
  ],
  preview: {
    select: {
      title: 'gameId',
      subtitle: 'lockedUntil',
      media: 'isActive'
    },
    prepare({ title, subtitle, media }) {
      const gameTitles = {
        'game1': 'Game 1: The Superpower of Branding',
        'game2': 'Game 2: Under Attack!',
        'game3': 'Game 3: Brain Over Brawn',
        'game4': 'Game 4: Choose a Side',
        'game5': 'Game 5: Only the Fastest Will Reach the Sky',
        'game6': 'Game 6: Only the Fastest Will Reach the Sky'
      };
      
      return {
        title: gameTitles[title] || title || 'Unknown Game',
        subtitle: subtitle ? `Locked until: ${new Date(subtitle).toLocaleDateString()}` : 'No lock date set',
        media: media ? 'Active' : 'Inactive'
      }
    }
  }
} 