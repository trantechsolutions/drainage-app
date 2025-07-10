export const appVersion = "0.5.0 (Prototype)";

export const changelog = [
    {
        version: "0.5.0",
        date: "2025-07-09",
        changes: [
            "Feat: Integrated TensorFlow.js for an AI-powered prediction model.",
            "Feat: Added an opt-in setting for AI features to manage performance.",
            "Feat: Added numeric total and per-drain totals to the dashboard.",
            "Fix: Added descriptive captions to charts to clarify data sources."
        ]
    },
    {
        version: "0.4.0",
        date: "2025-07-08",
        changes: [
            "Feat: Added filtering and bulk-deletion to the detailed log history.",
            "Feat: Added open-source license information to the settings.",
            "Refactor: Broke out the main settings view into smaller, manageable components."
        ]
    },
    {
        version: "0.3.0",
        date: "2025-07-07",
        changes: [
            "Feat: Implemented a condensed, print-friendly summary view.",
            "Refactor: Broke out each major UI view into its own component (Dashboard, Summary, etc.).",
            "Fix: Corrected React 18 rendering issues for the print component."
        ]
    },
    {
        version: "0.2.0",
        date: "2025-07-06",
        changes: [
            "Feat: Added a time-grouped summary view.",
            "Feat: Added a detailed log history table.",
            "Feat: Implemented a dark mode theme toggle."
        ]
    },
    {
        version: "0.1.0",
        date: "2025-07-05",
        changes: [
            "Initial prototype release.",
            "Core functionality for adding/deleting drains and logging output.",
            "Basic data persistence using local storage."
        ]
    }
];