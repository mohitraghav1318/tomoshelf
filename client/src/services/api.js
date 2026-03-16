const BASE_URL = 'http://localhost:5000';

export const testConnection = async () => {
  const res = await fetch(`${BASE_URL}/`);
  const data = await res.json();
  return data;
};
