import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactForm } from "@/components/contact/contact-form";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Globe,
} from "lucide-react";

export const metadata = {
  title: "Contact Us | Takonray Tours",
  description:
    "Get in touch with Takonray Tours. We are here to help you plan your perfect Livingstone adventure. Contact us by phone, email, or WhatsApp.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="bg-brand-teal py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
            Contact Us
          </h1>
          <p className="mt-2 max-w-2xl text-white/80">
            Have a question or ready to book your adventure? We would love to
            hear from you. Our team is available to help plan your perfect
            Livingstone trip.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg text-brand-charcoal">
                  Get In Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-teal/10 text-brand-teal">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-brand-charcoal">
                      Address
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Mosi-oa-Tunya Road
                      <br />
                      Livingstone, Southern Province
                      <br />
                      Zambia
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-teal/10 text-brand-teal">
                    <Phone className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-brand-charcoal">
                      Phone
                    </p>
                    <a
                      href="tel:+260977123456"
                      className="text-sm text-muted-foreground hover:text-brand-teal"
                    >
                      +260 977 123 456
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-teal/10 text-brand-teal">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-brand-charcoal">
                      Email
                    </p>
                    <a
                      href="mailto:info@takonraytours.com"
                      className="text-sm text-muted-foreground hover:text-brand-teal"
                    >
                      info@takonraytours.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600">
                    <MessageCircle className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-brand-charcoal">
                      WhatsApp
                    </p>
                    <a
                      href="https://wa.me/260977123456"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-green-600"
                    >
                      +260 977 123 456
                    </a>
                    <p className="text-xs text-muted-foreground">
                      Chat with us directly
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Operating Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-heading text-lg text-brand-charcoal">
                  <Clock className="size-5 text-brand-teal" />
                  Operating Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Monday - Friday
                  </span>
                  <span className="font-medium text-brand-charcoal">
                    07:00 - 18:00
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="font-medium text-brand-charcoal">
                    07:00 - 16:00
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="font-medium text-brand-charcoal">
                    08:00 - 14:00
                  </span>
                </div>
                <div className="mt-2 rounded-lg bg-brand-amber/10 p-3">
                  <p className="text-xs text-brand-amber-700">
                    <Globe className="mb-0.5 mr-1 inline size-3" />
                    Emergency support available 24/7 for booked guests
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                  <div className="flex h-full items-center justify-center bg-brand-teal/5">
                    <div className="text-center">
                      <MapPin className="mx-auto size-10 text-brand-teal/40" />
                      <p className="mt-2 text-sm font-medium text-muted-foreground">
                        Livingstone, Zambia
                      </p>
                      <a
                        href="https://maps.google.com/?q=Livingstone+Zambia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-xs text-brand-teal hover:underline"
                      >
                        Open in Google Maps
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
