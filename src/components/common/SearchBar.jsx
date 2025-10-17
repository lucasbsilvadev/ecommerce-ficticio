// src/components/common/SearchBar.jsx
import { FiSearch } from 'react-icons/fi';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <FiSearch className="search-icon" />
      <input
        type="text"
        placeholder="O que você procura?"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
