import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Box, IconButton, TextField } from '@material-ui/core';
import { dbProductsData } from "../../services/product-service"
import { Clear } from '@material-ui/icons';

export function SearchProduct({ updateCollection }) {
    const [query, setQuery] = useState("");
    const timeoutTimerRef = useRef(null);

    const escapeRegexCharacters = useCallback((str) => {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }, []);

    const getSuggestions = useCallback((value) => {
        const inputValue = escapeRegexCharacters(value.trim()).toLowerCase();
        const inputLength = inputValue.length;
        if (inputValue === '' || inputLength === 0) {
            return (dbProductsData.data) ? dbProductsData.data : [];
        }

        const regex = new RegExp(inputValue, 'i');
        const productData = dbProductsData.data;
        return productData.filter(product => regex.test(product.name) || regex.test(product.cat_name) || regex.test(product.barcode));
    }, [escapeRegexCharacters]);

    const filterProduct = useCallback((searchQuery) => {
        const suggestions = getSuggestions(searchQuery);
        updateCollection(suggestions);
    }, [getSuggestions, updateCollection]);

    const searchProduct = useCallback((e) => {
        const value = e.target.value;
        setQuery(value);

        if (timeoutTimerRef.current) {
            clearTimeout(timeoutTimerRef.current);
        }

        timeoutTimerRef.current = setTimeout(() => {
            filterProduct(value);
            timeoutTimerRef.current = null;
        }, 700);
    }, [filterProduct]);

    const searchOnSubmit = useCallback((e) => {
        e.preventDefault();
        filterProduct(query);
    }, [filterProduct, query]);

    const clearSearch = useCallback(() => {
        setQuery("");
        filterProduct("");
    }, [filterProduct]);

    useEffect(() => {
        return () => {
            if (timeoutTimerRef.current) {
                clearTimeout(timeoutTimerRef.current);
            }
        };
    }, []);

    return (
        <Box pt={2}>
            <Box className="position-relative display-flex">
                <form className="width-100" onSubmit={searchOnSubmit}>
                    <TextField
                        type="text"
                        variant="outlined"
                        value={query}
                        label="Search"
                        placeholder="Search product by name or barcode or category"
                        size="small"
                        className="width-100"
                        onChange={searchProduct}
                    />
                </form>
                {query ?
                    <div className="position-relative">
                        <div className="search-clear-btn">
                            <IconButton onClick={clearSearch}>
                                <Clear />
                            </IconButton>
                        </div>
                    </div>
                    : null
                }
            </Box>

        </Box>
    )
}

export default SearchProduct
