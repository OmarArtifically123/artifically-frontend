import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-10">
      <div className="container mx-auto py-6 px-4 text-center text-sm text-gray-600">
        <p className="mb-2">
          🚧 THIS IS STILL A WORK IN PROGRESS — Some features may not work yet 🚧
        </p>
        <p className="mb-2">
          &copy; {new Date().getFullYear()} Artifically. All rights reserved.
        </p>
        <div className="space-x-4">
          <Link to="/pricing" className="hover:underline">Pricing</Link>
          <Link to="/docs" className="hover:underline">Docs</Link>
          <Link to="/faq" className="hover:underline">FAQ</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
