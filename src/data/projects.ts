export interface Project {
  id: string
  name: string
  description: string
  image: string
  demoLink?: string
  deployedLink?: string
  githubLink?: string
  techStack: string[]
  featured?: boolean
  category: string
}

export const projects: Project[] = [
  {
    id: "1",
    name: "E-Commerce Platform",
    description:
      "A full-stack e-commerce platform with real-time inventory management, payment processing, and admin dashboard. Built with modern web technologies for optimal performance.",
    image: "/modern-e-commerce-platform-interface.jpg",
    deployedLink: "https://www.edustarr.in/",
    githubLink: "https://github.com/username/ecommerce",
    techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Stripe", "Tailwind CSS"],
    featured: true,
    category: "Full Stack",
  },
  {
    id: "2",
    name: "AI Chat Application",
    description:
      "Real-time chat application with AI-powered responses, message encryption, and file sharing capabilities. Supports multiple chat rooms and user authentication.",
    image: "/ai-chat-interface.png",
    deployedLink: "https://aichat.example.com",
    githubLink: "https://github.com/username/ai-chat",
    techStack: ["React", "Node.js", "Socket.io", "OpenAI API", "MongoDB"],
    featured: true,
    category: "AI/ML",
  },
  {
    id: "3",
    name: "Task Management Dashboard",
    description:
      "Collaborative task management tool with drag-and-drop functionality, team collaboration features, and real-time updates.",
    image: "/task-management-dashboard.png",
    demoLink: "https://demo-tasks.example.com",
    githubLink: "https://github.com/username/task-manager",
    techStack: ["Vue.js", "Express.js", "MySQL", "Socket.io", "Chart.js"],
    category: "Productivity",
  },
  {
    id: "4",
    name: "Weather Analytics App",
    description:
      "Weather forecasting application with detailed analytics, historical data visualization, and location-based predictions.",
    image: "/weather-analytics-app-interface.jpg",
    deployedLink: "https://weather.example.com",
    techStack: ["React Native", "TypeScript", "Weather API", "D3.js"],
    category: "Mobile",
  },
  {
    id: "5",
    name: "Portfolio Website",
    description:
      "Personal portfolio website with 3D animations, interactive elements, and responsive design. Features project showcase and contact form.",
    image: "/modern-portfolio-3d.png",
    deployedLink: "https://portfolio.example.com",
    githubLink: "https://github.com/username/portfolio",
    techStack: ["Next.js", "Three.js", "Framer Motion", "Tailwind CSS"],
    featured: true,
    category: "Frontend",
  },
  {
    id: "6",
    name: "Blockchain Voting System",
    description:
      "Decentralized voting platform built on blockchain technology ensuring transparency, security, and immutable vote records.",
    image: "/blockchain-voting-system-interface.jpg",
    githubLink: "https://github.com/username/blockchain-voting",
    techStack: ["Solidity", "Web3.js", "React", "Ethereum", "MetaMask"],
    category: "Blockchain",
  },
]

export const categories = ["All", "Full Stack", "Frontend", "AI/ML", "IoT", "Blockchain", "Productivity"]
