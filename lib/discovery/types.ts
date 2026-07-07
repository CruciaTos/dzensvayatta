export interface DiscoveryPayload {
  companyName: string;
  companyField: string;
  description: string;
  email: string;
  contactNo: string;
  meetDate: string;
  meetTime: string;
}

export interface DiscoveryResult {
  eventId: string;
  eventLink?: string | null;
}
