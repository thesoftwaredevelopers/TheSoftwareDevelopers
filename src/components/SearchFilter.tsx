import React from 'react';
import { Search } from 'react-bootstrap-icons';
import { Button } from 'react-bootstrap';

interface SearchBarProps {
  search: string;
  setSearch: (search: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, setSearch }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
        }}
      >
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleChange}
          style={{
            backgroundColor: 'white',
            borderColor: 'rgba(180, 156, 200, 0.5)',
            borderRadius: '25px 0 0 25px',
            height: '50px',
            fontSize: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        />
        <Button
          variant="outline-secondary"
          style={{
            backgroundColor: '#b49cc8',
            color: 'white',
            borderColor: 'rgba(180, 156, 200, 0.5)',
            borderRadius: '0 25px 25px 0',
            height: '50px',
            width: '60px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Search size={24} />
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
