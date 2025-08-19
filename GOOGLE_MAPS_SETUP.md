# Google Maps Integration Setup

This project now includes Google Maps integration for property details pages. To enable this feature, you need to set up a Google Maps API key.

## Setup Instructions

1. **Get a Google Maps API Key:**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the "Maps JavaScript API" and "Places API"
   - Go to "Credentials" and create an API key
   - Restrict the API key to your domain for security

2. **Add the API Key to Your Environment:**
   Create a `.env.local` file in the root directory of your project and add:

   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

3. **Restart Your Development Server:**
   After adding the environment variable, restart your Next.js development server:
   ```bash
   npm run dev
   ```

## Features

- Interactive map showing property location
- Clickable marker with property information
- Responsive design that works on mobile and desktop
- Fallback display when coordinates are not available

## Security Notes

- The API key is prefixed with `NEXT_PUBLIC_` so it's exposed to the client
- Make sure to restrict the API key to your domain in Google Cloud Console
- Consider implementing usage quotas to prevent abuse

## Troubleshooting

If the map doesn't load:

1. Check that your API key is correct
2. Verify that the Maps JavaScript API is enabled
3. Check the browser console for any error messages
4. Ensure the property has valid latitude and longitude coordinates
