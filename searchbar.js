
        const searchInput = document.getElementById('search-input');
        const suggestionsList = document.getElementById('suggestions-list');
        const searchContainer = document.getElementById('search-container');
        // Updated API endpoint to resolve 'Failed to fetch' errors common in iframe environments.
        const API_BASE_URL = 'https://www.google.com/complete/search?client=hp&hl=en&sugexp=chrome&q=';
        let isDropdownVisible = false;

        // Function to debounce API calls
        // This limits how often the fetchSuggestions function is called
        const debounce = (func, delay) => {
            let timeoutId;
            return (...args) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
        };

        // Function to fetch suggestions from Google Suggest API
        async function fetchSuggestions(query) {
            if (query.trim().length < 2) {
                hideSuggestions();
                return;
            }

            try {
                // Fetch uses a JSONP-style response format (wrapped in an array)
                const response = await fetch(`${API_BASE_URL}${encodeURIComponent(query)}`);
                
                // Check if the response is okay (HTTP status 200-299)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // The suggestions are typically in the second element of the array
                const suggestions = data[1] || [];
                
                renderSuggestions(suggestions);

            } catch (error) {
                // Console error will now only show if there's a genuine issue, 
                // but the change in API_BASE_URL should resolve the persistent 'Failed to fetch'.
                console.error("Error fetching suggestions:", error);
                hideSuggestions();
            }
        }
