# Baikal Configuration Questions

To finalize **WF-201 (Calendar Read)**, we need specific details about your Baikal instance.

### 1. CalDAV Endpoint Structure
The current workflow assumes the standard structure:
`/calendars/{{user}}/default/`

**Question**: Is this the correct path for your primary calendar?
- [ ] Yes
- [X] No, it is: `http://192.168.178.99/dav.php/calendars/fjoelnir/valur/`

### 2. Calendar Selection
**Question**: Do you want to read from a single calendar or multiple?
- [X] Single ("default")
- [ ] Multiple (please list IDs/paths):
    - `_____________________________`
    - `_____________________________`

### 3. Shared Calendars
**Question**: Do you use shared calendars where the `{{user}}` might differ from the authenticated user?
- [ ] No, only my own.
- [X] Yes (requires different URL construction).

### 4. Timezone
**Question**: The system assumes the user is in `Europe/Berlin` (CET/CEST). Is this fixed, or does it need to be dynamic?
- [ ] Fixed (`Europe/Berlin`)
- [ ] Dynamic (needs to pass from Client)

### 5. Authentication Scope
**Question**: Does the `baikal_creds` user have permission to read *all* requested calendars?
- [ ] Yes
- [X] No (need separate credentials?)
