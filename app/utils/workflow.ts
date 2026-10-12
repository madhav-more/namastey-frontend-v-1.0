export type Service = { id: string; name: string; description: string; kind: string; active: boolean; sortOrder: number };
export type GreetingPackage = { id: string; name: string; description: string; price: number; serviceIds: string[]; includes: string[]; active: boolean; popular: boolean };
export type WorkflowBooking = {
  _id: string; status: string; totalAmount: number;
  service?: { id: string; name: string; kind: string };
  review?: { decision: string; reason: string };
  quotation?: { price: number; version?: number; acceptedAt?: string; notes?: string; providerName?: string; providerPhone?: string; paymentInstructions?: string; allowPayLater?: boolean };
  payment?: { choice?: string; status?: string; amount?: number; reference?: string };
  operations?: { assignedName?: string; assignedPhone?: string };
};
export const nextStatuses: Record<string, string[]> = {
  pending: ['under_review', 'cancelled'], under_review: ['cancelled'], accepted: ['cancelled'],
  quotation_sent: ['cancelled'], payment_pending: ['cancelled'], quotation_accepted: ['cancelled'], confirmed: ['cancelled'],
  operations_assigned: ['team_on_the_way', 'in_progress', 'cancelled'], team_on_the_way: ['in_progress', 'cancelled'], in_progress: ['completed'],
};
