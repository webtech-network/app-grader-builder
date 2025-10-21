# Dynamic Template Implementation

## Overview
The application now dynamically loads test templates from the API based on user selection (webdev, api, io, or essay) instead of using mocked data.

## Changes Made

### 1. ConfigurationPage.jsx
- **Added**: Pass `templateName` prop to `CriteriaForm` component
- The `gradingTemplate` value (webdev/api/io/essay) is now passed down to CriteriaForm

```jsx
<CriteriaForm 
  onSave={handleCriteriaSave} 
  templateName={gradingTemplate}
/>
```

### 2. CriteriaForm.jsx

#### A. Component Props
- **Added**: `templateName` prop - receives the selected template type (webdev/api/io/essay)
- **Added**: `onSave` prop - callback function to handle saving configuration

#### B. State Management
Added new states for dynamic template loading:
```jsx
const [testLibrary, setTestLibrary] = useState(null);
const [loadingTemplate, setLoadingTemplate] = useState(true);
const [templateError, setTemplateError] = useState(null);
```

#### C. API Integration
- **Added**: `useEffect` hook to fetch template data from API
- **Endpoint**: `http://localhost:8000/templates/{templateName}`
- Fetches template data when component mounts or when `templateName` changes

#### D. Test Library Modal
- **Updated**: `TestLibraryModal` now receives `testLibrary` prop
- **Removed**: Hardcoded `MOCK_TEST_LIBRARY_FLAT` constant
- **Added**: Dynamic `testLibraryFlat` derived from API response
- All references to `MOCK_TEST_LIBRARY_FLAT` replaced with `testLibraryFlat`

#### E. UI States
Added three UI states:

1. **Loading State**: Shows spinner while fetching template
2. **Error State**: Displays error message if API call fails
3. **No Data State**: Shows message if no template data is available

#### F. Save Functionality
- Updated `handleSaveCriteria` to call `onSave` callback with configuration data
- Updated `handleCancelSave` to notify parent component of unsaved state

## User Flow

1. User selects a template type on Landing Page (webdev/api/io/essay)
2. User navigates to Configuration Page
3. Configuration Page passes template name to CriteriaForm
4. CriteriaForm fetches template data from API: `GET /templates/{templateName}`
5. Test Library Modal displays tests dynamically based on API response
6. User configures tests using drag-and-drop interface
7. Configuration is saved and passed back to parent component

## API Expected Response Format

The API should return data in the following format:

```json
{
  "template_name": "Web Development Template",
  "template_description": "Template for web development projects",
  "tests": [
    {
      "name": "has_class",
      "description": "Check for CSS class presence",
      "required_file": "HTML",
      "type_tag": "HTML",
      "parameters": [
        {
          "name": "class_names",
          "description": "List of classes (comma-separated)",
          "type": "list of strings",
          "defaultValue": ""
        }
      ],
      "displayName": "Has Class"
    }
    // ... more tests
  ]
}
```

## Testing

To test the implementation:

1. Ensure the API is running at `http://localhost:8000`
2. Ensure the following endpoints are available:
   - `/templates/webdev`
   - `/templates/api`
   - `/templates/io`
   - `/templates/essay`
3. Select a template on the landing page
4. Verify the loading spinner appears
5. Verify tests are loaded dynamically in the test library modal
6. Test drag-and-drop functionality with dynamic tests
7. Verify error handling when API is unavailable

## Error Handling

- Network errors are caught and displayed to user
- Loading states prevent interaction while data is being fetched
- Clear error messages guide user if API is unavailable
- Fallback UI states ensure app doesn't crash

## Future Improvements

1. Add retry mechanism for failed API calls
2. Implement caching to avoid refetching same template
3. Add more detailed error messages for debugging
4. Consider adding offline mode with fallback mock data
5. Add unit tests for API integration
