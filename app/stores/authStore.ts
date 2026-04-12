import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useValidation, useRouter, useCookie } from "#imports";

export const useAuthStore = defineStore("auth", () => {
  const { toEnglishNumbers } = useValidation();
  const router = useRouter();
  const token = useCookie("auth_token", { maxAge: 60 * 60 * 24 * 7 });

  // --- State ---
  const loginIdentifier = ref("");
  const loginType = ref<"phone" | "national_id" | null>(null);
  const user = ref<any>(null);
  const isRegistering = ref(false)

  const isRequesting = ref(false);
  const isVerifying = ref(false);
  const isRevoking = ref(false);
  const sentIdentifiers = ref<string[]>([]);
  const timers = ref<Record<string, number>>({});

  // --- Getters ---
  const isLoggedIn = computed(() => !!token.value);

  const getRemainingTime = (identifier: string): number => {
    const cleanId = toEnglishNumbers(identifier);
    const expiry = timers.value[cleanId];
    if (!expiry) return 0;
    const remaining = Math.ceil((expiry - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  };

  // --- Actions ---

  /**
   * Commits the login data to the store so subsequent pages know
   * exactly who is logging in and via what method.
   */
  const setLoginData = (val: string) => {
    const cleanId = toEnglishNumbers(val.trim());
    loginIdentifier.value = cleanId;

    // Logic: 09 prefix = Phone. Everything else (10 digits) = National ID.
    if (cleanId.startsWith("09")) {
      loginType.value = "phone";
    } else {
      loginType.value = "national_id";
    }

    console.log(
      `[AuthStore] Data set: ${loginIdentifier.value} as ${loginType.value}`,
    );
  };

  const requestOtp = async () => {
    if (!loginIdentifier.value) return false;
    const id = loginIdentifier.value;

    if (getRemainingTime(id) > 0) return true;

    try {
      isRequesting.value = true;
      // API call using loginIdentifier.value and loginType.value
      // await $fetch('/api/auth/otp/send', { method: 'POST', body: { id, type: loginType.value } });

      if (!sentIdentifiers.value.includes(id)) {
        sentIdentifiers.value.push(id);
      }
      timers.value[id] = Date.now() + 120000;
      return true;
    } catch (error) {
      return false;
    } finally {
      isRequesting.value = false;
    }
  };

  const logout = async () => {
    token.value = null;
    user.value = null;
    loginIdentifier.value = "";
    loginType.value = null;
    router.push("/auth");
  };

  return {
    loginIdentifier,
    loginType,
    token,
    isRequesting,
    isVerifying,
    isLoggedIn,
    setLoginData,
    requestOtp,
    getRemainingTime,
    logout,
    isRegistering,
  };
});
