# Agent Artie - ChatKit UI Deployment Guide

This guide will help you deploy the ChatKit UI application to Vercel.

## Prerequisites

1. **OpenAI API Key**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **ChatKit Workflow ID**: Create a workflow in [ChatKit Studio](https://chatkit.studio) and get the workflow ID
3. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)

## Environment Variables

You'll need to set these environment variables in Vercel:

### Required Variables:

- `OPENAI_API_KEY`: Your OpenAI API key
- `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID`: Your ChatKit workflow ID (starts with `wf_`)

### Optional Variables:

- `CHATKIT_API_BASE`: Custom API base URL (defaults to `https://api.openai.com`)

## Deployment Steps

### Method 1: Deploy via Vercel CLI

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy the project**:

   ```bash
   vercel --prod
   ```

4. **Set environment variables**:
   ```bash
   vercel env add OPENAI_API_KEY
   vercel env add NEXT_PUBLIC_CHATKIT_WORKFLOW_ID
   ```

### Method 2: Deploy via Vercel Dashboard

1. **Push to GitHub**:

   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**:

   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Set project name to `agent_artie`

3. **Configure Environment Variables**:

   - In project settings, go to "Environment Variables"
   - Add the required variables listed above

4. **Deploy**:
   - Click "Deploy" to start the deployment process

## Post-Deployment

After successful deployment:

1. **Test the application**: Visit your Vercel URL
2. **Verify ChatKit is working**: Try sending a message
3. **Check logs**: Monitor the Vercel function logs for any issues

## Troubleshooting

### Common Issues:

1. **"Missing workflow id" error**:

   - Ensure `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` is set correctly
   - Verify the workflow ID starts with `wf_`

2. **"Missing OPENAI_API_KEY" error**:

   - Check that the environment variable is set in Vercel
   - Ensure the API key is valid and has proper permissions

3. **ChatKit not loading**:
   - Check browser console for errors
   - Verify the ChatKit script is loading from the CDN
   - Ensure your workflow is properly configured in ChatKit Studio

### Support:

- [Vercel Documentation](https://vercel.com/docs)
- [OpenAI ChatKit Documentation](https://platform.openai.com/docs/guides/chatkit)
- [ChatKit Studio](https://chatkit.studio)

## Project Structure

```
agent_artie/
├── app/
│   ├── api/create-session/route.ts  # API endpoint for ChatKit sessions
│   ├── layout.tsx                   # Root layout with ChatKit script
│   └── page.tsx                     # Main page component
├── components/
│   ├── ChatKitPanel.tsx            # Main ChatKit component
│   └── ErrorOverlay.tsx            # Error handling component
├── lib/
│   └── config.ts                   # Configuration and constants
├── vercel.json                     # Vercel deployment configuration
└── next.config.ts                  # Next.js configuration
```
