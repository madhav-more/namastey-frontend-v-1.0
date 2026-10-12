"use client";
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { api } from '../utils/api';
import type { Service, GreetingPackage } from '../utils/workflow';
const field = 'w-full rounded-lg border border-stone-700 bg-stone-950 p-3 text-sm';
const button = 'rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50';
const blankService = { id: '', name: '', description: '', kind: 'welcome', active: true, sortOrder: 0 };
const blankPackage = { id: '', name: '', description: '', price: 0, serviceIds: [] as string[], includes: [] as string[], active: true, popular: false };
export default function CatalogueManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<GreetingPackage[]>([]);
  const [service, setService] = useState(blankService);
  const [pkg, setPkg] = useState(blankPackage);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const load = useCallback(() => {
    return api.get('/admin/catalogue').then(r => { setServices(r.data.services); setPackages(r.data.packages); setError(''); })
      .catch(e => setError(e instanceof Error ? e.message : 'Unable to load catalogue.'));
  }, []);
  useEffect(() => { void load(); }, [load]);
  async function save(event: FormEvent, type: 'services' | 'packages') {
    event.preventDefault(); setBusy(true); setError(''); setNotice('');
    const item = type === 'services' ? service : pkg;
    const { id, ...raw } = item;
    const body = type === 'packages' ? { ...raw, includes: pkg.includes.map(s => s.trim()).filter(Boolean) } : raw;
    try {
      if (id) await api.put(`/admin/catalogue/${type}/${id}`, body); else await api.post(`/admin/catalogue/${type}`, body);
      if (type === 'services') setService(blankService); else setPkg(blankPackage);
      await load(); setNotice('Saved. Customers see active services and packages when their catalogue refreshes.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to save.'); }
    finally { setBusy(false); }
  }
  return <section className="space-y-6 rounded-2xl border border-stone-800 bg-stone-900/30 p-5">
    <div><h2 className="text-xl font-bold">Services &amp; Packages</h2><p className="mt-1 text-sm text-stone-400">Add services and link their packages. Disable unavailable items; existing bookings keep their original details.</p></div>
    {error && <p role="alert" className="text-red-400">{error}<button className="ml-3 underline" onClick={() => void load()}>Reload</button></p>}{notice && <p role="status" className="text-green-400">{notice}</p>}
    <div className="grid gap-6 lg:grid-cols-2"><div className="space-y-3"><h3 className="font-semibold">Services</h3><div className="flex flex-wrap gap-2">{services.map(s => <button key={s.id} className="rounded-lg border border-stone-700 px-3 py-2 text-sm" onClick={() => { setService({ id: s.id, name: s.name, description: s.description, kind: s.kind, active: s.active, sortOrder: s.sortOrder }); setNotice(''); }}>{s.name}{!s.active ? ' (disabled)' : ''}</button>)}</div>
      <form onSubmit={e => void save(e, 'services')} className="space-y-3"><label className="block">Service name<input required minLength={2} maxLength={100} className={field} value={service.name} onChange={e => setService({ ...service, name: e.target.value })} /></label><label className="block">Description<textarea maxLength={1000} className={field} value={service.description} onChange={e => setService({ ...service, description: e.target.value })} /></label><label className="block">Service type<select className={field} value={service.kind} onChange={e => setService({ ...service, kind: e.target.value })}>{['airport', 'railway', 'hotel', 'function', 'welcome', 'other'].map(kind => <option key={kind} value={kind}>{kind}</option>)}</select></label><label className="block">Display order<input type="number" min={0} step={1} required className={field} value={service.sortOrder} onChange={e => setService({ ...service, sortOrder: Number(e.target.value) })} /></label><label className="flex gap-2"><input type="checkbox" checked={service.active} onChange={e => setService({ ...service, active: e.target.checked })} />Available to customers</label><div className="flex gap-3"><button disabled={busy} className={button}>{service.id ? 'Save service' : 'Add service'}</button><button type="button" onClick={() => setService(blankService)}>New service</button></div></form>
    </div><div className="space-y-3"><h3 className="font-semibold">Packages</h3><div className="flex flex-wrap gap-2">{packages.map(p => <button key={p.id} className="rounded-lg border border-stone-700 px-3 py-2 text-sm" onClick={() => { setPkg({ id: p.id, name: p.name, description: p.description, price: p.price, serviceIds: p.serviceIds, includes: p.includes, active: p.active, popular: p.popular }); setNotice(''); }}>{p.name}{!p.active ? ' (disabled)' : ''}</button>)}</div>
      <form onSubmit={e => void save(e, 'packages')} className="space-y-3"><label className="block">Package name<input required minLength={2} maxLength={100} className={field} value={pkg.name} onChange={e => setPkg({ ...pkg, name: e.target.value })} /></label><label className="block">Description<textarea maxLength={1000} className={field} value={pkg.description} onChange={e => setPkg({ ...pkg, description: e.target.value })} /></label><label className="block">Estimated base price (INR)<input type="number" min={0} step="0.01" required className={field} value={pkg.price} onChange={e => setPkg({ ...pkg, price: Number(e.target.value) })} /></label><fieldset className="space-y-2"><legend>Available for services</legend>{services.map(s => <label key={s.id} className="flex gap-2"><input type="checkbox" checked={pkg.serviceIds.includes(s.id)} onChange={e => setPkg({ ...pkg, serviceIds: e.target.checked ? [...pkg.serviceIds, s.id] : pkg.serviceIds.filter(id => id !== s.id) })} />{s.name}{!s.active ? ' (disabled)' : ''}</label>)}</fieldset><label className="block">Inclusions (one per line)<textarea className={field} value={pkg.includes.join('\n')} onChange={e => setPkg({ ...pkg, includes: e.target.value.split('\n') })} /></label><label className="flex gap-2"><input type="checkbox" checked={pkg.active} onChange={e => setPkg({ ...pkg, active: e.target.checked })} />Available to customers</label><label className="flex gap-2"><input type="checkbox" checked={pkg.popular} onChange={e => setPkg({ ...pkg, popular: e.target.checked })} />Featured package</label><div className="flex gap-3"><button disabled={busy || !pkg.serviceIds.length} className={button}>{pkg.id ? 'Save package' : 'Add package'}</button><button type="button" onClick={() => setPkg(blankPackage)}>New package</button></div></form>
    </div></div>
  </section>;
}
