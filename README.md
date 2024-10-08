## Description

This is the front end of the CCRP for corporate website. It is built with Next.js and Tailwind CSS.

## Installation

```bash
pnpm install
```

## Usage

```bash
pnpm dev
```

## Environment Variables

Create a `.env.local` file in the root directory of the project. Add the following environment variables:

```bash
API_URL="http://backend.example.dev"
DMRV_API="https://dmrv.example.dev"
NEXT_PUBLIC_GRAPHQL_API_URL="http://backend.example.dev/graphql"
NEXT_PUBLIC_MAPBOX_KEY="mapbox-key"
NEXT_PUBLIC_TRACKING_ACTIVATED=true|false
NEXT_PUBLIC_SANITY_API_VERSION="v2021-03-25"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_PROJECT_ID="sanity-project-id"
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="clerk_publishable_key"
CLERK_SECRET_KEY="clerk_secret_key"
NEXT_PUBLIC_ENABLED_MENU_ITEMS="Dashboard,Portfolio,Calculator,Impact,Baseline"
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

On fly.io, the app is deployed using the following command:

```bash
flyctl deploy
```

On AWS, the app is deployed using the following command:

```bash

```

## License

[APACHE 2.0](https://www.apache.org/licenses/LICENSE-2.0)

```

```
