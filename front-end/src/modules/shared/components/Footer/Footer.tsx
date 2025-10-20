'use client';
export default function Footer() {
  return (
    <footer className="bg-card border-t border-theme mt-auto transition-colors duration-500 relative z-10">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        <div className="text-center">
          <p className="text-text-secondary text-sm md:text-base transition-colors duration-500">
            © {new Date().getFullYear()} InfoSchool - Censo Escolar
          </p>
        </div>
      </div>
    </footer>
  );
}