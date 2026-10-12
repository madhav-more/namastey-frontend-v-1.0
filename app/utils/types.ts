import type { Service, GreetingPackage, WorkflowBooking } from './workflow';
export type UserProfile = { _id: string; name: string; email: string; mobile: string; role: string; companyName?: string; city?: string; profilePhoto?: { url: string } };
export type City = { id: string; name: string; areas: { id: string; name: string; type: string }[] };
export type Theme = { id: string; name: string; description: string; costumes: string; gestures: string[] };
export type Addon = { id: string; name: string; description: string; price: number; icon: string };
export type Booking = WorkflowBooking & {
  __v?: number; bookingId: string; customerName: string; customerEmail: string; customerMobile: string; companyName?: string; city?: string;
  fromCity: string; fromArea: string; toCity: string; toArea: string; pickupAddress: string; dropAddress: string;
  scheduledDate: string; scheduledTime: string; createdAt: string; numberOfGuests: number; flightNumber?: string;
  vipRequirements?: string; supportingDocuments?: string[]; specialInstructions?: string;
  package: { id: string; name: string; price: number }; culturalTheme?: { id: string; name: string };
  addons: Addon[]; packagePrice: number; addonsTotal: number;
  feedback?: { rating?: number; text?: string; suggestions?: string; issues?: string };
  timeline?: { status: string; comment?: string; timestamp: string }[];
};
export type ApiData = { user: UserProfile; token: string; booking: Booking; bookings: Booking[]; services: Service[]; packages: GreetingPackage[]; cities: City[]; themes: Theme[]; addons: Addon[] };
export type ApiResponse = { success: boolean; statusCode: number; message: string; data: ApiData };
