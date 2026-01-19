'use client';

import { useForm, ValidationError } from '@formspree/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Clock, MessageSquare, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [state, handleSubmit] = useForm('xzzoevkp');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <header className="page-header">
          <h1>Contact Us</h1>
          <p>
            Have a question or feedback? We'd love to hear from you.
          </p>
        </header>

        {/* Info Cards */}
        <div className="stats-grid mb-8">
          <div className="stat-card">
            <Mail className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-slate-700">Email</div>
            <div className="text-xs text-slate-500">General inquiries</div>
          </div>
          <div className="stat-card">
            <Clock className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-slate-700">Response</div>
            <div className="text-xs text-slate-500">24-48 hours</div>
          </div>
          <div className="stat-card">
            <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-slate-700">Feedback</div>
            <div className="text-xs text-slate-500">Always welcome</div>
          </div>
          <div className="stat-card">
            <CheckCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-slate-700">Support</div>
            <div className="text-xs text-slate-500">Here to help</div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="content-card">
          <h2>Send us a message</h2>
          <p className="text-slate-500 text-sm mb-6">
            Fill out the form below and we'll get back to you as soon as possible.
          </p>

          {state.succeeded ? (
            <div className="py-12 text-center">
              <div className="mb-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-emerald-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-slate-800">Message Sent!</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Thank you for contacting us. We'll review your message and get back to you within 24-48 hours.
              </p>
              <Button onClick={() => window.location.reload()} size="lg">
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 font-medium">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    aria-required="true"
                    placeholder="Your name"
                    disabled={state.submitting}
                    className="h-12"
                  />
                  <ValidationError
                    prefix="Name"
                    field="name"
                    errors={state.errors}
                    className="text-sm text-red-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    aria-required="true"
                    placeholder="your.email@example.com"
                    disabled={state.submitting}
                    className="h-12"
                  />
                  <ValidationError
                    prefix="Email"
                    field="email"
                    errors={state.errors}
                    className="text-sm text-red-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-slate-700 font-medium">
                  Subject <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  aria-required="true"
                  placeholder="What is your message about?"
                  disabled={state.submitting}
                  className="h-12"
                />
                <ValidationError
                  prefix="Subject"
                  field="subject"
                  errors={state.errors}
                  className="text-sm text-red-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-slate-700 font-medium">
                  Message <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  aria-required="true"
                  rows={6}
                  placeholder="Tell us more about your inquiry..."
                  disabled={state.submitting}
                  className="resize-none"
                />
                <ValidationError
                  prefix="Message"
                  field="message"
                  errors={state.errors}
                  className="text-sm text-red-600"
                />
              </div>

              {state.errors && Object.keys(state.errors).length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600 font-medium">Please fix the errors above to continue.</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium"
                disabled={state.submitting}
                aria-label={state.submitting ? 'Sending message...' : 'Send message'}
              >
                {state.submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </Button>
            </form>
          )}
        </div>

        <p className="page-meta">We typically respond within 24-48 hours.</p>
      </div>
    </div>
  );
}
