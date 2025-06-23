import { Navigate, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Loader from '../components/loader/Loader';

const ProtectedRouteForAdmin = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isValid, setIsValid] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const verifyAdmin = () => {
            try {
                const userData = localStorage.getItem('users');

                if (!userData) throw new Error('No user data found');

                const user = JSON.parse(userData);

                if (!user?.role) throw new Error('Invalid user role');

                setIsValid(user.role === "admin");
            } catch (error) {
                console.error("Authentication error:", error);
                localStorage.removeItem('users');
                setIsValid(false);
            } finally {
                setIsLoading(false);
            }
        };

        verifyAdmin();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader />
                <span className="sr-only">Verifying authentication...</span>
            </div>
        );
    }

    if (!isValid) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return children;
};

ProtectedRouteForAdmin.propTypes = {
    children: PropTypes.node.isRequired
};

export default ProtectedRouteForAdmin;
