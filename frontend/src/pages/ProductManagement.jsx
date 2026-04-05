import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../utils/axiosInstance';
import { fetchAllProducts } from '../redux/slices/adminSlice';
import { updateProduct, deleteProduct } from '../redux/slices/adminproductSlice';
import { toast } from 'sonner';

const ProductManagement = () => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state) => state.admin);
    const { success } = useSelector((state) => state.adminProduct);

    useEffect(() => {
        dispatch(fetchAllProducts());
    }, [dispatch, success]);

    const [editingProduct, setEditingProduct] = useState(null);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            dispatch(deleteProduct(id));
        }
    };

    const handleEdit = (product) => {
        setEditingProduct({ ...product });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        dispatch(updateProduct({ id: editingProduct._id, productData: editingProduct }));
        setEditingProduct(null); // Go back to list
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingProduct({ ...editingProduct, [name]: value });
    };

    const [uploadingImage, setUploadingImage] = useState(false);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            setUploadingImage(true);
            const { data } = await axiosInstance.post('/api/upload', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const uploadedImgObj = { url: data.url, altText: editingProduct.name || "Product Image" };
            
            setEditingProduct({
                ...editingProduct,
                images: [...(editingProduct.images || []), uploadedImgObj]
            });
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Failed to upload image.");
        } finally {
            setUploadingImage(false);
        }
    };
    // --- Render Edit Form View ---
    if (editingProduct) {
        return (
            <div className="max-w-3xl mx-auto w-full bg-white p-8 rounded shadow-sm border border-gray-100">
                <h2 className="text-3xl font-bold mb-8 text-gray-900">Edit Product</h2>
                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Product Name</label>
                        <input type="text" name="name" value={editingProduct.name || ''} onChange={handleChange} className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-gray-400" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
                        <textarea name="description" value={editingProduct.description || ''} onChange={handleChange} rows="4" className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-gray-400" required></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Price</label>
                        <input type="number" step="0.01" name="price" value={editingProduct.price || 0} onChange={handleChange} className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-gray-400" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Count in Stock</label>
                        <input type="number" name="countInStock" value={editingProduct.countInStock || 0} onChange={handleChange} className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-gray-400" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">SKU</label>
                        <input type="text" name="sku" value={editingProduct.sku || ''} onChange={handleChange} className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-gray-400" required />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Upload Image (Cloudinary)</label>
                        <input type="file" onChange={handleImageUpload} className="mb-4 block w-full text-sm text-gray-900" disabled={uploadingImage} />
                        {uploadingImage && <p className="text-sm text-blue-500 font-bold mb-4">Uploading secure asset via Cloudinary...</p>}
                        
                        <div className="flex gap-4 flex-wrap mt-2">
                            {editingProduct.images && editingProduct.images.length > 0 && editingProduct.images.map((img, idx) => (
                                <div key={idx} className="relative group">
                                    <img src={img.url || img} alt="Product Preview" className="w-24 h-32 object-cover rounded shadow-md border border-gray-200" />
                                </div>
                            ))}
                            {/* Empty square placeholder */}
                            <div className="w-24 h-32 bg-gray-50 rounded flex items-center justify-center border border-gray-200 border-dashed">
                                <span className="text-gray-400 text-2xl">+</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                        <button type="submit" className="w-full bg-[#1e9944] hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition-colors shadow-sm text-lg">
                            Update Product
                        </button>
                        <button type="button" onClick={() => setEditingProduct(null)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded transition-colors text-lg">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    // --- Render List View ---
    return (
        <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 tracking-tight text-left">Product Management</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    {loading ? (
                        <p className="p-4">Loading products...</p>
                    ) : (
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[#f4f5f7]">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest">NAME</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest">PRICE</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest">SKU</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-widest">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map(product => (
                                <tr key={product._id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-5 font-bold text-gray-700">{product.name}</td>
                                    <td className="px-6 py-5 text-gray-500">${Number(product.price).toFixed(2)}</td>
                                    <td className="px-6 py-5 text-gray-500">{product.sku}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleEdit(product)} 
                                                className="bg-[#f1c40f] hover:bg-yellow-500 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(product._id)} 
                                                className="bg-[#e74c3c] hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductManagement;
