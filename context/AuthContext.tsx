"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { StudentProfile, UserRole } from "../types";
import { useData } from "./DataContext";

/**
 * Context type representing all active user authentication, session, navigation, and theme configurations.
 */
interface AuthContextProps {
  // Session States
  isLoggedIn: boolean;
  userRoleState: string; // "student" | "pr" | "departmental" | "admin" | ""
  userName: string;
  loggedInUserId: string;
  currentStudent: StudentProfile | null;
  setCurrentStudent: React.Dispatch<React.SetStateAction<StudentProfile | null>>;

  // Navigation & UI Layouts
  activeTab: string; // "home" | "statistics" | "collaborations" | "contact" | "dashboard"
  setActiveTab: (tab: string) => void;
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;

  // Modals Visibility
  isLoginOpen: boolean;
  setIsLoginOpen: (open: boolean) => void;
  isAccountModalOpen: boolean;
  setIsAccountModalOpen: (open: boolean) => void;

  // Login Flow fields
  loginRole: "student" | "pr" | "departmental" | "admin";
  setLoginRole: (role: "student" | "pr" | "departmental" | "admin") => void;
  loginUser: string;
  setLoginUser: (user: string) => void;
  loginPass: string;
  setLoginPass: (pass: string) => void;

  // Actions
  handleLoginSubmit: (e: React.FormEvent) => void;
  handleLogout: () => void;

  // Forgot Password Flow states & actions
  showForgotPassword: boolean;
  setShowForgotPassword: (show: boolean) => void;
  forgotStep: number; // 0: Email validation, 1: OTP verification, 2: Password reset
  setForgotStep: (step: number) => void;
  forgotEmail: string;
  setForgotEmail: (email: string) => void;
  otpCode: string;
  setOtpCode: (code: string) => void;
  enteredOtp: string;
  setEnteredOtp: (otp: string) => void;
  newPassword: string;
  setNewPassword: (pass: string) => void;
  confirmPassword: string;
  setConfirmPassword: (pass: string) => void;
  forgotRole: "student" | "pr" | "departmental";
  setForgotRole: (role: "student" | "pr" | "departmental") => void;
  forgotUserEmail: string;
  setForgotUserEmail: (email: string) => void;
  handleForgotPasswordSubmit: (e: React.FormEvent) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

/**
 * Auth provider component wrapping children and linking with DataContext to retrieve active credential registries.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { users, setUsers, students, addToast } = useData();

  // Session states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRoleState, setUserRoleState] = useState("");
  const [userName, setUserName] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState("");
  const [currentStudent, setCurrentStudent] = useState<StudentProfile | null>(null);

  // Navigation & Theme
  const [activeTab, setActiveTabState] = useState("home");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Modal controls
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // Login form inputs
  const [loginRole, setLoginRole] = useState<"student" | "pr" | "departmental" | "admin">("student");
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");

  // Forgot password flow inputs
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<number>(0);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpCode, setOtpCode] = useState<string>("");
  const [enteredOtp, setEnteredOtp] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [forgotRole, setForgotRole] = useState<"student" | "pr" | "departmental">("student");
  const [forgotUserEmail, setForgotUserEmail] = useState<string>("");

  // Synchronize URL hash with active routing tab
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#/")) {
        const route = hash.replace("#/", "");
        if (route === "dashboard" && !isLoggedIn) {
          window.location.hash = "#/home";
          setActiveTabState("home");
        } else {
          setActiveTabState(route);
        }
      } else {
        window.location.hash = "#/home";
        setActiveTabState("home");
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    };

    window.addEventListener("hashchange", handleHashChange);
    // Trigger initial routing check
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [isLoggedIn]);

  /**
   * Safe setter for activeTab that also updates URL hash.
   */
  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    window.location.hash = `#/${tab}`;
  };

  /**
   * Handles user login credentials verification.
   */
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUser || !loginPass) {
      addToast("Please fill in all fields", "error");
      return;
    }

    const usernameLower = loginUser.toLowerCase();
    const matchedUser = users.find(
      (u) =>
        u.email.toLowerCase() === usernameLower &&
        u.passwordHash === loginPass &&
        u.role.toLowerCase() === loginRole.toLowerCase()
    );

    if (matchedUser) {
      if (!matchedUser.isActive) {
        addToast("Your account has been deactivated. Please contact an administrator.", "error");
        return;
      }

      setIsLoggedIn(true);
      setUserRoleState(matchedUser.role.toLowerCase());
      setLoggedInUserId(matchedUser.id);
      setIsLoginOpen(false);
      setLoginUser("");
      setLoginPass("");
      setActiveTab("dashboard");

      if (matchedUser.role === "STUDENT") {
        const student = students.find((s) => s.userId === matchedUser.id);
        if (student) {
          setCurrentStudent(student);
          setUserName(student.name);
          addToast(`Welcome back, ${student.name}!`, "success");
        }
      } else if (matchedUser.role === "PR_COORDINATOR") {
        setCurrentStudent(null);
        setUserName("PR Cell Representative");
        addToast("Welcome back, Placement Representative!", "success");
      } else if (matchedUser.role === "DEPT_COORDINATOR") {
        setCurrentStudent(null);
        setUserName("Departmental Coordinator");
        addToast("Welcome back, Departmental Coordinator!", "success");
      } else if (matchedUser.role === "ADMIN") {
        setCurrentStudent(null);
        setUserName("System Administrator");
        addToast("Welcome back, Administrator!", "success");
      }
    } else {
      addToast(`Invalid credentials for ${loginRole}.`, "error");
    }
  };

  /**
   * Resets active session details and routes user to home page.
   */
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setUserRoleState("");
    setLoggedInUserId("");
    setCurrentStudent(null);
    setActiveTab("home");
    addToast("Logged out successfully", "info");
  };

  /**
   * Handles simulated step-based forgot password OTP and password reset flow.
   */
  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailLower = forgotEmail.toLowerCase();

    if (forgotStep === 0) {
      const matchedUser = users.find(
        (u) => u.email.toLowerCase() === emailLower && u.role.toLowerCase() === forgotRole.toLowerCase()
      );
      if (matchedUser) {
        const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
        setOtpCode(generatedOtp);
        setForgotUserEmail(emailLower);
        setForgotStep(1);
        addToast(`Simulated OTP sent! Your 4-digit code is: ${generatedOtp}`, "info");
      } else {
        addToast("No account found with this email and role.", "error");
      }
    } else if (forgotStep === 1) {
      if (enteredOtp === otpCode) {
        setForgotStep(2);
        addToast("OTP Verified! Please enter a new password.", "success");
      } else {
        addToast("Invalid OTP code. Please check and try again.", "error");
      }
    } else if (forgotStep === 2) {
      if (newPassword.length < 6) {
        addToast("Password must be at least 6 characters long.", "error");
        return;
      }
      if (newPassword !== confirmPassword) {
        addToast("Passwords do not match.", "error");
        return;
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.email.toLowerCase() === forgotUserEmail && u.role.toLowerCase() === forgotRole.toLowerCase()
            ? { ...u, passwordHash: newPassword }
            : u
        )
      );

      addToast("Password reset successfully! You can now log in.", "success");
      setShowForgotPassword(false);
      setForgotStep(0);
      setForgotEmail("");
      setOtpCode("");
      setEnteredOtp("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userRoleState,
        userName,
        loggedInUserId,
        currentStudent,
        setCurrentStudent,
        activeTab,
        setActiveTab,
        theme,
        setTheme,
        isLoginOpen,
        setIsLoginOpen,
        isAccountModalOpen,
        setIsAccountModalOpen,
        loginRole,
        setLoginRole,
        loginUser,
        setLoginUser,
        loginPass,
        setLoginPass,
        handleLoginSubmit,
        handleLogout,
        showForgotPassword,
        setShowForgotPassword,
        forgotStep,
        setForgotStep,
        forgotEmail,
        setForgotEmail,
        otpCode,
        setOtpCode,
        enteredOtp,
        setEnteredOtp,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        forgotRole,
        setForgotRole,
        forgotUserEmail,
        setForgotUserEmail,
        handleForgotPasswordSubmit,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to consume the AuthContext.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
