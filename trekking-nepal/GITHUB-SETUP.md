# Putting this site on GitHub — a plain-English guide

No coding needed. Roughly 15 minutes.

---

## First, one thing that trips everyone up

**GitHub is not a website host.** Think of it as Google Drive for code — it stores
and backs up your project, but visiting your GitHub page will not show the trekking
site.

To get a real, shareable web address you need a *host*. The free one that works
with this project is **Vercel**, and it plugs straight into GitHub.

So the order is:

```
Your Mac  →  GitHub (storage)  →  Vercel (the live website)
             ── Part 1 ──          ── Part 2 ──
```

Do Part 1 now. Part 2 whenever you're ready.

---

# PART 1 — Get the code onto GitHub

## Step 1 · Create a free GitHub account

1. Go to **https://github.com/signup**
2. Sign up with **team.idea2grow@gmail.com**
3. Verify the email they send you
4. Pick any username, e.g. `idea2grow`

## Step 2 · Install GitHub Desktop

This is the point-and-click app. You do **not** need to learn commands, and it
brings its own copy of git — so if your Mac showed a popup asking to install
"command line developer tools", just click **Cancel**.

1. Go to **https://desktop.github.com**
2. Click **Download for macOS**
3. Open the downloaded file and drag **GitHub Desktop** into Applications
4. Open it → **Sign in to GitHub.com** → log in with the account from Step 1

## Step 3 · Add this project

1. In GitHub Desktop's top menu: **File → Add Local Repository…**
2. Click **Choose…** and select this folder:

   ```
   /Users/sanjivandhakal/Trekking Nepal
   ```

3. It will say *"this directory does not appear to be a Git repository"*.
   That is expected — click the blue **create a repository** link in that message.
4. On the form that appears:
   - **Name:** `trekking-nepal`
   - **Description:** `Trekking Nepal — SEO/AEO/GEO travel site`
   - Leave **Git ignore** and **License** as *None* (this project already has its own)
   - Click **Create Repository**

## Step 4 · Make your first save ("commit")

1. The left panel now lists ~93 changed files. That is your whole project.
2. **Before continuing, confirm your password is safe.** In that file list, look
   for a file called `.env`. **It must NOT be there.** If you can't find it, you're
   safe — that's exactly right. It holds your admin password and stays on your Mac.
3. At the bottom left, in the **Summary** box, type:

   ```
   Initial commit — Trekking Nepal site
   ```

4. Click **Commit to main**

## Step 5 · Upload it

1. Click the **Publish repository** button at the top
2. **Important:** tick ☑️ **Keep this code private**
3. Click **Publish repository**

Done. Your code is on GitHub. See it any time at:
`https://github.com/YOUR-USERNAME/trekking-nepal`

## Saving future changes

Any time you or I change the code:

1. Open GitHub Desktop
2. Type a short note in the **Summary** box (e.g. "Added new trek")
3. Click **Commit to main**
4. Click **Push origin**

That's the whole routine.

---

# PART 2 — Make it a live website (Vercel)

GitHub stores it; Vercel serves it to the public. Free tier is fine.

## Step 1 · You need a real database first

The site currently uses SQLite — a file called `dev.db` on your Mac. Free web
hosts wipe their filesystems constantly, so that file would vanish and take your
content with it. You need a proper hosted database. This is a one-time setup.

1. Go to **https://neon.tech** → sign up free with GitHub
2. Create a project called `trekking-nepal`
3. Copy the **connection string** it gives you — it looks like:

   ```
   postgresql://user:password@ep-xxx.aws.neon.tech/neondb?sslmode=require
   ```

4. Keep that safe. Ask me to switch the project over to it — it's a two-line
   change I can make in a minute, plus one command to create the tables.

## Step 2 · Deploy on Vercel

1. Go to **https://vercel.com/signup** → **Continue with GitHub**
2. Click **Add New… → Project**
3. Find `trekking-nepal` in the list → **Import**
4. Open the **Environment Variables** section and add these five.
   Your `.env` was never uploaded, so Vercel needs its own copy:

   | Name | Value |
   | --- | --- |
   | `DATABASE_URL` | your Neon connection string |
   | `NEXT_PUBLIC_SITE_URL` | `https://trekking-nepal.vercel.app` |
   | `NEXT_PUBLIC_MAIN_SITE_URL` | `https://beyondthetrek.com` |
   | `ADMIN_USERNAME` | `team.idea2grow@gmail.com` |
   | `ADMIN_PASSWORD` | *(pick a longer one than TrekNepal for a public site)* |
   | `AUTH_SECRET` | ask me to generate one, or use a long random string |

5. Click **Deploy** and wait about two minutes

Your site will be live at `https://trekking-nepal.vercel.app`, with the admin
panel at `/admin`.

## Step 3 · Your own domain (optional)

In Vercel: **Settings → Domains → Add**, then follow their instructions to point
your domain at it. Afterwards, change `NEXT_PUBLIC_SITE_URL` to your real domain —
it controls the sitemap, robots.txt and llms.txt addresses.

---

## Two safety rules

1. **Never put your password in a normal file.** It belongs in `.env` on your Mac
   and in Vercel's Environment Variables — nowhere else. `.env` is already blocked
   from uploading.
2. **Keep the repository private** unless you have a reason not to.

## If you get stuck

Tell me which step number and what you see on screen, and I'll walk you through it.
