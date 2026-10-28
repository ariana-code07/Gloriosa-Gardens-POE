Project Title: Glorosia Gardens

Student information: Ariana Lyall ST10527831
References
- Inspriation: https://lifestyle.co.za/?srsltid=AfmBOooDEwHAZx6Sxh3kyTRpnQKxPgGKoxcfeOCRTpvV8va8c27Sfs_2
- Buguet: https://www.growthpulsemedia.co.za/website-cost-south-africa/
- Logo: https://www.canva.com/design/DAHRg61_xCs/NPJQEmo1TPmjTWxRkcUhEw/edit?ui=e30
- CSS: https://web.stanford.edu/group/csp/cs21/csscheatsheet.pdf
- HTML: https://web.stanford.edu/group/csp/cs21/htmlcheatsheet.pdf
- Java script: https://websitesetup.org/wp-content/uploads/2020/09/Javascript-Cheat-Sheet.pdf
- Github: https://github.com/ariana-code07/Gloriosa-Gardens.git


Project Overview: 

- Gloriosa Gardens is a garden maintenance and design business based in Florida, Roodepoort, founded roughly 25 years ago and run by owner Richard Lyall with a small team of three. The business had no consistent online presence: an early set of five HTML pages existed, but used inline styling only, had broken internal navigation, invalid markup, and no mobile support.
This project delivers a complete, professional static website for the business across two parts. Part 1 focused on the HTML structure — building semantic, valid, bug-free markup across all pages. Part 2 focused on CSS — replacing inline styling with a single shared stylesheet, introducing a consistent visual identity, and making every page responsive. A sixth page, Enquiry, was added afterwards with a quote-request form, and additional content (stats, process steps, calls to action) was layered into the existing pages to make the site more informative and conversion-focused.
The finished site consists of six pages — Home, About Us, Services, Gallery, Contact Us, and Enquiry — sharing one global stylesheet, a consistent navigation structure, and a cohesive “flame lily” design theme inspired by the business's namesake flower.

Goals:
- Establish a credible, professional online presence to support a business that had relied entirely on word of mouth.

- Generate qualified leads by making it easy for visitors to request a quote.

- Clearly communicate the range of services offered and showcase completed work.

Objectives:
- Deliver valid, semantic HTML across all pages with no broken links or malformed markup.

- Apply a single, consistent external stylesheet replacing all inline styling.
  
- Make every page responsive across desktop, tablet and mobile breakpoints.

- Add a working enquiry mechanism so visitors can request a quote directly from the site.

Key Features and Functionality
-  Home — introduction, key selling points, a stats strip, a “How It Works” process section, and a call-to-action banner.
-  About Us — business history, mission and vision, “Our Approach” values, service area, and team profile cards.
-  Services — maintenance, plant care, and clean-up packages, pricing/scheduling explainer, and a 4-step process section.
-  Gallery — responsive photo grid and an embedded video, showcasing completed garden work.
-  Contact Us — phone, email and LinkedIn cards, an operating hours table, and an embedded Google Map.
-  Enquiry — a quote-request form (name, phone, email, suburb, service dropdown, preferred date, message) using a mailto action.

Timeline and Milestones

<img width="673" height="234" alt="image" src="https://github.com/user-attachments/assets/1a767d21-f44b-472a-9284-af3e11e4b825" />


Part 1 Details ( HTML)
- Added basic HTML tags (Header,body,main,ect)
- Created four webpages: Home, About us, Gallery and Contact us
- Added basic information
- Added basic style formattingg
- Sitmap
<img width="997" height="430" alt="image" src="https://github.com/user-attachments/assets/6c24284c-8a8c-472d-a076-f999ab7635ee" />

Part 2 Details (CSS)
- Added Enquiry webpage
- Defined a design system using CSS custom properties for colour, typography and spacing: deep forest green and warm parchment as the base palette, with an ember-red-to-gold “flame lily” gradient as a signature accent.
- Loaded Cormorant Garamond (headings) and Mulish (body text) from Google Fonts, replacing the original system fonts.
- Built a consistent header and navigation bar with an active-page highlight, and a shared footer, reused across all six pages.
- Implemented responsive layouts using CSS Grid and Flexbox, with media query breakpoints so every page adapts cleanly from desktop down to mobile widths.
- Styled reusable components: hero banners, feature/service/value cards, the team grid, the gallery grid with hover effects, the enquiry form, stat cards, process steps, call-to-action banners, and the operating-hours table.
- Added hover and focus states on navigation links, buttons, and form fields for a more polished, accessible feel.

Changelog
- Every page had used inline styling only; I created a single external stylesheet (CSS/styles.css) and linked it from all pages instead.
- Built a consistent visual identity: deep forest green header/footer, warm parchment background, and a signature “flame lily” red-to-gold gradient used as an accent (nav highlight, card borders, buttons) as a nod to the Gloriosa flower.
- Replaced the old system fonts with Cormorant Garamond (headings) and Mulish (body text), loaded from Google Fonts.
- Added hero banner sections, card-based layouts, and a consistent navigation bar with an active-page highlight to every page.
- Added a responsive/mobile viewport meta tag and responsive grid breakpoints — the original site was not mobile-friendly.
- Created a new Enquiry.html page with a quote-request form: full name, phone, email, suburb/area, a service dropdown, preferred date, and a message field.


  Part 3 Details (Java Script)
- Renamed pages to clean URLs: Home.html → index.html, About us.html → about.html, Contact us.html → contact.html (and services, gallery, enquiry in lowercase); every link updated and a _redirects file added for the old names.
- Renamed folders to lowercase (css/, js/, images/) and images to descriptive names (e.g. bushes.jpg → trimmed-garden-bushes.jpg); compressed large images.
JavaScript interactivity (js/main.js, jQuery)
-S ervices page now builds its cards in JavaScript with live search, a category filter and A–Z / Z–A / category sorting; the original static list is kept inside <noscript>.
- Added a FAQ accordion on Services and a click-to-enlarge lightbox on Gallery (keyboard and previous/next support).
-	Added scroll-reveal animations, animated stat counters and hover effects, all disabled for visitors who prefer reduced motion.
Forms
-	Enquiry: Rebuilt the form with garden size, frequency and date fields; after validation it loads data/pricing.json by AJAX and shows an estimated cost range and availability on the page without reloading, with an option to email the enquiry.
-	Contact: Added a validated message form (name, email, optional phone, message type, message) that compiles an email addressed to the business recipient.
-	Rules: Validation covers name, email, South African phone format, dates (not in the past), required selects and message length (10–500 characters, live counter), with inline error messages.
Performance, security and accessibility
-	Lazy-loaded images with set dimensions, deferred scripts, video preload off with a poster image.
-	Added security headers and a content security policy (_headers), a skip link, visible focus styles and ARIA attributes.
- Replaced the footer with a fuller one (navigation, phone, email, hours).

Changelog

Date/time updater (js/datetime.js)
- Added a top bar on every page showing today’s date and a live clock that updates every second in South African time.
-	Added an Open now / Closed status calculated from the opening hours (Mon–Fri 07:00–17:00, Sat 08:00–13:00; public holidays not included).
-	Today’s row is highlighted in the hours table, and the footer copyright year now updates automatically.

Form validator (js/validator.js)
-	Moved all validation out of main.js into a reusable module shared by the enquiry and contact forms.
-	Added an error summary at the top of each form with links that jump to each problem field, and automatic formatting of valid phone numbers (e.g. 084 723 9418).

Gallery slideshow (js/slideshow.js)
-	Added a “Garden Slideshow” section to the Gallery with five photos, fade transitions and autoplay every 5 seconds.
-	Controls: previous/next buttons, clickable dots, slide counter, Pause/Play button, arrow keys and touch swipe; it pauses on hover/focus and does not autoplay for reduced-motion visitors.
-	Kept the click-to-enlarge photo grid below the slideshow.
Added
-	README.md now covers Part 3 details, the new scripts, SEO, deployment steps, sitemap, a versioned changelog (3.0–3.12) and references.
-	The Part 2 feedback section in the changelog is left as a template for you to complete.


  


