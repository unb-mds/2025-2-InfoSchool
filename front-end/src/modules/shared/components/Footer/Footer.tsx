'use client';
export default function Footer() {
  return (
    <footer className="bg-card border-t border-theme mt-auto transition-colors duration-500 relative z-10">
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
        <div className="text-center space-y-2">
          
          {/* CONTATO*/}
          <div className="text-text-secondary text-xs transition-colors duration-500">
            <p className="block sm:inline">infoschoolunb@gmail.com</p>
            <span className="hidden sm:inline mx-2">|</span>
            <p className="block sm:inline">(61) 99603-2741</p>
            <span className="hidden sm:inline mx-2">|</span>
            <p className="block sm:inline">Universidade de Brasília Campus Gama - DF</p>
          </div>

          {/* COPYRIGHT*/}
          <p className="text-text-secondary text-xs md:text-sm transition-colors duration-500">
            © {new Date().getFullYear()} InfoSchool - Censo Escolar
          </p>

        </div>
      </div>
    </footer>
  );
}