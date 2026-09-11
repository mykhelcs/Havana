/**
 * User mirrors UserResource output exactly.
 * UserRole and UserStatus are string literal unions — not generic string.
 * This means the TypeScript compiler will catch any unhandled role/status
 * branch at compile time, the same way PHP's match() exhaustiveness works.
 */
export type UserRole   = 'admin' | 'agent' | 'buyer'
export type UserStatus = 'active' | 'suspended'

export interface User {
  id:           string        // UUID from Supabase
  email:        string
  role:         UserRole
  status:       UserStatus
  createdAt:    string        // ISO8601 from Laravel
  lastLoginAt:  string | null // null = never logged in
}

export interface PaginatedUsers {
  data:         User[]
  currentPage:  number
  lastPage:     number
  total:        number
}

/**
 * UserListFilters drives URL query params for the user list page.
 * Keeping it typed prevents typos in filter keys passed to router.get().
 */
export interface UserListFilters {
  role?:        UserRole
  status?:      UserStatus
  searchEmail?: string
}
