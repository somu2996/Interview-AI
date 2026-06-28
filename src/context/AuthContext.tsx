import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  User as FirebaseUser,
  updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../lib/firebase";
import { UserProfile } from "../types";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isDemo: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string, role: string, exp: any) => Promise<void>;
  loginAsDemo: () => void;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const DEMO_USER: UserProfile = {
  uid: "demo-user-123",
  email: "alex.chen@example.com",
  displayName: "Alex Chen (Demo)",
  photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  targetRole: "Senior Frontend Engineer",
  experienceLevel: "Mid-Level (3-5 yrs)",
  bio: "Passionate developer focusing on React, TypeScript, and modern AI integrations."
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isDemo: false,
  loginWithGoogle: async () => {},
  loginWithEmail: async () => {},
  signupWithEmail: async () => {},
  loginAsDemo: () => {},
  logout: async () => {},
  updateUserProfile: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    // Check if demo was previously active
    const demoStored = localStorage.getItem("prepai_demo_active");
    if (demoStored === "true") {
      setUser(DEMO_USER);
      setIsDemo(true);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setIsDemo(false);
        try {
          const userDocRef = doc(db, "users", fbUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            setUser(snap.data() as UserProfile);
          } else {
            const nameStr = fbUser.displayName || fbUser.email?.split('@')[0] || "Candidate";
            const newProf: UserProfile = {
              uid: fbUser.uid,
              fullName: nameStr,
              email: fbUser.email,
              createdAt: new Date().toISOString(),
              role: "Software Engineer",
              displayName: nameStr,
              photoURL: fbUser.photoURL,
              targetRole: "Software Engineer",
              experienceLevel: "Mid-Level (3-5 yrs)"
            };
            await setDoc(userDocRef, newProf);
            setUser(newProf);
          }
        } catch (err) {
          console.error("Firestore user fetch err:", err);
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || "Candidate",
            fullName: fbUser.displayName || "Candidate",
            role: "Software Engineer",
            photoURL: fbUser.photoURL,
            targetRole: "Software Engineer"
          });
        }
      } else {
        if (!isDemo) {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      localStorage.removeItem("prepai_demo_active");
      setIsDemo(false);
      const res = await signInWithPopup(auth, googleProvider);
      const fbUser = res.user;
      const userDocRef = doc(db, "users", fbUser.uid);
      const snap = await getDoc(userDocRef);
      if (!snap.exists()) {
        const nameStr = fbUser.displayName || "Candidate";
        const newProf: UserProfile = {
          uid: fbUser.uid,
          fullName: nameStr,
          email: fbUser.email,
          createdAt: new Date().toISOString(),
          role: "Software Engineer",
          displayName: nameStr,
          photoURL: fbUser.photoURL,
          targetRole: "Software Engineer",
          experienceLevel: "Mid-Level (3-5 yrs)"
        };
        await setDoc(userDocRef, newProf);
        setUser(newProf);
      } else {
        setUser(snap.data() as UserProfile);
      }
    } catch (err: any) {
      console.error("Google auth err:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      localStorage.removeItem("prepai_demo_active");
      setIsDemo(false);
      const res = await signInWithEmailAndPassword(auth, email, pass);
      const snap = await getDoc(doc(db, "users", res.user.uid));
      if (snap.exists()) {
        setUser(snap.data() as UserProfile);
      }
    } finally {
      setLoading(false);
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string, role: string, exp: any) => {
    setLoading(true);
    try {
      localStorage.removeItem("prepai_demo_active");
      setIsDemo(false);
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(res.user, { displayName: name });
      const newProf: UserProfile = {
        uid: res.user.uid,
        fullName: name,
        email: res.user.email,
        createdAt: new Date().toISOString(),
        role: role || "Software Engineer",
        displayName: name,
        photoURL: null,
        targetRole: role || "Software Engineer",
        experienceLevel: exp || "Entry-Level (0-2 yrs)"
      };
      await setDoc(doc(db, "users", res.user.uid), newProf);
      setUser(newProf);
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = () => {
    localStorage.setItem("prepai_demo_active", "true");
    setIsDemo(true);
    setUser(DEMO_USER);
  };

  const logout = async () => {
    localStorage.removeItem("prepai_demo_active");
    setIsDemo(false);
    setUser(null);
    try {
      await signOut(auth);
    } catch (e) {
      // ignore if demo
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    if (isDemo) {
      localStorage.setItem("prepai_demo_user_override", JSON.stringify(updated));
      return;
    }
    try {
      await setDoc(doc(db, "users", user.uid), updated, { merge: true });
    } catch (err) {
      console.error("Failed to update profile in firestore:", err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isDemo,
      loginWithGoogle,
      loginWithEmail,
      signupWithEmail,
      loginAsDemo,
      logout,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
