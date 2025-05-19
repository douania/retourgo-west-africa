import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API request
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Message envoyé",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1500);
  };

  return (
    <div>
      <Navbar />
      <div className="pt-16">
        <div className="bg-gradient-to-b from-gray-50 to-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                {t("contact.title")}
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                {t("contact.subtitle")}
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="name">{t("contact.form.name")}</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">{t("contact.form.email")}</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">{t("contact.form.subject")}</Label>
                      <Select value={subject} onValueChange={setSubject}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Sélectionnez un sujet" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="support">Support technique</SelectItem>
                          <SelectItem value="billing">Facturation</SelectItem>
                          <SelectItem value="partnership">Partenariat</SelectItem>
                          <SelectItem value="feedback">Retour d'expérience</SelectItem>
                          <SelectItem value="other">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message">{t("contact.form.message")}</Label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Button
                        type="submit"
                        className="w-full bg-retourgo-orange hover:bg-retourgo-orange/90"
                        disabled={isLoading}
                      >
                        {isLoading ? t("contact.form.submitting") : t("contact.form.submit")}
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>

              <div className="space-y-8">
                <Card className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {t("contact.offices.title")}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg
                          className="h-6 w-6 text-retourgo-orange"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">Siège social - Dakar</p>
                        <p className="text-gray-600 mt-1">
                          Route des Almadies, Dakar, Sénégal
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg
                          className="h-6 w-6 text-retourgo-orange"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">Email</p>
                        <p className="text-gray-600 mt-1">contact@retourgo.com</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg
                          className="h-6 w-6 text-retourgo-orange"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">Téléphone</p>
                        <p className="text-gray-600 mt-1">+221 78 123 45 67</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {t("contact.regional.title")}
                  </h3>
                  <div className="space-y-4">
                    <p className="font-medium text-gray-700">Abidjan</p>
                    <p className="text-gray-600">
                      Plateau, Abidjan, Côte d'Ivoire
                    </p>
                    <p className="font-medium text-gray-700">Bamako</p>
                    <p className="text-gray-600">
                      ACI 2000, Bamako, Mali
                    </p>
                    <p className="font-medium text-gray-700">Ouagadougou</p>
                    <p className="text-gray-600">
                      Ouaga 2000, Ouagadougou, Burkina Faso
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
