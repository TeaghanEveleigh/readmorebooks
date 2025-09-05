// --- Google Books shapes (expanded) ---

export type IndustryIdentifier = {
  type: "ISBN_10" | "ISBN_13" | (string & {});
  identifier: string;
};

export type ReadingModes = { text?: boolean; image?: boolean };

export type PanelizationSummary = {
  containsEpubBubbles?: boolean;
  containsImageBubbles?: boolean;
};

export type ImageLinks = {
  smallThumbnail?: string;
  thumbnail?: string;
  small?: string;
  medium?: string;
  large?: string;
  extraLarge?: string;
};

export type VolumePrice = {
  amount: number;
  currencyCode: string;
};

export type Offer = {
  finskyOfferType?: number;
  listPrice?: VolumePrice;
  retailPrice?: VolumePrice;
};

export type EpubPdf = { isAvailable?: boolean; acsTokenLink?: string };

export type AccessInfo = {
  country?: string;
  viewability?: string; // e.g. "PARTIAL" | "ALL_PAGES"
  embeddable?: boolean;
  publicDomain?: boolean;
  textToSpeechPermission?: string;
  epub?: EpubPdf;
  pdf?: EpubPdf;
  webReaderLink?: string;
  accessViewStatus?: string;
  quoteSharingAllowed?: boolean;
};

export type SearchInfo = {
  textSnippet?: string;
};

export type VolumeInfo = {
  title: string;
  subtitle?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string; // "YYYY" | "YYYY-MM" | "YYYY-MM-DD"
  description?: string;
  industryIdentifiers?: IndustryIdentifier[];
  readingModes?: ReadingModes;
  pageCount?: number;
  printType?: "BOOK" | (string & {});
  categories?: string[];
  averageRating?: number; // 0-5
  ratingsCount?: number;
  maturityRating?: "NOT_MATURE" | "MATURE" | (string & {});
  allowAnonLogging?: boolean;
  contentVersion?: string;
  panelizationSummary?: PanelizationSummary;
  imageLinks?: ImageLinks;
  language?: string; // ISO 639-1
  previewLink?: string;
  infoLink?: string;
  canonicalVolumeLink?: string;
};

export type SaleInfo = {
  country?: string;
  saleability?: string; // e.g. "FOR_SALE", "NOT_FOR_SALE"
  isEbook?: boolean;
  listPrice?: VolumePrice;
  retailPrice?: VolumePrice;
  buyLink?: string;
  offers?: Offer[];
};

export interface Book {
  id: string;
  volumeInfo: VolumeInfo;
  saleInfo?: SaleInfo;
  accessInfo?: AccessInfo;
  searchInfo?: SearchInfo;
}


export interface Library {
  id: string;
  name: string;
  description?: string;
  bookCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  books?: LibraryBook[];
}

export interface LibraryBook extends Book {
  userTags?: string[];
  dateAdded: string;
  userRating?: number;
  userReview?: string;
  readingStatus?: 'want-to-read' | 'currently-reading' | 'read';
  progress?: number;
}

export interface Activity {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  type: 'review' | 'finished' | 'started' | 'want-to-read';
  book: {
    id: string;
    title: string;
    authors?: string[];
    thumbnail?: string;
  };
  rating?: number;
  review?: string;
  likes: number;
  comments: number;
  createdAt: string;
}

export interface SearchFilters {
  query?: string;
  author?: string;
  subject?: string;
  publisher?: string;
  publishedDate?: string;
}

export interface SortOptions {
  sortBy: 'relevance' | 'newest' | 'title' | 'author' | 'rating' | 'dateAdded';
  order: 'asc' | 'desc';
}

export interface ReadingProgress {
  bookId: string;
  currentPage: number;
  totalPages: number;
  percentage: number;
  lastUpdated: string;
}