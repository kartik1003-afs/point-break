import React, { useRef } from 'react';

const FoodList = ({ foods, onDelete, onView, onRefresh, readOnly }) => {
    const fileInputRefs = useRef({});

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to remove this exquisite item?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/foods/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'x-admin-password': localStorage.getItem('adminPassword')
                    }
                });
                if (response.ok) {
                    onDelete(id);
                }
            } catch (error) {
                console.error('Error deleting:', error);
            }
        }
    };

    const handleAddPhotoClick = (e, id) => {
        e.stopPropagation();
        if (fileInputRefs.current[id]) {
            fileInputRefs.current[id].click();
        }
    };

    const handleFileChange = async (e, id) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append('images', file);
        });

        try {
            const response = await fetch(`http://localhost:5000/api/foods/${id}/images`, {
                method: 'POST',
                headers: {
                    'x-admin-password': localStorage.getItem('adminPassword')
                },
                body: formData,
            });

            if (response.ok) {
                alert('Photos added successfully! ✨');
                onRefresh(); // Refresh list to update badge
            } else {
                alert('Failed to upload photos.');
            }
        } catch (error) {
            console.error('Error uploading:', error);
            alert('Error uploading photos.');
        }

        // Reset input
        e.target.value = null;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div>
            <h2 style={{ borderColor: 'var(--accent)' }}>Items</h2>
            {foods.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    The menu is currently empty. Begin your curation...
                </p>
            ) : (
                <div className="food-grid">
                    {foods.map((food) => (
                        <div key={food._id} className="food-card">
                            <div className="card-image-container" onClick={() => onView(food)}>
                                {food.images && food.images.length > 0 ? (
                                    <img
                                        src={food.images[0]}
                                        alt={food.name}
                                    />
                                ) : (
                                    <div style={{
                                        width: '100%', height: '100%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#555', background: '#111'
                                    }}>
                                        No Image
                                    </div>
                                )}

                                {food.images && food.images.length > 1 && (
                                    <div className="image-count-badge">+{food.images.length - 1}</div>
                                )}
                            </div>

                            <div className="card-content">
                                <div className="card-header">
                                    <h3>{food.name}</h3>
                                </div>
                                <div className="food-date">{formatDate(food.createdAt)}</div>

                                <div className="card-actions">
                                    {!readOnly && (
                                        <button className="secondary" onClick={(e) => handleAddPhotoClick(e, food._id)}>
                                            Add Photo
                                        </button>
                                    )}
                                    <button className="primary" onClick={() => onView(food)}>
                                        Gallery
                                    </button>
                                    {!readOnly && (
                                        <button className="danger" onClick={(e) => handleDelete(e, food._id)}>
                                            Delete
                                        </button>
                                    )}
                                </div>

                                {/* Hidden File Input */}
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    ref={(el) => (fileInputRefs.current[food._id] = el)}
                                    onChange={(e) => handleFileChange(e, food._id)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FoodList;
