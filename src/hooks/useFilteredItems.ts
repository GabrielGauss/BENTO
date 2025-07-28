import { useMemo } from "react";
import type { BentoItem } from "../types/bento"; // Import the BentoItem interface

const useFilteredItems = (
    items: BentoItem[],
    searchTerm: string,
    selectedTag: string | null
): BentoItem[] => {
    const filteredItems = useMemo(() => {
        console.log('🔍 useFilteredItems called with:', { 
            itemsCount: items.length, 
            selectedTag, 
            searchTerm,
            items: items.map(item => ({ id: item.id, tags: item.tags, title: item.title }))
        });
        
        return items.filter(item => {
            // Tag Filter - Fix: Use exact match for tag filtering
            const matchesTag = !selectedTag || (item.tags && item.tags.some(tag => 
                tag.toLowerCase() === selectedTag.toLowerCase()
            ));

            // Search Filter
            const searchTermLower = searchTerm.toLowerCase();
            let searchableText = '';

            // Add title to search
            if (item.title) {
                searchableText += item.title.toLowerCase() + ' ';
            }

            // Add content to search
            if (typeof item.content === 'string') {
                searchableText += item.content.toLowerCase() + ' ';
            }

            // Add URL to search
            if (item.url) {
                searchableText += item.url.toLowerCase() + ' ';
            }

            // Add tags to search
            if (item.tags && item.tags.length > 0) {
                searchableText += item.tags.join(' ').toLowerCase() + ' ';
            }

            // Add comment to search
            if (item.comment) {
                searchableText += item.comment.toLowerCase() + ' ';
            }

            // Add type to search
            if (item.type) {
                searchableText += item.type.toLowerCase() + ' ';
            }

            const matchesSearch = !searchTerm || searchableText.includes(searchTermLower);

            console.log(`📋 Item ${item.id} (${item.title}):`, { 
                matchesTag, 
                matchesSearch, 
                tags: item.tags, 
                selectedTag,
                willShow: matchesTag && matchesSearch
            });
            
            return matchesTag && matchesSearch;
        });
    }, [items, searchTerm, selectedTag]); // Dependencies for memoization

    console.log('✅ Filtered items result:', filteredItems.length, 'items');
    return filteredItems;
};

export default useFilteredItems;