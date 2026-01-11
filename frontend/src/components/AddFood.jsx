import React, { useState, useEffect } from 'react';

const AddFood = ({ onFoodAdded }) => {
    const [name, setName] = useState('');
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);

    // Cleanup object URLs to avoid memory leaks
    useEffect(() => {
        return () => {
            previews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previews]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setImages(files);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(newPreviews);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || images.length === 0) return alert('Please provide name and at least one image');

        const formData = new FormData();
        formData.append('name', name);
        // Append each file with the same key 'images'
        images.forEach((image) => {
            formData.append('images', image);
        });

        try {
            const response = await fetch('http://localhost:5000/api/foods', {
                method: 'POST',
                headers: {
                    'x-admin-password': localStorage.getItem('adminPassword')
                },
                body: formData,
            });

            if (response.ok) {
                setName('');
                setImages([]);
                setPreviews([]);
                onFoodAdded(); // callback to refresh list
                // Form isn't keeping values, states are cleared
            } else {
                const data = await response.json();
                alert(`Failed to add food: ${data.message || data.error || 'Unknown error'}`);
                console.error('Server Error:', data);
            }
        } catch (error) {
            console.error('Error adding food:', error);
            alert('Error adding food');
        }
    };

    return (
        <div className="sidebar">
            <h2>Add Item</h2>
            <form className="add-food-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Food Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Chocolate Cake"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Food Images (Select Multiple)</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        style={{ color: '#aaa', fontSize: '0.9rem' }}
                    />
                    <div className="preview-grid">
                        {previews.map((src, idx) => (
                            <div key={idx} className="preview-item">
                                <img src={src} alt={`preview-${idx}`} />
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className="primary" style={{ width: '100%' }}>Add</button>
            </form>
        </div>
    );
};

export default AddFood;
