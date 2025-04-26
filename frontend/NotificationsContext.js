import React, { createContext, useState, useEffect } from "react";
import { supabase } from "./SupabaseClient";

export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", (await supabase.auth.getUser()).data.user.id)
      .eq("status", "pending");

    if (!error) {
      setNotifications(data);
    } else {
      console.error("Error fetching notifications:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // refresh every 1 min
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationsContext.Provider
      value={{ notifications, fetchNotifications, loading }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
