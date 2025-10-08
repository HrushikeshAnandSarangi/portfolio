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
    name: "Smart Sentry",
    description:
      "Anomally detector with consideration for startup , shutdown and steady state for Industry grade machines like Turbofan Engine Degradation , deployed on edge device.",
    image: "https://res.cloudinary.com/dk6m1qejk/image/upload/v1759924366/microcontroller_uxyr9a.jpg",
    demoLink:"https://youtu.be/_kz0JfCGYlo",
    githubLink: "https://github.com/HrushikeshAnandSarangi/SmartSentry",
    techStack: ["Grafana", "MQTT", "Autoencoders", "PostgreSQL", "Raspberry Pi", "Nginx","Docker"],
    featured: true,
    category: "Iot",
  },
  {
    id: "2",
    name: "Sahay AI",
    description:
      "Full Stack application for demistifying legal documents.",
    image: "https://res.cloudinary.com/dk6m1qejk/image/upload/v1758738301/Screenshot_2025-09-24_235428_vs4s3c.png",
    deployedLink: "https://sahayai-23401246568.europe-west1.run.app/",
    githubLink: "https://github.com/HrushikeshAnandSarangi/SahayAI",
    techStack: ["Next.js","Google Cloud Run","Gemini API","FastApi","Langchain","Docker"],
    featured: true,
    category: "AI/ML",
  },
  {
    id: "3",
    name: "MetaFin",
    description:
      "Jargon free financial assistant application. ",
    image: "https://res.cloudinary.com/dk6m1qejk/image/upload/v1759924182/Screenshot_2025-10-08_171839_zz7fnl.png",
    githubLink: "https://github.com/HrushikeshAnandSarangi/Project_MetaFin",
    techStack: ["Next.js","Django","Gemini API","Reddit API","Kubernetes","Docker","OpenAi API"],
    category: "FullStack",
  },
  {
    id: "4",
    name: "EduStarr",
    description:
      "Personal Business application for a client.",
    image: "https://res.cloudinary.com/dk6m1qejk/image/upload/v1758737936/Screenshot_2025-09-24_234328_xhygk9.png",
    deployedLink: "https://www.edustarr.in/",
    techStack: ["Next.js","PhonePe Payments","Supabase","Tailwindcss"],
    category: "Full Stack",
  },
  {
    id: "5",
    name: "Mechanical Portfolio",
    description:
      "Personal Portfolio for a Mechanical engineer.",
    image: "https://res.cloudinary.com/dk6m1qejk/image/upload/v1758738510/Screenshot_2025-09-24_235747_cvqvza.png",
    deployedLink: "https://mechanical-portfolio-xi.vercel.app/",
    githubLink: "https://github.com/HrushikeshAnandSarangi/mechanical_portfolio",
    techStack: ["Next.js",  "Framer Motion", "Tailwind CSS"],
    featured: true,
    category: "Frontend",
  },
  {
    id: "6",
    name: "Flashcard Frenzy",
    description:
      "A multiplayer game for students.",
    image: "https://res.cloudinary.com/dk6m1qejk/image/upload/v1758738525/Screenshot_2025-09-24_235820_hfl0mg.png",
    deployedLink:"https://flashcard-frenzy-flame.vercel.app/",
    githubLink: "https://github.com/HrushikeshAnandSarangi/Flashcard-Frenzy",
    techStack: ["Next.js","MongoDb","Supabase","socker.io","ExpressJs","Jest"],
    category: "Full Stack",
  },
  {
    id:"7",
    name:"IEEE Indiscon 2025",
    description:"Official Website for IEEE Indiscon Conference 2025.",
    image:"https://res.cloudinary.com/dk6m1qejk/image/upload/v1758738244/Screenshot_2025-09-24_235334_pu3e11.png",
    deployedLink:"https://www.ieeeindiscon.org/",
    techStack:["Next.js","tailwindcss"],
    category:"Full Stack"
  },
  
  {
    id:"8",
    name:"Indian Pluralism Foundation",
    description:"Official Website for Indian Pluralism Foundation.",
    image:"https://res.cloudinary.com/dk6m1qejk/image/upload/v1758738205/Screenshot_2025-09-24_235258_hfzc5n.png",
    deployedLink:"https://indianpluralism.org/",
    techStack:["Next.js","tailwindcss"],
    category:"Full Stack"
  },
  {
    id:"9",
    name:"ALL Detector",
    description:"Acute Lymphoblastic Leukemia Detector using GAN Based diffusion model deployed on a mobile device.",
    image:"https://res.cloudinary.com/dk6m1qejk/image/upload/v1759924366/microcontroller_uxyr9a.jpg",
    demoLink:"https://youtu.be/KLpIaKE_rCw",
    techStack:["Next.js","tailwindcss"],
    category:"IoT"
  },
]

export const categories = ["All", "Full Stack", "Frontend", "AI/ML", "IoT", "Blockchain", "Productivity"]
