"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save } from "lucide-react";

export function SettingsForm({
  settings,
}: {
  settings: Record<string, string>;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({
    site_name: settings.site_name ?? "Takonray Tours",
    contact_email: settings.contact_email ?? "",
    contact_phone: settings.contact_phone ?? "",
    contact_address: settings.contact_address ?? "",
    facebook_url: settings.facebook_url ?? "",
    instagram_url: settings.instagram_url ?? "",
    twitter_url: settings.twitter_url ?? "",
    youtube_url: settings.youtube_url ?? "",
    whatsapp_number: settings.whatsapp_number ?? "",
    peak_season_start: settings.peak_season_start ?? "",
    peak_season_end: settings.peak_season_end ?? "",
    high_season_start: settings.high_season_start ?? "",
    high_season_end: settings.high_season_end ?? "",
    deposit_percentage: settings.deposit_percentage ?? "30",
    local_currency: settings.local_currency ?? "ZMW",
    cancellation_policy: settings.cancellation_policy ?? "",
    terms_and_conditions: settings.terms_and_conditions ?? "",
    booking_policy: settings.booking_policy ?? "",
  });

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: values }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to save settings");
      }
    } catch {
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Site Name</Label>
                <Input
                  value={values.site_name}
                  onChange={(e) => handleChange("site_name", e.target.value)}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Contact Email</Label>
                  <Input
                    type="email"
                    value={values.contact_email}
                    onChange={(e) =>
                      handleChange("contact_email", e.target.value)
                    }
                    placeholder="info@takonraytours.com"
                  />
                </div>
                <div>
                  <Label>Contact Phone</Label>
                  <Input
                    value={values.contact_phone}
                    onChange={(e) =>
                      handleChange("contact_phone", e.target.value)
                    }
                    placeholder="+260 974 600 016"
                  />
                </div>
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  value={values.contact_address}
                  onChange={(e) =>
                    handleChange("contact_address", e.target.value)
                  }
                  placeholder="Livingstone, Zambia"
                />
              </div>
              <div>
                <Label>WhatsApp Number</Label>
                <Input
                  value={values.whatsapp_number}
                  onChange={(e) =>
                    handleChange("whatsapp_number", e.target.value)
                  }
                  placeholder="+260974600016"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Facebook URL</Label>
                  <Input
                    value={values.facebook_url}
                    onChange={(e) =>
                      handleChange("facebook_url", e.target.value)
                    }
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <Label>Instagram URL</Label>
                  <Input
                    value={values.instagram_url}
                    onChange={(e) =>
                      handleChange("instagram_url", e.target.value)
                    }
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <Label>Twitter URL</Label>
                  <Input
                    value={values.twitter_url}
                    onChange={(e) =>
                      handleChange("twitter_url", e.target.value)
                    }
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div>
                  <Label>YouTube URL</Label>
                  <Input
                    value={values.youtube_url}
                    onChange={(e) =>
                      handleChange("youtube_url", e.target.value)
                    }
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Season Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">
                Define the date ranges for each season to automatically apply
                correct pricing.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Peak Season Start</Label>
                  <Input
                    type="date"
                    value={values.peak_season_start}
                    onChange={(e) =>
                      handleChange("peak_season_start", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Peak Season End</Label>
                  <Input
                    type="date"
                    value={values.peak_season_end}
                    onChange={(e) =>
                      handleChange("peak_season_end", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>High Season Start</Label>
                  <Input
                    type="date"
                    value={values.high_season_start}
                    onChange={(e) =>
                      handleChange("high_season_start", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>High Season End</Label>
                  <Input
                    type="date"
                    value={values.high_season_end}
                    onChange={(e) =>
                      handleChange("high_season_end", e.target.value)
                    }
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Dates outside peak and high season are automatically classified
                as low season.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Deposit Percentage (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={values.deposit_percentage}
                    onChange={(e) =>
                      handleChange("deposit_percentage", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Local Currency Code</Label>
                  <Input
                    value={values.local_currency}
                    onChange={(e) =>
                      handleChange("local_currency", e.target.value)
                    }
                    placeholder="ZMW"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Policies Tab */}
        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cancellation Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={8}
                value={values.cancellation_policy}
                onChange={(e) =>
                  handleChange("cancellation_policy", e.target.value)
                }
                placeholder="Enter your cancellation policy..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Booking Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={8}
                value={values.booking_policy}
                onChange={(e) =>
                  handleChange("booking_policy", e.target.value)
                }
                placeholder="Enter your booking policy..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Terms and Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={12}
                value={values.terms_and_conditions}
                onChange={(e) =>
                  handleChange("terms_and_conditions", e.target.value)
                }
                placeholder="Enter your terms and conditions..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center gap-3">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-teal-600 hover:bg-teal-700"
        >
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Settings
        </Button>
      </div>
    </div>
  );
}
