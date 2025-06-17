'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/authStore';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PublicHeader from '@/components/layout/PublicHeader';
import { Calendar, FileText, Shield, Clock, Users, BarChart3 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleGetStarted = () => {
    router.push('/auth/register');
  };

  const handleLearnMore = () => {
    // Scroll to features section
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20 px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl font-poppins">
                Modern Dental Practice
                <span className="block text-primary">Management</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Streamline your dental practice with our secure, HIPAA-compliant platform.
                Manage appointments, patient records, and documents with ease.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button size="lg" className="glass-button" onClick={handleGetStarted}>
                  Get Started
                </Button>
                <Button variant="outline" size="lg" onClick={handleLearnMore}>
                  Learn More
                </Button>
              </div>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
            <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary to-accent-secondary opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-poppins">
                Everything you need to manage your practice
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Our comprehensive platform provides all the tools you need for efficient dental practice management.
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <Card className="glass-card">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-foreground">
                      Appointment Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      Streamlined booking system with real-time availability, automated reminders,
                      and easy rescheduling for both patients and staff.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-foreground">
                      Patient Records
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      Secure, encrypted patient profiles with medical history, treatment plans,
                      and comprehensive document management.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-foreground">
                      HIPAA Compliance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      Built-in security features, audit logging, and compliance tools
                      to ensure your practice meets all healthcare regulations.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-foreground">
                      Real-time Scheduling
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      Live calendar updates, instant notifications, and seamless coordination
                      between multiple dentists and treatment rooms.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-foreground">
                      Multi-user Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      Role-based permissions for dentists, hygienists, and administrative staff
                      with secure access controls and audit trails.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                      <BarChart3 className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-foreground">
                      Analytics & Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      Comprehensive insights into practice performance, patient trends,
                      and revenue analytics to help grow your business.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 sm:py-32 bg-secondary/20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-poppins">
                Choose the perfect plan for your practice
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Flexible pricing options designed to grow with your dental practice.
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {/* Starter Plan */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-foreground">
                      Starter
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Perfect for small practices getting started
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-foreground">$49</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                        Up to 100 patients
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                        Basic appointment scheduling
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                        Patient records management
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                        Email support
                      </li>
                    </ul>
                    <Button className="w-full mt-6 glass-button" onClick={handleGetStarted}>
                      Get Started
                    </Button>
                  </CardContent>
                </Card>

                {/* Professional Plan */}
                <Card className="glass-card border-primary/50 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-foreground">
                      Professional
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Ideal for growing dental practices
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-foreground">$99</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                        Up to 500 patients
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                        Advanced scheduling & reminders
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                        Document sharing & storage
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                        Analytics & reporting
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                        Priority support
                      </li>
                    </ul>
                    <Button className="w-full mt-6 glass-button" onClick={handleGetStarted}>
                      Get Started
                    </Button>
                  </CardContent>
                </Card>

                {/* Enterprise Plan */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-foreground">
                      Enterprise
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      For large practices and dental groups
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-foreground">$199</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                        Unlimited patients
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                        Multi-location support
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                        Custom integrations
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                        Advanced analytics
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                        24/7 dedicated support
                      </li>
                    </ul>
                    <Button className="w-full mt-6 glass-button" onClick={handleGetStarted}>
                      Contact Sales
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2 lg:items-center">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-poppins">
                    Revolutionizing dental practice management
                  </h2>
                  <p className="mt-6 text-lg leading-8 text-muted-foreground">
                    DentCare Pro was built by healthcare professionals who understand the unique challenges
                    of running a modern dental practice. Our platform combines cutting-edge technology with
                    intuitive design to streamline your workflow and enhance patient care.
                  </p>
                  <div className="mt-8 space-y-4">
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-1 mr-4">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">HIPAA Compliant</h3>
                        <p className="text-muted-foreground">Built from the ground up with healthcare security standards in mind.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-1 mr-4">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Easy to Use</h3>
                        <p className="text-muted-foreground">Intuitive interface designed for busy healthcare professionals.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-1 mr-4">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">24/7 Support</h3>
                        <p className="text-muted-foreground">Our dedicated support team is here to help whenever you need it.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="glass-card p-8">
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary">10,000+</div>
                        <div className="text-muted-foreground">Appointments Managed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary">500+</div>
                        <div className="text-muted-foreground">Dental Practices</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary">99.9%</div>
                        <div className="text-muted-foreground">Uptime Guarantee</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 sm:py-32 bg-secondary/20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-poppins">
                Get in touch
              </h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Ready to transform your dental practice? Contact us today to learn more about DentCare Pro.
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
                <Card className="glass-card text-center">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-foreground">
                      Sales Inquiries
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Interested in DentCare Pro for your practice?
                    </p>
                    <p className="font-medium text-foreground">sales@dentcarepro.com</p>
                    <p className="text-muted-foreground">(555) 123-4567</p>
                    <Button className="mt-4 glass-button" onClick={handleGetStarted}>
                      Schedule Demo
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass-card text-center">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-foreground">
                      Technical Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Need help with your account or have technical questions?
                    </p>
                    <p className="font-medium text-foreground">support@dentcarepro.com</p>
                    <p className="text-muted-foreground">(555) 123-4568</p>
                    <Button variant="outline" className="mt-4">
                      Contact Support
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass-card text-center">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-foreground">
                      General Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Questions about our company or partnership opportunities?
                    </p>
                    <p className="font-medium text-foreground">info@dentcarepro.com</p>
                    <p className="text-muted-foreground">(555) 123-4569</p>
                    <Button variant="outline" className="mt-4">
                      Get in Touch
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-primary/30">
                  <span className="text-primary font-bold">D</span>
                </div>
                <span className="text-xl font-bold text-foreground font-poppins">
                  DentCare Pro
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Modern dental practice management platform designed for healthcare professionals.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="/auth/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Sign Up
                  </a>
                </li>
                <li>
                  <a href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Sign In
                  </a>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="/status" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    System Status
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/security" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="/compliance" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    HIPAA Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border/40">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground">
                © 2024 DentCare Pro. All rights reserved. Built with security and compliance in mind.
              </p>
              <div className="flex space-x-6 mt-4 sm:mt-0">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
