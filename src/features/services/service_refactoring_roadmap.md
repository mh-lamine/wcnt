# Service Management - Refactoring Roadmap

**Status:** In Progress
**Last Updated:** December 7, 2025

This roadmap guides the complete implementation of the service management feature with options, addons, and categories.

---

## 🎯 Overview

### Current State
- ✅ Basic CRUD operations (create, read, update, delete)
- ✅ Toggle active/inactive status
- ✅ Form validation
- ✅ Toast notifications
- ❌ No categories
- ❌ No service options (variations)
- ❌ No service addons (extras)
- ❌ No search/filtering
- ❌ No statistics

### Target State
Complete service management with:
- Categories for organization
- Service options (e.g., "Short Hair", "Long Hair")
- Service addons (e.g., "Premium Shampoo +5€")
- Search & filtering
- Statistics dashboard
- Bulk operations

---

## 📊 Database Schema

### Current Collections

**`salon_services`** (Base service)
```javascript
{
  id: string,
  salon: relation → salons,
  globalService: relation → global_services (optional template),
  name: text,
  description: text,
  duration: number (minutes, min: 1),
  price: number (EUR, min: 1),
  isActive: bool
}
```

**`categories`** (Organize services)
```javascript
{
  id: string,
  salon: relation → salons,
  name: text (required),
  displayOrder: number (for custom sorting)
}
```

**`service_options`** (Variations: Short/Long, Basic/Premium)
```javascript
{
  id: string,
  salonService: relation → salon_services (cascadeDelete: true),
  name: text (e.g., "Cheveux Courts"),
  duration: number,
  price: number
}
```

**`service_addons`** (Extras: treatments, upgrades)
```javascript
{
  id: string,
  salonService: relation → salon_services (cascadeDelete: true),
  name: text (e.g., "Shampooing Premium"),
  duration: number,
  price: text ⚠️ // MUST FIX: Change to number
}
```

**`global_services`** (Templates)
```javascript
{
  id: string,
  name: text,
  description: text,
  suggestedDuration: number (template only, provider sets own)
}
```

### Schema Fixes Required

**Critical:**
1. Change `service_addons.price` from TEXT to NUMBER
2. Make `salon_services.name` required in schema (currently optional)

**Recommended:**
3. Add `category` field to `salon_services`:
   ```javascript
   {
     name: "category",
     type: "relation",
     required: false,
     options: {
       collectionId: "categories",
       cascadeDelete: false,  // Keep services if category deleted
       maxSelect: 1
     }
   }
   ```

4. Add helper fields to `salon_services`:
   ```javascript
   hasOptions: bool (indicates service has variations)
   hasAddons: bool (indicates service allows extras)
   displayOrder: number (custom sorting within category)
   isFeatured: bool (highlight on customer homepage)
   ```

---

## 🏗️ Implementation Phases

### **Phase 1: Critical Fixes** (30 min)

**Database:**
- [ ] Fix `service_addons.price` type (TEXT → NUMBER) in PocketBase admin
- [ ] Make `salon_services.name` required
- [ ] Add `category` relation to `salon_services`
- [ ] Export updated schema

**Code:**
- [ ] Move format helpers to `/shared/lib/utils.js`
  ```javascript
  export const formatDuration = (minutes) => { /* ... */ };
  export const formatPrice = (price) => { /* ... */ };
  ```
- [ ] Fix `useEffect` cleanup in ServicesPage.jsx:21
- [ ] Add `refetch` to dependency array

---

### **Phase 2: Category Management** (2-3 hours)

**1. Create Hook** → `/features/services/hooks/useCategories.js`
```javascript
export function useCategories() {
  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,  // Update displayOrder
    refetch
  };
}
```

**2. Create Page** → `/features/services/pages/CategoriesPage.jsx`
- List all categories (sorted by displayOrder)
- Add/Edit/Delete categories
- Drag-and-drop reordering (optional)

**3. Update ServicesPage.jsx**
- Add category dropdown to service form
- Display services grouped by category
- Show service count per category

**4. Add Atoms** → `/shared/store/atoms.js`
```javascript
export const categoriesAtom = atom([]);
export const categoriesLoadingAtom = atom(false);
export const categoriesErrorAtom = atom(null);
```

**5. Add Route** → `/App.jsx`
```javascript
<Route path="/categories" element={
  <RequireSalon><CategoriesPage /></RequireSalon>
} />
```

---

### **Phase 3: Service Options (Variations)** (3-4 hours)

**1. Create Hook** → `/features/services/hooks/useServiceOptions.js`
```javascript
export function useServiceOptions(serviceId) {
  return {
    options,        // Array of options for this service
    loading,
    error,
    createOption,   // Add variation
    updateOption,
    deleteOption,
    getPriceRange,  // "25€ - 45€" for display
    refetch
  };
}
```

**2. Update ServicesPage.jsx**
- Add "Manage Options" button on each service
- Modal/expandable section to manage options
- Display price range when hasOptions = true

**3. Add Atoms**
```javascript
export const serviceOptionsAtom = atom([]);
export const serviceOptionsLoadingAtom = atom(false);
```

**4. Update Service Creation**
```javascript
// When user adds first option:
await updateService(serviceId, { hasOptions: true });
```

**Use Cases:**
```
Service: "Coupe Homme"
Options:
  - Cheveux Courts (30min, 25€)
  - Cheveux Mi-longs (40min, 30€)
  - Cheveux Longs (50min, 35€)

Display: "Coupe Homme - 25€ à 35€"
```

---

### **Phase 4: Service Addons (Extras)** (3-4 hours)

**1. Create Hook** → `/features/services/hooks/useServiceAddons.js`
```javascript
export function useServiceAddons(serviceId) {
  return {
    addons,
    loading,
    error,
    createAddon,
    updateAddon,
    deleteAddon,
    calculateTotal,     // base + selected addons
    calculateDuration,  // base + selected addons
    refetch
  };
}
```

**2. Update ServicesPage.jsx**
- Add "Manage Addons" button on each service
- Modal/expandable section to manage addons
- Show count of addons available

**3. Add Atoms**
```javascript
export const serviceAddonsAtom = atom([]);
export const serviceAddonsLoadingAtom = atom(false);
```

**Use Cases:**
```
Service: "Coupe Homme" (30min, 25€)
Addons:
  - Shampooing Premium (+10min, +5€)
  - Traitement Cheveux (+15min, +15€)
  - Rasage Barbe (+15min, +10€)

Customer selects:
  - Base service (30min, 25€)
  + Shampooing Premium (+10min, +5€)
  + Rasage Barbe (+15min, +10€)
  = Total: 55min, 40€
```

---

### **Phase 5: Enhanced UI/UX** (4-5 hours)

**1. Search & Filtering**
Create hook → `/features/services/hooks/useServiceFilters.js`
```javascript
export function useServiceFilters(services) {
  const [filters, setFilters] = useState({
    search: "",
    category: null,
    status: "all"  // all | active | inactive
  });

  const filteredServices = useMemo(() => {
    // Apply all filters
  }, [services, filters]);

  return { filters, setFilters, filteredServices };
}
```

**UI Components:**
- Search input (filter by name/description)
- Category dropdown filter
- Status filter (All, Active, Inactive)
- Result count display

**2. Statistics Dashboard**
Create hook → `/features/services/hooks/useServiceStats.js`
```javascript
export function useServiceStats(services) {
  return {
    total: services.length,
    active: services.filter(s => s.isActive).length,
    inactive: services.filter(s => !s.isActive).length,
    avgPrice: calculateAverage(services.map(s => s.price)),
    byCategory: groupByCategory(services),
    withOptions: services.filter(s => s.hasOptions).length,
    withAddons: services.filter(s => s.hasAddons).length
  };
}
```

**UI Display:**
```
┌─────────────────────────────────────┐
│ Services Overview                   │
├─────────────────────────────────────┤
│ Total: 12  Active: 10  Inactive: 2  │
│ Prix moyen: 32,50€                  │
│ Avec options: 4  Avec extras: 6     │
└─────────────────────────────────────┘
```

**3. Bulk Operations**
Create hook → `/features/services/hooks/useServiceBulkActions.js`
```javascript
export function useServiceBulkActions() {
  const [selectedIds, setSelectedIds] = useState([]);

  return {
    selectedIds,
    toggleSelection,   // Select/deselect service
    selectAll,
    clearSelection,
    bulkToggleStatus,  // Activate/deactivate multiple
    bulkDelete,        // Delete multiple (with confirmation)
    bulkAssignCategory // Assign category to multiple
  };
}
```

**UI Components:**
- Checkbox on each service card
- "Select All" button
- Bulk action toolbar (appears when items selected)
- Actions: Activate, Deactivate, Delete, Assign Category

---

### **Phase 6: Global Service Templates** (2-3 hours)

**1. Create Hook** → `/features/services/hooks/useGlobalServices.js`
```javascript
export function useGlobalServices() {
  return {
    globalServices,  // All available templates
    loading,
    createFromTemplate,  // Pre-fill form from template
    refetch
  };
}
```

**2. Update Service Creation Flow**
- Add "Créer depuis un modèle" button
- Modal with list of global services
- Select template → form pre-filled (name, description, duration)
- Provider sets their own price

**Use Case:**
```
Provider clicks "Créer depuis un modèle"
  → Selects "Coupe Homme" template
  → Form populated:
      Name: "Coupe Homme"
      Description: "Coupe classique pour homme"
      Duration: 30 min
      Price: [empty - provider must set]
  → Provider sets price to 25€
  → Creates service
```

---

## 📁 File Structure

```
/app/src/features/services/
├── components/
│   ├── ServiceForm.jsx          (Currently unused - decide to use or remove)
│   ├── ServiceList.jsx          (Currently unused - decide to use or remove)
│   ├── ServiceCard.jsx          (NEW - individual service display)
│   ├── ServiceOptionsModal.jsx  (NEW - manage options)
│   ├── ServiceAddonsModal.jsx   (NEW - manage addons)
│   ├── ServiceFilters.jsx       (NEW - search/filter UI)
│   └── ServiceStats.jsx         (NEW - statistics display)
├── hooks/
│   ├── useServices.js           (✅ Exists)
│   ├── useCategories.js         (NEW)
│   ├── useServiceOptions.js     (NEW)
│   ├── useServiceAddons.js      (NEW)
│   ├── useServiceFilters.js     (NEW)
│   ├── useServiceStats.js       (NEW)
│   ├── useServiceBulkActions.js (NEW)
│   └── useGlobalServices.js     (NEW)
├── pages/
│   ├── ServicesPage.jsx         (✅ Exists - needs refactoring)
│   └── CategoriesPage.jsx       (NEW)
└── service_refactoring_roadmap.md (This file)
```

---

## 🔄 Complete Data Flow

### Service Creation Flow
```
1. Provider clicks "Ajouter un service"
2. Optional: Select global service template
3. Fill form (name, description, duration, price, category)
4. Submit → Create service
5. Optional: Add service options (variations)
6. Optional: Add service addons (extras)
7. Service appears in list (grouped by category)
```

### Customer Booking Flow (Future)
```
1. Customer browses services (grouped by category)
2. Selects service "Coupe Homme"
3. If hasOptions: Select variation (e.g., "Cheveux Longs")
4. If hasAddons: Select extras (e.g., "Shampooing Premium")
5. System calculates total price & duration
6. Proceeds to booking with calculated values
```

---

## ✅ Testing Checklist

### Basic CRUD
- [ ] Create service
- [ ] Edit service
- [ ] Delete service
- [ ] Toggle active/inactive
- [ ] Form validation works

### Categories
- [ ] Create category
- [ ] Assign service to category
- [ ] Services grouped by category in list
- [ ] Delete category (services remain)
- [ ] Reorder categories (if implemented)

### Service Options
- [ ] Add option to service
- [ ] Edit option
- [ ] Delete option
- [ ] Price range displays correctly
- [ ] hasOptions flag updates automatically

### Service Addons
- [ ] Add addon to service
- [ ] Edit addon
- [ ] Delete addon
- [ ] Price calculation correct (base + addons)
- [ ] Duration calculation correct (base + addons)

### Search & Filters
- [ ] Search by name works
- [ ] Filter by category works
- [ ] Filter by status works
- [ ] Result count accurate

### Bulk Operations
- [ ] Select multiple services
- [ ] Bulk activate/deactivate
- [ ] Bulk delete (with confirmation)
- [ ] Bulk assign category

---

## 🎨 UI/UX Best Practices

### Service Display
```
┌────────────────────────────────────────────┐
│ Coupe Homme                     [Modifier] │
│ Coupe classique pour homme     [Supprimer] │
│                                             │
│ 30 min | 25€ - 35€ (3 options)             │
│ +4 extras disponibles                       │
│                                             │
│ Catégorie: Coupes | ✓ Actif                │
└────────────────────────────────────────────┘
```

### Service Form
```
Nom du service *
[Coupe Homme                           ]

Catégorie
[Sélectionner une catégorie ▼          ]

Description
[Coupe classique pour homme            ]

Durée (minutes) *    Prix (€) *
[30              ]   [25.00           ]

☐ Service avec variations (options)
☐ Permettre les extras (addons)

[Enregistrer] [Annuler]
```

---

## 🚀 Quick Start (After Reading)

**Step 1:** Fix critical schema issues (Phase 1)
**Step 2:** Implement categories (Phase 2)
**Step 3:** Add options & addons (Phase 3 & 4)
**Step 4:** Enhance UI (Phase 5 & 6)

**Estimated Total Time:** 15-20 hours for complete implementation

---

## 📚 Related Files

- **Database Schema:** `/pocketbase/exported_pb_schema.json`
- **Global State:** `/shared/store/atoms.js`
- **Coding Standards:** `/CODING_GUIDELINES.md`
- **Project Overview:** `/CLAUDE.md`

---

**Questions or Issues?** Update this roadmap as implementation progresses.
