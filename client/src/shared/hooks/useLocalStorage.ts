export function useLocalStorage() {
  const getItem = (item: string) => localStorage.getItem(item);
  const setItem = (key: string, value: string) => localStorage.setItem(key, value);
  const removeItem = (key: string) => localStorage.removeItem(key);
  const clearStorage = () => localStorage.clear();

  return {
    getItem, setItem, removeItem, clearStorage,
  };
}
