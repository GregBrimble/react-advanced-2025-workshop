# Lesson 1: Introducing the React Rental Agency

## Overview

In this lesson, you'll familiarize yourself with the React Rental Agency. You'll create a Cloudflare D1 database, run database migrations, run the application locally, and deploy the application to production.

## Prerequisites

First, ensure you have followed the "Getting Started" steps outlined in [the root `../README.md`](../README.md#getting-started).

## Steps

### 0. (Optional) Install the recommended extensions

If you're using Visual Studio Code (or a fork of it), install the recommended extensions when prompted. These extensions will enhance your development experience with better syntax highlighting, linting, type checking, etc. If you missed the prompt, navigate to the Extensions window, then click the filter icon, select "Recommended", and then click the download icon. You may need to then restart Visual Studio Code.

If you aren't using Visual Studio Code, don't worry, these extensions are not required. But if your IDE has equivalents available, the extensions we recommend are:

- Even Better TOML (to add support for JSON schema validation)
- ESLint
- Prettier
- EditorConfig for VS Code
- Tailwind CSS IntelliSense

### 1. Verify project setup

Run the project checks to ensure everything is installed and configured correctly:

```bash
npm run check
```

This command verifies the project's formatting, linting, and performs type checks.

### 2. Create a D1 database

Create a new Cloudflare D1 database for the application:

```bash
npx wrangler d1 create react-rental-agency --binding DB
```

After running this command:

- Copy the **`database_id`** from the output.
- Open [`./wrangler.toml`](./wrangler.toml).
- Paste the database ID into the D1 binding configuration.

### 3. Apply database migrations

Run the database migrations to set up your database schema:

```bash
npx wrangler d1 migrations apply DB --remote
```

This will create all the necessary tables and seed data in your remote D1 database. You can view your database and its contents in the [Cloudflare Dashboard](https://dash.cloudflare.com/?to=/:account/workers/d1/) under **Storage & databases** > **D1** > **`react-rental-agency`** > **Explore Data**.

### 4. Start the development server

Launch the local development server:

```bash
npm run dev
```

Once started, access the application at: **[http://localhost:8001/](http://localhost:8001/)**

You should be able to load the homepage, navigate to "Search Properties", and filter the properties using the provided controls.

### 5. Build the project

Create a production build of the application:

```bash
npm run build
```

This command compiles and optimizes your application for production deployment.

### 6. Preview the production build

Test the production build locally:

```bash
npm run preview
```

This uses Wrangler, the Cloudflare CLI, to run a like-production local server with your built application. This is as close of an approximation for how your application will run in production as you can get, so can be very helpful for debugging any issues you face when something is working locally but not in the development server.

**Note: Since this is a production-like server, hot module reload is not a feature of `npm run preview`. Remember to rebuild (`npm run build`) and relaunch the server every time you make a change if using `npm run preview`.**

### 7. Deploy to Production

Deploy your application to Cloudflare:

```bash
npx wrangler deploy
```

After deployment completes, Wrangler will provide you with a URL where your application is live on the Internet.

## Success Criteria

By the end of this lesson, you should have:

- ✅ All project dependencies installed
- ✅ A Cloudflare D1 database created and configured
- ✅ Database migrations applied successfully
- ✅ The application running locally at [http://localhost:8001/](http://localhost:8001/)
- ✅ A production build created and tested at [http://localhost:9001/](http://localhost:9001/)
- ✅ The application deployed to Cloudflare and accessible on the Internet

## Troubleshooting

**Wrangler authentication errors**: Run `npx wrangler login` to authenticate with your Cloudflare account. If you still struggle with using OAuth, you can create an API token in the Cloudflare dashboard and configure Wrangler to use that by setting the [`CLOUDFLARE_API_TOKEN` environment variable](https://developers.cloudflare.com/workers/wrangler/system-environment-variables/#supported-environment-variables).

**Port already in use**: If port 8001 is already in use, I suggest you find whatever is running on it with `lsof -i :8001` and kill it. You can change this project's port in `vite.config.ts` if you really want to, but each lesson is intentionally on its own reserved port to simplify debugging, so change this at your own peril.

**Database ID not found**: Ensure you've correctly copied the database ID from step 2 into your `wrangler.toml` file.
