import { useMemo } from "react";
import React from "react"; // Needed for React.isValidElement and React.Children

// Assuming BentoItem interface is defined elsewhere, e.g., in src/types.ts
import { BentoItem } from "@/types"; // Import the BentoItem interface

const useFilteredItems = (
    items: BentoItem[],
    searchTerm: string,
    selectedTag: string | null
): BentoItem[] => {
    const filteredItems = useMemo(() => {
        return items.filter(item => {
            // Tag Filter
            // This assumes BentoItem has an optional 'tags' property: tags?: string[];
            const matchesTag = !selectedTag || (item.tags && item.tags.includes(selectedTag));
            // If item.tags is not defined, it won't match any selectedTag unless selectedTag is null

            // Search Filter
            const searchTermLower = searchTerm.toLowerCase();
            let contentString = '';

            // Extract text content for searching
            if (typeof item.content === 'string') {
                contentString = item.content.toLowerCase();
            } else if (item.url) {
                // Include URL in search
                contentString += item.url.toLowerCase();
            }

            // Add rudimentary search within simple React node structures (e.g., text in <p>, <strong>)
            try {
                if (React.isValidElement(item.content)) {
                     React.Children.forEach(item.content.props.children, child => {
                         if (typeof child === 'string') {
                             contentString += child.toLowerCase();
                         } else if (React.isValidElement(child) && typeof child.props.children === 'string') {
                              contentString += child.props.children.toLowerCase();
                         }
                     });
                }
            } catch (e) { /* Ignore errors during simple search */ }


            const matchesSearch = !searchTerm || contentString.includes(searchTermLower);

            return matchesTag && matchesSearch;
        });
    }, [items, searchTerm, selectedTag]); // Dependencies for memoization

    return filteredItems;
};

export default useFilteredItems;
import { useMemo } from "react";
import React from "react"; // Needed for React.isValidElement and React.Children

// Assuming BentoItem interface is defined elsewhere, e.g., in src/types.ts
import { BentoItem } from "@/types"; // Import the BentoItem interface

const useFilteredItems = (
    items: BentoItem[],
    searchTerm: string,
    selectedTag: string | null
): BentoItem[] => {
    const filteredItems = useMemo(() => {
        return items.filter(item => {
            // Tag Filter
            // This assumes BentoItem has an optional 'tags' property: tags?: string[];
            const matchesTag = !selectedTag || (item.tags && item.tags.includes(selectedTag));
            // If item.tags is not defined, it won't match any selectedTag unless selectedTag is null

            // Search Filter
            const searchTermLower = searchTerm.toLowerCase();
            let contentString = '';

            // Extract text content for searching
            if (typeof item.content === 'string') {
                contentString = item.content.toLowerCase();
            } else if (item.url) {
                // Include URL in search
                contentString += item.url.toLowerCase();
            }

            // Add rudimentary search within simple React node structures (e.g., text in <p>, <strong>)
            try {
                if (React.isValidElement(item.content)) {
                     React.Children.forEach(item.content.props.children, child => {
                         if (typeof child === 'string') {
                             contentString += child.toLowerCase();
                         } else if (React.isValidElement(child) && typeof child.props.children === 'string') {
                              contentString += child.props.children.toLowerCase();
                         }
                     });
                }
            } catch (e) { /* Ignore errors during simple search */ }


            const matchesSearch = !searchTerm || contentString.includes(searchTermLower);

            return matchesTag && matchesSearch;
        });
    }, [items, searchTerm, selectedTag]); // Dependencies for memoization

    return filteredItems;
};

export default useFilteredItems;