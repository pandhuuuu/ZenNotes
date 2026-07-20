// ============================================
// ZenNotes — Main Application Orchestrator
// ============================================

import { AUTOSAVE_DELAY, RETRY_DELAY } from './config.js';
import { signUp, signIn, signOut, getSession, onAuthStateChange } from './auth.js';
import {
    getTodayDateString,
    formatDateFull,
    fetchTodayNote,
    fetchNoteByDate,
    fetchAllNotes,
    upsertNote,
    downloadBackup,
} from './notes.js';
import {
    showAuthOverlay,
    hideAuthOverlay,
    setAuthMode,
    showAuthError,
    hideAuthError,
    setAuthLoading,
    toggleSidebar,
    renderHistoryList,
    filterHistoryList,
    setHeaderDate,
    updateCloudStatus,
    setEditorContent,
    getEditorContent,
    updateWordCharCount,
    enableFocusMode,
    disableFocusMode,
    setUserEmail,
    showAppLoading,
    hideAppLoading,
} from './ui.js';

// ── Application State ───────────────────────
let currentUser = null;
let currentDate = getTodayDateString();
let allNotes = [];
let debounceTimer = null;
let retryTimer = null;
let authMode = 'login'; // 'login' or 'register'

// ── DOM References ──────────────────────────
const $ = (sel) => document.querySelector(sel);

// ── Initialization ──────────────────────────
async function init() {
    showAppLoading();

    // Set up auth state listener first
    onAuthStateChange(handleAuthStateChange);

    // Check for existing session
    const session = await getSession();
    if (session?.user) {
        currentUser = session.user;
        await enterApp();
    } else {
        showAuthOverlay();
        hideAppLoading();
    }

    // Bind all event listeners
    bindEventListeners();
}

// ── Auth State Change Handler ───────────────
function handleAuthStateChange(event, session) {
    if (event === 'SIGNED_IN' && session?.user) {
        currentUser = session.user;
        hideAuthOverlay();
        enterApp();
    } else if (event === 'SIGNED_OUT') {
        currentUser = null;
        allNotes = [];
        setEditorContent('');
        showAuthOverlay();
    }
}

// ── Enter Main App ──────────────────────────
async function enterApp() {
    hideAuthOverlay();
    hideAppLoading();
    setUserEmail(currentUser.email);

    // Load today's note
    currentDate = getTodayDateString();
    await loadNoteForDate(currentDate);

    // Load sidebar history
    await refreshSidebarHistory();
}

// ── Load Note by Date ───────────────────────
async function loadNoteForDate(dateStr) {
    currentDate = dateStr;
    setHeaderDate(formatDateFull(dateStr));

    try {
        const note = await fetchNoteByDate(dateStr);
        setEditorContent(note?.content || '');
        updateCloudStatus('saved');
    } catch (err) {
        console.error('Failed to load note:', err);
        setEditorContent('');
        updateCloudStatus('error');
    }

    // Determine if this date is today → set editor editable or readonly
    const isToday = dateStr === getTodayDateString();
    const editor = $('#zen-editor');
    editor.readOnly = !isToday;
    editor.classList.toggle('opacity-60', !isToday);
    editor.placeholder = isToday
        ? 'Write down whatever is on your mind or heart today...'
        : 'Viewing past entry (read-only)';
}

// ── Refresh Sidebar History ─────────────────
async function refreshSidebarHistory() {
    try {
        allNotes = await fetchAllNotes();
        renderHistoryList(allNotes, currentDate, handleDateClick);
    } catch (err) {
        console.error('Failed to load history:', err);
    }
}

// ── Handle Date Click from Sidebar ──────────
function handleDateClick(dateStr) {
    loadNoteForDate(dateStr);
    // Update active state in sidebar
    renderHistoryList(allNotes, dateStr, handleDateClick);
}

// ── Debounced Autosave ──────────────────────
function handleEditorInput() {
    const text = getEditorContent();
    updateWordCharCount(text);

    // Only autosave if viewing today's note
    if (currentDate !== getTodayDateString()) return;

    // Clear any existing timers
    clearTimeout(debounceTimer);
    clearTimeout(retryTimer);

    // Show "saving" indicator immediately
    updateCloudStatus('saving');

    // Set debounce timer
    debounceTimer = setTimeout(async () => {
        try {
            await upsertNote(currentDate, text, currentUser.id);
            updateCloudStatus('saved');

            // Refresh sidebar to update snippets
            await refreshSidebarHistory();
        } catch (err) {
            console.error('Autosave failed:', err);
            updateCloudStatus('error');

            // Retry after delay
            retryTimer = setTimeout(() => {
                handleEditorInput();
            }, RETRY_DELAY);
        }
    }, AUTOSAVE_DELAY);
}

// ── Event Listeners ─────────────────────────
function bindEventListeners() {
    // ── Auth Form ──
    const authForm = $('#auth-form');
    authForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAuthError();
        setAuthLoading(true);

        const email = $('#auth-email').value.trim();
        const password = $('#auth-password').value;

        try {
            if (authMode === 'login') {
                await signIn(email, password);
            } else {
                await signUp(email, password);
            }
            // Auth state change handler will take over from here
        } catch (err) {
            showAuthError(err.message || 'Authentication failed. Please try again.');
        } finally {
            setAuthLoading(false);
        }
    });

    // ── Auth Tab Toggle ──
    $('#auth-tab-login')?.addEventListener('click', () => {
        authMode = 'login';
        setAuthMode('login');
        hideAuthError();
    });

    $('#auth-tab-register')?.addEventListener('click', () => {
        authMode = 'register';
        setAuthMode('register');
        hideAuthError();
    });

    // ── Auth Toggle Link ──
    $('#auth-toggle-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        authMode = authMode === 'login' ? 'register' : 'login';
        setAuthMode(authMode);
        hideAuthError();
    });

    // ── Editor Input ──
    $('#zen-editor')?.addEventListener('input', handleEditorInput);

    // ── Tab Indent Support ──
    $('#zen-editor')?.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const editor = e.target;
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            editor.value =
                editor.value.substring(0, start) + '\t' + editor.value.substring(end);
            editor.selectionStart = editor.selectionEnd = start + 1;
        }
    });

    // ── Focus Mode ──
    $('#zen-editor')?.addEventListener('focus', () => {
        enableFocusMode();
    });

    $('#zen-editor')?.addEventListener('blur', () => {
        disableFocusMode();
    });

    // ── Sidebar Toggle ──
    $('#sidebar-toggle')?.addEventListener('click', toggleSidebar);
    $('#sidebar-overlay')?.addEventListener('click', toggleSidebar);

    // ── Search ──
    $('#search-input')?.addEventListener('input', (e) => {
        filterHistoryList(e.target.value);
    });

    // ── Write Today ──
    $('#btn-write-today')?.addEventListener('click', () => {
        const today = getTodayDateString();
        loadNoteForDate(today);
        renderHistoryList(allNotes, today, handleDateClick);
    });

    // ── Download Backup ──
    $('#btn-download-backup')?.addEventListener('click', async () => {
        try {
            await downloadBackup();
        } catch (err) {
            console.error('Backup download failed:', err);
        }
    });

    // ── Sign Out ──
    $('#btn-sign-out')?.addEventListener('click', async () => {
        try {
            await signOut();
        } catch (err) {
            console.error('Sign out failed:', err);
        }
    });

    // ── Manual Sync ──
    $('#btn-sync')?.addEventListener('click', async () => {
        if (!currentUser) return;
        updateCloudStatus('saving');
        try {
            const text = getEditorContent();
            if (currentDate === getTodayDateString()) {
                await upsertNote(currentDate, text, currentUser.id);
            }
            await refreshSidebarHistory();
            updateCloudStatus('saved');
        } catch (err) {
            console.error('Manual sync failed:', err);
            updateCloudStatus('error');
        }
    });

    // ── Scroll-based header opacity ──
    const mainContent = $('main');
    mainContent?.addEventListener('scroll', () => {
        const header = $('#header');
        if (!header) return;
        const opacity = Math.max(0.4, 1 - mainContent.scrollTop / 300);
        header.style.opacity = opacity;
    });

    // ── Responsive sidebar on resize ──
    window.addEventListener('resize', () => {
        const sidebar = $('#sidebar');
        const overlay = $('#sidebar-overlay');
        if (window.innerWidth >= 1024) {
            sidebar.classList.remove('-translate-x-full');
            sidebar.classList.add('translate-x-0');
            overlay.classList.add('opacity-0', 'pointer-events-none');
            overlay.classList.remove('opacity-100');
        }
    });
}

// ── Start the application ───────────────────
document.addEventListener('DOMContentLoaded', init);
