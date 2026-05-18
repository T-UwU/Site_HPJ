// src/store/activity.js — Actividad cruzada entre áreas.
// Persiste solo lastReadAt; events se rehidratan de Supabase o se acumulan en memoria.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, isOnlineMode } from '../lib/supabase.js';

export const useActivity = create(
  persist(
    (set, get) => ({
      events: [],
      lastReadAt: null,
      ready: false,

      init: async () => {
        if (get().ready) return;
        if (isOnlineMode) {
          try {
            const { data } = await supabase
              .from('activity')
              .select('*')
              .order('created_at', { ascending: false })
              .limit(60);
            if (data) set({ events: data, ready: true });

            supabase.channel('hpj-activity')
              .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity' },
                ({ new: ev }) => set((s) => ({ events: [ev, ...s.events].slice(0, 60) }))
              )
              .subscribe();
          } catch {
            set({ ready: true });
          }
        } else {
          set({ ready: true });
        }
      },

      log: async (role, actor, action, room = null, refId = null) => {
        const ev = {
          id: Date.now(),
          role, actor, action,
          room: room ?? null,
          ref_id: refId ?? null,
          created_at: new Date().toISOString(),
        };
        set((s) => ({ events: [ev, ...s.events].slice(0, 60) }));
        if (isOnlineMode) {
          try {
            await supabase.from('activity').insert({ role, actor, action, room, ref_id: refId });
          } catch {}
        }
      },

      markRead: () => set({ lastReadAt: new Date().toISOString() }),
    }),
    {
      name: 'hpj.activity',
      partialize: (s) => ({ lastReadAt: s.lastReadAt }),
    }
  )
);

export function useActivityUnread(myRole) {
  const events    = useActivity((s) => s.events);
  const lastRead  = useActivity((s) => s.lastReadAt);
  const since     = lastRead ? new Date(lastRead) : new Date(0);
  return events.filter((e) => e.role !== myRole && new Date(e.created_at) > since).length;
}
