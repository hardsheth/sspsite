export type FilterClause = {
  condition: 'include' | 'exclude';
  field: FilterField;
  operator: '=' | '!=' | '>' | '<' | 'contains' | 'before' | 'after';
  value: any;
};


export const FILTER_FIELDS = {
  customerId: { type: 'text' },
  status: { type: 'select', options: ['created', 'confirmed', 'returned'] },
  paymentStatus: { type: 'select', options: ['pending', 'paid', 'failed'] },
  paymentMethod: { type: 'select', options: ['UPI', 'CARD', 'COD'] },
  amount: { type: 'number' },
  refundedAmount: { type: 'number' },
  bookingDate: { type: 'date' },
  returnDate: { type: 'date' },
  createdAt: { type: 'date' },
} as const;

export type FilterField = keyof typeof FILTER_FIELDS;

