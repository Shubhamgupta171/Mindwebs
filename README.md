# Weather Data Dashboard

An interactive React/Next.js dashboard for visualizing weather data on maps with polygon-based analysis and timeline controls.

## Features

### Core Functionality
- **Timeline Slider**: Interactive hourly timeline spanning 30 days (15 days before/after current date)
  - Single point selection mode
  - Range selection mode
  - Smooth dragging and precise time selection
  
- **Interactive Map**: 
  - Powered by Leaflet with OpenStreetMap tiles
  - Polygon drawing tools (3-12 points per polygon)
  - Map movement and centering controls
  - Persistent polygon visualization

- **Polygon Management**:
  - Draw polygons by clicking on the map
  - Right-click to complete polygon creation
  - Name and manage multiple polygons
  - Delete and focus on specific polygons
  - Automatic bounding box and centroid calculation

- **Data Source Integration**:
  - Open Meteo API integration for weather data
  - Customizable color coding rules per data source
  - Support for multiple operators (<, <=, =, >=, >)
  - Real-time color updates based on data thresholds

- **Dynamic Visualization**:
  - Polygons change color based on weather data
  - Automatic data averaging for time ranges
  - Real-time updates when timeline changes
  - Color-coded legends and tooltips

### Technical Features
- **Next.js 13+ with TypeScript**: Modern React framework with type safety
- **Zustand State Management**: Lightweight and efficient state management
- **Persistent Storage**: Polygons and settings saved to localStorage
- **Responsive Design**: Works on desktop and mobile devices
- **Component Architecture**: Modular, maintainable code structure

## Installation and Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd weather-dashboard
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
Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
npm start
```

## Usage Guide

### Creating Polygons
1. Click "Start Drawing Polygon" in the sidebar
2. Click on the map to add points (minimum 3, maximum 12)
3. Right-click to finish drawing the polygon
4. The polygon will automatically be assigned to the default data source

### Timeline Control
- **Single Mode**: Drag the slider to select a specific hour
- **Range Mode**: Toggle to range mode and drag both ends to select a time window
- **Reset**: Click "Now" to jump to the current time

### Configuring Data Sources
1. Go to the "Data Sources" tab in the sidebar
2. Modify the data field (e.g., temperature_2m, precipitation)
3. Add/edit color rules:
   - Set operators (<, <=, =, >=, >)
   - Define threshold values
   - Choose colors for each range
   - Add descriptive labels

### Managing Polygons
- **Rename**: Edit polygon names in the "Polygons" tab
- **Change Data Source**: Select different data sources for each polygon
- **Focus**: Click the edit button to center the map on a polygon
- **Delete**: Remove polygons using the trash button

## API Configuration

### Open Meteo API
The application uses the Open Meteo Archive API for weather data:
- **Endpoint**: `https://archive-api.open-meteo.com/v1/archive`
- **No API Key Required**: Open Meteo provides free access
- **Available Fields**:
  - `temperature_2m`: 2-meter temperature
  - `relative_humidity_2m`: Relative humidity
  - `precipitation`: Precipitation amount
  - `wind_speed_10m`: Wind speed at 10 meters

### Adding Custom Data Sources
To add additional data sources:

1. **Update the store** (`/store/useStore.ts`):
```typescript
const customDataSource: DataSource = {
  id: 'custom-source',
  name: 'Custom Weather',
  field: 'custom_field',
  apiUrl: 'https://your-api.com/endpoint',
  colorRules: [/* your color rules */]
};
```

2. **Modify data fetching** (`/lib/dataUtils.ts`):
```typescript
// Add custom API handling in fetchWeatherData function
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx          # Home page component
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── Dashboard.tsx     # Main dashboard component
│   ├── Map/              # Map-related components
│   │   ├── MapView.tsx   # Main map container
│   │   ├── PolygonDrawer.tsx  # Polygon drawing logic
│   │   └── PolygonRenderer.tsx # Polygon rendering
│   ├── Timeline/         # Timeline components
│   │   └── TimelineSlider.tsx # Interactive timeline
│   └── Sidebar/          # Sidebar components
│       ├── Sidebar.tsx   # Main sidebar container
│       ├── DataSourcePanel.tsx # Data source configuration
│       └── PolygonPanel.tsx    # Polygon management
├── store/                # State management
│   └── useStore.ts      # Zustand store configuration
├── lib/                  # Utility functions
│   └── dataUtils.ts     # Data fetching and processing
├── types/               # TypeScript type definitions
│   └── index.ts        # Application types
└── README.md           # This file
```

## Technologies Used

- **React 18**: Latest React with hooks and concurrent features
- **Next.js 13+**: React framework with App Router
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: High-quality UI component library
- **Leaflet**: Interactive maps library
- **React Leaflet**: React wrapper for Leaflet
- **Zustand**: Lightweight state management
- **React Range**: Range slider component
- **date-fns**: Date manipulation utilities
- **Lucide React**: Modern icon library

## Browser Compatibility

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Performance Considerations

- **Dynamic Imports**: Map components are loaded dynamically to avoid SSR issues
- **State Persistence**: Local storage for polygon and settings persistence
- **API Caching**: Efficient weather data caching to minimize API calls
- **Component Optimization**: Modular components for better code splitting

## Troubleshooting

### Common Issues

1. **Map not loading**:
   - Ensure internet connection for tile loading
   - Check browser console for JavaScript errors

2. **Polygon colors not updating**:
   - Verify Open Meteo API is accessible
   - Check network tab for API request errors
   - Ensure polygon coordinates are valid

3. **Timeline not responding**:
   - Check if date ranges are within API limits
   - Verify timeline state in browser dev tools

### Support

For issues and questions:
1. Check the browser console for error messages
2. Verify API endpoints are accessible
3. Ensure all dependencies are properly installed

## License

This project is created for educational/assignment purposes. Please refer to individual package licenses for third-party dependencies.

## Future Enhancements

- Additional weather data providers
- Export functionality for polygon data
- Advanced polygon editing tools
- Real-time weather data streaming
- Mobile app version
- Collaborative features