// Window pre-close event
export const EventNameWindowCloseMain = "windowCloseMain";
export const EventNameWindowCloseShell = "windowCloseShell";

// Window resize (also for grid-system's split event)
export const EventNameWindowResizeShell = "windowResizeShell";

// Create a new shell session
export const EventNameShellNew = "shellNew";

// Check if shell is ready
export const EventNameShellReadyRequest = "shellReadyRequest";
export const EventNameShellReadyResponse = "shellReadyResponse";

// Select active session tab by nonce
export const EventNameShellSetActiveTabByNonce = "shellSetActiveTabByNonce";

// Send code to specific sessions
export const EventNameShellSendCommandByNonce = "shellSendCommandByNonce";

// Request for current tabs
export const EventNameShellTabsListRequest = "shellTabsListRequest";
export const EventNameShellTabsListResponse = "shellTabsListResponse";

// Send special command to shell by nonce
export const EventNameShellSelectAllByNonce = "shellSelectAllByNonce";
export const EventNameShellSTTYFitByNonce = "shellSTTYFitByNonce";

// Shell grid system
export const EventNameShellGridModify = "shellGridModify"; // Add 1 row
