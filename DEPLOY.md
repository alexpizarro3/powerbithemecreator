# Deployment Guide

Follow these steps to publish your Power BI Theme Creator to the world!

## Prerequisites
- A [GitHub](https://github.com/) account.
- A [Vercel](https://vercel.com/) account.
- [Git](https://git-scm.com/downloads) installed on your computer.

## Step 1: Push to GitHub

1.  **Initialize Git** (if you haven't already):
    Open your terminal in the project folder and run:
    ```bash
    git init
    git add .
    git commit -m "Initial commit: Power BI Theme Creator"
    ```

2.  **Create a Repository**:
    - Go to [GitHub.com](https://github.com/new).
    - Create a new repository (e.g., `power-bi-theme-creator`).
    - **Do not** initialize with README, .gitignore, or License (we already have them).

3.  **Connect and Push**:
    - Copy the commands shown on GitHub under "…or push an existing repository from the command line".
    - It will look like this (replace `YOUR_USERNAME`):
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/power-bi-theme-creator.git
    git branch -M main
    git push -u origin main
    ```

## Step 2: Deploy to Vercel

1.  **Log in to Vercel**:
    - Go to [Vercel.com](https://vercel.com/) and log in (easiest with your GitHub account).

2.  **Import Project**:
    - Click **"Add New..."** -> **"Project"**.
    - You should see your `power-bi-theme-creator` repository in the list. Click **"Import"**.

3.  **Configure**:
    - **Framework Preset**: Vercel should automatically detect `Vite`.
    - **Root Directory**: Leave as `./`.
    - **Build Command**: `npm run build` (default).
    - **Output Directory**: `dist` (default).

4.  **Deploy**:
    - Click **"Deploy"**.
    - Wait a minute for the build to finish.

## 🎉 Success!

Vercel will give you a live URL (e.g., `https://power-bi-theme-creator.vercel.app`). You can now share this link with the world!
