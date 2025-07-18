# Game 5 Setup Instructions

## 🎯 Game 5: Only the Fastest Will Reach the Sky

### ✅ What's Been Implemented:

1. **Frontend Integration:**
   - ✅ Game 5 added to homepage with blue (#00B2E7) styling
   - ✅ Game 5 availability tracking integrated
   - ✅ Game 5 info page created at `/games/info/5`
   - ✅ Game 5 main page created at `/games/game5`
   - ✅ Game 5 summary page created at `/games/game5/summary`

2. **Backend Integration:**
   - ✅ Game 5 types defined in `src/lib/types/game5.ts`
   - ✅ Game 5 service created in `src/lib/services/game5Service.ts`
   - ✅ Game 5 store created in `src/lib/stores/game5Store.ts`
   - ✅ Game 5 component created in `src/lib/components/games/game5/Question.svelte`
   - ✅ Game 5 Sanity schema created in `src/schemas/game5.js`
   - ✅ Game 5 results schema added to `src/schemas/gameResult.js`
   - ✅ Game 5 ranking integration in `src/lib/services/rankingService.ts`

### 🔧 Sanity CMS Setup Required:

#### Step 1: Add Game 5 to Schema Index
The schema index has been updated to include Game 5. Make sure to restart your Sanity Studio.

#### Step 2: Create Game 5 Schedule in Sanity Studio

1. **Open Sanity Studio** in your browser
2. **Navigate to "Game Schedule"** in the content menu
3. **Click "Create new"**
4. **Fill in the details:**
   - **Game ID:** Select "Game 5: Only the Fastest Will Reach the Sky"
   - **Game Active:** ✅ Check this box
   - **Available From:** Set to current date/time (or desired start date)
   - **Available Until:** Leave empty (no end date)
5. **Click "Publish"**

#### Step 3: Verify Game 5 Configuration

1. **Check Game 5 appears** in the Game Schedule list
2. **Verify the game is active** and has the correct availability dates
3. **Test the homepage** to ensure Game 5 card appears with correct styling

### 🎮 Game 5 Features:

- **Timed Search Game:** Players must find "We're Olam Agri" in the Brand Hub
- **5 Points:** Correct answer awards 5 points
- **Timer Persistence:** Timer saves every 5 seconds, resumes if window closed
- **Unlimited Attempts:** Players can try multiple times
- **Tiebreaker:** Time spent is used for global competition tiebreakers
- **First Attempt Only:** Only the first successful completion is recorded

### 🔗 Important Links:

- **Game 5 Info:** `/games/info/5`
- **Game 5 Play:** `/games/game5`
- **Brand Hub Link:** https://olamagri.workvivo.com/
- **Correct Answer:** "We're Olam Agri"

### 🎨 Visual Design:

- **Primary Color:** #00B2E7 (Blue)
- **Character:** Rocket Girl with animated flame
- **Layout:** Responsive design matching existing games
- **Homepage Card:** Blue background with white text and buttons

### 📊 Data Tracking:

Game 5 will track:
- ✅ Score (5 points)
- ✅ Time spent (milliseconds)
- ✅ Number of attempts
- ✅ All answer attempts with timestamps
- ✅ Start and completion times
- ✅ User authentication

### 🚀 Ready for Production:

Once the Sanity CMS schedule is created, Game 5 will be:
- ✅ Visible on the homepage
- ✅ Playable by users
- ✅ Integrated with rankings
- ✅ Contributing to global scores
- ✅ Ready for tiebreaker calculations

---

**Note:** Make sure to test the game thoroughly after setup to ensure all features work correctly! 