# Lesson 4: Choose your own adventure

## Overview

You've successfully explored two very different approaches on how to integrate an application with AI. The jury is still out on whether people will be consuming products and platforms primarily through an AI assistant, or whether each product and platform will have their own AI features sprinkled in. Personally though, I doubt one pattern massively wins out over the other: there are too many good use-cases in both environments.

## Prerequisites

Ensure you `cd` into this `/lesson-4/` directory and `npm run dev` from here. The application will now be available at [http://localhost:8004/](http://localhost:8004/).

## Options

### 1. [Easy] Re-explore these patterns for another entity

We seeded contact data as part of this application, but don't yet have any AI integrations there (or even a UI yet!). Consider creating either an entirely AI experience (e.g. create new contacts from an AI assistant), or design a new UI for these entities with AI at the forefront.

### 2. [Medium] Dive deeper into the MCP spec

This workshop only looked at tools and text over MCP. But MCP has support for so much more! Different data types, and entirely new concepts like "elicitation" (where the MCP server can go back to the user with UI components to get more information), "resources" (where distinct server-side objects can be inspected and directly referenced) and "sampling" (where the MCP server can ask the client's LLM to perform a task). We just `JSON.stringify`-d the property search results — perhaps you could return real resources instead?

### 3. [Hard] Protect your MCP server

We're leaking data! I know the rest of the app is as well, but that's beside the point! [Lock down the MCP server with OAuth](https://developers.cloudflare.com/agents/model-context-protocol/authorization/) and ensure only you have access to the ~~made up~~ sensitive information contained in React Rental Agency.

### 4. [Hard] Get agentic with a "third-party" MCP server

In another Cloudflare Worker, spin up an MCP server for some "third-party" business (e.g. Advanced Legal Services). Create a tool which could be used within the context of the React Rental Agency (e.g. `draftTenancyAgreement`).

Then, either:

- connect to this server too from your AI assistant (e.g. ChatGPT) and try to get the LLM to first call React Rental Agency to find a property and subsequently call the third-party business for their tool (e.g. "find me a three bedroom apartment in Brooklyn and draft a tenancy agreement for John Smith").
- or, for bonus points, connect to the third-party's MCP server from directly within the React Rental Agency's app. Cloudflare's `McpAgent` class has [native support to act as an MCP client](https://developers.cloudflare.com/agents/model-context-protocol/mcp-client-api/#addmcpserver). See if you can develop the Agent so that it truly starts to act in an autonomous fashion and can dynamically chain together two or more calls before going back to the user.

## Share

Lastly, come back and share what you built! I'm very much looking forward to seeing what y'all come up with! If you share GitHub links with me, I will follow up and add them here so other people can check out your work.

## Feedback

After you're done, please consider [leaving some feedback](https://forms.gle/uvrFG14Basf6o83V6) for me so that I can continue to improve these sessions. It's just a two minute anonymous Google Form — thank you!
