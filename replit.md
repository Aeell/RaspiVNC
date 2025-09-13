# VNC Client Application

## Overview

This is a web-based VNC (Virtual Network Computing) client application built with React and Express. The application provides a modern interface for connecting to and controlling remote desktop computers through VNC protocol. It features a responsive design with mobile touch controls, real-time WebSocket communication for VNC data streaming, and a comprehensive UI built with shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **WebSocket Server**: ws library for real-time VNC data streaming
- **VNC Protocol**: TCP socket connections to VNC servers with WebSocket proxy
- **Development**: Hot reload with Vite middleware integration

### Component Architecture
- **VNC Viewer**: Canvas-based rendering component for remote desktop display
- **Connection Panel**: Form component for VNC server connection parameters
- **Touch Controls**: Mobile-optimized control interface for touch devices
- **Responsive Design**: Mobile-first approach with desktop enhancements

### Data Flow
- **VNC Connection**: WebSocket proxy between browser and VNC server
- **Message Schema**: Zod validation for VNC protocol messages and connection parameters
- **Real-time Communication**: Bidirectional data flow for mouse, keyboard, and display updates
- **Canvas Rendering**: Direct pixel manipulation for VNC framebuffer display

### Mobile Optimization
- **Touch Controls**: Dedicated touch interface for mobile devices
- **Responsive Layout**: Adaptive UI that works across screen sizes
- **Mobile Detection**: Custom hook for device-specific feature toggling

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **TypeScript**: Full TypeScript support with strict type checking
- **Vite**: Development server and build tool with plugin ecosystem

### UI and Styling
- **Radix UI**: Comprehensive set of accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **shadcn/ui**: Pre-built component library with consistent design system
- **Lucide React**: Icon library for consistent iconography
- **FontAwesome**: Additional icon support for VNC-specific controls

### State Management and Data Fetching
- **TanStack Query**: Server state management and caching
- **Zod**: Runtime type validation and schema definition
- **date-fns**: Date manipulation utilities

### WebSocket and Networking
- **ws**: WebSocket server implementation for VNC proxy
- **TCP Sockets**: Native Node.js networking for VNC server connections

### Database and ORM (Configured but not actively used)
- **Drizzle ORM**: Type-safe ORM with PostgreSQL support
- **Neon Database**: Serverless PostgreSQL database provider
- **Database Migrations**: Drizzle Kit for schema management

### Development and Build Tools
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration
- **TypeScript Compiler**: Type checking and compilation

### Replit-Specific Integrations
- **Replit Plugins**: Development environment enhancements
- **Runtime Error Overlay**: Development debugging tools
- **Cartographer**: Code navigation assistance
- **Dev Banner**: Development environment indicators