# Directive: Real Estate Operations & Domain Architecture

## 1. Objective
Define the specifications, contracts, and deterministic execution layer boundaries for the Havana Real Estate System.

## 2. 4-Layer Architecture Map
- **Layer 1 — Intent**: Home buyers can discover listings, view details, bookmark favorites, and schedule property viewings. Admins/Agents can manage listings with photos and manage lead inquiries.
- **Layer 2 — Specification**:
  - DTOs: `PropertyData`, `PaginatedProperties`, `PropertyFilter`, `InquiryData`, `PaginatedInquiries`, `InquiryFilter`.
  - Commands: `CreatePropertyCommand`, `UpdatePropertyCommand`, `CreateInquiryCommand`, `UpdateInquiryStatusCommand`.
  - Enums: `ListingType`, `PropertyType`, `PropertyStatus`, `InquiryStatus`, `FinancingOption`, `UserRole`, `UserStatus`.
- **Layer 3 — Orchestration**:
  - Thin controllers (`PropertyController`, `InquiryController`, `ClientDashboardController`, `Admin\PropertyController`, `Admin\InquiryController`).
  - No database logic, password hashing, or business transformations in controllers.
- **Layer 4 — Execution**:
  - Repositories (`PropertyRepository`, `InquiryRepository`).
  - Domain Services (`PropertyService`, `InquiryService`).
  - Mappers (`PropertyMapper`, `InquiryMapper`).

## 3. Security & Validation Rules
- Prices are stored as `BIGINT` in centavos/cents (`price_cents`).
- Multi-role authorization (`role:admin,agent`). User management is restricted exclusively to `admin`.
- Suspended users are locked out at login and OTP verification.
- Inquiries are rate-limited (`throttle:5,1`) with honeypot spam protection.
- Media uploads are restricted to `jpeg,png,webp` up to 5MB per file with UUID hashed filenames in public storage.
