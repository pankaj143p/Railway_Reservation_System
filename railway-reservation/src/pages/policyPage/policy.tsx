import { useEffect } from 'react';

const Policy = () => {
  useEffect(() => {
    document.title = "Privacy Policy & Terms - I Rail Gateway";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy & Terms of Service
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your privacy and security are our top priorities. Please read our policies carefully 
            to understand how we protect and use your information.
          </p>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <nav className="flex flex-wrap gap-4 justify-center">
            <a href="#privacy" className="text-blue-600 hover:text-blue-800 font-medium">Privacy Policy</a>
            <a href="#terms" className="text-blue-600 hover:text-blue-800 font-medium">Terms of Service</a>
            <a href="#cancellation" className="text-blue-600 hover:text-blue-800 font-medium">Cancellation Policy</a>
            <a href="#refund" className="text-blue-600 hover:text-blue-800 font-medium">Refund Policy</a>
            <a href="#cookies" className="text-blue-600 hover:text-blue-800 font-medium">Cookie Policy</a>
          </nav>
        </div>

        {/* Privacy Policy */}
        <section id="privacy" className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy Policy</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Information We Collect</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li><strong>Personal Information:</strong> Name, email address, phone number, date of birth, and government ID details for ticket booking</li>
              <li><strong>Payment Information:</strong> Credit/debit card details, UPI information (processed securely through payment gateways)</li>
              <li><strong>Travel Information:</strong> Journey details, passenger information, seat preferences, and booking history</li>
              <li><strong>Technical Information:</strong> IP address, browser type, device information, and usage data for service improvement</li>
              <li><strong>Communication Data:</strong> Support conversations, feedback, and correspondence with our team</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">How We Use Your Information</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>Process and manage your train reservations and bookings</li>
              <li>Send booking confirmations, tickets, and travel-related notifications</li>
              <li>Provide customer support and respond to your inquiries</li>
              <li>Improve our services and develop new features</li>
              <li>Comply with legal requirements and railway regulations</li>
              <li>Send promotional offers and updates (with your consent)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Security</h3>
            <p className="text-gray-600 mb-4">
              We implement industry-standard security measures including SSL encryption, secure payment processing, 
              and regular security audits to protect your personal information. Your payment data is processed through 
              PCI DSS compliant payment gateways and is never stored on our servers.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Information Sharing</h3>
            <p className="text-gray-600 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>With railway authorities as required for ticket booking and validation</li>
              <li>With payment processors for secure transaction processing</li>
              <li>With service providers who assist in operating our platform</li>
              <li>When required by law or to protect our legal rights</li>
            </ul>
          </div>
        </section>

        {/* Terms of Service */}
        <section id="terms" className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Terms of Service</h2>
          <div className="prose prose-gray max-w-none">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Acceptance of Terms</h3>
            <p className="text-gray-600 mb-4">
              By using I Rail Gateway services, you agree to be bound by these terms and conditions. 
              If you do not agree to these terms, please do not use our services.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Description</h3>
            <p className="text-gray-600 mb-4">
              I Rail Gateway is an online platform that facilitates railway ticket booking and related services. 
              We act as an intermediary between passengers and railway authorities.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">User Responsibilities</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>Provide accurate and complete information during booking</li>
              <li>Ensure all passenger details match government-issued ID documents</li>
              <li>Keep your login credentials secure and confidential</li>
              <li>Use the service only for lawful purposes</li>
              <li>Respect the rights of other users and railway staff</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Booking Terms</h3>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li>All bookings are subject to availability and railway rules</li>
              <li>Ticket prices are as per railway tariff and may include service charges</li>
              <li>Booking confirmation is subject to successful payment processing</li>
              <li>Passengers must carry valid ID proof during travel</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Limitation of Liability</h3>
            <p className="text-gray-600 mb-4">
              I Rail Gateway is not liable for train delays, cancellations, or changes in railway schedules. 
              Our liability is limited to the service charges paid for the booking.
            </p>
          </div>
        </section>

        {/* Cancellation Policy */}
        <section id="cancellation" className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cancellation Policy</h2>
          <div className="prose prose-gray max-w-none">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Cancellation Rules</h3>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-blue-800 font-medium">
                Cancellation charges are as per Indian Railway rules and may vary based on ticket type and timing.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">AC Classes & Chair Car</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 48+ hours before departure: ₹240 + GST</li>
                  <li>• 12-48 hours: 25% of fare + ₹240 + GST</li>
                  <li>• 4-12 hours: 50% of fare + ₹240 + GST</li>
                  <li>• Less than 4 hours: No refund</li>
                </ul>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Sleeper Class</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 48+ hours before departure: ₹120 + GST</li>
                  <li>• 12-48 hours: 25% of fare + ₹120 + GST</li>
                  <li>• 4-12 hours: 50% of fare + ₹120 + GST</li>
                  <li>• Less than 4 hours: No refund</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">How to Cancel</h3>
            <ol className="list-decimal pl-6 mb-4 text-gray-600 space-y-2">
              <li>Log in to your I Rail Gateway account</li>
              <li>Go to "My Bookings" section</li>
              <li>Select the ticket you want to cancel</li>
              <li>Click "Cancel Ticket" and confirm your request</li>
              <li>Refund will be processed as per railway rules</li>
            </ol>
          </div>
        </section>

        {/* Refund Policy */}
        <section id="refund" className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Refund Policy</h2>
          <div className="prose prose-gray max-w-none">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Refund Process</h3>
            <p className="text-gray-600 mb-4">
              Refunds are processed to the original payment method used for booking. Processing time may vary:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600 space-y-2">
              <li><strong>Credit/Debit Cards:</strong> 5-7 business days</li>
              <li><strong>Net Banking:</strong> 7-10 business days</li>
              <li><strong>UPI/Digital Wallets:</strong> 3-5 business days</li>
              <li><strong>Cash Payments:</strong> Contact customer support</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Charges</h3>
            <p className="text-gray-600 mb-4">
              I Rail Gateway service charges are non-refundable except in cases of:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
              <li>Train cancellation by railway authorities</li>
              <li>Technical failure preventing ticket generation</li>
              <li>Duplicate bookings due to system error</li>
            </ul>
          </div>
        </section>

        {/* Cookie Policy */}
        <section id="cookies" className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cookie Policy</h2>
          <div className="prose prose-gray max-w-none">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">What Are Cookies</h3>
            <p className="text-gray-600 mb-4">
              Cookies are small text files stored on your device when you visit our website. 
              They help us provide a better user experience and improve our services.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Types of Cookies We Use</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Essential Cookies</h4>
                <p className="text-sm text-gray-600">Required for website functionality, login sessions, and security.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Performance Cookies</h4>
                <p className="text-sm text-gray-600">Help us understand how visitors interact with our website.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Functionality Cookies</h4>
                <p className="text-sm text-gray-600">Remember your preferences and provide personalized features.</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Marketing Cookies</h4>
                <p className="text-sm text-gray-600">Used to deliver relevant advertisements and track campaign effectiveness.</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Managing Cookies</h3>
            <p className="text-gray-600 mb-4">
              You can control cookies through your browser settings. However, disabling certain cookies may affect 
              website functionality and your ability to use some features.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Questions About Our Policies?</h3>
          <p className="text-gray-600 mb-4">
            If you have any questions about these policies or need clarification, please don't hesitate to contact us.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:legal@irailgateway.com" className="text-blue-600 hover:text-blue-800 font-medium">
              legal@irailgateway.com
            </a>
            <span className="text-gray-400">|</span>
            <a href="tel:+911800XXXRAIL" className="text-blue-600 hover:text-blue-800 font-medium">
              +91 1800-XXX-RAIL
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policy;
