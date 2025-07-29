# Netlify API Routes Fix

## Problem
The API routes (`/api/register-user` and `/api/submit-result`) return 404 errors on Netlify deployment, while working fine on localhost.

## Root Cause
The project was using `@sveltejs/adapter-static` which is for static sites only. API routes require `@sveltejs/adapter-netlify` for proper serverless function deployment.

## Solution Applied

### **1. Installed Netlify Adapter**
```bash
npm install @sveltejs/adapter-netlify
```

### **2. Updated svelte.config.js**
**Before:**
```javascript
import adapter from '@sveltejs/adapter-static';

adapter: adapter({
  fallback: 'index.html',
  strict: false
}),
```

**After:**
```javascript
import adapter from '@sveltejs/adapter-netlify';

adapter: adapter({
  edge: false,
  split: false
}),
```

### **3. Created _redirects file**
The `@sveltejs/adapter-netlify` automatically handles API routes and uses `_redirects` for SPA routing:

**`static/_redirects`:**
```
/*    /index.html   200
```

**Note**: The adapter automatically handles `/api/*` routes, so no manual redirects are needed.

## Required Environment Variables

### **Netlify Dashboard Setup**
You need to add the `SANITY_TOKEN` environment variable in your Netlify dashboard:

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add a new variable:
   - **Key**: `SANITY_TOKEN`
   - **Value**: Your Sanity token (same as in your `.env` file)

### **Environment Variable Format**
```
SANITY_TOKEN=your_sanity_token_here
```

## Deployment Steps

### **1. Commit and Push Changes**
```bash
git add .
git commit -m "Fix Netlify API routes with adapter-netlify"
git push origin main
```

### **2. Set Environment Variables**
- Go to Netlify dashboard
- Add `SANITY_TOKEN` environment variable
- Redeploy the site

### **3. Verify Deployment**
- Check that the build completes successfully
- Test the registration form on the deployed site
- Check Netlify function logs for any errors

## API Routes Affected

### **1. /api/register-user**
- **Purpose**: Register new users in Sanity
- **Method**: POST
- **Required Data**: `displayName`, `emailAddress`, `country`, `region`

### **2. /api/submit-result**
- **Purpose**: Submit game results to Sanity
- **Method**: POST
- **Required Data**: Game result object with `_type`

## Testing

### **Local Testing**
```bash
npm run dev
# Test registration at http://localhost:5173/register
```

### **Netlify Testing**
- Deploy to Netlify
- Test registration at `https://olam-agri.netlify.app/register`
- Check browser console for any errors
- Verify data appears in Sanity Studio

## Troubleshooting

### **Common Issues**

1. **404 Errors**: Ensure `netlify.toml` is in the root directory
2. **Environment Variables**: Verify `SANITY_TOKEN` is set in Netlify dashboard
3. **Build Errors**: Check that `@sveltejs/adapter-netlify` is installed
4. **CORS Issues**: API routes should handle CORS automatically with the adapter

### **Debug Steps**

1. **Check Netlify Function Logs**:
   - Go to Netlify dashboard → Functions
   - Check for any error logs

2. **Verify Environment Variables**:
   - Ensure `SANITY_TOKEN` is set correctly
   - Check that the token has write permissions

3. **Test API Endpoints**:
   - Use browser dev tools to check network requests
   - Verify the request reaches the correct endpoint

## Expected Behavior

### **Before Fix**
- ❌ API routes return 404 on Netlify
- ❌ Registration fails with "Not Found" error
- ❌ Game results not saved to Sanity

### **After Fix**
- ✅ API routes work on Netlify
- ✅ Registration succeeds
- ✅ Game results saved to Sanity
- ✅ Both local and production environments work

## Files Modified

1. **`svelte.config.js`**: Updated adapter from static to netlify
2. **`netlify.toml`**: Added Netlify configuration
3. **`package.json`**: Added `@sveltejs/adapter-netlify` dependency

The API routes should now work correctly on Netlify! 🎉 