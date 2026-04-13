import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "#imports";

export const useProfileStore = defineStore("profile", () => {
  const authStore = useAuthStore();
  const isLoading = ref(false);
  const isLoaded = ref(false)
  
  // Data state reflecting backend Georgian values
  const userData = ref({
    name: '',
    lastName: '',
    nationality: 'iranian', // 'iranian' | 'nonIranian'
    nationalId: '',
    gender: '', // 'male' | 'female'
    birthDate: null as Date | null, // Georgian Date from backend
  });

  const loadUserProfile = async () => {
    if(isLoaded.value) return
    isLoading.value = true;
    try {
      console.log('fuck 3')
      // --- SIMULATED API CALL ---
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock Data (Assuming backend sends a valid Georgian Date string)
      userData.value = {
        name: 'امیر',
        lastName: 'صفری',
        nationality: 'iranian',
        nationalId: '1234567890',
        gender: 'male',
        birthDate: new Date('1999-11-25T00:00:00Z'), // Georgian!
      };
      isLoaded.value = true;
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    userData,
    loadUserProfile,
    isLoading,
    isLoaded,
  };
});