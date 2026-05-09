# Family CFO — Setup Guide

A pocket-money tablet app for the family. PWA + Firebase + GitHub Pages.

This guide walks through the **one-off setup**. After this, you just use the app.

**Total setup time: ~20 minutes.**

---

## What you'll end up with

- A web app at `https://[your-username].github.io/family-cfo/`
- "Install" prompt on the tablet → adds to home screen as a real-feeling app
- Same data on every device you sign in to (tablet, your phone, Maria's phone)
- Free forever at this scale

---

## Step 1 — Create the Firebase project (5 min)

1. Open https://console.firebase.google.com and sign in with your Google account
2. Click **"Add project"** (or "Create a project")
3. Name it something like `family-cfo` — click Continue
4. **Disable Google Analytics** (you don't need it) — click Continue → Create project
5. Wait ~30 seconds for it to provision, then click Continue

### Set up Authentication
6. In the left sidebar click **Build → Authentication**
7. Click **Get started**
8. Under "Sign-in method" pick **Email/Password** → **Enable** the first toggle (don't enable email link) → Save
9. Click the **Users** tab → **Add user**
10. Add yourself: email + a password you'll remember → Add user
11. Add Maria the same way

### Set up Firestore (the database)
12. Left sidebar → **Build → Firestore Database**
13. Click **Create database**
14. Pick **Start in production mode** (we'll set the security rules in a moment) → Next
15. Pick a location: **australia-southeast1 (Sydney)** → Enable
16. Once it loads, click the **Rules** tab
17. Open the `firestore.rules` file from this folder, copy its contents, paste them into the Firebase Rules editor (replace what's there), click **Publish**

### Get your config keys
18. Left sidebar gear icon → **Project settings**
19. Scroll down to "Your apps" → click the **`</>`** (web) icon
20. Give the app a nickname like `family-cfo-web` → **Register app**
21. You'll see a code block with `firebaseConfig = { ... }`. Copy the values inside the curly braces.
22. Open `firebase-config.js` from this folder
23. Paste your real values to replace `REPLACE_WITH_YOUR_API_KEY`, etc.
24. Save the file
25. Back in Firebase: click "Continue to console" — you don't need to install the SDK, our code uses the CDN

---

## Step 2 — Get the files on GitHub (5 min)

If you've never pushed to GitHub before, the easiest path is the web UI:

1. Go to https://github.com and create a new repo named `family-cfo`
   - Set it to **Public** (required for free GitHub Pages)
   - Don't initialise it with a README
2. On your computer, the folder you've been given contains:
   - `index.html`
   - `firebase-config.js` (with your keys filled in)
   - `manifest.json`
   - `service-worker.js`
   - `app-icon-192.png`
   - `app-icon-512.png`
   - `firestore.rules` (already pasted into Firebase, you can keep it for reference)
   - `README.md` (this file)
3. On GitHub.com, in your new empty repo, click **"uploading an existing file"** in the quick setup section
4. Drag all the files from the folder into the upload area (you can leave out `firestore.rules` if you want)
5. Scroll down → write a commit message like "initial upload" → **Commit changes**

---

## Step 3 — Enable GitHub Pages (2 min)

1. In your GitHub repo, click **Settings** (top nav)
2. Left sidebar → **Pages**
3. Under "Source" pick **Deploy from a branch**
4. Branch: `main`, folder: `/ (root)` → **Save**
5. Wait ~1 minute. GitHub will show a green box: *"Your site is live at..."*
6. Your app is now at `https://[your-username].github.io/family-cfo/`

---

## Step 4 — Authorise GitHub Pages domain in Firebase (1 min)

This is easy to forget and the app won't sign in without it:

1. Firebase Console → Authentication → **Settings** tab → **Authorized domains**
2. Click **Add domain**
3. Add `[your-username].github.io` (e.g. `willhurst.github.io`)
4. Save

---

## Step 5 — Install on your tablet (2 min)

1. Open Chrome on the Android tablet
2. Go to `https://[your-username].github.io/family-cfo/`
3. Sign in with the email + password you set up in Firebase
4. Chrome will show a banner *"Install Family CFO"* — tap it
   - If you don't see a banner: tap the **⋮** menu → **Install app** or **Add to Home screen**
5. The icon appears on your home screen — tap it. It opens fullscreen, no browser bars.
6. Repeat the install on your phone and Maria's phone if you want.

---

## You're done.

The app now syncs across all your devices. Tick a chore on the tablet → it shows up as pending on your phone → approve from your phone → balance updates everywhere.

---

## Common questions

**Where is the data?**
In your Firebase Firestore database at `families/hurst-family`. You can view it in Firebase Console → Firestore Database. It's a single document containing chores, balances, and approvals.

**How do I change the kids' names or details?**
Easiest: open the Firestore document in Firebase Console and edit values directly. Or wait — I can add an "Edit kid profile" panel in the next iteration.

**How do I change the colour, icons, or layout?**
Edit `index.html`. Push the changes to GitHub. GitHub Pages updates within a minute.

**It's not loading on the tablet — what gives?**
Most likely:
- You forgot to add `[your-username].github.io` to Firebase's Authorized Domains (Step 4)
- The Firestore rules are still in the default "deny all" mode — re-paste from `firestore.rules`
- Hard-refresh the tablet (Chrome → ⋮ → History → Clear browsing data → just for the site)

**The Mario coin doesn't play / TTS doesn't speak**
Browser audio needs a user tap first. Tap a kid tile to wake the audio engine. On Android, also check the silent switch and media volume.

**It's running offline — am I losing data?**
No. Tick chores while offline, they queue up and sync the moment you're back online. The orange "Offline" pill at top right shows when you're disconnected.

**I want to add a third kid / change the layout**
Let me know — those are easy follow-ups.
