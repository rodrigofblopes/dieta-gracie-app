import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { db, auth, googleProvider } from '../firebase';

export const useFirebaseSync = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  // Autenticação
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  // Sincronização de refeições
  const syncMeals = async (meals) => {
    if (!user) return;
    
    setSyncing(true);
    try {
      const userDoc = doc(db, 'users', user.uid);
      await setDoc(userDoc, {
        meals: meals,
        lastUpdated: new Date().toISOString(),
        email: user.email
      }, { merge: true });
      
      setLastSync(new Date());
      console.log('Dados sincronizados com sucesso!');
    } catch (error) {
      console.error('Erro na sincronização:', error);
      throw error;
    } finally {
      setSyncing(false);
    }
  };

  const loadMealsFromCloud = async () => {
    if (!user) return [];
    
    try {
      const userDoc = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDoc);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return data.meals || [];
      }
      return [];
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      return [];
    }
  };

  // Listener em tempo real
  const subscribeToMeals = (callback) => {
    if (!user) return () => {};
    
    const userDoc = doc(db, 'users', user.uid);
    return onSnapshot(userDoc, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        callback(data.meals || []);
        setLastSync(new Date());
      }
    });
  };

  // Monitorar estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    user,
    loading,
    syncing,
    lastSync,
    signInWithGoogle,
    signOutUser,
    syncMeals,
    loadMealsFromCloud,
    subscribeToMeals
  };
};
