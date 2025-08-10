export const MadeWithDyad = () => {
  return (
    <div className="p-4 text-center flex flex-col items-center space-y-1">
      <a
        href="https://github.com/bravetux"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        Designed by Bravetux
      </a>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        This website is published in{" "}
        <a
          href="https://github.com/bravetux/NewTax_Computation"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-700 dark:hover:text-gray-200"
        >
          GitHub
        </a>
      </p>
    </div>
  );
};