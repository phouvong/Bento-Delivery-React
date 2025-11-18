import React from 'react';

/**
 * Highlights matching characters in text based on search query
 * @param {string} text - The text to highlight
 * @param {string} query - The search query to match
 * @returns {JSX.Element} - React element with highlighted text
 */
export const highlightMatchingText = (text, query) => {
  if (!query || !text) {
    return text;
  }

  // Escape special regex characters in query
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Create regex for case-insensitive matching
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  
  // Split text by matches
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, index) => {
        // Check if this part matches the query (case-insensitive)
        const isMatch = regex.test(part);
        regex.lastIndex = 0; // Reset regex for next test
        
        return isMatch ? (
          <span key={index} style={{ fontWeight: 'bold' }}>
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        );
      })}
    </>
  );
};