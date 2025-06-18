import { ArrowRight, ExternalLink, Github } from 'lucide-react'
import React from 'react'

const projects = [
  {
    id: 1,
    title: "Workspacing",
    description: "A full-stack productivity platform for personal and team workspaces with AI-powered task suggestions.",
    image: "/projects/workspacing.png",
    tags: ["Next.js", "Tailwind CSS", "Node.js", "PostgreSQL", "OpenAI API", "Prisma"],
    demoUrl: "https://workspacing.vercel.app",
    githubUrl: "https://github.com/NhungNguyen04/Workspacing"
  },
  {
    id: 2,
    title: "Authentication",
    description: "My own auth toolkit with reuseable components, hooks and utils to use auth in server & client components, api routes and server actions. ",
    image: "/projects/authentication.png",
    tags: ["Next.js", "Node.js", "PostgreSQL", "Prisma"],
    demoUrl: "https://nhung-authentication.vercel.app",
    githubUrl: "https://github.com/NhungNguyen04/Authentication"
  },
  {
    id: 3,
    title: "Clothing Shop",
    description: "An ecommerce platform with website and mobile app for selling and buying clothes.",
    image: "/projects/clothing.png",
    tags: ["ReactJS", "Tailwind CSS", "React Native", "Nest.js", "PostgreSQL", "Prisma"],
    demoUrl: "https://nh-clothing.netlify.app/",
    githubUrl: "https://github.com/NhungNguyen04/Clothing-Shop-Main"
  },
  {
    id: 4,
    title: "Vonders",
    description: "A web-based platform to explore Vietnam’s most iconic destinations, cultural events, and travel tours. ",
    image: "/projects/vonders.jpeg",
    tags: ["NextJS", "Tailwind CSS", "Nest.js", "PostgreSQL", "Prisma"],
    demoUrl: "https://front-end-vonder.vercel.app/",
    githubUrl: "https://github.com/NhungNguyen04/Vonders-Main"
  },
]

const Projects = () => {
  return (
    <section id="projects" className='py-24 px-4 relative'>
      <div className='container mx-auto max-w-5xl'>
        <h2 className='text-3xl md:text-4xl font-bold mb-4 text-center'> Featured {" "}
          <span className='text-primary'>
            Projects
          </span>
        </h2>

        <p className='text-center text-muted-foreground mb-12 max-w-2xl mx-auto'>
          Here are some of my recent projects. Each project showcases my skills in full-stack development, UI/UX design, and problem-solving.
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8'>
          {projects.map((project, key)=> (
            <div key={key} className='group bg-card rounded-lg shadow-xs card-hover p-4'>
              <div className='h-60 min-w-auto flex items-center justify-center overflow-hidden'>
                <img
                  src={project.image}
                  alt={project.title}
                  className='max-h-60 max-w-full object-contain mx-auto transition-transform duration-500 group-hover:scale-150'
                  style={{ background: 'transparent' }}
                />
              </div>

              <div className='p-2 my-2'>
                <div className='flex flex-wrap gap-2'>
                  {project.tags.map((tag) =>(
                    <span className='px-2 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground'>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <h3 className='text-xl font-semibold mb-1'>{project.title}</h3>
              <p className='text-muted-foreground text-sm mb-4'>{project.description}</p>
              <div className='flex justify-between items-center'>
                <div className='flex space-x-3'>
                  <a href={project.demoUrl} 
                    target="_blank"
                  className='text-foreground/80 hover:text-primary transition-colors duration-300'>
                    <ExternalLink />
                  </a>
                  <a  href={project.githubUrl} 
                    target="_blank"
                  className='text-foreground/80 hover:text-primary transition-colors duration-300'>
                    <Github />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='text-center mt-12'>
          <a href="https://github.com/NhungNguyen04"
            target="_blank"
            className='cosmic-button w-fit flex items-center mx-auto gap-2'>
            Check My Github <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  )
}

export default Projects
