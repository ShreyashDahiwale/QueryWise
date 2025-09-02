# QueryWise

A modern, AI-powered database query interface built with Next.js and Firebase. QueryWise allows users to interact with MySQL databases through an intuitive interface, featuring natural language query processing and dynamic SQL generation.

![QueryWise](https://img.shields.io/badge/QueryWise-Database%20Interface-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-38B2AC)

## ✨ Features

### 🔍 **Smart Database Interaction**
- **Table Selection**: Intuitive interface to select tables from MySQL database
- **Dynamic Query Building**: Visual form-based query construction with WHERE clauses
- **Real-time Data Display**: Tabular format with sorting and filtering capabilities
- **Query Results Export**: Download results in various formats

### 🤖 **AI-Powered SQL Generation**
- **Natural Language Processing**: Convert plain English to SQL queries
- **Intelligent Query Validation**: AI validates queries and flags insufficient data
- **Context-Aware Suggestions**: Smart recommendations based on table structure
- **Error Handling**: Comprehensive error messages and debugging support

### 🎨 **Modern User Interface**
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Real-time Feedback**: Loading states and progress indicators
- **Accessible Design**: Built with accessibility best practices

### ⚡ **Performance & Reliability**
- **Fast Query Execution**: Optimized database connections
- **Caching**: Intelligent result caching for better performance
- **Error Recovery**: Graceful handling of connection issues
- **Security**: Secure database connections and query sanitization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MySQL database access
- Google AI API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShreyashDahiwale/QueryWise.git
   cd QueryWise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Database Configuration
   DATABASE_URL=your_mysql_connection_string
   
   # Google AI Configuration
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   
   # Firebase Configuration (if using Firebase)
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:9002](http://localhost:9002)

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server on port 9002
npm run genkit:dev   # Start Genkit AI development server
npm run genkit:watch # Start Genkit with file watching

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
```

## 📁 Project Structure

```
DataViewer/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout with metadata
│   │   ├── page.tsx           # Main application page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── query-wise/        # QueryWise specific components
│   │   │   ├── ai-query-tool.tsx
│   │   │   ├── data-display.tsx
│   │   │   ├── header.tsx
│   │   │   ├── manual-query-builder.tsx
│   │   │   └── query-interface.tsx
│   │   └── ui/                # Reusable UI components
│   ├── ai/                    # AI integration
│   │   ├── flows/             # AI workflow definitions
│   │   └── genkit.ts          # Genkit configuration
│   ├── hooks/                 # Custom React hooks
│   └── lib/                   # Utility functions and configurations
├── docs/                      # Documentation
└── public/                    # Static assets
```

## 🎯 Core Components

### Query Interface
- **Manual Query Builder**: Visual form for constructing SQL queries
- **AI Query Tool**: Natural language to SQL conversion
- **Table Selection**: Dropdown interface for database tables
- **Query Validation**: Real-time syntax and logic checking

### Data Display
- **Responsive Tables**: Scrollable data tables with sorting
- **Export Functionality**: Download results as CSV/Excel
- **Pagination**: Handle large datasets efficiently
- **Error Handling**: Clear error messages and recovery options

### AI Integration
- **Natural Language Processing**: Convert user intent to SQL
- **Query Optimization**: AI suggests query improvements
- **Data Validation**: Flag insufficient or invalid data requirements
- **Context Awareness**: Understand table relationships and constraints

## 🎨 Design System

QueryWise uses a carefully crafted design system with:

- **Primary Color**: Dark Blue (#3F51B5) - Stability and trust
- **Background**: Light Grey (#F5F5F5) - Clean, readable interface
- **Accent Color**: Teal (#009688) - Interactive elements
- **Typography**: Inter font family for excellent legibility
- **Icons**: Lucide React for consistent iconography

## 🔧 Configuration

### Database Setup
Configure your MySQL connection in `src/lib/db.ts`:
```typescript
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
```

### AI Configuration
Set up Google AI integration in `src/ai/genkit.ts`:
```typescript
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [docs/](docs/) folder for detailed guides
- **Issues**: Report bugs and feature requests on [GitHub Issues](https://github.com/ShreyashDahiwale/QueryWise/issues)
- **Discussions**: Join the conversation on [GitHub Discussions](https://github.com/ShreyashDahiwale/QueryWise/discussions)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [React](https://reactjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- AI powered by [Google AI](https://ai.google.dev/) and [Genkit](https://genkit.ai/)
- Icons from [Lucide React](https://lucide.dev/)

---

**Made with ❤️ for better database interactions**
