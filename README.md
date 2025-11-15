# TOON Exchange

A professional format exchange platform for modern developers. Convert and optimize data formats with real-time token analysis.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

## 🌟 Features

### Token Savings Calculator
- 🎯 **Real-time Token Counting**: Instantly see token counts for both JSON and TOON formats
- 💰 **Cost Estimation**: Calculate actual cost savings based on 100+ LLM models from [llm-prices.com](https://www.llm-prices.com)
- 📊 **Visual Comparison**: Beautiful charts and metrics showing your savings
- 🎨 **Monochrome Design**: Clean, professional UI with TOON brand colors (beige & navy)
- 🔒 **Privacy-First**: All processing happens in your browser - no data sent to servers
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- ⚡ **Fast**: Built with Next.js 16 and optimized for performance

### Format Playground
- 🔄 **Bidirectional Conversion**: Convert between JSON, TOON, CSV, YAML, and XML
- 📈 **Token Analysis**: Real-time token counting for all conversions
- 📤 **File Upload**: Drag & drop or upload files directly
- 💾 **Copy to Clipboard**: Easy export of converted formats

### LLM Pricing Comparison
- 📊 **100+ Models**: Compare pricing across all major LLM providers
- 🔍 **Search & Filter**: Quickly find the model you need
- 💵 **Real-time Data**: Pricing data from [llm-prices.com](https://www.llm-prices.com)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, pnpm, or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/markingo/toonexchange.git
cd toonexchange

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Build for Production

```bash
npm run build
npm start
```

## 📖 Usage

### Token Savings Calculator

1. **Select an LLM Model** from the dropdown (defaults to GPT-5.1)
2. **Paste your JSON data** into the input area
3. **Click "Calculate Savings"** to convert to TOON format
4. **View the results** showing token savings and cost comparison
5. **Copy the TOON output** to use in your LLM prompts

### Format Playground

1. **Select source and target formats** (JSON, TOON, CSV, YAML, XML)
2. **Enter or upload your data**
3. **Click "Convert"** to see the result
4. **View token analysis** to see the difference
5. **Copy the output** for use in your application

## 🎨 Design Philosophy

TOON Exchange uses a **monochrome-first** design approach:

- **Base**: Clean black/white/gray foundation
- **Accents**: TOON brand colors (beige `#F5E6D3` and navy `#1B3A5C`) used strategically
- **Semantic Colors**: Green for savings, red for costs
- **Dark Mode**: Full support with proper contrast

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **TOON Library**: [@toon-format/toon](https://github.com/toon-format/toon)
- **Token Counting**: [js-tiktoken](https://github.com/dqbd/tiktoken)

## 📚 About TOON

Token-Oriented Object Notation (TOON) is a compact, human-readable format designed to reduce token usage by 30-60% when passing structured data to Large Language Models.

**Key Benefits:**
- ⚡ **Efficient**: Tabular format eliminates repeated keys
- 📖 **Readable**: Human-friendly, YAML-like structure
- 🔒 **Schema-Aware**: Explicit array lengths and field headers

Learn more at [github.com/toon-format/toon](https://github.com/toon-format/toon)

## 🌐 Deployment

The easiest way to deploy this application is using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/markingo/toonexchange)

Or deploy manually:

```bash
npm run build
```

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 👤 Author

**Mark Mate**

- LinkedIn: [@mark-mate](https://linkedin.com/in/mark-mate)
- GitHub: [@markingo](https://github.com/markingo)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 🙏 Acknowledgments

- Built with [TOON](https://github.com/toon-format/toon)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Pricing data from [llm-prices.com](https://www.llm-prices.com)
- Icons from [Lucide](https://lucide.dev/)

## 📊 Project Status

✅ **Active Development** - The project is actively maintained and accepting contributions.

---

Made with ❤️ by [Mark Mate](https://linkedin.com/in/mark-mate)
