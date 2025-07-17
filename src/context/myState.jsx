import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import MyContext from './myContext';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { fireDB } from '../firebase/FirebaseConfig';
import toast from 'react-hot-toast';

function MyState({ children }) {
    const [loading, setLoading] = useState({
        notes: false,
        orders: false,
        users: false
    });

    const [notes, setNotes] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);

    const updateLoading = (key, value) => {
        setLoading((prev) => ({ ...prev, [key]: value }));
    };

    const setupSnapshotListener = useCallback((collectionName, setState, key) => {
        updateLoading(key, true);
        try {
            const q = query(collection(fireDB, collectionName), orderBy('time'));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const dataArray = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setState(dataArray);
                updateLoading(key, false);
            });
            return unsubscribe;
        } catch (error) {
            console.error(`Error fetching ${collectionName}:`, error);
            toast.error(`Failed to load ${collectionName}`);
            updateLoading(key, false);
            return () => {};
        }
    }, []);

    const getAllNotes = useCallback(() =>
        setupSnapshotListener('notes', setNotes, 'notes')
    , [setupSnapshotListener]);

    const getAllOrders = useCallback(() =>
        setupSnapshotListener('order', setOrders, 'orders')
    , [setupSnapshotListener]);

    const deleteOrder = async (id) => {
        updateLoading('orders', true);
        try {
            await deleteDoc(doc(fireDB, 'order', id));
            toast.success('Order deleted successfully');
        } catch (error) {
            console.error('Error deleting order:', error);
            toast.error('Failed to delete order');
        } finally {
            updateLoading('orders', false);
        }
    };

    const getAllUsers = useCallback(() =>
        setupSnapshotListener('user', setUsers, 'users')
    , [setupSnapshotListener]);

    useEffect(() => {
        const notesUnsubscribe = getAllNotes();
        const orderUnsubscribe = getAllOrders();
        const userUnsubscribe = getAllUsers();

        return () => {
            if (typeof notesUnsubscribe === 'function') notesUnsubscribe();
            if (typeof orderUnsubscribe === 'function') orderUnsubscribe();
            if (typeof userUnsubscribe === 'function') userUnsubscribe();
        };
    }, [getAllNotes, getAllOrders, getAllUsers]);

    return (
        <MyContext.Provider value={{
            loading,
            setLoading,
            notes,
            getAllNotes,
            orders,
            deleteOrder,
            users,
            getAllUsers
        }}>
            {children}
        </MyContext.Provider>
    );
}

MyState.propTypes = {
    children: PropTypes.node.isRequired
};

export default MyState;
