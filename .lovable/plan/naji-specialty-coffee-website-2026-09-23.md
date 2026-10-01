# NAJI Specialty Coffee website

## What will be built
- A polished five-page website: Home, Menu, About, Gallery, and Visit.
- A shared sticky header, minimal footer, and mobile action bar for Menu, Directions, and Call.
- A cinematic home page with menu previews, food highlights, experience details, and the verified Google rating.
- A mobile-friendly menu with clearly labeled placeholders for unknown descriptions and prices.
- An editorial gallery with accessible lightbox viewing.
- A visit page with the verified address, phone number, directions, and unconfirmed opening-hours placeholder.

## Visual direction
- Warm cream and soft beige surfaces balanced with espresso and charcoal sections.
- Pistachio used sparingly as an accent.
- Elegant editorial serif headlines with a clean contemporary sans-serif for navigation and body copy.
- Large, natural-light coffee and food photography with subtle motion and restrained corners.
- Generated editorial imagery will be treated as illustrative, not presented as authentic photos of the café.

## Content and conversions
- Use only the facts and menu items supplied in the brief.
- Preserve `[DESCRIPTION]`, `[MENU DESCRIPTION]`, `[PRICE]`, `[TO BE CONFIRMED]`, and link placeholders where facts are missing.
- Prioritize View Menu, Get Directions, and Call actions without adding fake booking, delivery, or ordering flows.
- Add factual local-business metadata and structured data without unconfirmed hours or unsupported claims.

## Technical details
- Build with the existing TanStack Start and Tailwind CSS setup.
- Define the full visual system as semantic tokens in the global stylesheet.
- Use route-specific metadata for every page.
- Use responsive, lazy-loaded images; keyboard-accessible navigation and lightbox; visible focus styles; and reduced-motion support.
- Validate the finished pages at desktop and mobile sizes and resolve any build or runtime errors.
