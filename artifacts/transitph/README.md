# TransitPH

TransitPH is a 30% prototype of a commuter companion for CALABARZON, Philippines. It helps commuters discover sample jeepney terminals, search routes, compare fares and travel time, check local weather, and save frequent rides.

## Prototype scope

This Expo mobile build translates the requested Java/XML Android flows into a cross-platform mobile prototype so it can be previewed immediately. Local app state is persisted with AsyncStorage, and all sample content is clearly marked as demo data.

Included:

- Local registration and login with protected admin access
- Demo user and admin accounts
- Route finder with partial keyword matching
- Five-search window for normal users with an upgrade prompt state
- 15 seeded CALABARZON terminals and 30 seeded routes
- Route results, route details, walking guidance, fare and time estimates
- Terminal directory, terminal detail pages, coordinates, and map-style preview
- Saved routes with delete actions
- Weather search across sample Laguna, Cavite, Batangas, Rizal, and Quezon locations
- Admin terminal and route create, edit, and delete flows with confirmation dialogs

## Demo accounts

The accounts below are local demo accounts. They are not production credentials.

- Admin: `admin@transitph.test` / `Admin123!`
- User: `user@transitph.test` / `User123!`

## Technology

- Expo SDK 57
- React Native with TypeScript
- Expo Router
- AsyncStorage for local persistence
- Inter font family
- Expo Vector Icons

## Run in Android Studio / Expo

Open the project through the Replit Expo preview or scan its QR code with Expo Go. The app uses portrait-first layouts and adapts to common phone widths. For a native Android Studio deliverable, the product flow and data model in this prototype can be carried into a Java/XML project in a later phase.

## Data model

The local state models users, terminals, transit routes, and saved route IDs. A route belongs to one terminal and includes origin, destination, fare, estimated travel time, walking distance, transfer count, and a description.

## Future work

The requested future scope includes verified transport data, live GPS vehicle tracking, a real weather API, offline maps, push notifications, advanced routing, multilingual support, and premium billing. Those are intentionally outside the 30% prototype.