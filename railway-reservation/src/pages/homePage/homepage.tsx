
import { Navbar } from '../../components/navbar';
// import Card from './Card'; // Adjust the path if needed
import Card from '../../components/ui/card/socialcard'; // Adjust the path if needed

const features = [
  {
    title: "Easy Booking",
    desc: "Book train tickets quickly and securely from anywhere.",
  },
  {
    title: "Live Train Status",
    desc: "Check real-time train schedules and running status.",
  },
  {
    title: "PNR Enquiry",
    desc: "Get instant updates on your PNR status and seat confirmation.",
  },
  {
    title: "User Dashboard",
    desc: "Manage your bookings, cancellations, and travel history.",
  },
];

const HomePage = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
    {/* Header */}
    <header className="shadow bg-white">
      <Navbar />
    </header>

    {/* Main Welcome Section */}
    <main className="flex-1 flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl font-extrabold text-blue-900 mt-16 mb-4 text-center drop-shadow">
        I Rail Gateway
      </h1>
      <p className="text-lg text-gray-700 mb-10 text-center max-w-2xl">
        Welcome to I Rail Gateway, your one-stop solution for seamless train management and ticket reservations. Experience hassle-free booking, live train status, and more!
      </p>

      {/* Features Section */}
      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition"
          >
            <div className="text-blue-700 text-2xl font-bold mb-2">{f.title}</div>
            <div className="text-gray-600 text-center">{f.desc}</div>
          </div>
        ))}
      </section>
    </main>

    {/* Footer with Social Media */}
    <footer className="w-full bg-white py-8 border-t flex flex-col items-center">
      <div className="mb-2 text-gray-700 font-semibold">Connect with us</div>
      <Card />
      <div className="mt-4 text-xs text-gray-500">&copy; {new Date().getFullYear()} I Rail Gateway. All rights reserved.</div>
    </footer>
  </div>
);

export default HomePage;