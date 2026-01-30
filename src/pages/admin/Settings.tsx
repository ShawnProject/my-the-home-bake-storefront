
import React, { useEffect, useState } from 'react';
import { fetchStoreSettings, updateStoreSettings, StoreSettings } from '../../api';
import { Save, Loader, MessageCircle, Store } from 'lucide-react';

const Settings: React.FC = () => {
    const [settings, setSettings] = useState<StoreSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const data = await fetchStoreSettings();
                if (data) {
                    setSettings(data);
                } else {
                    // Initialize with defaults if empty
                    setSettings({ id: 0, bakery_name: 'The Home Bake', whatsapp_number: '' });
                }
            } catch (err) {
                setError('Failed to load settings');
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;

        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            await updateStoreSettings({
                bakery_name: settings.bakery_name,
                whatsapp_number: settings.whatsapp_number
            });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => prev ? ({ ...prev, [name]: value }) : null);
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-display">Store Settings</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your store's public information</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1c140e] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 rounded-lg text-green-600 dark:text-green-400 text-sm">
                        Settings saved successfully!
                    </div>
                )}

                {/* Bakery Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <div className="flex items-center gap-2">
                            <Store className="w-4 h-4" />
                            Bakery Name
                        </div>
                    </label>
                    <input
                        type="text"
                        name="bakery_name"
                        required
                        value={settings?.bakery_name || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="The Home Bake"
                    />
                </div>

                {/* WhatsApp Number */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            WhatsApp Number
                        </div>
                    </label>
                    <input
                        type="text"
                        name="whatsapp_number"
                        required
                        value={settings?.whatsapp_number || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="e.g. 60123456789"
                    />
                    <p className="text-xs text-gray-500 mt-1">Format: Country code followed by number (no spaces or plus signs).</p>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;
