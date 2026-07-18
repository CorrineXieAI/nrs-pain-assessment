const SUPABASE_URL = "https://mnpridddwzrudwxkmelc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_9_cReVcyKcfCTRLJDReE6w_irS3c-nd";

const isSupabaseConfigured =
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("PASTE_") &&
  !SUPABASE_PUBLISHABLE_KEY.includes("PASTE_");

const db = isSupabaseConfigured
  ? window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    )
  : null;

function showConfigurationWarning() {
  if (isSupabaseConfigured) return false;

  const warning = document.querySelector("#config-warning");
  if (warning) warning.hidden = false;
  return true;
}
