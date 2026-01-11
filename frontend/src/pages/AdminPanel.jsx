import React, { useState, useEffect } from 'react';
import AddFood from '../components/AddFood';
import FoodList from '../components/FoodList';
import ImageModal from '../components/ImageModal';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const [foods, setFoods] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const password = localStorage.getItem('adminPassword');
        if (password !== 'pointbreak') {
            navigate('/admin');
        }
    }, [navigate]);

    const fetchFoods = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/foods');
            const data = await response.json();
            setFoods(data);
        } catch (error) {
            console.error('Error fetching foods:', error);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    const handleFoodAdded = () => {
        fetchFoods();
    };

    const handleFoodDeleted = (id) => {
        setFoods(foods.filter((food) => food._id !== id));
    };

    const handleLogout = () => {
        localStorage.removeItem('adminPassword');
        navigate('/');
    };

    return (
        <div className="app-container">
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1>Home</h1>
                <button onClick={handleLogout} className="secondary">Logout</button>
            </div>

            {/* Left Side: Add Form */}
            <AddFood onFoodAdded={handleFoodAdded} />

            {/* Right Side: List */}
            <FoodList
                foods={foods}
                onDelete={handleFoodDeleted}
                onView={(food) => setSelectedFood(food)}
                onRefresh={fetchFoods}
                readOnly={false}
            />

            {/* Modal */}
            {selectedFood && (
                <ImageModal
                    images={selectedFood.images}
                    onClose={() => setSelectedFood(null)}
                />
            )}
        </div>
    );
};

export default AdminPanel;
