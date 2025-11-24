Quantum Leap - Production Website (Static)
=========================================

This package is a production-ready static website skeleton for Quantum Leap.
It is built to be deployed on Netlify or Vercel and includes Firebase integration hooks
for storing notes and mock-test data in production.

What is included (deployable):
- index.html
- class9.html
- class10.html
- mock-tests.html
- downloads.html
- about.html
- contact.html
- /public/style.css
- /public/app.js (lightweight, includes Firebase helper functions)
- /public/logo.png (YOUR UPLOADED LOGO)
- /public/firebase-config.json (placeholder — replace with your Firebase project config)

IMPORTANT: Original uploaded logo file path (for internal reference):
  /mnt/data/b6d141a4-7624-4d71-9c23-5e4f5e6d60c6.png

Deployment (Netlify):
1. Unzip and push this folder to a GitHub repo OR drag-and-drop this folder on Netlify's Deploy page.
2. For forms/storage, set up Firebase (steps below) or use Netlify Functions / serverless endpoints to persist data.

Deployment (Vercel):
1. Push to GitHub and import project in Vercel → Deploy
2. Ensure /public is served as static assets (default for Vercel static deployments).

Enable Firebase (recommended for production persistence):
1. Create a Firebase project and Firestore database.
2. Enable Firebase Storage if you want to host PDFs.
3. Replace /public/firebase-config.json with your actual Firebase config.
4. The frontend includes a function initFirebase(config) inside /public/app.js — call it from pages where you want to enable realtime saving.
   Example (in a page script tag):
     fetch('/public/firebase-config.json').then(r => r.json()).then(cfg => initFirebase(cfg));

SEO:
- Meta titles and descriptions are already included on the pages.
- For better ranking on "BSE Odisha" queries, publish regular content, include chapter-level pages, and ensure page load speed is fast.
- Consider adding sitemaps and submitting to Google Search Console after deployment.

Customization:
- Add your chapter content into class9.html and class10.html or create per-chapter pages.
- To enable file uploads, integrate Firebase Storage and update UI buttons to upload and list files.
- For a full CMS workflow, consider Netlify CMS or direct Git-based updates.

If you want, I can now:
- Build chapter-level pages and pre-fill 10 sample chapters for Class 9 and Class 10.
- Add Firebase upload UI (Storage) + Firestore connection and a Netlify Function example for server-side handling.
- Create a GitHub repo and push the code for you (I will provide commands and exact file contents).

Tell me exactly which next step you'd like:
- "Add sample chapter content"
- "Add Firebase storage upload UI and Firestore hooks"
- "Push to GitHub & prepare for Vercel/Netlify"