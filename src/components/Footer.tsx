import mainLogo from "../assets/app-logo/mainlogo.svg";

const Footer = () => {
  return (
    <footer className="py-16 px-4 border-t border-gray-800">
      <div className="container mx-auto text-center">
        <div className="mb-8">
          <img src={mainLogo} alt="Marqait" className="mx-auto h-10 mb-4" />
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
            The all-in-one AI platform for creators, marketers, and
            entrepreneurs looking to build profitable businesses with AI.
          </p>
        </div>

        <div className="pt-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            © 2024 Marqait. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
