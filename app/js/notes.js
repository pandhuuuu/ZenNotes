// ============================================
// ZenNotes — Notes CRUD Module
// ============================================

import { supabase } from './supabase.js';

/**
 * Get today's date formatted as YYYY-MM-DD
 * @returns {string}
 */
export function getTodayDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Format a date string to a human-readable label
 * e.g., "2026-07-19" → "19 Jul 2026"
 * @param {string} dateStr - YYYY-MM-DD format
 * @returns {string}
 */
export function formatDateLabel(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

/**
 * Format a date string to a full display
 * e.g., "2026-07-19" → "Saturday, July 19, 2026"
 * @param {string} dateStr - YYYY-MM-DD format
 * @returns {string}
 */
export function formatDateFull(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Fetch today's note for the current user
 * @returns {Promise<object|null>} - The note row or null
 */
export async function fetchTodayNote() {
    const today = getTodayDateString();
    const { data, error } = await supabase
        .from('daily_notes')
        .select('*')
        .eq('note_date', today)
        .maybeSingle();

    if (error) throw error;
    return data;
}

/**
 * Fetch a specific note by date
 * @param {string} dateStr - YYYY-MM-DD format
 * @returns {Promise<object|null>}
 */
export async function fetchNoteByDate(dateStr) {
    const { data, error } = await supabase
        .from('daily_notes')
        .select('*')
        .eq('note_date', dateStr)
        .maybeSingle();

    if (error) throw error;
    return data;
}

/**
 * Fetch all notes for the current user, ordered by date descending
 * @returns {Promise<Array>}
 */
export async function fetchAllNotes() {
    const { data, error } = await supabase
        .from('daily_notes')
        .select('id, note_date, content, updated_at')
        .order('note_date', { ascending: false });

    if (error) throw error;
    return data || [];
}

/**
 * Upsert (insert or update) a note for a given date
 * Uses the unique_user_date constraint for conflict resolution
 * @param {string} dateStr - YYYY-MM-DD format
 * @param {string} content - Note text content
 * @param {string} userId - User UUID
 * @returns {Promise<object>}
 */
export async function upsertNote(dateStr, content, userId) {
    const { data, error } = await supabase
        .from('daily_notes')
        .upsert(
            {
                user_id: userId,
                note_date: dateStr,
                content: content,
            },
            {
                onConflict: 'user_id,note_date',
            }
        )
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Delete a note by its ID
 * @param {string} noteId - UUID of the note
 * @returns {Promise<void>}
 */
export async function deleteNote(noteId) {
    const { error } = await supabase
        .from('daily_notes')
        .delete()
        .eq('id', noteId);

    if (error) throw error;
}

/**
 * Download all notes as a JSON backup file
 * @returns {Promise<void>}
 */
export async function downloadBackup() {
    const notes = await fetchAllNotes();

    const exportData = {
        app: 'ZenNotes',
        exported_at: new Date().toISOString(),
        total_entries: notes.length,
        entries: notes.map(n => ({
            date: n.note_date,
            content: n.content,
            last_modified: n.updated_at,
        })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zennotes_backup_${getTodayDateString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
