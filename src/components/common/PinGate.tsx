"use client";
/**
 * PinGate — Secondary Security Component
 *
 * Wraps sensitive data fields. Admin/VP roles must enter their role PIN
 * to view protected content. Teachers, students, and parents see
 * role-appropriate restrictions.
 *
 * Usage:
 *   <PinGate correctPin={pin} role={activeRole} actor={user.name} field="Parent Contact">
 *     <span>{student.parentPhone}</span>
 *   </PinGate>
 */

import { useState, type ReactNode } from "react";
import { Lock, Unlock, ShieldAlert, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { usePinStore } from "@/store/usePinStore";
import { useDataStore } from "@/store/useDataStore";

const PIN_ROLES = ["admin", "vp1", "vp2", "vp3"];
const MAX_FAILURES = 3;

interface PinGateProps {
  correctPin: string;
  role: string;
  actor: string;
  field?: string;
  children: ReactNode;
  inline?: boolean;
}

export function PinGate({ correctPin, role, actor, field = "Protected Data", children, inline = false }: PinGateProps) {
  const { unlocked, failCount, unlock } = usePinStore();
  const { addNotification } = useDataStore();

  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [blocked, setBlocked] = useState(false);

  const canAccess = PIN_ROLES.includes(role);

  if (!canAccess) {
    return inline ? (
      <span className="text-xs text-muted-foreground italic">Restricted</span>
    ) : (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground italic">
        <Lock className="h-3 w-3" /> Contact administration
      </div>
    );
  }

  if (unlocked) {
    return (
      <span className="group relative">
        {children}
      </span>
    );
  }

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...pin];
    next[index] = value.slice(-1);
    setPin(next);
    setError("");
    if (value && index < 3) {
      document.getElementById(`pin-gate-${index + 1}`)?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      document.getElementById(`pin-gate-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = () => {
    const entered = pin.join("");
    if (entered.length < 4) {
      setError("Enter all 4 digits.");
      return;
    }
    const success = unlock(entered, correctPin, role, actor, field);
    if (success) {
      setOpen(false);
      setPin(["", "", "", ""]);
      setError("");
    } else {
      const newFailCount = failCount + 1;
      setPin(["", "", "", ""]);
      setError("Incorrect PIN. Try again.");
      document.getElementById("pin-gate-0")?.focus();

      if (newFailCount >= MAX_FAILURES) {
        setBlocked(true);
        addNotification({
          type: "alert",
          title: "⚠️ Security Alert — PIN Failure",
          body: `${MAX_FAILURES} failed PIN attempts by ${actor} (${role}) trying to access "${field}". Access temporarily blocked.`,
          timestamp: "Just now",
          isRead: false,
          priority: "urgent",
          link: "/audit",
          actor: "Security System",
          roles: ["admin"],
        });
        setOpen(false);
      }
    }
  };

  if (blocked) {
    return inline ? (
      <span className="text-xs text-destructive font-medium flex items-center gap-1">
        <ShieldAlert className="h-3 w-3" /> Blocked
      </span>
    ) : (
      <div className="flex items-center gap-1.5 text-xs text-destructive font-medium">
        <ShieldAlert className="h-3 w-3" /> Access blocked — security alert raised
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => { setOpen(true); setPin(["", "", "", ""]); setError(""); }}
        className={inline
          ? "inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          : "flex items-center gap-1.5 text-xs px-2 py-1 rounded-md border border-dashed border-muted-foreground/40 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        }
        title={`View ${field} — PIN required`}
      >
        <Lock className="h-3 w-3" />
        {inline ? "••••" : `View ${field}`}
      </button>

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setPin(["", "", "", ""]); setError(""); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" /> Sensitive Data Access
            </DialogTitle>
            <DialogDescription>
              Enter your security PIN to view <strong>{field}</strong>.
              {failCount > 0 && (
                <span className="block mt-1 text-destructive text-xs">
                  {MAX_FAILURES - failCount} attempt{MAX_FAILURES - failCount !== 1 ? "s" : ""} remaining.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-3 justify-center py-2">
            {pin.map((d, i) => (
              <input
                key={i}
                id={`pin-gate-${i}`}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handlePinChange(i, e.target.value)}
                onKeyDown={(e) => handlePinKeyDown(i, e)}
                className="w-12 h-14 text-center text-xl font-bold border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            ))}
          </div>

          {error && (
            <p className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2 text-center">
              {error}
            </p>
          )}

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="gap-1.5" disabled={pin.join("").length < 4}>
              <Unlock className="h-4 w-4" /> Unlock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
