# Changelog

## v0.7.0 (2025-07-10)
* **Refactor**: Reworked threshold logic to be based on consecutive calendar days instead of a rolling hourly window.
* **Feat**: Updated the Thresholds summary to display a detailed day-by-day breakdown of output.
* **Fix**: Corrected a bug preventing new notification rules from being added due to a prop mismatch.

## v0.6.0 (2025-07-09)
* **Feat**: Implemented time-based notification reminders for drain empties.
* **Feat**: Added a 'Resources' tab to manage instructional videos and PDFs.
* **Refactor**: Centralized all application state and logic into the useAppData hook.
* **Refactor**: Moved the changelog button into the settings page for a cleaner UI.
* **Fix**: Corrected Headless UI component usage for labels and dropdowns.
* **Fix**: Resolved a bug in the notification engine logic.

## v0.5.0 (2025-07-09)
* **Feat**: Integrated TensorFlow.js for an AI-powered prediction model.
* **Feat**: Added an opt-in setting for AI features to manage performance.
* **Feat**: Added numeric total and per-drain totals to the dashboard.
* **Fix**: Added descriptive captions to charts to clarify data sources.

## v0.4.0 (2025-07-08)
* **Feat**: Added filtering and bulk-deletion to the detailed log history.
* **Feat**: Added open-source license information to the settings.
* **Refactor**: Broke out the main settings view into smaller, manageable components.

## v0.3.0 (2025-07-07)
* **Feat**: Implemented a condensed, print-friendly summary view.
* **Refactor**: Broke out each major UI view into its own component (Dashboard, Summary, etc.).
* **Fix**: Corrected React 18 rendering issues for the print component.

## v0.2.0 (2025-07-06)
* **Feat**: Added a time-grouped summary view.
* **Feat**: Added a detailed log history table.
* **Feat**: Implemented a dark mode theme toggle.

## v0.1.0 (2025-07-05)
* **Initial prototype release.**
* **Core functionality for adding/deleting drains and logging output.**
* **Basic data persistence using local storage.**