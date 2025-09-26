export default function Footer() {
  return (
    <footer className="bg-[#2D2D2D] border-t border-[#444444] mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        <div className="text-center">
          <p className="text-gray-400 text-sm md:text-base">
            © {new Date().getFullYear()} InfoSchool - Censo Escolar
          </p>
        </div>
      </div>
    </footer>
  );
}