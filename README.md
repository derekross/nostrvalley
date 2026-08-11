# Nostr Valley

A modern, decentralized conference platform built on the Nostr protocol. Nostr Valley brings together speakers, attendees, and the global Nostr community for an immersive conference experience powered by decentralized technology.

## 🌟 Features

### 🎯 Core Functionality
- **Decentralized Authentication**: Nostr-native login with NIP-07 support
- **Multi-Relay Content Fetching**: Comprehensive content discovery across 6 major Nostr relays
- **Real-time Community Feed**: Live updates from the Nostr Valley community
- **Interactive Schedule**: NIP-52 compliant calendar events with RSVP functionality
- **Speaker Profiles**: Decentralized speaker information and proposal submissions
- **Community Engagement**: Comment threads, discussions, and community interactions

### 📱 User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Mobile-First Navigation**: Bottom navigation bar for easy mobile access
- **Dark/Light Theme**: Automatic theme switching with system preferences
- **Lightning Integration**: Bitcoin Lightning zaps for speaker support and engagement
- **Progressive Web App**: Offline-capable with modern web technologies

### 🔧 Technical Features
- **Multi-Relay Architecture**: Fetches content from multiple Nostr relays simultaneously
- **Fault Tolerance**: Graceful degradation when individual relays are unavailable
- **Real-time Updates**: Live content synchronization across the Nostr network
- **TypeScript**: Full type safety throughout the application
- **Modern React**: Built with React 18, React Query, and latest best practices
- **Tailwind CSS**: Utility-first styling with custom design system

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- A Nostr-compatible browser extension (like Alby, nos2x, or Flamingo)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/nostr-valley.git
   cd nostr-valley
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Running Tests

```bash
npm test
```

This runs TypeScript compilation, ESLint, Vitest tests, and production build.

## 🏗️ Architecture

### Multi-Relay System

Nostr Valley implements a sophisticated multi-relay fetching system that queries content from multiple Nostr relays simultaneously:

**Primary Relays:**
- `wss://relay.nostr.band`
- `wss://ditto.pub/relay`
- `wss://relay.damus.io`
- `wss://relay.primal.net`
- `wss://nos.lol`
- `wss://relay.snort.social`

**Benefits:**
- **Enhanced Content Discovery**: Find content that might only exist on specific relays
- **Improved Reliability**: Continue working even if some relays are down
- **Better Performance**: Parallel fetching with intelligent deduplication
- **Network Resilience**: Geographic distribution and load balancing

### Component Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── comments/        # Comment system
│   ├── ui/              # Base UI components (shadcn/ui)
│   └── ...              # Feature-specific components
├── hooks/               # Custom React hooks
│   ├── useCalendarEvents.ts    # Schedule/event data
│   ├── useComments.ts          # Comment system
│   ├── useInfiniteCommunityFeed.ts  # Community feed
│   └── ...                     # Other data fetching hooks
├── lib/                 # Utility functions
│   ├── nostrUtils.ts    # Multi-relay utilities
│   ├── genUserName.ts  # Username generation
│   └── ...             # Other utilities
├── pages/               # Page components
│   ├── Index.tsx       # Home page
│   ├── Community.tsx   # Community feed
│   ├── Schedule.tsx    # Event schedule
│   ├── Speakers.tsx    # Speaker information
│   └── ...             # Other pages
└── contexts/           # React contexts
    └── AppContext.ts   # Global app state
```

### Key Hooks

#### `useCalendarEvents`
Fetches NIP-52 calendar events from multiple relays for the schedule page.

#### `useInfiniteCommunityFeed`
Implements infinite scrolling for the community feed with multi-relay support.

#### `useComments`
Handles comment threads and discussions with multi-relay fetching.

#### `useNostrValleyFeed`
Fetches official Nostr Valley content and media from across the network.

## 📱 Pages & Features

### 🏠 Home Page
- Welcome message and conference overview
- Quick navigation to key sections
- Featured content and announcements

### 👥 Community Feed
- Real-time feed of Nostr Valley content
- Posts with #NostrValley and #nostrvalley hashtags
- Media support (images, videos)
- Infinite scrolling with pagination
- Multi-relay content aggregation

### 📅 Schedule
- NIP-52 compliant calendar events
- Date-based and time-based event support
- RSVP functionality with attendance tracking
- Event filtering and search
- Speaker information integration

### 🎤 Speakers
- Speaker profiles and bios
- Proposal submission system
- Lightning zap integration for support
- Contact information and social links
- Session schedules and topics

### 💬 Comments & Discussions
- Nested comment threads
- Real-time updates
- Nostr-native commenting (kind 1111)
- User authentication and profiles
- Multi-relay comment fetching

## 🔐 Authentication

Nostr Valley uses Nostr-native authentication:

### NIP-07 Support
- Browser extension integration
- Automatic key management
- Secure signing of events and messages

### Login Flow
1. User clicks "Login/Sign up"
2. Browser prompts for Nostr extension
3. Extension provides public key for identification
4. Application creates encrypted session
5. User can now interact with all features

### Features
- **Decentralized**: No central authentication server
- **Secure**: Private key never leaves the browser
- **Portable**: Use same identity across Nostr applications
- **Anonymous**: No personal information required

## ⚡ Lightning Integration

### Zap Functionality
- **Speaker Support**: Send Bitcoin Lightning zaps to speakers
- **Content Appreciation**: Zap posts and comments you find valuable
- **Real-time**: Instant Bitcoin transactions
- **Multi-platform**: Works with WebLN and NWC wallets

### Supported Wallets
- **WebLN**: Browser-integrated Lightning wallets
- **NWC (Nostr Wallet Connect)**: Mobile wallet integration
- **Alby**: Browser extension wallet
- **Other Lightning wallets**: Through WebLN compatibility

## 🎨 Design System

### Theme Support
- **Light Theme**: Clean, modern interface for bright environments
- **Dark Theme**: Easy-on-the-eyes for low-light situations
- **System Preference**: Automatically matches OS theme
- **Manual Toggle**: User-controlled theme switching

### Responsive Design
- **Desktop**: Full-featured interface with sidebar navigation
- **Tablet**: Optimized layout with touch-friendly controls
- **Mobile**: Bottom navigation bar with compact, accessible interface

### UI Components
Built with shadcn/ui and Tailwind CSS:
- **Consistent**: Unified design language across all components
- **Accessible**: WCAG-compliant with keyboard navigation
- **Customizable**: Theme-aware with CSS custom properties
- **Modern**: Latest design patterns and best practices

## 🛠️ Development

### Tech Stack
- **Frontend**: React 18 with TypeScript
- **State Management**: React Query for server state
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS with shadcn/ui components
- **Nostr**: nostr-tools and @nostrify/nostrify
- **Build Tool**: Vite
- **Testing**: Vitest with React Testing Library
- **Linting**: ESLint with TypeScript support

### Scripts
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run all tests and checks

# Deployment
npm run deploy       # Build and deploy to Nostr
```

### Code Quality
- **TypeScript**: Full type safety with strict configuration
- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Code formatting (configured in .prettierrc)
- **Testing**: Unit and integration tests with Vitest
- **Build Verification**: Production build validation

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use existing hooks and utilities when possible
- Write tests for new functionality
- Update documentation for new features
- Ensure responsive design for all components

## 🌐 Nostr Integration

### Supported NIPs
- **NIP-01**: Basic protocol flow
- **NIP-04**: Encrypted direct messages
- **NIP-05**: Nostr addresses (human-readable identifiers)
- **NIP-07**: Browser extension signing
- **NIP-17**: Private direct messages
- **NIP-25**: Reactions
- **NIP-52**: Calendar events
- **NIP-57**: Lightning zaps
- **NIP-58**: Badges
- **NIP-68**: Picture events

### Event Types
- **Kind 1**: Text notes (posts, comments)
- **Kind 7**: Reactions (likes, dislikes)
- **Kind 20**: Picture events (media posts)
- **Kind 1111**: Comments and replies
- **Kind 31922**: Date-based calendar events
- **Kind 31923**: Time-based calendar events

### Relay Strategy
- **Query**: Multiple relays for comprehensive content discovery
- **Publish**: Strategic relay selection for maximum reach
- **Fallback**: Graceful degradation when relays are unavailable
- **Optimization**: Intelligent caching and deduplication

## 📊 Performance

### Multi-Relay Benefits
- **4-5x Coverage**: Content fetched from multiple relays simultaneously
- **Fault Tolerance**: Continue working even if some relays fail
- **Real-time Updates**: Faster content propagation across the network
- **Load Distribution**: Spreads query load across infrastructure providers

### Optimization Features
- **React Query**: Efficient caching and background updates
- **Code Splitting**: Dynamic imports for better loading performance
- **Image Optimization**: Lazy loading and modern format support
- **Bundle Analysis**: Optimized build sizes and loading strategies

## 🚀 Deployment

### Static Site Generation
- Built as a static site for maximum performance and reliability
- Compatible with any static hosting service
- Nostr-native deployment options available

### Deployment Commands
```bash
# Build for production
npm run build

# Deploy to Nostr (requires nostr-deploy-cli)
npm run deploy
```

### Hosting Options
- **Static Hosting**: Vercel, Netlify, GitHub Pages
- **Nostr Hosting**: Decentralized hosting on Nostr network
- **CDN**: Content delivery network for global performance

## 🤝 Community

### Getting Involved
- **GitHub**: Report issues, request features, contribute code
- **Nostr**: Follow #NostrValley hashtag for updates
- **Discussions**: Join community conversations and planning
- **Testing**: Help test new features and provide feedback

### Communication
- **Issues**: Bug reports and feature requests
- **Discussions**: General questions and ideas
- **Pull Requests**: Code contributions and improvements
- **Nostr**: Decentralized communication on the protocol

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Nostr Protocol**: For creating the foundation of decentralized social media
- **Nostrify**: For excellent Nostr React libraries and tools
- **shadcn/ui**: For the beautiful and accessible component library
- **Vite**: For the lightning-fast build tool and development experience
- **Nostr Valley Community**: For the inspiration and ongoing support

## 📞 Support

### Getting Help
- **Documentation**: Read this README and inline code comments
- **Issues**: Check existing issues or create a new one
- **Community**: Join discussions on GitHub or Nostr
- **Discord/Telegram**: Community chat channels (if available)

### Bug Reports
When reporting bugs, please include:
- Operating system and browser version
- Steps to reproduce the issue
- Expected vs actual behavior
- Console errors or logs
- Screenshots if applicable

---

**Built with ❤️ for the Nostr community**

Nostr Valley represents the future of decentralized conferences - where community, technology, and freedom of expression come together on the Nostr protocol.

## License

This project is licensed under the GNU General Public License v3.0 or later — see the [LICENSE](LICENSE) file for details.
