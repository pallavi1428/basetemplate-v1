import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && search.trim() !== "") {
            navigate(`/search?q=${encodeURIComponent(search.trim())}`);
            setSearch("");
        }
    };

    return (
        <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyPress}
            className="search-input-class"
        />
    );
};

export default SearchBar;
