// ============================================
// ZenNotes — Authentication Module
// ============================================

import { supabase } from './supabase.js';

/**
 * Register a new user with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{user: object}>}
 */
export async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    if (error) throw error;
    return data;
}

/**
 * Sign in an existing user with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{user: object, session: object}>}
 */
export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data;
}

/**
 * Sign out the current user
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

/**
 * Get the current session (if any)
 * @returns {Promise<object|null>}
 */
export async function getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
}

/**
 * Subscribe to auth state changes
 * @param {function} callback - Called with (event, session)
 * @returns {object} subscription
 */
export function onAuthStateChange(callback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return subscription;
}
