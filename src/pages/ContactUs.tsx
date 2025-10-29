import React, { useState } from 'react';
import { Mail, Phone, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabase'; // Import Supabase client

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      message: formData.message,
    };

    try {
      const { data, error } = await supabase.functions.invoke('contact-form', {
        body: JSON.stringify(payload),
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.success) {
         setSubmitStatus('success');
         setSubmitMessage(data.message || 'Message sent successfully!');
         setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
         throw new Error(data?.error || 'An unknown error occurred.');
      }

    } catch (error: any) {
      console.error("Error submitting contact form:", error);
      setSubmitStatus('error');
      setSubmitMessage(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12 md:py-16">
        
        {/* Title and Subtitle */}
        <div className="text-center mb-10 md:mb-16 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">How can we help you?</h1>
          <p className="text-slate-600 text-lg">
           Thanks for your interest in Constructgraphy. Fill out this form and our team will reach out to you as soon as we can.
          </p>
        </div>

        {/* Wrapper to constrain the width of the two-column section */}
        <div className="w-full max-w-5xl mx-auto">
          {/* Two Column Layout: Contact Info | Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            
            {/* Left Column: Contact Info */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-amber-100 h-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?auto=format&fit=crop&w=1000&q=80" 
                alt="Contact support" 
                className="w-full h-48 object-cover" 
              />
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-semibold mb-0 text-slate-800">Ways to reach us</h2>
                <p className="text-slate-600 mb-8">
                  Prefer to reach out directly? Find our contact details below.
                </p>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-slate-700">Email Us</h3>
                      <a href="mailto:info@constructgraphy.com" className="text-primary hover:underline">
                        info@constructgraphy.com {/* Replace with actual email */}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                     <div className="bg-orange-100 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-slate-700">Call Us</h3>
                      <span className="text-primary"> +1 4038379654</span> {/* Replace with actual phone */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form Box */}
            <div className="w-full border border-slate-200 rounded-lg p-6 md:p-8 shadow-sm bg-white h-full">
              <h2 className="text-2xl font-semibold mb-6 text-slate-800">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    name="name"
                    type="text" 
                    placeholder="Your Name" 
                    value={formData.name}
                    onChange={handleChange}
                    required 
                    className="bg-slate-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="your.email@example.com" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                    className="bg-slate-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone Number <span className="text-slate-500 text-xs">(Optional)</span></Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    type="tel" 
                    placeholder="(123) 456-7890"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-slate-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    name="message"
                    placeholder="How can we help you?" 
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="bg-slate-50"
                  />
                </div>
                
                {/* Submission Status Feedback */}
                {submitStatus === 'success' && (
                  <div className="flex items-center gap-2 text-green-700 p-3 bg-green-100 rounded-md border border-green-200 text-sm">
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    <p>{submitMessage}</p>
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-700 p-3 bg-red-100 rounded-md border border-red-200 text-sm">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p>{submitMessage}</p>
                  </div>
                )}

                <Button type="submit" disabled={isSubmitting} className="w-full text-base py-3">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

          </div>
        </div>
        
        {/* Removed contact info from bottom */}

      </div>
    </PublicLayout>
  );
};

export default ContactUs; 