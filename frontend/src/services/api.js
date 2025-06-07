export const fetchNews = async (query = '', page = 1, pageSize = 20) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    throw new Error('API URL is not configured. Please check your .env file.');
  }

  const url = new URL(`${apiUrl}/api/news`);
  url.searchParams.append('page', page);
  url.searchParams.append('pageSize', pageSize);
  if (query) {
    url.searchParams.append('q', encodeURIComponent(query));
  }
  url.searchParams.append('show-fields', 'thumbnail');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch news: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    if (!data.response || !data.response.results) {
      throw new Error('Invalid response format from server');
    }

    return {
      results: data.response.results,
      totalPages: data.response.pages,
    };
  } catch (error) {
    console.error('Fetch error:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      attemptedUrl: url.toString(),
    });
    throw new Error('Unable to load news. Please try again later.');
  }
};