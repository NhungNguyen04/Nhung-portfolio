'use client';

import { Facebook, Linkedin, Mail, MapPin, Phone, Send } from 'lucide-react';
import React from 'react';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/languageContext';

const Contact = () => {
  const { messages } = useLanguage();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  interface ContactFormElements extends HTMLFormControlsCollection {
    name: HTMLInputElement;
    email: HTMLInputElement;
    message: HTMLTextAreaElement;
  }

  interface ContactForm extends HTMLFormElement {
    readonly elements: ContactFormElements;
  }

  const handleSubmit = (e: React.FormEvent<ContactForm>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      alert(messages.contact.form.submit);
      e.currentTarget.reset();
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 px-4 relative bg-secondary/30">
      <div className="container mx-auto max-w-5xl">
       <h2 className='text-3xl md:text-4xl font-bold mb-4 text-center'>  {messages.contact.getin + " "}
          <span className='text-primary'>
            {messages.contact.touch}
          </span>
        </h2>

        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          {messages.contact.description}
        </p>

        <div className="grid gid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold mb-6">
              {messages.contact.information.title}
            </h3>
            <div className="space-y-6 justify-center">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div className="flex items-start flex-col">
                  <h4 className="font-medium">
                    {messages.contact.information.email.label}
                  </h4>
                  <a
                    href={`mailto:${messages.contact.information.email.value}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {messages.contact.information.email.value}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div className="flex items-start flex-col">
                  <h4 className="font-medium">
                    {messages.contact.information.phone.label}
                  </h4>
                  <a
                    href={`tel:${messages.contact.information.phone.value}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {messages.contact.information.phone.value}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div className="flex items-start flex-col">
                  <h4 className="font-medium">
                    {messages.contact.information.location.label}
                  </h4>
                  <span className="text-muted-foreground hover:text-primary transition-colors">
                    {messages.contact.information.location.value}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <h4 className="mb-4">{messages.contact.connect.title}</h4>
              <div className="flex space-x-4 justify-center">
                <a
                  href={messages.contact.connect.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin />
                </a>
                <a
                  href={messages.contact.connect.links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook />
                </a>
                <a
                  href={messages.contact.connect.links.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Connect on Discord"
                >
                  <img
                    src="/Discord-Symbol-White.png"
                    alt="Discord"
                    className="h-6 w-6"
                  />
                </a>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-2">
                {messages.contact.connect.discord.label}:{" "}
                <span className="font-mono bg-muted px-2 py-1 rounded">
                  {messages.contact.connect.discord.value}
                </span>
              </p>
            </div>
          </div>
          <div className="bg-card p-8 rounded-lg shadow-xs">
            <h3 className="text-2xl font-semibold mb-6">
              {messages.contact.form.title}
            </h3>

            <form action="" className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2 flex flex-col items-start">
                <label
                  htmlFor="name"
                  className="block text-md font-medium mb-2"
                >
                  {messages.contact.form.fields.name}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary"
                  placeholder={messages.contact.form.placeholder.name}
                />
              </div>
              <div className="space-y-2 flex flex-col items-start">
                <label
                  htmlFor="email"
                  className="block text-md font-medium mb-2"
                >
                  {messages.contact.form.fields.email}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary"
                  placeholder={messages.contact.form.placeholder.email}
                />
              </div>
              <div className="space-y-2 flex flex-col items-start">
                <label
                  htmlFor="message"
                  className="block text-md font-medium mb-2"
                >
                  {messages.contact.form.fields.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary"
                  placeholder={messages.contact.form.placeholder.message}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "cosmic-button pt-2 w-full flex items-center justify-center gap-2 hover:cursor-pointer"
                )}
              >
                {isSubmitting
                  ? messages.contact.form.loading
                  : messages.contact.form.submit}
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
