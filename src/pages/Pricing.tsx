
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/useTranslation";

const Pricing = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <Navbar />
      <div className="pt-16">
        <div className="bg-gradient-to-b from-gray-50 to-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                {t("pricing.title")}
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                {t("pricing.subtitle")}
              </p>
            </div>

            <div className="mt-16 flex justify-center">
              <Tabs defaultValue="monthly" className="w-full max-w-3xl">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                  <TabsTrigger value="monthly">{t("pricing.monthly")}</TabsTrigger>
                  <TabsTrigger value="yearly">{t("pricing.yearly")}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="monthly" className="mt-8">
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Basic Plan */}
                    <Card className="flex flex-col p-8 shadow-lg">
                      <h3 className="text-lg font-semibold text-gray-900">{t("pricing.transporter")}</h3>
                      <p className="mt-4 text-sm text-gray-500">
                        {t("pricing.transporter_description")}
                      </p>
                      <div className="mt-6">
                        <p className="text-5xl font-extrabold text-gray-900">15%</p>
                        <p className="text-base text-gray-500">{t("pricing.commission_per_trip")}</p>
                      </div>
                      <ul className="mt-8 space-y-4 text-sm text-gray-600">
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">{t("pricing.feature_notifications")}</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">{t("pricing.feature_geolocation")}</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">{t("pricing.feature_ratings")}</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">{t("pricing.feature_filters")}</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">{t("pricing.feature_commission_reduction")}</span>
                        </li>
                        <li className="flex items-center text-gray-400">
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                          <span className="ml-3">{t("pricing.feature_premium_badge")}</span>
                        </li>
                      </ul>
                      <div className="mt-8 flex flex-col">
                        <Link to="/register">
                          <Button className="w-full bg-retourgo-orange hover:bg-retourgo-orange/90">
                            {t("pricing.start_free")}
                          </Button>
                        </Link>
                        <p className="mt-2 text-xs text-center text-gray-500">{t("pricing.free_trial")}</p>
                      </div>
                    </Card>

                    {/* Premium Plan */}
                    <Card className="flex flex-col p-8 shadow-lg border-2 border-retourgo-orange relative">
                      <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-retourgo-orange px-3 py-1 text-xs font-medium text-white text-center">
                        {t("pricing.popular")}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{t("pricing.shipper")}</h3>
                      <p className="mt-4 text-sm text-gray-500">
                        {t("pricing.shipper_description")}
                      </p>
                      <div className="mt-6">
                        <p className="text-5xl font-extrabold text-gray-900">10%</p>
                        <p className="text-base text-gray-500">{t("pricing.commission_per_shipment")}</p>
                      </div>
                      <ul className="mt-8 space-y-4 text-sm text-gray-600">
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">{t("pricing.feature_unlimited")}</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">{t("pricing.feature_best_transporters")}</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">{t("pricing.feature_ratings")}</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">{t("pricing.feature_tracking")}</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">{t("pricing.feature_secure_payments")}</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">{t("pricing.feature_shipper_badge")}</span>
                        </li>
                      </ul>
                      <div className="mt-8 flex flex-col">
                        <Link to="/register">
                          <Button className="w-full bg-retourgo-orange hover:bg-retourgo-orange/90">
                            {t("pricing.start_free")}
                          </Button>
                        </Link>
                        <p className="mt-2 text-xs text-center text-gray-500">{t("pricing.free_trial")}</p>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="yearly" className="mt-8">
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Basic Plan Yearly */}
                    <Card className="flex flex-col p-8 shadow-lg">
                      <h3 className="text-lg font-semibold text-gray-900">{t("pricing.transporter")}</h3>
                      <p className="mt-4 text-sm text-gray-500">
                        {t("pricing.transporter_description")}
                      </p>
                      <div className="mt-6">
                        <p className="text-5xl font-extrabold text-gray-900">12.75%</p>
                        <p className="text-base text-gray-500">{t("pricing.commission_per_trip")}</p>
                      </div>
                      <ul className="mt-8 space-y-4 text-sm text-gray-600">
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">{t("pricing.feature_notifications")}</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">{t("pricing.feature_geolocation")}</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">{t("pricing.feature_ratings")}</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">{t("pricing.feature_filters")}</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">{t("pricing.feature_yearly_reduction")}</span>
                        </li>
                        <li className="flex items-center text-gray-400">
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                          <span className="ml-3">{t("pricing.feature_premium_badge")}</span>
                        </li>
                      </ul>
                      <div className="mt-8 flex flex-col">
                        <Link to="/register">
                          <Button className="w-full bg-retourgo-orange hover:bg-retourgo-orange/90">
                            {t("pricing.start_free")}
                          </Button>
                        </Link>
                        <p className="mt-2 text-xs text-center text-gray-500">{t("pricing.free_trial_discount")}</p>
                      </div>
                    </Card>

                    {/* Premium Plan Yearly */}
                    <Card className="flex flex-col p-8 shadow-lg border-2 border-retourgo-orange relative">
                      <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-retourgo-orange px-3 py-1 text-xs font-medium text-white text-center">
                        {t("pricing.popular")}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{t("pricing.shipper")}</h3>
                      <p className="mt-4 text-sm text-gray-500">
                        {t("pricing.shipper_description")}
                      </p>
                      <div className="mt-6">
                        <p className="text-5xl font-extrabold text-gray-900">8.5%</p>
                        <p className="text-base text-gray-500">{t("pricing.commission_per_shipment")}</p>
                      </div>
                      <ul className="mt-8 space-y-4 text-sm text-gray-600">
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">{t("pricing.feature_unlimited")}</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">{t("pricing.feature_best_transporters")}</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">{t("pricing.feature_ratings")}</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">{t("pricing.feature_tracking")}</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">{t("pricing.feature_secure_payments")}</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-retourgo-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-3">{t("pricing.feature_shipper_badge")}</span>
                        </li>
                      </ul>
                      <div className="mt-8 flex flex-col">
                        <Link to="/register">
                          <Button className="w-full bg-retourgo-orange hover:bg-retourgo-orange/90">
                            {t("pricing.start_free")}
                          </Button>
                        </Link>
                        <p className="mt-2 text-xs text-center text-gray-500">{t("pricing.free_trial_discount")}</p>
                      </div>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="mt-16">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
                {t("pricing.faq_title")}
              </h2>
              <div className="mx-auto max-w-3xl divide-y divide-gray-200">
                <div className="py-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t("pricing.faq_trial_question")}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {t("pricing.faq_trial_answer")}
                  </p>
                </div>
                <div className="py-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t("pricing.faq_commission_question")}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {t("pricing.faq_commission_answer")}
                  </p>
                </div>
                <div className="py-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t("pricing.faq_discount_question")}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {t("pricing.faq_discount_answer")}
                  </p>
                </div>
                <div className="py-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t("pricing.faq_plan_change_question")}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {t("pricing.faq_plan_change_answer")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;
