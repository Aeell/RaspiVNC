
# VNC Client Application

A modern, web-based VNC (Virtual Network Computing) client application that provides remote desktop access through your browser. Built with React, TypeScript, and Express, featuring a responsive design with mobile touch controls and real-time WebSocket communication.

## Features

- **Web-based VNC Client**: Connect to remote desktops directly from your browser
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Touch Controls**: Mobile-optimized interface with touch-friendly controls
- **Real-time Communication**: WebSocket-based streaming for low-latency interaction
- **Modern UI**: Clean interface built with shadcn/ui components
- **TypeScript**: Full type safety throughout the application

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks and TypeScript
- **Vite** - Fast development server and build tool
- **shadcn/ui** - Beautiful, accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **TanStack Query** - Powerful data fetching and state management
- **Wouter** - Lightweight client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **WebSocket (ws)** - Real-time bidirectional communication
- **TypeScript** - Type-safe server-side development

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vnc-client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   ├── connection-panel.tsx
│   │   │   ├── touch-controls.tsx
│   │   │   └── vnc-viewer.tsx
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Page components
│   │   └── App.tsx         # Main application component
│   └── index.html          # HTML entry point
├── server/                 # Backend Express application
│   ├── index.ts            # Main server file
│   ├── routes.ts           # API routes
│   └── vite.ts             # Vite integration
├── shared/                 # Shared TypeScript schemas
└── package.json
```

## Usage

### Connecting to a VNC Server

1. Open the application in your browser
2. In the connection panel, enter:
   - **Host**: IP address or hostname of the VNC server
   - **Port**: VNC server port (typically 5900-5999)
   - **Password**: VNC server password (if required)
3. Click "Connect" to establish the connection

### Mobile Controls

On mobile devices, use the touch controls panel to:
- **Left Click**: Tap the Left Click button, then tap the screen
- **Right Click**: Tap the Right Click button, then tap the screen
- **Keyboard**: Open virtual keyboard for text input
- **Drag**: Enable drag mode for moving windows/objects

## Configuration

### Environment Variables

The application uses the following environment variable:
- `PORT` - Server port (default: 5000)

### Database (Optional)

The project includes Drizzle ORM configuration for PostgreSQL, though it's not actively used in the current implementation. To set up the database:

1. Configure your database connection in `drizzle.config.ts`
2. Run migrations: `npm run db:push`

## Deployment

### On Replit

This project is optimized for Replit deployment:

1. The `.replit` file contains the necessary configuration
2. Environment variables can be set in the Secrets tab
3. The app will automatically deploy when you run it

### Production Build

For other deployment platforms:

```bash
npm run build
npm start
```

This creates an optimized production build and starts the server.

## Architecture

### WebSocket Communication

The application uses a WebSocket proxy architecture:
1. Browser connects to the Express server via WebSocket
2. Server establishes TCP connection to the VNC server
3. Data is proxied bidirectionally between browser and VNC server
4. Canvas rendering displays the remote desktop in real-time

### Mobile Optimization

- Responsive layout adapts to different screen sizes
- Touch controls provide mobile-friendly interaction
- Custom hooks detect mobile devices for feature toggling

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Troubleshooting

### Common Issues

1. **Connection Timeout**: Ensure the VNC server is running and accessible
2. **WebSocket Errors**: Check that port 5000 is not blocked by firewall
3. **Touch Controls Not Working**: Verify you're using a touch-enabled device

### Debug Mode

Set `NODE_ENV=development` to enable additional logging and development tools.

## Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/) component library
- Icons by [Lucide](https://lucide.dev/) and [FontAwesome](https://fontawesome.com/)
- WebSocket implementation using [ws](https://github.com/websockets/ws)
