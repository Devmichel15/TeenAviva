import { supabase } from "../supabase/client";

const PLAN_SELECT = "*, user_plan_daily_logs(day, completed_at)";
const planSubscriptions = new Map();

function mapPlan(row) {
  if (!row) return null;
  const dailyLogs = (row.user_plan_daily_logs || []).map((log) => ({
    day: log.day,
    completedAt: log.completed_at,
  }));
  return {
    id: row.id,
    userId: row.user_id,
    planId: row.plan_id,
    planTitle: row.plan_title,
    planDuration: row.plan_duration,
    planIcon: row.plan_icon,
    planIconColor: row.plan_icon_color,
    currentDay: row.current_day,
    startedAt: row.started_at,
    status: row.status,
    progress: row.progress,
    dailyLogs,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toPlanRow(uid, planId, plan) {
  return {
    user_id: uid,
    plan_id: planId,
    plan_title: plan.title,
    plan_duration: plan.totalDays || plan.duration,
    plan_icon: plan.icon,
    plan_icon_color: plan.color || plan.iconColor,
  };
}

export const UserPlanService = {
  async getActive(uid) {
    const { data, error } = await supabase
      .from("user_plans")
      .select(PLAN_SELECT)
      .eq("user_id", uid)
      .eq("status", "active")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return mapPlan(data);
  },

  async getAll(uid) {
    const { data, error } = await supabase
      .from("user_plans")
      .select(PLAN_SELECT)
      .eq("user_id", uid)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data || []).map(mapPlan);
  },

  async findByPlanId(uid, planId) {
    const { data, error } = await supabase
      .from("user_plans")
      .select(PLAN_SELECT)
      .eq("user_id", uid)
      .eq("plan_id", planId)
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return mapPlan(data);
  },

  async create(uid, planId, plan) {
    const { data, error } = await supabase
      .from("user_plans")
      .insert(toPlanRow(uid, planId, plan))
      .select(PLAN_SELECT)
      .maybeSingle();

    if (error) {
      if (error.code === "23505") return this.findByPlanId(uid, planId);
      throw error;
    }
    return mapPlan(data);
  },

  async updateProgress(id, currentDay) {
    const { error } = await supabase
      .from("user_plans")
      .update({ current_day: currentDay, progress: currentDay })
      .eq("id", id);

    if (error) throw error;
  },

  async appendDailyLog(id, uid, logEntry) {
    const { error } = await supabase.from("user_plan_daily_logs").upsert(
      {
        user_plan_id: id,
        user_id: uid,
        day: logEntry.day,
        completed_at: logEntry.completedAt,
      },
      { onConflict: "user_plan_id,day" },
    );

    if (error) throw error;
  },

  subscribe(uid, cb) {
    if (!uid) return () => {};

    const channelName = `user_plans:${uid}`;
    const existing = planSubscriptions.get(channelName);
    const listeners = existing ? existing.listeners : new Set();

    if (existing) {
      listeners.add(cb);
      planSubscriptions.set(channelName, {
        listeners,
        channel: existing.channel,
      });
    } else {
      const state = { listeners: new Set([cb]), channel: null };
      planSubscriptions.set(channelName, state);

      const load = async () => {
        const { data, error } = await supabase
          .from("user_plans")
          .select(PLAN_SELECT)
          .eq("user_id", uid)
          .order("created_at", { ascending: true });

        if (error) return;

        for (const listener of [...state.listeners]) {
          listener((data || []).map(mapPlan));
        }
      };

      const channel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "user_plans",
            filter: `user_id=eq.${uid}`,
          },
          load,
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "user_plan_daily_logs",
            filter: `user_id=eq.${uid}`,
          },
          load,
        )
        .subscribe();

      state.channel = channel;
    }

    return () => {
      const state = planSubscriptions.get(channelName);
      if (!state) return;

      state.listeners.delete(cb);

      if (state.listeners.size === 0) {
        supabase.removeChannel(state.channel);
        planSubscriptions.delete(channelName);
      }
    };
  },
};
