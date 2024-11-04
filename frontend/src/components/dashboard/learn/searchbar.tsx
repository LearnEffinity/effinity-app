import React, { useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search for financial topics that interest you",
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative">
        <input
          type="text"
          className="h-[56px] w-full rounded-xl bg-surface-base py-2 pl-12 pr-4 text-text-secondary focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-200"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      <button type="submit" className="hidden">
        Search
      </button>
    </form>
  );
};

export default SearchBar;

const Search = ({ className }: { className: string }) => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.1663 4.5835C11.1122 4.5835 4.58301 11.1127 4.58301 19.1668C4.58301 27.221 11.1122 33.7502 19.1663 33.7502C27.2205 33.7502 33.7497 27.221 33.7497 19.1668C33.7497 11.1127 27.2205 4.5835 19.1663 4.5835ZM2.08301 19.1668C2.08301 9.73197 9.73148 2.0835 19.1663 2.0835C28.6012 2.0835 36.2497 9.73197 36.2497 19.1668C36.2497 23.4344 34.6849 27.3364 32.0978 30.3305L37.5502 35.7829C38.0384 36.2711 38.0384 37.0626 37.5502 37.5507C37.0621 38.0389 36.2706 38.0389 35.7825 37.5507L30.33 32.0983C27.3359 34.6854 23.4339 36.2502 19.1663 36.2502C9.73148 36.2502 2.08301 28.6017 2.08301 19.1668Z"
        fill="#505055"
      />
    </svg>
  );
};
