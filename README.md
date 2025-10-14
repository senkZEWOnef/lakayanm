# Lakayan'm 🇭🇹

> Discover Haiti, one city at a time.

Lakayan'm is a comprehensive tourism and local discovery platform for Haiti, showcasing all 9 departments, their cities, landmarks, restaurants, hotels, beaches, and historical figures. Built with modern web technologies and designed to promote local businesses and cultural heritage.

## Features

- **Department & City Explorer**: Navigate through Haiti's 9 departments and their cities
- **Place Discovery**: Find restaurants, hotels, beaches, landmarks, shops, and tours
- **Historical Figures**: Learn about notable people from each city
- **Business Listings**: Local businesses can showcase their offerings
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Future Features**: Booking system, payments, user reviews, and business analytics

## Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Neon PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js with GitHub OAuth
- **Deployment**: Optimized for Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Neon database (or any PostgreSQL database)
- GitHub OAuth app (for authentication)

### Installation

1. **Clone & Install**
   ```bash
   git clone https://github.com/yourusername/lakayanm.git
   cd lakayanm
   npm install
   ```

2. **Environment Setup**
   Create a `.env.local` file:
   ```env
   DATABASE_URL="your-neon-connection-string"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   GITHUB_ID="your-github-client-id"
   GITHUB_SECRET="your-github-client-secret"
   ```

3. **Database Setup**
   ```bash
   npx prisma generate
   npm run seed
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000`

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage with featured content
│   ├── departments/page.tsx        # All departments listing
│   ├── dept/[slug]/page.tsx       # Department detail page
│   ├── dept/[slug]/city/[city]/page.tsx  # City detail with places & figures
│   ├── about/page.tsx             # About page
│   └── api/auth/[...nextauth]/    # Authentication endpoints
├── lib/
│   └── db.ts                      # Prisma client configuration
└── scripts/
    └── seed.ts                    # Database seeding script
```

## Current Content

The app comes pre-seeded with:

- **Nord Department** → **Cap-Haïtien**
  - **Restaurant**: Lakay Restaurant (seaside Haitian cuisine)
  - **Landmark**: Citadelle Laferrière (UNESCO World Heritage site)
  - **Historical Figure**: Henry Christophe (Haitian Revolution leader)

## Business Model

- **Free Tier**: Public browsing and basic listings
- **Starter Plan** ($10/month): Business listing with cover photo
- **Growth Plan** ($30/month): Featured placement + booking/ordering links + gallery
- **Premium Plan** ($50/month): Homepage features + priority support + unlimited gallery

## Roadmap

### Phase 1 (MVP) ✅
- [x] Department/City structure
- [x] Place listings (restaurants, hotels, landmarks, etc.)
- [x] Historical figures
- [x] Responsive design
- [x] Neon database integration

### Phase 2 (Business Features)
- [ ] Business dashboard for owners
- [ ] Subscription management (Stripe integration)
- [ ] Photo upload system
- [ ] Reviews and ratings

### Phase 3 (Advanced Features)
- [ ] Booking system for hotels/tours
- [ ] Online ordering for restaurants
- [ ] Flight search and booking (affiliate links)
- [ ] Mobile app (React Native)
- [ ] Multi-language support (Kreyòl, French, English)

### Phase 4 (Analytics & Growth)
- [ ] Business analytics dashboard
- [ ] SEO optimization
- [ ] Social media integration
- [ ] Sponsored content system

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Deployment

The app is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

## Local Development Tips

- Use `npm run seed` to reset/populate the database
- The app uses dynamic imports for better performance
- All pages are server-side rendered for SEO
- Images are optimized with Next.js Image component

## License

MIT License - see [LICENSE](LICENSE) file for details

---

**Built with ❤️ from Cap-Haïtien for all of Haiti**

*Lakayan'm* - showcasing the beauty, history, and culture of Haiti, one city at a time.
