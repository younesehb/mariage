"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckSquare,
  Check,
  Plus,
  Trash2,
  Calendar,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  buildDefaultTasks,
  emptyPlan,
  loadPlan,
  PHASE_META,
  savePlan,
  type ChecklistTask,
  type TaskPhase,
  type WeddingPlan,
} from "@/lib/planner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { HelpCallout } from "@/components/help-callout";

function genId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `t-${crypto.randomUUID()}`;
  }
  return `t-${Math.random().toString(36).slice(2, 10)}`;
}

function formatDue(weddingDate: string | null, offsetDays: number): string {
  if (!weddingDate) {
    if (offsetDays === 0) return "Jour J";
    const abs = Math.abs(offsetDays);
    if (offsetDays < 0) return `J-${abs}`;
    return `J+${abs}`;
  }
  const d = new Date(weddingDate);
  d.setDate(d.getDate() + offsetDays);
  return new Intl.DateTimeFormat("fr-BE", { day: "numeric", month: "short", year: "numeric" }).format(d);
}

function isOverdue(weddingDate: string | null, offsetDays: number, done: boolean): boolean {
  if (done || !weddingDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(weddingDate);
  d.setDate(d.getDate() + offsetDays);
  return d.getTime() < today.getTime();
}

export function Checklist() {
  const [plan, setPlan] = useState<WeddingPlan | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [removeId, setRemoveId] = useState<string | null>(null);

  useEffect(() => {
    setPlan(loadPlan() ?? emptyPlan());
  }, []);

  function update(next: WeddingPlan) {
    setPlan(next);
    savePlan(next);
  }

  function toggle(id: string) {
    if (!plan) return;
    update({
      ...plan,
      tasks: plan.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    });
  }

  function addTask(phase: TaskPhase, label: string) {
    if (!plan || !label.trim()) return;
    const t: ChecklistTask = {
      id: genId(),
      phase,
      label: label.trim(),
      dueOffsetDays: 0,
      done: false,
      custom: true,
    };
    update({ ...plan, tasks: [...plan.tasks, t] });
  }

  function updateTaskDue(id: string, offset: number) {
    if (!plan) return;
    update({
      ...plan,
      tasks: plan.tasks.map((t) => (t.id === id ? { ...t, dueOffsetDays: offset } : t)),
    });
  }

  function removeTask(id: string) {
    if (!plan) return;
    update({ ...plan, tasks: plan.tasks.filter((t) => t.id !== id) });
  }

  function resetChecklist() {
    if (!plan) return;
    update({ ...plan, tasks: buildDefaultTasks() });
  }

  const stats = useMemo(() => {
    if (!plan) return null;
    const total = plan.tasks.length;
    const done = plan.tasks.filter((t) => t.done).length;
    const overdue = plan.tasks.filter((t) => isOverdue(plan.weddingDate, t.dueOffsetDays, t.done)).length;
    return { total, done, overdue, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
  }, [plan]);

  const grouped = useMemo(() => {
    if (!plan) return null;
    const sortedPhases = (Object.keys(PHASE_META) as TaskPhase[]).sort(
      (a, b) => PHASE_META[a].order - PHASE_META[b].order,
    );
    return sortedPhases.map((phase) => ({
      phase,
      meta: PHASE_META[phase],
      tasks: plan.tasks
        .filter((t) => t.phase === phase)
        .sort((a, b) => a.dueOffsetDays - b.dueOffsetDays),
    }));
  }, [plan]);

  if (!plan || !stats || !grouped) {
    return (
      <div className="mx-auto max-w-[1100px] px-4 md:px-8 py-12">
        <div className="h-8 w-40 bg-surface-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 md:px-8 py-8 md:py-12">
      <Link
        href="/planifier"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink mb-6"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        Retour au plan
      </Link>

      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-pill bg-garnet/10 px-3 py-1 text-xs font-semibold text-garnet mb-3">
            <CheckSquare className="h-3.5 w-3.5" strokeWidth={2} />
            Checklist
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-ink">
            De la khotba à la walima
          </h1>
          <p className="mt-2 max-w-2xl text-ink-muted">
            Les étapes classiques d'un mariage marocain, adaptées au rythme de la diaspora.
            Ajoutez les vôtres, cochez au fur et à mesure.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setResetOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-pill border border-hairline bg-card px-3 py-2 text-xs font-medium text-ink hover:border-ink-muted"
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
          Réinitialiser la liste
        </button>
      </header>

      <HelpCallout
        storageKey="checklist"
        intro="Une liste par phase du mariage, à cocher au fur et à mesure."
        steps={[
          {
            title: "Les 6 phases",
            body: "Khotba, préparation, henné, nikah, walima, après-mariage — chacune avec ses tâches types.",
          },
          {
            title: "Échéances intelligentes",
            body: "Définissez la date du mariage dans « Mon plan » : les échéances en J-N se transforment en dates réelles. Les tâches en retard passent en garnet.",
          },
          {
            title: "Personnalisez",
            body: "Ajoutez vos propres tâches à chaque phase via le champ « + » en bas de la section. Ajustez le J-N via le sélecteur à droite de chaque ligne.",
          },
        ]}
        className="mb-6"
      />

      {/* Progress */}
      <section className="mb-6 rounded-xl border border-hairline bg-card p-4 md:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
              Progression
            </div>
            <div className="mt-1 font-serif text-3xl text-ink">
              {stats.percent}
              <span className="text-xl text-ink-muted">%</span>
            </div>
            <div className="text-xs text-ink-muted">
              {stats.done} / {stats.total} tâches · {stats.overdue > 0 && (
                <span className="text-garnet font-medium">{stats.overdue} en retard</span>
              )}
              {stats.overdue === 0 && <span>à jour</span>}
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full bg-garnet transition-all duration-500"
                style={{ width: `${stats.percent}%` }}
              />
            </div>
            {!plan.weddingDate && (
              <p className="mt-2 text-xs text-ink-muted">
                Définissez la date du mariage dans le{" "}
                <Link href="/planifier" className="underline underline-offset-4 text-ink">
                  plan
                </Link>{" "}
                pour voir les échéances réelles.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Phases */}
      <div className="space-y-5">
        {grouped.map(({ phase, meta, tasks }) => (
          <PhaseSection
            key={phase}
            phase={phase}
            meta={meta}
            tasks={tasks}
            weddingDate={plan.weddingDate}
            onToggle={toggle}
            onAdd={(label) => addTask(phase, label)}
            onUpdateDue={updateTaskDue}
            onRemove={(id) => setRemoveId(id)}
          />
        ))}
      </div>

      <ConfirmDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Réinitialiser la checklist ?"
        description="La liste reviendra aux tâches par défaut. Vos tâches personnalisées seront perdues."
        confirmLabel="Réinitialiser"
        tone="destructive"
        icon={<RotateCcw className="h-4 w-4" strokeWidth={1.75} />}
        onConfirm={resetChecklist}
      />
      <ConfirmDialog
        open={removeId != null}
        onOpenChange={(v) => !v && setRemoveId(null)}
        title="Supprimer cette tâche ?"
        description="Cette action est irréversible."
        confirmLabel="Supprimer"
        tone="destructive"
        icon={<Trash2 className="h-4 w-4" strokeWidth={1.75} />}
        onConfirm={() => removeId && removeTask(removeId)}
      />
    </div>
  );
}

function PhaseSection({
  phase,
  meta,
  tasks,
  weddingDate,
  onToggle,
  onAdd,
  onUpdateDue,
  onRemove,
}: {
  phase: TaskPhase;
  meta: { label: string; description: string };
  tasks: ChecklistTask[];
  weddingDate: string | null;
  onToggle: (id: string) => void;
  onAdd: (label: string) => void;
  onUpdateDue: (id: string, offset: number) => void;
  onRemove: (id: string) => void;
}) {
  const [newLabel, setNewLabel] = useState("");
  const done = tasks.filter((t) => t.done).length;

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!newLabel.trim()) return;
    onAdd(newLabel);
    setNewLabel("");
  }

  return (
    <section className="rounded-2xl border border-hairline bg-card overflow-hidden">
      <header className="flex items-start justify-between gap-4 p-4 md:p-5 border-b border-hairline bg-surface-muted/30">
        <div>
          <h2 className="font-serif text-xl text-ink">{meta.label}</h2>
          <p className="mt-0.5 text-sm text-ink-muted">{meta.description}</p>
        </div>
        <span className="shrink-0 inline-flex items-center rounded-pill border border-hairline bg-card px-2.5 py-1 text-xs font-medium text-ink-muted tabular-nums">
          {done} / {tasks.length}
        </span>
      </header>

      <ul className="divide-y divide-hairline">
        {tasks.map((t) => (
          <li key={t.id}>
            <TaskRow
              task={t}
              weddingDate={weddingDate}
              onToggle={() => onToggle(t.id)}
              onUpdateDue={(offset) => onUpdateDue(t.id, offset)}
              onRemove={() => onRemove(t.id)}
            />
          </li>
        ))}
      </ul>

      <form onSubmit={submit} className="flex items-center gap-2 border-t border-hairline px-4 py-3">
        <Plus className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder={`Ajouter une tâche à « ${meta.label} »`}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-muted"
          aria-label={`Nouvelle tâche pour ${meta.label}`}
        />
        {newLabel.trim() && (
          <button
            type="submit"
            className="rounded-pill bg-ink px-3 py-1.5 text-xs font-semibold text-surface"
          >
            Ajouter
          </button>
        )}
      </form>
    </section>
  );
}

function TaskRow({
  task,
  weddingDate,
  onToggle,
  onUpdateDue,
  onRemove,
}: {
  task: ChecklistTask;
  weddingDate: string | null;
  onToggle: () => void;
  onUpdateDue: (offset: number) => void;
  onRemove: () => void;
}) {
  const overdue = isOverdue(weddingDate, task.dueOffsetDays, task.done);

  return (
    <div className="group flex items-center gap-3 px-4 py-3">
      <button
        type="button"
        onClick={onToggle}
        role="checkbox"
        aria-checked={task.done}
        aria-label={task.done ? `Rouvrir : ${task.label}` : `Marquer terminé : ${task.label}`}
        className={cn(
          "grid h-5 w-5 shrink-0 place-items-center rounded border transition-all",
          task.done
            ? "border-ink bg-ink text-surface"
            : "border-hairline bg-card hover:border-ink-muted",
        )}
      >
        {task.done && <Check className="h-3 w-3" strokeWidth={2.5} />}
      </button>

      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "text-sm",
            task.done ? "text-ink-muted line-through" : "text-ink",
          )}
        >
          {task.label}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-ink-muted">
          <Calendar className="h-3 w-3" strokeWidth={1.75} />
          <span className={cn("tabular-nums", overdue && "text-garnet font-medium")}>
            {formatDue(weddingDate, task.dueOffsetDays)}
          </span>
          {overdue && <span className="text-garnet">· En retard</span>}
          {task.custom && <span className="rounded bg-surface-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider">Perso</span>}
        </div>
      </div>

      <DueOffsetStepper value={task.dueOffsetDays} onChange={onUpdateDue} />

      <button
        type="button"
        onClick={onRemove}
        aria-label="Supprimer la tâche"
        className="opacity-0 group-hover:opacity-100 rounded p-1 text-ink-muted hover:text-garnet focus:opacity-100"
      >
        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
      </button>
    </div>
  );
}

function DueOffsetStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <label className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-hairline bg-card px-2 py-1 text-xs text-ink-muted">
      <span>J</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        step={1}
        className="w-14 bg-transparent text-right text-xs font-medium text-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        aria-label="Jours relatifs au mariage (négatif = avant)"
      />
    </label>
  );
}
