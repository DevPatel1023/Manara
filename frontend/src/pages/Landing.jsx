import Heading from "../components/Heading"
import SubHeading from "../components/SubHeading"
import TopBar from "../components/TopBar"
import { ArrowRight, Check, ChevronRight, Star, Users, Zap } from "lucide-react"

// Feature data
const features = [
  {
    icon: <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: "Quick Quote Generation",
    description: "Create professional quotes in minutes with our intuitive interface and customizable templates.",
  },
  {
    icon: <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: "Client Management",
    description: "Easily manage your clients, save their information, and track their quote history.",
  },
  {
    icon: <Check className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: "Digital Approvals",
    description: "Get quotes approved digitally with e-signatures and automated approval workflows.",
  },
  {
    icon: <Star className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: "Customizable Templates",
    description: "Choose from a variety of professional templates or create your own to match your brand.",
  },
  {
    icon: <ArrowRight className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: "Quote to Invoice Conversion",
    description: "Convert approved quotes to invoices with a single click, saving time and reducing errors.",
  },
  {
    icon: <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    title: "Real-time Analytics",
    description: "Track quote performance, conversion rates, and revenue with detailed analytics.",
  },
]

// How it works steps
const steps = [
  {
    title: "Create Your Quote",
    description: "Select a template, add your products or services, and customize your quote to match your brand.",
  },
  {
    title: "Share with Clients",
    description: "Send your quote via email, link, or PDF. Clients can view and approve quotes online.",
  },
  {
    title: "Get Paid Faster",
    description: "Convert approved quotes to invoices and accept payments online through multiple payment methods.",
  },
]

// Testimonial data
const testimonials = [
  {
    quote:
      "Quotation Maker has transformed how we handle our client proposals. What used to take hours now takes minutes.",
    name: "Sarah Johnson",
    role: "Marketing Agency Owner",
  },
  {
    quote:
      "The ability to track when clients view quotes and get digital approvals has improved our close rate by 35%.",
    name: "Michael Chen",
    role: "Freelance Designer",
  },
  {
    quote:
      "As a contractor, I need to create quotes on the go. The mobile app makes it possible to send professional quotes from anywhere.",
    name: "David Rodriguez",
    role: "Construction Contractor",
  },
]

// Pricing plans
const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for freelancers and small businesses",
    price: 19,
    popular: false,
    features: [
      "Up to 20 quotes per month",
      "3 customizable templates",
      "Client management",
      "Quote to invoice conversion",
      "Email support",
    ],
  },
  {
    name: "Professional",
    description: "Ideal for growing businesses",
    price: 49,
    popular: true,
    features: [
      "Unlimited quotes",
      "10 customizable templates",
      "Client management",
      "Quote to invoice conversion",
      "Digital approvals",
      "Team collaboration",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    description: "For large teams and organizations",
    price: 99,
    popular: false,
    features: [
      "Unlimited everything",
      "Custom templates",
      "Advanced analytics",
      "API access",
      "Custom branding",
      "Dedicated account manager",
      "24/7 support",
    ],
  },
]

const Landing = () => {
  return (
    <div className="min-h-screen bg-white text-[#1e2022] dark:bg-[#25282a] dark:text-white transition-colors duration-300">
      <TopBar />

      {/* Hero Section */}
      <div className="grid md:grid-cols-2 items-center px-4 md:px-10 lg:px-20 pt-11 max-w-7xl mx-auto">
        {/* Left Side - Heading & Subheading */}
        <div className="flex flex-col justify-center mb-10 md:mb-0">
          
          <Heading
            style="text-4xl md:text-5xl font-semibold dark:text-white leading-tight"
            title="Streamline Your Quotations & Invoices Effortlessly"
          />
          <SubHeading
            style="text-gray-600 dark:text-gray-400 text-lg md:text-xl mt-4"
            subtitle="Create, Approve, and Track Quotations & Invoices with Ease"
          />

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center">
              Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-300">
              Book a Demo
            </button>
          </div>

          <div className="flex items-center mt-8">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700"
                ></div>
              ))}
            </div>
            <p className="ml-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-white">500+</span> businesses trust us
            </p>
          </div>
        </div>

        {/* Right Side - Image with Glassmorphism Effect */}
        <div className="flex justify-center">
  <div className="relative p-2 rounded-lg backdrop-blur-lg bg-white/10 dark:bg-gray-800/30 border border-gray-300 dark:border-gray-700 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500">
    <img
      className="w-[80%] max-w-[450px] h-auto object-cover rounded-lg"
      src="/landing.png"
      alt="Quotation maker dashboard preview"
    />
  </div>
</div>

      </div>

      {/* Trusted By Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-900 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-8">
            Trusted by industry leaders
          </p>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="col-span-1 flex justify-center md:col-span-1">
                <div className="h-8 text-gray-400 dark:text-gray-600">LOGO {i}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Heading
            style="text-3xl md:text-4xl lg:text-5xl font-semibold dark:text-white"
            title="Experience the Power of Quotation Maker"
          />
          <SubHeading
            style="text-gray-600 dark:text-gray-400 text-lg md:text-xl mt-4 max-w-3xl mx-auto"
            subtitle="Simplify and streamline your quotation process with our powerful features designed for businesses of all sizes."
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              <a href="#" className="inline-flex items-center mt-4 text-blue-600 dark:text-blue-400 font-medium">
                Learn more <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Heading style="text-3xl md:text-4xl lg:text-5xl font-semibold dark:text-white" title="How It Works" />
            <SubHeading
              style="text-gray-600 dark:text-gray-400 text-lg md:text-xl mt-4 max-w-3xl mx-auto"
              subtitle="Get started in minutes with our simple 3-step process"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-6">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Heading
            style="text-3xl md:text-4xl lg:text-5xl font-semibold dark:text-white"
            title="What Our Customers Say"
          />
          <SubHeading
            style="text-gray-600 dark:text-gray-400 text-lg md:text-xl mt-4 max-w-3xl mx-auto"
            subtitle="Don't just take our word for it - hear from some of our satisfied customers"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3"></div>
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Heading
              style="text-3xl md:text-4xl lg:text-5xl font-semibold dark:text-white"
              title="Simple, Transparent Pricing"
            />
            <SubHeading
              style="text-gray-600 dark:text-gray-400 text-lg md:text-xl mt-4 max-w-3xl mx-auto"
              subtitle="No hidden fees, no surprises. Choose the plan that works for your business."
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border ${
                  plan.popular
                    ? "border-blue-500 dark:border-blue-400 relative"
                    : "border-gray-100 dark:border-gray-700"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-500 dark:text-gray-400">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-lg font-medium transition duration-300 ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#283693] dark:bg-blue-700 rounded-2xl p-8 md:p-12 lg:p-16 text-center md:text-left md:flex md:items-center md:justify-between">
          <div className="mb-8 md:mb-0 md:max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to streamline your quotation process?
            </h2>
            <p className="text-blue-100 text-lg">
              Join thousands of businesses that trust Quotation Maker for their invoicing needs.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition duration-300 font-medium">
              Get Started Free
            </button>
            <button className="px-6 py-3 bg-blue-700 dark:bg-blue-800 text-white rounded-lg hover:bg-blue-800 dark:hover:bg-blue-900 transition duration-300 font-medium">
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                {["Features", "Pricing", "Integrations", "FAQ", "Changelog"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {["About", "Blog", "Careers", "Press", "Partners"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                {["Documentation", "Guides", "Support", "API", "Community"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                {["Privacy", "Terms", "Security", "Cookies", "Compliance"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="mr-2 w-8 h-8 bg-blue-600 rounded-md"></div>
              <span className="font-semibold text-lg">Quotation Maker</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Quotation Maker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing

