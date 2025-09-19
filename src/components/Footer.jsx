import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-10">
      <div className="container mx-auto py-8 px-4 text-sm text-gray-600">
        <div className="grid md:grid-cols-4 gap-8 text-left">
          {/* Company */}
          <div>
            <h4 className="font-semibold mb-2">Company</h4>
            <ul className="space-y-1">
              <li><Link to="/about" className="hover:underline">About</Link></li>
              <li><Link to="/blog" className="hover:underline">Blog</Link></li>
              <li><Link to="/careers" className="hover:underline">Careers</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-2">Resources</h4>
            <ul className="space-y-1">
              <li><Link to="/docs" className="hover:underline">Docs</Link></li>
              <li><Link to="/faq" className="hover:underline">FAQ</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-2">Legal</h4>
            <ul className="space-y-1">
              <li><Link to="/terms" className="hover:underline">Terms</Link></li>
              <li><Link to="/privacy" className="hover:underline">Privacy</Link></li>
            </ul>
          </div>

          {/* Branding */}
          <div className="text-center md:text-right">
            <p className="mb-2">&copy; {new Date().getFullYear()} Artifically. All rights reserved.</p>
            <p className="text-xs">Built with ❤️ for modern teams</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
