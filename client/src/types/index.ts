// 상품 상태 타입
export type ProductStatus = 'AVAILABLE' | 'TESTING' | 'SOLD';

// 시착 신청 상태 타입
export type TryRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

// 시착 신청 상태 한글 매핑
export const TryRequestStatusKR: Record<TryRequestStatus, string> = {
  PENDING: '대기(판매자가 확인 중)',
  APPROVED: '승인(판매자가 시착 승인)',
  REJECTED: '거절(판매자가 시착 거절)',
  CANCELLED: '취소(판매자가 판매 또는 매치 참여 취소)'
};

// 상품 타입
export interface Product {
  id: string;
  userId: string;
  brand: string;
  model: string;
  size: number;
  price: number;
  condition: string;
  description?: string;
  images: string[];
  status: ProductStatus;
  createdAt: string;
  plabUrl?: string;
  location?: string;
  address?: string;
  matchDatetime?: string;
}

// 시착 신청 타입
export interface TryRequest {
  id: string;
  productId: string;
  userId: string;
  requestType: 'TRY' | 'BUY';
  status: TryRequestStatus;
  phoneNumber: string;
  createdAt: string;
  product?: Product;
}

// 사용자 타입
export interface User {
  id: string;
  phoneNumber: string;
} 