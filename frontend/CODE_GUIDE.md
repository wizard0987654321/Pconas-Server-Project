# Frontend code guide

Read the frontend like a book. Every file has a number. The number tells you where the file belongs in the story of the app:

- **Chapter 0** is the app start and the frame around every page (login, header, sidebar).
- **Chapters 1 - 8** are the pages, in the order of the sidebar. `2` is the Rooms page, `2.1` is something the Rooms page uses, `2.1.1` is something `2.1` uses, and so on.
- **Appendix A** holds generic parts used on many pages (buttons, headings, tables, generic forms, backend requests, types, animations).

How the comments in the files work:

- **Header** at the top of every file: number, chapter, what the file does, how you get there, who uses it and what it uses.
- **Footer** at the bottom: `→ Next in the book`, the file to read next. Follow the footers to read the whole frontend in order.
- **Imports** end with the number of the imported file, e.g. `import TrainerPanel from "..."; // 2.5.13 TrainerPanel`.
- **Usages** of numbered components carry the number inside the tag, e.g. `<TrainerPanel /* 2.5.13 */ ...>`, and the first call of a numbered hook or helper ends with its number, e.g. `useRoomData(roomId); // 2.5.1 useRoomData`.
- If a file is used in several places, it is numbered where it appears first. Other places point back to that number (e.g. `3 RacksPage` uses `2.2.1 AddRackOverlay`).
- **Hooks and helpers** are marked as such: they only provide data or functions and render no HTML.

Start reading at [0.1 main.tsx](src/main.tsx).

## Table of contents

### Chapter 0: App start and layout

- **0.1** [main](src/main.tsx) - Starting point of the whole frontend. Creates the React root, wraps the app in ThemeProvider (0.2) and AuthProvider (0.3), loads the translations (0.4) and starts the router with the routes (0.5).
- **0.2** [ThemeProvider](src/contexts/ThemeProvider.tsx) *(context)* - Remembers light / dark mode and puts the `dark` class on <html>, so every `dark:` Tailwind class in the app switches.
- **0.3** [AuthProvider](src/contexts/AuthProvider.tsx) *(context)* - Knows who is logged in (trainer or trainee). Checks the session on load (GET /me) and offers login / logout to every component (useAuth).
- **0.4** [config](src/i18n/config.ts) *(helper)* - Sets up i18next with the English and German texts (i18n/en.json, i18n/de.json). Every t("...") call in the app reads its text from there.
- **0.5** [routes](src/routes.tsx) - Maps every URL to a page. Navigation (0.6) is the frame around all pages, the page of the current URL is shown inside it.
- **0.6** [Navigation](src/components/navComponents/Navigation.tsx) - Frame around every page. Shows the login screen while nobody is logged in, otherwise header, sidebar and the page of the current URL (<Outlet />).
  - **0.6.1** [LoginScreen](src/components/auth/LoginScreen.tsx) - Login form (username + password), shown by Navigation while nobody is logged in.
  - **0.6.2** [Header](src/components/Header.tsx) - Top bar: logo, theme and language toggles, log out button.
    - **0.6.2.1** [ThemeToggle](src/components/toggleButtons/ThemeToggle.tsx) - Button switching between light and dark mode (uses ThemeProvider 0.2).
    - **0.6.2.2** [LanguageToggle](src/components/toggleButtons/LanguageToggle.tsx) - Button switching between English and German (uses i18n 0.4).
  - **0.6.3** [DesktopSidebar](src/components/sidebars/DesktopSidebar.tsx) - Sidebar with the page links on large screens.
    - **0.6.3.1** [NavList](src/components/navComponents/NavList.tsx) - The list of page links (Home, Rooms, Racks, ...). Shared by both sidebars. These links lead to chapters 1 - 8.
      - **0.6.3.1.1** [NavItem](src/components/navComponents/NavItem.tsx) - One link in the sidebar.
      - **0.6.3.1.2** [NavItemSeparation](src/components/navComponents/NavItemSeparation.tsx) - Thin line between two sidebar links.
  - **0.6.4** [MobileSidebar](src/components/sidebars/MobileSidebar.tsx) - Sidebar for small screens, opened with the menu button. Shows the same NavList (0.6.3.1).
- **0.7** [ErrorPage](src/pages/ErrorPage.tsx) - Shown by the router when a URL doesn't exist or a page crashes.

### Chapter 1: Homepage

- **1** [Homepage](src/pages/Homepage.tsx) - Start page after login: welcome text for trainer or trainee and a button to the rooms (chapter 2).

### Chapter 2: Rooms

- **2** [RoomsPage](src/pages/RoomsPage.tsx) - All server rooms. Switches between the list view (2.1) and the room view (2.2), opens the quiz (2.3) and adds rooms (2.4).
  - **2.1** [ServerRoomList](src/components/pageContents/ServerRoomList.tsx) - List view: rooms as a table (DataList) with delete and a button to the detailed room view (2.5).
  - **2.2** [ServerRoom](src/components/pageContents/ServerRoom.tsx) - Room view: every room drawn as a box with its rack and UPS icons and free "+" places. Clicking a rack opens the rack view (2.6), the button opens the detailed room view (2.5).
    - **2.2.1** [AddRackOverlay](src/components/overlays/AddRackOverlay.tsx) - Form to add a rack (room, size in U, height).
    - **2.2.2** [RackHoverCard](src/components/hoverCards/RackHoverCard.tsx) - Info card shown while hovering a rack: number, size, height and (in the detailed room view) power state and fault.
    - **2.2.3** [UpsHoverCard](src/components/hoverCards/UpsHoverCard.tsx) - Info card shown while hovering a cabinet UPS.
  - **2.3** [QuizQuestionsButton](src/components/QuizQuestionsButton.tsx) - Quiz button. Trainer: activates questions (2.3.1). Trainee: answers them (2.3.2).
    - **2.3.1** [ActivateQuestionOverlay](src/components/overlays/ActivateQuestionOverlay.tsx) - Trainer: choose which quiz questions are active.
    - **2.3.2** [AnswerQuestionsOverlay](src/components/overlays/AnswerQuestionsOverlay.tsx) - Trainee: answer the active questions. Correct answers deactivate the question.
  - **2.4** [AddRoomOverlay](src/components/overlays/AddRoomOverlay.tsx) - Form to add a room (area, capacity, height).
  - **2.5** [DetailedRoom](src/components/detailedViews/DetailedRoom.tsx) - Detailed virtual room: power grid with generators / fans, cabinet UPS, PDUs, racks, the cables between them, trainer faults and the room climate. Hooks 2.5.1 - 2.5.6 prepare the data, components 2.5.8 - 2.5.17 draw it.
    - **2.5.1** [useRoomData](src/helpers/hooks/useRoomData.ts) *(hook)* - Loads all data of one room (racks, UPS, PDUs, devices, cables, faults, generators, fans) and reloads the changing parts every 3 seconds.
      - **2.5.1.1** [usePolling](src/helpers/hooks/usePolling.ts) *(hook)* - Runs a function at once and then every few seconds. keepIfUnchanged avoids re-renders when the reloaded data is the same.
    - **2.5.2** [usePowerFlow](src/helpers/hooks/usePowerFlow.ts) *(hook)* - Wraps powerFlow.ts (2.5.2.1) in useMemo. Gives the power state and fault of every equipment piece and cable of the room.
      - **2.5.2.1** [powerFlow](src/helpers/powerFlow.ts) *(helper)* - Calculates which equipment has power (grid / generator -> UPS -> PDU -> rack) and which cables are dead. Also the cable rules (which pairs may be connected).
    - **2.5.3** [roomClimate](src/helpers/roomClimate.ts) *(helper)* - Calculates the room's power usage (W), AC cooling load, temperature and humidity.
      - **2.5.3.1** [inRackUps](src/helpers/inRackUps.ts) *(helper)* - In-rack UPS logic: power state of each device in a rack, and the "Electricity (connected via)" choice of the device forms (2.6.1, 2.6.2).
    - **2.5.4** [connectionLines](src/helpers/hooks/connectionLines.ts) *(hook)* - Measures where the equipment icons are on the screen and turns the cables into line coordinates for the SVG.
    - **2.5.5** [useEquipmentLabels](src/helpers/hooks/useEquipmentLabels.ts) *(hook)* - Turns equipment IDs into readable names ("Rack 3", "PDU 1", "Generator 2").
    - **2.5.6** [useTrainerSelection](src/helpers/hooks/useTrainerSelection.ts) *(hook)* - Trainer select mode: which equipment or cable is selected to be damaged / repaired in the TrainerPanel (2.5.13).
    - **2.5.7** [powerStyles](src/components/powerSimulation/powerStyles.ts) *(style)* - Colors and text keys per power state, used by all power simulation components.
    - **2.5.8** [PowerSource](src/components/powerSimulation/PowerSource.tsx) - Icon of the power grid or a generator, with its hover info.
      - **2.5.8.1** [PowerStatusText](src/components/powerSimulation/PowerStatusText.tsx) - "Power: Powered / On UPS battery / No power" line of the hover cards.
      - **2.5.8.2** [FaultText](src/components/powerSimulation/FaultText.tsx) - "Fault: Damaged" line of the hover cards.
      - **2.5.8.3** [DamagedMark](src/components/powerSimulation/DamagedMark.tsx) - Red X drawn over damaged equipment.
    - **2.5.9** [AddEquipmentOverlay](src/components/overlays/AddEquipmentOverlay.tsx) - Form behind a free "+" place in the room: add a rack or a cabinet UPS.
    - **2.5.10** [AddOutsideEquipmentOverlay](src/components/overlays/AddOutsideEquipmentOverlay.tsx) - Form behind the "+" next to the grid: add a generator or a fan.
    - **2.5.11** [OutsideEquipmentInfoOverlay](src/components/powerSimulation/OutsideEquipmentInfoOverlay.tsx) - Info about a clicked generator or fan, with a delete button.
    - **2.5.12** [CableChangeOverlay](src/components/powerSimulation/CableChangeOverlay.tsx) - Rewiring: draw new cables by clicking two devices, mark cables for removal by clicking them, then Save.
      - **2.5.12.1** [ConnectionLine](src/components/powerSimulation/ConnectionLine.tsx) - One cable drawn as an SVG line (dashed when dead or not saved yet, with an X when damaged).
    - **2.5.13** [TrainerPanel](src/components/powerSimulation/TrainerPanel.tsx) - Trainer only: select equipment or cables and damage / repair them, or repair everything.
    - **2.5.14** [DisplayedRoomData](src/components/powerSimulation/DisplayedRoomData.tsx) - Tiles under the room: power usage, AC cooling load, temperature, humidity.
    - **2.5.15** [PowerLegend](src/components/powerSimulation/PowerLegend.tsx) - Small legend explaining the colors (powered / no power / dead cable).
    - **2.5.16** [ConnectionHoverCard](src/components/hoverCards/ConnectionHoverCard.tsx) - Info card shown while hovering a cable.
    - **2.5.17** [PduHoverCard](src/components/hoverCards/PduHoverCard.tsx) - Info card shown while hovering a PDU.
  - **2.6** [DetailedRack](src/components/detailedViews/DetailedRack.tsx) - One rack with its height units (U) and devices. Color and hover of each device show where its electricity comes from (room power flow 2.5.2 + in-rack UPS 2.5.3.1).
    - **2.6.1** [AddDeviceOverlay](src/components/overlays/AddDeviceOverlay.tsx) - Form to add a device to a rack (positions, electricity, TOR, type).
    - **2.6.2** [EditDeviceOverlay](src/components/overlays/EditDeviceOverlay.tsx) - Form to edit a device, opened by clicking the device in the rack.

### Chapter 3: Racks

- **3** [RacksPage](src/pages/RacksPage.tsx) - All racks as a table, or only the racks of one room (/rooms/:roomId/racks). Adding a rack uses the form from 2.2.1.
  - **3.1** [ServerRacks](src/components/pageContents/ServerRacks.tsx) - Racks table (DataList) with delete and a button to the rack view (2.6).

### Chapter 4: Device Types

- **4** [DeviceTypesPage](src/pages/DeviceTypesPage.tsx) - All device types (server, switch, in-rack UPS, ...).
  - **4.1** [ServerDeviceTypes](src/components/pageContents/ServerDeviceTypes.tsx) - Device types table (DataList) with delete.
  - **4.2** [AddDeviceTypeOverlay](src/components/overlays/AddDeviceTypeOverlay.tsx) - Form to add a device type (name, manufacturer, usage, in-rack UPS yes / no).

### Chapter 5: Devices

- **5** [DevicesPage](src/pages/DevicesPage.tsx) - All devices of all racks. Adding a device uses the form from 2.6.1.
  - **5.1** [ServerDevices](src/components/pageContents/ServerDevices.tsx) - Devices table (DataList) with delete.

### Chapter 6: VMs

- **6** [VmsPage](src/pages/VmsPage.tsx) - All virtual machines (which service runs on which device).
  - **6.1** [ServerVms](src/components/pageContents/ServerVms.tsx) - VMs table (DataList) with delete.
  - **6.2** [AddVmOverlay](src/components/overlays/AddVmOverlay.tsx) - Form to add a VM (service, host device, name).

### Chapter 7: Services

- **7** [ServicesPage](src/pages/ServicesPage.tsx) - All services (what a customer runs).
  - **7.1** [ServerServices](src/components/pageContents/ServerServices.tsx) - Services table (DataList) with delete.
  - **7.2** [AddServiceOverlay](src/components/overlays/AddServiceOverlay.tsx) - Form to add a service (name, customer).

### Chapter 8: Customers

- **8** [CustomersPage](src/pages/CustomersPage.tsx) - All customers.
  - **8.1** [ServerCustomers](src/components/pageContents/ServerCustomers.tsx) - Customers table (DataList) with delete.
  - **8.2** [AddCustomerOverlay](src/components/overlays/AddCustomerOverlay.tsx) - Form to add a customer (name, phone number).

### Appendix A: Appendix: generic parts used everywhere

- **A.1** [PageHeading](src/components/PageHeading.tsx) - Animated heading at the top of a page.
- **A.2** [PrimaryButton](src/components/buttons/PrimaryButton.tsx) - Main green button.
- **A.3** [SecondaryButton](src/components/buttons/SecondaryButton.tsx) - Outlined green button (not used anywhere at the moment).
- **A.4** [DeleteButton](src/components/buttons/DeleteButton.tsx) - Red outlined delete button.
- **A.5** [LoadingSpinner](src/components/LoadingSpinner.tsx) - Spinning circle shown while data is loading.
- **A.6** [DataList](src/components/DataList.tsx) - Generic table (cards on small screens) with detail and delete buttons, used by all list pages.
- **A.7** [AddOverlay](src/components/overlays/generics/AddOverlay.tsx) - Generic "add" form: draws the given fields, validates, POSTs to the given endpoint and reloads the page. All Add...Overlay files only configure it.
- **A.8** [EditOverlay](src/components/overlays/generics/EditOverlay.tsx) - Generic "edit" form: like AddOverlay (A.7), but starts with existing data and sends a PUT.
- **A.9** [DeletingOverlay](src/components/overlays/generics/DeletingOverlay.tsx) - Generic "Are you sure you want to delete?" confirmation.
- **A.10** [dataOperations](src/helpers/hooks/dataOperations.ts) *(hook)* - useData: generic loading + deleting of one table. The ...Operations hooks (A.10.1 - A.10.7) only configure it per table.
  - **A.10.1** [roomOperations](src/helpers/hooks/roomOperations.ts) *(hook)* - useRooms: rooms table data + delete.
  - **A.10.2** [rackOperations](src/helpers/hooks/rackOperations.ts) *(hook)* - useRacks: racks table data + delete.
  - **A.10.3** [deviceTypeOperations](src/helpers/hooks/deviceTypeOperations.ts) *(hook)* - useDeviceTypes: device types table data + delete.
  - **A.10.4** [deviceOperations](src/helpers/hooks/deviceOperations.ts) *(hook)* - useDevice: devices table data + delete.
  - **A.10.5** [vmOperations](src/helpers/hooks/vmOperations.ts) *(hook)* - useVms: VMs table data + delete.
  - **A.10.6** [serviceOperations](src/helpers/hooks/serviceOperations.ts) *(hook)* - useServices: services table data + delete.
  - **A.10.7** [customerOperations](src/helpers/hooks/customerOperations.ts) *(hook)* - useCustomers: customers table data + delete.
- **A.11** [transformData](src/helpers/transformData.ts) *(helper)* - Prepares rows for DataList (A.6): adds the "#" column, renames or hides columns.
- **A.12** [api/index](src/services/api/index.ts) *(data)* - All backend calls in one import (`from "services/api"`). Re-exports the files A.12.1 - A.12.9.
  - **A.12.1** [client](src/services/api/client.ts) *(data)* - apiFetch / getJson / sendJson: every request goes through here (login cookie, error messages, 401 handling).
  - **A.12.2** [auth](src/services/api/auth.ts) *(data)* - Login, logout, current user.
  - **A.12.3** [rooms](src/services/api/rooms.ts) *(data)* - Rooms requests.
  - **A.12.4** [equipment](src/services/api/equipment.ts) *(data)* - Racks, UPS, PDUs, power sources, generators and fans requests.
  - **A.12.5** [connections](src/services/api/connections.ts) *(data)* - Cable requests (load, add, delete).
  - **A.12.6** [devices](src/services/api/devices.ts) *(data)* - Devices and device types requests.
  - **A.12.7** [services](src/services/api/services.ts) *(data)* - Services, customers and VMs requests.
  - **A.12.8** [quiz](src/services/api/quiz.ts) *(data)* - Quiz questions and answers requests.
  - **A.12.9** [faults](src/services/api/faults.ts) *(data)* - Trainer faults requests (load, damage, repair, reset).
- **A.13** [types](src/types/index.ts) *(data)* - All shared TypeScript types (Room, Rack, Device, Connection, Fault, ...), matching the backend responses.
  - **A.14.1** [homepage](src/animations/homepage.ts) *(animation)* - GSAP animation of the Homepage (1).
  - **A.14.2** [pageHeading](src/animations/pageHeading.ts) *(animation)* - GSAP animation of the PageHeading (A.1).
  - **A.14.3** [serverRoomAnimation](src/animations/serverRoomAnimation.ts) *(animation)* - GSAP animation of the room view (2.2).
  - **A.14.4** [dataListAnimation](src/animations/dataListAnimation.ts) *(animation)* - GSAP animation of the DataList (A.6).
  - **A.14.5** [detailedRackAnimation](src/animations/detailedRackAnimation.ts) *(animation)* - GSAP animation of the rack view (2.6).
