// Singleton to generate unique IDs across the application
const createIdGenerator = () => {
    let counter = 0;
  
    return (prefix = "") => {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2);
      return `${prefix}${timestamp}-${counter++}-${random}`;
    };
  };
  
  // Export a single instance of the ID generator
  export const generateUniqueId = createIdGenerator();