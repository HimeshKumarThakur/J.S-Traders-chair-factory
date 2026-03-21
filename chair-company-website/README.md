# Chair Company Website

Welcome to the Chair Company Website project! This project is designed to showcase a luxurious and modern chair collection, inspired by the design and functionality of high-end chair companies.

## Project Structure

```
chair-company-website
├── src
│   ├── app
│   │   ├── globals.css          # Global styles including Tailwind CSS and custom styles
│   │   ├── layout.tsx           # Main layout component wrapping page content
│   │   └── page.tsx             # Entry point for the main page
│   ├── components
│   │   ├── Header.tsx           # Header component with logo and navigation
│   │   ├── Footer.tsx           # Footer component with copyright and links
│   │   ├── ProductCard.tsx      # Component displaying individual product information
│   │   ├── Hero.tsx             # Hero section component for promotional content
│   │   └── Navigation.tsx       # Navigation menu component for page navigation
│   ├── pages
│   │   ├── products.tsx         # Page displaying a list of products
│   │   ├── about.tsx            # Page providing company information
│   │   └── contact.tsx          # Page with contact form or information
│   ├── styles
│   │   └── variables.css        # CSS variables for consistent styling
│   └── types
│       └── index.ts             # TypeScript types and interfaces
├── public
│   └── fonts                    # Custom font files for typography
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── next.config.js               # Next.js configuration
├── package.json                 # npm configuration with dependencies and scripts
└── README.md                    # Project documentation
```

## Features

- Responsive design that adapts to various screen sizes.
- Smooth scrolling for a better user experience.
- Custom animations for elements to enhance visual appeal.
- A modern and elegant typography using Google Fonts.
- Easy navigation between different pages including products, about, and contact.

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd chair-company-website
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open your browser and go to `http://localhost:3000` to view the website.

## Usage Guidelines

- Modify the components in the `src/components` directory to customize the layout and functionality.
- Update the styles in `src/app/globals.css` and `src/styles/variables.css` to change the appearance of the website.
- Add new pages or features as needed by creating new files in the `src/pages` directory.

## Persistent Admin Data (MySQL on Vercel)

Admin edits are now stored with this priority:

1. MySQL (`MYSQL_URL` or `MYSQL_HOST` + credentials)
2. Vercel KV (`KV_REST_API_URL`, `KV_REST_API_TOKEN`)
3. Local file fallback (`data/admin-data.json` or `/tmp` on Vercel)

To keep admin edits forever in production, configure MySQL on Vercel.

### Required environment variables

- `MYSQL_URL` (recommended single connection string)

Or use individual variables:

- `MYSQL_HOST`
- `MYSQL_PORT` (optional, default `3306`)
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`
- `MYSQL_SSL` (`true` by default; set `false` only if your provider requires no SSL)

### Vercel setup

1. Create a managed MySQL database (PlanetScale/Railway/AWS RDS/etc.).
2. Add the variables above in Vercel Project Settings -> Environment Variables.
3. Redeploy your project.

The app auto-creates table `js_traders_admin_store` and uses key `js-traders-admin-data-v1`.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.