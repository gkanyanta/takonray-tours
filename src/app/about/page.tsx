import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Eye,
  Gem,
  Users,
  MapPin,
  Star,
  Calendar,
  Globe,
  TreePine,
  Droplets,
  Bird,
  Mountain,
} from "lucide-react";

export const metadata = {
  title: "About Us | Takonray Tours",
  description:
    "Learn about Takonray Tours, Livingstone's trusted tour operator. Our story, mission, and why we love sharing the magic of Zambia.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-24">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&h=800&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-brand-charcoal/75" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <Badge className="mb-4 bg-brand-amber/90 px-4 py-1 text-white">
            Our Story
          </Badge>
          <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Sharing the Magic of Livingstone{" "}
            <span className="text-brand-amber">Since 2014</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
            Takonray Tours was born from a deep love for Livingstone and a
            desire to share its wonders with the world. What started as a small,
            family-run operation has grown into one of the region&apos;s most
            trusted tour companies.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-3xl font-bold text-brand-charcoal">
              Our Journey
            </h2>
            <div className="mt-4 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Founded in 2014 by a group of passionate Livingstone locals,
                Takonray Tours set out with a simple mission: to provide
                authentic, high-quality experiences that showcase the true beauty
                and spirit of Southern Zambia.
              </p>
              <p>
                Growing up in the shadow of Victoria Falls, our founders spent
                their childhoods exploring the gorges, rivers, and bushlands
                that make this region so extraordinary. They knew that the best
                way to experience Livingstone was through the eyes of someone
                who truly calls it home.
              </p>
              <p>
                Today, our team of experienced local guides leads thousands of
                visitors each year through unforgettable adventures — from the
                misty trails of Victoria Falls to the wildlife-rich plains of
                Chobe, from the adrenaline of bungee jumping to the serenity of
                a Zambezi sunset cruise.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=600&h=500&fit=crop"
              alt="Our team in Livingstone"
              className="rounded-2xl shadow-xl"
            />
            <div className="absolute -bottom-6 -left-6 rounded-xl bg-brand-teal p-4 text-white shadow-lg">
              <p className="text-3xl font-bold">10+</p>
              <p className="text-sm">Years of Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="bg-muted/50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-brand-charcoal">
              What Drives Us
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <Card className="text-center">
              <CardContent className="flex flex-col items-center gap-4 pt-6">
                <div className="flex size-14 items-center justify-center rounded-xl bg-brand-teal/10 text-brand-teal">
                  <Heart className="size-7" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-brand-charcoal">
                  Our Mission
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  To create meaningful travel experiences that connect visitors
                  with the natural beauty, wildlife, and vibrant culture of
                  Livingstone while supporting local communities and conservation
                  efforts.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="flex flex-col items-center gap-4 pt-6">
                <div className="flex size-14 items-center justify-center rounded-xl bg-brand-amber/10 text-brand-amber">
                  <Eye className="size-7" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-brand-charcoal">
                  Our Vision
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  To be the leading tour operator in Southern Africa, recognized
                  for exceptional service, sustainable tourism practices, and
                  making Livingstone accessible and enjoyable for travellers
                  from all walks of life.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="flex flex-col items-center gap-4 pt-6">
                <div className="flex size-14 items-center justify-center rounded-xl bg-brand-teal/10 text-brand-teal">
                  <Gem className="size-7" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-brand-charcoal">
                  Our Values
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Authenticity, safety, sustainability, and community.
                  Everything we do is rooted in respect for our environment,
                  our heritage, and our guests. We believe great experiences
                  leave a positive impact.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-teal py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Users className="size-8" />,
                stat: "500+",
                label: "Happy Customers",
              },
              {
                icon: <MapPin className="size-8" />,
                stat: "50+",
                label: "Tours & Activities",
              },
              {
                icon: <Calendar className="size-8" />,
                stat: "10+",
                label: "Years Experience",
              },
              {
                icon: <Star className="size-8" />,
                stat: "4.8",
                label: "Star Rating",
              },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-white/10 text-white">
                  {item.icon}
                </div>
                <p className="mt-4 text-4xl font-bold text-white">
                  {item.stat}
                </p>
                <p className="mt-1 text-sm text-white/80">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold text-brand-charcoal">
            Meet Our Team
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Our passionate team of local experts is dedicated to making your
            Livingstone experience unforgettable.
          </p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              name: "David Mwamba",
              role: "Founder & Lead Guide",
              bio: "Born in Livingstone with 15+ years guiding experience. David knows every trail, rapid, and hidden gem in the region.",
            },
            {
              name: "Grace Mutale",
              role: "Operations Manager",
              bio: "Grace ensures every tour runs smoothly, from booking to farewell. Her attention to detail is second to none.",
            },
            {
              name: "Joseph Banda",
              role: "Wildlife Expert",
              bio: "A certified safari guide with an encyclopedic knowledge of Southern African wildlife and ecosystems.",
            },
            {
              name: "Thandiwe Phiri",
              role: "Guest Relations",
              bio: "Thandiwe is your first point of contact, helping you plan the perfect itinerary for your Livingstone adventure.",
            },
          ].map((member) => (
            <Card key={member.name}>
              <CardContent className="pt-6 text-center">
                <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-brand-teal/10 text-brand-teal">
                  <span className="text-xl font-bold">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold text-brand-charcoal">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-brand-teal">
                  {member.role}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {member.bio}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Livingstone */}
      <section className="bg-muted/50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <Badge variant="secondary" className="mb-3 px-3">
              <Globe className="mr-1 size-3" />
              Destination
            </Badge>
            <h2 className="font-heading text-3xl font-bold text-brand-charcoal">
              Why Livingstone?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Known as the Adventure Capital of Africa, Livingstone is a
              destination unlike any other. Here&apos;s what makes it special.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Droplets className="size-7" />,
                title: "Victoria Falls",
                description:
                  "One of the Seven Natural Wonders of the World. The largest curtain of falling water on Earth, creating a mist visible from 30km away.",
              },
              {
                icon: <Bird className="size-7" />,
                title: "Rich Wildlife",
                description:
                  "Home to the Big Five and over 400 bird species. Mosi-oa-Tunya National Park and nearby Chobe offer incredible game viewing.",
              },
              {
                icon: <Mountain className="size-7" />,
                title: "Adventure Hub",
                description:
                  "Bungee jumping, white water rafting, zip-lining, helicopter flights, gorge swinging — Livingstone has it all for thrill-seekers.",
              },
              {
                icon: <TreePine className="size-7" />,
                title: "Culture & History",
                description:
                  "A town rich in colonial and pre-colonial history, vibrant markets, traditional villages, and the warmest people you will ever meet.",
              },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="pt-6">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-brand-teal/10 text-brand-teal">
                    {item.icon}
                  </div>
                  <h3 className="mt-4 font-heading text-base font-semibold text-brand-charcoal">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
