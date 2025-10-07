"use client"

import React, { useState, useEffect, useRef, FormEvent } from "react"

// --- Helper Components (Refactored for explicit typing) ---

// Prop types for ContactIcon
type ContactIconProps = {
  children: React.ReactNode;
};

// Icon component for contact links
const ContactIcon: React.FC<ContactIconProps> = ({ children }) => (
    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors duration-300 group-hover:border-black dark:border-gray-800 dark:bg-gray-900 dark:group-hover:border-white">
        {children}
    </span>
);

// Prop types for ContactLink
type ContactLinkProps = {
  href: string;
  icon: React.ReactElement;
  label: string;
};

// Reusable component for contact links to keep the main component clean
const ContactLink: React.FC<ContactLinkProps> = ({ href, icon, label }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="group flex items-center gap-4 text-gray-600 transition-colors duration-300 hover:text-black dark:text-gray-400 dark:hover:text-white"
    >
        <ContactIcon>{icon}</ContactIcon>
        <span>{label}</span>
    </a>
);


// --- Main HireMeSection Component ---

export default function HireMeSection() {
    const [currentTime, setCurrentTime] = useState("");
    const form = useRef<HTMLFormElement>(null);
    const [formStatus, setFormStatus] = useState({ state: 'idle', message: '' }); // idle, sending, success, error

    // Effect to update the local time every second
    useEffect(() => {
        const timer = setInterval(() => {
            const time = new Date().toLocaleTimeString("en-US", {
                timeZone: "Asia/Kolkata",
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            setCurrentTime(time);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Form submission handler
    const sendEmail = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!form.current) return;

        const emailjs = (window as any).emailjs;
        if (!emailjs) {
            console.error('EmailJS script has not loaded.');
            setFormStatus({ state: 'error', message: 'Email service is unavailable. Please try again later.' });
            return;
        }
        
        setFormStatus({ state: 'sending', message: '' });

        // --- IMPORTANT: Replace with your actual EmailJS credentials ---
        const serviceID = 'service_9jqt0x5';
        const templateID = 'template_8akoa7q';
        const publicKey = 'XhINMEscCAVwBRhkl';
        // -------------------------------------------------------------

        emailjs.sendForm(serviceID, templateID, form.current, publicKey)
            .then(() => {
                setFormStatus({ state: 'success', message: 'Message sent! I will get back to you soon.' });
                form.current?.reset();
                setTimeout(() => setFormStatus({ state: 'idle', message: '' }), 5000); // Reset after 5 seconds
            }, (error: any) => {
                console.error('EmailJS Error:', error);
                setFormStatus({ state: 'error', message: 'Failed to send the message. Please try again.' });
            });
    };
    
    // Data for contact links to make it easier to manage
    const contactDetails = [
        { href: "mailto:hrushikeshsarangi7@gmail.com", label: "hrushikeshsarangi7@gmail.com", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> },
        { href: "https://www.linkedin.com/in/hrushikesh-anand-sarangi-645b02269/", label: "LinkedIn", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> },
        { href: "https://github.com/HrushikeshAnandSarangi", label: "GitHub", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg> }
    ];

    return (
        <section id="contact" className="bg-white text-black top-48">
            <div className="mx-auto max-w-4xl px-6 py-20 md:py-28">
                <header className="mb-16 text-center">
                    <h2 id="contact-heading" className="text-pretty text-3xl font-bold tracking-tight md:text-4xl">
                        Get In Touch
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-pretty text-lg text-gray-600 dark:text-gray-400">
                        Have a project in mind, a question, or just want to connect? I'm always open to discussing new opportunities.
                    </p>
                </header>

                <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
                    {/* Left Column: Contact Info */}
                    <div className="space-y-8">
                        {contactDetails.map(detail => <ContactLink key={detail.label} {...detail} />)}

                        <div className="flex items-center gap-4 pt-4 text-gray-600 dark:text-gray-400">
                            <ContactIcon>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            </ContactIcon>
                            <div>
                                Rourkela, Odisha, India
                                <span className="block text-sm text-gray-500">{currentTime}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <form ref={form} onSubmit={sendEmail} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="user_name" className="text-sm font-medium">Full Name</label>
                            <input type="text" id="user_name" name="user_name" required className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-base text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-white" />
                        </div>
                         <div className="space-y-2">
                            <label htmlFor="user_email" className="text-sm font-medium">Email Address</label>
                            <input type="email" id="user_email" name="user_email" required className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-base text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-white" />
                        </div>
                         <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium">Message</label>
                            <textarea id="message" name="message" rows={4} required className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-base text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-white"></textarea>
                        </div>
                        <button 
                            type="submit" 
                            disabled={formStatus.state === 'sending'}
                            className="w-full rounded-md bg-black px-6 py-3 text-base font-semibold text-white shadow-sm ring-1 ring-inset ring-white/20 transition-all duration-300 hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:bg-gray-500 dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:focus-visible:outline-black dark:disabled:bg-gray-400"
                        >
                            {formStatus.state === 'sending' ? 'Sending...' : 'Send Message'}
                        </button>
                        {formStatus.state !== 'idle' && (
                            <p className={`mt-4 text-sm text-center ${formStatus.state === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                                {formStatus.message}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </section>
    )
}

