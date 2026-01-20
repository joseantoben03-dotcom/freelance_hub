export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Top section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Brand */}
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">
              FreelanceHub
            </h2>
            <p className="text-sm text-gray-400 max-w-md">
              Find clients, manage projects, and grow your freelance career in one place.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
            <a
              href="#about"
              className="text-gray-400 hover:text-white transition-colors"
            >
              About
            </a>
            <a
              href="#how-it-works"
              className="text-gray-400 hover:text-white transition-colors"
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Pricing
            </a>
            <a
              href="#contact"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-6" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p className="text-center md:text-left">
            &copy; {currentYear} FreelanceHub. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="#privacy"
              className="hover:text-gray-300 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="hover:text-gray-300 transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
