import { Facebook, Linkedin, Mail, MapPin, Phone, Send } from 'lucide-react'
import React from 'react'
import { cn } from '../lib/utils'

const Contact = () => {

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      alert("Thank you for your message! I'll get back to you soon.");
      e.target.reset();
      setIsSubmitting(false);
    }, 1500);
  }
  return (
    <section id="contact" className='py-24 px-4 relative bg-secondary/30'>
      <div className='container mx-auto max-w-5xl'>
        <h2 className='text-3xl md:text-4xl font-bold mb-4 text-center'>
          Get In <span className='text-primary'>{" "} Touch</span>
        </h2>

        <p className='text-center text-muted-foreground mb-12 max-w-2xl mx-auto'>
          Feel free to reach out, I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
        </p>

        <div className='grid gid-cols-1 md:grid-cols-2 gap-12'>
          <div className='space-y-8 '>
            <h3 className='text-2xl font-semibold mb-6'>Contact Information</h3>
            <div className='space-y-6 justify-center'>
              <div className='flex items-start space-x-4'>
                <div className='p-3 rounded-full bg-primary/10 '>
                  <Mail className='h-6 w-6 text-primary' /> { " "}
                </div>
                <div className='flex items-start flex-col'>
                  <h4 className='font-medium'>Email</h4>
                  <a href="mailto:nguyennhungforwork04@gmail.com" className='text-muted-foreground hover:text-primary transition-colors'>
                    nguyennhungforwork04@gmail.com
                  </a>
                </div>
              </div>

              <div className='flex items-start space-x-4'>
                <div className='p-3 rounded-full bg-primary/10 '>
                  <Phone className='h-6 w-6 text-primary' /> { " "}
                </div>
                <div className='flex items-start flex-col'>
                  <h4 className='font-medium'>Phone</h4>
                  <a href="tel:+84376396233" className='text-muted-foreground hover:text-primary transition-colors'>
                    +84 376 396 233
                  </a>
                </div>
              </div>

              <div className='flex items-start space-x-4'>
                <div className='p-3 rounded-full bg-primary/10 '>
                  <MapPin className='h-6 w-6 text-primary' /> { " "}
                </div>
                <div className='flex items-start flex-col'>
                  <h4 className='font-medium'>Location</h4>
                  <a className='text-muted-foreground hover:text-primary transition-colors'>
                    Ho Chi Minh City, Vietnam
                  </a>
                </div>
              </div>
            </div>

            <div className='pt-8'>
              <h4 className='mb-4'>Connect With Me</h4>
              <div className='flex space-x-4 justify-center'>
                <a href="https://www.linkedin.com/in/nhungularity" target="_blank" rel="noopener noreferrer">
                  <Linkedin />
                </a>
                <a href="https://www.facebook.com/nhungularity/" target="_blank" rel="noopener noreferrer">
                  <Facebook />
                </a>    
                <a
                  href="https://discord.com/users/nhunx"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Connect on Discord"
                >
                  <img src="/Discord-Symbol-White.png" alt="Discord" className='h-6 w-6' />
                </a>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-2">
                Discord: <span className="font-mono bg-muted px-2 py-1 rounded">Nhunx</span>
              </p>
            </div>
          </div>
          <div className='bg-card p-8 rounded-lg shadow-xs'>
              <h3 className='text-2xl font-semibold mb-6'>
                Send a Message
              </h3>

              <form action="" className='space-y-4' onSubmit={handleSubmit}>
                <div className='space-y-2 flex flex-col items-start'>
                  <label htmlFor="name" className='block text-md font-medium mb-2'>Your Name</label>
                  <input type="text" id="name" name="name" 
                  required 
                  className='w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary'
                  placeholder='Nhung Nguyen'/>
                </div>
                <div className='space-y-2 flex flex-col items-start'>
                  <label htmlFor="email" className='block text-md font-medium mb-2'>Your Email</label>
                  <input type="email" id="email" name="email" 
                  required 
                  className='w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary'
                  placeholder='youremail@mail.com'/>
                </div>
                 <div className='space-y-2 flex flex-col items-start'>
                  <label htmlFor="message" className='block text-md font-medium mb-2'>Your Message</label>
                  <textarea type="message" id="message" name="message" 
                  required 
                  className='w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary'
                  placeholder="Hello, I'd like to talk about..."/>
                </div>

                <button type='submit' disabled={isSubmitting}
                className={cn("cosmic-button pt-2 w-full flex items-center justify-center gap-2")}>
                  {isSubmitting ? "Loading" : "Send Message"}
                  <Send size={16}/>
                </button>
              </form>
            </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
