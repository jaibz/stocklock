import axios from 'axios';

const API_KEY = 'YOUR_FINANCIAL_API_KEY'; // Replace with your actual API key
const BASE_URL = 'https://financialmodelingprep.com/api/v3';

export async function getStockInsights(query: string): Promise<string> {
  // This is a mock function. In a real application, you would call an AI service
  // and a financial data API to generate insights based on the query.
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

  // Mock responses based on query keywords
  if (query.toLowerCase().includes('recommendation')) {
    return "Based on current market trends and company performance, some stocks to consider are: AAPL (Apple), MSFT (Microsoft), and AMZN (Amazon). However, always do your own research and consider consulting with a financial advisor before making investment decisions.";
  } else if (query.toLowerCase().includes('compare')) {
    return "When comparing stocks, it's important to look at various factors such as P/E ratio, revenue growth, and market cap. For example, comparing AAPL and MSFT: Apple has a P/E ratio of 28.5 and a market cap of $2.64T, while Microsoft has a P/E ratio of 35.9 and a market cap of $2.48T. Both companies show strong financials, but their focus areas differ.";
  } else if (query.toLowerCase().includes('trend')) {
    return "Current market trends show a shift towards AI and clean energy stocks. Companies like NVDA (NVIDIA) and TSLA (Tesla) have seen significant growth. However, there's also increased volatility due to global economic factors. It's important to diversify your portfolio to mitigate risks.";
  } else {
    // Default response for other queries
    return "I'm sorry, I don't have specific information about that query. Could you please ask about stock recommendations, comparisons between stocks, or current market trends?";
  }
}

export async function getStockQuote(symbol: string) {
  try {
    const response = await axios.get(`${BASE_URL}/quote/${symbol}?apikey=${API_KEY}`);
    return response.data[0];
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    throw error;
  }
}

export async function getStockNews(symbol: string) {
  try {
    const response = await axios.get(`${BASE_URL}/stock_news?tickers=${symbol}&limit=5&apikey=${API_KEY}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stock news:', error);
    throw error;
  }
}