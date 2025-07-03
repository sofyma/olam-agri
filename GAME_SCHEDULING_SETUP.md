# Game Scheduling System Setup

This document explains how to set up and use the game scheduling system for the Brand Heroes app.

## Overview

The game scheduling system allows you to control when games become available to users. Games can be scheduled to unlock at specific dates and times, and can also be manually enabled/disabled.

## CMS Setup

### 1. Access Sanity Studio

1. Navigate to your Sanity Studio (usually at `/studio` or the configured URL)
2. Log in with your admin credentials

### 2. Create Game Schedule

1. In the Sanity Studio, you'll see a new "Game Schedule" document type
2. Click "Create new" and select "Game Schedule"
3. Fill in the following fields:

#### Required Fields:
- **Game ID**: Select either "Game 1: The Superpower of Branding" or "Game 2: Under Attack!"
- **Available From**: Set the date and time when the game should become available

#### Optional Fields:
- **Game Active**: Toggle to enable/disable the game regardless of dates
- **Available Until**: Set an end date when the game should be locked again (optional)

### 3. Example Configuration

#### For Game 1:
```
Game ID: game1
Game Active: ✅ (checked)
Available From: 2024-01-15 09:00:00
Available Until: (leave empty for no end date)
```

#### For Game 2:
```
Game ID: game2
Game Active: ✅ (checked)
Available From: 2024-01-20 09:00:00
Available Until: (leave empty for no end date)
```

## How It Works

### Availability Logic

A game is considered available when:
1. **Game Active** is checked (true)
2. Current time is **after** the **Available From** date
3. Current time is **before** the **Available Until** date (if set)

### User Experience

#### Homepage:
- Available games show "let's do it" buttons
- Locked games show a lock icon with countdown timer
- Games show "Coming Soon" if no availability date is set

#### Game Info Pages:
- Available games show "let's play" buttons
- Locked games show a locked state with countdown
- Users are redirected to info page if they try to access locked games

#### Direct Game Access:
- Users trying to access `/games/game1` or `/games/game2` directly are redirected to the info page if the game is locked

## Features

### Real-time Updates
- The system checks availability every minute
- Countdown timers update automatically
- No page refresh needed for availability changes

### Flexible Scheduling
- Set specific dates and times for availability
- Optional end dates for temporary access
- Manual override with the "Game Active" toggle

### User-friendly Messaging
- Clear countdown timers (e.g., "Available in 2 days 5h")
- Consistent locked state messaging
- Smooth transitions between states

## Technical Implementation

### Files Added/Modified:
- `src/schemas/gameConfig.js` - CMS schema for game scheduling
- `src/lib/services/gameAvailabilityService.ts` - Service for availability logic
- `src/lib/stores/gameAvailabilityStore.ts` - Svelte store for state management
- `src/routes/+page.svelte` - Updated homepage with availability checks
- `src/routes/games/info/1/+page.svelte` - Updated game1 info page
- `src/routes/games/info/2/+page.svelte` - Updated game2 info page
- `src/routes/games/game1/+page.svelte` - Added availability check
- `src/routes/games/game2/+page.svelte` - Added availability check
- `src/routes/+layout.svelte` - Loads availability config on startup

### Database Schema:
```javascript
{
  _id: string,
  gameId: 'game1' | 'game2',
  isActive: boolean,
  availableFrom: string (ISO date),
  availableUntil?: string (ISO date)
}
```

## Troubleshooting

### Game Not Showing as Available:
1. Check that "Game Active" is checked
2. Verify the "Available From" date is in the past
3. Check that "Available Until" date (if set) is in the future
4. Ensure the game schedule exists in Sanity

### Countdown Not Updating:
1. The countdown updates every minute automatically
2. Refresh the page to see immediate changes
3. Check browser console for any errors

### Configuration Not Loading:
1. Verify the Sanity connection is working
2. Check that the gameSchedule schema is included in studio/schemaTypes/index.js
3. Restart the development server if needed

## Best Practices

1. **Set Realistic Dates**: Use future dates for upcoming games
2. **Test Configuration**: Create test schedules to verify behavior
3. **Monitor Logs**: Check browser console for any availability-related errors
4. **Backup Configurations**: Keep track of your game schedules
5. **Plan Ahead**: Set up schedules well before game launches

## Support

If you encounter issues with the game scheduling system:
1. Check the browser console for error messages
2. Verify your Sanity configuration
3. Ensure all required fields are filled in the CMS
4. Test with different date configurations 