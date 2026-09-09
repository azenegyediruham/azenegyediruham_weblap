"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase/client";
import type { FieldDef, ResourceDef } from "@/lib/admin/resources";

type Row = Record<string, unknown>;

/** Típus nélküli kliens a generikus admin műveletekhez (a séma-típusok itt nem adnak hozzá értéket). */
function db(): SupabaseClient {
  return getSupabase() as unknown as SupabaseClient;
}

function cell(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "boolean") return v ? "igen" : "nem";
  if (typeof v === "object") return JSON.stringify(v).slice(0, 60);
  const s = String(v);
  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) return new Date(s).toLocaleString("hu-HU");
  return s.length > 60 ? `${s.slice(0, 60)}…` : s;
}

export function ResourceManager({ resource }: { resource: ResourceDef }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [refs, setRefs] = useState<Record<string, { value: string; label: string }[]>>({});
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const load = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let q = db().from(resource.table).select("*");
      if (resource.orderBy) q = q.order(resource.orderBy.column, { ascending: resource.orderBy.ascending ?? true });
      const { data, error: err } = await q.limit(500);
      if (cancelled) return;
      if (err) setError(err.message);
      setRows((data as Row[]) ?? []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [resource, reloadKey]);

  useEffect(() => {
    const refFields = resource.fields.filter((f) => f.ref);
    if (!refFields.length) return;
    let cancelled = false;
    Promise.all(
      refFields.map(async (f) => {
        const { data } = await db()
          .from(f.ref!.table)
          .select(`${f.ref!.valueKey ?? "id"}, ${f.ref!.labelKey}`)
          .limit(1000);
        return [f.key, ((data as unknown as Row[]) ?? []).map((r) => ({ value: String(r[f.ref!.valueKey ?? "id"]), label: String(r[f.ref!.labelKey]) }))] as const;
      }),
    ).then((entries) => {
      if (!cancelled) setRefs(Object.fromEntries(entries));
    });
    return () => {
      cancelled = true;
    };
  }, [resource]);

  const filtered = useMemo(() => {
    if (!filter) return rows;
    const f = filter.toLowerCase();
    return rows.filter((r) => resource.listColumns.some((c) => cell(r[c]).toLowerCase().includes(f)));
  }, [rows, filter, resource.listColumns]);

  const save = async (values: Row) => {
    setError(null);
    const payload: Row = {};
    for (const f of resource.fields) {
      if (f.type === "readonly") continue;
      if (!(f.key in values)) continue;
      payload[f.key] = values[f.key];
    }
    if (creating) {
      const { error: err } = await db().from(resource.table).insert(payload);
      if (err) return setError(err.message);
    } else if (editing) {
      const { error: err } = await db().from(resource.table).update(payload).eq(resource.idKey, editing[resource.idKey]);
      if (err) return setError(err.message);
    }
    setEditing(null);
    setCreating(false);
    load();
  };

  const remove = async (row: Row) => {
    if (!window.confirm("Biztosan törlöd? Ez nem visszavonható.")) return;
    const { error: err } = await db().from(resource.table).delete().eq(resource.idKey, row[resource.idKey]);
    if (err) setError(err.message);
    else load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{resource.title}</h1>
          <p className="text-sm text-muted">{resource.description}</p>
        </div>
        <div className="flex gap-2">
          <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Szűrés…" className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm" />
          {resource.canCreate ? (
            <button
              type="button"
              onClick={() => {
                setCreating(true);
                setEditing({});
              }}
              className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground"
            >
              + Új
            </button>
          ) : null}
        </div>
      </div>
      {error ? (
        <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-[0.12em] text-muted">
            <tr>
              {resource.listColumns.map((c) => (
                <th key={c} className="px-3 py-2 font-medium">
                  {resource.fields.find((f) => f.key === c)?.label ?? c}
                </th>
              ))}
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={resource.listColumns.length + 1} className="px-3 py-6 text-center text-muted">
                  Betöltés…
                </td>
              </tr>
            ) : null}
            {filtered.map((r, i) => (
              <tr key={String(r[resource.idKey] ?? i)} className="border-b border-line/60 hover:bg-background">
                {resource.listColumns.map((c) => (
                  <td key={c} className="px-3 py-2 align-top">
                    {c === "hex" && typeof r[c] === "string" ? <span className="mr-2 inline-block h-3 w-3 rounded-full border border-black/10 align-middle" style={{ backgroundColor: r[c] as string }} /> : null}
                    {cell(r[c])}
                  </td>
                ))}
                <td className="whitespace-nowrap px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setCreating(false);
                      setEditing(r);
                    }}
                    className="text-xs underline-offset-4 hover:underline"
                  >
                    Szerkesztés
                  </button>
                  {resource.canDelete ? (
                    <button type="button" onClick={() => void remove(r)} className="ml-3 text-xs text-red-700 underline-offset-4 hover:underline">
                      Törlés
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 ? (
              <tr>
                <td colSpan={resource.listColumns.length + 1} className="px-3 py-6 text-center text-muted">
                  Nincs adat.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted">{rows.length} sor (max 500 betöltve)</p>

      {editing ? (
        <RowForm
          key={String(editing[resource.idKey] ?? "new")}
          resource={resource}
          row={editing}
          refs={refs}
          creating={creating}
          onCancel={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSave={save}
        />
      ) : null}
    </div>
  );
}

function RowForm({ resource, row, refs, creating, onCancel, onSave }: { resource: ResourceDef; row: Row; refs: Record<string, { value: string; label: string }[]>; creating: boolean; onCancel: () => void; onSave: (v: Row) => Promise<void> }) {
  const [values, setValues] = useState<Row>(() => ({ ...row }));
  const [jsonErrors, setJsonErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const set = (k: string, v: unknown) => setValues((s) => ({ ...s, [k]: v }));

  const upload = async (f: FieldDef, file: File) => {
    if (!f.bucket) return;
    setUploading(f.key);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
    const path = `${f.folder ?? "uploads"}/${crypto.randomUUID()}.${ext}`;
    const { error } = await db().storage.from(f.bucket).upload(path, file, { contentType: file.type || undefined, upsert: false });
    setUploading(null);
    if (error) {
      window.alert(`Feltöltés sikertelen: ${error.message}`);
      return;
    }
    const { data } = db().storage.from(f.bucket).getPublicUrl(path);
    set(f.key, data.publicUrl);
  };

  return (
    <div className="mt-6 rounded-2xl border border-foreground bg-surface p-5">
      <h2 className="text-lg font-semibold">{creating ? "Új elem" : "Szerkesztés"}</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (Object.keys(jsonErrors).length) return;
          setBusy(true);
          await onSave(values);
          setBusy(false);
        }}
        className="mt-4 grid gap-3 md:grid-cols-2"
      >
        {resource.fields.map((f) => {
          const v = values[f.key];
          const common = "mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm";
          let control: React.ReactNode;
          switch (f.type) {
            case "readonly":
              control = <div className={`${common} whitespace-pre-wrap break-all text-muted`}>{typeof v === "object" && v !== null ? JSON.stringify(v, null, 2) : cell(v)}</div>;
              break;
            case "textarea":
              control = <textarea rows={3} value={(v as string) ?? ""} onChange={(e) => set(f.key, e.target.value)} className={common} />;
              break;
            case "number":
              control = <input type="number" step="any" value={v === null || v === undefined ? "" : String(v)} onChange={(e) => set(f.key, e.target.value === "" ? null : Number(e.target.value))} className={common} required={f.required} />;
              break;
            case "boolean":
              control = (
                <label className="mt-1 flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={Boolean(v)} onChange={(e) => set(f.key, e.target.checked)} /> {Boolean(v) ? "igen" : "nem"}
                </label>
              );
              break;
            case "select": {
              const opts = f.options ?? refs[f.key] ?? [];
              control = (
                <select value={(v as string) ?? ""} onChange={(e) => set(f.key, e.target.value || null)} className={common} required={f.required}>
                  <option value="">—</option>
                  {opts.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              );
              break;
            }
            case "color":
              control = (
                <div className="mt-1 flex items-center gap-2">
                  <input type="color" value={typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v) ? v : "#cccccc"} onChange={(e) => set(f.key, e.target.value.toUpperCase())} />
                  <input value={(v as string) ?? ""} onChange={(e) => set(f.key, e.target.value)} className="w-full rounded-lg border border-line bg-background px-3 py-2 text-sm" />
                </div>
              );
              break;
            case "json":
              control = (
                <JsonField
                  value={v}
                  onChange={(parsed, err) => {
                    setJsonErrors((s) => {
                      const n = { ...s };
                      if (err) n[f.key] = err;
                      else delete n[f.key];
                      return n;
                    });
                    if (!err) set(f.key, parsed);
                  }}
                  error={jsonErrors[f.key]}
                />
              );
              break;
            case "file":
              control = (
                <div className="mt-1 space-y-1">
                  <input value={(v as string) ?? ""} onChange={(e) => set(f.key, e.target.value)} placeholder="URL vagy /public út" className="w-full rounded-lg border border-line bg-background px-3 py-2 text-sm" />
                  <input type="file" onChange={(e) => e.target.files?.[0] && void upload(f, e.target.files[0])} className="block w-full text-xs" />
                  {uploading === f.key ? <span className="text-xs text-muted">Feltöltés…</span> : null}
                  <span className="text-xs text-muted">Bucket: {f.bucket}</span>
                </div>
              );
              break;
            default:
              control = <input value={(v as string) ?? ""} onChange={(e) => set(f.key, e.target.value)} className={common} required={f.required} />;
          }
          return (
            <label key={f.key} className={`block text-sm ${f.type === "textarea" || f.type === "json" || f.type === "readonly" ? "md:col-span-2" : ""}`}>
              <span className="font-medium">{f.label}</span>
              {f.help ? <span className="ml-2 text-xs text-muted">{f.help}</span> : null}
              {control}
            </label>
          );
        })}
        <div className="flex gap-2 md:col-span-2">
          <button type="submit" disabled={busy} className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground disabled:opacity-50">
            {busy ? "Mentés…" : "Mentés"}
          </button>
          <button type="button" onClick={onCancel} className="rounded-full border border-line px-5 py-2 text-sm">
            Mégse
          </button>
        </div>
      </form>
    </div>
  );
}

function JsonField({ value, onChange, error }: { value: unknown; onChange: (parsed: unknown, err: string | null) => void; error?: string }) {
  const [text, setText] = useState(() => (value === undefined || value === null ? "" : JSON.stringify(value, null, 2)));
  return (
    <div className="mt-1">
      <textarea
        rows={6}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (!e.target.value.trim()) return onChange(null, null);
          try {
            onChange(JSON.parse(e.target.value), null);
          } catch {
            onChange(null, "Érvénytelen JSON");
          }
        }}
        className={`w-full rounded-lg border bg-background px-3 py-2 font-mono text-xs ${error ? "border-red-500" : "border-line"}`}
      />
      {error ? <span className="text-xs text-red-700">{error}</span> : null}
    </div>
  );
}
