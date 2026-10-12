"use client";
import { useState } from 'react';
import { api } from '../utils/api';
import type { WorkflowBooking } from '../utils/workflow';
export default function UserQuotation({ booking: b, onChanged }: { booking: WorkflowBooking; onChanged: () => void }) {
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  async function accept(paymentChoice: 'pay_now' | 'pay_later') {
    if (busy || !confirm(`Accept INR ${b.quotation?.price} with ${paymentChoice === 'pay_now' ? 'offline Pay Now' : 'Pay Later'}?`)) return;
    setBusy(true); setError('');
    try { await api.put(`/bookings/${b._id}/accept-quotation`, { paymentChoice, quoteVersion: b.quotation?.version || 0 }); onChanged(); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to accept quotation.'); }
    finally { setBusy(false); }
  }
  return <section className="space-y-3 rounded-xl border border-orange-700/30 p-4 text-sm"><p>Service: <strong>{b.service?.name || 'Welcome request'}</strong></p>{error && <p role="alert" className="text-red-400">{error}</p>}
    {b.status === 'rejected' && <p className="text-red-300">Rejected: {b.review?.reason}</p>}
    {!!b.quotation?.price && <><p className="font-semibold">Quotation: INR {b.quotation.price}</p><p>{b.quotation.notes}</p>{b.quotation.providerPhone && <a className="block text-orange-400 underline" href={`tel:${b.quotation.providerPhone.replace(/[^+\d]/g, '')}`}>Call {b.quotation.providerName || 'coordinator'}: {b.quotation.providerPhone}</a>}<p className="text-stone-400">{b.quotation.paymentInstructions || 'Arrange payment offline with your coordinator. Admin verifies the payment after receipt.'}</p></>}
    {(b.status === 'quotation_sent' || (['confirmed', 'quotation_accepted', 'operations_assigned'].includes(b.status) && b.quotation?.acceptedAt && !b.payment?.choice)) && <div className="space-y-3"><div className="flex flex-wrap gap-3"><button disabled={busy} onClick={() => void accept('pay_now')} className="rounded-lg bg-orange-600 px-4 py-2 disabled:opacity-50">Accept · Pay Now (offline)</button>{b.quotation?.allowPayLater !== false && <button disabled={busy} onClick={() => void accept('pay_later')} className="rounded-lg border border-orange-500 px-4 py-2 disabled:opacity-50">Accept · Pay Later</button>}</div><p className="text-xs text-stone-400">Pay Now requires admin payment verification before service can start. Pay Later confirms the agreed terms; payment remains due.</p></div>}
    {b.payment?.choice && <><p>Payment: {b.payment.choice.replace('_', ' ')} · {(b.payment.status || 'unpaid').replace(/_/g, ' ')}</p>{b.payment.reference && <p>Receipt/reference: {b.payment.reference}</p>}</>}
  </section>;
}
