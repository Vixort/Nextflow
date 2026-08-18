// Preset tags available for categorizing website templates.
// Grouped by category for the admin tag picker UI.
export const PRESET_TAG_GROUPS: { group: string; tags: string[] }[] = [
  {
    group: 'Industry',
    tags: ['SaaS', 'E-Commerce', 'Portfolio', 'Blog', 'Restaurant', 'Real Estate', 'Agency', 'Startup', 'Finance', 'Fitness', 'Travel', 'Education', 'Healthcare', 'Event', 'Personal'],
  },
  {
    group: 'Style',
    tags: ['Minimal', 'Dark', 'Light', 'Bold', 'Elegant', 'Luxury', 'Modern', 'Classic', 'Playful', 'Editorial', 'Geometric', 'Gradient'],
  },
  {
    group: 'Layout',
    tags: ['Landing Page', 'One Page', 'Multi-Page', 'Dashboard', 'Etsy Store', 'Showcase', 'Marketing', 'Product', 'Lead Gen', 'Coming Soon'],
  },
  {
    group: 'Feature',
    tags: ['Animations', '3D', 'Dark Mode', 'Interactive', 'RTL', 'Blog Engine', 'Cart', 'Booking', 'Auth', 'CMS', 'API', 'SEO'],
  },
  {
    group: 'Theme',
    tags: ['Cyberpunk', 'Neo-Brutalism', 'Glassmorphism', 'Retro', 'Aurora', 'Monochrome', 'Bento', 'Glass', 'Warm', 'Cool'],
  },
]

// Flat list of every preset tag (deduplicated).
export const ALL_PRESET_TAGS: string[] = Array.from(
  new Set(PRESET_TAG_GROUPS.flatMap((g) => g.tags)),
)
