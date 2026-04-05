const productTypes = ['Shirt', 'Pants', 'Jeans', 'Jacket', 'Sweater', 'Tee', 'Dress', 'Skirt', 'Tank', 'Hoodie'];
const brands = ['Urban Threads', 'Modern Fit', 'Street Style', 'Beach Breeze', 'Fashionista', 'ChicStyle'];
const colors = [
  'bg-red-500', 'bg-blue-600', 'bg-black', 'bg-green-600', 
  'bg-yellow-400', 'bg-gray-500', 'bg-white border border-gray-300', 
  'bg-pink-300', 'bg-orange-200'
];
const materials = ['Cotton', 'Wool', 'Denim', 'Polyester', 'Silk', 'Linen', 'Viscose', 'Fleece'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const getRandomEl = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomArr = (arr, count) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};
const getRandomPrice = (min, max) => (Math.random() * (max - min) + min).toFixed(2);
const getRandomDate = () => {
    const start = new Date(2023, 0, 1);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
};

const generateProducts = () => {
  const generatedProducts = [];
  let idCounter = 1;

  // Generate 50 Men's products
  for (let i = 0; i < 50; i++) {
    const type = getRandomEl(productTypes);
    const category = ['Pants', 'Jeans', 'Skirt'].includes(type) ? 'Bottom Wear' : 'Top Wear';
    
    generatedProducts.push({
      id: idCounter++,
      name: `Men's ${getRandomEl(['Classic', 'Modern', 'Slim-Fit', 'Oversized'])} ${type}`,
      price: parseFloat(getRandomPrice(15, 95)),
      image: `https://picsum.photos/seed/men${idCounter}/500/700`,
      category: category,
      gender: 'Men',
      color: getRandomEl(colors),
      size: getRandomArr(sizes, Math.floor(Math.random() * 3) + 2),
      material: getRandomEl(materials),
      brand: getRandomEl(brands),
      dateAdded: getRandomDate(),
    });
  }

  // Generate 50 Women's products
  for (let i = 0; i < 50; i++) {
    const type = getRandomEl(productTypes);
    const category = ['Pants', 'Jeans', 'Skirt'].includes(type) ? 'Bottom Wear' : 'Top Wear';

    generatedProducts.push({
      id: idCounter++,
      name: `Women's ${getRandomEl(['Elegant', 'Casual', 'Chic', 'Summer'])} ${type}`,
      price: parseFloat(getRandomPrice(15, 95)),
      image: `https://picsum.photos/seed/women${idCounter}/500/700`,
      category: category,
      gender: 'Women',
      color: getRandomEl(colors),
      size: getRandomArr(sizes, Math.floor(Math.random() * 3) + 2),
      material: getRandomEl(materials),
      brand: getRandomEl(brands),
      dateAdded: getRandomDate(),
    });
  }

  return generatedProducts;
};

export const mockProducts = generateProducts();
