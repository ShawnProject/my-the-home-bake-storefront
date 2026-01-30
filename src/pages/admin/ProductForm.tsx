
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductById, createProduct, updateProduct } from '../../api';
import { Product } from '../../types';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import { CATEGORIES } from '../../constants';

const ProductForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        description: '',
        price: 0,
        category: CATEGORIES[0],
        image: '',
        status: 'In Stock',
        rating: 5.0, // Default for new products
        reviews: 0,
        sizes: [], // Not handling complex variants in this simple form yet
        variants: []
    });

    useEffect(() => {
        if (isEditMode && id) {
            const loadProduct = async () => {
                try {
                    const product = await fetchProductById(id);
                    if (product) {
                        setFormData(product);
                    } else {
                        setError('Product not found');
                    }
                } catch (err) {
                    setError('Failed to load product');
                } finally {
                    setLoading(false);
                }
            };
            loadProduct();
        }
    }, [id, isEditMode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            if (isEditMode && id) {
                await updateProduct(id, formData);
            } else {
                await createProduct(formData as Omit<Product, 'id'>);
            }
            navigate('/admin/products');
        } catch (err: any) {
            setError(err.message || 'Failed to save product');
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) || 0 : value
        }));
    };

    const toggleAvailability = () => {
        setFormData(prev => ({
            ...prev,
            status: prev.status === 'In Stock' ? 'Out of Stock' : 'In Stock'
        }));
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/admin/products')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-display">
                        {isEditMode ? 'Edit Product' : 'New Product'}
                    </h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1c140e] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="e.g. Vanilla Bean Cake"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="Product description..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            step="0.01"
                            min="0"
                            required
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Image URL */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                    <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="https://..."
                    />
                    {formData.image && (
                        <div className="mt-2 w-32 h-32 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>

                {/* Availability */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={toggleAvailability}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${formData.status === 'In Stock' ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                    >
                        <span
                            className={`${formData.status === 'In Stock' ? 'translate-x-6' : 'translate-x-1'
                                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                        />
                    </button>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {formData.status === 'In Stock' ? 'Available' : 'Unavailable'}
                    </span>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Save Product
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
