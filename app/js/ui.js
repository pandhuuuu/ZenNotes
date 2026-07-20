// ============================================
// ZenNotes — UI Module (DOM Manipulation)
// ============================================

import { formatDateLabel } from './notes.js';

// ── DOM References ──────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ── Auth Overlay ────────────────────────────

export function showAuthOverlay() {
    const overlay = $('#auth-overlay');
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    overlay.classList.add('opacity-100');
}

export function hideAuthOverlay() {
    const overlay = $('#auth-overlay');
    overlay.classList.add('opacity-0', 'pointer-events-none');
    overlay.classList.remove('opacity-100');
}

export function setAuthMode(mode) {
    const loginTab = $('#auth-tab-login');
    const registerTab = $('#auth-tab-register');
    const submitBtn = $('#auth-submit-btn');
    const authTitle = $('#auth-title');
    const authToggleText = $('#auth-toggle-text');
    const authToggleLink = $('#auth-toggle-link');

    if (mode === 'login') {
        loginTab.classList.add('text-on-surface', 'border-b-2', 'border-primary');
        loginTab.classList.remove('text-on-surface-variant/50');
        registerTab.classList.remove('text-on-surface', 'border-b-2', 'border-primary');
        registerTab.classList.add('text-on-surface-variant/50');
        submitBtn.textContent = 'Sign In';
        authTitle.textContent = 'Welcome Back';
        authToggleText.textContent = "Don't have an account?";
        authToggleLink.textContent = 'Create one';
    } else {
        registerTab.classList.add('text-on-surface', 'border-b-2', 'border-primary');
        registerTab.classList.remove('text-on-surface-variant/50');
        loginTab.classList.remove('text-on-surface', 'border-b-2', 'border-primary');
        loginTab.classList.add('text-on-surface-variant/50');
        submitBtn.textContent = 'Create Account';
        authTitle.textContent = 'Create Account';
        authToggleText.textContent = 'Already have an account?';
        authToggleLink.textContent = 'Sign in';
    }
}

export function showAuthError(message) {
    const el = $('#auth-error');
    el.textContent = message;
    el.classList.remove('opacity-0');
    el.classList.add('opacity-100');
}

export function hideAuthError() {
    const el = $('#auth-error');
    el.textContent = '';
    el.classList.add('opacity-0');
    el.classList.remove('opacity-100');
}

export function setAuthLoading(loading) {
    const btn = $('#auth-submit-btn');
    const spinner = $('#auth-spinner');

    if (loading) {
        btn.disabled = true;
        btn.classList.add('opacity-50');
        spinner.classList.remove('hidden');
    } else {
        btn.disabled = false;
        btn.classList.remove('opacity-50');
        spinner.classList.add('hidden');
    }
}

// ── Sidebar ─────────────────────────────────

let sidebarOpen = false;

export function toggleSidebar() {
    const sidebar = $('#sidebar');
    const overlay = $('#sidebar-overlay');

    sidebarOpen = !sidebarOpen;

    if (sidebarOpen) {
        sidebar.classList.remove('-translate-x-full');
        sidebar.classList.add('translate-x-0');
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        overlay.classList.add('opacity-100');
    } else {
        sidebar.classList.add('-translate-x-full');
        sidebar.classList.remove('translate-x-0');
        overlay.classList.add('opacity-0', 'pointer-events-none');
        overlay.classList.remove('opacity-100');
    }
}

export function showDesktopSidebar() {
    const sidebar = $('#sidebar');
    sidebar.classList.remove('-translate-x-full');
    sidebar.classList.add('translate-x-0', 'lg:relative', 'lg:w-1/4');
    sidebarOpen = true;
}

export function closeSidebarMobile() {
    if (window.innerWidth < 1024 && sidebarOpen) {
        toggleSidebar();
    }
}

/**
 * Render the history list in the sidebar
 * @param {Array} notes - Array of note objects
 * @param {string} activeDate - Currently active date (YYYY-MM-DD)
 * @param {function} onClickDate - Callback when a date item is clicked
 */
export function renderHistoryList(notes, activeDate, onClickDate) {
    const container = $('#history-list');
    container.innerHTML = '';

    if (notes.length === 0) {
        container.innerHTML = `
            <p class="text-on-surface-variant/30 font-label-sm text-label-sm italic">
                No entries yet. Start writing today.
            </p>
        `;
        return;
    }

    notes.forEach((note) => {
        const isActive = note.note_date === activeDate;
        const snippet = note.content
            ? note.content.substring(0, 120).replace(/\n/g, ' ')
            : 'Empty note';

        const item = document.createElement('div');
        item.className = `flex flex-col gap-1 cursor-pointer transition-all duration-300 group ${
            isActive
                ? 'sidebar-item-active'
                : 'sidebar-item-inactive hover:text-on-surface'
        }`;
        item.dataset.date = note.note_date;

        item.innerHTML = `
            <span class="font-label-sm text-label-sm">${formatDateLabel(note.note_date)}</span>
            <div class="${isActive ? 'text-on-surface-variant/30' : 'blur-snippet'} text-[13px] leading-relaxed line-clamp-2">
                ${escapeHtml(snippet)}
            </div>
        `;

        item.addEventListener('click', () => {
            onClickDate(note.note_date);
            closeSidebarMobile();
        });

        container.appendChild(item);
    });
}

/**
 * Filter the sidebar history list by search query
 * @param {string} query
 */
export function filterHistoryList(query) {
    const items = $$('#history-list > div');
    const q = query.toLowerCase().trim();

    items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        item.style.display = q === '' || text.includes(q) ? '' : 'none';
    });
}

// ── Header & Status ─────────────────────────

/**
 * Set the header date title
 * @param {string} formattedDate
 */
export function setHeaderDate(formattedDate) {
    $('#header-date').textContent = formattedDate;
}

/**
 * Update the cloud status indicator
 * @param {'saving'|'saved'|'error'|'offline'} status
 */
export function updateCloudStatus(status) {
    const dot = $('#sync-dot');
    const label = $('#cloud-status');

    switch (status) {
        case 'saving':
            dot.className = 'sync-dot sync-dot--saving';
            label.textContent = 'Saving changes...';
            break;
        case 'saved':
            dot.className = 'sync-dot sync-dot--saved';
            label.textContent = 'Saved to Cloud';
            break;
        case 'error':
            dot.className = 'sync-dot sync-dot--error';
            label.textContent = 'Connection lost';
            break;
        case 'offline':
            dot.className = 'sync-dot sync-dot--idle';
            label.textContent = 'Offline';
            break;
        default:
            dot.className = 'sync-dot sync-dot--idle';
            label.textContent = '';
    }
}

// ── Editor ──────────────────────────────────

/**
 * Set editor content without triggering input event
 * @param {string} content
 */
export function setEditorContent(content) {
    const editor = $('#zen-editor');
    editor.value = content || '';
    updateWordCharCount(content || '');
}

/**
 * Get current editor content
 * @returns {string}
 */
export function getEditorContent() {
    return $('#zen-editor').value;
}

/**
 * Update word and character count display
 * @param {string} text
 */
export function updateWordCharCount(text) {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = trimmed.length;

    $('#word-count').textContent = `${words} ${words === 1 ? 'word' : 'words'}`;
    $('#char-count').textContent = `${chars} ${chars === 1 ? 'character' : 'characters'}`;
}

// ── Focus Mode ──────────────────────────────

export function enableFocusMode() {
    $('#sidebar')?.classList.add('focus-dimmed');
    $('#header')?.classList.add('focus-dimmed');
    $('#footer-stats')?.classList.add('focus-bright');
}

export function disableFocusMode() {
    $('#sidebar')?.classList.remove('focus-dimmed');
    $('#header')?.classList.remove('focus-dimmed');
    $('#footer-stats')?.classList.remove('focus-bright');
}

// ── User Badge ──────────────────────────────

export function setUserEmail(email) {
    const el = $('#user-email');
    if (el) el.textContent = email;
}

// ── Loading State ───────────────────────────

export function showAppLoading() {
    $('#app-loader')?.classList.remove('hidden');
    $('#app-main')?.classList.add('hidden');
}

export function hideAppLoading() {
    $('#app-loader')?.classList.add('hidden');
    $('#app-main')?.classList.remove('hidden');
}

// ── Utilities ───────────────────────────────

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
