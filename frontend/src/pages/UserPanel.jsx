import React, { useState, useEffect } from 'react';
import FoodList from '../components/FoodList';
import ImageModal from '../components/ImageModal';
import { Link } from 'react-router-dom';

const UserPanel = () => {
    const [foods, setFoods] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null);

    const fetchFoods = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/foods`);
            const data = await response.json();
            setFoods(data);
        } catch (error) {
            console.error('Error fetching foods:', error);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    return (
        <div className="app-container" style={{ display: 'block', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <p>Welcome! Browse our exquisite selection.</p>
                <Link to="/admin" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Admin Login</Link>
            </div>

            <FoodList
                foods={foods}
                onView={(food) => setSelectedFood(food)}
                readOnly={true}
            />

            {selectedFood && (
                <ImageModal
                    images={selectedFood.images}
                    onClose={() => setSelectedFood(null)}
                />
            )}
        </div>
    );
};

export default UserPanel;
