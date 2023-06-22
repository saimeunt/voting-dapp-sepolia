const Footer = () => {
  return (
    <footer className="mx-8 flex justify-between border-t border-white/10 py-5">
      <p className="text-xs text-gray-400">Voting dApp © {new Date().getFullYear()}</p>
      <p className="text-xs text-gray-400">
        Made with ❤️ by{' '}
        <a href="https://github.com/sylverb" className="text-white hover:text-indigo-500">
          sylverb
        </a>{' '}
        &{' '}
        <a href="https://github.com/saimeunt" className="text-white hover:text-indigo-500">
          saimeunt
        </a>
      </p>
    </footer>
  );
};

export default Footer;
