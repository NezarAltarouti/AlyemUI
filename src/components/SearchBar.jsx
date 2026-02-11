import { useEffect,useState } from "react";
import searchIcon from '../assets/search.svg'




export default function SearchBar ()
{
    const SearchBar = () => 
    {
        const [value, setvalue] = useState('');
    }

    return(
        <div style={{display: "flex", justifyContent: "center"}}>
            <div className="searchBar">
                <img src={searchIcon} alt='search icon' className='searchIcon'></img>
                <input type="search" 
                placeholder="Search"
                />
            </div>
        </div>
    );
}