import React from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PublicLayout from "@/components/layout/PublicLayout";

// Unsplash image URLs (construction theme)
const imageUrls = [
  "https://images.unsplash.com/photo-1581094481202-5a3a4f168f58?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1541888946425-d81bb198406a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1487483111193-fd7478e5054e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519791869930-236a56d99045?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600573472591-ee6b68d14c49?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1558626121-ce3f441a4d68?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1574948819059-380792c83045?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1473968525850-9a7f4f798935?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
];

const AboutUs: React.FC = () => {
  return (
    <PublicLayout>
      <>
        <section className="w-full py-12 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="md:order-2">
              <p className="text-slate-600 text-lg">
                At Constructgraphy, we're redefining the home-building experience by bringing homeowners closer to the construction process. We believe that the journey of building a home should be as exciting as the final result. 
                With our platform, you can stay connected to every brick laid, every wall raised, and every finishing touch—all through regular photo updates right at your fingertips.
              </p>
            </div>
            <div className="md:order-1">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
                DREAM IT. BUILD IT. CAPTURE IT.
              </h1>
            </div>
          </div>
        </section>

        {/* Full-Width Structured Image Grid Section - Now edge-to-edge */}
        <section className="w-full">
          {/* Using CSS Grid to replicate the specific layout */}
          {/* Grid spans full width, gap creates spacing */}
          {/* Added max-h and overflow-hidden to control height */}
          <div className="grid grid-cols-3 grid-rows-2 gap-4 max-h-[600px] overflow-hidden">
            {/* Image 1 (Tall Left) */}
            <div className="row-span-2">
              <img 
                src="/images/about/gallery/grid-img-1.jpg" 
                alt="Construction workers collaborating" 
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
            {/* Image 2 (Top Middle) */}
            <div>
              <img 
                src="/images/about/gallery/grid-img-2.jpg" 
                alt="Building foundation" 
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
            {/* Image 3 (Top Right) */}
            <div>
              <img 
                src="/images/about/gallery/grid-img-3.jpg" 
                alt="Concrete wall structure" 
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
            {/* Image 4 (Bottom Middle) */}
            <div>
               <img 
                 src="/images/about/gallery/grid-img-4.jpg" 
                 alt="Construction team reviewing plans" 
                 className="rounded-lg object-cover w-full h-full"
               />
            </div>
            {/* Image 5 (Bottom Right - seems missing in the provided screenshot but exists in Figma) */}
            {/* If image 5 is the tall right one, adjust grid spans */}
            {/* Assuming it fits bottom right based on Figma structure */}
            <div>
              <img 
                src="/images/about/gallery/grid-img-5.jpg" 
                alt="Construction blueprint review" 
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
            {/* Image 6 - seems out of place or maybe overlaps? 
               Let's place it for now, adjust if needed. 
               Could potentially be the tall right image if grid-img-5 is wrong one */}
            {/* <img src="/images/about/gallery/grid-img-6.jpg" alt="Frame detail" className="rounded-lg object-cover w-full h-full"/> */}
            
          </div>
        </section>

        <section className="w-full bg-gradient-to-r from-orange-600 to-purple-800 text-white py-16 md:py-24 mt-12 rounded-lg">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">Empowering transparency</h2>
            <p className="text-lg">
              Our mission to empower homeowners with transparency and peace of mind as they watch their dream home come to life. We're committed to capturing the details, big and small, so you can feel engaged and informed at every stage of construction.
            </p>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 md:pb-8 flex flex-col md:flex-row md:gap-20">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <div className="mb-6">
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 mb-4">
                Our Story
              </Badge>
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4">
                Constructgraphy was born out of a passion for transparency and connection in the home-building journey.
              </h2>
              <p className="text-slate-600">
                Founded on the principle of preserving memories and showcasing excellence, Constructgraphy bridges the gap between construction and visual storytelling. Our passion is to provide home builders and homeowners with stunning visuals that highlight their projects' transformation. When our founders built their own home, they felt disconnected from the progress happening on-site. This experience sparked a vision: what if every homeowner could receive timely updates on their home's progress from anywhere in the world? And so, Constructgraphy was created to make that vision a reality.
              </p>
            </div>
          </div>
          <div className="md:w-1/2 grid grid-cols-1 gap-8">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 flex-shrink-0 bg-orange-100 rounded-lg flex items-center justify-center">
                <img src="/images/about/icon-transparency.svg" alt="Transparency" className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">Transparency</h3>
                <p className="text-slate-600">Keeping you informed every step of the way.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 flex-shrink-0 bg-orange-100 rounded-lg flex items-center justify-center">
                <img src="/images/about/icon-quality.svg" alt="Quality" className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">Quality</h3>
                <p className="text-slate-600">Delivering high-resolution, professional photos you can rely on.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 flex-shrink-0 bg-orange-100 rounded-lg flex items-center justify-center">
                <img src="/images/about/icon-customer.svg" alt="Customer-Centricity" className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">Customer-Centricity</h3>
                <p className="text-slate-600">Ensuring that you're at the heart of every update and interaction.</p>
              </div>
            </div>
          </div>
        </section>

        {/* What Sets Us Apart Section - Updated Layout */}
        <section className="w-full py-16 md:py-24">
          {/* Text Content Centered */}
          <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 mb-4">
              What Sets Us Apart
            </Badge>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
              We're not just a photo-sharing platform
            </h2>
            <p className="text-slate-600">
              it's a seamless experience designed around your peace of mind. From our frequent, high-quality photo updates to our user-friendly platform, everything we do is centered on providing you with clarity and confidence. You'll always know where things stand and can share updates with family and friends, making the journey a shared experience.
            </p>
          </div>
          
          {/* Combined Container with Dark Background */}
          <div className="bg-slate-900 rounded-lg text-white p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left Column: Checklist (no background needed) */}
              <div className="flex flex-col justify-center">
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-lg">Transparency</h3>
                      <p className="text-slate-300">Keeping you informed every step of the way.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-lg">Quality</h3>
                      <p className="text-slate-300">Delivering high-resolution, professional photos you can rely on.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-lg">Customer-Centricity</h3>
                      <p className="text-slate-300">Ensuring that you're at the heart of every update and interaction.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column: Image (consider removing rounding if container is rounded) */}
              <div className="flex items-center justify-center">
                <img 
                  src="/images/about/what-sets-us-apart.jpg" 
                  alt="Construction site progress" 
                  className="rounded-lg object-cover w-full h-full max-h-[400px] md:max-h-full" 
                  // Consider removing rounded-lg from image if container rounding is sufficient
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full bg-gray-50 py-16 md:py-24 rounded-lg">
          <div className="container mx-auto px-4 md:max-w-screen-xl">
            <div className="text-center mb-16">
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 mb-4">
                How Constructgraphy works
              </Badge>
              <h2 className="text-3xl md:text-4xl font-semibold mb-6">Simplifying Your Project Management.</h2>
              <p className="text-slate-600 max-w-3xl mx-auto">
                Our team captures high-quality photos at key stages of construction and uploads them to your personal account. All you need to do is log in to see the latest updates. You'll receive notifications whenever new photos are available, making it easy to stay connected.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="w-full aspect-video rounded-lg overflow-hidden mb-6 bg-slate-300">
                  <img src="/images/about/capture-photos.jpg" alt="Capture Photos" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-bold text-purple-800 text-center">Captures high-quality photos at key stages</h3>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-full aspect-video rounded-lg overflow-hidden mb-6 bg-slate-300">
                  <img src="/images/about/upload-account.jpg" alt="Upload to Account" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-bold text-purple-800 text-center">Uploads them to your personal account</h3>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-full aspect-video rounded-lg overflow-hidden mb-6 bg-slate-300">
                  <img src="/images/about/receive-notifications.jpg" alt="Receive Notifications" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-bold text-purple-800 text-center">Receive notifications whenever new photos</h3>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section - Inherits container from PublicLayout */}
        <section className="w-full py-16 md:py-24">
          <div className="text-center mb-12 md:mb-16">
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 mb-4">
              FAQs
            </Badge>
            {/* Added max-w-2xl mx-auto to constrain heading width */}
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 max-w-2xl mx-auto">
              Explore Our Frequently Asked Questions for Quick Answers and Support.
            </h2>
          </div>
          
          {/* Reverting to show the FAQ banner image */}
          <div className="mb-12 md:mb-16">
             <img 
               src="/images/about/faq-banner.jpg" 
               alt="FAQ Banner" 
               className="rounded-2xl object-cover w-full h-auto max-h-[200px] md:max-h-[500px]" 
             />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-b">
                  <AccordionTrigger className="text-left font-medium">How often are construction photos updated?</AccordionTrigger>
                  <AccordionContent>
                    Photos are typically updated bi-weekly or at major milestones to show the progress on your home.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border-b">
                  <AccordionTrigger className="text-left font-medium">How will I know when new photos are available?</AccordionTrigger>
                  <AccordionContent>
                    You'll receive an email notification whenever new updates are added.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border-b">
                  <AccordionTrigger className="text-left font-medium">What stages of construction will be shown?</AccordionTrigger>
                  <AccordionContent>
                    We capture all major stages from foundation to finishing touches, including framing, roofing, electrical, plumbing, drywall, and interior finishes.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4" className="border-b">
                  <AccordionTrigger className="text-left font-medium">Are the photos real-time?</AccordionTrigger>
                  <AccordionContent>
                    Photos are not real-time but are uploaded promptly after they're taken, typically within 24-48 hours of a site visit.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5" className="border-b">
                  <AccordionTrigger className="text-left font-medium">Can I download or share these photos?</AccordionTrigger>
                  <AccordionContent>
                    Yes! All photos can be downloaded and shared with family and friends. You own the rights to photos of your project.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6" className="border-b">
                  <AccordionTrigger className="text-left font-medium">What if I notice a problem in the photos?</AccordionTrigger>
                  <AccordionContent>
                    You can leave comments on specific photos and contact your builder or our support team directly through the platform.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-7" className="border-b">
                  <AccordionTrigger className="text-left font-medium">How secure is my photo access?</AccordionTrigger>
                  <AccordionContent>
                    Your project photos are secured with encryption and accessible only to you and your designated team members with proper credentials.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-8" className="border-b">
                  <AccordionTrigger className="text-left font-medium">Who takes the photos?</AccordionTrigger>
                  <AccordionContent>
                    Depending on your package, photos are taken by either your builder's team or our professional photographers who specialize in construction photography.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className="col-span-1 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 flex flex-col items-start justify-center">
              <h3 className="text-2xl font-bold text-orange-800 mb-4">Ready to See Your Project Come to Life?</h3>
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white">
                <Link to="/login">Get Started</Link>
              </Button>
            </div>
          </div>
        </section>
      </>
    </PublicLayout>
  );
};

export default AboutUs; 