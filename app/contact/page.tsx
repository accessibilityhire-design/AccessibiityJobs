'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (in a real app, this would send to an API)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitSuccess(true);
    setIsSubmitting(false);
    
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-600 text-lg">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <Mail className="h-8 w-8 mx-auto mb-2 text-primary" aria-hidden="true" />
              <CardTitle className="text-lg">Email</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600">
                For general inquiries and support
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Mail className="h-8 w-8 mx-auto mb-2 text-primary" aria-hidden="true" />
              <CardTitle className="text-lg">Support</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600">
                We typically respond within 24-48 hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Mail className="h-8 w-8 mx-auto mb-2 text-primary" aria-hidden="true" />
              <CardTitle className="text-lg">Feedback</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600">
                Help us improve our platform
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitSuccess ? (
              <div className="py-8 text-center">
                <div className="mb-4">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail className="h-8 w-8 text-green-600" aria-hidden="true" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                <p className="text-gray-600 mb-4">
                  Thank you for contacting us. We'll get back to you soon.
                </p>
                <Button onClick={() => setSubmitSuccess(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      aria-required="true"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      aria-required="true"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    placeholder="What is your message about?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    rows={6}
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                  aria-label={isSubmitting ? 'Sending message...' : 'Send message'}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

